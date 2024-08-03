import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { gameQuestions } from "@/server/db/schema";
import { and, eq } from 'drizzle-orm';

export const questionRouter = createTRPCRouter({
  fetchQuestion: publicProcedure
    .input(z.object({ gameId: z.number(), questionNumber: z.number() }))
    .query(async ({ ctx, input }) => {
      const question = await ctx.db.query.gameQuestions.findFirst({
        where: (gameQuestions, { eq, and }) =>
          and(
            eq(gameQuestions.gameId, input.gameId),
            eq(gameQuestions.questionNumber, input.questionNumber),
          ),
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question requested not found",
        });
      }

      return question;
    }),
  submitQuestionAnswer: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
        questionNumber: z.number(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.query.gameQuestions.findFirst({
        where: (gameQuestions, { eq, and }) =>
          and(
            eq(gameQuestions.gameId, input.gameId),
            eq(gameQuestions.questionNumber, input.questionNumber),
          ),
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question requested not found",
        });
      }

      await ctx.db
        .update(gameQuestions)
        .set({
          userAnswerCorrectly: question.correctAnswer === input.answer,
        })
        .where(
          and(
            eq(gameQuestions.gameId, input.gameId),
            eq(gameQuestions.questionNumber, input.questionNumber),
          ),
        );

      const nextQuestion = await ctx.db.query.gameQuestions.findFirst({
        where: (gameQuestions, { eq, and }) =>
          and(
            eq(gameQuestions.gameId, input.gameId),
            eq(gameQuestions.questionNumber, input.questionNumber + 1),
          ),
      });

      if (!nextQuestion) {
        return false;
      }

      return nextQuestion;
    }),
});
