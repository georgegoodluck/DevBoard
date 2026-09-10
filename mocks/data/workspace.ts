export const mockMembers = [
  { id: "m1", workspaceId: "w1", userId: "u1", name: "Ada Lovelace", email: "ada@devboard.app", initials: "AL", role: "owner" as const, online: true },
  { id: "m2", workspaceId: "w1", userId: "u2", name: "Grace Hopper", email: "grace@devboard.app", initials: "GH", role: "admin" as const, online: false },
];

export const mockWorkspace = { id: "w1", name: "Acme Team", slug: "acme", plan: "free" as const };
