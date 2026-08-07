// env.ts
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string, // 👈 Explicit type assertion
  PORT: Number(process.env.PORT) || 3001,
};
