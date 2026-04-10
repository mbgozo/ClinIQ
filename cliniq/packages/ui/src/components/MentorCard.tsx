import { 
  User, 
  Star, 
  Quote,
  Target,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MentorCardProps {
  mentor: {
    id: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
      institution: string;
      program: string;
    };
    bio: string;
    expertiseAreas: string[];
    institution: string;
    currentRole: string;
    availability: string;
    languages: string[];
    verifiedAt?: string;
    mentorRating: number;
    mentorshipCount: number;
    acceptanceRate: number;
  };
  onRequestMentorship?: (mentorId: string) => void;
  className?: string;
}

export function MentorCard({ mentor, onRequestMentorship, className = '' }: MentorCardProps) {
  const isVerified = !!mentor.verifiedAt;

  const formatExpertiseLabel = (area: string) =>
    area.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={cn(
      "glass group rounded-[2.5rem] p-8 transition-all duration-500 border-white/40 flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden",
      className
    )}>
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
         <Award className="h-32 w-32" />
      </div>

      {/* Header Section */}
      <div className="flex items-start justify-between mb-8 relative">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-[1.8rem] bg-gradient-to-br from-emerald-500 to-indigo-600 p-1 shadow-xl group-hover:shadow-emerald-200/50 transition-all duration-500">
            <div className="h-full w-full rounded-[1.6rem] bg-white flex items-center justify-center overflow-hidden relative">
              {mentor.user.avatarUrl ? (
                <img 
                  src={mentor.user.avatarUrl} 
                  alt={mentor.user.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <User className="h-10 w-10 text-slate-200" />
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <h3 className="text-xl font-bold text-slate-900 heading tracking-tight line-clamp-1">{mentor.user.name}</h3>
               {isVerified && <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-50/50" />}
            </div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{mentor.currentRole}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{mentor.user.institution}</p>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl shadow-slate-200 min-w-[70px] text-center transform scale-90 origin-top-right">
           <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-lg font-bold heading leading-none">{mentor.mentorRating.toFixed(1)}</span>
           </div>
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="relative mb-8 flex-1">
         <Quote className="absolute -top-2 -left-2 h-8 w-8 text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
         <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-4 relative z-10 italic">
           "{mentor.bio}"
         </p>
      </div>

      {/* Strategic Intelligence Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-2xl p-4 border-slate-100 shadow-sm group-hover:bg-white transition-colors">
          <div className="flex items-center gap-3 mb-2">
             <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Target className="h-4 w-4" /></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Rate</span>
          </div>
          <p className="text-xl font-bold text-slate-900 heading">{Math.round(mentor.acceptanceRate * 100)}%</p>
        </div>
        <div className="glass rounded-2xl p-4 border-slate-100 shadow-sm group-hover:bg-white transition-colors">
          <div className="flex items-center gap-3 mb-2">
             <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Clock className="h-4 w-4" /></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cadence</span>
          </div>
          <p className="text-xl font-bold text-slate-900 heading capitalize line-clamp-1 truncate">{mentor.availability}</p>
        </div>
      </div>

      {/* Distinctions Block */}
      <div className="space-y-4 mb-10">
         <div className="flex items-center justify-between px-1">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <Zap className="h-3 w-3 text-emerald-500" /> Specialized Expertise
            </h4>
            <span className="text-[10px] font-bold text-indigo-600 uppercase">{mentor.mentorshipCount} SESSIONS</span>
         </div>
         <div className="flex flex-wrap gap-2">
            {mentor.expertiseAreas.slice(0, 3).map((area) => (
              <span 
                key={area}
                className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest transition-all group-hover:bg-white group-hover:border-emerald-100 group-hover:text-emerald-700 shadow-sm"
              >
                {formatExpertiseLabel(area)}
              </span>
            ))}
            {mentor.expertiseAreas.length > 3 && (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold tracking-widest">
                +{mentor.expertiseAreas.length - 3}
              </span>
            )}
         </div>
      </div>

      {/* Action Directive */}
      {onRequestMentorship && (
        <button
          onClick={() => onRequestMentorship(mentor.id)}
          disabled={!isVerified}
          className={cn(
            "w-full h-14 rounded-2xl group/btn flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden shadow-2xl shadow-indigo-100 active:scale-95",
            isVerified
              ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          )}
        >
          {isVerified ? (
            <>
              Request Strategic Guidance
              <ChevronRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
            </>
          ) : (
            'Credential Verification Required'
          )}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
      )}
    </div>
  );
}
