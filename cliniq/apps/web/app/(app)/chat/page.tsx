"use client";

import { useState, useEffect, useRef } from "react";
import { 
  useConversations, 
  useMessages, 
  useSendMessage, 
  useMarkAllMessagesAsRead,
  useWebSocket,
  useTypingIndicator,
  ConversationList,
  MessageBubble,
  TypingIndicator,
  Conversation,
  Message,
  MessageType,
  OnlineStatus
} from "@cliniq/ui";
import { 
  Send, 
  Paperclip, 
  Search,
  MoreVertical, 
  MessageSquare, 
  User, 
  X,
  Plus,
  Globe,
  Activity,
  WifiOff,
  Network,
  ShieldCheck,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: conversations } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConversation?.id || '', { enabled: !!selectedConversation });
  
  const sendMessageMutation = useSendMessage();
  const markAllAsReadMutation = useMarkAllMessagesAsRead();
  
  const { 
    onlineUsers, 
    typingIndicators, 
    isConnected, 
    joinRoom, 
    sendMessage, 
    updateStatus,
    addReaction,
  } = useWebSocket();
  
  const { handleTypingStart, handleTypingStop } = useTypingIndicator(selectedConversation?.id || '');
  const [currentUserStatus, setCurrentUserStatus] = useState<OnlineStatus>(OnlineStatus.ONLINE);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join/leave rooms when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      joinRoom(selectedConversation.id);
      markAllAsReadMutation.mutate(selectedConversation.id);
    }
  }, [selectedConversation, joinRoom, markAllAsReadMutation]);

  // Handle online status changes
  useEffect(() => {
    updateStatus(currentUserStatus);
  }, [currentUserStatus, updateStatus]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    sendMessage(
      selectedConversation.id,
      messageInput.trim(),
      MessageType.TEXT,
      replyingTo?.id
    );
    setMessageInput("");
    setReplyingTo(null);
    handleTypingStop();
  };



  const handleReply = (messageId: string) => {
    const message = messages?.find(m => m.id === messageId);
    if (message) {
      setReplyingTo(message);
      inputRef.current?.focus();
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji, selectedConversation?.id || '');
  };

  const getTypingUsers = () => {
    if (!selectedConversation) return [];
    const indicators = typingIndicators[selectedConversation.id] || [];
    return indicators
      .filter(indicator => indicator.userId !== 'current-user')
      .map(indicator => ({
        id: indicator.userId,
        name: `User ${indicator.userId}`,
        avatarUrl: undefined,
      }));
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-8 animate-fade-in relative">
      {/* Left Sidebar: Neural Conversation List */}
      <div className="w-[380px] flex flex-col glass rounded-[3rem] border-white/40 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] bg-white/30 backdrop-blur-3xl">
        <div className="p-8 border-b border-slate-100/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-slate-900 heading tracking-tight">Comms Matrix</h2>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] leading-none mt-1">Sovereign Signals</span>
            </div>
            <button className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl hover:scale-105 active:scale-95 group">
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 relative z-10" />
            <input 
              type="text" 
              placeholder="Search active vectors..." 
              className="w-full pl-12 pr-6 py-4 bg-white/60 border border-transparent focus:border-emerald-500/20 rounded-2xl text-[13px] focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold placeholder:text-slate-400 placeholder:uppercase placeholder:tracking-widest relative z-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6">
          <ConversationList
            conversations={conversations || []}
            activeConversationId={selectedConversation?.id}
            onSelectConversation={setSelectedConversation}
            onlineUsers={onlineUsers}
            currentUserOnlineStatus={currentUserStatus}
            onStatusChange={setCurrentUserStatus}
          />
        </div>
        
        <div className="p-6 border-t border-slate-100/50 bg-slate-50/30">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Synchronized</span>
              </div>
              <Globe className="h-4 w-4 text-slate-300" />
           </div>
        </div>
      </div>

      {/* Main Neural Chat Matrix */}
      <div className="flex-1 flex flex-col glass rounded-[3rem] border-white/40 shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] overflow-hidden relative bg-white/20 backdrop-blur-3xl">
        {selectedConversation ? (
          <>
            {/* Elite Header */}
            <div className="px-10 py-6 border-b border-slate-100/50 bg-white/40 flex items-center justify-between backdrop-blur-md relative z-20">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-[1.8rem] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-white p-1 shadow-inner relative overflow-hidden group">
                   <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                   <User className="h-8 w-8 text-slate-400 relative z-10" />
                   <div className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 heading tracking-tight leading-none mb-1.5">{selectedConversation.name || 'Clinical Syndicate'}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100/50">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
                         Verified Node
                       </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {selectedConversation.type === 'DIRECT' ? 'Active Matrix' : `${selectedConversation.participantIds.length} OPERATIVE NODES`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm",
                    isConnected ? "bg-white text-emerald-600 border-white shadow-emerald-500/5" : "bg-red-50 text-red-600 border-red-100"
                  )}
                >
                  {isConnected ? <Activity className="h-4 w-4 animate-pulse" /> : <WifiOff className="h-4 w-4" />}
                  {isConnected ? 'Sync: Sovereign' : 'Sync: Interrupted'}
                </motion.div>
                <div className="h-10 w-[1px] bg-slate-100 mx-1" />
                <button className="h-12 w-12 rounded-[1.2rem] hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-500 shadow-sm border border-transparent hover:border-slate-800">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Feed: The Intelligence Transcript */}
            <div className="flex-1 overflow-y-auto p-12 space-y-4 relative scroll-smooth custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.02),transparent_50%)]">
              {messagesLoading ? (
                <div className="flex h-full items-center justify-center">
                   <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                         <div className="absolute inset-0 bg-emerald-500/20 blur-2xl animate-pulse" />
                         <div className="h-16 w-16 rounded-[1.5rem] border-4 border-emerald-50 border-t-emerald-600 animate-spin relative z-10" />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing High-Fidelity Transcript...</span>
                   </div>
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-10">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === 'current-user'}
                      onReply={handleReply}
                      onReact={handleReact}
                      canEdit={message.senderId === 'current-user'}
                      canDelete={message.senderId === 'current-user'}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="max-w-md space-y-8">
                    <div className="h-24 w-24 bg-gradient-to-br from-emerald-50 to-indigo-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-3xl border border-white">
                      <Network className="h-12 w-12 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-3xl font-black text-slate-900 heading tracking-tight">Initialize Transcript</h4>
                      <p className="text-lg text-slate-500 font-medium">Your collaborative history starts with a single authoritative word. Initiate signal with {selectedConversation.name}.</p>
                    </div>
                    <div className="pt-8 flex justify-center gap-4">
                       <span className="px-5 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Encrypted Layer 7</span>
                       <span className="px-5 py-2 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100">Peer-Verified Matrix</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Typing Indicator Overlay */}
              <div className="sticky bottom-0 left-0 w-full py-6 px-4">
                 <TypingIndicator users={getTypingUsers()} />
              </div>
            </div>

            {/* Matrix Input Panel */}
            <div className="p-10 bg-white/60 backdrop-blur-3xl border-t border-slate-100/50">
              <AnimatePresence>
                {replyingTo && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="mb-8 p-6 glass-dark rounded-[2rem] border-white/20 flex items-center justify-between shadow-2xl overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="h-12 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Replying to high-fidelity node</p>
                        <p className="text-[15px] text-white font-bold truncate max-w-2xl tracking-tight italic opacity-90">"{replyingTo.content}"</p>
                      </div>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 transition-all hover:scale-110 active:scale-95">
                      <X className="h-6 w-6" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-end gap-6">
                <button className="h-[4.5rem] w-[4.5rem] rounded-[1.8rem] glass bg-white/80 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-400 transition-all hover:scale-105 active:scale-95 shadow-xl border border-white group">
                  <Paperclip className="h-6 w-6 group-hover:rotate-12 transition-transform duration-500" />
                </button>
                
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-emerald-500/5 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      if (e.target.value) handleTypingStart();
                      else handleTypingStop();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Input vectors for clinical consensus..."
                    className="w-full glass bg-white/80 border-transparent focus:border-emerald-500/10 rounded-[2rem] px-8 py-6 text-base font-bold text-slate-900 focus:ring-8 focus:ring-emerald-500/5 transition-all resize-none max-h-48 shadow-2xl relative z-10 placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-[13px]"
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  className="h-[4.5rem] w-20 rounded-[1.8rem] bg-slate-900 text-white flex items-center justify-center shadow-3xl hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-30 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Send className="h-7 w-7 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* High-Fidelity Empty Matrix State */
          <div className="flex-1 flex items-center justify-center p-20 relative overflow-hidden">
            {/* Background Architecture */}
            <div className="absolute top-[10%] left-[10%] w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[160px] animate-pulse-slow" />
            <div className="absolute bottom-[5%] right-[5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px]" />
            
            <div className="text-center relative z-10 max-w-2xl space-y-12">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-32 w-32 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] relative group"
              >
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageSquare className="h-14 w-14 text-emerald-400" />
              </motion.div>
              
              <div className="space-y-6">
                 <h2 className="text-5xl font-black text-slate-900 mb-4 heading tracking-tight">Sovereign Comms Hub</h2>
                 <p className="text-2xl text-slate-500 font-medium leading-tight">Select a verified clinical colleague or research syndicate to initiate encrypted knowledge exchange.</p>
              </div>
              
              <div className="pt-12 flex flex-wrap justify-center gap-4">
                 {[
                   { icon: ShieldCheck, label: 'Encrypted Nexus' },
                   { icon: Activity, label: 'Real-time Matrix' },
                   { icon: Lock, label: 'Sovereign Protocol' }
                 ].map((tag, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 + (idx * 0.1) }}
                     className="px-6 py-3 rounded-2xl glass border-emerald-100/30 text-[11px] font-black text-emerald-700 uppercase tracking-[0.3em] flex items-center gap-3 shadow-md bg-white/40"
                   >
                     <tag.icon className="h-4 w-4" />
                     {tag.label}
                   </motion.div>
                 ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
