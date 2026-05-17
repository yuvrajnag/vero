"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, MessageSquare, Settings, Edit2, 
  MapPin, Mail, Phone, Globe, Clock, DollarSign, 
  GraduationCap, Award, FileText, Plus, Moon, LogOut,
  ChevronLeft, LayoutDashboard, Code2, Cpu, X
} from "lucide-react";
import Link from "next/link";
import WorkerOnboarding from "@/components/setup/WorkerOnboarding";

// Custom Icon Components for Tab Consistency
const ProfileIcon = User;
const ProjectsIcon = Code2;
const TestimonialsIcon = MessageSquare;
const SettingsIcon = Settings;

// Mock Data representing the Supabase worker_profiles schema
const MOCK_PROFILE = {
  fullName: "Yuvraj Nag",
  id: "V-99371",
  role: "Senior AI Integration Architect",
  location: "Bangalore, IN (Hybrid)",
  email: "yuvraj@vero.ai",
  phone: "+91 98765 43210",
  bio: "Specializing in autonomous agent workflows and highly optimized LLM orchestration. Passionate about brutalist design systems and zero-latency technical architecture.",
  industry: "Artificial Intelligence / SaaS",
  experienceYears: 4,
  currency: "USD ($)",
  ratePerDay: 850,
  remotePref: "Hybrid",
  languages: ["English (Native)", "Hindi (Fluent)"],
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "Supabase", "Framer Motion", "LLM Orchestration"],
  preferredWorkTypes: ["Freelance", "Contract-Based"],
  availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  hours: "09:00 - 18:00 (IST)",
  education: "B.Tech in Computer Science",
  workHistory: "Previously led UI/UX engineering at stealth AI startup. Engineered high-throughput frontend architectures handling 1M+ MAU.",
  links: {
    github: "github.com/yuvraj",
    linkedin: "linkedin.com/in/yuvraj",
    portfolio: "yuvraj.vero.ai"
  }
};

const TABS = [
  { id: "profile", label: "Profile", icon: ProfileIcon },
  { id: "projects", label: "Projects", icon: ProjectsIcon },
  { id: "testimonials", label: "Testimonials", icon: TestimonialsIcon },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
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
                <span className="text-4xl md:text-5xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent group-hover/avatar:scale-105 transition-transform duration-500">YN</span>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Update</span>
                </div>
              </div>
              
              {/* Online Status Indicator */}
              <div className="absolute bottom-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center z-20">
                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
              </div>
            </div>

            {/* Name and Basic Details */}
            <div className="pt-2 md:pt-0 md:pb-2">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                {MOCK_PROFILE.fullName}
                <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-widest align-middle">
                  {MOCK_PROFILE.id}
                </span>
              </h1>
              <p className="text-sm text-zinc-400 mt-1 font-medium">{MOCK_PROFILE.role}</p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-zinc-400" /> {MOCK_PROFILE.location}</span>
                <span className="hidden md:flex items-center gap-1.5"><Clock size={12} className="text-zinc-400" /> {MOCK_PROFILE.hours}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto md:pb-3 shrink-0">
            <button 
              onClick={() => { setActiveTab("profile"); setIsEditingProfile(!isEditingProfile); }}
              onMouseEnter={() => setIsHoveringEdit(true)}
              onMouseLeave={() => setIsHoveringEdit(false)}
              className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
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
                    <WorkerOnboarding onComplete={() => setIsEditingProfile(false)} />
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
                    {MOCK_PROFILE.bio}
                  </p>
                </div>

                {/* Technical Arsenal Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                    <Cpu size={12} />
                    Technical Arsenal
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_PROFILE.skills.map((skill, idx) => (
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
                      <h4 className="text-sm font-bold text-white">Senior Integrations Engineer</h4>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">Stealth AI Startup • 2021 - Present</p>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {MOCK_PROFILE.workHistory}
                      </p>
                    </div>

                    {/* Mock Education Item */}
                    <div className="relative pl-8">
                      <div className="absolute left-[7px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 border-[3px] border-zinc-950 z-10" />
                      <h4 className="text-sm font-bold text-zinc-300">{MOCK_PROFILE.education}</h4>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">National Institute of Technology • 2017 - 2021</p>
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
                        {MOCK_PROFILE.ratePerDay} {MOCK_PROFILE.currency} / Day
                      </p>
                    </div>
                    
                    <div className="w-full h-px bg-zinc-850" />
                    
                    <div>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Availability</p>
                      <div className="flex flex-wrap gap-1">
                        {MOCK_PROFILE.availableDays.map((day, idx) => (
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
                          {MOCK_PROFILE.remotePref}
                        </span>
                        {MOCK_PROFILE.preferredWorkTypes.map((type, idx) => (
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
                    <a href={`mailto:${MOCK_PROFILE.email}`} className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-850 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        <Mail size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">Email</p>
                        <p className="text-xs font-medium text-zinc-300">{MOCK_PROFILE.email}</p>
                      </div>
                    </a>
                    
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-850 bg-zinc-900/50">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">Phone</p>
                        <p className="text-xs font-medium text-zinc-300">{MOCK_PROFILE.phone}</p>
                      </div>
                    </div>

                    <a href={`https://${MOCK_PROFILE.links.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-850 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                        <Globe size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">LinkedIn</p>
                        <p className="text-xs font-medium text-zinc-300">{MOCK_PROFILE.links.linkedin}</p>
                      </div>
                    </a>
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
                  <h3 className="text-lg font-black text-white">Project Portfolio</h3>
                  <p className="text-xs text-zinc-500 mt-1">Showcase your best work and assignments.</p>
                </div>
                
                <button 
                  onClick={() => setIsAddProjectOpen(true)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Plus size={14} />
                  Add Project
                </button>
              </div>

              {/* Empty State / Grid Placeholder */}
              <div className="w-full rounded-2xl border border-zinc-800 border-dashed bg-zinc-950/30 p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                  <Code2 size={24} />
                </div>
                <h4 className="text-sm font-bold text-zinc-300">No projects added yet</h4>
                <p className="text-xs text-zinc-500 mt-2 max-w-[280px]">
                  Build your portfolio to increase your platform match rate with top tier companies.
                </p>
              </div>
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
                  <h3 className="text-lg font-black text-white">Client Testimonials</h3>
                  <p className="text-xs text-zinc-500 mt-1">Endorsements from companies you've worked with.</p>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-zinc-800 border-dashed bg-zinc-950/30 p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
                  <MessageSquare size={24} />
                </div>
                <h4 className="text-sm font-bold text-zinc-300">No testimonials yet</h4>
                <p className="text-xs text-zinc-500 mt-2 max-w-[320px]">
                  Complete active assignments through the platform to receive verified endorsements from clients.
                </p>
              </div>
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
              
              <h2 className="text-2xl font-black text-white mb-6">Add Project</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Title</label>
                  <input type="text" placeholder="Acme rebrand" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea placeholder="What you did, the outcome, the constraints…" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors min-h-[100px] resize-y" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Your role</label>
                    <input type="text" placeholder="Lead designer" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Client</label>
                    <input type="text" placeholder="Acme Corp" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Year</label>
                    <input type="text" placeholder="2025" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tags</label>
                    <input type="text" placeholder="branding" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Cover image URL</label>
                  <input type="text" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">External link</label>
                  <input type="text" placeholder="https://case-study.com/acme" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
                </div>

                <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                    {/* Placeholder for checkbox tick */}
                  </div>
                  <span className="text-sm font-medium text-zinc-300 select-none">Feature this project at the top</span>
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
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors shadow-lg"
                >
                  Save project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
