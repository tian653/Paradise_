import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

config();
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.env") });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";

const dbUrl = process.env.DATABASE_URL;
const dbAuthToken = process.env.DATABASE_AUTH_TOKEN;

if (!dbUrl || !dbAuthToken) {
  throw new Error("Missing database credentials: DATABASE_URL or DATABASE_AUTH_TOKEN is not defined.");
}

const client = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

export const db = drizzle(client, { schema });
export { client };
