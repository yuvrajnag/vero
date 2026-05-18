import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, X, Plus } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- VALIDATION SCHEMA ---
const schema = z.object({
  // Stage 1
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is too short").max(15, "Phone number is too long").regex(/^[0-9+\s-]+$/, "Invalid characters"),
  location: z.string().min(2, "Location is required"),
  address: z.string().min(5, "Address is required"),
  profilePicture: z.any().optional(),

  // Stage 2
  role: z.string().min(2, "Primary role is required"),
  industry: z.string().min(2, "Industry is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  workType: z.array(z.string()).min(1, "Select at least one work type"),
  languages: z.array(z.string()).min(1, "Add at least one language"),

  // Stage 3
  days: z.array(z.string()).min(1, "Select at least one day"),
  hoursStart: z.string().min(1, "Required"),
  hoursEnd: z.string().min(1, "Required"),
  remote: z.string().min(1, "Selection required"),
  currency: z.string().min(1, "Required"),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
  prefLocations: z.string().optional(),
  emergency: z.string().optional(),

  // Stage 4
  education: z.string().min(2, "Education is required"),
  companies: z.string().optional(),
  history: z.string().min(10, "Brief history is required"),
  bio: z.string().min(10, "Short bio is required"),
  resume: z.any().optional(),
  linkedin: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional(),

  // Stage 5
  certificates: z.any().optional(),
  licenses: z.any().optional(),
  governmentId: z.any().refine((val) => !!val, "Required"),
  links: z.array(z.object({
    platform: z.string().min(1, "Required"),
    url: z.string().url("Invalid URL")
  })).optional()
});

type FormData = z.infer<typeof schema>;

const STAGE_FIELDS: (keyof FormData)[][] = [
  ["fullName", "email", "phone", "location", "address", "profilePicture"],
  ["role", "industry", "skills", "experience", "workType", "languages"],
  ["days", "hoursStart", "hoursEnd", "remote", "currency", "rate", "prefLocations", "emergency"],
  ["education", "companies", "history", "bio", "resume", "linkedin"],
  ["certificates", "licenses", "governmentId", "links"]
];

// --- CUSTOM INPUT COMPONENTS ---

const Label = ({ label, required, error }: any) => (
  <label className={`text-[9px] font-bold uppercase tracking-widest flex justify-between transition-colors mb-1 ${error ? 'text-red-500' : 'text-zinc-400'}`}>
    <span>{label} {required && <span className="text-zinc-600">*</span>}</span>
    {error && <span className="text-[8px] lowercase tracking-normal text-right">{error}</span>}
  </label>
);

const Input = ({ label, placeholder, type = "text", required, register, error, maxLength, onKeyDown }: any) => (
  <div className="flex flex-col w-full relative">
    <Label label={label} required={required} error={error} />
    <motion.input 
      animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }}
      type={type} placeholder={placeholder} {...register} maxLength={maxLength} onKeyDown={onKeyDown}
      className={`bg-transparent border-b py-1.5 text-white focus:outline-none transition-colors text-sm w-full rounded-none placeholder:text-zinc-700 ${error ? 'border-red-500 focus:border-red-400' : 'border-zinc-800 focus:border-white'}`}
    />
  </div>
);

const NumberInput = ({ label, placeholder, required, register, error, min = 0 }: any) => (
  <div className="flex flex-col w-full relative">
    <Label label={label} required={required} error={error} />
    <motion.input 
      animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }}
      type="text" placeholder={placeholder} {...register}
      onKeyDown={(e) => {
        if (!/[0-9.]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
          e.preventDefault();
        }
      }}
      className={`bg-transparent border-b py-1.5 text-white focus:outline-none transition-colors text-sm w-full rounded-none placeholder:text-zinc-700 ${error ? 'border-red-500 focus:border-red-400' : 'border-zinc-800 focus:border-white'}`}
    />
  </div>
);

