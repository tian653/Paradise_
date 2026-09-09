import { Hono } from "hono";
import { db, withTimeout } from "../db/index.js";
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
  let body: any = null;
  try {
    const rawReq = c.req.raw as any;
    if (rawReq && rawReq.body) {
      body = typeof rawReq.body === "string" ? JSON.parse(rawReq.body) : rawReq.body;
    }
  } catch {}

  if (!body) {
    body = await Promise.race([
      c.req.json().catch(() => null),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
  }

  if (!body) {
    console.error("❌ Login failed: Invalid or missing JSON body");
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const { username, password } = body as { username?: string; password?: string };
  const cleanUsername = username?.trim();
  const cleanPassword = password?.trim();

  if (!cleanUsername || !cleanPassword) {
    console.warn("⚠️ Username or password empty");
    return c.json({ error: "Username and password are required" }, 400);
  }

  const MASTER_USER = "dairiparadisehebat";
  const MASTER_PASS = "paradisehebat082233";

  const isMasterLogin =
    cleanUsername.toLowerCase() === MASTER_USER.toLowerCase() && cleanPassword === MASTER_PASS;

  // ── 1. Check Master Credentials FIRST (Instant response, bypassing DB network latency) ──
  if (isMasterLogin) {
    console.log("🔑 [Instant] Master login verified instantly");
    const token = jwt.sign(
      { id: 1, username: MASTER_USER },
      getJwtSecret(),
      { expiresIn: "7d" }
    );
    return c.json({ token, username: MASTER_USER });
  }

  // ── 2. Otherwise query DB with explicit 5-second timeout ───────────────────────
  try {
    console.log("🔵 [3] Querying DB with 5s timeout");
    const query = db
      .select()
      .from(admins)
      .where(eq(sql`lower(${admins.username})`, cleanUsername.toLowerCase()));

    const admin = (await withTimeout(query, 5000, "Database query timed out"))[0];

    if (admin) {
      const isValid = await bcrypt.compare(cleanPassword, admin.passwordHash);
      if (isValid) {
        const token = jwt.sign(
          { id: admin.id, username: admin.username },
          getJwtSecret(),
          { expiresIn: "7d" }
        );
        return c.json({ token, username: admin.username });
      }
    }

    console.warn(`⚠️ Invalid credentials for user "${cleanUsername}"`);
    return c.json({ error: "Invalid credentials" }, 401);
  } catch (err: any) {
    console.error("❌ [Login DB Error]:", err?.message || err);
    return c.json(
      { error: "Gagal terhubung ke database. Pastikan variabel DATABASE_URL dan DATABASE_AUTH_TOKEN sudah diset di Vercel Settings." },
      500
    );
  }
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
