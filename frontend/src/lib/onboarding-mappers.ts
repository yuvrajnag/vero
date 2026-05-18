import type { CompanyCreate, TechnicianCreate } from "./api";

function parseCurrency(raw: string): string {
  const token = raw.split(" ")[0] ?? raw;
  return token.replace(/[()]/g, "").trim();
}

export function formToCompanyCreate(data: {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  hqLocation: string;
  logo?: string;
  industry: string;
  otherIndustry?: string;
  companySize: string;
  businessCategory: string[];
  website: string;
  regions: string[];
  about: string;
  workforceType: string[];
  hiringFreq: string;
  remotePref: string;
  urgency?: string;
  verificationReqs: string[];
  currency: string;
  budget: number;
  teamSize: number;
  activeProjects: number;
  workforceGoals: string[];
  assignmentWorkflow: string;
  commsPref: string[];
  notifications?: string;
  registration?: string;
  taxDocs?: string;
  rep: string;
  identity?: string;
  portfolio?: string;
  links?: { platform: string; url: string }[];
}): CompanyCreate {
  return {
    company_name: data.companyName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    hq_location: data.hqLocation,
    logo_url: data.logo,
    industry: data.industry,
    other_industry: data.otherIndustry || undefined,
    company_size: data.companySize,
    business_categories: data.businessCategory,
    website_url: data.website,
    operating_regions: data.regions,
    about: data.about,
    preferred_workforce_types: data.workforceType,
    hiring_frequency: data.hiringFreq,
    remote_pref: data.remotePref,
    urgency_handling: data.urgency,
    verification_requirements: data.verificationReqs,
    currency: parseCurrency(data.currency),
    project_budget: data.budget,
    current_team_size: data.teamSize,
    active_projects_count: data.activeProjects,
    workforce_goals: data.workforceGoals,
    assignment_workflow: data.assignmentWorkflow,
    communication_preferences: data.commsPref,
    notification_settings: data.notifications,
    registration_doc_url: data.registration,
    tax_docs_url: data.taxDocs,
    authorized_rep_name: data.rep,
    identity_verification_url: data.identity,
    portfolio_url: data.portfolio,
    verification_links: data.links ?? [],
  };
}

export async function uploadOnboardingFile(
  file: File,
  category: string
): Promise<string> {
  const mockImages: Record<string, string> = {
    profile: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    company: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
  };
  
  if (mockImages[category]) {
    return mockImages[category];
  }
  return "https://example.com/mock-verified-document.pdf";
}

export async function resolveFileField(
  value: unknown,
  category: string,
  options?: { required?: boolean }
): Promise<string | undefined> {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof File) {
    if (value.size === 0) return undefined;
    try {
      return await uploadOnboardingFile(value, category);
    } catch (err) {
      if (options?.required) throw err;
      return undefined;
    }
  }
  return undefined;
}
