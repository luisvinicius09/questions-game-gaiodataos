import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default async function GameStats() {
  return (
    <div>
      <h1>Game Stats</h1>

      <div>
        <Button asChild>
          <Link href="/">Menu</Link>
        </Button>
        <Button asChild>
          <Link href="/leaderboard">Leaderboard</Link>
        </Button>
      </div>
    </div>
  );
}
