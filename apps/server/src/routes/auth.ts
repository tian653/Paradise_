import { Hono } from "hono";
import { db } from "../db/index.js";
import { admins } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRouter = new Hono();

const JWT_SECRET = process.env.JWT_SECRET ?? "paradise-secret-2026-change-in-production";

// POST /api/auth/login
authRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const { username, password } = body;

  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }

  const admin = (await db
    .select()
    .from(admins)
    .where(eq(admins.username, username)))[0];

  if (!admin) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return c.json({ token, username: admin.username });
});

// POST /api/auth/logout (client-side token removal)
authRouter.post("/logout", (c) => {
  return c.json({ success: true });
});

export { JWT_SECRET };
export default authRouter;
