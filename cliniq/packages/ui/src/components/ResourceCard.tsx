"use client";

import { 
  User, 
  FileText, 
  Presentation, 
  Video, 
  Image as ImageIcon, 
  Mic, 
  Link as LinkIcon, 
  Book, 
  Download, 
  AlertTriangle, 
  MoreVertical,
  Layers,
  Edit2,
  Trash2,
  Flag,
  FileBadge,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description?: string;
    url?: string;
    fileRef?: string;
    fileType?: string;
    course?: string;
    year?: number;
    downloads: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
      institution: string;
    };
    category?: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
    isFlagged?: boolean;
  };
  onDownload?: (resourceId: string) => void;
  onFlag?: (resourceId: string) => void;
  onEdit?: (resourceId: string) => void;
  onDelete?: (resourceId: string) => void;
  showActions?: boolean;
  className?: string;
}

export function ResourceCard({ 
  resource, 
  onDownload, 
  onFlag, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = '' 
}: ResourceCardProps) {
  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'PRESENTATION': return <Presentation className="h-6 w-6" />;
      case 'VIDEO': return <Video className="h-6 w-6" />;
      case 'IMAGE': return <ImageIcon className="h-6 w-6" />;
      case 'AUDIO': return <Mic className="h-6 w-6" />;
      case 'LINK': return <LinkIcon className="h-6 w-6" />;
      case 'STUDY_GUIDE':
      case 'CHEAT_SHEET':
      case 'CASE_STUDY':
      case 'RESEARCH_PAPER':
      case 'CLINICAL_GUIDELINE': return <FileBadge className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const getFileIconColors = (fileType?: string) => {
    switch (fileType) {
      case 'PRESENTATION': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'VIDEO': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'IMAGE': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'AUDIO': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      case 'LINK': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'STUDY_GUIDE':
      case 'CHEAT_SHEET':
      case 'CASE_STUDY':
      case 'RESEARCH_PAPER':
      case 'CLINICAL_GUIDELINE': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const isExternalLink = !!resource.url && !resource.fileRef;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "glass group border-white hover:border-emerald-200 transition-all duration-700 shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] rounded-[3.5rem] overflow-hidden flex flex-col relative",
        className
      )}
    >
      {/* Dynamic Visual Header */}
      <div className="relative h-28 bg-slate-50 group-hover:bg-slate-100 transition-colors duration-700">
         <div className="absolute inset-0 bg-grid-slate-200/[0.2] [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
         
         <div className={cn(
           "absolute top-8 left-10 h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
           getFileIconColors(resource.fileType)
         )}>
           {getFileIcon(resource.fileType)}
           <div className="absolute inset-0 rounded-2xl bg-white/40 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>
         
         <div className="absolute top-8 right-10">
            <div className="h-10 w-10 rounded-xl glass border-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer transition-all active:scale-90">
               <MoreVertical className="h-5 w-5" />
            </div>
         </div>

         {/* Type Backdrop Text */}
         <div className="absolute -bottom-6 right-8 text-5xl font-black text-slate-100/50 select-none uppercase tracking-tighter opacity-10 transition-opacity group-hover:opacity-20">
            {resource.fileType?.split('_')[0] || 'Doc'}
         </div>
      </div>

      <div className="p-10 pt-8 flex-1 flex flex-col relative z-10">
        {/* Indicators Row */}
        <div className="flex items-center gap-3 mb-6">
          {resource.category && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              <Layers className="h-3 w-3" /> {resource.category.name}
            </span>
          )}
          {resource.isFlagged && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[9px] font-black text-rose-600 uppercase tracking-[0.2em] animate-pulse">
              <AlertTriangle className="h-3 w-3" /> Integrity Review
            </span>
          )}
        </div>

        {/* Core Asset Title */}
        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 heading leading-[1.15] group-hover:text-emerald-700 transition-colors duration-500 max-w-[90%]">
              {resource.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
              {resource.course && (
                <span className="flex items-center gap-2 px-1.5 py-0.5 rounded-md hover:bg-slate-50 transition-colors">
                  <Book className="h-3.5 w-3.5 text-indigo-500" /> {resource.course}
                </span>
              )}
              {resource.year && (
                <span className="flex items-center gap-2 px-1.5 py-0.5 rounded-md hover:bg-slate-50 transition-colors">
                  <History className="h-3.5 w-3.5 text-amber-500" /> Phase {resource.year}
                </span>
              )}
            </div>
          </div>
          
          {resource.description && (
            <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
              {resource.description}
            </p>
          )}
        </div>

        {/* Global Markers */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {resource.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="text-[9px] font-black px-3 py-1.5 bg-slate-100 rounded-xl text-slate-500 transition-all cursor-default border border-transparent hover:border-emerald-200 hover:bg-white hover:text-emerald-600 uppercase tracking-widest"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <div className="h-6 w-10 flex items-center justify-center bg-slate-50 rounded-lg text-[9px] font-black text-slate-300">
                +{resource.tags.length - 3}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto space-y-8">
          {/* Attribution Nexus */}
          <div className="flex items-center justify-between py-6 border-t border-slate-50">
             <div className="flex items-center gap-4 group/author">
                <div className="h-12 w-12 rounded-2xl bg-white p-0.5 shadow-xl border border-slate-100 ring-4 ring-slate-50/50 group-hover/author:ring-emerald-500/10 transition-all duration-500 relative overflow-hidden">
                   {resource.user.avatarUrl ? (
                     <img src={resource.user.avatarUrl} alt="" className="h-full w-full object-cover rounded-[0.9rem]" />
                   ) : (
                     <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-[0.9rem]">
                        <User className="h-6 w-6 text-slate-200" />
                     </div>
                   )}
                </div>
                <div className="space-y-0.5">
                   <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{resource.user.name}</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate max-w-[140px]">{resource.user.institution}</p>
                </div>
             </div>
             
             <div className="text-right space-y-0.5">
                <div className="flex items-center justify-end gap-1.5">
                   <span className="text-base font-black text-slate-900">{resource.downloads.toLocaleString()}</span>
                   <Zap className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Syncs</p>
             </div>
          </div>

          {/* Precision Controls */}
          {showActions && (
            <div className="flex gap-3">
              <button
                onClick={() => onDownload?.(resource.id)}
                className="flex-1 h-14 rounded-[1.25rem] bg-slate-900 text-white flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-3xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 group/btn"
              >
                {isExternalLink ? <ArrowUpRight className="h-4 w-4 text-emerald-400" /> : <Download className="h-4 w-4 text-emerald-400 group-hover/btn:translate-y-0.5" />}
                {isExternalLink ? 'Access Vector' : 'Sync Offline'}
              </button>
              
              <div className="flex gap-1.5 p-1.5 bg-slate-50 rounded-[1.25rem] border border-slate-100">
                {onEdit && (
                  <button onClick={() => onEdit(resource.id)} className="h-11 w-11 rounded-xl glass border-white text-slate-400 hover:text-emerald-600 hover:bg-white transition-all flex items-center justify-center shadow-sm">
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
                <button 
                  onClick={() => onFlag?.(resource.id)} 
                  className={cn(
                    "h-11 w-11 rounded-xl glass border-white transition-all flex items-center justify-center shadow-sm",
                    resource.isFlagged ? "text-rose-500 bg-rose-50" : "text-slate-400 hover:text-rose-600 hover:bg-white"
                  )}
                >
                  <Flag className="h-4 w-4" />
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(resource.id)} className="h-11 w-11 rounded-xl glass border-white text-slate-300 hover:text-rose-700 hover:bg-white transition-all flex items-center justify-center shadow-sm">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Missing Lucide imports added: History, FileBadge, ArrowUpRight
import { History } from "lucide-react";
