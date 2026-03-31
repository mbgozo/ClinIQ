"use client";

import Link from "next/link";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuestions } from "./api";

export default function QuestionsFeedPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [answered, setAnswered] = useState<"all" | "true" | "false">("all");
  const [institution, setInstitution] = useState("");
  const [sort, setSort] = useState<"newest" | "votes" | "unanswered">("newest");

  const query = useInfiniteQuery({
    queryKey: ["questions-feed", search, categoryId, answered, institution, sort],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getQuestions(pageParam, 10, { q: search, categoryId, answered, institution, sort }),
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
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-semibold">Filters</h2>
        <div className="space-y-3">
          <input
            placeholder="Search questions"
            className="w-full rounded border px-3 py-2 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            <option value="demo-category">General Nursing</option>
          </select>
          <select
            value={answered}
            onChange={e => setAnswered(e.target.value as "all" | "true" | "false")}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="true">Answered</option>
            <option value="false">Unanswered</option>
          </select>
          <input
            placeholder="Institution"
            className="w-full rounded border px-3 py-2 text-sm"
            value={institution}
            onChange={e => setInstitution(e.target.value)}
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as "newest" | "votes" | "unanswered")}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="votes">Most votes</option>
            <option value="unanswered">Unanswered first</option>
          </select>
        </div>
      </aside>

      <section>
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
                <span className="rounded-full bg-gray-100 px-2 py-0.5">
                  {question.answered ? "Answered" : "Unanswered"}
                </span>
                <span>{question.upvotes} upvotes</span>
                <span>{new Date(question.createdAt).toLocaleString()}</span>
                <span>{question.user?.name || "Anonymous"}</span>
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
      </section>
    </main>
  );
}

