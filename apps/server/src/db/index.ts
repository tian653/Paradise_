import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

config();
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.env") });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";
import * as schema from "./schema.js";

const dbUrl =
  process.env.DATABASE_URL ||
  "https://paradise-cristian21.aws-eu-west-1.turso.io";
const dbAuthToken =
  process.env.DATABASE_AUTH_TOKEN ||
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODg4NzcwMzksImlkIjoiMDFhMDgxNjEtMmEwMS03Yzc5LWFkMzAtMDUzMGEyYjUyY2FkIiwia2lkIjoiZ3NhbGF2ak5za2paSkxiN2hvYUdNbE9VVTV4WXo0Zm5CR1dQVGtOQXNBdyIsInJpZCI6ImY4MmIwZjQzLWFlYzEtNDdjZi05N2YyLWIwYmE3ZTdlMzY5NCJ9.yYPrEnJzAtWv_OAQRixyZfYI-YjOi7enpFmv8k-YzKd9hdYq5Oct-bLSKs2l0mud8WfYUDXOgQ_8VGx8y5PKCw";

const url = dbUrl.startsWith("libsql://")
  ? dbUrl.replace("libsql://", "https://")
  : dbUrl;

const client = createClient({
  url,
  authToken: dbAuthToken,
});

export const db = drizzle(client, { schema });
export { client };
