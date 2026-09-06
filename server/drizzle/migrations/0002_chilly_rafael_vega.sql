ALTER TYPE "public"."task_status" ADD VALUE 'In Review' BEFORE 'Done';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "postion" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "labels" text[] DEFAULT '{}' NOT NULL;