"use client";

import React, { useState } from 'react';
import { 
  Reply, 
  Edit3, 
  Trash2, 
  Smile, 
  Download, 
  FileText,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  CornerDownRight,
  Zap
} from 'lucide-react';
import { Message, MessageType } from '@cliniq/shared-types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  className?: string;
}

const QUICK_REACTIONS = ['+1', 'heart', 'laugh', 'wow', 'sad', 'clap'];
const reactionLabels: Record<string, string> = {
  '+1': '👍', 'heart': '❤️', 'laugh': '😂', 'wow': '😮', 'sad': '😢', 'clap': '👏',
};

export function MessageBubble({ 
  message, 
  isOwn, 
  onReply,
  onReact,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  className = ''
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(false);
    setEditContent(message.content);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statusIcons: Record<string, React.ReactNode> = {
    SENDING: <Clock className="h-3 w-3 animate-pulse text-slate-300" />,
    SENT: <Check className="h-3 w-3 text-slate-300" />,
    DELIVERED: <CheckCheck className="h-3 w-3 text-slate-300" />,
    READ: <CheckCheck className="h-3 w-3 text-emerald-400" />,
    FAILED: <AlertCircle className="h-3 w-3 text-red-400" />,
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-4 p-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-2xl border-none bg-slate-900/10 text-slate-900 placeholder-slate-400 px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 resize-none shadow-inner"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => setIsEditing(false)} 
              className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Abort
            </button>
            <button 
              onClick={handleSaveEdit} 
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95"
            >
              Commit Synthesis
            </button>
          </div>
        </div>
      );
    }

    switch (message.type) {
      case MessageType.IMAGE:
        return (
          <div className="relative group overflow-hidden rounded-2xl border border-white/40 shadow-xl">
            <img 
              src={message.fileUrl} 
              alt={message.fileName}
              className="max-w-sm w-full h-auto cursor-pointer hover:scale-[1.05] transition-transform duration-700"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-sm">
               <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-2xl">
                  <Download className="h-6 w-6" />
               </div>
            </div>
          </div>
        );
      
      case MessageType.FILE:
        return (
          <div className="flex items-center gap-5 p-5 glass rounded-2xl border-white/60 shadow-xl shadow-slate-200/50 group/file cursor-pointer hover:border-emerald-200 transition-all">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover/file:bg-emerald-50 group-hover/file:text-emerald-600 transition-all">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-slate-900 heading">{message.fileName}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-0.5">
                {formatFileSize(message.fileSize || 0)} • SYNCED VECTOR
              </p>
            </div>
            <button
              onClick={() => message.fileUrl && window.open(message.fileUrl, '_blank')}
              className="h-10 w-10 rounded-xl glass border-white/80 flex items-center justify-center hover:bg-white hover:text-emerald-600 transition-all text-slate-300"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        );
      
      default:
        return (
          <p className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap break-words font-medium",
            isOwn ? "text-white" : "text-slate-700"
          )}>
            {message.content}
          </p>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={cn(
        "flex w-full mb-8",
        isOwn ? 'justify-end pl-12' : 'justify-start pr-12',
        className
      )}
    >
      <div 
        className={cn(
          "max-w-full lg:max-w-2xl group relative",
          isOwn ? 'items-end' : 'items-start'
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => {
          setShowActions(false);
          setShowEmojiPicker(false);
        }}
      >
        <div className={cn(
          "relative px-6 py-4 rounded-[2.5rem] shadow-2xl transition-all duration-500 overflow-hidden border",
          isOwn 
            ? 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-tr-none border-white/10 shadow-slate-900/20' 
            : 'glass text-slate-900 rounded-tl-none border-white/60 shadow-slate-200/50'
        )}>
          {/* Decorative Pulse (for own messages) */}
          {isOwn && (
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Zap className="h-20 w-20 text-emerald-400" />
            </div>
          )}

          {/* Reply indicator */}
          {message.replyToId && (
            <div className={cn(
              "flex items-center gap-3 py-2 px-3 rounded-xl mb-4 border",
              isOwn 
                ? 'bg-white/5 border-white/10 text-white/50' 
                : 'bg-slate-50 border-slate-100 text-slate-500'
            )}>
              <CornerDownRight className="h-3.5 w-3.5 text-emerald-500" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5 opacity-60">Collaborative Reference</p>
                <p className="text-[11px] font-medium truncate italic opacity-80 leading-none">Contextual sync active...</p>
              </div>
            </div>
          )}

          {/* Message content */}
          <div className="relative z-10">
            {renderContent()}
          </div>

          {/* Metadata Footer */}
          <div className={cn(
            "flex items-center gap-2 mt-3 text-[9px] font-bold uppercase tracking-[0.2em] transition-opacity",
            isOwn ? 'justify-end text-white/40' : 'justify-start text-slate-400'
          )}>
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                {statusIcons[message.status]}
                <span className="text-[8px]">{message.status}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Action Bar */}
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "absolute top-0 flex gap-2 z-20",
                isOwn ? '-left-16 flex-row-reverse' : '-right-16 flex-row'
              )}
            >
              <div className="flex flex-col gap-1.5 rounded-2xl glass p-1.5 shadow-2xl border-white/80">
                <button 
                  onClick={() => onReply?.(message.id)} 
                  className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all group/btn"
                >
                  <Reply className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                </button>
                {canEdit && (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-900 group/btn"
                  >
                    <Edit3 className="h-4 w-4 text-slate-400 group-hover/btn:text-white transition-all group-hover/btn:scale-110" />
                  </button>
                )}
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                  className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-all group/btn"
                >
                  <Smile className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                </button>
                {canDelete && (
                  <button 
                    onClick={() => onDelete?.(message.id)} 
                    className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors group/btn"
                  >
                    <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick reaction picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={cn(
                "absolute bottom-full mb-4 glass rounded-3xl p-3 shadow-3xl z-30 border-white/60",
                isOwn ? 'right-0' : 'left-0'
              )}
            >
              <div className="flex gap-2">
                {QUICK_REACTIONS.map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      onReact?.(message.id, reactionLabels[key]);
                      setShowEmojiPicker(false);
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-white hover:scale-125 hover:shadow-xl transition-all duration-300"
                    title={key}
                  >
                    <span className="text-2xl leading-none">{reactionLabels[key]}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reactions Display */}
        {message.reactions && message.reactions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-wrap gap-2 mt-3 relative z-10",
              isOwn ? 'justify-end' : 'justify-start'
            )}
          >
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => onReact?.(message.id, reaction.emoji)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-2xl glass border-white/40 text-[10px] font-bold shadow-xl transition-all hover:scale-110 active:scale-95 group",
                  "bg-white/80 border-slate-100"
                )}
              >
                <span className="text-sm scale-110 group-hover:scale-125 transition-transform duration-300">{reaction.emoji}</span>
                <span className="text-slate-500 font-bold">{reaction.count}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
