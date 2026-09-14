import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../env.js";
import * as schema from "./schema.js";

// Create a database client using the DATABASE_URL from environment variables. The client is configured with connection pooling options.
const queryClient = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});
// Wrap the query client with Drizzle
export const db = drizzle(queryClient, { schema });

// Export the database client and schema for use in other parts of the application.
export type Database = typeof db;
