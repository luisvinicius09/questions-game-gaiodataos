CREATE TABLE `questions-game-gaiodataos_game_question` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_id` integer NOT NULL,
	`question_number` integer NOT NULL,
	`difficulty` text(256) NOT NULL,
	`category` text(256) NOT NULL,
	`question` text(256) NOT NULL,
	`correct_answer` text(256) NOT NULL,
	`incorrect_answers` text(256) NOT NULL,
	`user_answer` text(256),
	`user_answer_correctly` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `questions-game-gaiodataos_game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions-game-gaiodataos_game` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`game_slug` text(256) DEFAULT '0d0f4cb3-9b44-4ef9-99b8-506f2cd8d0c2' NOT NULL,
	`score` integer NOT NULL,
	`question_amount` integer NOT NULL,
	`status` text(256) DEFAULT 'created' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `questions-game-gaiodataos_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions-game-gaiodataos_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) DEFAULT 'Unknown' NOT NULL,
	`slug` text(256) DEFAULT '06dbd7bc-6221-487f-b444-e27dd5651bd7' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
