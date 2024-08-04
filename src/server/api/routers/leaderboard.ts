import { createTRPCRouter, publicProcedure } from "../trpc";

export const leaderboardRouter = createTRPCRouter({
  fetchLeaderboard: publicProcedure.query(async ({ ctx }) => {
    const games = await ctx.db.query.games.findMany({
      where: (games, { eq }) => eq(games.status, "done"),
      with: {
        user: true,
      },
    });

    return games;
  }),
});
