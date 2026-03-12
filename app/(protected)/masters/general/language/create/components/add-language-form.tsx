"use client";

import type { AxiosError } from "axios";
import type { LanguageRequest } from "@/queries/general/language/useCreateLanguageMutationQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createLanguageSchema, useCreateLanguageMutation } from "@/queries/general/language/useCreateLanguageMutationQuery";
import { useGetLanguageById } from "@/queries/general/language/useGetLanguageByIdQuery";
import { useUpdateLanguageMutation } from "@/queries/general/language/useUpdateLanguageMutationQuery";
import LanguageFormLoader from "./add-language-form-loader";

export function AddLanguageForm({ languageId }: { languageId?: string }) {
  const router = useRouter();

  const form = useForm<LanguageRequest>({
    resolver: zodResolver(createLanguageSchema),
    defaultValues: {
      languageName: "",
      languageCode: "",
    },
  });

  const { mutate: createLanguage, isPending: isCreating } = useCreateLanguageMutation({
    onSuccess: () => {
      toast.success("Language created successfully", {
        description: `${"Language created successfully"} "${form.getValues("languageName")}"`,
      });
      form.reset();
      router.push("/masters/general");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("Error creating language", {
        description: error.response?.data?.message || "Unknown error",
      });
    },
  });

  const { data: language, isPending: isLoadingGetLanguage } = useGetLanguageById(languageId as string);

  useEffect(() => {
    if (language) {
      form.setValue("languageName", language.languageName);
      form.setValue("languageCode", language.languageCode);
    }
  }, [language, form]);

  const { mutate: updateLanguage, isPending: isUpdating } = useUpdateLanguageMutation(languageId as string, {
    onSuccess: () => {
      toast.success("Language updated successfully", {
        description: `${"Language updated successfully"} "${form.getValues("languageName")}"`,
      });
      form.reset();
      router.push("/masters/general");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("Error updating language", {
        description: error.response?.data?.message || "Unknown error",
      });
    },
  });

  async function onSubmit(data: LanguageRequest) {
    if (languageId) {
      updateLanguage(data);
    }
    else {
      createLanguage(data);
    }
  }

  if (languageId && isLoadingGetLanguage) {
    return <LanguageFormLoader />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="languageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Language Name
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter language name" {...field} />
              </FormControl>
              <FormDescription>The name of the language.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languageCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Language Code
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter language code" {...field} />
              </FormControl>
              <FormDescription>The code of the language.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/masters/general")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating} isLoading={isCreating || isUpdating}>
            {languageId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
