import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { gameQuestions, games, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

type FetchTriviaQuestionResponse = {
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
};

export const gameRouter = createTRPCRouter({
  fetchGameStats: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, input.gameId),
      });

      if (!game)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });

      const questions = await ctx.db.query.gameQuestions.findMany({
        where: eq(gameQuestions.gameId, input.gameId),
      });

      return { game, questions };
    }),

  prepareGame: publicProcedure
    .input(z.object({ theme: z.string(), difficulty: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const headers = ctx.headers;
      const userSlug = headers.get("cookie")?.split("=")[1];

      if (!userSlug) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User slug not found on cookies",
        });
      }

      const userExists = await ctx.db.query.users.findFirst({
        where: eq(users.slug, userSlug),
      });

      let user = userExists;

      if (!userExists) {
        const [newUser] = await ctx.db
          .insert(users)
          .values({
            slug: userSlug,
          })
          .returning();

        user = newUser;
      }

      // Reference: https://opentdb.com/api_config.php
      const response = await fetch(
        `https://opentdb.com/api.php?amount=5&category=${input.theme}&difficulty=${input.difficulty}&type=multiple`,
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Network response failed, couldn't fetch questions",
        });
      }

      const { results: questions } = (await response.json()) as {
        results: Array<FetchTriviaQuestionResponse>;
      };

      const [game] = await ctx.db
        .insert(games)
        .values({
          score: -1,
          userId: user!.id,
          questionAmount: questions.length,
        })
        .returning();

      if (game) {
        for (const [index, question] of questions.entries()) {
          await ctx.db.insert(gameQuestions).values({
            category: question.category,
            difficulty: question.difficulty,
            gameId: game.id,
            questionNumber: index,
            correctAnswer: question.correct_answer,
            incorrectAnswers: question.incorrect_answers.join(","),
            question: question.question,
          });
        }

        return { gameId: game.id };
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong starting the game",
      });
    }),

  finishGame: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.query.games.findFirst({
        where: (games, { eq }) => eq(games.id, input.gameId),
      });

      if (!game)
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });

      const questions = await ctx.db.query.gameQuestions.findMany({
        where: eq(gameQuestions.gameId, input.gameId),
      });

      let score = 0;

      for (const question of questions) {
        if (question.userAnswerCorrectly) {
          score++;
        }
      }

      await ctx.db
        .update(games)
        .set({ score: score })
        .where(eq(games.id, input.gameId));

      return true;
    }),
});
