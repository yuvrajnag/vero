"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, User, ArrowLeft } from "lucide-react";
import WorkerOnboarding from "@/components/setup/WorkerOnboarding";
import CompanyOnboarding from "@/components/setup/CompanyOnboarding";
import FileScanner from "@/components/setup/FileScanner";

import { useRouter } from "next/navigation";
import { useAuth, getDashboardPath } from "@/lib/auth-context";
import { technicianApi } from "@/lib/api";

export default function SetupPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [selected, setSelected] = useState<"work" | "hire" | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [proceeded, setProceeded] = useState(false);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  // ── Profile detection: if user already has a completed profile, skip setup ──
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (hasCheckedProfile) return;
    
    setHasCheckedProfile(true);
    if (!user?.onboarding_completed) return;

    const role = (user.role ?? "").toLowerCase();
    if (role === "technician") {
      technicianApi
        .me()
        .then(() => router.replace(getDashboardPath(user)))
        .catch(() => {
          /* onboarding flag set but profile missing — stay on setup to finish */
        });
      return;
    }
    router.replace(getDashboardPath(user));
  }, [user, authLoading, isAuthenticated, router, hasCheckedProfile]);

  // ── Boot progress bar ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => setShowCircle(true), 1100);
          }, 800);
          return 100;
        }
        const inc = Math.random() * 12;
        return Math.min(prev + inc, 100);
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const handleComplete = () => {
    setIsScanning(true);
  };

  const titleText = "INITIALIZING YOUR WORKSPACE";

  const content = {
    work: {
      heading: "Get matched with the right opportunities.",
      subtext: "Showcase your skills, availability, and experience while Vero connects you with high-value commercial service operations in real time."
    },
    hire: {
      heading: "Build your workforce with precision.",
      subtext: "Create workforce allocation requests, discover verified technicians, and let Vero intelligently match the best professionals for every task."
    }
  };

  // Show nothing while auth is loading (avoid flash)
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black selection:bg-white selection:text-black antialiased font-sans overflow-hidden text-white">
      
      <AnimatePresence>
        {(proceeded || isScanning) && (
          <motion.div 
            key="top-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 left-0 w-full px-12 pt-8 pb-4 flex justify-between items-center z-[60] pointer-events-auto"
          >
            <div className="text-2xl font-black tracking-widest text-white">
              VERO
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Scanner Animation */}
      <AnimatePresence mode="wait">
        {isScanning && (
          <motion.div
            key="file-scanner"
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="w-full h-full">
              <FileScanner 
                type={selected || "work"} 
                onComplete={() => {
                  if (selected === "work") {
                    router.push("/dashboard/worker");
                  } else if (selected === "hire") {
                    router.push("/dashboard/company");
                  }
                }} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Worker Onboarding Flow */}
      <AnimatePresence>
        {proceeded && selected === "work" && !isScanning && (
          <WorkerOnboarding key="worker-onboarding" onComplete={handleComplete} />
        )}
      </AnimatePresence>

      {/* Company / Hire Onboarding Flow */}
      <AnimatePresence>
        {proceeded && selected === "hire" && !isScanning && (
          <CompanyOnboarding key="company-onboarding" onComplete={handleComplete} />
        )}
      </AnimatePresence>

      {/* Top Title */}
      <div className="absolute top-8 flex w-full justify-center z-40 pointer-events-none">
        <div className="flex gap-2">
          {titleText.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
              animate={showCircle ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
              transition={{
                delay: 5.8 + (i * 0.15),
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-[14px] font-black uppercase tracking-[0.6em] text-zinc-500"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Side Content - Work (Left) */}
      <AnimatePresence mode="wait">
        {selected === "work" && !proceeded && (
          <div className="absolute left-0 top-0 bottom-0 right-[calc(50%+120px)] flex items-center justify-center p-8 z-20 pointer-events-none">
            <motion.div 
              key="work-content"
              className="flex flex-col items-center text-center w-full max-w-[420px] pointer-events-auto"
            >
              <motion.h2 
                initial={{ opacity: 0, filter: "blur(15px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-bold text-white leading-tight tracking-tight"
              >
                {content.work.heading}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-zinc-400 text-base leading-relaxed font-medium mt-4"
              >
                {content.work.subtext}
              </motion.p>
              <motion.button 
                onClick={() => setProceeded(true)}
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 flex items-center justify-center gap-2 px-8 py-3 bg-white text-black text-sm font-bold tracking-wide rounded-full"
              >
                Proceed
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Side Content - Hire (Right) */}
      <AnimatePresence mode="wait">
        {selected === "hire" && !proceeded && (
          <div className="absolute left-[calc(50%+120px)] top-0 bottom-0 right-0 flex items-center justify-center p-8 z-20 pointer-events-none">
            <motion.div 
              key="hire-content"
              className="flex flex-col items-center text-center w-full max-w-[420px] pointer-events-auto"
            >
              <motion.h2 
                initial={{ opacity: 0, filter: "blur(15px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-bold text-white leading-tight tracking-tight"
              >
                {content.hire.heading}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-zinc-400 text-base leading-relaxed font-medium mt-4"
              >
                {content.hire.subtext}
              </motion.p>
              <motion.button 
                onClick={() => setProceeded(true)}
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 flex items-center justify-center gap-2 px-8 py-3 bg-white text-black text-sm font-bold tracking-wide rounded-full"
              >
                Proceed
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          x: proceeded ? (selected === "hire" ? "-50vw" : "50vw") : 0 
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        <AnimatePresence>
          {showCircle && (
            <div className="absolute h-[240px] w-[240px] z-30 pointer-events-none">
              <svg className="absolute inset-0 h-[240px] w-[240px] overflow-visible">
                <motion.circle
                  cx="120"
                  cy="120"
                  r="110"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1.2"
                  fill="transparent"
                  initial={{ pathLength: 0, rotate: -90 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  style={{ transformOrigin: "120px 120px" }}
                />
              </svg>

              {/* RIGHT NODE (Enterprise / Hire) */}
              <motion.div className="absolute inset-0 origin-center" initial={{ rotate: 0 }} animate={{ rotate: 90 }} transition={{ delay: 2.5, duration: 2.0, ease: "easeInOut" }}>
                <motion.div className="absolute" style={{ top: 10, left: 120, x: "-50%", y: "-50%" }} initial={{ rotate: 0 }} animate={{ rotate: -90 }} transition={{ delay: 2.5, duration: 2.0, ease: "easeInOut" }}>
                  <motion.div 
                    onClick={() => {
                      if (proceeded) {
                        setProceeded(false);
                      } else {
                        setSelected(selected === "hire" ? null : "hire");
                      }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: selected === "hire" ? "0 0 20px rgba(255,255,255,0.4)" : "0 0 15px rgba(255,255,255,0.2)",
                      borderColor: selected === "hire" ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)",
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                    className={`flex items-center justify-center border rounded-full overflow-hidden cursor-pointer pointer-events-auto transition-colors duration-300 ${selected === "hire" ? "bg-white text-black border-white" : "bg-black text-white border-white/25"}`}
                    initial={{ width: 12, height: 12, opacity: 0 }}
                    animate={{ width: [12, 12, 40, 115, 115], height: [12, 12, 40, 40, 40], opacity: [0, 1, 1, 1, 1] }}
                    transition={{ 
                      default: { duration: 0.15 },
                      width: { duration: 3.5, delay: 2.0, times: [0, 0.1428, 0.7142, 0.8571, 1], ease: ["linear", "easeInOut", "easeOut", "linear"] },
                      height: { duration: 3.5, delay: 2.0, times: [0, 0.1428, 0.7142, 0.8571, 1], ease: ["linear", "easeInOut", "easeOut", "linear"] },
                      opacity: { duration: 3.5, delay: 2.0, times: [0, 0.1428, 0.7142, 0.8571, 1], ease: ["linear", "easeInOut", "easeOut", "linear"] }
                    }}
                  >
                    <div className="flex items-center justify-center h-full w-full px-4">
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        transition={{ delay: 2.5, duration: 0.5 }} 
                        className={`shrink-0 flex items-center justify-center transition-all duration-300 ${(proceeded && selected === "hire") ? "w-0 opacity-0 scale-0 overflow-hidden" : "w-4 opacity-100 scale-100"}`}
                      >
                        <Building2 size={16} strokeWidth={2.5} className="min-w-[16px]" />
                      </motion.div>
                      <motion.div 
                        initial={{ width: 0, opacity: 0, x: -10 }} 
                        animate={{ width: 40, opacity: 1, x: 0 }} 
                        transition={{ delay: 5.0, duration: 0.5 }} 
                        className="overflow-hidden flex items-center justify-center"
                      >
                        <span className={`text-sm font-bold tracking-wide transition-all duration-300 ${(proceeded && selected === "hire") ? "pl-0" : "pl-2"}`}>
                          {proceeded && selected === "hire" ? "Back" : "Hire"}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* LEFT NODE (Professional / Work) */}
              <motion.div className="absolute inset-0 origin-center" initial={{ rotate: 0 }} animate={{ rotate: 90 }} transition={{ delay: 2.5, duration: 2.0, ease: "easeInOut" }}>
                <motion.div className="absolute" style={{ top: 230, left: 120, x: "-50%", y: "-50%" }} initial={{ rotate: 0 }} animate={{ rotate: -90 }} transition={{ delay: 2.5, duration: 2.0, ease: "easeInOut" }}>
                  <motion.div 
                    onClick={() => {
                      if (proceeded) {
                        setProceeded(false);
                      } else {
                        setSelected(selected === "work" ? null : "work");
                      }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: selected === "work" ? "0 0 20px rgba(255,255,255,0.4)" : "0 0 15px rgba(255,255,255,0.2)",
                      borderColor: selected === "work" ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)",
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                    className={`flex items-center justify-center border rounded-full overflow-hidden cursor-pointer pointer-events-auto transition-colors duration-300 ${selected === "work" ? "bg-white text-black border-white" : "bg-black text-white border-white/25"}`}
                    initial={{ width: 12, height: 12, opacity: 0 }}
                    animate={{ width: [12, 12, 40, 115, 115], height: [12, 12, 40, 40, 40], opacity: [0, 1, 1, 1, 1] }}
                    transition={{ 
                      default: { duration: 0.15 },
                      width: { duration: 3.5, delay: 2.0, times: [0, 0.1428, 0.7142, 0.8571, 1], ease: ["linear", "easeInOut", "easeOut", "linear"] },
                      height: { duration: 3.5, delay: 2.0, times: [0, 0.1428, 0.7142, 0.8571, 1], ease: ["linear", "easeInOut", "easeOut", "linear"] },
                      opacity: { duration: 3.5, delay: 2.0, times: [0, 0.1428, 0.7142, 0.8571, 1], ease: ["linear", "easeInOut", "easeOut", "linear"] }
                    }}
                  >
                    <div className="flex items-center justify-center h-full w-full px-4">
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        transition={{ delay: 2.5, duration: 0.5 }} 
                        className={`shrink-0 flex items-center justify-center transition-all duration-300 ${(proceeded && selected === "work") ? "w-0 opacity-0 scale-0 overflow-hidden" : "w-4 opacity-100 scale-100"}`}
                      >
                        <User size={16} strokeWidth={2.5} className="min-w-[16px]" />
                      </motion.div>
                      <motion.div 
                        initial={{ width: 0, opacity: 0, x: -10 }} 
                        animate={{ width: 45, opacity: 1, x: 0 }} 
                        transition={{ delay: 5.0, duration: 0.5 }} 
                        className="overflow-hidden flex items-center justify-center"
                      >
                        <span className={`text-sm font-bold tracking-wide transition-all duration-300 ${(proceeded && selected === "work") ? "pl-0" : "pl-2"}`}>
                          {proceeded && selected === "work" ? "Back" : "Work"}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

            </div>
          )}
        </AnimatePresence>
        
        {/* Selection Prompt */}
        <AnimatePresence>
          {showCircle && !proceeded && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 6.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[180px] z-20 pointer-events-none whitespace-nowrap"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                Select the appropriate one to proceed
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!proceeded && (
            <motion.div 
              key="center-logo"
              initial={{ opacity: 0, scale: 0.95, rotate: 0 }} 
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: selected === "hire" ? -90 : selected === "work" ? 90 : 0
              }} 
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 1.0, ease: "easeInOut" }} 
              className="z-10 absolute flex h-[220px] w-[220px] items-center justify-center rounded-full pointer-events-none"
            >
              <img src="/logo.png" alt="Vero Logo" className="h-16 w-auto" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-[160px] w-72">
          <AnimatePresence>
            {!isDone && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, filter: "blur(8px)", y: 10 }} transition={{ duration: 1 }} className="flex flex-col items-center">
                <div className="h-[4px] w-full overflow-hidden rounded-full bg-zinc-900 border border-white/5">
                  <motion.div className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)]" />
    </div>
  );
}
