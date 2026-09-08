import { Hono } from "hono";
import { db } from "../db/index.js";
import { siteSettings } from "../db/schema.js";
import { eq } from "drizzle-orm";

const profileRouter = new Hono();

// GET /api/profile
profileRouter.get("/", async (c) => {
  const settings = (await db.select().from(siteSettings))[0];
  if (!settings) {
    return c.json({ error: "Profile not found" }, 404);
  }
  return c.json(settings);
});

// PUT /api/admin/profile
profileRouter.put("/", async (c) => {
  const body = await c.req.json();
  const {
    communityName,
    tagline,
    shortDescription,
    about,
    history,
    vision,
    mission,
    logoUrl,
    heroImageUrl,
  } = body;

  const existing = (await db.select().from(siteSettings))[0];

  if (!existing) {
    await db.insert(siteSettings)
      .values({
        communityName: communityName ?? "Paradise",
        tagline: tagline ?? "",
        shortDescription: shortDescription ?? "",
        about: about ?? "",
        history: history ?? "",
        vision: vision ?? "",
        mission: mission ?? "",
        logoUrl: logoUrl ?? null,
        heroImageUrl: heroImageUrl ?? null,
      });
  } else {
    await db.update(siteSettings)
      .set({
        ...(communityName !== undefined && { communityName }),
        ...(tagline !== undefined && { tagline }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(about !== undefined && { about }),
        ...(history !== undefined && { history }),
        ...(vision !== undefined && { vision }),
        ...(mission !== undefined && { mission }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(heroImageUrl !== undefined && { heroImageUrl }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(siteSettings.id, existing.id));
  }

  const updated = (await db.select().from(siteSettings))[0];
  return c.json(updated);
});

export default profileRouter;
