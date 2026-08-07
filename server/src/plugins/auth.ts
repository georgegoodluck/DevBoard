import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createClient } from "@supabase/supabase-js";

// Creates a Supabase admin client using the Service Role Key (bypasses Row Level Security)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Authentication function
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Extracts token from the Header
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return reply.status(401).send({ error: "Missing authorization header" });
  }
  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }
}
