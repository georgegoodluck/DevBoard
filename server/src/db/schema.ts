import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

// Enums - restricts values to a predefined set that's enforced at the database level

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

// Projects

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  status: projectStatusEnum("status").notNull().default("Planning"),
  due: text("string"),
  tags: text("tags").array().notNull().default([]),
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

// Project Members(join table)

export const ProjectMembers = pgTable("project_members", {
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  memberId: uuid("member_id").references(() => members.id, {
    onDelete: "cascade",
  }),
});

// Tasks

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  status: taskStatusEnum("status").notNull().default("Todo"),
  priority: taskPriorityEnum("priority").notNull().default("mid"),
  // When a project is deleted, all the tasks assigned to the projects are deleted
  projectId: uuid("project_id")
    .references(() => projects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  assigneeId: uuid("assignee_id").references(() => members.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity

export const activity = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Who did it?
  actor: text("actor").notNull(),
  // What did they do?
  action: text("action").notNull(),
  // What did they interact with?
  target: text("target").notNull(),
  // Where did it happen?
  project: text("project").notNull(),
  time: timestamp("created_at").defaultNow().notNull(),
  type: activityTypeEnum("type").notNull(),
});
