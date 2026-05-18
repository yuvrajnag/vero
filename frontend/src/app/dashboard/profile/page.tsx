"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, MessageSquare, Settings, Edit2, 
  MapPin, Mail, Phone, Globe, Clock, DollarSign, 
  GraduationCap, Award, FileText, Plus, Moon, LogOut,
  ChevronLeft, LayoutDashboard, Code2, Cpu, X, Star
} from "lucide-react";
import Link from "next/link";
import WorkerOnboarding from "@/components/setup/WorkerOnboarding";
import { useAuth, ProtectedRoute } from "@/lib/auth-context";
import {
  technicianApi,
  portfolioApi,
  reviewApi,
  type TechnicianResponse,
  type PortfolioResponse,
  type ReviewResponse,
} from "@/lib/api";

const ProfileIcon = User;
const ProjectsIcon = Briefcase;
const TestimonialsIcon = MessageSquare;
const SettingsIcon = Settings;

const TABS = [
  { id: "profile", label: "Profile", icon: ProfileIcon },
  { id: "projects", label: "Assignments", icon: ProjectsIcon },
  { id: "testimonials", label: "Testimonials", icon: TestimonialsIcon },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState<TechnicianResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [projectForm, setProjectForm] = useState({
    operation_title: "",
    scope_of_work: "",
    technical_role: "",
    commercial_client: "",
    completion_year: "",
    skills: "",
    proof_image_url: "",
    registry_verification_url: "",
    is_featured: false,
  });
  const [savingProject, setSavingProject] = useState(false);

  const reloadProfile = () => {
    technicianApi
      .me()
      .then((p) => {
        setProfile(p);
        return Promise.all([
          portfolioApi.list(),
          reviewApi.forTechnician(p.id),
        ]);
      })
      .then(([entries, revs]) => {
        setPortfolio(entries);
        setReviews(revs);
      })
      .catch(() => {
        setProfile(null);
        setPortfolio([]);
        setReviews([]);
      })
      .finally(() => setProfileLoading(false));
  };

  useEffect(() => {
    reloadProfile();
  }, [user?.id]);

  const displayName = profile?.full_name || user?.full_name || "Worker";
  const displayRole = profile?.role || user?.role || "Technician";
  const displayLocation = profile?.location
    ? `${profile.location}${profile.remote_pref ? ` (${profile.remote_pref})` : ""}`
    : "\u2014";
  const hoursLabel =
    profile?.hours_start && profile?.hours_end
      ? `${profile.hours_start} - ${profile.hours_end}`
      : "\u2014";
  const rateLabel =
    profile?.daily_rate != null
      ? `${profile.daily_rate} ${profile.currency || ""}`
      : "\u2014";

  const bio = profile?.bio || (profileLoading ? "Loading..." : "Complete onboarding to add your bio.");
  const skills = profile?.skills ?? [];
  const workHistory = profile?.work_history || profile?.previous_employers || "\u2014";
  const education = profile?.education || "\u2014";
  const email = profile?.email || user?.email || "\u2014";
  const phone = profile?.phone || "\u2014";
  const linkedin = profile?.linkedin_url || "";
  const availableDays = profile?.available_days ?? [];
  const preferredWorkTypes = profile?.preferred_work_types ?? [];

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white pb-20">
      
      {/* Top Navigation Anchor */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 pointer-events-none">
        <Link href="/dashboard/worker" className="pointer-events-auto group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 backdrop-blur-md">
          <ChevronLeft size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Dashboard</span>
        </Link>
      </div>

      {/* --- HEADER & BANNER SECTION (Discord Style) --- */}
      <div className="relative w-full max-w-5xl mx-auto mt-16 md:mt-20 px-4 md:px-8">
        
        {/* Banner Area */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
          {/* Grey gradient mesh background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#27272a_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#18181b_0%,transparent_50%)] opacity-80" />
          
          {/* Noise/Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          
          {/* Subtle Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        </div>

        {/* Profile Avatar & Primary Info (Overlapping Banner) */}
        <div className="relative px-6 md:px-10 pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 md:-mt-20">
          
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar Profile Picture */}
            <div className="relative z-10 p-1.5 bg-black rounded-full shrink-0 shadow-2xl">
              <div 
                onClick={() => { setActiveTab("profile"); setIsEditingProfile(!isEditingProfile); }}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer"
              >
                {/* Fallback Initials */}
                <span className="text-4xl md:text-5xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent group-hover/avatar:scale-105 transition-transform duration-500 uppercase">{user?.full_name ? user.full_name.substring(0, 2) : "YN"}</span>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Update</span>
                </div>
              </div>
              {/* Online Status Indicator Removed */}
            </div>

            {/* Name and Basic Details */}
            <div className="pt-2 md:pt-0 md:pb-2">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                {displayName}
                <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-widest align-middle">
                  {profile?.id ? profile.id.substring(0, 7) : user?.id?.substring(0, 7) || "\u2014"}
                </span>
              </h1>
              <p className="text-sm text-zinc-400 mt-1 font-medium">{displayRole}</p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-zinc-400" /> {displayLocation}</span>
                <span className="hidden md:flex items-center gap-1.5"><Clock size={12} className="text-zinc-400" /> {hoursLabel}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto md:pb-3 shrink-0">
            <button 
              onClick={() => { setActiveTab("profile"); setIsEditingProfile(!isEditingProfile); }}
              onMouseEnter={() => setIsHoveringEdit(true)}
              onMouseLeave={() => setIsHoveringEdit(false)}
              className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 border border-zinc-700/50 shadow-md"
            >
              <Edit2 size={14} className={`transition-transform duration-300 ${isHoveringEdit ? 'rotate-12 scale-110' : ''}`} />
              {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT TABS NAVIGATION --- */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mt-2">
        <div className="flex items-center gap-2 border-b border-zinc-850 pb-px overflow-x-auto no-scrollbar mask-fade-edges">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-zinc-200' : 'text-zinc-600'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mt-8">
        <AnimatePresence mode="wait">
          
          {/* 1. PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {isEditingProfile ? (
                 <div className="relative w-full h-[600px]">
                    <WorkerOnboarding
                      mode={profile ? "edit" : "create"}
                      initialData={profile}
                      onComplete={() => {
                        setIsEditingProfile(false);
                        reloadProfile();
                      }}
                    />
                 </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: About & Skills */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* About Me Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                    <FileText size={12} />
                    Professional Bio
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {bio}
                  </p>
                </div>

                {/* Technical Arsenal Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                    <Cpu size={12} />
                    Technical Arsenal
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:border-zinc-700 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience & History Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                    <Briefcase size={12} />
                    Experience & Background
                  </h3>
                  
                  <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-zinc-850">
                    
                    {/* Mock Experience Item 1 */}
                    <div className="relative pl-8">
                      <div className="absolute left-[7px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-400 border-[3px] border-zinc-950 z-10" />
                      <h4 className="text-sm font-bold text-white">{profile?.role || displayRole}</h4>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">
                        {profile?.industry || "Field Services"} {"\u2022"} {profile?.experience_years ?? 0} yrs exp
                      </p>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {workHistory}
                      </p>
                    </div>

                    {/* Mock Education Item */}
                    <div className="relative pl-8">
                      <div className="absolute left-[7px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 border-[3px] border-zinc-950 z-10" />
                      <h4 className="text-sm font-bold text-zinc-300">{education}</h4>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">Certification / training record</p>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column: Meta Info & Links */}
              <div className="space-y-6">
                
                {/* Operating Parameters Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                    <SettingsIcon size={12} />
                    Operating Parameters
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Base Rate</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1.5">
                        <DollarSign size={14} className="text-emerald-500" />
                        {rateLabel} / Day
                      </p>
                    </div>
                    
                    <div className="w-full h-px bg-zinc-850" />
                    
                    <div>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Availability</p>
                      <div className="flex flex-wrap gap-1">
                        {availableDays.map((day, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full h-px bg-zinc-850" />
                    
                    <div>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Work Configuration</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded-md">
                          {profile?.remote_pref || "\u2014"}
                        </span>
                        {preferredWorkTypes.map((type, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded-md">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Platform Links */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                    <Globe size={12} />
                    Network & Contact
                  </h3>
                  
                  <div className="space-y-3">
                    <a href={`mailto:${email}`} className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-850 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        <Mail size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">Email</p>
                        <p className="text-xs font-medium text-zinc-300">{email}</p>
                      </div>
                    </a>
                    
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-850 bg-zinc-900/50">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">Phone</p>
                        <p className="text-xs font-medium text-zinc-300">{phone}</p>
                      </div>
                    </div>

                    {linkedin ? <a href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-850 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                        <Globe size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">LinkedIn</p>
                        <p className="text-xs font-medium text-zinc-300">{linkedin}</p>
                      </div>
                    </a> : null}
                  </div>
                </div>

              </div>
              </div>
              )}
            </motion.div>
          )}

          {/* 2. PROJECTS TAB */}
          {activeTab === "projects" && (
            <motion.div
              key="tab-projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header with Action Button */}
              <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">Operations Portfolio</h3>
                  <p className="text-xs text-zinc-500 mt-1">Showcase your completed service operations and technical assignments.</p>
                </div>
                
                <button 
                  onClick={() => setIsAddProjectOpen(true)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-zinc-700/50 shadow-md"
                >
                  <Plus size={14} />
                  Add Assignment
                </button>
              </div>

              {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.map((entry) => (
                    <div key={entry.id} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/50">
                      <h4 className="text-sm font-bold text-white">{entry.operation_title}</h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        {entry.technical_role || "Technician"}
                        {entry.commercial_client ? ` · ${entry.commercial_client}` : ""}
                      </p>
                      {entry.scope_of_work && (
                        <p className="text-xs text-zinc-400 mt-3 line-clamp-3">{entry.scope_of_work}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full rounded-2xl border border-zinc-800 border-dashed bg-zinc-950/30 p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                    <Briefcase size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300">No assignments added yet</h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[280px]">
                    Document your field operations to increase your platform match rate.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. TESTIMONIALS TAB */}
          {activeTab === "testimonials" && (
            <motion.div
              key="tab-testimonials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white">Client Endorsements</h3>
                  <p className="text-xs text-zinc-500 mt-1">Verifications and service quality feedback from commercial clients.</p>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/50">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-white">{r.rating}/5</span>
                      </div>
                      {r.review_text && (
                        <p className="text-xs text-zinc-400 mt-2">{r.review_text}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full rounded-2xl border border-zinc-800 border-dashed bg-zinc-950/30 p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                    <MessageSquare size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300">No endorsements yet</h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[320px]">
                    Complete assignments to receive client reviews.
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- ADD PROJECT MODAL --- */}
      <AnimatePresence>
        {isAddProjectOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsAddProjectOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsAddProjectOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black text-white mb-6">Add Completed Assignment</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Operation Title</label>
                  <input type="text" placeholder="e.g. Commercial HVAC Overhaul" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Scope of Work</label>
                  <textarea placeholder="Specify the technical challenges resolved, service checklist completed, and materials utilizedâ€¦" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors min-h-[100px] resize-y" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Your Technical Role</label>
                    <input type="text" placeholder="e.g. Lead HVAC Technician" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Commercial Client</label>
                    <input type="text" placeholder="e.g. Apex Facilities Group" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Completion Year</label>
                    <input type="text" placeholder="e.g. 2026" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Skills & Certifications Applied</label>
                    <input type="text" placeholder="e.g. industrial-wiring, safety-cert" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Proof of Completion / Inspection Image URL</label>
                  <input type="text" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Registry Verification URL</label>
                  <input type="text" placeholder="https://credentials.gov/verify/YN-99371" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors" />
                </div>

                <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                    {/* Placeholder for checkbox tick */}
                  </div>
                  <span className="text-sm font-medium text-zinc-300 select-none">Feature this assignment at the top</span>
                  <input type="checkbox" className="hidden" />
                </label>
              </div>

              <div className="mt-8 flex items-center justify-end gap-4 border-t border-zinc-850 pt-6">
                <button 
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors border border-zinc-700/50 shadow-md"
                >
                  Save Assignment
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