const Textarea = ({ label, placeholder, required, register, error }: any) => (
  <div className="flex flex-col w-full">
    <Label label={label} required={required} error={error} />
    <motion.textarea 
      animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }}
      placeholder={placeholder} {...register}
      className={`bg-transparent border-b py-1.5 text-white focus:outline-none transition-colors text-sm w-full rounded-none resize-none h-16 custom-scrollbar placeholder:text-zinc-700 ${error ? 'border-red-500 focus:border-red-400' : 'border-zinc-800 focus:border-white'}`}
    />
  </div>
);

const CustomSelect = ({ label, options, required, value, onChange, error, placeholder = "Select..." }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col w-full relative">
      <Label label={label} required={required} error={error} />
      <motion.div 
        animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }}
        onClick={() => setOpen(!open)}
        className={`bg-transparent border-b py-1.5 text-sm w-full cursor-pointer flex justify-between items-center transition-colors ${error ? 'border-red-500 text-red-500' : 'border-zinc-800 text-white hover:border-zinc-600'}`}
      >
        <span className={value ? "text-white" : "text-zinc-700"}>{value || placeholder}</span>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar"
          >
            {options.map((opt:string) => (
              <div 
                key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className="px-3 py-2 text-sm text-zinc-400 hover:bg-white hover:text-black cursor-pointer transition-colors"
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
};

const MultiSelectChips = ({ label, options, required, value = [], onChange, error }: any) => {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v:string) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="flex flex-col w-full">
      <Label label={label} required={required} error={error} />
      <motion.div animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }} className="flex flex-wrap gap-2 pt-1">
        {options.map((opt:string) => (
          <button type="button" key={opt} onClick={() => toggle(opt)}
            className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border transition-all ${value.includes(opt) ? 'bg-white text-black border-white' : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}
          >
            {opt}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

const SingleSelectChips = ({ label, options, required, value = "", onChange, error }: any) => {
  return (
    <div className="flex flex-col w-full">
      <Label label={label} required={required} error={error} />
      <motion.div animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }} className="flex flex-wrap gap-2 pt-1">
        {options.map((opt:string) => (
          <button type="button" key={opt} onClick={() => onChange(opt)}
            className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border transition-all ${value === opt ? 'bg-white text-black border-white' : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}
          >
            {opt}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

const TagsInput = ({ label, placeholder, required, value = [], onChange, error }: any) => {
  const [input, setInput] = useState("");
  const addTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
        setInput("");
      }
    }
  };
  const removeTag = (tag: string) => onChange(value.filter((v:string) => v !== tag));

  return (
    <div className="flex flex-col w-full">
      <Label label={label} required={required} error={error} />
      <motion.div animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }} className={`flex flex-wrap gap-2 border-b py-1.5 transition-colors ${error ? 'border-red-500 focus-within:border-red-400' : 'border-zinc-800 focus-within:border-white'}`}>
        {value.map((tag:string) => (
          <span key={tag} className="text-[10px] bg-zinc-800 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
            {tag} <button type="button" onClick={() => removeTag(tag)}><X size={10} className="hover:text-red-400" /></button>
          </span>
        ))}
        <input 
          type="text" placeholder={value.length === 0 ? placeholder : ""} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={addTag}
          className="bg-transparent text-white text-sm focus:outline-none flex-1 min-w-[100px] placeholder:text-zinc-700"
        />
      </motion.div>
    </div>
  );
};

const FileUpload = ({ label, required, value, onChange, error }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFile = (e: any) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="flex flex-col w-full">
      <Label label={label} required={required} error={error} />
      <input type="file" ref={inputRef} onChange={handleFile} className="hidden" />
      <motion.div 
        animate={error ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.3 }}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed transition-colors p-3 flex flex-col items-center justify-center cursor-pointer group rounded-md bg-zinc-950/50 ${error ? 'border-red-500 hover:border-red-400' : 'border-zinc-800 hover:border-zinc-500'}`}
      >
        {value ? (
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-[10px] text-white font-medium truncate max-w-[200px]">{value.name}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null); inputRef.current!.value = ''; }} className="text-[8px] text-zinc-500 hover:text-white uppercase tracking-widest mt-1">Remove</button>
          </div>
        ) : (
          <>
            <UploadCloud size={16} className={`transition-colors mb-1 ${error ? 'text-red-500 group-hover:text-red-400' : 'text-zinc-700 group-hover:text-white'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${error ? 'text-red-500 group-hover:text-red-400' : 'text-zinc-600 group-hover:text-white'}`}>Select File</span>
          </>
        )}
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---
import { useAuth } from "@/lib/auth-context";
import { technicianApi, authApi, type TechnicianCreate } from "@/lib/api";
import { resolveFileField } from "@/lib/onboarding-mappers";

function formToTechnicianCreate(data: FormData): TechnicianCreate {
  return {
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    location: data.location,
    address: data.address,
    role: data.role,
    industry: data.industry,
    skills: data.skills,
    experience_years: data.experience,
    preferred_work_types: data.workType,
    languages: data.languages,
    available_days: data.days,
    hours_start: data.hoursStart,
    hours_end: data.hoursEnd,
    remote_pref: data.remote,
    currency: data.currency,
    base_hourly_rate: data.rate,
    preferred_locations: data.prefLocations || undefined,
    emergency_availability: data.emergency || undefined,
    education: data.education,
    previous_employers: data.companies || undefined,
    work_history: data.history,
    bio: data.bio,
    linkedin_url: data.linkedin || undefined,
    verification_links: data.links ?? [],
  };
}

export default function WorkerOnboarding({
  onComplete,
  mode = "create",
  initialData,
}: {
  onComplete: () => void;
  mode?: "create" | "edit";
  initialData?: any;
}) {
  const [stage, setStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalStages = 5;
  const { user, refreshUser } = useAuth();

  const { register, control, handleSubmit, trigger, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    mode: "onChange",
    defaultValues: initialData ? {
      fullName: initialData.full_name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      location: initialData.location || "",
      address: initialData.address || "",
      role: initialData.role || "",
      industry: initialData.industry || "",
      skills: initialData.skills || [],
      experience: initialData.experience_years || 0,
      workType: initialData.preferred_work_types || [],
      languages: initialData.languages || [],
      days: initialData.available_days || [],
      hoursStart: initialData.hours_start || "",
      hoursEnd: initialData.hours_end || "",
      remote: initialData.remote_pref || "",
      currency: initialData.currency || "USD ($)",
      rate: initialData.daily_rate || 0,
      prefLocations: initialData.preferred_locations || "",
      emergency: initialData.emergency_availability || "",
      education: initialData.education || "",
      companies: initialData.previous_employers || "",
      history: initialData.work_history || "",
      bio: initialData.bio || "",
      linkedin: initialData.linkedin_url || "",
      links: initialData.verification_links || [],
    } : {
      skills: [], workType: [], languages: [], days: [], links: [], currency: "USD ($)"
    }
  });

  const { fields, append, remove } = useFieldArray({
    control, name: "links"
  });

  const handleAutofill = () => {
    setValue("fullName", "Vikram Rao");
    setValue("email", "tech@vero.com");
    setValue("phone", "+919876543210");
    setValue("location", "Bangalore, Karnataka");
    setValue("address", "Sector 4, HSR Layout, Bangalore");
    setValue("profilePicture", new File([""], "avatar.jpg", { type: "image/jpeg" }));
    
    setValue("role", "Solar Integration Specialist");
    setValue("industry", "Renewable Energy & Solar Utility");
    setValue("skills", ["Solar Installation", "Inverter Calibration", "Grid Syncer", "DC Cabling"]);
    setValue("experience", 8);
    setValue("workType", ["Contract", "On-call / Gig"]);
    setValue("languages", ["English", "Hindi", "Kannada"]);
    
    setValue("days", ["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setValue("hoursStart", "09:00");
    setValue("hoursEnd", "18:00");
    setValue("remote", "On-Site");
    setValue("currency", "INR (₹)");
    setValue("rate", 3200);
    setValue("prefLocations", "Bangalore South, Electronic City");
    setValue("emergency", "Yes");
    
    setValue("education", "Bachelor of Technology in Electrical Engineering");
    setValue("companies", "Tata Power Solar, CleanMax Energy");
    setValue("history", "Successfully assembled and configured over 50 commercial solar grid integrations, managing low-voltage DC cabling runs and high-voltage inverter calibrators.");
    setValue("bio", "Certified electrical technician specializing in high-efficiency photovoltaic systems and automated microgrid synchronization.");
    setValue("resume", new File([""], "resume.pdf", { type: "application/pdf" }));
    setValue("linkedin", "https://linkedin.com/in/vikram-solar");
    
    setValue("certificates", new File([""], "cert.pdf", { type: "application/pdf" }));
    setValue("licenses", new File([""], "license.pdf", { type: "application/pdf" }));
    setValue("governmentId", new File([""], "id.pdf", { type: "application/pdf" }));
    setValue("links", [
      { platform: "National Workforce Registry", url: "https://registry.gov/workers/vikram-rao" }
    ]);
    
    setStage(5);
  };

  const handleNext = async () => {
    const fieldsToValidate = STAGE_FIELDS[stage - 1];
    const isStageValid = await trigger(fieldsToValidate);
    if (isStageValid) {
      setStage(p => Math.min(p + 1, totalStages));
    }
  };

  const prevStage = () => setStage(p => Math.max(p - 1, 1));

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const enriched = {
        ...formToTechnicianCreate(data),
        profile_picture_url: await resolveFileField(data.profilePicture, "profile"),
        resume_url: await resolveFileField(data.resume, "resume"),
        certificates_url: await resolveFileField(data.certificates, "certificate"),
        licenses_url: await resolveFileField(data.licenses, "license"),
        government_id_url: await resolveFileField(data.governmentId, "identity", {
          required: true,
        }),
      };

      if (mode === "edit") {
        await technicianApi.update(enriched);
      } else {
        await technicianApi.create(enriched);
        if (!user?.onboarding_completed) {
          await authApi.completeOnboarding("technician");
        }
        await refreshUser();
      }
      onComplete();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to complete worker onboarding";
      setSubmitError(message);
      console.error("Failed to complete worker onboarding", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    initial: { opacity: 0, y: 10, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -10, filter: "blur(4px)" }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.2 } }} 
      transition={{ duration: 0.8, delay: 0.5 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
    >
      <div className="w-full max-w-2xl flex flex-col pointer-events-auto bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
        
        {/* Progress Bar */}
        <div className="w-full mb-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Stage {stage} of {totalStages}</span>
            <button
              type="button"
              onClick={handleAutofill}
              className="relative text-[9px] font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all duration-300 flex items-center gap-2 py-1.5 px-4 rounded-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 shadow-md group overflow-hidden cursor-pointer pointer-events-auto"
            >
              <span>Demo Autofill</span>
            </button>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              {stage === 1 && "Basic Information"}
              {stage === 2 && "Professional Profile"}
              {stage === 3 && "Work Preferences"}
              {stage === 4 && "Experience & Background"}
              {stage === 5 && "Verification & Proof"}
            </span>
          </div>
          <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
            <motion.div 
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              initial={{ width: "20%" }} animate={{ width: `${(stage / totalStages) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.div key="stage1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Let’s get started.</h2>
                  <p className="text-xs font-medium text-zinc-400">Your personal information helps companies identify and connect with you securely.</p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <Input label="Full Name" placeholder="John Doe" required register={register("fullName")} error={errors.fullName?.message} />
                  <Input label="Email Address" type="email" placeholder="john@example.com" required register={register("email")} error={errors.email?.message} />
                  
                  {/* Phone Input with Strict Blocking */}
                  <Input 
                    label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" required maxLength={15}
                    register={register("phone")} error={errors.phone?.message} 
                    onKeyDown={(e: any) => {
                      if (!/[0-9+\-\s]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  
                  <Input label="Current Location" placeholder="City, State" required register={register("location")} error={errors.location?.message} />
                  <div className="col-span-2">
                    <Input label="Address" placeholder="Full residential or business address" required register={register("address")} error={errors.address?.message} />
                  </div>
                  <div className="col-span-2">
                    <Controller name="profilePicture" control={control} render={({ field }) => (
                      <FileUpload label="Profile Picture" value={field.value} onChange={field.onChange} error={errors.profilePicture?.message as string} />
                    )} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 2 && (
              <motion.div key="stage2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Tell us what you do.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <Input label="Primary Role" placeholder="e.g. HVAC Technician, Electrician" required register={register("role")} error={errors.role?.message} />
                  <Input label="Industry Category" placeholder="e.g. Facility Maintenance & Field Services" required register={register("industry")} error={errors.industry?.message} />
                  <div className="col-span-2">
                    <Controller name="skills" control={control} render={({ field }) => (
                      <TagsInput label="Skills / Expertise" placeholder="e.g. AC Installation, Industrial Wiring, Piping (press enter)..." required value={field.value} onChange={field.onChange} error={errors.skills?.message} />
                    )} />
                  </div>
                  <NumberInput label="Years of Experience" placeholder="e.g. 5" required register={register("experience")} error={errors.experience?.message} />
                  <Controller name="workType" control={control} render={({ field }) => (
                    <MultiSelectChips label="Preferred Work Type" options={["Full-time", "Part-time", "Contract", "On-call / Gig"]} required value={field.value} onChange={field.onChange} error={errors.workType?.message} />
                  )} />
                  <div className="col-span-2">
                    <Controller name="languages" control={control} render={({ field }) => (
                      <TagsInput label="Languages Spoken" placeholder="English, Hindi, Spanish..." required value={field.value} onChange={field.onChange} error={errors.languages?.message} />
                    )} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 3 && (
              <motion.div key="stage3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Configure your availability.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-2">
                    <Controller name="days" control={control} render={({ field }) => (
                      <MultiSelectChips label="Available Days" options={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} required value={field.value} onChange={field.onChange} error={errors.days?.message} />
                    )} />
                  </div>
                  <div className="flex gap-4 items-end">
                    <Input label="Start Time" type="time" required register={register("hoursStart")} error={errors.hoursStart?.message} />
                    <span className="text-zinc-500 pb-2">-</span>
                    <Input label="End Time" type="time" required register={register("hoursEnd")} error={errors.hoursEnd?.message} />
                  </div>
                  <Controller name="remote" control={control} render={({ field }) => (
                    <CustomSelect label="Remote / On-Site" options={["Fully Remote", "Hybrid", "On-Site"]} required value={field.value} onChange={field.onChange} error={errors.remote?.message} />
                  )} />
                  
                  {/* Custom Rate Input with Currency Dropdown */}
                  <div className="flex gap-2 items-end">
                    <div className="w-[100px]">
                      <Controller name="currency" control={control} render={({ field }) => (
                        <CustomSelect label="Curr" options={["USD ($)", "EUR (€)", "GBP (£)", "INR (₹)"]} required value={field.value} onChange={field.onChange} error={errors.currency?.message} />
                      )} />
                    </div>
                    <div className="flex-1">
                      <NumberInput label="Expected Rate / Day" placeholder="0.00" required register={register("rate")} error={errors.rate?.message} />
                    </div>
                  </div>

                  <Input label="Preferred Locations" placeholder="City or Region" register={register("prefLocations")} error={errors.prefLocations?.message} />
                  
                  <Controller name="emergency" control={control} render={({ field }) => (
                    <SingleSelectChips label="Emergency Availability" options={["Yes", "No", "Maybe"]} value={field.value} onChange={field.onChange} error={errors.emergency?.message} />
                  )} />
                </div>
              </motion.div>
            )}

            {stage === 4 && (
              <motion.div key="stage4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Showcase your professional journey.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <Input label="Technical Certification / Education" placeholder="e.g. Diploma in HVAC & Electrical Systems" required register={register("education")} error={errors.education?.message} />
                  <Input label="Previous Contractors / Employers" placeholder="e.g. Apex Facilities, Beta Maintenance" register={register("companies")} error={errors.companies?.message} />
                  <div className="col-span-2">
                    <Textarea label="Operational Work History" placeholder="Brief summary of past projects, emergency response calls, and service quality ratings..." required register={register("history")} error={errors.history?.message} />
                  </div>
                  <div className="col-span-2">
                    <Textarea label="Short Bio / Technical Summary" placeholder="Introduce your field specialization and emergency diagnostic expertise..." required register={register("bio")} error={errors.bio?.message} />
                  </div>
                  <div className="col-span-2">
                    <Controller name="resume" control={control} render={({ field }) => (
                      <FileUpload label="Technical Resume / Service Log Upload" value={field.value} onChange={field.onChange} error={errors.resume?.message as string} />
                    )} />
                  </div>
                  <div className="col-span-2">
                    <Input label="Professional Network Link (LinkedIn)" type="url" placeholder="https://linkedin.com/in/..." register={register("linkedin")} error={errors.linkedin?.message} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 5 && (
              <motion.div key="stage5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Build trust with verified credentials.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-2 grid grid-cols-3 gap-4">
                    <Controller name="certificates" control={control} render={({ field }) => <FileUpload label="Safety Certificates" value={field.value} onChange={field.onChange} />} />
                    <Controller name="licenses" control={control} render={({ field }) => <FileUpload label="Operational Licenses" value={field.value} onChange={field.onChange} />} />
                    <Controller name="governmentId" control={control} render={({ field }) => <FileUpload label="ID Verification (Govt ID)" required value={field.value} onChange={field.onChange} error={errors.governmentId?.message as string} />} />
                  </div>
                  
                  <div className="col-span-2 pt-4 border-t border-zinc-900 mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Verification Registry Links</span>
                      <button type="button" onClick={() => append({ platform: "", url: "" })} className="text-[9px] bg-white text-black px-2 py-1 rounded-full font-bold flex items-center gap-1 hover:scale-105 transition-transform"><Plus size={10} /> Add Link</button>
                    </div>
                    <div className="flex flex-col gap-4 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                      {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-4 items-end">
                           <div className="w-[140px]">
                            <Input label="Registry / Platform" placeholder="e.g. CertRegistry" required register={register(`links.${index}.platform`)} error={errors.links?.[index]?.platform?.message} />
                          </div>
                          <div className="flex-1 flex gap-2 items-end">
                            <Input label="Registry URL" type="url" placeholder="https://..." required register={register(`links.${index}.url`)} error={errors.links?.[index]?.url?.message} />
                            <button type="button" onClick={() => remove(index)} className="mb-1.5 p-1 text-zinc-500 hover:text-red-500 transition-colors"><X size={16} /></button>
                          </div>
                        </div>
                      ))}
                      {fields.length === 0 && <span className="text-xs text-zinc-600 text-center py-4 italic">No custom links added.</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {submitError && (
            <p className="mt-4 text-[13px] text-red-400 border border-red-900/40 bg-red-950/30 rounded-lg px-4 py-3">
              {submitError}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="w-full flex justify-between items-center mt-auto pt-6 border-t border-zinc-900 flex-shrink-0">
            <button type="button" onClick={prevStage} disabled={stage === 1} className={`text-xs font-bold uppercase tracking-widest transition-colors ${stage === 1 ? 'text-zinc-800 cursor-not-allowed' : 'text-zinc-400 hover:text-white'}`}>
              Back
            </button>
            {stage === totalStages ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Complete"}{" "}
                <CheckCircle2 size={16} strokeWidth={3} />
              </button>
            ) : (
              <button type="button" onClick={handleNext} className="px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Next Stage
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
