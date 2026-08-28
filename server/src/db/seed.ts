import "dotenv/config";
import { db } from "./index.js";
import {
  workspaces,
  workspaceMembers,
  projects,
  projectMembers,
  tasks,
  activity,
} from "./schema.js";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data (in reverse dependency order)
  await db.delete(activity);
  await db.delete(tasks);
  await db.delete(projectMembers);
  await db.delete(projects);
  await db.delete(workspaceMembers);
  await db.delete(workspaces);

  // 1. Create a Workspace
  // ownerUserId mimics a Supabase auth UUID
  const ownerUserId = "auth-user-george-123";
  const [workspace] = await db
    .insert(workspaces)
    .values([
      {
        name: "DevBoard HQ",
        slug: "devboard-hq",
        ownerUserId: ownerUserId,
      },
    ])
    .returning();

  // 2. Create Workspace Members
  const [george, ada, tunde, mide] = await db
    .insert(workspaceMembers)
    .values([
      {
        workspaceId: workspace.id,
        userId: ownerUserId,
        name: "George E.",
        email: "george@devboard.app",
        initials: "GE",
        role: "owner",
        online: true,
      },
      {
        workspaceId: workspace.id,
        userId: "auth-user-ada-456",
        name: "Ada K.",
        email: "ada@devboard.app",
        initials: "AK",
        role: "admin",
        online: true,
      },
      {
        workspaceId: workspace.id,
        userId: "auth-user-tunde-789",
        name: "Tunde N.",
        email: "tunde@devboard.app",
        initials: "TN",
        role: "member",
        online: false,
      },
      {
        workspaceId: workspace.id,
        userId: "auth-user-mide-012",
        name: "Mide O.",
        email: "mide@devboard.app",
        initials: "MO",
        role: "member",
        online: false,
      },
    ])
    .returning();

  // 3. Create Projects
  const [tickrpay, pulse, finsnap, subtrack, devboard] = await db
    .insert(projects)
    .values([
      {
        workspaceId: workspace.id,
        name: "TickrPay",
        description: "Event payment registration & ID-issuing platform",
        emoji: "🎟️",
        status: "In Progress",
        progress: 62,
        due: "Apr 12",
        tags: ["Next.js", "Supabase"],
        createdBy: george.userId,
      },
      {
        workspaceId: workspace.id,
        name: "Pulse",
        description: "Developer activity dashboard with terminal aesthetic",
        emoji: "⚡",
        status: "Planning",
        progress: 24,
        due: "May 01",
        tags: ["Next.js", "GraphQL"],
        createdBy: george.userId,
      },
      {
        workspaceId: workspace.id,
        name: "fin·snap",
        description: "Personal finance tracker with analytics",
        emoji: "💸",
        status: "Review",
        progress: 81,
        due: "Mar 28",
        tags: ["Next.js", "Drizzle"],
        createdBy: ada.userId,
      },
      {
        workspaceId: workspace.id,
        name: "SubTrack",
        description: "Subscription tracker SaaS with AI advisor",
        emoji: "📊",
        status: "Active",
        progress: 95,
        due: "Mar 22",
        tags: ["React", "Tailwind"],
        createdBy: tunde.userId,
      },
      {
        workspaceId: workspace.id,
        name: "DevBoard",
        description: "Fullstack dev collaboration dashboard",
        emoji: "🧩",
        status: "Planning",
        progress: 18,
        due: "Ongoing",
        tags: ["Next.js", "Fastify"],
        createdBy: george.userId,
      },
    ])
    .returning();

  // 4. Create Project Members (Assigning via UUID)
  await db.insert(projectMembers).values([
    { projectId: tickrpay.id, memberId: george.id },
    { projectId: tickrpay.id, memberId: tunde.id },
    { projectId: pulse.id, memberId: george.id },
    { projectId: pulse.id, memberId: ada.id },
    { projectId: finsnap.id, memberId: george.id },
    { projectId: finsnap.id, memberId: mide.id },
    { projectId: subtrack.id, memberId: george.id },
    { projectId: devboard.id, memberId: george.id },
    { projectId: devboard.id, memberId: ada.id },
    { projectId: devboard.id, memberId: tunde.id },
    { projectId: devboard.id, memberId: mide.id },
  ]);

  // 5. Create Tasks
  await db.insert(tasks).values([
    {
      workspaceId: workspace.id,
      projectId: devboard.id,
      createdBy: george.userId,
      assigneeId: george.id,
      title: "Implement Supabase auth middleware",
      status: "In Progress",
      priority: "high",
    },
    {
      workspaceId: workspace.id,
      projectId: devboard.id,
      createdBy: mide.userId,
      assigneeId: ada.id,
      title: "Design settings page layout",
      status: "Todo",
      priority: "mid",
    },
    {
      workspaceId: workspace.id,
      projectId: devboard.id,
      createdBy: george.userId,
      assigneeId: tunde.id,
      title: "Set up Drizzle ORM schema",
      status: "Done",
      priority: "low",
    },
    {
      workspaceId: workspace.id,
      projectId: devboard.id,
      createdBy: ada.userId,
      assigneeId: mide.id,
      title: "Fix mobile sidebar overflow",
      status: "Done",
      priority: "high",
    },
    {
      workspaceId: workspace.id,
      projectId: devboard.id,
      createdBy: tunde.userId,
      assigneeId: george.id,
      title: "Write Playwright E2E for auth flow",
      status: "Todo",
      priority: "mid",
    },
  ]);

  // 6. Create Activity Logs
  await db.insert(activity).values([
    {
      workspaceId: workspace.id,
      userId: george.userId,
      actor: george.name,
      action: "merged PR",
      target: "#24 — feat: add Drizzle ORM schema",
      project: "TickrPay",
      type: "merge",
    },
    {
      workspaceId: workspace.id,
      userId: tunde.userId,
      actor: tunde.name,
      action: "closed task",
      target: "DBD-039",
      project: "DevBoard",
      type: "task",
    },
    {
      workspaceId: workspace.id,
      userId: ada.userId,
      actor: ada.name,
      action: "opened task",
      target: "DBD-040",
      project: "DevBoard",
      type: "task",
    },
    {
      workspaceId: workspace.id,
      userId: mide.userId,
      actor: mide.name,
      action: "updated progress on",
      target: "fin·snap to 81%",
      project: "fin·snap",
      type: "update",
    },
    {
      workspaceId: workspace.id,
      userId: george.userId,
      actor: george.name,
      action: "pushed 3 commits to",
      target: "feat/auth-middleware",
      project: "TickrPay",
      type: "merge",
    },
    {
      workspaceId: workspace.id,
      userId: "system-ci",
      actor: "CI/CD",
      action: "build failed on",
      target: "feat/realtime-updates",
      project: "Pulse",
      type: "ci",
    },
    {
      workspaceId: workspace.id,
      userId: george.userId,
      actor: george.name,
      action: "deployed",
      target: "SubTrack to production",
      project: "SubTrack",
      type: "deploy",
    },
  ]);

  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
