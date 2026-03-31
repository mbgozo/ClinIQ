"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const VerifySchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code")
});

type VerifyInput = z.infer<typeof VerifySchema>;

export default function VerifyPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<VerifyInput>({
    resolver: zodResolver(VerifySchema),
    mode: "onChange"
  });

  const onSubmit = async (data: VerifyInput) => {
    console.log("verify otp", data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Verify your account</h1>
      <p className="text-sm text-gray-600">
        Enter the 6-digit code sent to your email or phone.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Verification code</label>
          <input
            maxLength={6}
            className="w-full rounded border px-3 py-2 text-sm tracking-[0.4em] text-center"
            {...register("otp")}
          />
          {errors.otp && <p className="mt-1 text-xs text-red-600">{errors.otp.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={!isValid || isSubmitting}
        >
          Verify
        </button>
      </form>
    </div>
  );
}

