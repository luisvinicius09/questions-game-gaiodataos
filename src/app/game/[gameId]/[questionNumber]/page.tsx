"use client";

import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/app/_components/ui/form";
import { RadioGroup } from "@/app/_components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { QuestionAnswers } from "@/app/_components/question-answers";

const formSchema = z.object({
  answer: z.string(),
});

export default function GameQuestion({
  params,
}: {
  params: { gameId: string; questionNumber: string };
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const finishGameMutation = api.game.finishGame.useMutation({
    onSuccess: async () => {
      router.push(`/game/${params.gameId}/stats`);
    },
    onError: async () => {
      return;
    },
  });

  const submitQuestionAnswerMutation =
    api.question.submitQuestionAnswer.useMutation({
      onSuccess: async (data) => {
        if (data.action === "GAME_FINISHED") {
          await finishGameMutation.mutateAsync({
            gameId: Number(params.gameId),
          });
          return;
        }

        if (data.action === "NEXT_QUESTION") {
          router.push(
            `/game/${params.gameId}/${data.question?.questionNumber}`,
          );
        }
      },
      onError: async () => {
        //TODO: Handle this error
        return;
      },
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await submitQuestionAnswerMutation.mutateAsync({
      answer: values.answer,
      gameId: Number(params.gameId),
      questionNumber: Number(params.questionNumber),
    });
  }

  const { data: question } = api.question.fetchQuestion.useQuery({
    gameId: Number(params.gameId),
    questionNumber: Number(params.questionNumber),
  });

  if (!question) {
    // TODO: router.push("/");
    return <></>;
  }

  const answers = [
    question.correctAnswer,
    ...question.incorrectAnswers.split("*"),
  ];

  return (
    <motion.div>
      <Card>
        <CardHeader>
          <CardTitle>Question:</CardTitle>
          <CardDescription className="text-xl">
            {question.question}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 grid-rows-2"
                      >
                        <QuestionAnswers field={field} answers={answers} />
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
