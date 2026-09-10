import { Hono } from "hono";
import { db } from "../db/index.js";
import { gallery } from "../db/schema.js";
import { eq, asc, desc } from "drizzle-orm";

const galleryRouter = new Hono();

// GET /api/gallery
galleryRouter.get("/", async (c) => {
  const rows = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.sortOrder), asc(gallery.createdAt));
  return c.json(rows);
});

function detectMediaType(url: string, typeInput?: string): "image" | "video" {
  if (typeInput === "video" || typeInput === "image") return typeInput;
  const videoExts = [".mp4", ".webm", ".mov", ".mkv", ".avi", ".ogv", ".3gp", ".m4v"];
  const lowerUrl = (url || "").toLowerCase();
  if (videoExts.some((ext) => lowerUrl.includes(ext)) || lowerUrl.includes("/video/upload/")) {
    return "video";
  }
  return "image";
}

// POST /api/admin/gallery
galleryRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { imageUrl, caption, sortOrder, type } = body;

  if (!imageUrl) {
    return c.json({ error: "imageUrl is required" }, 400);
  }

  const mediaType = detectMediaType(imageUrl, type);

  let finalSortOrder = typeof sortOrder === "number" && sortOrder > 0 ? sortOrder : undefined;
  if (!finalSortOrder) {
    const maxRow = await db
      .select({ sortOrder: gallery.sortOrder })
      .from(gallery)
      .orderBy(desc(gallery.sortOrder))
      .limit(1);
    finalSortOrder = (maxRow[0]?.sortOrder ?? 0) + 1;
  }

  const result = await db
    .insert(gallery)
    .values({
      imageUrl,
      type: mediaType,
      caption: caption ?? null,
      sortOrder: finalSortOrder,
    })
    .returning();

  return c.json(result[0], 201);
});

// PUT /api/admin/gallery/:id
galleryRouter.put("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const { imageUrl, caption, sortOrder, type } = body;

  const existing = (await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, id)))[0];

  if (!existing) {
    return c.json({ error: "Gallery item not found" }, 404);
  }

  const nextUrl = imageUrl !== undefined ? imageUrl : existing.imageUrl;
  const mediaType = type ? detectMediaType(nextUrl, type) : (imageUrl !== undefined ? detectMediaType(nextUrl) : existing.type);

  const updated = await db
    .update(gallery)
    .set({
      ...(imageUrl !== undefined && { imageUrl }),
      ...(mediaType !== undefined && { type: mediaType }),
      ...(caption !== undefined && { caption }),
      ...(sortOrder !== undefined && { sortOrder }),
    })
    .where(eq(gallery.id, id))
    .returning();

  return c.json(updated[0]);
});

// DELETE /api/admin/gallery/:id
galleryRouter.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const existing = (await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, id)))[0];

  if (!existing) {
    return c.json({ error: "Gallery item not found" }, 404);
  }

  await db.delete(gallery).where(eq(gallery.id, id));
  return c.json({ success: true });
});

export default galleryRouter;
