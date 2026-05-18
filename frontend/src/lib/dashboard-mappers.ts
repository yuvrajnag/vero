import type { CompanyResponse, JobResponse, NegotiationDashboardItem, TechnicianResponse, WorkforceMemberResponse } from "./api";

export interface CompanyRequestRow {
  id: string;
  role: string;
  skills: string[];
  budget: string;
  location: string;
  urgency: string;
  duration: string;
  status: string;
  assignedWorker: string | null;
}

export function mapJobStatus(status: string, assignedWorker: string | null): string {
  if (assignedWorker) return "Assigned";
  switch (status) {
    case "pending":
      return "Matching Active";
    case "negotiating":
      return "Negotiating";
    case "matched":
      return "Matched";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function mapUrgencyLabel(urgency: string): string {
  switch (urgency?.toLowerCase()) {
    case "urgent":
    case "emergency":
      return "Urgent";
    case "low":
      return "Low";
    default:
      return "Medium";
  }
}

export function mapUrgencyToApi(urgency: string): string {
  switch (urgency) {
    case "Urgent":
      return "urgent";
    case "Low":
      return "low";
    default:
      return "normal";
  }
}

export function mapJobToRequestRow(
  job: JobResponse,
  assignedName: string | null
): CompanyRequestRow {
  return {
    id: job.id.slice(0, 8).toUpperCase(),
    role: job.required_role || job.title,
    skills: job.required_skills || [],
    budget: job.budget != null ? String(job.budget) : "—",
    location: job.location || "—",
    urgency: mapUrgencyLabel(job.urgency_level),
    duration: job.duration || "—",
    status: mapJobStatus(job.status, assignedName),
    assignedWorker: assignedName,
  };
}

export function companyToProfile(company: CompanyResponse) {
  return {
    name: company.company_name || "",
    industry: company.other_industry || company.industry || "",
    location: company.hq_location || "",
    email: company.email || "",
    phone: company.phone || "",
    hiringPreferences: company.hiring_preferences || "",
    website: company.website_url || "",
    verificationStatus: company.identity_verification_url ? "Verified Partner" : "Pending Verification",
    orgDetails: company.about || "",
  };
}

export function profileToCompanyUpdate(draft: ReturnType<typeof companyToProfile>) {
  return {
    company_name: draft.name,
    industry: draft.industry,
    hq_location: draft.location,
    email: draft.email,
    phone: draft.phone,
    hiring_preferences: draft.hiringPreferences,
    website_url: draft.website,
    about: draft.orgDetails,
  };
}

export function formatRate(amount: number | null | undefined, currency = "₹"): string {
  if (amount == null) return "—";
  return `${currency}${amount.toLocaleString()}/day`;
}

export function technicianDisplayName(tech: TechnicianResponse): string {
  return tech.full_name || "Technician";
}

export function technicianRole(tech: TechnicianResponse): string {
  return tech.role || "Field Technician";
}

export function formatJobBudget(job: JobResponse): string {
  if (job.budget == null) return "—";
  return `₹${job.budget.toLocaleString()}`;
}

export function jobCardTitle(job: JobResponse): string {
  return job.title || job.required_role || "Work request";
}

export type { NegotiationDashboardItem, WorkforceMemberResponse };
