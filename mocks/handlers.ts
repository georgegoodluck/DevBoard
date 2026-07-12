import { http, HttpResponse } from "msw";
import { mockProjects } from "@/mocks/data/projects";
import { mockTasks } from "@/mocks/data/tasks";
import { mockActivity } from "@/mocks/data/activity";

export const handlers = [
  http.get("api/projects", () => {
    return HttpResponse.json(mockProjects);
  }),
  http.get("api.tasks", () => {
    return HttpResponse.json(mockTasks);
  }),
  http.post("api/tasks", async ({ request }) => {
    const body = await request.json();
    const newTask = {
      id: `DBD-0${mockTasks.length + 42}`,
      ...(body as object),
    };
  }),
  http.get("api/activity", () => {
    return HttpResponse.json(mockActivity);
  }),
];
