import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1),
  GITHUB_APP_ID: z.string().optional().default(""),
  GITHUB_APP_PRIVATE_KEY: z.string().optional().default(""),
  GITHUB_WEBHOOK_SECRET: z.string().optional().default(""),
  GITHUB_OAUTH_CLIENT_ID: z.string().optional().default(""),
  GITHUB_OAUTH_CLIENT_SECRET: z.string().optional().default(""),
  // 32-byte hex key (64 hex chars) for AES-256-GCM encryption of GitHub access tokens at rest. Generate with:
  // node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ENCRYPTION_KEY: z
    .string()
    .regex(
      /^[0-9a-f]{64}$/i,
      "ENCRYPTION_KEY must be a 64-char hex string (32 bytes)",
    )
    .optional()
    .default("0".repeat(64)),
  SENTRY_DSN: z.string().optional().default(""),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables — see log above.");
}

export const env = parsed.data;
export type Env = typeof env;

if (env.NODE_ENV === "production" && env.ENCRYPTION_KEY === "0".repeat(64)) {
  throw new Error(
    "ENCRYPTION_KEY is unset in production — refusing to start with a placeholder key.",
  );
}
