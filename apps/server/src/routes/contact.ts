import { Hono } from "hono";
import { db } from "../db/index.js";
import { contact } from "../db/schema.js";
import { eq } from "drizzle-orm";

const contactRouter = new Hono();

// GET /api/contact
contactRouter.get("/", async (c) => {
  const row = (await db.select().from(contact))[0];
  if (!row) {
    return c.json({ instagram: null, whatsapp: null, email: null, additional: [] });
  }
  return c.json({
    ...row,
    additional: JSON.parse(row.additional ?? "[]"),
  });
});

// PUT /api/admin/contact
contactRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { instagram, whatsapp, email, additional } = body;

  const existing = (await db.select().from(contact))[0];

  const additionalStr = JSON.stringify(additional ?? []);

  if (!existing) {
    await db.insert(contact)
      .values({
        instagram: instagram ?? null,
        whatsapp: whatsapp ?? null,
        email: email ?? null,
        additional: additionalStr,
      });
  } else {
    await db.update(contact)
      .set({
        ...(instagram !== undefined && { instagram }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(email !== undefined && { email }),
        ...(additional !== undefined && { additional: additionalStr }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(contact.id, existing.id));
  }

  const updated = (await db.select().from(contact))[0];
  return c.json({
    ...updated,
    additional: JSON.parse(updated?.additional ?? "[]"),
  });
});

export default contactRouter;
