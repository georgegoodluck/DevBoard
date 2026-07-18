import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

// Enums
export const projectStatusEnum = pgEnum("project_statis", [
  "Planning",
  "In Progress",
  "Review",
  "Active",
  "Archived",
]);
