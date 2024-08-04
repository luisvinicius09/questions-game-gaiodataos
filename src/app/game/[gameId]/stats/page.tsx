import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function GameStats({
  params,
}: {
  params: { gameId: string };
}) {
  const stats = await api.game.fetchGameStats({
    gameId: Number(params.gameId),
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Your Score:</h1>
              <p className="text-xl">{stats.game.score}</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div>
            <h2 className="text-xl">Summary</h2>

            <div>
              {stats.questions.map((question) => {
                return (
                  <div key={question.id}>
                    <p className="font-bold">{question.question}</p>
                    <p
                      className={
                        question.userAnswerCorrectly
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {question.userAnswer}
                    </p>
                    <hr className="my-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex space-x-2">
          <Button asChild className="w-full">
            <Link href="/">Menu</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
