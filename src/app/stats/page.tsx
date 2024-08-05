import { api } from "@/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { HandleUserNameChange } from "../_components/handle-user-name-change";
import { PlayerStatsChart } from "../_components/player-stats-chart";

export default async function Stats() {
  const stats = await api.player.fetchPlayerStats();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
          <CardDescription>Your Id: {stats.user?.slug}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <HandleUserNameChange userName={stats.user?.name} />

          <PlayerStatsChart
            playerAverage={Number(stats.playerAverageScore)}
            usersAverage={Number(stats.usersAverageScore)}
            usersCount={stats.userCount}
          />
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Menu</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
