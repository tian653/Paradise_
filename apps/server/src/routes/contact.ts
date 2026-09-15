import { Hono } from "hono";
import { db } from "../db/index.js";
import { contact } from "../db/schema.js";
import { eq } from "drizzle-orm";

const contactRouter = new Hono();
const contactAdminRouter = new Hono();

// GET /api/contact  (public)
contactRouter.get("/", async (c) => {
  const row = (await db.select().from(contact))[0];
  if (!row) {
    return c.json({ id: 0, instagram: null, whatsapp: null, email: null, address: null, additional: [], updatedAt: "" });
  }
  return c.json({
    ...row,
    additional: JSON.parse(row.additional ?? "[]"),
  });
});

// GET /api/admin/contact  (protected)
contactAdminRouter.get("/", async (c) => {
  const row = (await db.select().from(contact))[0];
  if (!row) {
    return c.json({ id: 0, instagram: null, whatsapp: null, email: null, address: null, additional: [], updatedAt: "" });
  }
  return c.json({
    ...row,
    additional: JSON.parse(row.additional ?? "[]"),
  });
});

// PUT /api/admin/contact  (protected)
contactAdminRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { instagram, whatsapp, email, address, additional } = body;

  const existing = (await db.select().from(contact))[0];

  const additionalStr = JSON.stringify(additional ?? []);

  if (!existing) {
    await db.insert(contact)
      .values({
        instagram: instagram || null,
        whatsapp: whatsapp || null,
        email: email || null,
        address: address || null,
        additional: additionalStr,
      });
  } else {
    await db.update(contact)
      .set({
        instagram: instagram || null,
        whatsapp: whatsapp || null,
        email: email || null,
        address: address || null,
        additional: additionalStr,
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

export { contactRouter, contactAdminRouter };
export default contactRouter;
