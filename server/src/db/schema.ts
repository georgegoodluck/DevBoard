import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

// ─── Enums ─────

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

// ─── Workspaces ─────
// One per team. Created during onboarding by the first user (owner).

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // e.g. "acme-corp"
  ownerUserId: text("owner_user_id").notNull(), // Supabase auth user id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Workspace Members ─────
// Join table between Supabase auth users and workspaces.
// This is how we know which workspace a user belongs to.

export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").notNull(), // Supabase auth user id
  name: text("name").notNull(),
  email: text("email").notNull(),
  initials: text("initials").notNull(),
  role: workspaceMemberRoleEnum("role").notNull().default("member"),
  online: boolean("online").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Invites ─────
// Owner invites someone by email. They get a link.
// When they sign up, we match their email to a pending invite.

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull(),
  role: workspaceMemberRoleEnum("role").notNull().default("member"),
  status: inviteStatusEnum("status").notNull().default("pending"),
  token: text("token").notNull().unique(), // random token in the invite link
  invitedBy: text("invited_by").notNull(), // userId of who sent the invite
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Projects ─────
// Scoped to a workspace. Only workspace members can see them.

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  emoji: text("emoji").notNull().default("📁"),
  status: projectStatusEnum("status").notNull().default("Planning"),
  progress: integer("progress").notNull().default(0),
  due: text("due"),
  tags: text("tags").array().notNull().default([]),
  createdBy: text("created_by").notNull(), // userId
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Project Members ─────
// Which workspace members are on which project.

export const projectMembers = pgTable("project_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  memberId: uuid("member_id")
    .references(() => workspaceMembers.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Tasks ─────
// Scoped to a project (which is scoped to a workspace).
// workspace_id is denormalized here for faster queries.

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  assigneeId: uuid("assignee_id").references(() => workspaceMembers.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description").default(""),
  status: taskStatusEnum("status").notNull().default("Todo"),
  priority: taskPriorityEnum("priority").notNull().default("mid"),
  position: integer("postion").notNull().default(0), // order within the column
  due: text("due"),
  labels: text("labels").array().notNull().default([]),
  createdBy: text("created_by").notNull(), // userId
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Activity ─────
// Workspace-scoped event log.

export const activity = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").notNull(),
  actor: text("actor").notNull(), // display name
  action: text("action").notNull(),
  target: text("target").notNull(),
  project: text("project").notNull(),
  type: activityTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
