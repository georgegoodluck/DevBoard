import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  doublePrecision,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ──────────────────────────────────────────────
export const workspacePlanEnum = pgEnum("workspace_plan", ["free", "pro"]);
export const workspaceMemberRoleEnum = pgEnum("workspace_member_role", [
  "owner",
  "admin",
  "member",
]);
export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "expired",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "Planning",
  "In Progress",
  "Review",
  "Active",
  "Archived",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "Todo",
  "In Progress",
  "In Review",
  "Done",
]);
export const taskPriorityEnum = pgEnum("task_priority", ["high", "mid", "low"]);
export const activityTypeEnum = pgEnum("activity_type", [
  "merge",
  "task",
  "comment",
  "deploy",
  "ci",
  "update",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "mention",
  "task_assigned",
  "task_updated",
  "comment_added",
  "task_completed",
  "deadline",
  "invite_accepted",
]);
export const sprintStatusEnum = pgEnum("sprint_status", [
  "planned",
  "active",
  "completed",
]);
export const githubRefTypeEnum = pgEnum("github_ref_type", [
  "pr",
  "commit",
  "branch",
]);

// ── Workspaces ─────────────────────────────────────────
export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerUserId: text("owner_user_id").notNull(),
  plan: workspacePlanEnum("plan").notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  initials: text("initials").notNull(),
  role: workspaceMemberRoleEnum("role").notNull().default("member"),
  online: boolean("online").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: workspaceMemberRoleEnum("role").notNull().default("member"),
  status: inviteStatusEnum("status").notNull().default("pending"),
  token: text("token").notNull().unique(),
  invitedBy: text("invited_by").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Projects ───────────────────────────────────────────
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  emoji: text("emoji"),
  status: projectStatusEnum("status").notNull().default("Planning"),
  progress: integer("progress").notNull().default(0),
  due: timestamp("due", { withTimezone: true }),
  tags: text("tags").array().notNull().default([]),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  memberId: uuid("member_id")
    .notNull()
    .references(() => workspaceMembers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Tasks ──────────────────────────────────────────────
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  assigneeId: uuid("assignee_id").references(() => workspaceMembers.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("Todo"),
  priority: taskPriorityEnum("priority").notNull().default("mid"),
  // Fractional position — cheap drag-and-drop reordering, no re-indexing.
  position: doublePrecision("position").notNull().default(0),
  due: timestamp("due", { withTimezone: true }),
  labels: text("labels").array().notNull().default([]),
  // Short id (first 8 hex chars of `id`) used to match GitHub branches/commits
  // back to a task — see lib/github.ts.
  externalRef: text("external_ref"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subtasks = pgTable("subtasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
  position: doublePrecision("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const taskDependencies = pgTable("task_dependencies", {
  id: uuid("id").defaultRandom().primaryKey(),
  blockerId: uuid("blocker_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  blockeeId: uuid("blockee_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const taskComments = pgTable("task_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  authorInitials: text("author_initials").notNull(),
  body: text("body").notNull(),
  editedAt: timestamp("edited_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Notifications & activity ──────────────────────────
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  recipientId: text("recipient_id").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  actorId: text("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const activity = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  project: text("project"),
  type: activityTypeEnum("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Sprints ────────────────────────────────────────────
export const sprints = pgTable("sprints", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  goal: text("goal"),
  status: sprintStatusEnum("status").notNull().default("planned"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sprintTasks = pgTable("sprint_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  sprintId: uuid("sprint_id")
    .notNull()
    .references(() => sprints.id, { onDelete: "cascade" }),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  storyPoints: integer("story_points").notNull().default(0),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── GitHub integration ─────────────────────────────────
export const githubConnections = pgTable("github_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  githubUserId: text("github_user_id").notNull(),
  githubUsername: text("github_username").notNull(),
  // Encrypted at the application layer (lib/crypto.ts) before insert.
  accessToken: text("access_token").notNull(),
  scope: text("scope").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const githubInstallations = pgTable("github_installations", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  installationId: text("installation_id").notNull().unique(),
  accountLogin: text("account_login").notNull(),
  accountType: text("account_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const linkedRepos = pgTable("linked_repos", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  installationId: uuid("installation_id")
    .notNull()
    .references(() => githubInstallations.id, { onDelete: "cascade" }),
  repoId: text("repo_id").notNull(),
  repoName: text("repo_name").notNull(),
  repoFullName: text("repo_full_name").notNull(),
  repoUrl: text("repo_url").notNull(),
  defaultBranch: text("default_branch").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const taskGithubRefs = pgTable("task_github_refs", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  refType: githubRefTypeEnum("ref_type").notNull(),
  refId: text("ref_id").notNull(),
  refTitle: text("ref_title").notNull(),
  refUrl: text("ref_url").notNull(),
  state: text("state").notNull(), // free text: open/closed/merged/success/failure — mirrors GitHub's own values
  author: text("author").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Relations ──────────────────────────────────────────
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  invites: many(invites),
  projects: many(projects),
  tasks: many(tasks),
  notifications: many(notifications),
  activity: many(activity),
  sprints: many(sprints),
  githubConnections: many(githubConnections),
  githubInstallations: many(githubInstallations),
  linkedRepos: many(linkedRepos),
}));
export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    projectMembers: many(projectMembers),
    assignedTasks: many(tasks),
  }),
);
export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  members: many(projectMembers),
  tasks: many(tasks),
  sprints: many(sprints),
}));
export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  member: one(workspaceMembers, {
    fields: [projectMembers.memberId],
    references: [workspaceMembers.id],
  }),
}));
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(workspaceMembers, {
    fields: [tasks.assigneeId],
    references: [workspaceMembers.id],
  }),
  subtasks: many(subtasks),
  comments: many(taskComments),
  githubRefs: many(taskGithubRefs),
  sprintTasks: many(sprintTasks),
  blockedBy: many(taskDependencies, { relationName: "blockee" }),
  blocks: many(taskDependencies, { relationName: "blocker" }),
}));
export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, { fields: [subtasks.taskId], references: [tasks.id] }),
}));
export const taskDependenciesRelations = relations(
  taskDependencies,
  ({ one }) => ({
    blocker: one(tasks, {
      fields: [taskDependencies.blockerId],
      references: [tasks.id],
      relationName: "blocker",
    }),
    blockee: one(tasks, {
      fields: [taskDependencies.blockeeId],
      references: [tasks.id],
      relationName: "blockee",
    }),
  }),
);
export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, { fields: [taskComments.taskId], references: [tasks.id] }),
}));
export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [sprints.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [sprints.projectId],
    references: [projects.id],
  }),
  sprintTasks: many(sprintTasks),
}));
export const sprintTasksRelations = relations(sprintTasks, ({ one }) => ({
  sprint: one(sprints, {
    fields: [sprintTasks.sprintId],
    references: [sprints.id],
  }),
  task: one(tasks, { fields: [sprintTasks.taskId], references: [tasks.id] }),
}));
export const githubInstallationsRelations = relations(
  githubInstallations,
  ({ many }) => ({
    linkedRepos: many(linkedRepos),
  }),
);
export const linkedReposRelations = relations(linkedRepos, ({ one }) => ({
  installation: one(githubInstallations, {
    fields: [linkedRepos.installationId],
    references: [githubInstallations.id],
  }),
}));
export const taskGithubRefsRelations = relations(taskGithubRefs, ({ one }) => ({
  task: one(tasks, { fields: [taskGithubRefs.taskId], references: [tasks.id] }),
}));
