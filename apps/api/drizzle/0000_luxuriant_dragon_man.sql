CREATE TABLE `custom_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`occasion` text,
	`budget` text,
	`deadline` text,
	`shape` text,
	`finger_sizes` text,
	`notes` text,
	`reference_image_urls` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_email` text NOT NULL,
	`line_items` text DEFAULT '[]' NOT NULL,
	`total_in_cents` integer NOT NULL,
	`stripe_session_id` text,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`shipping_address` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_stripe_session_id_unique` ON `orders` (`stripe_session_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price_in_cents` integer NOT NULL,
	`shapes` text DEFAULT '[]' NOT NULL,
	`lengths` text DEFAULT '[]' NOT NULL,
	`finish` text NOT NULL,
	`collection` text,
	`image_urls` text DEFAULT '[]' NOT NULL,
	`swatch_color` text DEFAULT '#8B1A3A' NOT NULL,
	`customizable` integer DEFAULT false NOT NULL,
	`stock_quantity` integer DEFAULT -1 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`photo_urls` text DEFAULT '[]' NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
