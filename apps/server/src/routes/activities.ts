import { Hono } from "hono";
import { db } from "../db/index.js";
import { activities } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";

const activitiesRouter = new Hono();

// GET /api/activities
activitiesRouter.get("/", async (c) => {
  const rows = await db
    .select()
    .from(activities)
    .orderBy(asc(activities.sortOrder), asc(activities.createdAt));
  return c.json(rows);
});

// POST /api/admin/activities
activitiesRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { name, date, description, imageUrl, sortOrder } = body;

  if (!name || !date) {
    return c.json({ error: "Name and date are required" }, 400);
  }

  const result = await db
    .insert(activities)
    .values({
      name,
      date,
      description: description ?? "",
      imageUrl: imageUrl ?? null,
      sortOrder: sortOrder ?? 0,
    })
    .returning();

  return c.json(result[0], 201);
});

// PUT /api/admin/activities/:id
activitiesRouter.put("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const { name, date, description, imageUrl, sortOrder } = body;

  const existing = (await db
    .select()
    .from(activities)
    .where(eq(activities.id, id)))[0];

  if (!existing) {
    return c.json({ error: "Activity not found" }, 404);
  }

  const updated = await db
    .update(activities)
    .set({
      ...(name !== undefined && { name }),
      ...(date !== undefined && { date }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(sortOrder !== undefined && { sortOrder }),
    })
    .where(eq(activities.id, id))
    .returning();

  return c.json(updated[0]);
});

// DELETE /api/admin/activities/:id
activitiesRouter.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const existing = (await db
    .select()
    .from(activities)
    .where(eq(activities.id, id)))[0];

  if (!existing) {
    return c.json({ error: "Activity not found" }, 404);
  }

  await db.delete(activities).where(eq(activities.id, id));
  return c.json({ success: true });
});

export default activitiesRouter;
