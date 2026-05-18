"use client";

import { useCallback, useEffect, useState } from "react";
import {
  aiApi,
  companyApi,
  jobApi,
  negotiationApi,
  paymentApi,
  reviewApi,
  technicianApi,
  type CompanyResponse,
  type JobResponse,
  type NegotiationDashboardItem,
  type TechnicianMatchResult,
  type TechnicianResponse,
  type WorkforceMemberResponse,
} from "@/lib/api";
import {
  companyToProfile,
  mapJobToRequestRow,
  mapUrgencyToApi,
  type CompanyRequestRow,
} from "@/lib/dashboard-mappers";

export interface MatchCandidateUI {
  technicianId: string;
  name: string;
  role: string;
  match: string;
  exp: string;
  rate: string;
  location?: string;
  isOnline: boolean;
}

export function useCompanyDashboard(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<CompanyRequestRow[]>([]);
  const [workforce, setWorkforce] = useState<WorkforceMemberResponse[]>([]);
  const [negotiations, setNegotiations] = useState<NegotiationDashboardItem[]>([]);
  const [companyProfile, setCompanyProfile] = useState({
    name: "",
    industry: "",
    location: "",
    email: "",
    phone: "",
    hiringPreferences: "",
    website: "",
    verificationStatus: "Pending Verification",
    orgDetails: "",
  });
  const [rawJobs, setRawJobs] = useState<JobResponse[]>([]);
  const [matchCandidates, setMatchCandidates] = useState<MatchCandidateUI[]>([]);
  const [featuredMatch, setFeaturedMatch] = useState<{
    tech: TechnicianResponse;
    score: number;
  } | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [jobs, workforceList, negs, company] = await Promise.all([
        jobApi.myJobs(),
        jobApi.myWorkforce(),
        negotiationApi.me(),
        companyApi.me().catch(() => null),
      ]);

      const nameByTechId = new Map(
        workforceList.map((w) => [w.technician_id, w.name])
      );

      setRawJobs(jobs);
      setRequests(
        jobs.map((job) =>
          mapJobToRequestRow(
            job,
            job.assigned_technician_id
              ? nameByTechId.get(job.assigned_technician_id) ?? "Assigned"
              : null
          )
        )
      );
      setWorkforce(workforceList);
      setNegotiations(negs);

      if (company) {
        setCompanyProfile(companyToProfile(company));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const enrichMatchesFromVector = async (
    matches: { technician_id: string; final_score: number; experience_years: number; is_online: boolean }[]
  ) => {
    const enriched: MatchCandidateUI[] = [];
    for (const m of matches) {
      try {
        const tech = await technicianApi.get(m.technician_id);
        const rate = tech.daily_rate ?? tech.base_hourly_rate;
        enriched.push({
          technicianId: m.technician_id,
          name: tech.full_name || "Technician",
          role: tech.role || "Field Technician",
          match: `${Math.round(m.final_score * 100)}%`,
          exp: `${m.experience_years} Years`,
          rate: rate != null ? `₹${rate.toLocaleString()}/day` : "—",
          location: tech.location ?? undefined,
          isOnline: m.is_online,
        });
      } catch {
        enriched.push({
          technicianId: m.technician_id,
          name: "Technician",
          role: "Field Technician",
          match: `${Math.round(m.final_score * 100)}%`,
          exp: `${m.experience_years} Years`,
          rate: "—",
          isOnline: m.is_online,
        });
      }
    }
    setMatchCandidates(enriched);
    if (matches.length > 0) {
      try {
        const top = await technicianApi.get(matches[0].technician_id);
        setFeaturedMatch({ tech: top, score: matches[0].final_score });
      } catch {
        setFeaturedMatch(null);
      }
    }
  };

  const enrichMatches = async (matches: TechnicianMatchResult[]) => {
    const enriched: MatchCandidateUI[] = [];
    for (const m of matches) {
      try {
        const tech = await technicianApi.get(m.technician_id);
        const rate = tech.daily_rate ?? tech.base_hourly_rate;
        enriched.push({
          technicianId: m.technician_id,
          name: tech.full_name || "Technician",
          role: tech.role || "Field Technician",
          match: `${Math.round(m.match_score * 100)}%`,
          exp: `${m.experience_years} Years`,
          rate: rate != null ? `₹${rate.toLocaleString()}/day` : "—",
          location: tech.location ?? undefined,
          isOnline: m.is_online,
        });
      } catch {
        enriched.push({
          technicianId: m.technician_id,
          name: "Technician",
          role: "Field Technician",
          match: `${Math.round(m.match_score * 100)}%`,
          exp: `${m.experience_years} Years`,
          rate: "—",
          isOnline: m.is_online,
        });
      }
    }
    setMatchCandidates(enriched);
    if (enriched.length > 0) {
      const top = await technicianApi.get(matches[0].technician_id);
      setFeaturedMatch({ tech: top, score: matches[0].match_score });
    }
  };

  const createJobAndMatch = async (form: {
    role: string;
    skills: string;
    budget: string;
    location: string;
    urgency: string;
    duration: string;
    certifications: string;
    description: string;
  }) => {
    const job = await jobApi.create({
      required_role: form.role,
      title: form.role,
      description: form.description || undefined,
      required_skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      budget: Number(form.budget),
      location: form.location,
      urgency_level: mapUrgencyToApi(form.urgency),
      duration: form.duration || undefined,
      certifications_required: form.certifications || undefined,
    });
    setActiveJobId(job.id);
    try {
      const vectorRes = await aiApi.vectorMatch(job.id);
      if (vectorRes?.matches?.length > 0) {
        await enrichMatchesFromVector(vectorRes.matches);
      } else {
        const matchRes = await aiApi.match(job.id);
        if (matchRes?.matches?.length > 0) {
          await enrichMatches(matchRes.matches);
        } else {
          setMatchCandidates([]);
          setFeaturedMatch(null);
        }
      }
    } catch {
      try {
        const matchRes = await aiApi.match(job.id);
        if (matchRes?.matches?.length > 0) {
          await enrichMatches(matchRes.matches);
        } else {
          setMatchCandidates([]);
          setFeaturedMatch(null);
        }
      } catch (err) {
        setMatchCandidates([]);
        setFeaturedMatch(null);
      }
    }
    await refresh();
    return job.id;
  };

  const completeJobWithPayment = async (
    jobId: string,
    technicianId: string,
    amount: number,
    customerId: string,
    rating?: number,
    reviewText?: string
  ) => {
    await jobApi.updateStatus(jobId, "completed");
    await paymentApi.process({
      job_id: jobId,
      customer_id: customerId,
      technician_id: technicianId,
      amount,
      payment_method: "platform_wallet",
    });
    if (rating != null && rating > 0) {
      await reviewApi.submit({
        job_request_id: jobId,
        technician_id: technicianId,
        rating,
        review_text: reviewText,
      });
    }
    await refresh();
  };

  const assignTechnician = async (jobId: string, technicianId: string) => {
    await jobApi.assign(jobId, technicianId);
    await refresh();
  };

  const workforceSpend = rawJobs
    .filter((j) =>
      ["matched", "in_progress", "accepted", "negotiating"].includes(j.status)
    )
    .reduce((sum, j) => sum + (j.budget ?? 0), 0);

  return {
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
  };
}
