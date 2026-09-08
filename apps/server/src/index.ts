import { config } from "dotenv";
import { fileURLToPath as _fileURLToPath } from "url";
import { dirname as _dirname, resolve as _resolve } from "path";
// Load .env from current directory, apps/server/.env, and root .env
config();
config({ path: _resolve(_dirname(_fileURLToPath(import.meta.url)), "../.env") });
config({ path: _resolve(_dirname(_fileURLToPath(import.meta.url)), "../../../.env") });
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import activitiesRouter from "./routes/activities.js";
import galleryRouter from "./routes/gallery.js";
import officersRouter from "./routes/officers.js";
import contactRouter from "./routes/contact.js";
import { authMiddleware } from "./middleware/auth.js";

// ── Startup Validation ─────────────────────────────────────────────────────────
const REQUIRED_ENV = [
  "DATABASE_URL",
  "DATABASE_AUTH_TOKEN",
  "JWT_SECRET",
] as const;

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error("❌ Missing required environment variables:", missing.join(", "));
  process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("⚠️ Cloudinary environment variables missing. Images will be saved to local storage (/uploads).");
}

// ── Cloudinary ─────────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

// Ensure uploads directory exists (local dev only)
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
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Static: serve uploaded files (local dev) ───────────────────────────────────
app.use("/uploads/*", serveStatic({ root: path.resolve(__dirname, "..") }));

// ── Public API Routes ──────────────────────────────────────────────────────────
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

// ── File Upload Endpoint ───────────────────────────────────────────────────────
admin.post("/upload", async (c) => {
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

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${file.type};base64,${base64Data}`;

    // 1. Try Cloudinary upload if credentials are provided
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "paradise_community",
        });
        if (uploadResult && uploadResult.secure_url) {
          return c.json({ url: uploadResult.secure_url });
        }
      } catch (cloudErr: any) {
        console.warn("⚠️ Cloudinary upload failed, falling back to local file storage:", cloudErr?.message || cloudErr);
      }
    }

    // 2. Fallback to local storage (apps/server/uploads)
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
    };
    const ext = mimeToExt[file.type] || (file.name ? path.extname(file.name) : ".jpg") || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, Buffer.from(buffer));
    return c.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

app.route("/api/admin", admin);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/api/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Start Server (Local Dev Only) ──────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = parseInt(process.env.PORT ?? "3001");
  serve({ fetch: app.fetch, port: PORT, hostname: "0.0.0.0" }, (info) => {
    console.log(`🚀 Paradise API running at http://localhost:${info.port}`);
  });
}

export default app;
