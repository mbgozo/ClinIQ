"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createQuestion } from "../api";
import { AIAssistPanel, useDebounce } from "@cliniq/ui";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const AskQuestionSchema = z.object({
  title: z.string().min(5).max(120),
  categoryId: z.string().min(1),
  body: z.string().min(10),
  tags: z.string().optional(),
  anonymous: z.boolean().default(false),
});

type AskQuestionInput = z.infer<typeof AskQuestionSchema>;

export default function AskQuestionPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AskQuestionInput>({
    mode: "onChange",
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: { body: "", anonymous: false, categoryId: "", tags: "" },
  });

  const body = watch("body");
  const title = watch("title");

  // Debounce title for AI suggestions
  const debouncedTitle = useDebounce(title, 800);
  const [showAIAssist, setShowAIAssist] = useState(true);

  // Mock AI suggestions (replace with actual API call when ready)
  const { data: aiSuggestions, isLoading: aiLoading } = useQuery({
    queryKey: ["ai-suggest", debouncedTitle],
    queryFn: async () => {
      if (!debouncedTitle || debouncedTitle.length < 10) return [];

      // Mock response - replace with actual API call to /ai/suggest
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          id: "1",
          title: "Understanding vital signs monitoring",
          snippet:
            "Learn how to properly measure and interpret blood pressure, heart rate, temperature, and respiratory rate in clinical settings...",
          relevance: 0.85,
        },
        {
          id: "2",
          title: "Common nursing assessment techniques",
          snippet:
            "Essential assessment skills every nursing student should master, including head-to-toe assessment fundamentals...",
          relevance: 0.72,
        },
      ];
    },
    enabled: debouncedTitle.length >= 10,
  });

  const onSubmit = async (values: AskQuestionInput) => {
    setSubmitting(true);
    try {
      const created = await createQuestion(values);
      router.push(`/questions/${created.data.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ask a Question</h1>
        <Link href="/questions" className="text-sm text-gray-600 underline">
          Back to feed
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input className="w-full rounded border px-3 py-2 text-sm" {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* AI Assist Panel */}
        {title && (
          <AIAssistPanel
            query={title}
            suggestions={aiSuggestions}
            loading={aiLoading}
            onDismiss={() => setShowAIAssist(false)}
            onOpenFullChat={() => router.push("/ai")}
          />
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select className="w-full rounded border px-3 py-2 text-sm" {...register("categoryId")}>
            <option value="">Select category</option>
            <option value="demo-category">General Nursing</option>
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        <div data-color-mode="light">
          <label className="mb-1 block text-sm font-medium">Question details</label>
          <MDEditor
            value={body}
            onChange={(value) => setValue("body", value || "", { shouldValidate: true })}
            height={280}
          />
          {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tags (comma-separated)</label>
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="maternal-health, pharmacology"
            {...register("tags")}
          />
        </div>

        <div className="rounded border border-dashed p-3 text-sm text-gray-600">
          File/image upload will be enabled via R2 presigned upload in the resources/upload phase.
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("anonymous")} />
          Post anonymously (your identity is hidden from students; moderators can still view it)
        </label>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="rounded bg-teal-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post question"}
        </button>
      </form>
    </main>
  );
}
