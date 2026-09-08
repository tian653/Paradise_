import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

config();
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.env") });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema.js";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export { client };
