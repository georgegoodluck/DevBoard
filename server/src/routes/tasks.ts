import { FastifyInstance } from "fastify";
import { db } from "../db";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm";