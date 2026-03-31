"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptAnswer, createAnswer, getQuestion, getSimilarQuestions, voteAnswer } from "../api";
import { AnsweredBadge, BadgePill, ReputationDisplay } from "@cliniq/ui";

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [answerBody, setAnswerBody] = useState("");
  const queryClient = useQueryClient();

  const questionQuery = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id),
  });

  const similarQuery = useQuery({
    queryKey: ["similar-questions", id],
    queryFn: () => getSimilarQuestions(id),
  });

  const createAnswerMutation = useMutation({
    mutationFn: () => createAnswer(id, answerBody),
    onSuccess: () => {
      setAnswerBody("");
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ answerId, value }: { answerId: string; value: 1 | -1 }) =>
      voteAnswer(answerId, value),
    onMutate: async ({ answerId, value }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["question", id] });

      // Snapshot the previous value
      const previousQuestion = queryClient.getQueryData(["question", id]);

      // Optimistically update
      queryClient.setQueryData(["question", id], (old: any) => {
        if (!old?.data) return old;

        const updatedAnswers = old.data.answers.map((answer: any) => {
          if (answer.id === answerId) {
            return {
              ...answer,
              upvotes: answer.upvotes + value,
              downvotes: answer.downvotes + (value === -1 ? 1 : 0),
            };
          }
          return answer;
        });

        return {
          ...old,
          data: {
            ...old.data,
            answers: updatedAnswers,
          },
        };
      });

      return { previousQuestion };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousQuestion) {
        queryClient.setQueryData(["question", id], context.previousQuestion);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (answerId: string) => acceptAnswer(answerId),
    onMutate: async (answerId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["question", id] });

      // Snapshot the previous value
      const previousQuestion = queryClient.getQueryData(["question", id]);

      // Optimistically update
      queryClient.setQueryData(["question", id], (old: any) => {
        if (!old?.data) return old;

        const updatedAnswers = old.data.answers.map((answer: any) => ({
          ...answer,
          isAccepted: answer.id === answerId,
        }));

        return {
          ...old,
          data: {
            ...old.data,
            answers: updatedAnswers,
            answered: true,
          },
        };
      });

      return { previousQuestion };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousQuestion) {
        queryClient.setQueryData(["question", id], context.previousQuestion);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });

  if (questionQuery.isLoading) {
    return <main className="mx-auto max-w-4xl px-4 py-8 text-sm text-gray-500">Loading...</main>;
  }

  if (questionQuery.isError || !questionQuery.data) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 text-sm text-red-600">
        Failed to load question.
      </main>
    );
  }

  const question = questionQuery.data.data;
  const similar = similarQuery.data?.data ?? [];

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1fr_280px]">
      <section className="space-y-6">
        <Link href="/questions" className="text-sm text-gray-600 underline">
          Back to questions
        </Link>

        <article className="rounded-lg border p-5">
          <div className="mb-3 flex items-center gap-3">
            <AnsweredBadge answered={question.answered} />
            <span className="text-sm text-gray-500">{question.upvotes} upvotes</span>
          </div>
          <h1 className="text-2xl font-semibold">{question.title}</h1>
          <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700">{question.body}</p>
        </article>

        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-base font-semibold">Write an answer</h2>
          <textarea
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            className="min-h-28 w-full rounded border px-3 py-2 text-sm"
            placeholder="Share your answer..."
          />
          <button
            type="button"
            onClick={() => createAnswerMutation.mutate()}
            disabled={answerBody.trim().length < 5 || createAnswerMutation.isPending}
            className="rounded bg-teal-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {createAnswerMutation.isPending ? "Posting..." : "Post answer"}
          </button>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Answers ({question.answers?.length ?? 0})</h2>
          {(question.answers || []).map((answer) => (
            <article key={answer.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {answer.isAccepted && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Accepted
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{answer.upvotes} upvotes</span>
                </div>
                {/* Mock user badges - replace with actual data */}
                <div className="flex gap-1">
                  <BadgePill type="FIRST_ANSWER" size="sm" />
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{answer.body}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => voteMutation.mutate({ answerId: answer.id, value: 1 })}
                  disabled={voteMutation.isPending}
                  className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                    voteMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {voteMutation.isPending ? "Voting..." : "▲ Upvote"}
                </button>
                <button
                  type="button"
                  onClick={() => voteMutation.mutate({ answerId: answer.id, value: -1 })}
                  disabled={voteMutation.isPending}
                  className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                    voteMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {voteMutation.isPending ? "Voting..." : "▼ Downvote"}
                </button>
                <button
                  type="button"
                  onClick={() => acceptMutation.mutate(answer.id)}
                  disabled={acceptMutation.isPending || answer.isAccepted}
                  className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                    answer.isAccepted
                      ? "bg-green-100 border-green-300 text-green-800 cursor-not-allowed"
                      : acceptMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-teal-50 hover:border-teal-300 text-teal-700"
                  }`}
                >
                  {acceptMutation.isPending
                    ? "Accepting..."
                    : answer.isAccepted
                      ? "Accepted"
                      : "✓ Accept"}
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>

      <aside className="rounded-lg border p-4">
        <h3 className="mb-2 text-sm font-semibold">Similar questions</h3>
        <div className="space-y-2">
          {similar.length === 0 && (
            <p className="text-sm text-gray-600">No similar questions yet.</p>
          )}
          {similar.map((item) => (
            <Link
              key={item.id}
              href={`/questions/${item.id}`}
              className="block rounded border p-2 text-sm hover:bg-gray-50"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </aside>
    </main>
  );
}
