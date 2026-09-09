import { Hono } from "hono";
import { db } from "../db/index.js";
import { admins } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ── JWT Secret (required) ──────────────────────────────────────────────────────
// Must be set as JWT_SECRET env var. No fallback in production.
export const getJwtSecret = () =>
  process.env.JWT_SECRET || "paradise_jwt_secret_key_change_in_production";

const authRouter = new Hono();

// POST /api/auth/login
authRouter.post("/login", async (c) => {
  console.log("🔵 [1] Login handler started");

  const body = await c.req.json().catch(() => null);
  if (!body) {
    console.error("❌ Login failed: Invalid JSON body");
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  console.log("🔵 [2] Body parsed");

  const { username, password } = body as { username?: string; password?: string };
  const cleanUsername = username?.trim();
  const cleanPassword = password?.trim();

  if (!cleanUsername || !cleanPassword) {
    console.warn("⚠️ Username or password empty");
    return c.json({ error: "Username and password are required" }, 400);
  }
  console.log("🔵 [3] Before DB query");

  const admin = (
    await db
      .select()
      .from(admins)
      .where(eq(sql`lower(${admins.username})`, cleanUsername.toLowerCase()))
  )[0];

  if (!admin) {
    console.warn(`⚠️ User "${cleanUsername}" not found`);
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isValid = await bcrypt.compare(cleanPassword, admin.passwordHash);

  if (!isValid) {
    console.warn(`⚠️ Invalid password for user "${cleanUsername}"`);
    return c.json({ error: "Invalid credentials" }, 401);
  }

  console.log("🔵 [7] Before jwt.sign");
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
  console.log("🔵 [8] After jwt.sign — success");

  return c.json({ token, username: admin.username });
});

// GET /api/auth/me — validate token & return current user
authRouter.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, getJwtSecret()) as {
      id: number;
      username: string;
    };
    return c.json({ id: payload.id, username: payload.username });
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});

// POST /api/auth/logout (client clears token)
authRouter.post("/logout", (c) => {
  return c.json({ success: true });
});

export default authRouter;
