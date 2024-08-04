import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { api } from "@/trpc/server";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../_components/ui/avatar";

export default async function Leaderboard() {
  const leaderboardGames = await api.leaderboard.fetchLeaderboard();

  const sortedGames = leaderboardGames.sort((a, b) => b.score - a.score);

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Trivia Game</CardTitle>
        <CardDescription>Leaderboard</CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {leaderboardGames.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p>No games found</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <div>
                  <h4>Name</h4>
                </div>
                <div>
                  <h4>Score</h4>
                </div>
              </div>

              {sortedGames.map((game) => {
                return (
                  <div key={game.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        {game.user.name.length > 18 ? (
                          <p>
                            {game.user.name.split("").splice(0, 18).join("") +
                              "..."}
                          </p>
                        ) : (
                          <p>{game.user.name}</p>
                        )}
                      </div>

                      <div>
                        <p className="pr-4 font-bold">{game.score}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/">Menu</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
