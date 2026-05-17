"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";

type LoadingState = {
  text: string;
  icon?: any;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start w-full mx-auto flex-col px-4">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const isActive = index === value;
        const isCompleted = index < value;
        const StateIcon = loadingState.icon || Circle;
        
        // Focal point logic
        const opacity = Math.max(1 - distance * 0.35, 0);
        const scale = isActive ? 1.1 : 0.9;
        const blur = isActive ? 0 : distance * 2;

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-6 mb-10 items-center h-10 origin-left")}
            animate={{ 
              y: 120 - (value * 80), 
              opacity: opacity,
              scale: scale,
              filter: `blur(${blur}px)`,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
              <AnimatePresence mode="wait">
                {isCompleted ? (
                  <motion.div
                    key="checked"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="text-white"
                  >
                    <CheckCircle2 size={24} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "text-white" : "text-white/40"
                    )}
                  >
                    <StateIcon size={22} strokeWidth={isActive ? 2 : 1.5} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isActive && (
                <motion.div 
                  layoutId="active-glow-main"
                  className="absolute inset-0 bg-white/20 blur-xl rounded-full"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </div>

            <span
              className={cn(
                "text-sm font-medium tracking-normal font-sans transition-all duration-500 whitespace-nowrap",
                isActive ? "text-white" : "text-white/40"
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = false,
  onComplete,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
  onComplete?: () => void;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    if (currentState === loadingStates.length - 1) {
      const timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration, onComplete]);

  return (
    <div className="h-[400px] w-full relative overflow-hidden">
      {/* Cinematic falloff */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none" />
      
      <div className="relative z-0 w-full flex flex-col items-start h-full">
        <LoaderCore value={currentState} loadingStates={loadingStates} />
      </div>
    </div>
  );
};
