import { client } from "./index.js";

// Run migrations by creating tables directly using SQLite
// This is simpler than using drizzle-kit push for initial setup

const createTables = async () => {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      community_name TEXT NOT NULL DEFAULT 'Paradise',
      tagline TEXT NOT NULL DEFAULT '',
      short_description TEXT NOT NULL DEFAULT '',
      about TEXT NOT NULL DEFAULT '',
      history TEXT NOT NULL DEFAULT '',
      vision TEXT NOT NULL DEFAULT '',
      mission TEXT NOT NULL DEFAULT '',
      logo_url TEXT,
      hero_image_url TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS officers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      photo_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instagram TEXT,
      whatsapp TEXT,
      email TEXT,
      additional TEXT DEFAULT '[]',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log("✅ Tables created successfully");
};

createTables()
  .then(() => client.close())
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    client.close();
    process.exit(1);
  });
