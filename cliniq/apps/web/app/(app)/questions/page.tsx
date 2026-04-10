"use client";

import Link from "next/link";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuestions } from "./api";
import { DebouncedInput, CategoryChip, AnsweredBadge } from "@cliniq/ui";
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  MessageCircle, 
  Clock, 
  User, 
  School, 
  ChevronDown,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

export default function QuestionsFeedPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [answered, setAnswered] = useState<"all" | "true" | "false">("all");
  const [institution, setInstitution] = useState("");
  const [sort, setSort] = useState<"newest" | "votes" | "unanswered">("newest");

  const query = useInfiniteQuery({
    queryKey: ["questions-feed", search, categoryId, answered, institution, sort],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getQuestions(pageParam, 10, { q: search, categoryId, answered, institution, sort }),
    getNextPageParam: (lastPage, allPages) => {
      const lastLen = lastPage.data.length;
      if (lastLen < 10) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const questions = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 w-fit">
            <MessageCircle className="h-3 w-3 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Knowledge Exchange</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 heading">Consult the Collective</h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
            Collaborate with peers and mentors to resolve complex clinical queries. Search over 5,000+ peer-validated discussions.
          </p>
        </div>

        <Link 
          href="/questions/ask" 
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200"
        >
          <Plus className="h-4 w-4" />
          Post Question
        </Link>
      </section>

      <main className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
        {/* Filters Sidebar */}
        <aside className="space-y-8">
           <div className="glass rounded-[2rem] p-6 border-white/40 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500" />
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-4 w-4 text-slate-900" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Refine Vault</h2>
              </div>
              
              <div className="space-y-6">
                 {/* Search */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Universal Search</label>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <DebouncedInput
                        placeholder="Diagnosis, drug..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        value={search}
                        onValueChange={setSearch}
                        debounceMs={400}
                      />
                    </div>
                 </div>

                 {/* Filters */}
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                       <div className="relative">
                          <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full appearance-none px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                          >
                            <option value="">All Disciplines</option>
                            <option value="demo-category">General Practice</option>
                            <option value="surgical">Surgery</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Resolution Status</label>
                       <div className="flex p-1 bg-slate-100 rounded-xl">
                          {["all", "true", "false"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setAnswered(opt as any)}
                              className={cn(
                                "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                                answered === opt ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                              {opt === "all" ? "All" : opt === "true" ? "Solved" : "Open"}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Origin Institution</label>
                       <div className="relative">
                          <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            placeholder="Search facility..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-emerald-600 rounded-[2rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <TrendingUp className="h-8 w-8 mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2 heading">Mentor Assistance</h3>
              <p className="text-emerald-100 text-xs leading-relaxed mb-6">Need expert eyes on a case? High-priority questions get highlighted to active mentors.</p>
              <button className="w-full py-3 bg-white text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-50 transition-colors">Go Priority</button>
           </div>
        </aside>

        {/* Content Area */}
        <section className="space-y-6">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                 {["newest", "votes", "unanswered"].map((s) => (
                   <button
                     key={s}
                     onClick={() => setSort(s as any)}
                     className={cn(
                       "text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all",
                       sort === s ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"
                     )}
                   >
                     {s}
                   </button>
                 ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Synchronized at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
           </div>

           <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {questions.map((question, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={question.id}
                  >
                    <Link
                      href={`/questions/${question.id}`}
                      className="block p-6 glass border-white/40 hover:border-emerald-200 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-[2rem]"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CategoryChip category={question.category} className="rounded-lg bg-emerald-50 text-emerald-700 border-none font-bold text-[10px]" />
                            <AnsweredBadge answered={question.answered} className="rounded-lg border-none" />
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                             <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                {question.upvotes} Points
                             </div>
                             <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(question.createdAt).toLocaleDateString()}
                             </div>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors heading mb-2">{question.title}</h2>
                          <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed font-medium">{question.body}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                                 <User className="h-4 w-4 text-slate-400" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-900 leading-none">{question.user?.name || "Dr. Anonymous"}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 leading-none">{question.user?.institution || "Unspecified Facility"}</p>
                              </div>
                           </div>
                           <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                              <ChevronRight className="h-5 w-5" />
                           </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>

           {/* Loading / Load More */}
           <div className="mt-12 flex flex-col items-center gap-6">
              {query.isLoading && (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Consulting Database...</p>
                </div>
              )}
              
              {!query.isLoading && query.hasNextPage && (
                <button
                  type="button"
                  onClick={() => query.fetchNextPage()}
                  disabled={query.isFetchingNextPage}
                  className="px-10 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-50 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {query.isFetchingNextPage ? "Streaming Results..." : "Load More Discussions"}
                </button>
              )}

              {query.isError && (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                   <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                      <MoreHorizontal className="h-5 w-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-red-900 text-sm">Transfer Interrupted</h4>
                      <p className="text-red-700 text-xs">Failed to synchronize discussions. Check your active link.</p>
                   </div>
                </div>
              )}
           </div>
        </section>
      </main>
    </div>
  );
}
