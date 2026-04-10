import { ReactNode } from "react";
import { Sidebar } from "@cliniq/ui";
import { User, Bell, Search, ShieldCheck, Sparkles } from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-emerald-500/20">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-500">
        {/* Elite Executive Header */}
        <header className="h-20 glass sticky top-0 z-40 px-8 flex items-center justify-between border-b border-white/40">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-200 cursor-default group">
               <ShieldCheck className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Verified Secure</span>
            </div>
            
            <div className="relative group hidden lg:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search global archives..." 
                 className="h-11 w-80 pl-11 pr-4 bg-slate-100/50 border-none rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-400 transition-all"
               />
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Intelligence Indicator */}
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 group cursor-pointer hover:bg-emerald-100 transition-all">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Neural Layer Active</span>
             </div>

             <div className="h-10 w-[1px] bg-slate-200 mx-2" />

             <button className="h-11 w-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:shadow-xl hover:shadow-emerald-100 transition-all active:scale-95 group">
                <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
             </button>

             <button className="h-11 w-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 transition-all active:scale-95 group overflow-hidden relative">
                <User className="h-5 w-5" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 w-full animate-in">
           <div className="max-w-[1600px] mx-auto">
              {children}
           </div>
        </main>

        <footer className="px-12 py-8 bg-white/30 border-t border-slate-100 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
             ClinIQ High-Performance Academic Infrastructure &copy; 2024
           </p>
        </footer>
      </div>
    </div>
  );
}

