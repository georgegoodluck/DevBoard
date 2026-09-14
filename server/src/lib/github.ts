import { createHmac, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../env.js";

const GITHUB_API = "https://api.github.com";

// ── App-level JWT (proves we are the GitHub App, not a specific installation) ──
function signAppJwt(): string {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    { iat: now - 60, exp: now + 9 * 60, iss: env.GITHUB_APP_ID },
    env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
    { algorithm: "RS256" },
  );
}

// ── Installation access token (scoped to one org/repo installation) ──
export async function getInstallationToken(
  installationId: string,
): Promise<string> {
  const res = await fetch(
    `${GITHUB_API}/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${signAppJwt()}`,
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (!res.ok)
    throw new Error(`Failed to get installation token: ${res.status}`);
  const data = (await res.json()) as { token: string };
  return data.token;
}

export async function listInstallationRepos(installationId: string) {
  const token = await getInstallationToken(installationId);
  const res = await fetch(`${GITHUB_API}/installation/repositories`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`Failed to list repos: ${res.status}`);
  return (await res.json()) as { repositories: unknown[] };
}

export async function createBranchFromDefault(
  installationId: string,
  repoFullName: string,
  defaultBranch: string,
  newBranchName: string,
) {
  const token = await getInstallationToken(installationId);
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  const refRes = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/git/ref/heads/${defaultBranch}`,
    { headers },
  );
  if (!refRes.ok)
    throw new Error(`Failed to read default branch ref: ${refRes.status}`);
  const refData = (await refRes.json()) as { object: { sha: string } };

  const createRes = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/git/refs`,
    {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        ref: `refs/heads/${newBranchName}`,
        sha: refData.object.sha,
      }),
    },
  );
  if (!createRes.ok)
    throw new Error(`Failed to create branch: ${createRes.status}`);
  return (await createRes.json()) as { ref: string; url: string };
}

// ── OAuth App flow (user connecting their personal GitHub account) ──
export async function exchangeOAuthCode(code: string) {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
    }),
  });
  if (!res.ok) throw new Error(`OAuth code exchange failed: ${res.status}`);
  return (await res.json()) as { access_token: string; scope: string };
}

export async function getGithubUser(accessToken: string) {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch GitHub user: ${res.status}`);
  return (await res.json()) as { id: number; login: string };
}

// ── Webhook signature verification ──
export function verifyWebhookSignature(
  payload: Buffer,
  signatureHeader: string | undefined,
): boolean {
  if (!signatureHeader) return false;
  const expected =
    "sha256=" +
    createHmac("sha256", env.GITHUB_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ── Matching a branch name or commit message back to a task ──
// Tasks get an 8-hex-char externalRef at creation (see routes/tasks.ts).
// Branches/commits referencing a task are expected to contain that ref,
// e.g. "task/a1b2c3d4-add-login" or a commit message "fixes a1b2c3d4".
export function extractExternalRef(text: string): string | null {
  const match = text.match(/\b([0-9a-f]{8})\b/i);
  return match ? match[1].toLowerCase() : null;
}
