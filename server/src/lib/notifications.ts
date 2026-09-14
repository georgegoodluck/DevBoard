import { db } from "../db/index.js";
import { notifications, type notificationTypeEnum } from "../db/schema.js";

type NotificationType = (typeof notificationTypeEnum.enumValues)[number];

interface CreateNotificationParams {
  workspaceId: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  body?: string;
  taskId?: string;
  projectId?: string;
  actorId: string;
  actorName: string;
}

// Real-time delivery (Supabase Realtime) and email fan-out are wired up in
// Phase 7 — for now this persists the row so routes/notifications.ts has
// data to serve.
export async function createNotification(params: CreateNotificationParams) {
  if (params.recipientId === params.actorId) return; // never notify yourself
  try {
    await db.insert(notifications).values({ ...params });
  } catch (err) {
    console.error("Failed to create notification:", err); // side effect, must not fail the caller
  }
}
