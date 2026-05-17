import React from "react";
import { motion } from "framer-motion";
import { 
  User, ShieldCheck, Layers, FileBadge, Cpu, Clock, 
  Fingerprint, Zap, LayoutDashboard, CheckCircle2,
  Building2, ClipboardList, Settings2, Lock, BarChart3
} from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import "./FileScanner.css";

const workLoadingStates = [
  { text: "Initializing workforce profile", icon: User },
  { text: "Verifying professional information", icon: ShieldCheck },
  { text: "Indexing skills and expertise", icon: Layers },
  { text: "Analyzing certifications", icon: FileBadge },
  { text: "Calculating AI match readiness", icon: Cpu },
  { text: "Optimizing availability preferences", icon: Clock },
  { text: "Generating workforce identity", icon: Fingerprint },
  { text: "Activating Vero AI engine", icon: Zap },
  { text: "Preparing personalized dashboard", icon: LayoutDashboard },
  { text: "Workspace initialized successfully", icon: CheckCircle2 },
];

const hireLoadingStates = [
  { text: "Initializing enterprise workspace", icon: Building2 },
  { text: "Verifying organization profile", icon: ShieldCheck },
  { text: "Analyzing operational requirements", icon: ClipboardList },
  { text: "Configuring workforce preferences", icon: Settings2 },
  { text: "Securing company environment", icon: Lock },
  { text: "Activating AI allocation engine", icon: Cpu },
  { text: "Optimizing hiring workflows", icon: Zap },
  { text: "Preparing workforce dashboard", icon: LayoutDashboard },
  { text: "Generating operational insights", icon: BarChart3 },
  { text: "Enterprise workspace initialized", icon: CheckCircle2 },
];

interface FileScannerProps {
  type: "work" | "hire";
  onComplete?: () => void;
}

const FileScanner = ({ type, onComplete }: FileScannerProps) => {
  const loadingStates = type === "work" ? workLoadingStates : hireLoadingStates;
  const heading = type === "work" 
    ? "AI IS ANALYSING YOUR PROFILE" 
    : "INITIALIZING YOUR ENTERPRISE WORKSPACE";
  const subtext = type === "work"
    ? "Syncing workforce data modules"
    : "Syncing workforce management modules";

  return (
    <div id="dup-scanning-files" className="flex flex-col lg:flex-row items-center justify-center w-full h-screen gap-12 lg:gap-24 px-12 bg-black">
      
      {/* Left side: Main Scanner */}
      <div className="flex flex-col items-center gap-12 shrink-0">
        <div className="scanning-wrapper scale-100 lg:scale-110">
          <div className="top-corners"></div>
          <div className="bottom-corners"></div>
          <div className="file-types">
            <div className="file-types-carousel">
              <div className="file-types-track sync-scanner">
                {loadingStates.map((state, i) => {
                  const Icon = state.icon;
                  return <Icon key={i} className="file-icon text-zinc-400" strokeWidth={1} />;
                })}
              </div>
            </div>
          </div>
          <div className="scanner"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white whitespace-nowrap">
            {heading}
          </h3>
          <div className="flex items-center gap-4 w-full opacity-30">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white" />
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white whitespace-nowrap">
              {subtext}
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white" />
          </div>
        </motion.div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block w-[1px] h-[300px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      {/* Right side: Multi-Step Loader */}
      <div className="w-full max-w-[500px] relative h-[450px] flex items-center justify-center">
        <div className="w-full overflow-visible">
          <MultiStepLoader 
            loadingStates={loadingStates} 
            loading={true} 
            duration={3500} 
            loop={false}
            onComplete={onComplete}
          />
        </div>
      </div>

    </div>
  );
};

export default FileScanner;
