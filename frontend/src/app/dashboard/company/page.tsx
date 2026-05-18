"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  LayoutDashboard, ClipboardList, Users, Handshake, Building2,
  PanelLeftClose, PanelLeftOpen, LogOut, Compass, Send,
  MapPin, DollarSign, Calendar, ShieldCheck, Link2, ExternalLink,
  X, Plus, AlertCircle, RefreshCw, Star, Info, MessageSquare,
  Globe, Shield, FileText, CheckCircle2, ChevronRight, Edit2,
  Mail, Phone, Clock, Cpu, PhoneOff, PhoneCall, XCircle, Terminal
} from "lucide-react";
import { useAuth, ProtectedRoute } from "@/lib/auth-context";
import { useCompanyDashboard } from "@/hooks/use-company-dashboard";
import { companyApi, jobApi, negotiationApi, autoAssignApi, AutoAssignCallRecord } from "@/lib/api";
import { profileToCompanyUpdate } from "@/lib/dashboard-mappers";

export default function CompanyDashboard() {
  const { user, logout } = useAuth();
  const {
    loading,
    error,
    requests,
    workforce,
    negotiations,
    companyProfile,
    setCompanyProfile,
    matchCandidates,
    featuredMatch,
    activeJobId,
    workforceSpend,
    refresh,
    createJobAndMatch,
    assignTechnician,
    completeJobWithPayment,
    setNegotiations,
  } = useCompanyDashboard(user?.id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [editProfileDraft, setEditProfileDraft] = useState({ ...companyProfile });

  useEffect(() => {
    setEditProfileDraft({ ...companyProfile });
  }, [companyProfile]);

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

  const handleAutofill = () => {
    setFormRole("HVAC Support Specialist");
    setFormSkills("HVAC Maintenance, Ventilation Systems, System Calibration");
    setFormBudget("4200");
    setFormLocation("Hyderabad");
    setFormUrgency("Urgent");
    setFormDuration("10 Days");
    setFormCertifications("Universal EPA Section 608 Certification");
    setFormDescription("Perform routine maintenance, airflow testing, and calibrate smart thermostats for retail systems.");
  };

  // AI Matching animation states
  const [isMatching, setIsMatching] = useState(false);
  const [matchStep, setMatchStep] = useState(0);
  const [showMatchResults, setShowMatchResults] = useState(false);

  // Auto-Assign (Vapi calling) states
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [autoAssignStatus, setAutoAssignStatus] = useState<"idle" | "calling" | "completed" | "exhausted">("idle");
  const [autoAssignCalls, setAutoAssignCalls] = useState<AutoAssignCallRecord[]>([]);
  const [autoAssignError, setAutoAssignError] = useState<string | null>(null);
  const [acceptedCandidate, setAcceptedCandidate] = useState<any | null>(null);

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

  const handleRunAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRole || !formBudget || !formLocation) return;
    setIsMatching(true);
    setMatchStep(0);
    setShowMatchResults(false);
    try {
      await createJobAndMatch({
        role: formRole,
        skills: formSkills,
        budget: formBudget,
        location: formLocation,
        urgency: formUrgency,
        duration: formDuration,
        certifications: formCertifications,
        description: formDescription,
      });
    } catch (err) {
      console.error(err);
      setIsMatching(false);
    }
  };

  const resetRequestForm = () => {
    setFormRole("");
    setFormSkills("");
    setFormBudget("");
    setFormLocation("");
    setFormDuration("");
    setFormCertifications("");
    setFormDescription("");
    setShowMatchResults(false);
  };

  const handleSaveRequest = async () => {
    resetRequestForm();
    setActiveTab("Dashboard");
    await refresh();
  };

  const handleAssignCandidate = async (technicianId: string) => {
    if (!activeJobId) return;
    await assignTechnician(activeJobId, technicianId);
    resetRequestForm();
    setActiveTab("Workforce");
  };

  const handleAutoAssign = async () => {
    if (!activeJobId || !matchCandidates || matchCandidates.length === 0) return;
    setIsAutoAssigning(true);
    setAutoAssignError(null);
    setAutoAssignStatus("calling");
    setAutoAssignCalls([]);
    try {
      await autoAssignApi.trigger(
        activeJobId,
        matchCandidates.map((c) => ({
          technician_id: c.technicianId,
          base_hourly_rate: parseFloat(c.rate.replace(/[^\d.]/g, "")) || 0,
          final_score: parseFloat(c.match.replace(/[^\d.]/g, "")) / 100 || 0.8,
          matched_skills: [],
        }))
      );
      // Poll every 2.5 s until campaign ends for high-fidelity interactive feedback
      const pollInterval = setInterval(async () => {
        try {
          const statusData = await autoAssignApi.status(activeJobId);
          setAutoAssignCalls(statusData.calls);
          setAutoAssignStatus(statusData.status);
          if (statusData.status === "completed" || statusData.status === "exhausted") {
            clearInterval(pollInterval);
            setIsAutoAssigning(false);
            if (statusData.status === "completed") {
              // Wait a few seconds to let user see who accepted, then trigger the review screen
              setTimeout(() => {
                const acceptedCall = statusData.calls.find((c: any) => c.status === "accepted");
                const candidate = matchCandidates.find((c) => c.technicianId === statusData.assigned_technician_id);
                if (candidate) {
                  setAcceptedCandidate({
                    ...candidate,
                    agreedPrice: acceptedCall?.agreed_price || parseFloat(candidate.rate.replace(/[^\d.]/g, "")) || 2400,
                    summary: acceptedCall?.call_summary || "Technician successfully negotiated and accepted the contract via AI phone."
                  });
                }
              }, 2000);
            }
          }
        } catch {
          clearInterval(pollInterval);
          setIsAutoAssigning(false);
        }
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAutoAssignError(msg);
      setIsAutoAssigning(false);
      setAutoAssignStatus("idle");
    }
  };

  // Auto-trigger the Auto-Assign voice calling dispatcher as soon as matches finish calculating!
  useEffect(() => {
    if (showMatchResults && activeJobId && matchCandidates.length > 0 && autoAssignStatus === "idle") {
      handleAutoAssign();
    }
  }, [showMatchResults, activeJobId, matchCandidates, autoAssignStatus]);

  const handleConfirmAccept = async () => {
    if (!acceptedCandidate) return;
    await refresh();
    setAcceptedCandidate(null);
    setShowMatchResults(false);
    setActiveTab("Workforce");
  };

  const handleConfirmReject = async () => {
    setAcceptedCandidate(null);
    setAutoAssignStatus("idle");
    setAutoAssignCalls([]);
    setIsAutoAssigning(false);
  };

  const handleStartNegotiation = async (technicianId: string, offeredRate: string) => {
    if (!activeJobId || !user?.id) return;
    const numeric = parseFloat(offeredRate.replace(/[^\d.]/g, "")) || Number(formBudget);
    await negotiationApi.start({
      job_request_id: activeJobId,
      customer_id: user.id,
      technician_id: technicianId,
      initial_price: Number(formBudget),
      offered_price: numeric,
    });
    await refresh();
    resetRequestForm();
    setActiveTab("Negotiations");
  };

  const handleSaveCompanyProfile = async () => {
    setSavingProfile(true);
    try {
      const updated = await companyApi.update(profileToCompanyUpdate(editProfileDraft));
      setCompanyProfile({
        name: updated.company_name || editProfileDraft.name,
        industry: updated.other_industry || updated.industry || editProfileDraft.industry,
        location: updated.hq_location || editProfileDraft.location,
        email: updated.email || editProfileDraft.email,
        phone: updated.phone || editProfileDraft.phone,
        hiringPreferences: updated.hiring_preferences || editProfileDraft.hiringPreferences,
        website: updated.website_url || editProfileDraft.website,
        verificationStatus: updated.identity_verification_url
          ? "Verified Partner"
          : "Pending Verification",
        orgDetails: updated.about || editProfileDraft.orgDetails,
      });
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const navigationItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Requests", icon: <ClipboardList size={18} /> },
    { name: "Workforce", icon: <Users size={18} /> },
    { name: "Negotiations", icon: <Handshake size={18} /> },
    { name: "Profile", icon: <Building2 size={18} /> },
  ];

  return (
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
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
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white relative shrink-0 uppercase">
                {user?.full_name ? getInitials(user.full_name) : getInitials(companyProfile.name)}
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
                <p className="text-xs font-bold text-zinc-200 group-hover/identity:text-white transition-colors leading-none">{user?.full_name || companyProfile.name}</p>
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
              onClick={logout}
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
      <main className="flex-1 h-full overflow-y-auto z-10 relative px-4 md:px-8 py-6 flex flex-col">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto mb-4 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}
        {loading && (
          <div className="max-w-5xl mx-auto mb-4 flex items-center gap-2 text-xs text-zinc-500">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-800 border-t-zinc-400" />
            Syncing dashboard data...
          </div>
        )}
        <AnimatePresence mode="wait">
          
          {/* ===================== 1. DASHBOARD TAB ===================== */}
          {activeTab === "Dashboard" && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4.5 max-w-5xl mx-auto w-full my-auto py-2"
            >
              {/* --- BIG RECTANGLE WELCOME CARD --- */}
              <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-950 to-zinc-900/40 backdrop-blur-xl py-3 px-4 md:py-3.5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 group min-h-[90px] z-20 hover:border-zinc-700/80 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.01)]">
                
                {/* Decoupled Background Container to clip grid lines safely without cropping dropdown */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                  {/* Brutalist Tech-Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:1.25rem_1.25rem] opacity-50" />
                  
                  {/* Sexy Repeating Matrix Dotted Mesh */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:8px_8px] opacity-80" />
                  
                  {/* Animated Sweeping Laser Scanner Line */}

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
                    <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Welcome back, {user?.full_name || companyProfile.name}</span>
                  </h2>
                  <p className="text-zinc-400 mt-1.5 text-xs leading-relaxed max-w-[500px]">
                    Manage workforce operations and create AI-powered workforce requests in real time.
                  </p>
                  
                  <div className="flex gap-3 mt-4 justify-center md:justify-start">
                    <button 
                      onClick={() => setActiveTab("Requests")}
                      className="px-4.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-zinc-700/50 shadow-md"
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
                  { title: "Workforce Spend", value: `\u20B9${workforceSpend.toLocaleString()}`, desc: "Operational spending summary" }
                ].map((stat, i) => (
                  <div key={i} className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 hover:border-zinc-700/80 p-3.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[105px] hover:scale-[1.01] shadow-[0_0_20px_rgba(255,255,255,0.003)]">
                    {/* Ambient subtle glow inside the stats cards */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-zinc-400/[0.02] rounded-full blur-lg pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500">{stat.title}</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal font-medium">{stat.desc}</p>
                    </div>
                    <p className="text-xl font-black mt-2 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight leading-none">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* RECENT REQUESTS & AI MATCHING PREVIEW COLUMN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Left Side: Recent Requests List */}
                <div className="lg:col-span-2 flex flex-col justify-between h-full space-y-4">
                  <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-4 shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">Recent Requests</h3>
                      <button onClick={() => setActiveTab("Requests")} className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                        View All <ChevronRight size={12} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {requests.map((req) => (
                        <div key={req.id} className="p-3 rounded-2xl border border-zinc-850 bg-zinc-900/10 flex justify-between items-center hover:border-zinc-700/50 transition-all duration-300">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-xs font-bold text-white">{req.role}</h4>
                              <span className="text-[8px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-450 uppercase tracking-wider">
                                {req.urgency}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500 font-medium">
                              <span>{req.location}</span>
                              <span className="text-zinc-700">{"\u2022"}</span>
                              <span>{"\u20B9"}{req.budget}/day</span>
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
                  <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-4 shadow-2xl hover:border-zinc-700/40 transition-all duration-300 flex-1 flex flex-col justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-2">Active Negotiations</h3>
                    {negotiations.length > 0 ? (
                      <div className="p-3 rounded-2xl border border-zinc-850 bg-zinc-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-1">
                        <div>
                          <p className="text-[8px] font-mono text-zinc-500 uppercase">Pending Review</p>
                          <h4 className="text-xs font-bold text-white mt-1">{negotiations[0].request_title}</h4>
                          <p className="text-xs text-zinc-400 mt-1">Counter offer pending from {negotiations[0].worker_name} ({negotiations[0].counter_rate})</p>
                          <div className="mt-3 flex items-center gap-2 text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit">
                            <span className="text-[10px] font-medium">{negotiations[0].ai_recommendation}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab("Negotiations")}
                          className="px-4 py-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 self-center"
                        >
                          Open Negotiation
                        </button>
                      </div>
                    ) : (
                      <div className="text-center border border-dashed border-zinc-850 rounded-xl flex-1 flex flex-col items-center justify-center min-h-[90px]">
                        <p className="text-xs text-zinc-500">No active negotiations in progress.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: AI MATCHING PREVIEW (MAIN FEATURE SECTION) */}
                <div className="space-y-4 h-full flex flex-col">
                  <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/30 p-3.5 flex flex-col justify-between h-full shadow-2xl hover:border-zinc-700/40 transition-all duration-300">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-300">AI Matching Preview</h3>
                      </div>
                      
                      {/* Worker Profile Card */}
                      <div className="p-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl relative overflow-hidden group">
                        {/* Sexy background dotted mesh overlay inside worker asset card */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0 opacity-40">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
                          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:6px_6px]" />
                        </div>

                        <div className="absolute top-0 right-0 w-14 h-14 bg-zinc-900/80 rounded-bl-2xl flex items-center justify-center border-l border-b border-zinc-800 z-10">
                          <span className="text-xs font-bold text-white">
                            {featuredMatch ? `${Math.round(featuredMatch.score * 100)}%` : "\u2014"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-750 flex items-center justify-center font-black text-xs text-white">
                            {(featuredMatch?.tech.full_name || "T").substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {featuredMatch?.tech.full_name || "No match yet"}
                            </h4>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide mt-0.5">
                              {featuredMatch?.tech.role || "Run AI matching"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-b border-zinc-850 py-2 text-xs relative z-10">
                          <div>
                            <span className="text-[9px] text-zinc-500 block uppercase">Status</span>
                            <span className="font-bold text-zinc-300 mt-0.5 block">
                              {featuredMatch?.tech.is_online ? "Available" : featuredMatch ? "Offline" : "\u2014"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 block uppercase">Experience</span>
                            <span className="font-bold text-zinc-300 mt-0.5 block">
                              {featuredMatch ? `${featuredMatch.tech.experience_years} Years` : "\u2014"}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] text-zinc-500 block uppercase">Location</span>
                            <span className="font-bold text-zinc-300 mt-0.5 block">
                              {featuredMatch?.tech.location || "\u2014"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5">
                          <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">AI Rationale</p>
                          <p className="text-[10.5px] text-zinc-450 mt-0.5 leading-normal">
                            {featuredMatch?.tech.bio ||
                              "Run AI matching on a workforce request to populate this preview."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-1.5">
                      <button 
                        onClick={() => {
                          if (featuredMatch && activeJobId) {
                            handleStartNegotiation(
                              featuredMatch.tech.id,
                              String(featuredMatch.tech.daily_rate ?? formBudget)
                            );
                          } else {
                            setActiveTab("Requests");
                          }
                        }}
                        disabled={!featuredMatch}
                        className="w-full py-2 bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700/50 shadow-md disabled:opacity-40"
                      >
                        Negotiate
                      </button>
                      <button 
                        onClick={() => {
                          if (featuredMatch && activeJobId) {
                            handleAssignCandidate(featuredMatch.tech.id);
                          }
                        }}
                        disabled={!featuredMatch || !activeJobId}
                        className="w-full py-2 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-40"
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
              className="max-w-4xl mx-auto w-full my-auto py-2"
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
                      className="absolute inset-2 rounded-full border-2 border-dashed border-zinc-500/50" />
                    <div className="absolute inset-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Compass size={24} className="text-white animate-pulse" />
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
                  <div className="border-b border-zinc-900 pb-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">AI Match Results</h2>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-white uppercase tracking-wider animate-pulse">
                          Live Active
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Intelligent workforce options ranked by experience, skills & price.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowMatchResults(false)}
                      className="p-2 border border-zinc-900 bg-zinc-950 rounded-xl text-zinc-400 hover:text-white transition-all hover:bg-zinc-900"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* AUTO ASSIGN / AI DISPATCH PANEL */}
                  {matchCandidates.length > 0 && (
                    <>
                      {acceptedCandidate ? (
                        /* STARK GRAYSCALE CONTRACT ACCEPTANCE REVIEW MODAL/CARD */
                        <div className="rounded-2xl border border-zinc-700 bg-zinc-950 p-6 space-y-5 relative overflow-hidden animate-fade-in shadow-2xl">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />
                          
                          <div className="flex items-center gap-3 relative z-10">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-850">
                              <CheckCircle2 size={16} className="text-white" />
                            </div>
                            <div>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-white uppercase tracking-widest">
                                AI Negotiation Successful
                              </span>
                              <h3 className="text-sm font-black text-white mt-1 uppercase tracking-wider">Review Contract Offer</h3>
                            </div>
                          </div>

                          <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-4 space-y-3 relative z-10">
                            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Candidate</span>
                              <span className="text-xs text-white font-bold">{acceptedCandidate.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Role</span>
                              <span className="text-xs text-zinc-300 font-semibold">{acceptedCandidate.role}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Negotiated Price</span>
                              <span className="text-xs text-white font-mono font-bold">₹{acceptedCandidate.agreedPrice}/day</span>
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Call Summary</span>
                              <p className="text-xs text-zinc-400 font-medium leading-relaxed bg-zinc-950/40 border border-zinc-850/50 p-2.5 rounded-lg">
                                {acceptedCandidate.summary}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 relative z-10 pt-2">
                            <button
                              type="button"
                              onClick={handleConfirmAccept}
                              className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all font-mono shadow-md"
                            >
                              Confirm & Dispatch Contract
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmReject}
                              className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all font-mono"
                            >
                              Decline Candidate
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* AI DISPATCH ACTIVE PANEL */
                        <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-5 space-y-4 relative overflow-hidden">
                          {/* Background high-end grid element */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800">
                                <Cpu size={16} className="text-zinc-300 animate-pulse" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 uppercase tracking-widest animate-pulse">
                                    AI Dispatch Engaged
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                                    Vero Voice Engine 3.2
                                  </span>
                                </div>
                                <h3 className="text-sm font-black text-white mt-1 uppercase tracking-wider">VERO AUTONOMOUS DISPATCH SYSTEM</h3>
                              </div>
                            </div>

                            {/* Monochromatic voice wavelength sound wave simulation */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-850">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              <div className="flex gap-0.5 items-end h-3">
                                <span className="w-0.5 bg-zinc-400 rounded-sm animate-bounce" style={{ height: "60%", animationDelay: "0.1s" }} />
                                <span className="w-0.5 bg-zinc-400 rounded-sm animate-bounce" style={{ height: "90%", animationDelay: "0.3s" }} />
                                <span className="w-0.5 bg-zinc-400 rounded-sm animate-bounce" style={{ height: "40%", animationDelay: "0.5s" }} />
                                <span className="w-0.5 bg-zinc-400 rounded-sm animate-bounce" style={{ height: "80%", animationDelay: "0.2s" }} />
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest ml-1">AI Calling...</span>
                            </div>
                          </div>

                          <p className="text-xs text-zinc-400 relative z-10 leading-relaxed font-medium">
                            The Vero AI agent is actively calling technicians in rank order via phone, negotiating the daily rate, checking availability schedules, and executing contracts in the background.
                          </p>

                          {/* Error Feed */}
                          {autoAssignError && (
                            <div className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 rounded-xl px-4 py-3 relative z-10 font-mono">
                              [ERROR DETECTED]: {autoAssignError}
                            </div>
                          )}

                          {/* Terminals dispatch feed */}
                          {autoAssignCalls.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-zinc-900 relative z-10">
                              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                                <span>AI CALL DISPATCH LOG</span>
                                <span className="text-white animate-pulse">Live telemetry feed</span>
                              </div>
                              <div className="grid gap-2">
                                {autoAssignCalls.map((call) => (
                                  <div key={call.rank} className="flex items-center justify-between bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-xs font-mono">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                                        Rank #{call.rank}
                                      </span>
                                      <span className="text-zinc-300 font-medium font-sans">
                                        {matchCandidates.find((c) => c.technicianId === call.technician_id)?.name || "Technician"}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      {call.agreed_price && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-white">
                                          ₹{call.agreed_price}/day
                                        </span>
                                      )}
                                      
                                      <div className="flex items-center gap-1.5">
                                        {call.status === "accepted" ? (
                                          <>
                                            <CheckCircle2 size={13} className="text-white" />
                                            <span className="text-white font-bold uppercase text-[10px] tracking-wider">Accepted</span>
                                          </>
                                        ) : call.status === "rejected" ? (
                                          <>
                                            <XCircle size={13} className="text-zinc-500" />
                                            <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Declined</span>
                                          </>
                                        ) : call.status === "no_answer" ? (
                                          <>
                                            <PhoneOff size={13} className="text-zinc-600" />
                                            <span className="text-zinc-600 font-bold uppercase text-[10px] tracking-wider">No Answer</span>
                                          </>
                                        ) : call.status === "in_progress" ? (
                                          <>
                                            <PhoneCall size={13} className="text-zinc-400 animate-pulse" />
                                            <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider animate-pulse">In Call...</span>
                                          </>
                                        ) : call.status === "calling" ? (
                                          <>
                                            <Clock size={13} className="text-zinc-700 animate-pulse" />
                                            <span className="text-zinc-600 font-bold uppercase text-[10px] tracking-wider animate-pulse">Ringing...</span>
                                          </>
                                        ) : (
                                          <>
                                            <Clock size={13} className="text-zinc-800" />
                                            <span className="text-zinc-700 font-bold uppercase text-[10px] tracking-wider">Pending...</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {autoAssignStatus === "exhausted" && (
                            <p className="text-xs text-zinc-500 font-mono text-center py-2 relative z-10 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                              [DISPATCH TERMINATED]: All candidates contacted. Adjust budget filters to re-dispatch.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Talent List Rendering */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Matched Talent Pool</p>
                    {matchCandidates.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-8">No technicians matched yet. Ensure technicians are online in the database.</p>
                    ) : (
                    matchCandidates.map((candidate) => {
                      const isTopMatch = candidate.match.includes("98") || candidate.match.includes("95");
                      const isMidMatch = candidate.match.includes("92") || candidate.match.includes("90");
                      
                      const borderColor = isTopMatch ? "border-l-zinc-300" : isMidMatch ? "border-l-zinc-500" : "border-l-zinc-700";
                      const matchBg = isTopMatch ? "bg-zinc-100 text-black border-zinc-200" : isMidMatch ? "bg-zinc-800 text-zinc-300 border-zinc-700" : "bg-zinc-900 text-zinc-400 border-zinc-800";
                      
                      return (
                        <div 
                          key={candidate.technicianId} 
                          className={`p-5 rounded-2xl border border-zinc-900 bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${borderColor} hover:bg-zinc-950/80 transition-all`}
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-sm font-bold text-white tracking-wide">{candidate.name}</h4>
                              <span className={`text-[9px] font-black border px-2 py-0.5 rounded font-mono ${matchBg}`}>
                                {candidate.match} MATCH
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1.5 font-medium">
                              {candidate.role} <span className="text-zinc-600 px-1 font-mono">|</span> {candidate.exp} Experience
                            </p>
                            
                            {/* Inner technical capsules for high visual fidelity */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900/60 border border-zinc-850 text-zinc-500">
                                <MapPin size={10} />
                                {candidate.rate.includes("Hyderabad") || candidate.rate.includes("Bangalore") ? candidate.rate.split("@")[1]?.trim() || "Hyderabad" : "Hyderabad"}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900/60 border border-zinc-850 text-zinc-400">
                                {candidate.rate.split("@")[0].split("(")[0].trim()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Controlled fully by the background VERO Voice Dispatch sequence */}
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900/40 border border-zinc-850/60 px-3 py-1.5 rounded-lg">
                              Managed by AI
                            </span>
                          </div>
                        </div>
                      );
                    })
                    )}
                  </div>
                </div>
              ) : (
                /* CREATE WORKFORCE REQUEST FORM */
                <form onSubmit={handleRunAI} className="w-full relative z-10 py-3">
                  <div className="space-y-7">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Create Workforce Request</h2>
                        <p className="text-xs text-zinc-500 font-medium mt-0.5">Submit requisites to auto-trigger matching profiles.</p>
                      </div>
                      
                      {/* Interactive Autofill */}
                      <button
                        type="button"
                        onClick={handleAutofill}
                        className="relative text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all duration-300 flex items-center gap-2 py-2 px-4 rounded-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 shadow-md group overflow-hidden cursor-pointer shrink-0"
                        title="Instant test preset"
                      >
                        <span>Demo Autofill</span>
                      </button>
                    </div>

                    {/* Inputs Matrix */}
                    <div className="space-y-5 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {/* Required Role */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Required Role</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. HVAC Technician" 
                            value={formRole}
                            onChange={(e) => setFormRole(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors rounded-none" 
                          />
                        </div>

                        {/* Required Skills */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Required Skills</label>
                          <input 
                            type="text" 
                            placeholder="e.g. HVAC Maintenance, Calibration" 
                            value={formSkills}
                            onChange={(e) => setFormSkills(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors rounded-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {/* Budget */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Budget ({"\u20B9"}/Day)</label>
                          <input 
                            type="number" 
                            required
                            placeholder="e.g. 4500" 
                            value={formBudget}
                            onChange={(e) => setFormBudget(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors rounded-none" 
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Location</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Hyderabad" 
                            value={formLocation}
                            onChange={(e) => setFormLocation(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors rounded-none" 
                          />
                        </div>

                        {/* Urgency */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Urgency</label>
                          <div className="relative">
                            <select 
                              value={formUrgency}
                              onChange={(e) => setFormUrgency(e.target.value)}
                              className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                            >
                              <option className="bg-zinc-950 text-white">Urgent</option>
                              <option className="bg-zinc-950 text-white">Medium</option>
                              <option className="bg-zinc-950 text-white">Low</option>
                            </select>
                          </div>
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Duration</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 15 Days" 
                            value={formDuration}
                            onChange={(e) => setFormDuration(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors rounded-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Certifications Required */}
                        <div className="md:col-span-1">
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Certifications</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Universal EPA" 
                            value={formCertifications}
                            onChange={(e) => setFormCertifications(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors rounded-none" 
                          />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Scope of Work Description</label>
                          <input 
                            type="text"
                            placeholder="Provide high-level description details..." 
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 focus:border-white pb-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors rounded-none" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="pt-5 flex justify-between items-center border-t border-zinc-900">
                      <button 
                        type="button"
                        onClick={() => setActiveTab("Dashboard")}
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3.5 bg-white hover:bg-zinc-100 text-black font-black text-[11px] uppercase tracking-widest rounded transition-all shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_rgba(255,255,255,0.18)] hover:scale-[1.02] active:scale-[0.98] border border-transparent cursor-pointer"
                      >
                        Run AI Match
                      </button>
                    </div>
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
              className="max-w-5xl mx-auto w-full my-auto space-y-6 py-4 px-2"
            >
              <div className="pb-2">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Active Workforce</h2>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Overview of contracted personnel assigned to operations.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                {/* Left Telemetry HUD */}
                <div className="lg:col-span-1 p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />
                  <div className="relative z-10 space-y-4.5">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">TELEMETRY MONITOR</span>
                    </div>
                    
                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">OPERATIONAL NODE</span>
                        <span className="text-xs font-bold text-zinc-300 mt-0.5 block">VERO-NODE-CORP</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">CONTRACTED PERSONNEL</span>
                        <span className="text-xs font-bold text-zinc-300 mt-0.5 block">{workforce.length} ACTIVE</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">SYSTEM THREADS</span>
                        <span className="text-xs font-bold text-zinc-300 mt-0.5 block">STANDBY // LISTEN</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-zinc-900">
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Initiate technical workforce requests from the <strong className="text-zinc-300 hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab("Requests")}>Requests</strong> terminal to initialize automated staffing lines.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-2 w-full">
                  {workforce.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {workforce.map((member) => (
                        <div 
                          key={member.id} 
                          className={`p-5 bg-zinc-950/20 border border-zinc-900/60 hover:border-zinc-800 rounded-xl flex flex-col justify-between h-[180px] transition-all duration-300 relative overflow-hidden group shadow-md ${
                            member.status === "active" || member.status === "assigned"
                              ? "border-l-2 border-l-emerald-500/70"
                              : "border-l-2 border-l-zinc-700"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-white">{member.name}</h4>
                              <span className="text-[8px] font-mono border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-widest">
                                {member.status}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 font-medium">{member.role}</p>
                            <p className="text-xs text-zinc-300 mt-4"><strong className="text-zinc-500 font-medium">Assignment:</strong> {member.assignment}</p>
                            <p className="text-xs text-zinc-350 mt-1"><strong className="text-zinc-500 font-medium">Contract:</strong> {member.duration}</p>
                          </div>
                          
                          {member.job_status !== "completed" && member.budget != null && (
                            <div className="flex justify-end pt-3 border-t border-zinc-900/60">
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!user?.id) return;
                                  const rating = window.prompt("Rate this worker (1-5), or leave empty:", "5");
                                  const reviewText = window.prompt("Optional review comment:", "") ?? "";
                                  await completeJobWithPayment(
                                    member.job_request_id,
                                    member.technician_id,
                                    member.budget!,
                                    user.id,
                                    rating ? Number(rating) : undefined,
                                    reviewText || undefined
                                  );
                                }}
                                className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700/50 shadow-sm transition-all duration-200 cursor-pointer"
                              >
                                Complete & Pay
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* EMPTY STATE WORKFORCE */
                    <div className="w-full border border-zinc-900 bg-zinc-950/10 rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 mb-4 shadow-sm">
                          <Users size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">No active assignments</h4>
                        <p className="text-xs text-zinc-500 mt-2 max-w-[280px] font-medium leading-relaxed">
                          Assigned professionals and active operations will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================== 4. NEGOTIATIONS TAB ===================== */}
          {activeTab === "Negotiations" && (
            <motion.div
              key="negotiations-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-5xl mx-auto w-full my-auto space-y-6 py-4 px-2"
            >
              <div className="pb-2">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Negotiations Ledger</h2>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Pending and active rate structures matching operational needs.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                {/* Left Telemetry HUD */}
                <div className="lg:col-span-1 p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />
                  <div className="relative z-10 space-y-4.5">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NEGOTIATION MONITOR</span>
                    </div>
                    
                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">AUTO-DECISION ENGINE</span>
                        <span className="text-xs font-bold text-zinc-300 mt-0.5 block">VERO-AI-NEGOTIATOR</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">PENDING RECORDS</span>
                        <span className="text-xs font-bold text-zinc-300 mt-0.5 block">{negotiations.length} RECORDS</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold tracking-wider">DECISION ENGINE STATE</span>
                        <span className="text-xs font-bold text-zinc-300 mt-0.5 block">ACTIVE // POLLING</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-zinc-900">
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Vero auto-negotiation engines poll candidate targets in real-time. Incoming counters will stream directly to this dashboard panel.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-2 w-full">
                  {negotiations.length > 0 ? (
                    <div className="space-y-6">
                      {negotiations.map((neg) => (
                        <div 
                          key={neg.id} 
                          className={`p-6 bg-zinc-950/20 border border-zinc-900/60 hover:border-zinc-800 rounded-xl space-y-5 transition-all duration-300 relative overflow-hidden group shadow-md ${
                            neg.status === "accepted"
                              ? "border-l-2 border-l-emerald-500/70"
                              : neg.status === "rejected" || neg.status === "cancelled"
                              ? "border-l-2 border-l-rose-500/70"
                              : "border-l-2 border-l-amber-500/70"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase tracking-wider">{neg.display_code}</span>
                                <h4 className="text-sm font-bold text-white">{neg.request_title}</h4>
                              </div>
                              <p className="text-xs text-zinc-400 mt-1">Discussing with {neg.worker_name} ({neg.role})</p>
                            </div>
                            <span className="text-xs font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full w-fit">
                              {neg.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-950/40 p-4 rounded-xl text-xs font-medium border border-zinc-900/60">
                            <div>
                              <span className="text-zinc-500 block uppercase text-[9px]">Original Budget</span>
                              <span className="text-zinc-350 block mt-1">{neg.original_rate}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block uppercase text-[9px]">Worker Counter</span>
                              <span className="text-zinc-350 block mt-1">{neg.counter_rate}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-zinc-500 block uppercase text-[9px]">Vero Confidence Ratio</span>
                              <span className="text-zinc-350 block mt-1 font-bold">
                                {neg.ai_recommendation}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={async () => {
                                await negotiationApi.update(neg.id, { negotiation_status: "rejected" });
                                await refresh();
                              }}
                              className="px-4 py-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                            <button 
                              type="button"
                              onClick={async () => {
                                await negotiationApi.update(neg.id, {
                                  negotiation_status: "accepted",
                                  accepted_by: "customer",
                                });
                                await refresh();
                                setActiveTab("Workforce");
                              }}
                              className="px-5 py-2 bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700/50 shadow-md cursor-pointer"
                            >
                              Accept & Assign
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* EMPTY STATE NEGOTIATIONS */
                    <div className="w-full border border-zinc-900 bg-zinc-950/10 rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 mb-4 shadow-sm">
                          <Handshake size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">No active negotiations</h4>
                        <p className="text-xs text-zinc-500 mt-2 max-w-[280px] font-medium leading-relaxed">
                          Workforce negotiations and pricing discussions will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 border border-zinc-700/50 shadow-md"
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
                            onClick={handleSaveCompanyProfile}
                            disabled={savingProfile}
                            className="px-6 py-2.5 rounded-xl bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-700 transition-all border border-zinc-700/50 shadow-md disabled:opacity-50"
                          >
                            {savingProfile ? "Saving..." : "Save Changes"}
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
    </ProtectedRoute>
  );
}
