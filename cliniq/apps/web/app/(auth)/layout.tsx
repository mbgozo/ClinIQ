import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md border rounded-xl p-8 shadow-sm">
        {children}
      </section>
    </main>
  );
}

