import type { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../routes/auth.js";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
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
    c.set("admin", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};
