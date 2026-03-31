const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type QuestionSummary = {
  id: string;
  title: string;
  body: string;
  upvotes: number;
  answered: boolean;
  createdAt: string;
  user?: { id: string; name: string | null; avatarUrl?: string | null } | null;
  category?: { id: string; name: string } | null;
};

type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export async function getQuestions(page = 1, limit = 10) {
  const res = await fetch(`${API_URL}/questions?page=${page}&limit=${limit}`, {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error("Failed to load questions");
  }
  return (await res.json()) as ApiResponse<QuestionSummary[]>;
}

export async function getQuestion(id: string) {
  const res = await fetch(`${API_URL}/questions/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load question");
  }
  return (await res.json()) as ApiResponse<
    QuestionSummary & { answers: Array<{ id: string; body: string; isAccepted: boolean; upvotes: number }> }
  >;
}

export async function createQuestion(payload: {
  title: string;
  body: string;
  categoryId: string;
  anonymous?: boolean;
}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("cliniq_access_token") : null;
  const res = await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error("Failed to create question");
  }
  return (await res.json()) as ApiResponse<QuestionSummary>;
}

