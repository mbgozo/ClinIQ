"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Search, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Activity,
  Globe,
  Plus,
  Zap,
  Sparkles,
  Shield,
  Target,
  ChevronRight,
  Hexagon,
  Cpu,
  BrainCircuit,
  Waves,
  Fingerprint,
  Network,
  Orbit,
  Bot
} from "lucide-react";
import { cn } from "../lib/utils";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 16]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const matrixRotate = useTransform(scrollY, [0, 1000], [0, 20]);

  const features = [
    { 
      icon: MessageSquare, 
      title: "Consensus Synthesis", 
      desc: "Engage in peer-validated clinical inquiries. Receive authoritative insights from the global collaborative network.",
      color: "from-emerald-600/10 to-emerald-500/5",
      iconColor: "text-emerald-500",
      href: "/questions"
    },
    { 
      icon: BookOpen, 
      title: "Knowledge Vault", 
      desc: "Access a curated repository of high-fidelity clinical assets and research-grade intellectual vectors.",
      color: "from-indigo-600/10 to-indigo-500/5",
      iconColor: "text-indigo-500",
      href: "/resources"
    },
    { 
      icon: GraduationCap, 
      title: "Executive Mentorship", 
      desc: "Direct link with field-leading clinical architects for career-defining guidance and research mastery.",
      color: "from-amber-600/10 to-amber-500/5",
      iconColor: "text-amber-500",
      href: "/mentors"
    },
    { 
      icon: BrainCircuit, 
      title: "Neural Assist v4", 
      desc: "Elite AI-driven diagnostic synthesis and literature cross-referencing for the modern practitioner.",
      color: "from-emerald-900/10 to-indigo-900/5",
      iconColor: "text-emerald-400",
      href: "/chat"
    }
  ];

  const containers = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Executive Control Header */}
      <motion.header 
        style={{ 
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          backdropFilter: `blur(${headerBlur}px)`
        }}
        className="fixed top-0 w-full z-[100] border-b border-white/10 transition-all duration-700"
      >
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-6 flex justify-between items-center">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="h-14 w-14 bg-slate-900 rounded-[1.2rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] group-hover:bg-emerald-600 transition-all duration-1000 relative">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 rounded-full mx-3 mb-2" />
              <Activity className="text-white h-7 w-7 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black heading tracking-tight text-slate-900 leading-none mb-1">ClinIQ</span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] leading-none">Neural Core v4.0</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-14">
            {['Inquiry', 'Archives', 'Mentors', 'Prestige'].map(navItem => (
              <Link 
                key={navItem} 
                href={`/${navItem === 'Prestige' ? 'leaderboard' : navItem === 'Archives' ? 'resources' : navItem === 'Inquiry' ? 'questions' : navItem.toLowerCase()}`} 
                className="text-[11px] font-black text-slate-500 hover:text-slate-900 transition-all uppercase tracking-[0.3em] relative group"
              >
                {navItem}
                <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-emerald-500 group-hover:w-full transition-all duration-700 rounded-full" />
              </Link>
            ))}
            <div className="h-5 w-[2px] bg-slate-100 mx-2" />
            <Link href="/login" className="text-[11px] font-black text-slate-900 hover:text-emerald-600 transition-colors uppercase tracking-[0.3em]">
              Access Port
            </Link>
            <Link href="/register" className="h-14 px-10 bg-slate-900 text-white text-[11px] font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] uppercase tracking-[0.3em] flex items-center justify-center">
              Initialize Signal
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero: The Aurelius Gateway */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Multidimensional Background Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.06),transparent_60%)] -z-10" />
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none -z-10">
          <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity, rotate: matrixRotate }}
            className="absolute top-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-emerald-500/5 rounded-full blur-[200px] animate-pulse-slow" 
          />
          <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity, rotate: -matrixRotate }}
            className="absolute bottom-[-10%] left-[-5%] w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[180px]" 
          />
        </div>

        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900 text-white shadow-3xl relative overflow-hidden group/pill"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover/pill:opacity-100 transition-opacity" />
                <ShieldCheck className="h-5 w-5 text-emerald-400 relative z-10" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] relative z-10">Consensus-Driven Clinical Matrix</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: "circOut" }}
                className="space-y-8"
              >
                <h1 className="text-7xl lg:text-[7.5rem] font-black tracking-tighter text-slate-900 heading leading-[0.85] text-balance">
                  Engineering <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 via-indigo-700 to-emerald-900 animate-gradient-x">Clinical</span> <br />
                  Perfection.
                </h1>
                <p className="text-2xl lg:text-3xl text-slate-500 leading-tight font-medium max-w-2xl tracking-tight">
                  The high-performance knowledge nexus for the architectural minds in modern medicine. Connect. Contribute. Transcend.
                </p>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="flex flex-col sm:flex-row gap-6 pt-8"
              >
                 <Link href="/register" className="h-[4.5rem] px-12 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl hover:bg-emerald-600 transition-all active:scale-95 group relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                   Initialize Specialization <ArrowRight className="h-5 w-5 group-hover:translate-x-3 transition-transform" />
                 </Link>
                 <Link href="/questions" className="h-[4.5rem] px-12 glass border-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white transition-all active:scale-95 shadow-xl">
                   Explore Consensuses <Network className="h-5 w-5" />
                 </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-8 pt-12"
              >
                <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-12 w-12 rounded-2xl border-4 border-white bg-slate-50 flex items-center justify-center overflow-hidden shadow-xl">
                       <Fingerprint className="h-6 w-6 text-slate-200" />
                    </div>
                  ))}
                </div>
                <div className="h-12 w-[2px] bg-slate-100" />
                <div>
                   <p className="text-sm font-black text-slate-900 leading-none mb-1.5 flex items-center gap-2">
                     <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 1,480+ ACTIVE NODES
                   </p>
                   <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] leading-none">Global Network Consensus Active</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: "circOut" }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 bg-emerald-500/10 rounded-[5rem] blur-3xl animate-pulse-slow" />
              <div className="relative z-10 p-6 glass-dark rounded-[5rem] border-white/10 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.4)] backdrop-blur-3xl">
                 <div className="bg-slate-900 rounded-[4rem] overflow-hidden aspect-[1/1] relative border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-transparent to-emerald-500/30 mix-blend-overlay" />
                    <div className="p-12 h-full flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <div className="space-y-4 w-2/3">
                             <div className="h-8 w-full glass bg-white/5 rounded-xl animate-pulse" />
                             <div className="h-8 w-1/2 glass bg-white/5 rounded-xl animate-pulse [animation-delay:0.2s]" />
                          </div>
                          <div className="h-20 w-20 rounded-[1.5rem] bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                             <Target className="h-10 w-10 text-emerald-400 animate-spin-slow" />
                          </div>
                       </div>
                       
                       <div className="relative flex-1 flex items-center justify-center py-12">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full" 
                          />
                          <Orbit className="h-24 w-24 text-emerald-500 animate-pulse" />
                       </div>

                       <div className="space-y-6">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                             <span>Neural Load</span>
                             <span className="text-emerald-500">88%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} transition={{ delay: 1 }} className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Floating Intelligence Nodes */}
              <motion.div 
                animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
                className="absolute -top-16 -left-16 h-32 w-32 glass rounded-[2.5rem] flex items-center justify-center border-white shadow-3xl z-20 group cursor-help"
              >
                 <ShieldCheck className="h-14 w-14 text-emerald-500 group-hover:scale-110 transition-transform" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
                className="absolute -bottom-16 -right-16 h-40 w-40 glass rounded-[3rem] flex items-center justify-center border-white shadow-3xl z-20 group cursor-help"
              >
                 <Activity className="h-16 w-16 text-indigo-500 group-hover:scale-110 transition-transform" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Clinical Verification Ledger */}
      <section className="py-24 border-y border-slate-100 bg-[#F8F9FB]">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
             <div className="max-w-[280px]">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] leading-[1.6]">Verified Operational Hubs Connecting to Matrix</p>
             </div>
             <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-24 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-1000">
                <span className="text-2xl font-black text-slate-900 heading tracking-tighter uppercase">LEGON MEDICAL CORE</span>
                <span className="text-2xl font-black text-slate-900 heading tracking-tighter uppercase">KNUST SPECIALIST CENTER</span>
                <span className="text-2xl font-black text-slate-900 heading tracking-tighter uppercase">UHAS RESEARCH SYNDICATE</span>
                <span className="text-2xl font-black text-slate-900 heading tracking-tighter uppercase">UDS CLINICAL HUB</span>
             </div>
           </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-56 relative">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-3 w-16 bg-emerald-500 rounded-full" />
                 <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.5em]">OPERATIONAL ARCHITECTURE</span>
              </div>
              <h2 className="text-7xl lg:text-8xl font-black text-slate-900 heading tracking-tight">System Capabilities</h2>
            </div>
            <p className="text-2xl text-slate-500 font-medium max-w-lg leading-tight">Every module is engineered for uncompromising clinical precision and high-fidelity output.</p>
          </div>

          <motion.div 
            variants={containers}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {features.map((f, i) => (
              <motion.div
                variants={item}
                whileHover={{ y: -20, scale: 1.02 }}
                key={i}
                className="glass rounded-[4rem] p-12 border-white hover:border-emerald-300 transition-all duration-700 flex flex-col items-start shadow-2xl hover:bg-white group relative overflow-hidden"
              >
                <div className={cn("absolute -top-16 -right-16 h-48 w-48 bg-slate-900/[0.03] group-hover:bg-emerald-500/[0.05] transition-colors rounded-full blur-[80px]")} />
                <div className={cn("h-20 w-20 rounded-[1.8rem] flex items-center justify-center mb-12 shadow-3xl transition-all group-hover:rotate-12 duration-700 bg-white border border-slate-50", f.iconColor)}>
                  <f.icon className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 heading group-hover:text-emerald-800 transition-colors tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-14 flex-1">{f.desc}</p>
                <Link href={f.href} className="text-[11px] font-black text-slate-900 flex items-center gap-5 group-hover:gap-8 transition-all uppercase tracking-[0.3em] overflow-hidden">
                   <span className="relative z-10">ENAGE MODULE</span> <ArrowRight className="h-5 w-5 text-emerald-600 relative z-10" />
                   <div className="absolute bottom-[-2px] left-0 w-full h-[6px] bg-emerald-500/10 -z-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Neural Integration Visual Hub */}
      <section className="py-56 bg-slate-950 relative overflow-hidden">
         <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.3),transparent_70%)]" />
         <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
         
         <div className="max-w-[1600px] mx-auto px-8 lg:px-16 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-32">
            <div className="lg:max-w-3xl space-y-16">
               <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-5 text-emerald-400"
                  >
                     <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Bot className="h-7 w-7" />
                     </div>
                     <span className="text-xs font-black uppercase tracking-[0.5em]">NEURAL SYNTHESIS ENGINE v4.2</span>
                  </motion.div>
                  <h2 className="text-7xl lg:text-[8rem] font-black text-white heading leading-[0.85] tracking-tighter">Neural <br /> Recognition.</h2>
                  <p className="text-2xl text-slate-400 font-medium leading-[1.3] max-w-2xl">ClinIQ Neural leverages peer-validated clinical models to cross-reference global medical archives in millisecond cycles. Absolute predictive certainty.</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                  <div className="space-y-4">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Prediction Accuracy</span>
                        <span className="text-emerald-500 text-xl font-black heading">99.8%</span>
                     </div>
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '99.8%' }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Network Consensus</span>
                        <span className="text-indigo-500 text-xl font-black heading">Synchronized</span>
                     </div>
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                     </div>
                  </div>
               </div>

               <button className="h-[5rem] px-14 bg-white text-slate-950 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-emerald-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-5 group">
                  INITIALIZE NEURAL CORE <Zap className="h-6 w-6 text-emerald-500 group-hover:text-white animate-pulse" />
               </button>
            </div>

            <div className="relative">
               <div className="absolute -inset-20 bg-emerald-500/20 rounded-full blur-[150px] animate-pulse-slow" />
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 className="h-[500px] w-[500px] lg:h-[750px] lg:w-[750px] relative z-10 opacity-40 pointer-events-none"
               >
                  <Hexagon className="absolute inset-0 h-full w-full text-emerald-500/20 stroke-[1px]" />
                  <div className="absolute inset-24 border-[2px] border-emerald-500/10 rounded-full" />
                  <div className="absolute inset-48 border-[2px] border-indigo-500/10 rounded-full" />
                  <Orbit className="absolute inset-0 m-auto h-40 w-40 text-emerald-500/20" />
               </motion.div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                     <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse" />
                     <Cpu className="h-48 w-48 text-emerald-500 relative z-10 drop-shadow-[0_0_50px_rgba(16,185,129,0.5)]" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Global Performance Matrix */}
      <section className="py-56 relative bg-white">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
           <div className="glass rounded-[6rem] p-20 lg:p-32 border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-32 relative overflow-hidden shadow-[0_120px_200px_-50px_rgba(0,0,0,0.1)]">
              <div className="absolute -top-40 -right-40 h-[600px] w-[600px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
              <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
              
              <div className="max-w-2xl relative z-10 space-y-12">
                 <div className="space-y-6">
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.5em]">NETWORK VELOCITY</span>
                    <h2 className="text-7xl font-black text-slate-900 heading leading-[0.9] tracking-tighter">Clinical Growth <br /> Quantified.</h2>
                 </div>
                 <p className="text-2xl text-slate-500 leading-tight font-medium max-w-lg">Join the world's most sophisticated medical cohort. Precision collaboration is no longer optional.</p>
                 <button className="h-[4.5rem] px-14 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-3xl hover:bg-emerald-600 transition-all duration-700 flex items-center gap-5 group">
                   EXECUTIVE REPORT <ChevronRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-20 lg:gap-32 relative z-10">
                {[
                  { label: "Precision Nodes", val: "1.4K+" },
                  { label: "Vector Assets", val: "6.2K+" },
                  { label: "Field Specialist", val: "112+" },
                  { label: "Matrix Hubs", val: "140+" }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col group/metric">
                    <span className="text-7xl font-black text-slate-900 heading mb-4 tracking-tighter group-hover:text-emerald-500 transition-colors duration-700">{s.val}</span>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">{s.label}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Sovereign Global Footer */}
      <footer className="bg-slate-950 text-white pt-64 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[200px]" />
        
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 mb-48">
            <div className="lg:col-span-6 space-y-16">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-3xl shadow-emerald-500/30">
                  <Activity className="text-white h-9 w-9" />
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black heading tracking-tighter leading-none mb-1">ClinIQ</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] leading-none">INTELLIGENCE MATRIX GLOBAL</span>
                </div>
              </div>
              <p className="text-slate-400 text-3xl leading-[1.1] max-w-xl font-medium tracking-tight">
                Pioneering the next generation of clinical collaboration. Architected for the high-performance medical mind.
              </p>
              <div className="flex gap-6">
                {[Globe, Target, Hexagon, Fingerprint].map((Icon, i) => (
                  <div key={i} className="h-16 w-16 rounded-[1.5rem] glass border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-500 cursor-pointer group">
                    <Icon className="h-7 w-7 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "SYSTEMS", links: ["Inquiry Matrix", "Archives", "Specialist Nexus", "Prestige Ledger"] },
              { title: "GOVERNANCE", links: ["Privacy Core", "Ethics Protocol", "Neural Logic", "Compliance"] }
            ].map((col, i) => (
              <div key={i} className="lg:col-span-3 space-y-14">
                <h5 className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.5em]">{col.title}</h5>
                <ul className="space-y-8">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-lg font-bold text-slate-400 hover:text-white transition-all hover:translate-x-2 inline-block tracking-tight">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-24 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-16">
            <div className="space-y-3 text-center lg:text-left">
               <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">© 2026 CLINIQ MEDICAL SYSTEMS GLOBAL HOLDINGS.</p>
               <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">ARCHITECTED BY MB GOZO BUILDS / OPERATIONS ACROSS 4 CONTINENTS</p>
            </div>
            <div className="flex flex-wrap justify-center gap-12">
               {['GDPR COMPLIANT', 'NEURAL INTEGRITY: 100%', 'SYSTEMS SECURED'].map(item => (
                 <div key={item} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

