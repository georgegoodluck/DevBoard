-- get_user_workspace_id() resolves auth.uid() to the caller's workspace.
-- Assumes one workspace per user, matching the product spec. RLS is the
-- last line of defence — every API route also filters by workspaceId.

CREATE OR REPLACE FUNCTION get_user_workspace_id()
RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()::text LIMIT 1;
$$;

ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workspaces_select" ON "workspaces" FOR SELECT USING (id = get_user_workspace_id());
CREATE POLICY "workspaces_update" ON "workspaces" FOR UPDATE USING (id = get_user_workspace_id());
CREATE POLICY "workspaces_delete" ON "workspaces" FOR DELETE USING (id = get_user_workspace_id());
-- No INSERT policy: workspace creation goes through the service-role key only.

ALTER TABLE "workspace_members" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workspace_members_all" ON "workspace_members" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "invites" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invites_all" ON "invites" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_all" ON "projects" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "project_members" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project_members_all" ON "project_members" FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE workspace_id = get_user_workspace_id()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE workspace_id = get_user_workspace_id()));

ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_all" ON "tasks" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "subtasks" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subtasks_all" ON "subtasks" FOR ALL
  USING (task_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()))
  WITH CHECK (task_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()));

ALTER TABLE "task_dependencies" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_dependencies_all" ON "task_dependencies" FOR ALL
  USING (blocker_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()))
  WITH CHECK (blocker_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()));

ALTER TABLE "task_comments" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_comments_all" ON "task_comments" FOR ALL
  USING (task_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()))
  WITH CHECK (task_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()));

ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_all" ON "notifications" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "activity" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_all" ON "activity" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "sprints" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sprints_all" ON "sprints" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "sprint_tasks" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sprint_tasks_all" ON "sprint_tasks" FOR ALL
  USING (sprint_id IN (SELECT id FROM sprints WHERE workspace_id = get_user_workspace_id()))
  WITH CHECK (sprint_id IN (SELECT id FROM sprints WHERE workspace_id = get_user_workspace_id()));

ALTER TABLE "github_connections" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "github_connections_all" ON "github_connections" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "github_installations" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "github_installations_all" ON "github_installations" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "linked_repos" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "linked_repos_all" ON "linked_repos" FOR ALL
  USING (workspace_id = get_user_workspace_id()) WITH CHECK (workspace_id = get_user_workspace_id());

ALTER TABLE "task_github_refs" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_github_refs_all" ON "task_github_refs" FOR ALL
  USING (task_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()))
  WITH CHECK (task_id IN (SELECT id FROM tasks WHERE workspace_id = get_user_workspace_id()));
