"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptAnswer, createAnswer, getQuestion, getSimilarQuestions, voteAnswer } from "../api";
import { AnsweredBadge, BadgePill, BadgeType } from "@cliniq/ui";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [answerBody, setAnswerBody] = useState("");
  const queryClient = useQueryClient();

  const questionQuery = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id),
  });

  const similarQuery = useQuery({
    queryKey: ["similar-questions", id],
    queryFn: () => getSimilarQuestions(id),
  });

  const createAnswerMutation = useMutation({
    mutationFn: () => createAnswer(id, answerBody),
    onSuccess: () => {
      setAnswerBody("");
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ answerId, value }: { answerId: string; value: 1 | -1 }) =>
      voteAnswer(answerId, value),
    onMutate: async ({ answerId, value }) => {
      await queryClient.cancelQueries({ queryKey: ["question", id] });
      const previousQuestion = queryClient.getQueryData(["question", id]);

      queryClient.setQueryData(["question", id], (old: any) => {
        if (!old?.data) return old;

        const updatedAnswers = old.data.answers.map((answer: any) => {
          if (answer.id === answerId) {
            return {
              ...answer,
              upvotes: answer.upvotes + value,
              downvotes: answer.downvotes + (value === -1 ? 1 : 0),
            };
          }
          return answer;
        });

        return {
          ...old,
          data: {
            ...old.data,
            answers: updatedAnswers,
          },
        };
      });

      return { previousQuestion };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQuestion) {
        queryClient.setQueryData(["question", id], context.previousQuestion);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (answerId: string) => acceptAnswer(answerId),
    onMutate: async (answerId) => {
      await queryClient.cancelQueries({ queryKey: ["question", id] });
      const previousQuestion = queryClient.getQueryData(["question", id]);

      queryClient.setQueryData(["question", id], (old: any) => {
        if (!old?.data) return old;

        const updatedAnswers = old.data.answers.map((answer: any) => ({
          ...answer,
          isAccepted: answer.id === answerId,
        }));

        return {
          ...old,
          data: {
            ...old.data,
            answers: updatedAnswers,
            answered: true,
          },
        };
      });

      return { previousQuestion };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQuestion) {
        queryClient.setQueryData(["question", id], context.previousQuestion);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });

  if (questionQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Inquiry Nodes...</p>
      </div>
    );
  }

  if (questionQuery.isError || !questionQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center py-40 glass rounded-[3rem] text-center px-10">
         <Icons.ShieldCheck className="h-16 w-16 text-red-500 mb-6" />
         <h3 className="text-2xl font-bold text-slate-900 heading mb-2">Access Synchronization Failure</h3>
         <p className="text-slate-500 max-w-sm">Unable to verify the inquiry ID within the global clinical registry.</p>
         <Link href="/questions" className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">
            Return to Directory
         </Link>
      </div>
    );
  }

  const question = questionQuery.data.data;
  const similar = similarQuery.data?.data ?? [];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between">
        <Link 
          href="/questions" 
          className="group flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] transition-colors hover:text-emerald-600"
        >
          <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
             <Icons.ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Global Inquiry Registry
        </Link>

        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
              <Icons.ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Verified</span>
           </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-12">
          {/* Main Question Article */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[3rem] p-10 lg:p-14 border-white overflow-hidden relative"
          >
            {/* Neural Background Accent */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
               <Icons.Sparkles className="h-64 w-64 text-emerald-400" />
            </div>

            <header className="space-y-6 relative">
              <div className="flex flex-wrap items-center gap-4">
                <AnsweredBadge answered={question.answered} />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Icons.ArrowBigUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{question.upvotes} UPVOTES</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Icons.Clock className="h-4 w-4 text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">POSTED 2H AGO</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 heading tracking-tight leading-tight">
                {question.title}
              </h1>
              
              <div className="h-[1px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
              
              <div className="relative group">
                 <Icons.Quote className="absolute -top-4 -left-4 h-12 w-12 text-emerald-100 opacity-50 group-hover:scale-110 transition-transform" />
                 <p className="text-lg text-slate-600 leading-relaxed font-medium relative z-10 pl-4">
                   {question.body}
                 </p>
              </div>
            </header>
          </motion.article>

          {/* Response Drafting Interface */}
          <section className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
               <Icons.PlusCircle className="h-4 w-4 text-emerald-500" />
               Draft Clinical Response
            </h2>
            <div className="glass rounded-[2.5rem] p-8 lg:p-10 border-white shadow-xl shadow-slate-200/50 space-y-6">
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                rows={6}
                className="w-full bg-slate-100/50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-400 transition-all resize-none shadow-inner"
                placeholder="Share your professional synthesis or clinical insights..."
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => createAnswerMutation.mutate()}
                  disabled={answerBody.trim().length < 5 || createAnswerMutation.isPending}
                  className="h-14 px-10 rounded-2xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  {createAnswerMutation.isPending ? "Transmitting..." : (
                    <>
                      Post Professional Answer
                      <Icons.ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Answers Repository */}
          <section className="space-y-10">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Icons.MessageSquare className="h-4 w-4 text-indigo-500" />
                  Verified Responses ({question.answers?.length ?? 0})
               </h2>
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                  <Icons.Zap className="h-3 w-3 text-indigo-600" />
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Active Synthesis</span>
               </div>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {(question.answers || []).map((answer, i) => (
                  <motion.article 
                    key={answer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "glass rounded-[2.5rem] p-8 lg:p-10 border-white relative transition-all group",
                      answer.isAccepted && "bg-emerald-50/30 border-emerald-200 shadow-xl shadow-emerald-50"
                    )}
                  >
                    {answer.isAccepted && (
                      <div className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-200 z-10 border-4 border-white">
                         <Icons.CheckCircle2 className="h-6 w-6" />
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                              <Icons.ShieldCheck className="h-6 w-6" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Faculty Contributor</p>
                              <div className="flex items-center gap-2">
                                <BadgePill type={BadgeType.FIRST_ANSWER} size="sm" />
                              </div>
                           </div>
                        </div>

                        <p className="text-base text-slate-700 leading-relaxed font-medium">
                          {answer.body}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => voteMutation.mutate({ answerId: answer.id, value: 1 })}
                            disabled={voteMutation.isPending}
                            className={cn(
                              "h-11 px-6 rounded-xl border flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95",
                              "bg-white border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                            )}
                          >
                            <Icons.ArrowBigUp className="h-4 w-4" />
                            {voteMutation.isPending ? "..." : `Upvote (${answer.upvotes})`}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => voteMutation.mutate({ answerId: answer.id, value: -1 })}
                            disabled={voteMutation.isPending}
                            className={cn(
                              "h-11 px-6 rounded-xl border flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95",
                              "bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                            )}
                          >
                            <Icons.ArrowBigDown className="h-4 w-4" />
                            {voteMutation.isPending ? "..." : "Downvote"}
                          </button>

                          {!answer.isAccepted && (
                            <button
                              type="button"
                              onClick={() => acceptMutation.mutate(answer.id)}
                              disabled={acceptMutation.isPending}
                              className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
                            >
                              {acceptMutation.isPending ? "Accepting..." : "Mark as Validated Solution"}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="hidden lg:flex flex-col items-center gap-2 p-6 glass rounded-3xl border-white min-w-[120px] text-center bg-white/40">
                         <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                            <Icons.Target className="h-5 w-5" />
                         </div>
                         <p className="text-2xl font-bold text-slate-900 heading leading-none">{answer.upvotes}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Quality Score</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Similar Questions Sidebar */}
        <aside className="space-y-10">
          <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <Icons.Target className="h-4 w-4 text-emerald-500" />
                Related Cases
             </h3>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border-white shadow-xl shadow-slate-200/50 space-y-6">
            {similar.length === 0 && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-10 italic">No similar inquiry patterns detected.</p>
            )}
            {similar.map((item) => (
              <Link
                key={item.id}
                href={`/questions/${item.id}`}
                className="group block p-5 bg-white/40 border border-slate-100 rounded-2xl hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-slate-200 group-hover:bg-emerald-500 transition-colors" />
                <h4 className="text-xs font-bold text-slate-900 heading line-clamp-2 leading-relaxed group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                   <Icons.ChevronRight className="h-3 w-3 text-emerald-500" />
                   Review Protocol
                </div>
              </Link>
            ))}
          </div>

          {/* Neural Assist Invite Card */}
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
             <Icons.Sparkles className="h-10 w-10 mb-6 text-emerald-400" />
             <h3 className="text-xl font-bold mb-3 heading leading-tight">Complex Clinical Scenario?</h3>
             <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                Utilize ClinIQ Neural Assist to synthesize complex clinical data into actionable academic insights.
             </p>
             <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-400 transition-all active:scale-95">
                Initiate Neural Session
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
