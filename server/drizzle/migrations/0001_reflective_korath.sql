CREATE TYPE "public"."invite_status" AS ENUM('pending', 'accepted', 'expired');--> statement-breakpoint
CREATE TYPE "public"."workspace_member_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE "invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "workspace_member_role" DEFAULT 'member' NOT NULL,
	"status" "invite_status" DEFAULT 'pending' NOT NULL,
	"token" text NOT NULL,
	"invited_by" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"initials" text NOT NULL,
	"role" "workspace_member_role" DEFAULT 'member' NOT NULL,
	"online" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"owner_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "members" CASCADE;--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignee_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "member_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "workspace_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "workspace_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "workspace_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "description" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "due" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_member_id_workspace_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."workspace_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_workspace_members_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."workspace_members"("id") ON DELETE set null ON UPDATE no action;