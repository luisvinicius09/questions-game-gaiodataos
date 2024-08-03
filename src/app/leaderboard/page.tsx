import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import Link from "next/link";

export default async function Leaderboard() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Trivia Game</CardTitle>
          <CardDescription>Leaderboard</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Leaderboard here</p>
        </CardContent>

        <CardFooter>
          <Button asChild>
            <Link href="/">Back</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
