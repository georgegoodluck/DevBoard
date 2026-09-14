import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { githubConnections, githubInstallations, linkedRepos, tasks, taskGithubRefs } from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";
import { encrypt } from "../lib/crypto.js";
import {
  exchangeOAuthCode, getGithubUser, listInstallationRepos,
  createBranchFromDefault, verifyWebhookSignature, extractExternalRef,
} from "../lib/github.js";

const connectSchema = z.object({ code: z.string().min(1) });

const githubRoutes: FastifyPluginAsync = async (fastify) => {
  // The webhook receiver needs the raw request body (to verify GitHub's
  // HMAC signature) before JSON parsing happens. This content-type parser
  // is registered inside this plugin's own encapsulation scope, so it only
  // affects routes defined in this file — every other route in the app
  // keeps Fastify's default JSON parsing.
  fastify.addContentTypeParser("application/json", { parseAs: "buffer" }, (req, body, done) => {
    req.rawBody = body as Buffer;
    try {
      done(null, body.length ? JSON.parse(body.toString("utf8")) : {});
    } catch (err) {
      done(err as Error, undefined);
    }
  });

  // POST /api/github/webhook — no auth, no requireWorkspace: GitHub calls
  // this directly. Trust is established entirely via HMAC signature.
  fastify.post("/api/github/webhook", async (request, reply) => {
    const signature = request.headers["x-hub-signature-256"] as string | undefined;
    if (!verifyWebhookSignature(request.rawBody!, signature)) {
      return reply.code(401).send({ error: "Invalid webhook signature" });
    }

    const event = request.headers["x-github-event"] as string;
    const payload = request.body as any;

    if (event === "push") {
      for (const commit of payload.commits ?? []) {
        const ref = extractExternalRef(commit.message);
        if (!ref) continue;
        const [task] = await db.select().from(tasks).where(eq(tasks.externalRef, ref)).limit(1);
        if (!task) continue;
        await db.insert(taskGithubRefs).values({
          taskId: task.id, refType: "commit", refId: commit.id, refTitle: commit.message,
          refUrl: commit.url, state: "pushed", author: commit.author?.name ?? "unknown",
        });
      }
    }

    if (event === "pull_request") {
      const ref = extractExternalRef(payload.pull_request?.head?.ref ?? "");
      if (ref) {
        const [task] = await db.select().from(tasks).where(eq(tasks.externalRef, ref)).limit(1);
        if (task) {
          await db.insert(taskGithubRefs).values({
            taskId: task.id, refType: "pr", refId: String(payload.pull_request.number),
            refTitle: payload.pull_request.title, refUrl: payload.pull_request.html_url,
            state: payload.pull_request.merged ? "merged" : payload.pull_request.state,
            author: payload.pull_request.user?.login ?? "unknown",
          });
        }
      }
    }

    if (event === "check_run") {
      const ref = extractExternalRef(payload.check_run?.head_sha ?? "");
      if (ref) {
        const [task] = await db.select().from(tasks).where(eq(tasks.externalRef, ref)).limit(1);
        if (task) {
          await db.insert(taskGithubRefs).values({
            taskId: task.id, refType: "commit", refId: payload.check_run.id.toString(),
            refTitle: payload.check_run.name, refUrl: payload.check_run.html_url,
            state: payload.check_run.conclusion ?? payload.check_run.status,
            author: payload.check_run.app?.name ?? "CI",
          });
        }
      }
    }

    return reply.code(200).send({ ok: true });
  });

  // Everything below is authenticated + workspace-scoped.
  fastify.register(async (scoped) => {
    scoped.addHook("preHandler", fastify.authenticate);
    scoped.addHook("preHandler", requireWorkspace);

    // POST /api/github/connect — OAuth App flow: frontend redirects the
    // user to GitHub, GitHub redirects back with a `code`, frontend posts
    // that code here to complete the connection.
    scoped.post("/api/github/connect", async (request, reply) => {
      const parsed = connectSchema.safeParse(request.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const { access_token, scope } = await exchangeOAuthCode(parsed.data.code);
      const githubUser = await getGithubUser(access_token);

      const [connection] = await db.insert(githubConnections).values({
        workspaceId: request.workspaceId!,
        userId: request.user!.id,
        githubUserId: String(githubUser.id),
        githubUsername: githubUser.login,
        accessToken: encrypt(access_token),
        scope,
      }).returning({ id: githubConnections.id, githubUsername: githubConnections.githubUsername });

      return reply.code(201).send({ connection });
    });

    // GET /api/github/repos — repos visible to any installation of our
    // GitHub App on this workspace (installations are added via GitHub's
    // own "Install App" flow, then registered through the webhook's
    // installation event — not modeled as a route here since GitHub drives
    // that step, not our frontend).
    scoped.get("/api/github/repos", async (request, reply) => {
      const installations = await db.select().from(githubInstallations)
        .where(eq(githubInstallations.workspaceId, request.workspaceId!));

      const allRepos = [];
      for (const installation of installations) {
        const { repositories } = await listInstallationRepos(installation.installationId);
        allRepos.push(...repositories);
      }
      return reply.send({ repos: allRepos });
    });

    // POST /api/github/tasks/:id/branch — create a branch named after the
    // task, off the linked repo's default branch.
    scoped.post<{ Params: { id: string }; Body: { linkedRepoId: string } }>(
      "/api/github/tasks/:id/branch",
      async (request, reply) => {
        const [task] = await db.select().from(tasks)
          .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
        if (!task) return reply.code(404).send({ error: "Task not found" });

        const [repo] = await db.select().from(linkedRepos)
          .where(and(eq(linkedRepos.id, request.body.linkedRepoId), eq(linkedRepos.workspaceId, request.workspaceId!))).limit(1);
        if (!repo) return reply.code(404).send({ error: "Linked repo not found" });

        const [installation] = await db.select().from(githubInstallations)
          .where(eq(githubInstallations.id, repo.installationId)).limit(1);
        if (!installation) return reply.code(404).send({ error: "GitHub installation not found" });

        const slug = task.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
        const branchName = `task/${task.externalRef}-${slug}`;

        const branch = await createBranchFromDefault(
          installation.installationId, repo.repoFullName, repo.defaultBranch, branchName,
        );

        return reply.code(201).send({ branch });
      },
    );
  });
};

export default githubRoutes;
