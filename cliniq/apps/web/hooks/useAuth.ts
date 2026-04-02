import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegisterInput } from "@cliniq/shared-types";

// In development, the NestJS API runs on 3001
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMsg = "Failed to login";
        try {
          const error = await response.json();
          errorMsg = error.message || errorMsg;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      return response.json();
    },
    onSuccess: (data) => {
      const token = data.data?.token || data.token;
      if (token) {
        localStorage.setItem("cliniq_token", token);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMsg = "Failed to register";
        try {
          const error = await response.json();
          errorMsg = error.message || errorMsg;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      return response.json();
    },
    onSuccess: (data) => {
      const token = data.data?.token || data.token;
      if (token) {
        localStorage.setItem("cliniq_token", token);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
