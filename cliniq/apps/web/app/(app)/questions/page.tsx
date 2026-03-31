"use client";

import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuestions } from "./api";

export default function QuestionsFeedPage() {
  const query = useInfiniteQuery({
    queryKey: ["questions-feed"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getQuestions(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      const lastLen = lastPage.data.length;
      if (lastLen < 10) {
        return undefined;
      }
      return allPages.length + 1;
    }
  });

  const questions = query.data?.pages.flatMap(page => page.data) ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <Link className="rounded bg-teal-600 px-4 py-2 text-sm text-white" href="/questions/ask">
          Ask a question
        </Link>
      </div>

      <div className="grid gap-4">
        {questions.map(question => (
          <Link
            key={question.id}
            href={`/questions/${question.id}`}
            className="rounded-lg border p-4 hover:bg-gray-50"
          >
            <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
              <span>{question.answered ? "Answered" : "Unanswered"}</span>
              <span>{question.upvotes} upvotes</span>
              <span>{new Date(question.createdAt).toLocaleString()}</span>
            </div>
            <h2 className="text-lg font-medium">{question.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{question.body}</p>
          </Link>
        ))}
      </div>

      {query.isLoading && <p className="mt-6 text-sm text-gray-500">Loading questions...</p>}
      {query.isError && <p className="mt-6 text-sm text-red-600">Failed to load questions.</p>}

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => query.fetchNextPage()}
          disabled={!query.hasNextPage || query.isFetchingNextPage}
          className="rounded border px-4 py-2 text-sm disabled:opacity-50"
        >
          {query.isFetchingNextPage ? "Loading..." : query.hasNextPage ? "Load more" : "No more"}
        </button>
      </div>
    </main>
  );
}

