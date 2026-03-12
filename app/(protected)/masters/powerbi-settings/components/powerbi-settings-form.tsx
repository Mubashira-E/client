"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export function PowerBiSettingsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "https://app.powerbi.com/view?r=eyJrIjoiNzFmYjFkOGMtMzhmOC00MzBjLTgyNzEtYmU3YTc2ODNjOWE0IiwidCI6IjQ4MTY1NGJmLTcwYjUtNDhiZC1hYWNjLTM3YzhlNDhlY2QwYyJ9",
    },
  });

  function onSubmit(_values: z.infer<typeof formSchema>) {
    // TODO: Implement API integration to save the settings
    toast.success("Settings saved successfully");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power BI URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter Power BI Dashboard URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
