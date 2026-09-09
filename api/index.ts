import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { v2 as cloudinary } from "cloudinary";
import { handle } from "@hono/node-server/vercel";

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

const api = new Hono();

// ── Middleware ─────────────────────────────────────────────────────────────────
api.use("*", logger());
api.use(
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
api.route("/profile", profileRouter);
api.route("/activities", activitiesRouter);
api.route("/gallery", galleryRouter);
api.route("/officers", officersRouter);
api.route("/contact", contactRouter);
api.route("/auth", authRouter);

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
    console.log("📸 [Upload] Upload request received");
    const formData = await c.req.formData().catch((err) => {
      console.error("❌ [Upload] Failed to parse formData:", err);
      return null;
    });
    if (!formData) return c.json({ error: "Gagal memproses form data." }, 400);

    const file = formData.get("file") as File | null;
    if (!file) {
      console.warn("⚠️ [Upload] No file found in form data");
      return c.json({ error: "Tidak ada file yang diunggah." }, 400);
    }

    console.log(`📸 [Upload] File received: name="${file.name}", type="${file.type}", size=${file.size}`);

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
      "image/heic",
      "image/heif",
      "image/bmp",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/pjpeg",
      "image/jfif",
    ];
    const allowedExtensions = [
      ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".heic", ".heif", ".bmp", ".ico", ".jfif", ".pjpeg"
    ];

    const fileType = file.type ? file.type.toLowerCase() : "";
    const ext = file.name ? file.name.substring(file.name.lastIndexOf(".")).toLowerCase() : "";

    const isImageMime = fileType.startsWith("image/") || allowedMimeTypes.includes(fileType);
    const isImageExt = allowedExtensions.includes(ext);

    if (!isImageMime && !isImageExt) {
      console.warn(`⚠️ [Upload] Invalid file type: type="${file.type}", ext="${ext}"`);
      return c.json({ error: `Tipe file tidak valid (${file.type || ext}). Hanya foto/gambar yang diperbolehkan.` }, 400);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.warn(`⚠️ [Upload] File too large: ${file.size} bytes`);
      return c.json({ error: "Ukuran foto terlalu besar. Maksimal 10MB." }, 400);
    }

    const buffer = await file.arrayBuffer();
    const mime = fileType || "image/jpeg";
    const base64Data = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${mime};base64,${base64Data}`;

    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      console.log("📸 [Upload] Uploading to Cloudinary...");
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "paradise_community",
      });
      console.log("✅ [Upload] Cloudinary upload successful:", result.secure_url);
      return c.json({ url: result.secure_url });
    }

    console.warn("⚠️ [Upload] Cloudinary environment variables missing. Returning Data URI.");
    return c.json({ url: dataURI });
  } catch (error: any) {
    console.error("❌ [Upload] Upload error details:", error);
    return c.json(
      { error: error?.message || "Gagal mengunggah foto" },
      500
    );
  }
});

api.route("/admin", admin);

// ── Health Check ───────────────────────────────────────────────────────────────
api.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Root App: Mount routes at both /api and / for dual Vercel path compatibility ─
const app = new Hono();
app.route("/api", api);
app.route("/", api);

// ── Helper to read raw body stream if req.body is undefined ────────────────────
function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", () => resolve(Buffer.concat(chunks)));
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// ── Custom Vercel Node.js Handler ─────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  try {
    const host = req.headers["host"] || "localhost";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const url = `${protocol}://${host}${req.url}`;

    let body: any = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const contentType = req.headers["content-type"] || "";
      if (contentType.includes("multipart/form-data")) {
        const rawBuffer = await getRawBody(req);
        if (rawBuffer.length > 0) {
          body = rawBuffer;
        }
      } else if (req.body !== undefined && req.body !== null) {
        body =
          typeof req.body === "object" && !(req.body instanceof Buffer)
            ? JSON.stringify(req.body)
            : req.body;
      } else {
        const rawBuffer = await getRawBody(req);
        if (rawBuffer.length > 0) {
          body = rawBuffer;
        }
      }
    }

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value as string);
        }
      }
    }

    const webRequest = new Request(url, {
      method: req.method,
      headers,
      body: body ? body : undefined,
    });

    const webResponse = await app.fetch(webRequest);

    res.statusCode = webResponse.status;
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const arrayBuffer = await webResponse.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error("Vercel Function Error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal Server Error", details: err?.message }));
  }
}
