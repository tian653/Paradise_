import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dtmndf3jh",
  api_key: process.env.CLOUDINARY_API_KEY || "963745579255325",
  api_secret: process.env.CLOUDINARY_API_SECRET || "foEJMtXxNd4kEU1TFWnGi1aXMrw",
});

import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import activitiesRouter from "./routes/activities.js";
import galleryRouter from "./routes/gallery.js";
import officersRouter from "./routes/officers.js";
import contactRouter from "./routes/contact.js";
import { authMiddleware } from "./middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

// Ensure uploads directory exists (only in local development)
if (process.env.NODE_ENV !== "production") {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

const app = new Hono();

// ── Global Middleware ──────────────────────────────────────────────────────────
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ];
      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Static: serve uploaded files ───────────────────────────────────────────────
app.use("/uploads/*", serveStatic({ root: path.resolve(__dirname, "..") }));

// ── Public API Routes (no auth) ────────────────────────────────────────────────
app.route("/api/profile", profileRouter);
app.route("/api/activities", activitiesRouter);
app.route("/api/gallery", galleryRouter);
app.route("/api/officers", officersRouter);
app.route("/api/contact", contactRouter);

// ── Auth Routes ────────────────────────────────────────────────────────────────
app.route("/api/auth", authRouter);

// ── Admin API Routes (protected) ───────────────────────────────────────────────
const admin = new Hono();
admin.use("*", authMiddleware);
admin.route("/profile", profileRouter);
admin.route("/activities", activitiesRouter);
admin.route("/gallery", galleryRouter);
admin.route("/officers", officersRouter);
admin.route("/contact", contactRouter);

app.route("/api/admin", admin);

// ── File Upload Endpoint ───────────────────────────────────────────────────────
app.post("/api/admin/upload", authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Invalid file type. Only images are allowed." }, 400);
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json({ error: "File too large. Max 5MB." }, 400);
    }

    // Convert file to Base64 for Cloudinary
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${file.type};base64,${base64Data}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "paradise_community",
    });

    return c.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// ── Start Server (Local Dev Only) ──────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = parseInt(process.env.PORT ?? "3001");
  serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`🚀 Paradise API running at http://localhost:${info.port}`);
  });
}

export default app;
