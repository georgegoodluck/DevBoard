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
