"use client";

import { type ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "./ui/form";
import { RadioGroupItem } from "./ui/radio-group";
import { memo, useEffect, useRef } from "react";

export const QuestionAnswers = memo(function QuestionAnswers({
  answers,
  field,
}: {
  answers: string[];
  field: ControllerRenderProps<
    {
      answer: string;
    },
    "answer"
  >;
}) {
  const randomizedAnswers = useRef(answers.sort(() => Math.random() - 0.5));

  return (
    <>
      {randomizedAnswers.current.map((answer, idx) => {
        return (
          <FormItem className="flex items-center" key={idx}>
            <FormControl>
              <RadioGroupItem value={answer} className="peer sr-only" />
            </FormControl>

            <FormLabel
              className={
                (field.value === answer
                  ? "bg-black text-white"
                  : "bg-background hover:text-accent-foreground hover:opacity-80 ") +
                " inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground"
              }
            >
              {answer}
            </FormLabel>
          </FormItem>
        );
      })}
    </>
  );
});
