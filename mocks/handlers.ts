import { http, HttpResponse } from "msw";
import { mockProjects } from "./data/projects";
import { mockTasks } from "./data/tasks";
import { mockActivity } from "./data/activity";

export const handlers = [
  http.get("/api/projects", () => {
    return HttpResponse.json(mockProjects);
  }),

  http.get("/api/tasks", () => {
    return HttpResponse.json(mockTasks);
  }),

  http.post("/api/tasks", async ({ request }) => {
    const body = await request.json();
    const newTask = {
      id: `DBD-0${mockTasks.length + 42}`,
      ...(body as object),
    };
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.get("/api/activity", () => {
    return HttpResponse.json(mockActivity);
  }),
];
