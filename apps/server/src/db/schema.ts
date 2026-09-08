import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  communityName: text("community_name").notNull().default("Paradise"),
  tagline: text("tagline").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  about: text("about").notNull().default(""),
  history: text("history").notNull().default(""),
  vision: text("vision").notNull().default(""),
  mission: text("mission").notNull().default(""),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Activities ───────────────────────────────────────────────────────────────
export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Gallery ──────────────────────────────────────────────────────────────────
export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Officers ─────────────────────────────────────────────────────────────────
export const officers = sqliteTable("officers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  position: text("position").notNull(),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contact = sqliteTable("contact", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instagram: text("instagram"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  additional: text("additional").default("[]"),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Admins ───────────────────────────────────────────────────────────────────
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Gallery = typeof gallery.$inferSelect;
export type NewGallery = typeof gallery.$inferInsert;

export type Officer = typeof officers.$inferSelect;
export type NewOfficer = typeof officers.$inferInsert;

export type Contact = typeof contact.$inferSelect;
export type NewContact = typeof contact.$inferInsert;

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
