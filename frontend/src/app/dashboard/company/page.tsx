"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  LayoutDashboard, ClipboardList, Users, Handshake, Building2,
  PanelLeftClose, PanelLeftOpen, LogOut, Sparkles, Send,
  MapPin, DollarSign, Calendar, ShieldCheck, Link2, ExternalLink,
  X, Plus, AlertCircle, RefreshCw, Star, Info, MessageSquare,
  Globe, Shield, FileText, CheckCircle2, ChevronRight, Edit2,
  Mail, Phone, Clock
} from "lucide-react";

export default function CompanyDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);

  // Mock initial requests
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      role: "HVAC Technician",
      skills: ["HVAC Maintenance", "Thermostats", "Ventilation"],
      budget: "4500",
      location: "Hyderabad",
      urgency: "Urgent",
      duration: "15 Days",
      status: "Matching Active",
      assignedWorker: null
    },
    {
      id: "REQ-002",
      role: "Senior Electrician",
      skills: ["Industrial Wiring", "Safety Standards", "Power Systems"],
      budget: "6000",
      location: "Bangalore",
      urgency: "Medium",
      duration: "30 Days",
      status: "Assigned",
      assignedWorker: "Alok Kumar"
    }
  ]);

  // Mock workforce
  const [workforce, setWorkforce] = useState([
    {
      id: "W-109",
      name: "Alok Kumar",
      role: "Senior Electrician",
      status: "Active",
      assignment: "Power Grid Install (Bangalore)",
      duration: "30 Days (24 remaining)",
    },
    {
      id: "W-110",
      name: "Priya Sharma",
      role: "Plumbing Consultant",
      status: "Active",
      assignment: "Water Main Overhaul (Chennai)",
      duration: "10 Days (2 remaining)",
    }
  ]);

  // Mock negotiations
  const [negotiations, setNegotiations] = useState([
    {
      id: "NEG-902",
      requestTitle: "HVAC Maintenance Request",
      workerName: "Rahul Sharma",
      role: "HVAC Specialist",
      originalRate: "₹4500/day",
      counterRate: "₹4200/day",
      status: "Counter offer pending",
      aiRecommendation: "High agreement probability at ₹4200/day."
    }
  ]);

  // Mock company profile
  const [companyProfile, setCompanyProfile] = useState({
    name: "ABC Facilities Pvt Ltd",
    industry: "Facility Management & Infrastructure",
    location: "Bangalore, IN (HQ)",
    email: "ops@abcfacilities.com",
    phone: "+91 80 4992 0012",
    hiringPreferences: "On-site, Hybrid, High urgency vetting preference",
    website: "https://abcfacilities.com",
    verificationStatus: "Verified Partner",
    orgDetails: "Leading facility operations provider servicing 150+ corporate clients across India."
  });

  const [editProfileDraft, setEditProfileDraft] = useState({ ...companyProfile });

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "CO";
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  // Create Request form state
  const [formRole, setFormRole] = useState("");
  const [formSkills, setFormSkills] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formUrgency, setFormUrgency] = useState("Urgent");
  const [formDuration, setFormDuration] = useState("");
  const [formCertifications, setFormCertifications] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // AI Matching animation states
  const [isMatching, setIsMatching] = useState(false);
  const [matchStep, setMatchStep] = useState(0);
  const [showMatchResults, setShowMatchResults] = useState(false);

  const matchSteps = [
    "analyzing workforce requirements...",
    "calculating technician compatibility vectors...",
    "checking global availability registers...",
    "optimizing budget fit index..."
  ];

  useEffect(() => {
    if (isMatching) {
      const interval = setInterval(() => {
        setMatchStep((prev) => {
          if (prev >= matchSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsMatching(false);
              setShowMatchResults(true);
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isMatching]);

  const handleRunAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRole || !formBudget || !formLocation) return;
    setIsMatching(true);
    setMatchStep(0);
    setShowMatchResults(false);
  };

  const handleSaveRequest = () => {
    // Add new request to mock state
    const newReq = {
      id: `REQ-00${requests.length + 1}`,
      role: formRole,
      skills: formSkills.split(",").map(s => s.trim()),
      budget: formBudget,
      location: formLocation,
      urgency: formUrgency,
      duration: formDuration || "Flexible",
      status: "Matching Active",
      assignedWorker: null
    };
    setRequests([newReq, ...requests]);
    // Reset form
    setFormRole("");
    setFormSkills("");
    setFormBudget("");
    setFormLocation("");
    setFormDuration("");
    setFormCertifications("");
    setFormDescription("");
    setShowMatchResults(false);
    setActiveTab("Dashboard");
  };

  const navigationItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Requests", icon: <ClipboardList size={18} /> },
    { name: "Workforce", icon: <Users size={18} /> },
    { name: "Negotiations", icon: <Handshake size={18} /> },
    { name: "Profile", icon: <Building2 size={18} /> },
  ];

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden selection:bg-white selection:text-black antialiased">
      
      {/* Background Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] bg-zinc-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] bg-zinc-900/20 blur-[150px] rounded-full" />
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 76 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="h-full bg-[#121212] flex flex-col justify-between relative z-25 shrink-0 select-none"
      >
        <div>
          {/* Top Logo & Close/Open Button */}
          <div className={`h-16 flex items-center overflow-hidden w-full px-5 transition-all duration-300 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
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

            <motion.button 
              layout="position"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-zinc-900 rounded-md text-zinc-500 hover:text-white transition-colors shrink-0"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
                  onClick={() => {
                    setActiveTab(item.name);
                    setShowMatchResults(false);
                    setIsMatching(false);
                  }}
                  className={`flex items-center rounded-xl relative w-full transition-colors duration-200 group ${
                    isSidebarOpen ? 'px-3.5 py-3 gap-3.5' : 'p-3 justify-center'
                  } ${
                    isActive ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill-company"
                      className="absolute inset-0 bg-zinc-900/40 border border-zinc-800/80 rounded-xl z-0 shadow-[0_0_12px_rgba(255,255,255,0.015)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className={`relative z-10 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors shrink-0`}>
                    {item.icon}
                  </div>
                  
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

        {/* Bottom Profile Details */}
        <div className="p-3">
          <div className={`flex items-center rounded-xl transition-all duration-300 group relative w-full border border-transparent ${
            isSidebarOpen 
              ? 'p-2.5 hover:bg-zinc-900/40 hover:border-zinc-800 justify-between' 
              : 'p-2.5 justify-center'
          }`}>
            <div 
              onClick={() => {
                setActiveTab("Profile");
                setShowMatchResults(false);
                setIsMatching(false);
              }}
              className="flex items-center min-w-0 overflow-hidden shrink-0 gap-3 cursor-pointer group/identity"
            >
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white relative shrink-0">
                {getInitials(companyProfile.name)}
                <div className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121212]" />
              </div>
              
              <motion.div
                animate={{ 
                  width: isSidebarOpen ? "auto" : 0,
                  opacity: isSidebarOpen ? 1 : 0,
                  x: isSidebarOpen ? 0 : -10
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden whitespace-nowrap flex flex-col justify-center shrink-0 pr-6"
              >
                <p className="text-xs font-bold text-zinc-200 group-hover/identity:text-white transition-colors leading-none">{companyProfile.name}</p>
                <p className="text-[9px] font-mono text-zinc-500 mt-1 leading-none">CLIENT ACCESS</p>
              </motion.div>
            </div>

            {/* Logout Button */}
            <motion.button 
              animate={{ 
                opacity: isSidebarOpen ? 1 : 0,
                scale: isSidebarOpen ? 1 : 0,
                x: isSidebarOpen ? 0 : 15
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                window.location.href = "/login";
              }}
              className="absolute right-2 p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-md transition-all shrink-0 overflow-hidden"
              style={{ pointerEvents: isSidebarOpen ? "auto" : "none" }}
              title="Logout"
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* --- DASHBOARD MAIN CONTAINER --- */}
      <main className="flex-1 h-full overflow-y-auto z-10 relative px-4 md:px-8 py-6">
        <AnimatePresence mode="wait">
          
          {/* ===================== 1. DASHBOARD TAB ===================== */}
          {activeTab === "Dashboard" && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              {/* --- BIG RECTANGLE WELCOME CARD --- */}
              <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-950 to-zinc-900/40 backdrop-blur-xl py-4 px-6 md:py-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 group min-h-[120px] z-20 hover:border-zinc-700/80 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.01)]">
                
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
                  <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
                    <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Welcome back, {companyProfile.name}</span>
                  </h2>
                  <p className="text-zinc-400 mt-1.5 text-xs leading-relaxed max-w-[500px]">
                    Manage workforce operations and create AI-powered workforce requests in real time.
                  </p>
                  
                  <div className="flex gap-3 mt-4 justify-center md:justify-start">
                    <button 
                      onClick={() => setActiveTab("Requests")}
                      className="px-4.5 py-2 bg-white text-black font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
                    >
                      Create Request
                    </button>
                    <button 
                      onClick={() => setActiveTab("Workforce")}
                      className="px-4.5 py-2 border border-zinc-800 hover:border-zinc-650 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-350 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all"
                    >
                      View Workforce
                    </button>
                  </div>
                </div>

                {/* Company Initials Avatar Container */}
                <div className="relative z-10 w-18 h-18 md:w-20 md:h-20 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700/5 to-zinc-400/5 opacity-40 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="w-full h-full rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center font-black text-xl md:text-2xl text-zinc-300 shadow-[0_0_30px_rgba(255,255,255,0.02)] relative overflow-hidden select-none">
                    <span className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent font-sans tracking-tight">{getInitials(companyProfile.name)}</span>

                    <div className="absolute top-1.5 right-1.5 text-zinc-555">
                      <Sparkles size={8} className="animate-pulse text-zinc-400" />
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute bottom-0 right-0 w-4.5 h-4.5 z-20">
                    <div className="w-full h-full rounded-full border-2 border-black bg-zinc-950 flex items-center justify-center cursor-default shadow-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    </div>
                  </div>
                </div>

              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Active Requests", value: requests.length, desc: "Current open workforce requests" },
                  { title: "Active Workforce", value: workforce.length, desc: "Currently assigned workers" },
                  { title: "Pending Negotiations", value: negotiations.length, desc: "Offers / counter-offers active" },
                  { title: "Workforce Spend", value: "₹23,500", desc: "Operational spending summary" }
                ].map((stat, i) => (
                  <div key={i} className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 hover:border-zinc-700/80 p-5 transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[140px] hover:scale-[1.01] shadow-[0_0_20px_rgba(255,255,255,0.003)]">
                    {/* Ambient subtle glow inside the stats cards */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-zinc-400/[0.02] rounded-full blur-lg pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500">{stat.title}</span>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-normal font-medium">{stat.desc}</p>
                    </div>
                    <p className="text-2xl font-black mt-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight leading-none">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* RECENT REQUESTS & AI MATCHING PREVIEW COLUMN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Recent Requests List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-6 shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">Recent Requests</h3>
                      <button onClick={() => setActiveTab("Requests")} className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                        View All <ChevronRight size={12} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {requests.map((req) => (
                        <div key={req.id} className="p-4 rounded-2xl border border-zinc-850 bg-zinc-900/10 flex justify-between items-center hover:border-zinc-700/50 transition-all duration-300">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-xs font-bold text-white">{req.role}</h4>
                              <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-450 uppercase tracking-wider">
                                {req.urgency}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500 font-medium">
                              <span>{req.location}</span>
                              <span className="text-zinc-700">•</span>
                              <span>₹{req.budget}/day</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] font-bold uppercase tracking-wider block text-zinc-450">
                              {req.status}
                            </span>
                            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">{req.assignedWorker || "Searching..."}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NEGOTIATION PREVIEW SECTION */}
                  <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-6 shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-4">Active Negotiations</h3>
                    {negotiations.length > 0 ? (
                      <div className="p-4 rounded-2xl border border-zinc-850 bg-zinc-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="text-[8px] font-mono text-zinc-500 uppercase">Pending Review</p>
                          <h4 className="text-xs font-bold text-white mt-1">{negotiations[0].requestTitle}</h4>
                          <p className="text-xs text-zinc-400 mt-1">Counter offer pending from {negotiations[0].workerName} ({negotiations[0].counterRate})</p>
                          <div className="mt-3 flex items-center gap-2 text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit">
                            <Sparkles size={12} className="shrink-0 text-zinc-400" />
                            <span className="text-[10px] font-medium">{negotiations[0].aiRecommendation}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab("Negotiations")}
                          className="px-4 py-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0"
                        >
                          Open Negotiation
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-zinc-850 rounded-xl">
                        <p className="text-xs text-zinc-500">No active negotiations in progress.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: AI MATCHING PREVIEW (MAIN FEATURE SECTION) */}
                <div className="space-y-6">
                  <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-6 flex flex-col justify-between h-full shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={16} className="text-white" />
                        <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300">AI Matching Preview</h3>
                      </div>
                      
                      {/* Worker Profile Card */}
                      <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl relative overflow-hidden group">
                        {/* Sexy background dotted mesh overlay inside worker asset card */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0 opacity-40">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
                          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:6px_6px]" />
                        </div>

                        <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-900/50 rounded-bl-full flex items-center justify-center border-l border-b border-zinc-800 z-10">
                          <span className="text-sm font-black text-white">94%</span>
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-750 flex items-center justify-center font-black text-xs text-white">
                            RS
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">Rahul Sharma</h4>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide mt-0.5">HVAC Specialist</p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-b border-zinc-850 py-3 text-xs relative z-10">
                          <div>
                            <span className="text-[9px] text-zinc-500 block uppercase">Status</span>
                            <span className="font-bold text-zinc-300 mt-0.5 block">Available</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 block uppercase">Experience</span>
                            <span className="font-bold text-zinc-300 mt-0.5 block">5 Years</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] text-zinc-500 block uppercase">Location</span>
                            <span className="font-bold text-zinc-300 mt-0.5 block">Hyderabad</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">AI Rationale</p>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                            Matches required certifications, budget bounds, and optimal geographic proximity metrics.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <button 
                        onClick={() => setActiveTab("Negotiations")}
                        className="w-full py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
                      >
                        Negotiate
                      </button>
                      <button 
                        onClick={() => {
                          const updated = requests.map(r => r.id === "REQ-001" ? { ...r, status: "Assigned", assignedWorker: "Rahul Sharma" } : r);
                          setRequests(updated);
                          setWorkforce([{ id: "W-111", name: "Rahul Sharma", role: "HVAC Specialist", status: "Active", assignment: "HVAC Repair (Hyderabad)", duration: "15 Days" }, ...workforce]);
                          setActiveTab("Workforce");
                        }}
                        className="w-full py-2.5 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        Assign Instantly
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ===================== 2. REQUESTS TAB ===================== */}
          {activeTab === "Requests" && (
            <motion.div
              key="requests-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {isMatching ? (
                /* AI PROCESSING ANIMATION */
                <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950 p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center text-center h-[500px]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 pointer-events-none" />
                  
                  {/* Glowing core animation */}
                  <div className="relative w-24 h-24 mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-zinc-700"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-2 rounded-full border-2 border-dashed border-white/50"
                    />
                    <div className="absolute inset-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Sparkles size={24} className="text-white animate-pulse" />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-white tracking-tight uppercase">VERO MATCH ALGORITHM ACTIVE</h3>
                  <div className="h-6 overflow-hidden mt-4 max-w-sm">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={matchStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest"
                      >
                        {matchSteps[matchStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              ) : showMatchResults ? (
                /* AI MATCH RESULTS PAGE */
                <div className="space-y-6">
                  <div className="border-b border-zinc-850 pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black text-white">AI Match Results</h2>
                      <p className="text-xs text-zinc-500 mt-1">Intelligent workforce options derived from global pools.</p>
                    </div>
                    <button 
                      onClick={() => setShowMatchResults(false)}
                      className="p-1.5 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Rahul Sharma", role: "HVAC Specialist", match: "94%", exp: "5 Years", rate: "₹4200/day" },
                      { name: "Nitin Saxena", role: "HVAC Lead Engineer", match: "88%", exp: "8 Years", rate: "₹5000/day" },
                      { name: "Abhishek Patel", role: "Ventilation Technician", match: "82%", exp: "3 Years", rate: "₹3800/day" }
                    ].map((candidate, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-sm font-bold text-white">{candidate.name}</h4>
                            <span className="text-[9px] font-black bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-300 font-mono">{candidate.match} Match</span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">{candidate.role} • {candidate.exp} Experience</p>
                          <p className="text-xs font-semibold text-zinc-400 mt-2">Rate Ask: {candidate.rate}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleSaveRequest}
                            className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition-all shadow-md"
                          >
                            Assign
                          </button>
                          <button 
                            onClick={() => {
                              setNegotiations([{
                                id: "NEG-903",
                                requestTitle: `${formRole} Request`,
                                workerName: candidate.name,
                                role: candidate.role,
                                originalRate: `₹${formBudget}/day`,
                                counterRate: candidate.rate,
                                status: "Counter offer pending",
                                aiRecommendation: "Highly negotiable margins."
                              }, ...negotiations]);
                              handleSaveRequest();
                            }}
                            className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-850 transition-all"
                          >
                            Negotiate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* CREATE WORKFORCE REQUEST FORM */
                <form onSubmit={handleRunAI} className="space-y-6">
                  <div className="border-b border-zinc-850 pb-4">
                    <h2 className="text-xl font-black text-white">Create Workforce Request</h2>
                    <p className="text-xs text-zinc-500 mt-1">Submit technical operational requisites to initialize matching profiles.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Required Role</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. HVAC Technician" 
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-650 transition-colors" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Required Skills</label>
                      <input 
                        type="text" 
                        placeholder="e.g. HVAC Maintenance, Thermostats, Industrial Vents (comma separated)" 
                        value={formSkills}
                        onChange={(e) => setFormSkills(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-650 transition-colors" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Budget (₹/Day)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="e.g. 4500" 
                          value={formBudget}
                          onChange={(e) => setFormBudget(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-650 transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Location</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Hyderabad" 
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-650 transition-colors" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Urgency</label>
                        <select 
                          value={formUrgency}
                          onChange={(e) => setFormUrgency(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-650 transition-colors appearance-none"
                        >
                          <option>Urgent</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Duration</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 15 Days" 
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-650 transition-colors" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Certifications Required</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Government HVAC License Grade-A" 
                        value={formCertifications}
                        onChange={(e) => setFormCertifications(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-650 transition-colors" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        placeholder="Scope of work details..." 
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-650 transition-colors min-h-[100px] resize-y" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-850 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setActiveTab("Dashboard")}
                      className="px-5 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors shadow-lg flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      Run AI Matching
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* ===================== 3. WORKFORCE TAB ===================== */}
          {activeTab === "Workforce" && (
            <motion.div
              key="workforce-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="border-b border-zinc-850 pb-4">
                <h2 className="text-xl font-black text-white">Active Workforce</h2>
                <p className="text-xs text-zinc-500 mt-1">Overview of contracted personnel assigned to operations.</p>
              </div>

              {workforce.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workforce.map((member) => (
                    <div key={member.id} className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/60 flex flex-col justify-between h-[180px]">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{member.name}</h4>
                          <span className="text-[8px] font-mono border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded text-zinc-450 uppercase tracking-widest">
                            {member.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">{member.role}</p>
                        <p className="text-xs text-zinc-300 mt-4"><strong className="text-zinc-500 font-medium">Assignment:</strong> {member.assignment}</p>
                        <p className="text-xs text-zinc-300 mt-1"><strong className="text-zinc-500 font-medium">Contract:</strong> {member.duration}</p>
                      </div>
                      
                      <div className="flex justify-end pt-3 border-t border-zinc-850">
                        <button className="text-xs text-zinc-400 hover:text-white font-bold flex items-center gap-1">
                          <MessageSquare size={12} /> Contact Worker
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EMPTY STATE WORKFORCE */
                <div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-950/30 p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                    <Users size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300">No active workforce assignments</h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[320px]">
                    Assigned professionals and active operations will appear here.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ===================== 4. NEGOTIATIONS TAB ===================== */}
          {activeTab === "Negotiations" && (
            <motion.div
              key="negotiations-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="border-b border-zinc-850 pb-4">
                <h2 className="text-xl font-black text-white">Negotiations Ledger</h2>
                <p className="text-xs text-zinc-500 mt-1">Pending and active rate structures matching operational needs.</p>
              </div>

              {negotiations.length > 0 ? (
                <div className="space-y-4">
                  {negotiations.map((neg) => (
                    <div key={neg.id} className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/60 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase tracking-wider">{neg.id}</span>
                            <h4 className="text-sm font-bold text-white">{neg.requestTitle}</h4>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">Discussing with {neg.workerName} ({neg.role})</p>
                        </div>
                        <span className="text-xs font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full w-fit">
                          {neg.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-zinc-850 py-4 text-xs font-medium">
                        <div>
                          <span className="text-zinc-500 block uppercase text-[9px]">Original Budget</span>
                          <span className="text-zinc-300 block mt-1">{neg.originalRate}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block uppercase text-[9px]">Worker Counter</span>
                          <span className="text-zinc-300 block mt-1">{neg.counterRate}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500 block uppercase text-[9px]">Vero Confidence Ratio</span>
                          <span className="text-zinc-350 block mt-1 flex items-center gap-1.5 font-bold">
                            <Sparkles size={12} className="text-zinc-550" /> {neg.aiRecommendation}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <button className="px-4 py-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors">
                          Decline
                        </button>
                        <button 
                          onClick={() => {
                            // Assign and clean negotiation
                            setNegotiations([]);
                            setWorkforce([{ id: "W-112", name: neg.workerName, role: neg.role, status: "Active", assignment: neg.requestTitle, duration: "15 Days" }, ...workforce]);
                            const updated = requests.map(r => r.role === neg.role ? { ...r, status: "Assigned", assignedWorker: neg.workerName } : r);
                            setRequests(updated);
                            setActiveTab("Workforce");
                          }}
                          className="px-5 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
                        >
                          Accept & Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EMPTY STATE NEGOTIATIONS */
                <div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-950/30 p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                    <Handshake size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300">No active negotiations</h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[320px]">
                    Workforce negotiations and pricing discussions will appear here.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Profile" && (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              {/* --- HEADER & BANNER SECTION (Discord Style) --- */}
              <div className="relative w-full">
                
                {/* Banner Area */}
                <div className="relative w-full h-40 md:h-52 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
                  {/* Grey gradient mesh background */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#27272a_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#18181b_0%,transparent_50%)] opacity-80" />
                  
                  {/* Noise/Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                  
                  {/* Subtle Tech Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
                </div>

                {/* Profile Avatar & Primary Info (Overlapping Banner) */}
                <div className="relative px-6 md:px-10 pb-4 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-12 md:-mt-16">
                  
                  <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                    {/* Avatar Profile Picture */}
                    <div className="relative z-10 p-1.5 bg-black rounded-full shrink-0 shadow-2xl">
                      <div 
                        onClick={() => {
                          if (!isEditingProfile) {
                            setEditProfileDraft({ ...companyProfile });
                          }
                          setIsEditingProfile(!isEditingProfile);
                        }}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer"
                      >
                        {/* Fallback Initials */}
                        <span className="text-3xl md:text-4xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent group-hover/avatar:scale-105 transition-transform duration-500">{getInitials(companyProfile.name)}</span>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Update</span>
                        </div>
                      </div>
                      
                      {/* Corporate Status Indicator */}
                      <div className="absolute bottom-2 right-2 w-5.5 h-5.5 bg-black rounded-full flex items-center justify-center z-20">
                        <div className="w-3.5 h-3.5 bg-zinc-455 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)] border border-zinc-700" />
                      </div>
                    </div>

                    {/* Name and Basic Details */}
                    <div className="pt-2 md:pt-0 md:pb-2">
                      <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        {companyProfile.name}
                        <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-widest align-middle">
                          PARTNER_SECURE
                        </span>
                      </h1>
                      <p className="text-xs text-zinc-400 mt-1 font-medium">{companyProfile.industry}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-zinc-550" /> {companyProfile.location}</span>
                        {companyProfile.website && (
                          <span className="flex items-center gap-1.5"><Globe size={12} className="text-zinc-550" /> {companyProfile.website.replace("https://", "")}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="w-full md:w-auto md:pb-2 shrink-0">
                    <button 
                      onClick={() => {
                        if (!isEditingProfile) {
                          setEditProfileDraft({ ...companyProfile });
                        }
                        setIsEditingProfile(!isEditingProfile);
                      }}
                      onMouseEnter={() => setIsHoveringEdit(true)}
                      onMouseLeave={() => setIsHoveringEdit(false)}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                      <Edit2 size={12} className={`transition-transform duration-300 ${isHoveringEdit ? 'rotate-12 scale-110' : ''}`} />
                      {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details Area */}
              <div className="w-full">
                <AnimatePresence mode="wait">
                  {!isEditingProfile ? (
                    /* VIEW PROFILE MODE */
                    <motion.div
                      key="profile-view-data"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      {/* Left side column: Bio & Hiring Preferences */}
                      <div className="md:col-span-2 space-y-6">
                        {/* Company Details / Org Bio Card */}
                        <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-6 shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-4 border-b border-zinc-850 pb-3">
                            <FileText size={14} className="text-zinc-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Organization Overview</h3>
                          </div>
                          <p className="text-xs text-zinc-350 leading-relaxed font-sans font-medium whitespace-pre-line">
                            {companyProfile.orgDetails || "No organizational profile details submitted yet."}
                          </p>
                        </div>

                        {/* Hiring Preferences Card */}
                        <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-6 shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-4 border-b border-zinc-850 pb-3">
                            <Building2 size={14} className="text-zinc-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Hiring Parameters & Focus</h3>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {companyProfile.hiringPreferences ? (
                              companyProfile.hiringPreferences.split(",").map((pref, i) => (
                                <span 
                                  key={i} 
                                  className="px-3 py-1.5 rounded-lg border border-zinc-850 bg-zinc-900/40 text-xs font-mono font-medium text-zinc-350 hover:border-zinc-700 transition-colors cursor-default"
                                >
                                  {pref.trim()}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-zinc-550">No operational preferences declared.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side column: HQ Contact Details */}
                      <div className="space-y-6">
                        <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-6 shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-4 border-b border-zinc-850 pb-3">
                            <Globe size={14} className="text-zinc-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Corporate HQ Register</h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Verification Status</span>
                              <span className="text-xs font-bold text-zinc-350 mt-1 block flex items-center gap-1.5">
                                <ShieldCheck size={12} className="text-zinc-400" /> {companyProfile.verificationStatus}
                              </span>
                            </div>

                            <div>
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Industry Sector</span>
                              <span className="text-xs font-bold text-zinc-300 mt-1 block">{companyProfile.industry}</span>
                            </div>

                            <div>
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Corporate Email</span>
                              <span className="text-xs font-bold text-zinc-300 mt-1 block">{companyProfile.email}</span>
                            </div>

                            {companyProfile.phone && (
                              <div>
                                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Corporate Contact</span>
                                <span className="text-xs font-bold text-zinc-300 mt-1 block">{companyProfile.phone}</span>
                              </div>
                            )}

                            {companyProfile.website && (
                              <div>
                                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">HQ Web URL</span>
                                <a 
                                  href={companyProfile.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-white hover:underline mt-1 block flex items-center gap-1"
                                >
                                  {companyProfile.website.replace("https://", "")} <ExternalLink size={10} />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* EDITING PROFILE MODE */
                    <motion.div
                      key="profile-edit-data"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-6 md:p-8 shadow-2xl">
                        
                        <div className="flex items-center gap-2 mb-6 border-b border-zinc-850 pb-4">
                          <Edit2 size={14} className="text-zinc-400" />
                          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-350">Edit Corporate Settings</h3>
                        </div>

                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">Company Name</label>
                              <input 
                                type="text" 
                                value={editProfileDraft.name}
                                onChange={(e) => setEditProfileDraft({ ...editProfileDraft, name: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" 
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">Industry Sector</label>
                              <input 
                                type="text" 
                                value={editProfileDraft.industry}
                                onChange={(e) => setEditProfileDraft({ ...editProfileDraft, industry: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">Corporate Email</label>
                              <input 
                                type="email" 
                                value={editProfileDraft.email}
                                onChange={(e) => setEditProfileDraft({ ...editProfileDraft, email: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" 
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">HQ Location</label>
                              <input 
                                type="text" 
                                value={editProfileDraft.location}
                                onChange={(e) => setEditProfileDraft({ ...editProfileDraft, location: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">Corporate Phone</label>
                              <input 
                                type="text" 
                                value={editProfileDraft.phone || ""}
                                onChange={(e) => setEditProfileDraft({ ...editProfileDraft, phone: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" 
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">HQ Website Link</label>
                              <input 
                                type="text" 
                                value={editProfileDraft.website}
                                onChange={(e) => setEditProfileDraft({ ...editProfileDraft, website: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" 
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">Hiring Preferences (Comma separated)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. On-site, Hybrid, High Vetting Urgency"
                              value={editProfileDraft.hiringPreferences}
                              onChange={(e) => setEditProfileDraft({ ...editProfileDraft, hiringPreferences: e.target.value })}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" 
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2">Corporate Bio / Details</label>
                            <textarea 
                              value={editProfileDraft.orgDetails}
                              onChange={(e) => setEditProfileDraft({ ...editProfileDraft, orgDetails: e.target.value })}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors min-h-[100px] resize-y" 
                            />
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-zinc-850 flex justify-end gap-3">
                          <button 
                            type="button" 
                            onClick={() => setIsEditingProfile(false)}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                          >
                            Discard
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setCompanyProfile(editProfileDraft);
                              setIsEditingProfile(false);
                            }}
                            className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg"
                          >
                            Save Changes
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
