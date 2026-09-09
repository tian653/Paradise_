import { Hono } from "hono";
import { db } from "../db/index.js";
import { officers } from "../db/schema.js";
import { eq, asc, desc } from "drizzle-orm";

const officersRouter = new Hono();

// GET /api/officers
officersRouter.get("/", async (c) => {
  const rows = await db
    .select()
    .from(officers)
    .orderBy(asc(officers.sortOrder), asc(officers.createdAt));
  return c.json(rows);
});

// POST /api/admin/officers
officersRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { name, position, photoUrl, sortOrder } = body;

  if (!name || !position) {
    return c.json({ error: "Name and position are required" }, 400);
  }

  let finalSortOrder = typeof sortOrder === "number" && sortOrder > 0 ? sortOrder : undefined;
  if (!finalSortOrder) {
    const maxRow = await db
      .select({ sortOrder: officers.sortOrder })
      .from(officers)
      .orderBy(desc(officers.sortOrder))
      .limit(1);
    finalSortOrder = (maxRow[0]?.sortOrder ?? 0) + 1;
  }

  const result = await db
    .insert(officers)
    .values({
      name,
      position,
      photoUrl: photoUrl ?? null,
      sortOrder: finalSortOrder,
    })
    .returning();

  return c.json(result[0], 201);
});

// PUT /api/admin/officers/:id
officersRouter.put("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const { name, position, photoUrl, sortOrder } = body;

  const existing = (await db
    .select()
    .from(officers)
    .where(eq(officers.id, id)))[0];

  if (!existing) {
    return c.json({ error: "Officer not found" }, 404);
  }

  const updated = await db
    .update(officers)
    .set({
      ...(name !== undefined && { name }),
      ...(position !== undefined && { position }),
      ...(photoUrl !== undefined && { photoUrl }),
      ...(sortOrder !== undefined && { sortOrder }),
    })
    .where(eq(officers.id, id))
    .returning();

  return c.json(updated[0]);
});

// DELETE /api/admin/officers/:id
officersRouter.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const existing = (await db
    .select()
    .from(officers)
    .where(eq(officers.id, id)))[0];

  if (!existing) {
    return c.json({ error: "Officer not found" }, 404);
  }

  await db.delete(officers).where(eq(officers.id, id));
  return c.json({ success: true });
});

export default officersRouter;
