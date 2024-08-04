"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  value: z.string().min(2).max(20),
});

export function HandleUserNameChange({
  userName,
}: {
  userName: string | undefined;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: userName,
    },
  });

  const handleUsernameChange = api.player.updatePlayerName.useMutation({
    onSuccess: () => {
      router.refresh();
      return;
    },
    onError: () => {
      // TODO: handle this
      return;
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleUsernameChange.mutateAsync({ value: values.value });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
