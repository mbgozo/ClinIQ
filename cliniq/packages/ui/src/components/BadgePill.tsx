import { 
  Zap, 
  ThumbsUp, 
  CheckCircle2, 
  Star, 
  Trophy, 
  Moon, 
  Sun, 
  TrendingUp, 
  Crown,
  Medal
} from 'lucide-react';
import { BadgeType, BADGE_DEFINITIONS } from '@cliniq/shared-types';
import { cn } from '../lib/utils';

interface BadgePillProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const BadgeIcon = ({ type, className }: { type: BadgeType, className?: string }) => {
  switch (type) {
    case BadgeType.FIRST_ANSWER: return <Zap className={className} />;
    case BadgeType.HELPFUL: return <ThumbsUp className={className} />;
    case BadgeType.ACCEPTED: return <CheckCircle2 className={className} />;
    case BadgeType.MENTOR_STAR: return <Star className={className} />;
    case BadgeType.AMBASSADOR: return <Trophy className={className} />;
    case BadgeType.QUICK_DRAWER: return <Zap className={className} />;
    case BadgeType.NIGHT_OWL: return <Moon className={className} />;
    case BadgeType.EARLY_BIRD: return <Sun className={className} />;
    case BadgeType.TREND_SETTER: return <TrendingUp className={className} />;
    case BadgeType.COMMUNITY_LEADER: return <Crown className={className} />;
    default: return <Medal className={className} />;
  }
};

export function BadgePill({ type, size = 'md', showTooltip = true, className = '' }: BadgePillProps) {
  const definition = BADGE_DEFINITIONS[type];
  
  if (!definition) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const tierColors = {
    BRONZE: 'bg-amber-50/50 text-amber-800 border-amber-200/60 shadow-sm',
    SILVER: 'bg-slate-100/50 text-slate-700 border-slate-200/60 shadow-sm',
    GOLD: 'bg-yellow-50/50 text-yellow-800 border-yellow-200/60 shadow-sm',
    PLATINUM: 'bg-indigo-50/50 text-indigo-800 border-indigo-200/60 shadow-sm',
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-200 hover:scale-105 cursor-default backdrop-blur-sm",
        sizeClasses[size],
        tierColors[definition.tier],
        className
      )} 
      title={showTooltip ? definition.description : undefined}
    >
      <BadgeIcon type={type} className={cn(
        size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
      )} />
      <span className="heading uppercase tracking-tighter">{definition.name}</span>
    </div>
  );
}
