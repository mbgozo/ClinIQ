interface ReputationDisplayProps {
  reputation: number;
  level: string;
  nextLevelReputation: number;
  showProgress?: boolean;
  className?: string;
}

import { cn } from '../lib/utils';

export function ReputationDisplay({ 
  reputation, 
  level, 
  nextLevelReputation, 
  showProgress = true,
  className = '' 
}: ReputationDisplayProps) {
  const progress = nextLevelReputation > 0 
    ? (reputation / nextLevelReputation) * 100 
    : 100;

  return (
    <div className={cn("flex items-center gap-4 p-3 rounded-2xl glass border border-white/40", className)}>
      <div className="flex flex-col min-w-[60px]">
        <span className="text-lg font-bold text-emerald-600 heading leading-none">{reputation.toLocaleString()}</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">{level}</span>
      </div>
      
      {showProgress && nextLevelReputation > reputation && (
        <div className="flex-1 min-w-[120px]">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
              {nextLevelReputation - reputation} XP to Level UP
            </span>
            <span className="text-[9px] font-bold text-emerald-600/70">{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
