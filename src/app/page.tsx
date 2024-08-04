import Link from "next/link";

import { api, HydrateClient } from "@/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { SingleplayerGame } from "./_components/singleplayer-game";
import { HandleSession } from "./_components/handle-session";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <HydrateClient>
      <HandleSession />

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Trivia Game</CardTitle>
            <CardDescription>
              Challenge your knowledge against the world
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <SingleplayerGame />

            <Button asChild>
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
          </CardContent>

          <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
        </Card>
      </main>
    </HydrateClient>
  );
}
