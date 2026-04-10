import { ReactNode } from "react";
import { Sidebar } from "@cliniq/ui";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-16 glass sticky top-0 z-40 px-8 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">ClinIQ Platform</h2>
          <div className="flex items-center gap-4">
            {/* Additional header actions can go here */}
          </div>
        </header>
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

