ALTER TABLE `events` ADD `registration_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `poster_id` text;--> statement-breakpoint
ALTER TABLE `events` ADD `deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `photos` ADD `kind` text DEFAULT 'photo' NOT NULL;