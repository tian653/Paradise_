import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

config();
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.env") });

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
  url: dbUrl || "https://placeholder-db.turso.io",
  authToken: dbAuthToken || "placeholder-token",
});

export const db = drizzle(client, { schema });
export { client };
