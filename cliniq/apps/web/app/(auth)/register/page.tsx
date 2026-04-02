"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "@cliniq/shared-types";
import { useRouter } from "next/navigation";
import { useRegister } from "../../../hooks/useAuth";

type Step = 1 | 2 | 3;

const institutions = [
  "Korle-Bu Nursing Training College",
  "Pantang Nursing and Midwifery Training College",
  "Kintampo College of Health",
  "37 Military Hospital Nursing Training College",
  "University of Ghana School of Nursing and Midwifery"
];

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [step, setStep] = useState<Step>(1);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
    watch
  } = useForm<RegisterInput>({
    mode: "onChange",
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      program: "NURSING"
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    if (step < 3) {
      setStep(prev => (prev + 1) as Step);
      return;
    }
    
    try {
      await registerMutation.mutateAsync(data);
      router.push("/questions"); // Redirect into the main application
    } catch (error: any) {
      setError("root", { type: "manual", message: error.message || "Failed to create account. Please try again." });
    }
  };

  const password = watch("password");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Create your ClinIQ account</h1>
        <p className="text-sm text-gray-500">Step {step} of 3</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errors.root.message}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email (optional)</label>
                <input
                  type="email"
                  className="w-full rounded border px-3 py-2 text-sm"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone (Ghana)</label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l border border-r-0 bg-gray-50 px-3 text-sm">
                    🇬🇭 +233
                  </span>
                  <input
                    type="tel"
                    className="w-full rounded-r border px-3 py-2 text-sm"
                    placeholder="24 123 4567"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                )}
                {errors.root && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.root.message || "Either email or phone is required"}
                  </p>
                )}
              </div>
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
              {password && (
                <p className="mt-1 text-xs text-gray-500">
                  Strength: {password.length >= 12 ? "Strong" : password.length >= 8 ? "Medium" : "Weak"}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input
                list="institution-list"
                className="w-full rounded border px-3 py-2 text-sm"
                {...register("institution")}
              />
              <datalist id="institution-list">
                {institutions.map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {errors.institution && (
                <p className="mt-1 text-xs text-red-600">{errors.institution.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year of study</label>
              <input
                type="number"
                min={1}
                max={6}
                className="w-full rounded border px-3 py-2 text-sm"
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year && (
                <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Which programme are you enrolled in?</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: "NURSING", label: "Nursing" },
                { value: "MIDWIFERY", label: "Midwifery" },
                { value: "COMMUNITY_HEALTH", label: "Community Health" }
              ].map(option => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between rounded border px-4 py-3 text-sm"
                >
                  <span>{option.label}</span>
                  <input
                    type="radio"
                    value={option.value}
                    {...register("program")}
                    className="h-4 w-4"
                  />
                </label>
              ))}
              {errors.program && (
                <p className="mt-1 text-xs text-red-600">{errors.program.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-sm text-gray-600 disabled:opacity-50"
            disabled={step === 1}
            onClick={() => setStep(prev => (prev - 1) as Step)}
          >
            Back
          </button>
          <button
            type="submit"
            className="flex justify-center items-center gap-2 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
            disabled={!isValid || isSubmitting || registerMutation.isPending}
          >
            {(isSubmitting || registerMutation.isPending) ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              step === 3 ? "Create account" : "Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

