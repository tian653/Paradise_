import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env") });
import { db } from "../src/db/index.js";
import { admins } from "../src/db/schema.js";
import bcrypt from "bcryptjs";

async function test() {
  const allAdmins = await db.select().from(admins);
  console.log("Admins in DB:", allAdmins.length);
  if (allAdmins.length > 0) {
    console.log("Username:", allAdmins[0].username);
    const isValid = await bcrypt.compare("paradise2026", allAdmins[0].passwordHash);
    console.log("Is paradise2026 valid?", isValid);
  }
  process.exit(0);
}
test();
