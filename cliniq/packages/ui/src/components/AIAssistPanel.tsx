"use client";

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Search, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Network,
  Orbit,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Suggestion {
  id: string;
  title: string;
  snippet: string;
  relevance: number;
}

interface AIAssistPanelProps {
  query: string;
  suggestions?: Suggestion[];
  loading?: boolean;
  onDismiss?: () => void;
  onOpenFullChat?: () => void;
}

export function AIAssistPanel({ 
  query, 
  suggestions = [], 
  loading = false,
  onDismiss,
  onOpenFullChat 
}: AIAssistPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasContent = suggestions.length > 0 || loading;

  if (!hasContent && !query) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="glass-dark rounded-[3rem] border-white/5 bg-slate-900/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group/panel"
    >
      {/* Advanced Neural Pulse Visual */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover/panel:opacity-10 transition-opacity duration-1000">
         <Orbit className="h-64 w-64 animate-spin-slow text-emerald-500" />
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
               <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-2xl relative z-10">
                  <Cpu className="h-7 w-7" />
               </div>
               <div className="absolute -inset-1 opacity-20 bg-emerald-500 rounded-2xl blur-lg animate-pulse" />
               <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-3 border-slate-900 flex items-center justify-center z-20">
                  <div className="h-2 w-2 rounded-full bg-white animate-ping" />
               </div>
            </div>
            <div>
               <h3 className="text-xl font-black text-white heading tracking-tight">Neural Intelligence Hub</h3>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] leading-none mt-1">Core Synthesis Layer Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasContent && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-10 w-10 rounded-xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="h-10 w-10 rounded-xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white/10 transition-all active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="space-y-8 overflow-hidden pr-2"
            >
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-5">
                  <div className="relative h-20 w-20 flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-3 border-dashed border-emerald-500/30 rounded-full" 
                    />
                    <Network className="h-8 w-8 text-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synthesizing Multidimensional Protocols...</p>
                </div>
              )}

              {!loading && suggestions.length === 0 && query && (
                <div className="p-8 glass border-white/5 rounded-3xl text-sm font-medium text-slate-300 flex items-center gap-6 shadow-xl">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0 border border-white/5">
                     <Search className="h-6 w-6" />
                  </div>
                  <p className="leading-relaxed">
                    Inquiry matrix for <span className="text-emerald-400 font-black italic tracking-tight">"{query}"</span> does not yield exact matches in current vault. Relaying to <span className="text-white">Heuristic Processing Layer</span>...
                  </p>
                </div>
              )}

              {!loading && suggestions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                        <Zap className="h-4 w-4 text-amber-500" /> Correlated Intelligence Matrix: {suggestions.length} Strategic Nodes
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {suggestions.map((suggestion, i) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group glass border-white/5 rounded-3xl p-6 hover:bg-white transition-all duration-500 cursor-pointer relative overflow-hidden shadow-xl"
                      >
                        <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500/10 group-hover:bg-emerald-500 transition-all" />
                        
                        <div className="flex items-start justify-between gap-6 mb-3">
                           <h4 className="text-lg font-black text-white group-hover:text-slate-900 heading tracking-tight transition-colors line-clamp-1">{suggestion.title}</h4>
                           <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white text-[10px] font-black uppercase tracking-tight transition-all">
                              {Math.round(suggestion.relevance * 100)}% Match
                           </div>
                        </div>
                        
                        <p className="text-sm font-medium text-slate-400 group-hover:text-slate-600 line-clamp-2 leading-relaxed mb-6 transition-colors">
                          {suggestion.snippet}
                        </p>
                        
                        <div className="flex justify-end">
                           <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-emerald-600 transition-colors">
                              Establish Link <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {onOpenFullChat && (
                <div className="pt-4 px-2">
                  <button
                    onClick={onOpenFullChat}
                    className="w-full h-16 bg-white text-slate-900 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95 group/btn"
                  >
                    <Bot className="h-6 w-6 text-emerald-500 group-hover:text-white transition-colors" />
                    Open Strategic Synthesis Matrix
                  </button>
                </div>
              )}

              <div className="p-6 glass border-white/5 rounded-[2rem] flex items-start gap-4">
                <div className="h-6 w-6 rounded flex items-center justify-center shrink-0">
                   <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <p className="text-[10px] font-black text-slate-500 leading-relaxed uppercase tracking-tighter italic">
                   Neural logic correlations are based on documented clinical archives. Verify all directives with the <span className="text-white not-italic font-black">Lead Consultant or Primary Attending Physician</span> prior to execution.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
