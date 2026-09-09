import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";

let dbUrl = process.env.DATABASE_URL || "";
let dbAuthToken = process.env.DATABASE_AUTH_TOKEN || "";

// Transform libsql:// to https:// for serverless compatibility (prevents WebSocket connection hangs in Vercel)
if (dbUrl.startsWith("libsql://")) {
  dbUrl = dbUrl.replace("libsql://", "https://");
}

if (!dbUrl || !dbAuthToken) {
  console.error("❌ Missing database credentials: DATABASE_URL or DATABASE_AUTH_TOKEN is not defined in environment variables.");
}

const client = createClient({
  url: dbUrl || "https://invalid-db-url.turso.io",
  authToken: dbAuthToken || "invalid-token",
});

export const db = drizzle(client, { schema });
export { client };

/** Helper to wrap any Promise with a timeout in milliseconds */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number = 5000,
  errorMsg: string = "Database query timed out"
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}
