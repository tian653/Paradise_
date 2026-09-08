import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

config();
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.env") });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";
import * as schema from "./schema.js";

const dbUrl = process.env.DATABASE_URL;
const dbAuthToken = process.env.DATABASE_AUTH_TOKEN;

if (!dbUrl || !dbAuthToken) {
  console.error("❌ DATABASE_URL or DATABASE_AUTH_TOKEN is missing in environment variables!");
  throw new Error("DATABASE_URL or DATABASE_AUTH_TOKEN is missing in environment variables!");
}

// Convert libsql:// to https:// for HTTP REST transport in Serverless (prevents WebSocket 30s timeout)
const url = dbUrl.startsWith("libsql://")
  ? dbUrl.replace("libsql://", "https://")
  : dbUrl;

const client = createClient({
  url,
  authToken: dbAuthToken,
});

export const db = drizzle(client, { schema });
export { client };
