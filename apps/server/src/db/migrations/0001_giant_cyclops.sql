DROP INDEX "admins_username_unique";--> statement-breakpoint
ALTER TABLE `activities` ALTER COLUMN "image_url" TO "image_url" text;--> statement-breakpoint
CREATE UNIQUE INDEX `admins_username_unique` ON `admins` (`username`);--> statement-breakpoint
ALTER TABLE `contact` ALTER COLUMN "instagram" TO "instagram" text;--> statement-breakpoint
ALTER TABLE `contact` ALTER COLUMN "whatsapp" TO "whatsapp" text;--> statement-breakpoint
ALTER TABLE `contact` ALTER COLUMN "email" TO "email" text;--> statement-breakpoint
ALTER TABLE `contact` ADD `address` text DEFAULT 'Kota Semarang, Jawa Tengah';--> statement-breakpoint
ALTER TABLE `gallery` ALTER COLUMN "caption" TO "caption" text;--> statement-breakpoint
ALTER TABLE `gallery` ADD `type` text DEFAULT 'image' NOT NULL;--> statement-breakpoint
ALTER TABLE `officers` ALTER COLUMN "photo_url" TO "photo_url" text;--> statement-breakpoint
ALTER TABLE `site_settings` ALTER COLUMN "logo_url" TO "logo_url" text;--> statement-breakpoint
ALTER TABLE `site_settings` ALTER COLUMN "hero_image_url" TO "hero_image_url" text;