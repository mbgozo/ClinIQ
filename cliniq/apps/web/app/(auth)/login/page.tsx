"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required")
});

type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: LoginInput) => {
    // API integration will be added later.
    console.log("login", data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Sign in to ClinIQ</h1>

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
          className="w-full rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={!isValid || isSubmitting}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

