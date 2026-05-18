"use client";

import type { ReactNode } from "react";
import {
  Briefcase,
  MessageSquare,
} from "lucide-react";
import type { JobResponse, NegotiationDashboardItem } from "@/lib/api";
import { negotiationApi } from "@/lib/api";
import {
  formatJobBudget,
  jobCardTitle,
  mapUrgencyLabel,
} from "@/lib/dashboard-mappers";

interface WorkerDashboardTabsProps {
  activeTab: string;
  loading: boolean;
  opportunities: JobResponse[];
  assignments: JobResponse[];
  negotiations: NegotiationDashboardItem[];
  onRefresh?: () => void;
}

export function WorkerDashboardTabs({
  activeTab,
  loading,
  opportunities,
  assignments,
  negotiations,
  onRefresh,
}: WorkerDashboardTabsProps) {
  if (activeTab === "Opportunities") {
    if (opportunities.length > 0) {
      return (
        <div className="w-full max-w-3xl space-y-3 text-left">
          {opportunities.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{jobCardTitle(job)}</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  {job.location || "—"} · {formatJobBudget(job)} · {mapUrgencyLabel(job.urgency_level)}
                </p>
                {job.required_skills?.length > 0 && (
                  <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-wider">
                    {job.required_skills.join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-mono border border-zinc-800 bg-zinc-900 px-2 py-1 rounded text-zinc-400 uppercase self-start sm:self-center">
                {job.status}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return (
      <EmptyTab
        icon={<Briefcase size={52} className="text-zinc-100 animate-pulse" />}
        title={loading ? "Loading opportunities…" : "No matching opportunities yet"}
        description="AI-powered workforce opportunities will appear here when companies create relevant requests matching your skills and availability."
      />
    );
  }

  if (activeTab === "Assignments") {
    if (assignments.length > 0) {
      return (
        <div className="w-full max-w-3xl space-y-3 text-left">
          {assignments.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{jobCardTitle(job)}</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  {job.location || "—"} · {formatJobBudget(job)}
                  {job.duration ? ` · ${job.duration}` : ""}
                </p>
              </div>
              <span className="text-[10px] font-mono border border-emerald-900/40 bg-emerald-950/30 px-2 py-1 rounded text-emerald-400 uppercase self-start sm:self-center">
                {job.status}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return (
      <EmptyTab
        icon={<Briefcase size={52} className="text-zinc-100" />}
        title="No active assignments"
        description="Accepted tasks, active workforce operations, and assignment progress will appear here."
      />
    );
  }

  if (activeTab === "Negotiations") {
    if (negotiations.length > 0) {
      return (
        <div className="w-full max-w-3xl space-y-3 text-left">
          {negotiations.map((neg) => (
            <div key={neg.id} className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/60">
              <h4 className="text-sm font-bold text-white">{neg.request_title}</h4>
              <p className="text-xs text-zinc-500 mt-1">{neg.role}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-zinc-600 uppercase text-[10px] tracking-wider">Original</span>
                  <span className="text-zinc-300 block mt-1">{neg.original_rate}</span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase text-[10px] tracking-wider">Counter</span>
                  <span className="text-zinc-300 block mt-1">{neg.counter_rate}</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-3">
                {neg.ai_recommendation}
              </p>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await negotiationApi.update(neg.id, { negotiation_status: "rejected" });
                    onRefresh?.();
                  }}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await negotiationApi.update(neg.id, {
                      negotiation_status: "accepted",
                      accepted_by: "technician",
                    });
                    onRefresh?.();
                  }}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white text-black rounded-lg hover:bg-zinc-200"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <EmptyTab
        icon={<MessageSquare size={52} className="text-zinc-100" />}
        title="No active negotiations"
        description="Pending offers, counter offers, and AI-assisted workforce negotiations will appear here."
      />
    );
  }

  return null;
}

function EmptyTab({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl w-full">
      <div className="w-[110px] h-[110px] rounded-full bg-zinc-950 border-[1.5px] border-zinc-800 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.015)] mb-6 relative">
        {icon}
        <div className="absolute inset-0.5 rounded-full border border-zinc-800/50 pointer-events-none" />
      </div>
      <h5 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">{title}</h5>
      <p className="text-xs md:text-sm text-zinc-500 leading-relaxed max-w-lg mt-4">{description}</p>
    </div>
  );
}
