import React from 'react';
import { 
  User, 
  Star, 
  CheckCircle2, 
  Tag as TagIcon, 
  Languages, 
  Calendar,
  Users as UsersIcon
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
      "glass card-hover rounded-2xl p-6 transition-all duration-300 border border-white/40 flex flex-col h-full",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-100/50 flex items-center justify-center overflow-hidden border border-emerald-200/50 relative group">
            {mentor.user.avatarUrl ? (
              <img 
                src={mentor.user.avatarUrl} 
                alt={mentor.user.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <User className="h-8 w-8 text-emerald-600/50" />
            )}
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-white" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 heading line-clamp-1">{mentor.user.name}</h3>
            <p className="text-sm font-medium text-emerald-600">{mentor.currentRole}</p>
            <p className="text-xs text-slate-400 font-medium">{mentor.user.institution}</p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-xs text-amber-700">{mentor.mentorRating.toFixed(1)}</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
            {mentor.mentorshipCount} mentoring sessions
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
        {mentor.bio}
      </p>

      {/* Expertise Areas */}
      <div className="mb-6 flex-1">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <TagIcon className="h-3 w-3" />
          Primary Expertise
        </h4>
        <div className="flex flex-wrap gap-2">
          {mentor.expertiseAreas.slice(0, 3).map((area) => (
            <span 
              key={area}
              className="inline-flex items-center rounded-lg bg-white/50 border border-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
            >
              {formatExpertiseLabel(area)}
            </span>
          ))}
          {mentor.expertiseAreas.length > 3 && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              +{mentor.expertiseAreas.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">{Math.round(mentor.acceptanceRate * 100)}%</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Match Rate</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <Languages className="h-4 w-4 text-indigo-500" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">{mentor.languages.length}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Languages</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onRequestMentorship && (
        <button
          onClick={() => onRequestMentorship(mentor.id)}
          disabled={!isVerified}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 shadow-lg shadow-emerald-100",
            isVerified
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          )}
        >
          {isVerified ? 'Request Professional Mentorship' : 'Identity Verification Pending'}
        </button>
      )}
    </div>
  );
}

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
