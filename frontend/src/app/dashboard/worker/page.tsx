"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  LayoutDashboard, Compass, ClipboardList, Handshake, 
  PanelLeftClose, PanelLeftOpen, LogOut, Info, ChevronDown,
  Briefcase, Wallet, CheckCircle2, X, Moon,
  Folder, MessageSquare, HandHelping, Star, FileText, FileCheck
} from "lucide-react";
import { useAuth, ProtectedRoute } from "@/lib/auth-context";
import { useWorkerDashboard } from "@/hooks/use-worker-dashboard";
import { technicianApi } from "@/lib/api";
import { WorkerDashboardTabs } from "@/components/dashboard/WorkerDashboardTabs";

function availabilityPayload(label: string) {
  switch (label) {
    case "Idle":
      return { is_online: true, current_status: "idle" };
    case "Do Not Disturb":
      return { is_online: true, current_status: "dnd" };
    case "Invisible":
      return { is_online: false, current_status: "offline" };
    default:
      return { is_online: true, current_status: "online" };
  }
}

// Custom Solid Brutalist Components using native filled Lucide vectors (stable, sharp, and aligned perfectly)
const OpportunitiesIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <Compass size={size} fill="currentColor" strokeWidth={1.5} className={`shrink-0 text-zinc-100 ${className}`} />
);

const AssignmentsIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <Briefcase size={size} fill="currentColor" strokeWidth={1.5} className={`shrink-0 text-zinc-100 ${className}`} />
);

const NegotiationsIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <MessageSquare size={size} fill="currentColor" strokeWidth={1.5} className={`shrink-0 text-zinc-100 ${className}`} />
);

