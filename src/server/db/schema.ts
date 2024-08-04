// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import {
  int,
  integer,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `questions-game-gaiodataos_${name}`,
);

export const users = createTable("user", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }).default("Unknown").notNull(),
  slug: text("slug", { length: 256 }).default(randomUUID()).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const usersRelations = relations(users, ({ many }) => ({
  games: many(games),
}));

export const games = createTable("game", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: int("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id),
  gameSlug: text("game_slug", { length: 256 }).default(randomUUID()).notNull(),
  score: int("score", { mode: "number" }).notNull(),
  questionAmount: int("question_amount", { mode: "number" }).notNull(),
  status: text("status", { length: 256 }).notNull().default("created"),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const gamesRelations = relations(games, ({ one }) => ({
  user: one(users, { fields: [games.userId], references: [users.id] }),
}));

export const gameQuestions = createTable("game_question", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  gameId: int("game_id", { mode: "number" })
    .notNull()
    .references(() => games.id),
  questionNumber: int("question_number", { mode: "number" }).notNull(),
  difficulty: text("difficulty", { length: 256 }).notNull(),
  category: text("category", { length: 256 }).notNull(),
  question: text("question", { length: 256 }).notNull(),
  correctAnswer: text("correct_answer", { length: 256 }).notNull(),
  incorrectAnswers: text("incorrect_answers", { length: 256 }).notNull(),
  userAnswer: text("user_answer", { length: 256 }),
  userAnswerCorrectly: integer("user_answer_correctly", { mode: "boolean" }),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});
