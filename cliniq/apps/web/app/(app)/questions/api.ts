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

export type QuestionFilters = {
  q?: string;
  categoryId?: string;
  answered?: "all" | "true" | "false";
  institution?: string;
  sort?: "newest" | "votes" | "unanswered";
};

export async function getQuestions(page = 1, limit = 10, filters?: QuestionFilters) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });
  if (filters?.q) {
    params.set("q", filters.q);
  }
  if (filters?.categoryId) {
    params.set("categoryId", filters.categoryId);
  }
  if (filters?.answered && filters.answered !== "all") {
    params.set("answered", filters.answered);
  }
  if (filters?.institution) {
    params.set("institution", filters.institution);
  }
  if (filters?.sort) {
    params.set("sort", filters.sort);
  }

  const res = await fetch(`${API_URL}/questions?${params.toString()}`, {
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

export async function getSimilarQuestions(id: string) {
  const res = await fetch(`${API_URL}/questions/${id}/similar`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load similar questions");
  }
  return (await res.json()) as ApiResponse<QuestionSummary[]>;
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

export async function createAnswer(questionId: string, body: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("cliniq_access_token") : null;
  const res = await fetch(`${API_URL}/questions/${questionId}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ body })
  });
  if (!res.ok) {
    throw new Error("Failed to create answer");
  }
  return (await res.json()) as ApiResponse<{ id: string }>;
}

export async function acceptAnswer(answerId: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("cliniq_access_token") : null;
  const res = await fetch(`${API_URL}/answers/${answerId}/accept`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) {
    throw new Error("Failed to accept answer");
  }
  return (await res.json()) as ApiResponse<{ id: string; isAccepted: boolean }>;
}

export async function voteAnswer(answerId: string, value: 1 | -1) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("cliniq_access_token") : null;
  const res = await fetch(`${API_URL}/answers/${answerId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ value })
  });
  if (!res.ok) {
    throw new Error("Failed to vote answer");
  }
  return (await res.json()) as ApiResponse<{ upvotes: number; downvotes: number }>;
}

