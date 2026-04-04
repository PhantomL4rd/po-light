CREATE TABLE `lighting_feedbacks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`input_json` text NOT NULL,
	`output_json` text NOT NULL,
	`rating` integer,
	`memo` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
