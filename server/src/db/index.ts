import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../env";
import * as schema from "./schema";

// Create the postgres connection
const client = postgres(env.DATABASE_URL, { max: 10 });

// Create the Drizzle instance with our schema
export const db = drizzle(client, { schema });