export default function WorkerDashboard() {
  const { user, logout } = useAuth();
  const { profile, opportunities, assignments, negotiations, walletBalance, loading, refresh } =
    useWorkerDashboard(user?.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const [availability, setAvailability] = useState("Online");
  const [statusMessage, setStatusMessage] = useState("Active and searching for matches");

  useEffect(() => {
    if (profile?.custom_status_message) {
      setStatusMessage(profile.custom_status_message);
    }
    if (profile) {
      setAvailability(profile.is_online ? "Online" : "Invisible");
    }
  }, [profile]);
  const [autoNegotiation, setAutoNegotiation] = useState(true);
  const [expiration, setExpiration] = useState("Never");
  const [visibility, setVisibility] = useState("Everyone");
 
  // Status modal and hover states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isStatusHovered, setIsStatusHovered] = useState(false);
 
  // Temporary/draft states inside Edit Modal
  const [tempAvailability, setTempAvailability] = useState("Online");
  const [tempStatusMessage, setTempStatusMessage] = useState("Active and searching for matches");
  const [tempAutoNegotiation, setTempAutoNegotiation] = useState(true);
  const [tempExpiration, setTempExpiration] = useState("Never");
  const [tempVisibility, setTempVisibility] = useState("Everyone");
 
  const navigationItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Opportunities", icon: <OpportunitiesIcon size={18} /> },
    { name: "Assignments", icon: <AssignmentsIcon size={18} /> },
    { name: "Negotiations", icon: <NegotiationsIcon size={18} /> },
  ];

  // Custom Discord-style Preset Options
  const statusOptions = [
    { 
      label: "Online", 
      color: "bg-emerald-500", 
      desc: "Active and available for workforce match requests.",
      iconName: "online"
    },
    { 
      label: "Idle", 
      color: "bg-amber-500", 
      desc: "Delay active matching. Vero will notify you later.",
      iconName: "idle"
    },
    { 
      label: "Do Not Disturb", 
      color: "bg-rose-500", 
      desc: "Mute all notifications, decline instant matching requests.",
      iconName: "dnd"
    },
    { 
      label: "Invisible", 
      color: "bg-zinc-500", 
      desc: "Appear offline. Vetting algorithms run in background quietly.",
      iconName: "invisible"
    }
  ];

  // Helper to resolve Tailwind color mappings
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "bg-emerald-500";
      case "Idle": return "bg-amber-500";
      case "Do Not Disturb": return "bg-rose-500";
      case "Invisible": return "bg-zinc-500";
      default: return "bg-emerald-500";
    }
  };

  // Premium Custom Status Icons Renderer
  const renderStatusIcon = (status: string, sizeClass = "w-3.5 h-3.5") => {
    switch (status) {
      case "Online":
        return <span className={`${sizeClass} rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]`} />;
      case "Idle":
        return <Moon className={`text-amber-500 fill-amber-500 shrink-0 ${sizeClass === "w-3.5 h-3.5" ? "w-3.5 h-3.5" : "w-2.5 h-2.5"}`} />;
      case "Do Not Disturb":
        return (
          <div className={`${sizeClass} rounded-full bg-rose-500 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.4)]`}>
            <div className="w-[60%] h-0.5 bg-black rounded" />
          </div>
        );
      case "Invisible":
        return <div className={`${sizeClass} rounded-full border-2 border-zinc-550 bg-transparent shrink-0`} />;
      default:
        return <span className={`${sizeClass} rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]`} />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["technician"]}>
      <div className="flex h-screen w-screen premium-bg text-white font-sans overflow-hidden selection:bg-zinc-800 selection:text-white antialiased">
      
      {/* Background Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] bg-zinc-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] bg-zinc-900/10 blur-[150px] rounded-full" />
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 76 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="h-full bg-[#121212] flex flex-col justify-between relative z-20 shrink-0 select-none"
      >
        <div>
          {/* Top Logo & Closer/Opener Header */}
          <div className={`h-16 flex items-center overflow-hidden w-full px-5 transition-all duration-300 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            
            {/* Logo container (fades & shrinks smoothly) */}
            <motion.div
              animate={{ 
                width: isSidebarOpen ? "auto" : 0,
                opacity: isSidebarOpen ? 1 : 0,
                x: isSidebarOpen ? 0 : -15
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 overflow-hidden shrink-0"
            >
              <span className="text-lg font-black tracking-[0.25em] text-white">VERO</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono">BETA</span>
            </motion.div>

            {/* Toggle Button */}
            <motion.button 
              layout="position"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-zinc-900 rounded-md text-zinc-500 hover:text-white transition-colors shrink-0"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </motion.button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 flex flex-col gap-1.5">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center rounded-xl relative w-full transition-colors duration-200 group ${
                    isSidebarOpen ? 'px-3.5 py-3 gap-3.5' : 'p-3 justify-center'
                  } ${
                    isActive ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {/* Sliding active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-zinc-900/40 border border-zinc-800/80 rounded-xl z-0 shadow-[0_0_12px_rgba(255,255,255,0.015)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={`relative z-10 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors shrink-0`}>
                    {item.icon}
                  </div>
                  
                  {/* Label (fades & masks width smoothly) */}
                  <motion.span
                    animate={{ 
                      width: isSidebarOpen ? "auto" : 0,
                      opacity: isSidebarOpen ? 1 : 0,
                      x: isSidebarOpen ? 0 : -10
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xs uppercase tracking-wider font-bold overflow-hidden whitespace-nowrap relative z-10"
                  >
                    {item.name}
                  </motion.span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-3">
          <div className={`flex items-center rounded-xl transition-all duration-300 group relative w-full border border-transparent ${
            isSidebarOpen 
              ? 'p-2.5 hover:bg-zinc-900/40 hover:border-zinc-800 justify-between' 
              : 'p-2.5 justify-center'
          }`}>
            
            <Link href="/dashboard/profile" className={`flex items-center min-w-0 overflow-hidden shrink-0 transition-all duration-300 ${
              isSidebarOpen ? 'gap-3' : 'gap-0'
            }`}>
              {/* User Avatar (fully stable and persistent) */}
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white relative shrink-0 uppercase">
                {user?.full_name ? user.full_name.substring(0, 2) : "WK"}
                <div className="absolute bottom-[-1px] right-[-1px] w-3.5 h-3.5 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-950 z-10 shrink-0">
                  {renderStatusIcon(availability, "w-2 h-2")}
                </div>
              </div>
              
              {/* User Identity Details (fades & masks width smoothly) */}
              <motion.div
                animate={{ 
                  width: isSidebarOpen ? "auto" : 0,
                  opacity: isSidebarOpen ? 1 : 0,
                  x: isSidebarOpen ? 0 : -10
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`overflow-hidden whitespace-nowrap flex flex-col justify-center shrink-0 ${
                  isSidebarOpen ? 'pr-6' : 'pr-0'
                }`}
              >
                <p className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors leading-none">{user?.full_name || "Worker"}</p>
                <p className="text-[9px] font-mono text-zinc-500 mt-1 leading-none uppercase">ID: {user?.id?.substring(0, 7) || "V-00000"}</p>
              </motion.div>
            </Link>



            {/* Logout Button (positioned absolutely to avoid flex flow disruption) */}
            <motion.button 
              onClick={logout}
              animate={{ 
                opacity: isSidebarOpen ? 1 : 0,
                scale: isSidebarOpen ? 1 : 0,
                x: isSidebarOpen ? 0 : 15
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-2 p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-md transition-all shrink-0 overflow-hidden"
              style={{ pointerEvents: isSidebarOpen ? "auto" : "none" }}
              title="Logout"
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT WORKSPACE --- */}
      <div className="flex-1 h-full flex flex-col bg-black relative z-10 overflow-hidden">
        
        {/* Workspace Body Area */}
        <main className="flex-1 w-full h-full relative z-10 overflow-y-auto pt-5 px-6 pb-6 lg:pt-6 lg:px-8 lg:pb-8 scrollbar-hide">
          
          {/* Subtle Retro-Brutalist Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none z-0" />

          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" ? (
              <motion.div
                key="dashboard-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto space-y-6 relative z-10"
              >
                
                {/* --- BIG RECTANGLE WELCOME CARD --- */}
                <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-950 to-zinc-900/40 backdrop-blur-xl py-3 px-5 md:py-3.5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 group min-h-[100px] z-20 hover:border-zinc-700/80 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.01)]">
                  
                  {/* Decoupled Background Container to clip grid lines safely without cropping dropdown */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                    {/* Brutalist Tech-Grid Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:1.25rem_1.25rem] opacity-50" />
                    
                    {/* Sexy Repeating Matrix Dotted Mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:8px_8px] opacity-80" />
                    
                    {/* Animated Sweeping Laser Scanner Line */}
                    <motion.div
                      animate={{ y: ["0%", "280%"] }}
                      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                      className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent pointer-events-none"
                    />

                    {/* Slow-Drift Silver Ambient Depth Orbs */}
                    <motion.div
                      animate={{ x: [-15, 15], y: [-8, 8] }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 7, ease: "easeInOut" }}
                      className="absolute top-[-10%] left-[15%] w-40 h-40 bg-white/[0.01] rounded-full blur-xl pointer-events-none"
                    />
                    <motion.div
                      animate={{ x: [15, -15], y: [8, -8] }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 9, ease: "easeInOut" }}
                      className="absolute bottom-[-10%] right-[25%] w-40 h-40 bg-zinc-300/[0.012] rounded-full blur-xl pointer-events-none"
                    />
                  </div>
                  
                  {/* Content Left */}
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <h2 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
                      <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Welcome back, {user?.full_name?.split(" ")[0] || "Worker"}</span>
                    </h2>
                    <p className="text-zinc-400 mt-1 text-xs leading-relaxed max-w-[460px]">
                      Your workforce profile is active and available for AI-based workforce matching.
                    </p>
                  </div>

                  {/* User Uploaded Profile Icon / Avatar */}
                  <div className="relative z-10 w-18 h-18 md:w-20 md:h-20 flex items-center justify-center shrink-0">
                    {/* Glowing Grayscale Ambient Backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700/5 to-zinc-400/5 opacity-40 rounded-full blur-xl pointer-events-none" />
                    
                    {/* Circle Container holding either Uploaded Image or Initials */}
                    <div className="w-full h-full rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center font-black text-xl md:text-2xl text-zinc-300 shadow-[0_0_30px_rgba(255,255,255,0.02)] relative overflow-hidden select-none uppercase">
                      {/* Standard Profile Picture Render */}
                      <span className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent font-sans tracking-tight">{user?.full_name ? user.full_name.substring(0, 2) : "WK"}</span>

                    </div>

                    {/* Unified Status Dot Wrapper Anchor */}
                    <div className="absolute bottom-0 right-0 w-4.5 h-4.5 z-20">
                      
                      {/* Status Circle Dot Button (pulses slightly, opens Modal on click) */}
                      <button
                        onMouseEnter={() => setIsStatusHovered(true)}
                        onMouseLeave={() => setIsStatusHovered(false)}
                        onClick={() => {
                          // Pre-populate modal temporary states
                          setTempAvailability(availability);
                          setTempStatusMessage(statusMessage);
                          setTempAutoNegotiation(autoNegotiation);
                          setTempExpiration(expiration);
                          setTempVisibility(visibility);
                          setIsStatusModalOpen(true);
                        }}
                        className="w-full h-full rounded-full border-2 border-black bg-zinc-950 hover:bg-zinc-900 flex items-center justify-center cursor-pointer shadow-lg active:scale-95 hover:scale-110 transition-transform duration-200"
                      >
                        {renderStatusIcon(availability, "w-2.5 h-2.5")}
                      </button>

                      {/* Mathematically Centered Glassmorphic Tooltip (slides down perfectly below the dot) */}
                      <AnimatePresence>
                        {isStatusHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.95 }}
                            transition={{ duration: 0.12 }}
                            className="absolute top-7 left-1/2 -translate-x-1/2 bg-zinc-950/95 border border-zinc-900/80 px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider text-zinc-300 shadow-2xl flex items-center gap-1.5 pointer-events-none whitespace-nowrap z-30 font-sans"
                          >
                            {renderStatusIcon(availability, "w-1.5 h-1.5")}
                            {availability}
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>

                </div>

                {/* --- SLEEK LOW-PROFILE EMPTY GRAPH METRIC & COMPACT EARNINGS METRIC (Zero-Scroll Viewport Fit) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
                  
                  {/* Left Column 1-3: Sleek Monochromatic Empty Graph Holder */}
                  <div className="lg:col-span-3 relative rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4 transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[160px] hover:border-zinc-700/80 shadow-[0_0_20px_rgba(255,255,255,0.005)]">
                    {/* Header (No horizontal line) */}
                    <div className="flex items-center justify-between pb-2 shrink-0">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        AI MATCH RATE & SYSTEM INDEX
                      </h4>
                      <span className="text-[7px] font-mono bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded uppercase tracking-wider">
                        Standby
                      </span>
                    </div>

                    {/* Low-profile Graph Area */}
                    <div className="flex-1 flex gap-2 items-center justify-between relative pt-3 pb-1 min-h-[100px] overflow-hidden">
                      
                      {/* Gridline background markings - clearly defined mockup Y-axis values */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 py-2.5 z-0">
                        <div className="w-full border-t border-dashed border-zinc-850 flex justify-between"><span className="text-[6px] font-mono text-zinc-650 -mt-1.5">100%</span></div>
                        <div className="w-full border-t border-dashed border-zinc-850 flex justify-between"><span className="text-[6px] font-mono text-zinc-650 -mt-1.5">75%</span></div>
                        <div className="w-full border-t border-dashed border-zinc-850 flex justify-between"><span className="text-[6px] font-mono text-zinc-650 -mt-1.5">50%</span></div>
                        <div className="w-full border-t border-dashed border-zinc-850 flex justify-between"><span className="text-[6px] font-mono text-zinc-650 -mt-1.5">25%</span></div>
                      </div>

                      {/* Technical Mockup/Empty Graph Center Indicator */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 pt-1">
                        <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-850 rounded-full px-3 py-1 shadow-2xl">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-ping shrink-0" />
                          <span className="text-[8px] font-bold tracking-[0.18em] font-sans text-zinc-450 uppercase">
                            Awaiting Platform Operations Log
                          </span>
                        </div>
                      </div>

                      {/* Overlay label indices for days (clean layout at bottom) */}
                      <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[7px] font-mono text-zinc-550 z-20 pointer-events-none select-none">
                        <span>MON (--)</span>
                        <span>TUE (--)</span>
                        <span>WED (--)</span>
                        <span>THU (--)</span>
                        <span>FRI (--)</span>
                        <span>SAT (--)</span>
                        <span>SUN (--)</span>
                      </div>

                    </div>
                  </div>

                  {/* Right Column 4: Sleek Compact Earnings Card with clearly visible border */}
                  <div className="lg:col-span-1 relative rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4 transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[160px] hover:border-zinc-700/80 shadow-[0_0_20px_rgba(255,255,255,0.005)]">
                    {/* Glowing Accent Decor (Silver/Zinc ambient glow in corner) */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                    
                    {/* Header (No horizontal line) */}
                    <div className="flex items-center justify-between pb-2 shrink-0">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                        <Wallet size={11} className="text-zinc-400" />
                        Earnings
                      </h4>
                      <span className="text-[7px] font-mono bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded uppercase tracking-wider">
                        Gross
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center py-2">
                      <p className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest leading-none">Net Account Balance</p>
                      <h3 className="text-2xl font-black mt-1.5 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight leading-none">
                        ₹{walletBalance.toLocaleString()}
                      </h3>
                    </div>

                    {/* Subtext Footer (No horizontal line) */}
                    <div className="pt-1.5 flex items-center justify-between text-[7px] font-mono text-zinc-550 shrink-0">
                      <span>AUTO-LEDGER: ACTIVE</span>
                    </div>
                  </div>

                </div>

                {/* --- DOCKING CARDS GRID (1 Big Left, 2 Small Right stacked - Mogli Silver & Zero-Scroll Fit) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10 items-stretch min-h-[400px]">
                  
                  {/* Left Big Opportunities Box (Spans 2 columns) */}
                  <div className="lg:col-span-2 relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 hover:border-zinc-700/80 p-4 transition-all duration-300 flex flex-col justify-between group min-h-[400px] shadow-[0_0_20px_rgba(255,255,255,0.003)] overflow-hidden">
                    {/* Glowing Silver Decor Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-400/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 shrink-0">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <OpportunitiesIcon size={12} className="text-zinc-400" />
                        <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Opportunities</span>
                      </h4>
                      <span className="text-[7px] font-mono bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded uppercase tracking-wider">
                        Live Match
                      </span>
                    </div>
                    
                    {/* Content (Centered and spaced beautifully) */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4 px-3">
                      <div className="w-11 h-11 rounded-full bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-[0_0_15px_rgba(255,255,255,0.01)] group-hover:scale-105 transition-transform duration-300 mb-2.5 relative">
                        <OpportunitiesIcon size={18} className="animate-pulse" />
                      </div>
                      <h5 className="text-[10px] font-bold text-zinc-300">
                        {loading ? "Loading opportunities…" : opportunities.length === 0 ? "No matching opportunities yet" : `${opportunities.length} open request(s)`}
                      </h5>
                    </div>
                  </div>

                  {/* Right Column containing 2 stacked smaller boxes */}
                  <div className="lg:col-span-1 flex flex-col gap-4 justify-between">
                    
                    {/* Top Right: Assignments Box */}
                    <div className="flex-1 relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 hover:border-zinc-700/80 p-3.5 transition-all duration-300 flex flex-col justify-between group min-h-[192px] shadow-[0_0_20px_rgba(255,255,255,0.003)] overflow-hidden">
                      {/* Glowing Silver Decor Accent */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-zinc-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                      
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 shrink-0">
                        <h4 className="text-[9px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <AssignmentsIcon size={11} className="text-zinc-400" />
                          <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Assignments</span>
                        </h4>
                        <span className="text-[7px] font-mono bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded uppercase tracking-wider">
                          Active
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-1.5 px-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-zinc-450 mb-1.5 shrink-0 relative">
                          <AssignmentsIcon size={14} />
                        </div>
                        <h5 className="text-[9px] font-bold text-zinc-300">
                          {assignments.length === 0 ? "No active assignments" : `${assignments.length} active`}
                        </h5>
                      </div>
                    </div>

                    {/* Bottom Right: Negotiations Box */}
                    <div className="flex-1 relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 hover:border-zinc-700/80 p-3.5 transition-all duration-300 flex flex-col justify-between group min-h-[192px] shadow-[0_0_20px_rgba(255,255,255,0.003)] overflow-hidden">
                      {/* Glowing Silver Decor Accent */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-zinc-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                      
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 shrink-0">
                        <h4 className="text-[9px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <NegotiationsIcon size={11} className="text-zinc-400" />
                          <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Negotiations</span>
                        </h4>
                        <span className="text-[7px] font-mono bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded uppercase tracking-wider">
                          AI Ledger
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-1.5 px-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-zinc-450 mb-1.5 shrink-0 relative">
                          <NegotiationsIcon size={14} />
                        </div>
                        <h5 className="text-[9px] font-bold text-zinc-300">
                          {negotiations.length === 0 ? "No active negotiations" : `${negotiations.length} active`}
                        </h5>
                      </div>
                    </div>

                  </div>

                </div>

              </motion.div>
            ) : (
              /* Borderless spacious centered monochromatic view for active sidebar tabs - Large Brutalist Outlines */
              <motion.div
                key={`tab-content-${activeTab}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex flex-col items-center justify-center relative z-10 min-h-[460px] px-4 py-8"
              >
                <WorkerDashboardTabs
                  activeTab={activeTab}
                  loading={loading}
                  opportunities={opportunities}
                  assignments={assignments}
                  negotiations={negotiations}
                  onRefresh={refresh}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* --- WORKFORCE STATUS EDIT MODAL (Custom Brutalist GitHub Style for Vero) --- */}
      <AnimatePresence>
        {isStatusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"
            />
                    {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-zinc-950 border border-zinc-900/60 w-full max-w-[490px] rounded-2xl shadow-2xl p-5 relative overflow-hidden text-left z-10 flex flex-col gap-3.5 font-sans"
            >
              {/* Subtle Grid Lines inside Modal */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0e_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0e_1px,transparent_1px)] bg-[size:2rem] opacity-30 pointer-events-none z-0" />

              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-zinc-900/50 pb-3 relative z-10">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Edit discoverability status
                </h3>
                <button 
                  onClick={() => setIsStatusModalOpen(false)}
                  className="p-1 hover:bg-zinc-900 rounded-md text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Status Custom Message input & Presets */}
              <div className="flex flex-col gap-2.5 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">What's happening?</span>
                
                {/* Input field wrapper */}
                <div className="flex items-center gap-2.5 bg-zinc-900/40 border border-zinc-900 focus-within:border-zinc-800 rounded-xl px-3 py-2 transition-all">
                  <div className="shrink-0 select-none flex items-center justify-center">
                    {renderStatusIcon(tempAvailability, "w-3 h-3")}
                  </div>
                  <input
                    type="text"
                    value={tempStatusMessage}
                    onChange={(e) => setTempStatusMessage(e.target.value)}
                    placeholder="Set custom matching message..."
                    className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-550 w-full p-0 font-medium"
                    maxLength={72}
                  />
                  <span className="text-[8px] font-mono text-zinc-650 shrink-0 select-none">
                    {72 - tempStatusMessage.length} ch
                  </span>
                </div>

                {/* Preset status quick selections (Discord style 2x2 grid for height efficiency) */}
                <div className="grid grid-cols-2 gap-2 mt-0.5 select-none">
                  {statusOptions.map((opt) => {
                    const isSelected = tempAvailability === opt.label;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setTempAvailability(opt.label);
                          setTempStatusMessage(opt.desc);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 group ${
                          isSelected 
                            ? "bg-zinc-900/40 border-zinc-800 text-white" 
                            : "bg-zinc-950 border-zinc-900/30 hover:border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Left Custom Status Icon */}
                          <div className="shrink-0 flex items-center justify-center">
                            {renderStatusIcon(opt.label, "w-3 h-3")}
                          </div>
                          <span className="text-[11px] font-bold tracking-wide">{opt.label}</span>
                        </div>

                        {/* Right Radio Indicator */}
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isSelected 
                            ? "border-emerald-500 bg-emerald-500/10" 
                            : "border-zinc-900 group-hover:border-zinc-800 bg-transparent"
                        }`}>
                          {isSelected && (
                            <motion.div 
                              layoutId="active-radio-dot"
                              className="w-1 h-1 rounded-full bg-emerald-400" 
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Auto-negotiation Toggle Row */}
              <div className="flex items-center justify-between bg-zinc-900/10 border border-zinc-900/40 rounded-xl px-3.5 py-2.5 relative z-10">
                <div className="flex flex-col gap-0.5 select-none text-left">
                  <span className="text-[11px] font-bold text-zinc-200">Active Auto-Negotiation</span>
                  <span className="text-[9px] text-zinc-550">Vero's AI will auto-vet matched organization requests</span>
                </div>
                <input
                  type="checkbox"
                  id="auto-negotiate"
                  checked={tempAutoNegotiation}
                  onChange={(e) => setTempAutoNegotiation(e.target.checked)}
                  className="rounded border-zinc-900 bg-zinc-900 text-emerald-500 focus:ring-0 w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Time Expiration & Visibility Scopes (With custom Chevron down designs) */}
              <div className="grid grid-cols-2 gap-3.5 relative z-10 text-left">
                {/* Expiration selection */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Expiration</span>
                  <div className="relative">
                    <select
                      value={tempExpiration}
                      onChange={(e) => setTempExpiration(e.target.value)}
                      className="w-full bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-xl pl-3.5 pr-8 py-2 text-xs text-zinc-350 focus:ring-0 focus:outline-none appearance-none cursor-pointer font-sans"
                    >
                      <option value="Never">Never</option>
                      <option value="1 Hour">For 1 Hour</option>
                      <option value="4 Hours">For 4 Hours</option>
                      <option value="24 Hours">For 24 Hours</option>
                    </select>
                    <ChevronDown size={12} className="text-zinc-550 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Visible scope selection */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-zinc-550">Visible to</span>
                  <div className="relative">
                    <select
                      value={tempVisibility}
                      onChange={(e) => setTempVisibility(e.target.value)}
                      className="w-full bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-xl pl-3.5 pr-8 py-2 text-xs text-zinc-350 focus:ring-0 focus:outline-none appearance-none cursor-pointer font-sans"
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="Vetted Only">Vetted Orgs Only</option>
                    </select>
                    <ChevronDown size={12} className="text-zinc-550 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex items-center justify-end gap-2 border-t border-zinc-900/40 pt-3.5 mt-1 relative z-10">
                <button
                  onClick={() => {
                    setTempAvailability("Online");
                    setTempStatusMessage("Active and available for workforce match requests.");
                    setTempAutoNegotiation(true);
                    setTempExpiration("Never");
                    setTempVisibility("Everyone");
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-xl transition-colors"
                >
                  Clear status
                </button>
                
                <button
                  onClick={async () => {
                    const payload = availabilityPayload(tempAvailability);
                    try {
                      await technicianApi.updateAvailability({
                        ...payload,
                        custom_status_message: tempStatusMessage,
                      });
                      setAvailability(tempAvailability);
                      setStatusMessage(tempStatusMessage);
                      setAutoNegotiation(tempAutoNegotiation);
                      setExpiration(tempExpiration);
                      setVisibility(tempVisibility);
                      setIsStatusModalOpen(false);
                      await refresh();
                    } catch {
                      /* keep modal open on failure */
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] font-sans"
                >
                  Set status
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </ProtectedRoute>
  );
}
