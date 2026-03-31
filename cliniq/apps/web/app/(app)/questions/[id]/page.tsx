import Link from "next/link";
import { getQuestion } from "../api";

export default async function QuestionDetailPage({
  params
}: {
  params: { id: string };
}) {
  const response = await getQuestion(params.id);
  const question = response.data;

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

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Answers ({question.answers?.length ?? 0})</h2>
          {(question.answers || []).map(answer => (
            <article key={answer.id} className="rounded-lg border p-4">
              <div className="mb-2 text-xs text-gray-500">
                {answer.isAccepted ? "Accepted" : "Not accepted"} · {answer.upvotes} upvotes
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{answer.body}</p>
            </article>
          ))}
        </section>
      </section>

      <aside className="rounded-lg border p-4">
        <h3 className="mb-2 text-sm font-semibold">Similar questions</h3>
        <p className="text-sm text-gray-600">
          Similar question suggestions will appear here when we wire the `/questions/:id/similar`
          query in the next UI pass.
        </p>
      </aside>
    </main>
  );
}

