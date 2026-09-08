CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`date` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image_url` text DEFAULT 'null',
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_username_unique` ON `admins` (`username`);--> statement-breakpoint
CREATE TABLE `contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instagram` text DEFAULT 'null',
	`whatsapp` text DEFAULT 'null',
	`email` text DEFAULT 'null',
	`additional` text DEFAULT '[]',
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`caption` text DEFAULT 'null',
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `officers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`photo_url` text DEFAULT 'null',
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`community_name` text DEFAULT 'Paradise' NOT NULL,
	`tagline` text DEFAULT '' NOT NULL,
	`short_description` text DEFAULT '' NOT NULL,
	`about` text DEFAULT '' NOT NULL,
	`history` text DEFAULT '' NOT NULL,
	`vision` text DEFAULT '' NOT NULL,
	`mission` text DEFAULT '' NOT NULL,
	`logo_url` text DEFAULT 'null',
	`hero_image_url` text DEFAULT 'null',
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
