"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";

const chartConfig = {
  value: {
    label: "Value",
  },
  you: {
    label: "You",
    color: "hsl(var(--chart-1))",
  },
  usersAverage: {
    label: "Users Avrg",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PlayerStatsChart({
  playerAverage,
  usersAverage,
  usersCount,
}: {
  playerAverage: number;
  usersAverage: number;
  usersCount: number;
}) {
  const chartData = React.useMemo(() => {
    return [
      { browser: "you", value: playerAverage, fill: "var(--color-you)" },
      {
        browser: "usersAverage",
        value: usersAverage,
        fill: "var(--color-usersAverage)",
      },
    ];
  }, [playerAverage, usersAverage]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Accuracy</CardTitle>
        <CardDescription>2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {playerAverage === 0 && usersAverage === 0 ? (
          <p className="my-8 text-center">No data available</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {usersCount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Users
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-center leading-none text-muted-foreground">
          This is your accuracy compared
          <br /> with the average of users
        </div>
      </CardFooter>
    </Card>
  );
}
