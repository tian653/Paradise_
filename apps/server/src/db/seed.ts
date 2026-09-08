import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./index.js";
import { siteSettings, admins } from "./schema.js";

// ─── Admin Credentials ────────────────────────────────────────────────────────
const ADMIN_USERNAME = "dairiparadisehebat";
const ADMIN_PASSWORD = "paradisehebat082233";

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── Site Settings (default scaffold) ───────────────────────────────────────
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      communityName: "Paradise",
      tagline: "",
      shortDescription: "",
      about: "",
      history: "",
      vision: "",
      mission: "",
      logoUrl: null,
      heroImageUrl: null,
    });
    console.log("✅ Site settings initialized (edit via Admin Panel)");
  } else {
    console.log("⏭️  Site settings already exist — skipped");
  }

  // ── Admin Account ──────────────────────────────────────────────────────────
  const existingAdmin = await db.select().from(admins);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  if (existingAdmin.length === 0) {
    await db.insert(admins).values({ username: ADMIN_USERNAME, passwordHash });
    console.log(`✅ Admin created  →  username: "${ADMIN_USERNAME}"`);
  } else {
    await db.update(admins).set({ username: ADMIN_USERNAME, passwordHash });
    console.log(`🔄 Admin updated  →  username: "${ADMIN_USERNAME}"`);
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
