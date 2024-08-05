import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { avg, count, eq, ne } from "drizzle-orm";
import { games, users } from "@/server/db/schema";
import { z } from "zod";

export const playerRouter = createTRPCRouter({
  updatePlayerName: publicProcedure
    .input(z.object({ value: z.string() }))
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

      if (!userExists)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      await ctx.db
        .update(users)
        .set({
          name: input.value,
        })
        .where(eq(users.id, userExists.id));

      return true;
    }),
  fetchPlayerStats: publicProcedure.query(async ({ ctx }) => {
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

    const [playerAverageScore] = await ctx.db
      .select({ value: avg(games.score) })
      .from(games)
      .where(eq(games.userId, user!.id));

    const [usersAverageScore, userCount] = await ctx.db
      .select({ value: avg(games.score), userCount: count(users.id) })
      .from(games)
      .where(ne(games.userId, user!.id));

    return {
      user,
      playerAverageScore: Number(playerAverageScore?.value).toFixed(2) ?? 0,
      usersAverageScore: Number(usersAverageScore?.value).toFixed(2) ?? 0,
      userCount: (userCount?.userCount ?? 0) + 1,
    };
  }),
});
