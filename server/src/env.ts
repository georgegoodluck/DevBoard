import "dotenv/config";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: Number(process.env.PORT) || 3001,
};

// Validate at startup - fail fast if something is missing
if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
