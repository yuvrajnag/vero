
// ── Central API Client ────────────────────────────────────────────────────────
// All backend calls go through here. Token is read from localStorage.

// Call FastAPI directly (default port 8000). Override with NEXT_PUBLIC_API_URL in .env.local.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "vero_token";
const REFRESH_KEY = "vero_refresh_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function persistTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  return "mock-token-usr-company";
}

// ── Mock Database and Core Router ─────────────────────────────────────────────

function initializeMockDB() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("vero_db_initialized") === "true") return;

  const defaultUsers = [
    {
      id: "usr-admin",
      email: "admin@vero.com",
      password: "admin123",
      full_name: "Admin Coordinator",
      role: "admin",
      is_active: true,
      is_verified: true,
      onboarding_completed: true,
      profile_status: "active"
    },
    {
      id: "usr-company",
      email: "company@vero.com",
      password: "company123",
      full_name: "Tata Power Solar Ltd",
      role: "customer",
      is_active: true,
      is_verified: true,
      onboarding_completed: true,
      profile_status: "active"
    },
    {
      id: "usr-tech",
      email: "tech@vero.com",
      password: "tech123",
      full_name: "Vikram Rao",
      role: "technician",
      is_active: true,
      is_verified: true,
      onboarding_completed: true,
      profile_status: "active"
    }
  ];

  const defaultTechnicians = [
    {
      id: "tech-vikram",
      user_id: "usr-tech",
      full_name: "Vikram Rao",
      email: "tech@vero.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      address: "12, Electronic City, Bangalore",
      profile_picture_url: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200",
      role: "Solar Technician",
      industry: "Renewable Energy",
      skills: ["Solar Panel Installation", "Grid Syncer", "DC Cabling", "Inverter Maintenance", "Photovoltaic Systems", "Industrial Power"],
      experience_years: 8,
      preferred_work_types: ["Contract", "Full-time"],
      languages: ["English", "Hindi", "Kannada"],
      available_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hours_start: "09:00",
      hours_end: "18:00",
      remote_pref: "On-Site",
      currency: "INR",
      daily_rate: 2500,
      preferred_locations: "Bangalore South",
      emergency_availability: "Yes",
      education: "Diploma in Electrical Engineering",
      previous_employers: "Apex Energy Ltd",
      work_history: "Managed over 50+ residential solar grids and 5 utility-scale rooftop solar plants.",
      bio: "Dedicated solar systems engineer specializing in high-efficiency panel alignment and grid sync negotiations.",
      resume_url: "https://example.com/vikram_rao_resume.pdf",
      linkedin_url: "https://linkedin.com/in/vikram-rao-mock",
      certificates_url: "https://example.com/certificate.pdf",
      licenses_url: "https://example.com/license.pdf",
      government_id_url: "https://example.com/gov_id.pdf",
      verification_links: [{ platform: "CertRegistry", url: "https://example.com/verify/1" }],
      custom_status_message: "Ready for on-field solar deployments!",
      is_online: true,
      current_status: "Available for dispatch",
      base_hourly_rate: 300,
      price: 2500,
      latitude: 12.9716,
      longitude: 77.5946,
      average_rating: 4.9,
      success_score: 98,
      fraud_risk_score: 0.02,
      total_jobs_completed: 48,
      verification_level: "Verified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "tech-rohan",
      user_id: "usr-tech-rohan",
      full_name: "Rohan Malhotra",
      email: "rohan@vero.com",
      phone: "+91 91234 56789",
      location: "Bangalore, India",
      address: "45, Koramangala 4th Block, Bangalore",
      profile_picture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      role: "HVAC Specialist",
      industry: "Field Services & Maintenance",
      skills: ["HVAC Diagnostics", "Chiller Calibration", "Compressor Rebuilds", "Refrigerant Management", "Thermal Systems", "Air Quality Audit"],
      experience_years: 6,
      preferred_work_types: ["Contract", "On-call / Gig"],
      languages: ["English", "Hindi"],
      available_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      hours_start: "08:00",
      hours_end: "20:00",
      remote_pref: "On-Site",
      currency: "INR",
      daily_rate: 2200,
      preferred_locations: "Bangalore Central",
      emergency_availability: "Yes",
      education: "ITT Certification in HVAC Systems",
      previous_employers: "Apex Climate Systems",
      work_history: "Led building maintenance diagnostics and chiller plant installations for IT parks.",
      bio: "Expert HVAC technician with extensive experience in energy-efficient chilling towers and building ventilation units.",
      resume_url: "https://example.com/rohan_hvac_resume.pdf",
      linkedin_url: "https://linkedin.com/in/rohan-hvac",
      certificates_url: "https://example.com/certificate.pdf",
      licenses_url: "https://example.com/license.pdf",
      government_id_url: "https://example.com/gov_id.pdf",
      verification_links: [],
      custom_status_message: "On duty - servicing corporate chiller units.",
      is_online: true,
      current_status: "Active",
      base_hourly_rate: 275,
      price: 2200,
      latitude: 12.9279,
      longitude: 77.6271,
      average_rating: 4.8,
      success_score: 95,
      fraud_risk_score: 0.04,
      total_jobs_completed: 36,
      verification_level: "Verified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "tech-pranav",
      user_id: "usr-tech-pranav",
      full_name: "Pranav Sharma",
      email: "pranav@vero.com",
      phone: "+91 88888 77777",
      location: "Delhi, India",
      address: "Block B, Connaught Place, New Delhi",
      profile_picture_url: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=200",
      role: "Home Automation Specialist",
      industry: "Facility Maintenance & Field Services",
      skills: ["Smart Grid Automation", "IoT Systems", "Industrial Wiring", "PLC Programming", "Diagnostics", "Smart Switch"],
      experience_years: 5,
      preferred_work_types: ["Contract", "Full-time"],
      languages: ["English", "Hindi"],
      available_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hours_start: "10:00",
      hours_end: "19:00",
      remote_pref: "Hybrid",
      currency: "INR",
      daily_rate: 2800,
      preferred_locations: "New Delhi",
      emergency_availability: "No",
      education: "B.Tech in Automation Engineering",
      previous_employers: "Smart Homes Corp",
      work_history: "Configured smart IoT networks for 120+ high-end smart homes in Delhi NCR.",
      bio: "Enthusiastic automation systems specialist, linking heavy industrial circuits with cloud IoT relays.",
      resume_url: "https://example.com/priya_resume.pdf",
      linkedin_url: "https://linkedin.com/in/priya-smart",
      certificates_url: "https://example.com/cert.pdf",
      licenses_url: "https://example.com/lic.pdf",
      government_id_url: "https://example.com/id.pdf",
      verification_links: [],
      custom_status_message: "Testing new IoT Zigbee switches.",
      is_online: true,
      current_status: "Testing Devices",
      base_hourly_rate: 350,
      price: 2800,
      latitude: 28.6139,
      longitude: 77.2090,
      average_rating: 4.7,
      success_score: 93,
      fraud_risk_score: 0.01,
      total_jobs_completed: 27,
      verification_level: "Verified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const defaultCompanies = [
    {
      id: "comp-tata",
      user_id: "usr-company",
      company_name: "Tata Power Solar Ltd",
      email: "company@vero.com",
      phone: "+91 22 6665 8282",
      address: "Carnac Receiving Station, Mumbai, Maharashtra",
      hq_location: "Mumbai",
      logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
      industry: "Field Services & Maintenance",
      other_industry: "",
      company_size: "200+",
      business_categories: ["Solar Utility", "Electrical Infrastructure"],
      website_url: "https://tatapowersolar.com",
      operating_regions: ["Bangalore South", "Mumbai West", "Delhi NCR"],
      about: "India's largest integrated solar company, executing large scale industrial and retail rooftop solar grids.",
      preferred_workforce_types: ["Field Technicians", "Contract-Based"],
      hiring_frequency: "Weekly",
      remote_pref: "On-Site",
      urgency_handling: "Immediate Dispatch",
      verification_requirements: ["Background Check", "License Verification", "Govt ID Required"],
      currency: "INR",
      project_budget: 15000,
      current_team_size: 45,
      active_projects_count: 8,
      workforce_goals: ["Scale technical workforce", "Reduce dispatch latency"],
      assignment_workflow: "Direct Hire",
      communication_preferences: ["Email", "SMS"],
      notification_settings: "All Alerts",
      registration_doc_url: "https://example.com/registration.pdf",
      tax_docs_url: "https://example.com/tax_doc.pdf",
      identity_verification_url: "https://example.com/rep_id.pdf",
      portfolio_url: "https://example.com/portfolio.pdf",
      authorized_rep_name: "Jane Director",
      verification_links: [],
      hiring_preferences: "Prefer verified high-voltage workers.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const defaultJobs = [
    {
      id: "job-solar-grid",
      customer_id: "comp-tata",
      assigned_technician_id: null,
      required_role: "Solar Technician",
      title: "Rooftop Solar Grid Integration",
      description: "Need a technician to assemble and align 15kW monocrystalline panel rows, calibrate a grid syncer inverter, and connect low-voltage DC cabling runs.",
      required_skills: ["Solar Panel Installation", "Grid Syncer", "DC Cabling"],
      budget: 3000,
      price: 3000,
      location: "Bangalore, India",
      urgency_level: "Urgent",
      duration: "3 Days",
      certifications_required: "Safety Standards Grade A",
      status: "pending",
      ai_match_score: 98,
      negotiation_status: "idle",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "job-hvac-repair",
      customer_id: "comp-tata",
      assigned_technician_id: "tech-rohan",
      required_role: "HVAC Specialist",
      title: "Cleanroom Chiller Diagnostics & Compressor Rebuild",
      description: "Perform thermal troubleshooting and compressor diagnostic checks on an industrial Carrier cleanroom chiller. Refill R-134a refrigerant and calibrate thermal loops.",
      required_skills: ["HVAC Diagnostics", "Chiller Calibration", "Compressor Rebuilds"],
      budget: 2500,
      price: 2400,
      location: "Bangalore, India",
      urgency_level: "Immediate Dispatch",
      duration: "2 Days",
      certifications_required: "HVAC Grade A",
      status: "in_progress",
      ai_match_score: 95,
      negotiation_status: "accepted",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "job-iot-trouble",
      customer_id: "comp-tata",
      assigned_technician_id: "tech-priya",
      required_role: "Home Automation Specialist",
      title: "Smart Switch Relay Calibration",
      description: "Troubleshoot malfunctioning Zigbee mesh network nodes and smart control panels. Calibrate PLC relays and industrial switches in a luxury residential unit.",
      required_skills: ["Smart Grid Automation", "IoT Systems", "Smart Switch"],
      budget: 2800,
      price: 2800,
      location: "Delhi, India",
      urgency_level: "Standard Notice",
      duration: "1 Day",
      certifications_required: "IoT Certification",
      status: "completed",
      ai_match_score: 92,
      negotiation_status: "accepted",
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  const defaultWorkforce = [
    {
      id: "w-rohan",
      job_request_id: "job-hvac-repair",
      technician_id: "tech-rohan",
      name: "Rohan Malhotra",
      role: "HVAC Specialist",
      status: "On-Site",
      job_status: "in_progress",
      assignment: "Cleanroom Chiller Diagnostics",
      duration: "2 Days",
      budget: 2400
    },
    {
      id: "w-priya",
      job_request_id: "job-iot-trouble",
      technician_id: "tech-priya",
      name: "Priya Sharma",
      role: "Home Automation Specialist",
      status: "Completed",
      job_status: "completed",
      assignment: "Smart Switch Relay Calibration",
      duration: "1 Day",
      budget: 2800
    }
  ];

  const defaultNotifications = [
    {
      id: "notif-welcome",
      user_id: "usr-company",
      title: "Welcome to Vero AI Platform",
      message: "Your enterprise workspace is verified and initialized. Welcome to the future of workforce allocation!",
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: "notif-assigned",
      user_id: "usr-tech",
      title: "New Job Match Registered",
      message: "You have been matched for Tata Power's 'Rooftop Solar Grid Integration' project. Check your opportunities dashboard!",
      is_read: false,
      created_at: new Date().toISOString()
    }
  ];

  const defaultReviews = [
    {
      id: "rev-1",
      technician_id: "tech-priya",
      customer_id: "comp-tata",
      job_request_id: "job-iot-trouble",
      rating: 5,
      review_text: "Absolutely flawless execution. Priya calibrated our smart switches and Zigbee mesh relay system in less than three hours. Highly recommended for complex residential IoT issues!",
      sentiment_score: 0.98,
      is_flagged: false,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  const defaultWallets = {
    "tech-vikram": {
      id: "wall-vikram",
      technician_id: "tech-vikram",
      balance: 12500,
      total_earnings: 35000,
      pending_payouts: 5000,
      currency: "INR"
    },
    "tech-rohan": {
      id: "wall-rohan",
      technician_id: "tech-rohan",
      balance: 4800,
      total_earnings: 24000,
      pending_payouts: 2400,
      currency: "INR"
    },
    "tech-priya": {
      id: "wall-priya",
      technician_id: "tech-priya",
      balance: 8400,
      total_earnings: 16800,
      pending_payouts: 0,
      currency: "INR"
    }
  };

  localStorage.setItem("vero_users", JSON.stringify(defaultUsers));
  localStorage.setItem("vero_technicians", JSON.stringify(defaultTechnicians));
  localStorage.setItem("vero_companies", JSON.stringify(defaultCompanies));
  localStorage.setItem("vero_jobs", JSON.stringify(defaultJobs));
  localStorage.setItem("vero_workforce", JSON.stringify(defaultWorkforce));
  localStorage.setItem("vero_notifications", JSON.stringify(defaultNotifications));
  localStorage.setItem("vero_reviews", JSON.stringify(defaultReviews));
  localStorage.setItem("vero_wallets", JSON.stringify(defaultWallets));
  localStorage.setItem("vero_negotiations", JSON.stringify([]));
  localStorage.setItem("vero_payments", JSON.stringify([]));
  localStorage.setItem("vero_auto_assign", JSON.stringify({}));
  localStorage.setItem("vero_db_initialized", "true");
}

async function handleMockRequest(path: string, options: RequestInit = {}): Promise<any> {
  const method = options.method?.toUpperCase() || "GET";
  const url = new URL(path, "http://localhost:8000");
  const pathname = url.pathname;

  const getLoggedInUser = () => {
    const userId = localStorage.getItem("vero_logged_in_user_id");
    if (!userId) throw new Error("Unauthorized");
    const users = JSON.parse(localStorage.getItem("vero_users") || "[]");
    const user = users.find((u: any) => u.id === userId);
    if (!user) throw new Error("Unauthorized");
    return user;
  };

  const getOrAutoCreateTechnician = (userId: string) => {
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    let tech = techs.find((t: any) => t.user_id === userId);
    if (!tech) {
      const users = JSON.parse(localStorage.getItem("vero_users") || "[]");
      const user = users.find((u: any) => u.id === userId) || { full_name: "Vikram Rao", email: "tech@vero.com" };
      tech = {
        id: "tech-" + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        full_name: user.full_name || "Vikram Rao",
        email: user.email || "tech@vero.com",
        phone: "+91 98765 43210",
        location: "Bangalore, India",
        address: "12, Electronic City, Bangalore",
        profile_picture_url: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200",
        role: "Solar Technician",
        industry: "Renewable Energy",
        skills: ["Solar Panel Installation", "Grid Syncer", "DC Cabling", "Inverter Maintenance", "Photovoltaic Systems", "Industrial Power"],
        experience_years: 8,
        preferred_work_types: ["Contract", "Full-time"],
        languages: ["English", "Hindi", "Kannada"],
        available_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        hours_start: "09:00",
        hours_end: "18:00",
        remote_pref: "On-Site",
        currency: "INR",
        daily_rate: 2500,
        preferred_locations: "Bangalore South",
        emergency_availability: "Yes",
        education: "Diploma in Electrical Engineering",
        previous_employers: "Apex Energy Ltd",
        work_history: "Managed over 50+ residential solar grids and 5 utility-scale rooftop solar plants.",
        bio: "Dedicated solar systems engineer specializing in high-efficiency panel alignment and grid sync negotiations.",
        resume_url: "https://example.com/resume.pdf",
        linkedin_url: "https://linkedin.com/in/mock",
        certificates_url: "https://example.com/certificate.pdf",
        licenses_url: "https://example.com/license.pdf",
        government_id_url: "https://example.com/gov_id.pdf",
        verification_links: [],
        custom_status_message: "Ready for on-field solar deployments!",
        is_online: true,
        current_status: "Available for dispatch",
        base_hourly_rate: 300,
        price: 2500,
        latitude: 12.9716,
        longitude: 77.5946,
        average_rating: 4.9,
        success_score: 98,
        fraud_risk_score: 0.02,
        total_jobs_completed: 0,
        verification_level: "Verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      techs.push(tech);
      localStorage.setItem("vero_technicians", JSON.stringify(techs));
    }
    return tech;
  };

  const getOrAutoCreateCompany = (userId: string) => {
    const comps = JSON.parse(localStorage.getItem("vero_companies") || "[]");
    let comp = comps.find((c: any) => c.user_id === userId);
    if (!comp) {
      const users = JSON.parse(localStorage.getItem("vero_users") || "[]");
      const user = users.find((u: any) => u.id === userId) || { full_name: "Tata Power Solar Ltd", email: "company@vero.com" };
      comp = {
        id: "comp-" + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        company_name: user.full_name || "Tata Power Solar Ltd",
        email: user.email || "company@vero.com",
        phone: "+91 22 6665 8282",
        address: "Carnac Receiving Station, Mumbai, Maharashtra",
        hq_location: "Mumbai",
        logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
        industry: "Field Services & Maintenance",
        other_industry: "",
        company_size: "200+",
        business_categories: ["Solar Utility", "Electrical Infrastructure"],
        website_url: "https://tatapowersolar.com",
        operating_regions: ["Bangalore South", "Mumbai West", "Delhi NCR"],
        about: "India's largest integrated solar company, executing large scale industrial and retail rooftop solar grids.",
        preferred_workforce_types: ["Field Technicians", "Contract-Based"],
        hiring_frequency: "Weekly",
        remote_pref: "On-Site",
        urgency_handling: "Immediate Dispatch",
        verification_requirements: ["Background Check", "License Verification", "Govt ID Required"],
        currency: "INR",
        project_budget: 15000,
        current_team_size: 45,
        active_projects_count: 8,
        workforce_goals: ["Scale technical workforce", "Reduce dispatch latency"],
        assignment_workflow: "Direct Hire",
        communication_preferences: ["Email", "SMS"],
        notification_settings: "All Alerts",
        registration_doc_url: "https://example.com/registration.pdf",
        tax_docs_url: "https://example.com/tax_doc.pdf",
        identity_verification_url: "https://example.com/rep_id.pdf",
        portfolio_url: "https://example.com/portfolio.pdf",
        authorized_rep_name: "Jane Director",
        verification_links: [],
        hiring_preferences: "Prefer verified high-voltage workers.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      comps.push(comp);
      localStorage.setItem("vero_companies", JSON.stringify(comps));
    }
    return comp;
  };

  // 1. AUTH ME
  if (pathname === "/auth/me" && method === "GET") {
    const user = getLoggedInUser();
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
      is_verified: user.is_verified,
      onboarding_completed: user.onboarding_completed,
      profile_status: user.profile_status
    };
  }

  // 2. COMPLETE ONBOARDING
  if (pathname === "/auth/complete-onboarding" && method === "POST") {
    const user = getLoggedInUser();
    const { role } = JSON.parse((options.body as string) || "{}");
    const users = JSON.parse(localStorage.getItem("vero_users") || "[]");
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx].onboarding_completed = true;
      users[idx].role = role;
      localStorage.setItem("vero_users", JSON.stringify(users));
      return { ...users[idx] };
    }
    throw new Error("User not found");
  }

  // 3. TECHNICIANS ME
  if (pathname === "/technicians/me" && method === "GET") {
    const user = getLoggedInUser();
    return getOrAutoCreateTechnician(user.id);
  }

  // 4. CREATE TECHNICIAN
  if (pathname === "/technicians/" && method === "POST") {
    const user = getLoggedInUser();
    const body = JSON.parse((options.body as string) || "{}");
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");

    let tech = techs.find((t: any) => t.user_id === user.id);
    if (tech) {
      tech = { ...tech, ...body, updated_at: new Date().toISOString() };
      const idx = techs.findIndex((t: any) => t.user_id === user.id);
      techs[idx] = tech;
    } else {
      tech = {
        id: "tech-" + Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        email: user.email,
        full_name: user.full_name,
        profile_picture_url: body.profile_picture_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        is_online: true,
        current_status: "Available for dispatch",
        average_rating: 4.8,
        success_score: 95,
        fraud_risk_score: 0.03,
        total_jobs_completed: 0,
        verification_level: "Verified",
        latitude: 12.9716 + (Math.random() - 0.5) * 0.05,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.05,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...body
      };
      techs.push(tech);
    }
    localStorage.setItem("vero_technicians", JSON.stringify(techs));

    // Auto-create wallet for tech if not exist
    const wallets = JSON.parse(localStorage.getItem("vero_wallets") || "{}");
    if (!wallets[tech.id]) {
      wallets[tech.id] = {
        id: "wall-" + Math.random().toString(36).substring(2, 9),
        technician_id: tech.id,
        balance: 0,
        total_earnings: 0,
        pending_payouts: 0,
        currency: tech.currency || "INR"
      };
      localStorage.setItem("vero_wallets", JSON.stringify(wallets));
    }

    return tech;
  }

  // 5. UPDATE TECHNICIAN
  if (pathname === "/technicians/" && method === "PUT") {
    const user = getLoggedInUser();
    const body = JSON.parse((options.body as string) || "{}");
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const idx = techs.findIndex((t: any) => t.user_id === user.id);
    if (idx === -1) throw new Error("Technician profile not found");
    techs[idx] = { ...techs[idx], ...body, updated_at: new Date().toISOString() };
    localStorage.setItem("vero_technicians", JSON.stringify(techs));
    return techs[idx];
  }

  // 6. LIST TECHNICIANS
  if (pathname === "/technicians/" && method === "GET") {
    return JSON.parse(localStorage.getItem("vero_technicians") || "[]");
  }

  // 7. GET SPECIFIC TECHNICIAN
  if (pathname.startsWith("/technicians/") && method === "GET") {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1] || parts[parts.length - 2];
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const tech = techs.find((t: any) => t.id === id);
    if (!tech) throw new Error("Technician not found");
    return tech;
  }

  // 8. UPDATE AVAILABILITY
  if (pathname === "/availability/" && method === "PUT") {
    const user = getLoggedInUser();
    const body = JSON.parse((options.body as string) || "{}");
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const idx = techs.findIndex((t: any) => t.user_id === user.id);
    if (idx === -1) throw new Error("Technician profile not found");
    techs[idx] = { ...techs[idx], ...body, updated_at: new Date().toISOString() };
    localStorage.setItem("vero_technicians", JSON.stringify(techs));
    return techs[idx];
  }

  // 9. COMPANIES ME
  if (pathname === "/companies/me" && method === "GET") {
    const user = getLoggedInUser();
    const comps = JSON.parse(localStorage.getItem("vero_companies") || "[]");
    const comp = comps.find((c: any) => c.user_id === user.id);
    if (!comp) throw new Error("Company profile not found");
    return comp;
  }

  // 10. CREATE COMPANY
  if (pathname === "/companies/" && method === "POST") {
    const user = getLoggedInUser();
    const body = JSON.parse((options.body as string) || "{}");
    const comps = JSON.parse(localStorage.getItem("vero_companies") || "[]");

    let comp = comps.find((c: any) => c.user_id === user.id);
    if (comp) {
      comp = { ...comp, ...body, updated_at: new Date().toISOString() };
      const idx = comps.findIndex((c: any) => c.user_id === user.id);
      comps[idx] = comp;
    } else {
      comp = {
        id: "comp-" + Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        email: user.email,
        logo_url: body.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...body
      };
      comps.push(comp);
    }
    localStorage.setItem("vero_companies", JSON.stringify(comps));
    return comp;
  }

  // 11. UPDATE COMPANY
  if (pathname === "/companies/" && method === "PUT") {
    const user = getLoggedInUser();
    const body = JSON.parse((options.body as string) || "{}");
    const comps = JSON.parse(localStorage.getItem("vero_companies") || "[]");
    const idx = comps.findIndex((c: any) => c.user_id === user.id);
    if (idx === -1) throw new Error("Company profile not found");
    comps[idx] = { ...comps[idx], ...body, updated_at: new Date().toISOString() };
    localStorage.setItem("vero_companies", JSON.stringify(comps));
    return comps[idx];
  }

  // 12. CREATE JOB
  if (pathname === "/jobs/" && method === "POST") {
    const user = getLoggedInUser();
    const body = JSON.parse((options.body as string) || "{}");
    const comp = getOrAutoCreateCompany(user.id);

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const newJob = {
      id: "job-" + Math.random().toString(36).substring(2, 9),
      customer_id: comp.id,
      assigned_technician_id: null,
      status: "pending",
      ai_match_score: 92 + Math.floor(Math.random() * 8),
      negotiation_status: "idle",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body
    };
    jobs.push(newJob);
    localStorage.setItem("vero_jobs", JSON.stringify(jobs));
    return newJob;
  }

  // 13. MY JOBS (Company)
  if (pathname === "/jobs/me" && method === "GET") {
    const user = getLoggedInUser();
    const comp = getOrAutoCreateCompany(user.id);

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    return jobs.filter((j: any) => j.customer_id === comp.id);
  }

  // 14. MY WORKFORCE (Company)
  if (pathname === "/jobs/me/workforce" && method === "GET") {
    const user = getLoggedInUser();
    const comp = getOrAutoCreateCompany(user.id);

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const myJobIds = jobs.filter((j: any) => j.customer_id === comp.id).map((j: any) => j.id);

    const workforce = JSON.parse(localStorage.getItem("vero_workforce") || "[]");
    return workforce.filter((w: any) => myJobIds.includes(w.job_request_id));
  }

  // 15. OPPORTUNITIES (Technician)
  if (pathname === "/jobs/opportunities" && method === "GET") {
    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    return jobs.filter((j: any) => j.status === "pending" || j.status === "negotiating");
  }

  // 16. ASSIGNMENTS ME (Technician)
  if (pathname === "/jobs/assignments/me" && method === "GET") {
    const user = getLoggedInUser();
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const tech = techs.find((t: any) => t.user_id === user.id);
    if (!tech) return [];

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    return jobs.filter((j: any) => j.assigned_technician_id === tech.id);
  }

  // 17. LIST JOBS
  if (pathname === "/jobs/" && method === "GET") {
    return JSON.parse(localStorage.getItem("vero_jobs") || "[]");
  }

  // 18. GET SPECIFIC JOB
  if (pathname.startsWith("/jobs/") && !pathname.endsWith("/assign") && !pathname.endsWith("/status") && method === "GET") {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1] || parts[parts.length - 2];
    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const job = jobs.find((j: any) => j.id === id);
    if (!job) throw new Error("Job not found");
    return job;
  }

  // 19. ASSIGN JOB
  if (pathname.includes("/assign/") && method === "POST") {
    const parts = pathname.split("/assign/");
    const jobId = parts[0].split("/").pop();
    const technicianId = parts[1];

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const jobIdx = jobs.findIndex((j: any) => j.id === jobId);
    if (jobIdx === -1) throw new Error("Job not found");

    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const tech = techs.find((t: any) => t.id === technicianId);
    if (!tech) throw new Error("Technician not found");

    jobs[jobIdx].assigned_technician_id = technicianId;
    jobs[jobIdx].status = "matched";
    localStorage.setItem("vero_jobs", JSON.stringify(jobs));

    // Add workforce entry
    const workforce = JSON.parse(localStorage.getItem("vero_workforce") || "[]");
    const newMember = {
      id: "w-" + Math.random().toString(36).substring(2, 9),
      job_request_id: jobId,
      technician_id: technicianId,
      name: tech.full_name,
      role: tech.role,
      status: "Assigned",
      job_status: "matched",
      assignment: jobs[jobIdx].title,
      duration: jobs[jobIdx].duration || "3 Days",
      budget: jobs[jobIdx].price || jobs[jobIdx].budget
    };
    workforce.push(newMember);
    localStorage.setItem("vero_workforce", JSON.stringify(workforce));

    // Notifications
    const notifs = JSON.parse(localStorage.getItem("vero_notifications") || "[]");
    notifs.push({
      id: "notif-" + Math.random().toString(36).substring(2, 9),
      user_id: tech.user_id,
      title: "Assigned to Project",
      message: `You have been successfully assigned to "${jobs[jobIdx].title}".`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    localStorage.setItem("vero_notifications", JSON.stringify(notifs));

    return { message: "Assigned successfully" };
  }

  // 20. UPDATE JOB STATUS
  if (pathname.includes("/status") && method === "PUT") {
    const parts = pathname.split("/");
    const id = parts[parts.length - 2];
    const statusParam = url.searchParams.get("status") || "in_progress";

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const idx = jobs.findIndex((j: any) => j.id === id);
    if (idx === -1) throw new Error("Job not found");

    jobs[idx].status = statusParam;
    localStorage.setItem("vero_jobs", JSON.stringify(jobs));

    // Update workforce job status
    const workforce = JSON.parse(localStorage.getItem("vero_workforce") || "[]");
    const wIdx = workforce.findIndex((w: any) => w.job_request_id === id);
    if (wIdx !== -1) {
      workforce[wIdx].job_status = statusParam;
      workforce[wIdx].status = statusParam === "completed" ? "Completed" : "On-Site";
      localStorage.setItem("vero_workforce", JSON.stringify(workforce));
    }

    return jobs[idx];
  }

  // 21. VECTOR MATCH TECHNICIANS
  if (pathname === "/ai/vector/match-technicians" && method === "POST") {
    const { job_id } = JSON.parse((options.body as string) || "{}");
    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const job = jobs.find((j: any) => j.id === job_id);
    if (!job) throw new Error("Job not found");

    const role = job.required_role || "Technician";
    const cleanRole = role.split(",")[0].trim();
    const location = job.location || "Bangalore, India";

    // Dynamic generation of customized perfect match dummy techs if they do not exist
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const existingDummy = techs.find((t: any) => t.id.startsWith("tech-dummy-") && t.role.toLowerCase().includes(cleanRole.toLowerCase()));
    
    if (!existingDummy) {
      // Dynamic lists of Indian male first and last names for infinite uniqueness!
      const firstNames = [
        "Aarav", "Kabir", "Vihaan", "Aditya", "Arjun", "Dev", "Krishna", "Rohan", "Siddharth",
        "Amit", "Rahul", "Devendra", "Karan", "Nikhil", "Pranav", "Ishaan", "Rudra", "Varun", "Abhishek",
        "Yash", "Vivaan", "Rishi", "Kartik", "Ayush", "Harsh", "Gaurav", "Sanjay", "Anil", "Rajesh",
        "Vijay", "Vikram", "Deepak", "Sunil", "Manish", "Alok", "Sameer", "Tarun", "Vivek", "Ajay",
        "Pritam", "Prateek", "Pankaj", "Mayank", "Madhav", "Bhuvan", "Chirag", "Jatin", "Navin", "Mohit"
      ];
      const lastNames = [
        "Sharma", "Mehta", "Sen", "Nair", "Kapoor", "Patel", "Verma", "Joshi", "Singh", "Rao",
        "Malhotra", "Reddy", "Iyer", "Choudhury", "Bose", "Das", "Roy", "Gupta", "Mishra", "Pandey",
        "Trivedi", "Deshmukh", "Pillai", "Menon", "Prasad", "Sinha", "Kumar", "Bahl", "Grover", "Saxena"
      ];

      // Dynamic generator to build 4 unique Indian male names for each job match
      const generatedNames: string[] = [];
      while (generatedNames.length < 4) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${first} ${last}`;
        if (!generatedNames.includes(fullName)) {
          generatedNames.push(fullName);
        }
      }

      const names = generatedNames;
      const profiles = [
        "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      ];
      
      const skillsMap: { [key: string]: string[] } = {
        hvac: ["HVAC Diagnostics", "Ventilation Control", "Thermostat Calibration", "Compressor Rebuild", "Refrigerant Refill"],
        ac: ["AC Maintenance", "Cooling Coil Repair", "Compressor Diagnostics", "Leakage Fixing", "Airflow Calibration"],
        tv: ["TV Diagnostics", "SMPS Replacement", "LED Panel Repair", "Backlight Calibration", "Mainboard Repair"],
        solar: ["Solar Grid Installation", "DC Cabling", "Grid Syncer Inverter Integration", "Photovoltaic Maintenance"],
        electrician: ["Industrial Wiring", "PLC Automation", "Breaker Replacement", "Three-Phase Distribution", "Short Circuit Repair"],
      };

      let cat = "electrician";
      const lower = cleanRole.toLowerCase();
      if (lower.includes("hvac") || lower.includes("chiller") || lower.includes("heating")) cat = "hvac";
      else if (lower.includes("ac") || lower.includes("air conditioner") || lower.includes("cooling")) cat = "ac";
      else if (lower.includes("tv") || lower.includes("television") || lower.includes("display")) cat = "tv";
      else if (lower.includes("solar") || lower.includes("photovoltaic") || lower.includes("energy")) cat = "solar";

      const catSkills = skillsMap[cat];
      const budgetRate = job.budget || 2500;

      const dummyTechs = [
        {
          id: "tech-dummy-1-" + Math.random().toString(36).substring(2, 5),
          user_id: "usr-dummy-1-" + Math.random().toString(36).substring(2, 5),
          full_name: `${names[0]} (Expert)`,
          role: `${cleanRole} Specialist`,
          skills: [cleanRole, ...catSkills].slice(0, 5),
          experience_years: 9,
          location: location,
          daily_rate: Math.round(budgetRate * 1.05),
          base_hourly_rate: Math.round((budgetRate * 1.05) / 8),
          average_rating: 4.9,
          success_score: 98,
          bio: `Elite technician specializing in high-fidelity ${cleanRole} operations, smart system diagnostics, and precision deployment.`,
          profile_picture_url: profiles[0],
          is_online: true,
          current_status: "Available for dispatch",
          phone: "+91 99999 11111",
          email: "expert@vero.com",
          currency: "INR",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "tech-dummy-2-" + Math.random().toString(36).substring(2, 5),
          user_id: "usr-dummy-2-" + Math.random().toString(36).substring(2, 5),
          full_name: `${names[1]} (Pro)`,
          role: `${cleanRole} Technician`,
          skills: [cleanRole, ...catSkills].slice(1, 5),
          experience_years: 6,
          location: location,
          daily_rate: Math.round(budgetRate * 0.95),
          base_hourly_rate: Math.round((budgetRate * 0.95) / 8),
          average_rating: 4.8,
          success_score: 95,
          bio: `Highly skilled ${cleanRole} professional, experienced in industrial systems, maintenance schedules, and rapid diagnostics.`,
          profile_picture_url: profiles[1],
          is_online: true,
          current_status: "Available",
          phone: "+91 99999 22222",
          email: "pro@vero.com",
          currency: "INR",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "tech-dummy-3-" + Math.random().toString(36).substring(2, 5),
          user_id: "usr-dummy-3-" + Math.random().toString(36).substring(2, 5),
          full_name: `${names[2]} (Associate)`,
          role: `Junior ${cleanRole} Specialist`,
          skills: [cleanRole, catSkills[0], catSkills[2]],
          experience_years: 4,
          location: location,
          daily_rate: Math.round(budgetRate * 0.8),
          base_hourly_rate: Math.round((budgetRate * 0.8) / 8),
          average_rating: 4.6,
          success_score: 92,
          bio: `Dedicated technical specialist focused on cost-effective ${cleanRole} maintenance, system checks, and assembly.`,
          profile_picture_url: profiles[2],
          is_online: true,
          current_status: "Available",
          phone: "+91 99999 33333",
          email: "associate@vero.com",
          currency: "INR",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      techs.push(...dummyTechs);
      localStorage.setItem("vero_technicians", JSON.stringify(techs));
    }

    const reloadedTechs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");

    const matches = reloadedTechs.map((tech: any) => {
      const reqSkills = job.required_skills || [];
      const matched_skills = tech.skills.filter((s: string) =>
        reqSkills.some((r: string) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
      );
      const missing_skills = reqSkills.filter((r: string) =>
        !tech.skills.some((s: string) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
      );

      // Boost faked dummy matching score to be 98%, 92%, and 85% respectively so they match the job perfectly!
      let final_score = 0.5;
      if (tech.id.startsWith("tech-dummy-") && !tech.role.toLowerCase().includes(cleanRole.toLowerCase())) {
        final_score = 0.1; // Filter out dummy techs that belong to other jobs
      } else if (tech.id.startsWith("tech-dummy-1-")) {
        final_score = 0.98;
      } else if (tech.id.startsWith("tech-dummy-2-")) {
        final_score = 0.92;
      } else if (tech.id.startsWith("tech-dummy-3-")) {
        final_score = 0.85;
      } else {
        const similarity_score = reqSkills.length ? Math.round((matched_skills.length / reqSkills.length) * 100) : 60;
        const experience_score = Math.min((tech.experience_years / 12) * 100, 100);
        const rating_score = (tech.average_rating / 5) * 100;
        const price_score = tech.daily_rate && job.budget ? Math.max(0, (1 - Math.abs(tech.daily_rate - job.budget) / job.budget) * 100) : 50;
        const completion_rate = tech.success_score ?? 90;
        final_score = Math.round((similarity_score * 0.4) + (experience_score * 0.2) + (rating_score * 0.2) + (price_score * 0.1) + (completion_rate * 0.1)) / 100;
      }

      return {
        technician_id: tech.id,
        similarity_score: final_score,
        final_score: final_score,
        matched_skills,
        missing_skills,
        experience_years: tech.experience_years,
        average_rating: tech.average_rating,
        completion_rate: (tech.success_score ?? 96) / 100,
        is_online: tech.is_online,
        current_status: tech.current_status,
        total_jobs_completed: tech.total_jobs_completed,
        base_hourly_rate: tech.base_hourly_rate
      };
    });

    const filteredMatches = matches.filter((m: any) => m.final_score > 0.6);
    filteredMatches.sort((a: any, b: any) => b.final_score - a.final_score);

    return {
      job_id,
      total_candidates: filteredMatches.length,
      cached: false,
      latency_ms: 120,
      matches: filteredMatches
    };
  }

  // 21b. SECONDARY AI MATCH (FALLBACK)
  if (pathname === "/ai/match" && method === "POST") {
    const { job_id } = JSON.parse((options.body as string) || "{}");
    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const job = jobs.find((j: any) => j.id === job_id);
    if (!job) throw new Error("Job not found");

    const role = job.required_role || "Technician";
    const cleanRole = role.split(",")[0].trim();
    
    const reloadedTechs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const matches = reloadedTechs.filter((tech: any) => tech.id.startsWith("tech-dummy-") && tech.role.toLowerCase().includes(cleanRole.toLowerCase()));

    const list = matches.map((m: any, idx: number) => ({
      technician_id: m.id,
      match_score: idx === 0 ? 0.98 : idx === 1 ? 0.92 : 0.85,
      experience_years: m.experience_years,
      is_online: m.is_online
    }));

    return {
      job_id,
      total_candidates: list.length,
      matches: list
    };
  }

  // 22. NEGOTIATIONS CREATE
  if (pathname === "/negotiations/" && method === "POST") {
    const body = JSON.parse((options.body as string) || "{}");
    const negs = JSON.parse(localStorage.getItem("vero_negotiations") || "[]");

    const newNeg = {
      id: "neg-" + Math.random().toString(36).substring(2, 9),
      counter_offer: null,
      final_price: null,
      ai_recommended_price: Math.round(body.initial_price * 0.94),
      negotiation_status: "pending",
      accepted_by: null,
      ...body
    };

    negs.push(newNeg);
    localStorage.setItem("vero_negotiations", JSON.stringify(negs));

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const idx = jobs.findIndex((j: any) => j.id === body.job_request_id);
    if (idx !== -1) {
      jobs[idx].negotiation_status = "pending";
      jobs[idx].status = "negotiating";
      localStorage.setItem("vero_jobs", JSON.stringify(jobs));
    }

    return newNeg;
  }

  // 23. NEGOTIATIONS ME
  if (pathname === "/negotiations/me" && method === "GET") {
    const user = getLoggedInUser();
    const negs = JSON.parse(localStorage.getItem("vero_negotiations") || "[]");
    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");

    const myNegs = negs.filter((n: any) => {
      if (user.role === "technician") {
        const tech = techs.find((t: any) => t.user_id === user.id);
        return tech && n.technician_id === tech.id;
      }
      return n.customer_id === user.id;
    });

    return myNegs.map((n: any) => {
      const job = jobs.find((j: any) => j.id === n.job_request_id) || { title: "Custom Request", required_role: "General Contractor" };
      const tech = techs.find((t: any) => t.id === n.technician_id) || { full_name: "Contractor", role: "Specialist", daily_rate: 2000 };

      return {
        id: n.id,
        display_code: "NEG-" + n.id.slice(4, 8).toUpperCase(),
        job_request_id: n.job_request_id,
        request_title: job.title,
        worker_name: tech.full_name,
        role: tech.role || job.required_role,
        original_rate: "₹" + n.initial_price + "/day",
        counter_rate: "₹" + (n.counter_offer ?? n.offered_price) + "/day",
        status: n.negotiation_status,
        ai_recommendation: `AI suggests ₹${n.ai_recommended_price}/day (94% acceptance odds)`,
        technician_id: tech.id
      };
    });
  }

  // 24. UPDATE NEGOTIATION
  if (pathname.startsWith("/negotiations/") && method === "PUT") {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1];
    const body = JSON.parse((options.body as string) || "{}");

    const negs = JSON.parse(localStorage.getItem("vero_negotiations") || "[]");
    const idx = negs.findIndex((n: any) => n.id === id);
    if (idx === -1) throw new Error("Negotiation not found");

    negs[idx] = { ...negs[idx], ...body };
    localStorage.setItem("vero_negotiations", JSON.stringify(negs));

    if (body.negotiation_status === "accepted") {
      const negotiation = negs[idx];
      const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
      const jIdx = jobs.findIndex((j: any) => j.id === negotiation.job_request_id);

      if (jIdx !== -1) {
        jobs[jIdx].assigned_technician_id = negotiation.technician_id;
        jobs[jIdx].status = "matched";
        jobs[jIdx].negotiation_status = "accepted";
        jobs[jIdx].price = negotiation.final_price ?? negotiation.counter_offer ?? negotiation.offered_price;
        localStorage.setItem("vero_jobs", JSON.stringify(jobs));

        const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
        const tech = techs.find((t: any) => t.id === negotiation.technician_id);
        const workforce = JSON.parse(localStorage.getItem("vero_workforce") || "[]");

        if (tech) {
          workforce.push({
            id: "w-" + Math.random().toString(36).substring(2, 9),
            job_request_id: negotiation.job_request_id,
            technician_id: negotiation.technician_id,
            name: tech.full_name,
            role: tech.role,
            status: "Assigned",
            job_status: "matched",
            assignment: jobs[jIdx].title,
            duration: jobs[jIdx].duration || "3 Days",
            budget: jobs[jIdx].price
          });
          localStorage.setItem("vero_workforce", JSON.stringify(workforce));
        }
      }
    }

    return negs[idx];
  }

  // 25. NOTIFICATIONS
  if (pathname === "/notifications/" && method === "GET") {
    const user = getLoggedInUser();
    const notifs = JSON.parse(localStorage.getItem("vero_notifications") || "[]");
    return notifs.filter((n: any) => n.user_id === user.id);
  }

  // 26. NOTIFICATION MARK READ
  if (pathname.includes("/read") && method === "POST") {
    const parts = pathname.split("/");
    const id = parts[parts.length - 2];
    const notifs = JSON.parse(localStorage.getItem("vero_notifications") || "[]");
    const idx = notifs.findIndex((n: any) => n.id === id);
    if (idx !== -1) {
      notifs[idx].is_read = true;
      localStorage.setItem("vero_notifications", JSON.stringify(notifs));
      return notifs[idx];
    }
    throw new Error("Notification not found");
  }

  // 27. PAYMENTS
  if (pathname === "/payments/" && method === "POST") {
    const body = JSON.parse((options.body as string) || "{}");
    const pays = JSON.parse(localStorage.getItem("vero_payments") || "[]");
    const newPay = {
      id: "pay-" + Math.random().toString(36).substring(2, 9),
      status: "completed",
      created_at: new Date().toISOString(),
      ...body
    };
    pays.push(newPay);
    localStorage.setItem("vero_payments", JSON.stringify(pays));

    const wallets = JSON.parse(localStorage.getItem("vero_wallets") || "{}");
    if (wallets[body.technician_id]) {
      wallets[body.technician_id].balance += body.amount;
      wallets[body.technician_id].total_earnings += body.amount;
    } else {
      wallets[body.technician_id] = {
        id: "wall-" + Math.random().toString(36).substring(2, 9),
        technician_id: body.technician_id,
        balance: body.amount,
        total_earnings: body.amount,
        pending_payouts: 0,
        currency: "INR"
      };
    }
    localStorage.setItem("vero_wallets", JSON.stringify(wallets));
    return newPay;
  }

  // 28. PAYMENTS WALLET
  if (pathname.includes("/payments/wallet/") && method === "GET") {
    const parts = pathname.split("/");
    const techId = parts[parts.length - 1];
    const wallets = JSON.parse(localStorage.getItem("vero_wallets") || "{}");
    if (wallets[techId]) return wallets[techId];
    return {
      id: "wall-" + Math.random().toString(36).substring(2, 9),
      technician_id: techId,
      balance: 0,
      total_earnings: 0,
      pending_payouts: 0,
      currency: "INR"
    };
  }

  // 29. REVIEWS SUBMIT
  if (pathname === "/reviews/" && method === "POST") {
    const body = JSON.parse((options.body as string) || "{}");
    const revs = JSON.parse(localStorage.getItem("vero_reviews") || "[]");
    const newRev = {
      id: "rev-" + Math.random().toString(36).substring(2, 9),
      customer_id: getLoggedInUser().id,
      sentiment_score: 0.9,
      is_flagged: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body
    };
    revs.push(newRev);
    localStorage.setItem("vero_reviews", JSON.stringify(revs));
    return newRev;
  }

  // 30. ADMIN DASHBOARD
  if (pathname === "/admin/dashboard" && method === "GET") {
    const users = JSON.parse(localStorage.getItem("vero_users") || "[]");
    const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");

    return {
      total_users: users.length,
      total_technicians: techs.length,
      active_technicians: techs.filter((t: any) => t.is_online).length,
      total_jobs: jobs.length,
      open_jobs: jobs.filter((j: any) => j.status === "pending").length,
      open_fraud_flags: 0
    };
  }

  // 31. ADMIN USERS
  if (pathname === "/admin/users" && method === "GET") {
    return JSON.parse(localStorage.getItem("vero_users") || "[]");
  }

  // 32. AUTO ASSIGN TRIGGER
  if (pathname.includes("/auto-assign/") && !pathname.endsWith("/status") && method === "POST") {
    const parts = pathname.split("/");
    const jobId = parts[parts.length - 1] || parts[parts.length - 2];

    const body = JSON.parse((options.body as string) || "{}");
    const techs = body.technicians || [];

    const calls = techs.map((t: any, index: number) => ({
      rank: index + 1,
      technician_id: t.technician_id,
      vapi_call_id: index === 0 ? `call-${Math.random().toString(36).substring(2, 9)}` : null,
      status: index === 0 ? "calling" : "pending",
      agreed_price: null,
      call_summary: null,
      created_at: new Date().toISOString()
    }));

    // Pre-roll a randomized outcome for the calling campaign to simulate theatre!
    const r = Math.random();
    let acceptingRank = null;
    if (r < 0.35) {
      acceptingRank = 1; // Rank 1 accepts
    } else if (r < 0.70) {
      acceptingRank = 2; // Rank 2 accepts
    } else if (r < 0.90) {
      acceptingRank = 3; // Rank 3 accepts
    } // Else r >= 0.90: campaign exhausts with no acceptance

    // Roll random failure modes for ranks before they fail
    const failureTypes = techs.map(() => Math.random() > 0.5 ? "no_answer" : "rejected");
    
    // Negotiated daily rates (usually discounted 5-15% of the base hourly rate daily equivalent or direct base daily rate)
    const negotiatedPrices = techs.map((t: any) => {
      const rate = t.base_hourly_rate || 2500;
      const discount = 0.85 + Math.random() * 0.1; // 5% to 15% discount
      return Math.round((rate * discount) / 100) * 100; // round to nearest 100
    });

    const campaigns = JSON.parse(localStorage.getItem("vero_auto_assign") || "{}");
    campaigns[jobId] = {
      job_id: jobId,
      status: "calling",
      start_time: Date.now(),
      calls,
      accepting_rank: acceptingRank,
      failure_types: failureTypes,
      negotiated_prices: negotiatedPrices,
      assigned_technician_id: null
    };
    localStorage.setItem("vero_auto_assign", JSON.stringify(campaigns));

    const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
    const jIdx = jobs.findIndex((j: any) => j.id === jobId);
    if (jIdx !== -1) {
      jobs[jIdx].status = "negotiating";
      localStorage.setItem("vero_jobs", JSON.stringify(jobs));
    }

    return {
      message: "auto-assign campaign started",
      job_id: jobId,
      first_call_rank: 1,
      vapi_call_id: calls[0]?.vapi_call_id || "call-1"
    };
  }

  // 33. AUTO ASSIGN STATUS (POLLING STATE MACHINE!)
  if (pathname.includes("/auto-assign/") && pathname.endsWith("/status") && method === "GET") {
    const parts = pathname.split("/");
    const jobId = parts[parts.length - 2];

    const campaigns = JSON.parse(localStorage.getItem("vero_auto_assign") || "{}");
    const campaign = campaigns[jobId];
    if (!campaign) {
      return { job_id: jobId, status: "idle", calls: [], assigned_technician_id: null };
    }

    if (campaign.status === "calling") {
      const elapsedSec = (Date.now() - campaign.start_time) / 1000;
      
      // Dynamic theatrical pacing: let's allocate 150 seconds (2.5 minutes) per technician's negotiation call
      const stepDuration = 150; 
      const totalCandidates = campaign.calls.length;

      for (let i = 0; i < totalCandidates; i++) {
        const call = campaign.calls[i];
        const callStart = i * stepDuration;
        const callEnd = (i + 1) * stepDuration;

        if (elapsedSec < callStart) {
          // Future candidates remain pending
          call.status = "pending";
          call.agreed_price = null;
          call.call_summary = null;
        } else if (elapsedSec >= callStart && elapsedSec < callEnd) {
          // Active call stage!
          const activeElapsed = elapsedSec - callStart;
          if (activeElapsed < 45) {
            // First 45 seconds: Ringing...
            call.status = "calling";
          } else {
            // Remaining 105 seconds: In Call (Negotiating)
            call.status = "in_progress";
          }
          call.vapi_call_id = call.vapi_call_id || `call-${Math.random().toString(36).substring(2, 9)}`;
          call.agreed_price = null;
          call.call_summary = null;
        } else {
          // Completed call stage!
          const isAcceptingRank = (i + 1) === campaign.accepting_rank;
          if (isAcceptingRank) {
            call.status = "accepted";
            call.agreed_price = campaign.negotiated_prices[i] || 2400;
            
            const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
            const tech = techs.find((t: any) => t.id === call.technician_id);
            const name = tech ? tech.full_name : "Technician";
            
            call.call_summary = `${name} agreed to a discounted rate of Rs ${call.agreed_price}/day. Automated WhatsApp contract sent and verified.`;
            campaign.status = "completed";
            campaign.assigned_technician_id = call.technician_id;

            // Assign in database
            const jobs = JSON.parse(localStorage.getItem("vero_jobs") || "[]");
            const jIdx = jobs.findIndex((j: any) => j.id === jobId);
            if (jIdx !== -1) {
              jobs[jIdx].assigned_technician_id = call.technician_id;
              jobs[jIdx].status = "matched";
              jobs[jIdx].price = call.agreed_price;
              localStorage.setItem("vero_jobs", JSON.stringify(jobs));

              const workforce = JSON.parse(localStorage.getItem("vero_workforce") || "[]");
              const wIdx = workforce.findIndex((w: any) => w.job_request_id === jobId);
              if (wIdx === -1 && tech) {
                workforce.push({
                  id: "w-" + Math.random().toString(36).substring(2, 9),
                  job_request_id: jobId,
                  technician_id: call.technician_id,
                  name: tech.full_name,
                  role: tech.role,
                  status: "Assigned",
                  job_status: "matched",
                  assignment: jobs[jIdx].title,
                  duration: jobs[jIdx].duration || "2 Days",
                  budget: call.agreed_price
                });
                localStorage.setItem("vero_workforce", JSON.stringify(workforce));
              }
            }
            break;
          } else {
            // Unsuccessful call outcomes
            call.status = campaign.failure_types[i] || "no_answer";
            const techs = JSON.parse(localStorage.getItem("vero_technicians") || "[]");
            const tech = techs.find((t: any) => t.id === call.technician_id);
            const name = tech ? tech.full_name : "Technician";

            if (call.status === "rejected") {
              call.call_summary = `${name} declined the offer due to scheduling conflicts.`;
            } else {
              call.call_summary = `Call to ${name} unanswered after 45 seconds of ringing.`;
            }
          }
        }
      }

      // If we ran through all candidates without anyone accepting
      if (campaign.status === "calling" && elapsedSec >= totalCandidates * stepDuration) {
        campaign.status = "exhausted";
      }

      campaigns[jobId] = campaign;
      localStorage.setItem("vero_auto_assign", JSON.stringify(campaigns));
    }

    return {
      job_id: campaign.job_id,
      status: campaign.status,
      calls: campaign.calls,
      assigned_technician_id: campaign.assigned_technician_id
    };
  }

  return {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (typeof window === "undefined") return {} as T;
  initializeMockDB();
  const res = await handleMockRequest(path, options);
  return res as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  is_active: boolean;
  is_verified: boolean;
  onboarding_completed: boolean;
  profile_status: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}

export const authApi = {
  /** Register — role defaults to "customer" */
  register: async (data: UserCreate): Promise<UserResponse> => {
    initializeMockDB();
    const users = JSON.parse(localStorage.getItem("vero_users") || "[]");
    if (users.some((u: any) => u.email === data.email)) {
      throw new Error("Email already registered");
    }
    const id = "usr-" + Math.random().toString(36).substring(2, 9);
    const newUser = {
      id,
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      role: data.role || "customer",
      is_active: true,
      is_verified: true,
      onboarding_completed: false,
      profile_status: "active"
    };
    users.push(newUser);
    localStorage.setItem("vero_users", JSON.stringify(users));
    return {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      is_active: newUser.is_active,
      is_verified: newUser.is_verified,
      onboarding_completed: newUser.onboarding_completed,
      profile_status: newUser.profile_status
    };
  },

  /**
   * Login — FastAPI uses OAuth2 form encoding for /auth/login.
   * We send as application/x-www-form-urlencoded.
   */
  login: async (email: string, password: string): Promise<TokenResponse> => {
    initializeMockDB();
    const users = JSON.parse(localStorage.getItem("vero_users") || "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const token = "mock-token-" + user.id;
    persistTokens(token, "mock-refresh-token");
    localStorage.setItem("vero_logged_in_user_id", user.id);
    return {
      access_token: token,
      refresh_token: "mock-refresh-token",
      token_type: "Bearer"
    };
  },

  googleLogin: async (credential: string): Promise<TokenResponse> => {
    initializeMockDB();
    const token = "mock-token-usr-company";
    persistTokens(token, "mock-refresh-token");
    localStorage.setItem("vero_logged_in_user_id", "usr-company");
    return {
      access_token: token,
      refresh_token: "mock-refresh-token",
      token_type: "Bearer"
    };
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vero_logged_in_user_id");
    }
    clearTokens();
  },

  /** Get the currently authenticated user */
  me: () => request<UserResponse>("/auth/me"),

  completeOnboarding: (role: "technician" | "customer") =>
    request<UserResponse>("/auth/complete-onboarding", {
      method: "POST",
      body: JSON.stringify({ role }),
    }),
};

// ── Technician ────────────────────────────────────────────────────────────────

export interface VerificationLink {
  platform: string;
  url: string;
}

export interface TechnicianOnboardingPayload {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  address?: string;
  profile_picture_url?: string;
  role?: string;
  industry?: string;
  skills?: string[];
  experience_years?: number;
  preferred_work_types?: string[];
  languages?: string[];
  available_days?: string[];
  hours_start?: string;
  hours_end?: string;
  remote_pref?: string;
  currency?: string;
  daily_rate?: number;
  base_hourly_rate?: number;
  price?: number;
  preferred_locations?: string;
  emergency_availability?: string;
  education?: string;
  previous_employers?: string;
  work_history?: string;
  bio?: string;
  resume_url?: string;
  linkedin_url?: string;
  certificates_url?: string;
  licenses_url?: string;
  government_id_url?: string;
  verification_links?: VerificationLink[];
  custom_status_message?: string;
}

export type TechnicianCreate = TechnicianOnboardingPayload & {
  skills: string[];
  experience_years: number;
};

export type TechnicianUpdate = TechnicianOnboardingPayload & {
  is_online?: boolean;
  current_status?: string;
};

export interface TechnicianResponse {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  address: string | null;
  profile_picture_url: string | null;
  role: string | null;
  industry: string | null;
  skills: string[];
  experience_years: number;
  preferred_work_types: string[];
  languages: string[];
  available_days: string[];
  hours_start: string | null;
  hours_end: string | null;
  remote_pref: string | null;
  currency: string | null;
  daily_rate: number | null;
  preferred_locations: string | null;
  emergency_availability: string | null;
  education: string | null;
  previous_employers: string | null;
  work_history: string | null;
  bio: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  certificates_url: string | null;
  licenses_url: string | null;
  government_id_url: string | null;
  verification_links: VerificationLink[];
  custom_status_message: string | null;
  is_online: boolean;
  current_status: string;
  base_hourly_rate: number | null;
  price: number | null;
  latitude: number | null;
  longitude: number | null;
  average_rating: number;
  success_score: number;
  fraud_risk_score: number;
  total_jobs_completed: number;
  verification_level: string;
  created_at: string;
  updated_at: string;
}

export const technicianApi = {
  create: (data: TechnicianCreate) =>
    request<TechnicianResponse>("/technicians/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<TechnicianResponse>("/technicians/me"),

  list: (skip = 0, limit = 100) =>
    request<TechnicianResponse[]>(`/technicians/?skip=${skip}&limit=${limit}`),

  get: (id: string) => request<TechnicianResponse>(`/technicians/${id}`),

  update: (data: TechnicianUpdate) =>
    request<TechnicianResponse>("/technicians/", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: () =>
    request<{ message: string }>("/technicians/", { method: "DELETE" }),

  updateAvailability: (data: {
    is_online: boolean;
    latitude?: number;
    longitude?: number;
    current_status?: string;
    custom_status_message?: string;
  }) =>
    request<TechnicianResponse>("/availability/", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ── Company ───────────────────────────────────────────────────────────────────

export interface CompanyResponse {
  id: string;
  user_id: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  hq_location: string | null;
  logo_url: string | null;
  industry: string | null;
  other_industry: string | null;
  company_size: string | null;
  business_categories: string[];
  website_url: string | null;
  operating_regions: string[];
  about: string | null;
  preferred_workforce_types: string[];
  hiring_frequency: string | null;
  remote_pref: string | null;
  urgency_handling: string | null;
  verification_requirements: string[];
  currency: string | null;
  project_budget: number | null;
  current_team_size: number | null;
  active_projects_count: number | null;
  workforce_goals: string[];
  assignment_workflow: string | null;
  communication_preferences: string[];
  notification_settings: string | null;
  registration_doc_url: string | null;
  tax_docs_url: string | null;
  identity_verification_url: string | null;
  portfolio_url: string | null;
  authorized_rep_name: string | null;
  verification_links: VerificationLink[];
  hiring_preferences: string | null;
  created_at: string;
  updated_at: string;
}

export type CompanyCreate = Partial<CompanyResponse> & {
  company_name: string;
  email: string;
};

export type CompanyUpdate = Partial<CompanyResponse>;

export const companyApi = {
  create: (data: CompanyCreate) =>
    request<CompanyResponse>("/companies/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<CompanyResponse>("/companies/me"),

  update: (data: CompanyUpdate) =>
    request<CompanyResponse>("/companies/", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ── Jobs ──────────────────────────────────────────────────────────────────────

export type JobStatus =
  | "pending"
  | "matched"
  | "negotiating"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface JobCreate {
  required_role?: string;
  title?: string;
  description?: string;
  required_skills?: string[];
  budget?: number;
  price?: number;
  location?: string;
  urgency_level?: string;
  duration?: string;
  certifications_required?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  scheduled_at?: string;
}

export interface JobResponse {
  id: string;
  customer_id: string | null;
  assigned_technician_id?: string | null;
  required_role: string | null;
  title: string;
  description: string | null;
  required_skills: string[];
  budget: number | null;
  price: number | null;
  location: string | null;
  urgency_level: string;
  duration: string | null;
  certifications_required: string | null;
  status: JobStatus;
  ai_match_score: number | null;
  negotiation_status: string;
  created_at: string;
  updated_at: string;
}

export interface WorkforceMemberResponse {
  id: string;
  job_request_id: string;
  technician_id: string;
  name: string;
  role: string;
  status: string;
  job_status: string;
  assignment: string;
  duration: string | null;
  budget: number | null;
}

export const jobApi = {
  create: (data: JobCreate) =>
    request<JobResponse>("/jobs/", { method: "POST", body: JSON.stringify(data) }),

  myJobs: () => request<JobResponse[]>("/jobs/me"),

  myWorkforce: () => request<WorkforceMemberResponse[]>("/jobs/me/workforce"),

  opportunities: () => request<JobResponse[]>("/jobs/opportunities"),

  myAssignments: () => request<JobResponse[]>("/jobs/assignments/me"),

  list: (skip = 0, limit = 100) =>
    request<JobResponse[]>(`/jobs/?skip=${skip}&limit=${limit}`),

  get: (id: string) => request<JobResponse>(`/jobs/${id}`),

  assign: (jobId: string, technicianId: string) =>
    request<unknown>(`/jobs/${jobId}/assign/${technicianId}`, { method: "POST" }),

  updateStatus: (id: string, status: JobStatus) =>
    request<JobResponse>(`/jobs/${id}/status?status=${status}`, { method: "PUT" }),
};

// ── Negotiations ──────────────────────────────────────────────────────────────

export interface NegotiationCreate {
  job_request_id: string;
  customer_id: string;
  technician_id: string;
  initial_price: number;
  offered_price: number;
  ai_recommended_price?: number;
}

export interface NegotiationUpdate {
  counter_offer?: number;
  negotiation_status?: string;
  final_price?: number;
  accepted_by?: string;
}

export interface NegotiationResponse {
  id: string;
  job_request_id: string;
  customer_id: string;
  technician_id: string;
  initial_price: number | null;
  offered_price: number | null;
  counter_offer: number | null;
  final_price: number | null;
  ai_recommended_price: number | null;
  negotiation_status: string;
  accepted_by: string | null;
}

export interface NegotiationDashboardItem {
  id: string;
  display_code: string;
  job_request_id: string;
  request_title: string;
  worker_name: string;
  role: string;
  original_rate: string;
  counter_rate: string;
  status: string;
  ai_recommendation: string;
  technician_id: string;
}

export const negotiationApi = {
  start: (data: NegotiationCreate) =>
    request<NegotiationResponse>("/negotiations/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<NegotiationDashboardItem[]>("/negotiations/me"),

  update: (id: string, data: NegotiationUpdate) =>
    request<NegotiationResponse>(`/negotiations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  forJob: (jobId: string) =>
    request<NegotiationResponse[]>(`/negotiations/job/${jobId}`),
};

// ── AI ────────────────────────────────────────────────────────────────────────

export interface TechnicianMatchResult {
  technician_id: string;
  match_score: number;
  skills: string[];
  experience_years: number;
  average_rating: number;
  is_online: boolean;
}

export interface SkillMatchResponse {
  job_id: string;
  matches: TechnicianMatchResult[];
}

export interface VectorMatchResult {
  technician_id: string;
  similarity_score: number;
  final_score: number;
  matched_skills: string[];
  missing_skills: string[];
  experience_years: number;
  average_rating: number;
  completion_rate: number;
  is_online: boolean;
  current_status: string;
  total_jobs_completed: number;
  base_hourly_rate: number | null;
}

export interface VectorMatchResponse {
  job_id: string;
  total_candidates: number;
  cached: boolean;
  latency_ms: number;
  matches: VectorMatchResult[];
}

export const aiApi = {
  match: (jobId: string, topK = 10) =>
    request<SkillMatchResponse>("/ai/match", {
      method: "POST",
      body: JSON.stringify({ job_id: jobId, top_k: topK }),
    }),

  vectorMatch: (jobId: string, topK = 20) =>
    request<VectorMatchResponse>("/ai/vector/match-technicians", {
      method: "POST",
      body: JSON.stringify({ job_id: jobId, top_k: topK }),
    }),
};

// ── Portfolio ─────────────────────────────────────────────────────────────────

export interface PortfolioCreate {
  operation_title: string;
  scope_of_work?: string;
  technical_role?: string;
  commercial_client?: string;
  completion_year?: string;
  skills_certifications_applied?: string[];
  proof_image_url?: string;
  registry_verification_url?: string;
  is_featured?: boolean;
}

export interface PortfolioResponse {
  id: string;
  technician_id: string;
  operation_title: string;
  scope_of_work: string | null;
  technical_role: string | null;
  commercial_client: string | null;
  completion_year: string | null;
  skills_certifications_applied: string[];
  proof_image_url: string | null;
  registry_verification_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const portfolioApi = {
  list: () => request<PortfolioResponse[]>("/technicians/portfolio/"),

  create: (data: PortfolioCreate) =>
    request<PortfolioResponse>("/technicians/portfolio/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/technicians/portfolio/${id}`, { method: "DELETE" }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminDashboardSummary {
  total_users: number;
  total_technicians: number;
  active_technicians: number;
  total_jobs: number;
  open_jobs: number;
  open_fraud_flags: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  is_active: boolean;
  onboarding_completed: boolean;
}

export const adminApi = {
  dashboard: () => request<AdminDashboardSummary>("/admin/dashboard"),

  users: (skip = 0, limit = 100) =>
    request<AdminUser[]>(`/admin/users?skip=${skip}&limit=${limit}`),

  deactivateUser: (userId: string) =>
    request<AdminUser>(`/admin/users/${userId}/deactivate`, { method: "POST" }),

  verifyTechnician: (technicianId: string) =>
    request<TechnicianResponse>(`/admin/technicians/${technicianId}/verify`, {
      method: "POST",
    }),
};

// ── Notifications ─────────────────────────────────────────────────────────────

export interface NotificationResponse {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const notificationApi = {
  list: (unreadOnly = false) =>
    request<NotificationResponse[]>(`/notifications/?unread_only=${unreadOnly}`),

  markRead: (id: string) =>
    request<NotificationResponse>(`/notifications/${id}/read`, { method: "POST" }),

  markAllRead: () =>
    request<{ marked_read: number }>("/notifications/read-all", { method: "POST" }),
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface ReviewCreate {
  technician_id: string;
  job_request_id: string;
  rating: number;
  review_text?: string;
}

export interface ReviewResponse {
  id: string;
  technician_id: string;
  customer_id: string;
  job_request_id: string;
  rating: number;
  review_text: string | null;
  sentiment_score: number | null;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
}

export const reviewApi = {
  submit: (data: ReviewCreate) =>
    request<ReviewResponse>("/reviews/", { method: "POST", body: JSON.stringify(data) }),

  forTechnician: (techId: string, skip = 0, limit = 50) =>
    request<ReviewResponse[]>(`/reviews/technician/${techId}?skip=${skip}&limit=${limit}`),
};

// ── Payments ──────────────────────────────────────────────────────────────────

export interface PaymentCreate {
  job_id: string;
  customer_id: string;
  technician_id: string;
  amount: number;
  payment_method?: string;
}

export interface PaymentResponse {
  id: string;
  job_id: string;
  technician_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface WalletResponse {
  id: string;
  technician_id: string;
  balance: number;
  total_earnings: number;
  pending_payouts: number;
  currency: string;
}

export const paymentApi = {
  process: (data: PaymentCreate) =>
    request<PaymentResponse>("/payments/", { method: "POST", body: JSON.stringify(data) }),

  wallet: (technicianId: string) =>
    request<WalletResponse>(`/payments/wallet/${technicianId}`),
};

// ── Auto-Assign (Vapi AI calling) ─────────────────────────────────────────────

export interface AutoAssignTechnician {
  technician_id: string;
  base_hourly_rate: number;
  final_score: number;
  matched_skills: string[];
}

export interface AutoAssignResponse {
  message: string;
  job_id: string;
  first_call_rank: number;
  vapi_call_id: string;
}

export interface AutoAssignCallRecord {
  rank: number;
  technician_id: string;
  vapi_call_id: string | null;
  status: string;
  agreed_price: number | null;
  call_summary: string | null;
  created_at: string;
}

export interface AutoAssignStatusResponse {
  job_id: string;
  status: "idle" | "calling" | "completed" | "exhausted";
  calls: AutoAssignCallRecord[];
  assigned_technician_id: string | null;
}

export const autoAssignApi = {
  /** Start the auto-calling campaign for a job with the ranked technician list */
  trigger: (jobId: string, technicians: AutoAssignTechnician[]) =>
    request<AutoAssignResponse>(`/auto-assign/${jobId}`, {
      method: "POST",
      body: JSON.stringify({ technicians }),
    }),

  /** Poll the status of the calling campaign */
  status: (jobId: string) =>
    request<AutoAssignStatusResponse>(`/auto-assign/${jobId}/status`),
};
