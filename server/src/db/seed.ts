import "dotenv/config";
import { db } from "./index.js";
import { projects, members, tasks, activity, projectMembers } from "./schema.js";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(activity);
  await db.delete(tasks);
  await db.delete(projectMembers);
  await db.delete(members);
  await db.delete(projects);

  // Members
  const [george, ada, tunde, mide] = await db
    .insert(members)
    .values([
      {
        name: "George E.",
        initials: "GE",
        gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
        role: "Lead / Fullstack",
        status: "online",
        email: "george@devboard.app",
      },
      {
        name: "Ada K.",
        initials: "AK",
        gradient: "linear-gradient(135deg,#f59e0b,#f87171)",
        role: "Frontend",
        status: "online",
        email: "ada@devboard.app",
      },
      {
        name: "Tunde N.",
        initials: "TN",
        gradient: "linear-gradient(135deg,#2dd4a0,#4f8eff)",
        role: "Backend",
        status: "away",
        email: "tunde@devboard.app",
      },
      {
        name: "Mide O.",
        initials: "MO",
        gradient: "linear-gradient(135deg,#a78bfa,#f87171)",
        role: "Design",
        status: "offline",
        email: "mide@devboard.app",
      },
    ])
    .returning();

  // Projects
  const [tickrpay, pulse, finsnap, subtrack, devboard] = await db
    .insert(projects)
    .values([
      {
        name: "TickrPay",
        description: "Event payment registration & ID-issuing platform",
        emoji: "🎟️",
        status: "In Progress",
        progress: 62,
        due: "Apr 12",
        tags: ["Next.js", "Supabase"],
      },
      {
        name: "Pulse",
        description: "Developer activity dashboard with terminal aesthetic",
        emoji: "⚡",
        status: "Planning",
        progress: 24,
        due: "May 01",
        tags: ["Next.js", "GraphQL"],
      },
      {
        name: "fin·snap",
        description: "Personal finance tracker with analytics",
        emoji: "💸",
        status: "Review",
        progress: 81,
        due: "Mar 28",
        tags: ["Next.js", "Drizzle"],
      },
      {
        name: "SubTrack",
        description: "Subscription tracker SaaS with AI advisor",
        emoji: "📊",
        status: "Active",
        progress: 95,
        due: "Mar 22",
        tags: ["React", "Tailwind"],
      },
      {
        name: "DevBoard",
        description: "Fullstack dev collaboration dashboard",
        emoji: "🧩",
        status: "Planning",
        progress: 18,
        due: "Ongoing",
        tags: ["Next.js", "Fastify"],
      },
    ])
    .returning();

  // Project members
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

  // Tasks
  await db.insert(tasks).values([
    {
      id: "DBD-041",
      title: "Implement Supabase auth middleware",
      status: "In Progress",
      priority: "high",
      projectId: devboard.id,
      assigneeId: george.id,
    },
    {
      id: "DBD-040",
      title: "Design settings page layout",
      status: "Todo",
      priority: "mid",
      projectId: devboard.id,
      assigneeId: ada.id,
    },
    {
      id: "DBD-039",
      title: "Set up Drizzle ORM schema",
      status: "Done",
      priority: "low",
      projectId: devboard.id,
      assigneeId: tunde.id,
    },
    {
      id: "DBD-038",
      title: "Fix mobile sidebar overflow",
      status: "Done",
      priority: "high",
      projectId: devboard.id,
      assigneeId: mide.id,
    },
    {
      id: "DBD-037",
      title: "Write Playwright E2E for auth flow",
      status: "Todo",
      priority: "mid",
      projectId: devboard.id,
      assigneeId: george.id,
    },
  ]);

  // Activity
  await db.insert(activity).values([
    {
      actor: "George E.",
      action: "merged PR",
      target: "#24 — feat: add Drizzle ORM schema",
      project: "TickrPay",
      type: "merge",
    },
    {
      actor: "Tunde N.",
      action: "closed task",
      target: "DBD-039",
      project: "DevBoard",
      type: "task",
    },
    {
      actor: "Ada K.",
      action: "opened task",
      target: "DBD-040",
      project: "DevBoard",
      type: "task",
    },
    {
      actor: "Mide O.",
      action: "updated progress on",
      target: "fin·snap to 81%",
      project: "fin·snap",
      type: "update",
    },
    {
      actor: "George E.",
      action: "pushed 3 commits to",
      target: "feat/auth-middleware",
      project: "TickrPay",
      type: "merge",
    },
    {
      actor: "CI/CD",
      action: "build failed on",
      target: "feat/realtime-updates",
      project: "Pulse",
      type: "ci",
    },
    {
      actor: "George E.",
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
