import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { v2 as cloudinary } from "cloudinary";
import { handle } from "hono/vercel";

import authRouter from "../apps/server/src/routes/auth.js";
import profileRouter from "../apps/server/src/routes/profile.js";
import activitiesRouter from "../apps/server/src/routes/activities.js";
import galleryRouter from "../apps/server/src/routes/gallery.js";
import officersRouter from "../apps/server/src/routes/officers.js";
import contactRouter from "../apps/server/src/routes/contact.js";
import { authMiddleware } from "../apps/server/src/middleware/auth.js";

// ── Cloudinary ─────────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = new Hono().basePath("/api");

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "*";
      return origin;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Public Routes ──────────────────────────────────────────────────────────────
app.route("/profile", profileRouter);
app.route("/activities", activitiesRouter);
app.route("/gallery", galleryRouter);
app.route("/officers", officersRouter);
app.route("/contact", contactRouter);
app.route("/auth", authRouter);

// ── Admin Routes (protected) ───────────────────────────────────────────────────
const admin = new Hono();
admin.use("*", authMiddleware);
admin.route("/profile", profileRouter);
admin.route("/activities", activitiesRouter);
admin.route("/gallery", galleryRouter);
admin.route("/officers", officersRouter);
admin.route("/contact", contactRouter);

// ── File Upload ────────────────────────────────────────────────────────────────
admin.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return c.json({ error: "No file provided" }, 400);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Invalid file type. Only images are allowed." }, 400);
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json({ error: "File too large. Max 5MB." }, 400);
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${file.type};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "paradise_community",
    });

    return c.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

app.route("/admin", admin);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Vercel Handler ─────────────────────────────────────────────────────────────
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
export const PATCH = handle(app);
export default handle(app);
