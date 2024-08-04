"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Game({ params }: { params: { gameId: string } }) {
  // TODO: check if game is all good

  const router = useRouter();

  const [timer, setTimer] = useState(5);
  const [progressBar, setProgressBar] = useState(0);

  useEffect(() => {
    if (timer !== 0 && progressBar !== 100) {
      const intervalId = setInterval(() => {
        setTimer(timer - 1);
        setProgressBar(progressBar + 20);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      router.push(`/game/${params.gameId}/0`);
    }
  }, [timer, progressBar, params, router]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Game will start in...</CardTitle>
        </CardHeader>

        <CardContent>
          <Progress value={progressBar} />

          <div className="text-center">
            <p className="text-[4rem] font-bold">{timer}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
