import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums

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

// Workspaces - One per team. Created during onboarding by the first user(owner)

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerUserId: text("owner_user_id").notNull(), // Supabase auth user id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Worskpace Members - Join table between Supabase auth users and workspaces. This is how we know which workspace a user belongs to.

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

// Invites - Owner invites someone by email, they get a link. When they sign up, we match the email to a pending invite

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull(),
  email: text("email").notNull(),
  role: workspaceMemberRoleEnum("role").notNull().default("member"),
  status: inviteStatusEnum("status").notNull().default("pending"),
  token: text("token").notNull().unique(),
  invitedBy: text("invited_by").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Projects - Scoped to a workspace. Only workspace members can see them.

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull().default("📁"),
  status: projectStatusEnum("status").notNull().default("Planning"),
  progress: integer("progress").notNull().default(0),
  due: text("due"),
  tags: text("tags").array().notNull().default([]),
  createdBy: text("created_by").notNull(), // userId
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Members
export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  gradient: text("gradient").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("offline"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project Members (join table)
export const projectMembers = pgTable("project_members", {
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  memberId: uuid("member_id").references(() => members.id, {
    onDelete: "cascade",
  }),
});

// Tasks
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: taskStatusEnum("status").notNull().default("Todo"),
  priority: taskPriorityEnum("priority").notNull().default("mid"),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  assigneeId: uuid("assignee_id").references(() => members.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activity
export const activity = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  project: text("project").notNull(),
  type: activityTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(members, {
    fields: [tasks.assigneeId],
    references: [members.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const membersRelations = relations(members, ({ many }) => ({
  tasks: many(tasks),
  projectMembers: many(projectMembers),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
  projectMembers: many(projectMembers),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  member: one(members, {
    fields: [projectMembers.memberId],
    references: [members.id],
  }),
}));
