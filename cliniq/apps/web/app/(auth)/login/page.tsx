"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLogin } from "../../../hooks/useAuth";

const LoginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required")
});

type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
      router.push("/questions"); // Redirect into the main application
    } catch (error: any) {
      setError("root", { type: "manual", message: error.message || "Failed to login. Please try again." });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Sign in to ClinIQ</h1>

      {errors.root && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email or phone</label>
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            {...register("emailOrPhone")}
          />
          {errors.emailOrPhone && (
            <p className="mt-1 text-xs text-red-600">{errors.emailOrPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2 text-sm"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
          disabled={!isValid || isSubmitting || loginMutation.isPending}
        >
          {(isSubmitting || loginMutation.isPending) ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}

