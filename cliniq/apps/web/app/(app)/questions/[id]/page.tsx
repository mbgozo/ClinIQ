"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptAnswer,
  createAnswer,
  getQuestion,
  getSimilarQuestions,
  voteAnswer
} from "../api";

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [answerBody, setAnswerBody] = useState("");
  const queryClient = useQueryClient();

  const questionQuery = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id)
  });

  const similarQuery = useQuery({
    queryKey: ["similar-questions", id],
    queryFn: () => getSimilarQuestions(id)
  });

  const createAnswerMutation = useMutation({
    mutationFn: () => createAnswer(id, answerBody),
    onSuccess: () => {
      setAnswerBody("");
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    }
  });

  const voteMutation = useMutation({
    mutationFn: ({ answerId, value }: { answerId: string; value: 1 | -1 }) =>
      voteAnswer(answerId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    }
  });

  const acceptMutation = useMutation({
    mutationFn: (answerId: string) => acceptAnswer(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    }
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
          <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
            <span>{question.answered ? "Answered" : "Unanswered"}</span>
            <span>{question.upvotes} upvotes</span>
          </div>
          <h1 className="text-2xl font-semibold">{question.title}</h1>
          <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700">{question.body}</p>
        </article>

        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-base font-semibold">Write an answer</h2>
          <textarea
            value={answerBody}
            onChange={e => setAnswerBody(e.target.value)}
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
          {(question.answers || []).map(answer => (
            <article key={answer.id} className="rounded-lg border p-4">
              <div className="mb-2 text-xs text-gray-500">
                {answer.isAccepted ? "Accepted" : "Not accepted"} · {answer.upvotes} upvotes
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{answer.body}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => voteMutation.mutate({ answerId: answer.id, value: 1 })}
                  className="rounded border px-2 py-1 text-xs"
                >
                  Upvote
                </button>
                <button
                  type="button"
                  onClick={() => voteMutation.mutate({ answerId: answer.id, value: -1 })}
                  className="rounded border px-2 py-1 text-xs"
                >
                  Downvote
                </button>
                <button
                  type="button"
                  onClick={() => acceptMutation.mutate(answer.id)}
                  className="rounded border px-2 py-1 text-xs"
                >
                  Accept
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>

      <aside className="rounded-lg border p-4">
        <h3 className="mb-2 text-sm font-semibold">Similar questions</h3>
        <div className="space-y-2">
          {similar.length === 0 && <p className="text-sm text-gray-600">No similar questions yet.</p>}
          {similar.map(item => (
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

