import "dotenv/config";
import { db, client } from "./index.js";
import { admins } from "./schema.js";

async function reset() {
  await db.delete(admins);
  console.log("Admins table cleared");
  client.close();
}

reset().catch(console.error);
