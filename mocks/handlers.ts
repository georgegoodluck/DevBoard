import { http, HttpResponse } from "msw";
import { mockMembers, mockWorkspace } from "./data/workspace";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const handlers = [
  http.get(`${API_URL}/api/workspaces/me`, () =>
    HttpResponse.json({ workspace: mockWorkspace, members: mockMembers, role: "owner" }),
  ),
  http.get(`${API_URL}/api/projects`, () => HttpResponse.json({ projects: [] })),
  http.get(`${API_URL}/api/activity`, () => HttpResponse.json({ activity: [] })),
  http.get(`${API_URL}/api/notifications`, () => HttpResponse.json({ notifications: [] })),
];
