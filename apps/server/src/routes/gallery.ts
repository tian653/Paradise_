import { Hono } from "hono";
import { db } from "../db/index.js";
import { gallery } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

const galleryRouter = new Hono();

// GET /api/gallery
galleryRouter.get("/", async (c) => {
  const rows = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.sortOrder), asc(gallery.createdAt));
  return c.json(rows);
});

// POST /api/admin/gallery
galleryRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { imageUrl, caption, sortOrder } = body;

  if (!imageUrl) {
    return c.json({ error: "imageUrl is required" }, 400);
  }

  const result = await db
    .insert(gallery)
    .values({
      imageUrl,
      caption: caption ?? null,
      sortOrder: sortOrder ?? 0,
    })
    .returning();

  return c.json(result[0], 201);
});

// PUT /api/admin/gallery/:id
galleryRouter.put("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const { imageUrl, caption, sortOrder } = body;

  const existing = (await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, id)))[0];

  if (!existing) {
    return c.json({ error: "Gallery item not found" }, 404);
  }

  const updated = await db
    .update(gallery)
    .set({
      ...(imageUrl !== undefined && { imageUrl }),
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
