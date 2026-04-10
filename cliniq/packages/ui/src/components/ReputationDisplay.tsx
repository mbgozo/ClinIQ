"use client";

import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Zap,
  Hexagon,
  Sparkles
} from "lucide-react";
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface ReputationDisplayProps {
  reputation: number;
  level: string;
  nextLevelReputation: number;
  showProgress?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export function ReputationDisplay({ 
  reputation, 
  level, 
  nextLevelReputation, 
  showProgress = true,
  className = '',
  variant = 'light'
}: ReputationDisplayProps) {
  const progress = nextLevelReputation > 0 
    ? (reputation / nextLevelReputation) * 100 
    : 100;

  const isDark = variant === 'dark';

  return (
    <div className={cn(
      "flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] transition-all",
      isDark ? "glass-dark border-white/5 shadow-3xl text-white" : "glass border-white shadow-xl text-slate-900",
      className
    )}>
      <div className="flex items-center gap-4 min-w-[140px]">
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0",
          isDark ? "bg-white/10 text-emerald-400 border border-white/10" : "bg-emerald-500 text-white shadow-emerald-200"
        )}>
          <Award className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className={cn("text-2xl font-black heading leading-none", isDark ? "text-emerald-400" : "text-slate-900")}>
            {reputation.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isDark ? "text-slate-400" : "text-slate-500")}>
              {level}
            </span>
            <Sparkles className="h-3 w-3 text-amber-500" />
          </div>
        </div>
      </div>
      
      {showProgress && nextLevelReputation > reputation && (
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isDark ? "text-slate-400" : "text-slate-500")}>
              Progression Matrix
            </span>
            <span className={cn("text-[10px] font-black heading", isDark ? "text-emerald-400" : "text-indigo-600")}>
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          <div className={cn(
            "h-2.5 w-full rounded-full overflow-hidden p-0.5",
            isDark ? "bg-white/5 border border-white/10" : "bg-slate-100 border border-slate-200/50 shadow-inner"
          )}>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(progress, 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className={cn(
                "h-full rounded-full transition-all duration-700 relative",
                isDark ? "bg-gradient-to-r from-emerald-500 to-indigo-500" : "bg-gradient-to-r from-emerald-600 to-indigo-700"
              )}
            >
              <div className="absolute inset-0 bg-[length:20px_20px] bg-gradient-to-r from-white/10 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          
          <div className="flex items-center gap-2 px-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className={cn("text-[9px] font-black uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
              Syncing <span className={isDark ? "text-white" : "text-slate-900"}>{(nextLevelReputation - reputation).toLocaleString()} XP</span> to unlock next Distinction
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
