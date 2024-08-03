"use client";

import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/_components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";

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

  const submitQuestionAnswerMutation =
    api.question.submitQuestionAnswer.useMutation({
      onSuccess: async (data) => {
        if (!data) {
          router.push(`/game/${params.gameId}/stats`);
          return;
        }

        router.push(`/game/${params.gameId}/${data.questionNumber}`);
      },
      onError: async () => {
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
    // router.push("/");
    return <></>;
  }

  const answers = [
    question.correctAnswer,
    ...question.incorrectAnswers.split(","),
  ];

  return (
    <div>
      <h1>Question: {question.question}</h1>

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
                    className="flex flex-col space-y-1"
                  >
                    {answers.map((answer, idx) => {
                      return (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={idx}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={answer}
                              className="peer sr-only"
                            />
                          </FormControl>

                          <FormLabel
                            className={
                              (field.value === answer
                                ? "bg-black text-white"
                                : "bg-background hover:text-accent-foreground hover:opacity-80 ") +
                              " inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground"
                            }
                          >
                            {answer}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
