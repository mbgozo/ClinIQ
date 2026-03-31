"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ForgotSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required")
});

type ForgotInput = z.infer<typeof ForgotSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<ForgotInput>({
    resolver: zodResolver(ForgotSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: ForgotInput) => {
    console.log("forgot password", data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Reset your password</h1>
      <p className="text-sm text-gray-600">
        Enter your email or Ghana phone number and we&apos;ll send reset instructions.
      </p>

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

        <button
          type="submit"
          className="w-full rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={!isValid || isSubmitting}
        >
          Send reset link
        </button>
      </form>
    </div>
  );
}

