import { Hono } from "hono";
import { db } from "../db/index.js";
import { contact } from "../db/schema.js";
import { eq } from "drizzle-orm";

const contactRouter = new Hono();

function safeParseAdditional(raw: unknown): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// GET / (public & admin)
contactRouter.get("/", async (c) => {
  try {
    const row = (await db.select().from(contact))[0];
    if (!row) {
      return c.json({ id: 0, instagram: null, whatsapp: null, email: null, address: null, additional: [], updatedAt: "" });
    }
    return c.json({
      ...row,
      additional: safeParseAdditional(row.additional),
    });
  } catch (error: any) {
    console.error("GET /contact error:", error);
    return c.json({ id: 0, instagram: null, whatsapp: null, email: null, address: null, additional: [], updatedAt: "" });
  }
});

// PUT / (protected)
contactRouter.put("/", async (c) => {
  try {
    const body = await c.req.json();
    const { instagram, whatsapp, email, address, additional } = body;

    const existing = (await db.select().from(contact))[0];
    const additionalStr = typeof additional === "string" ? additional : JSON.stringify(additional ?? []);

    if (!existing) {
      await db.insert(contact).values({
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
      additional: safeParseAdditional(updated?.additional),
    });
  } catch (error: any) {
    console.error("PUT /contact error:", error);
    return c.json({ error: error?.message || "Gagal menyimpan kontak" }, 500);
  }
});

export { contactRouter, contactRouter as contactAdminRouter };
export default contactRouter;

