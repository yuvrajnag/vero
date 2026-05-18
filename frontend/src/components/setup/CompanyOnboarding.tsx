import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, X, Plus } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- VALIDATION SCHEMA ---
const schema = z.object({
  // Stage 1
  companyName: z.string().min(2, "Company Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is too short").max(15, "Phone number is too long").regex(/^[0-9+\s-]+$/, "Invalid characters"),
  address: z.string().min(5, "Address is required"),
  hqLocation: z.string().min(2, "HQ Location is required"),
  logo: z.any().refine((val) => !!val, "Company logo is required"),

  // Stage 2
  industry: z.string().min(1, "Required"),
  otherIndustry: z.string().optional(),
  companySize: z.string().min(1, "Required"),
  businessCategory: z.array(z.string()).min(1, "Add at least one category"),
  website: z.string().url("Invalid URL"),
  regions: z.array(z.string()).min(1, "Add at least one region"),
  about: z.string().min(10, "About info required (min 10 chars)"),

  // Stage 3
  workforceType: z.array(z.string()).min(1, "Select at least one type"),
  hiringFreq: z.string().min(1, "Required"),
  remotePref: z.string().min(1, "Required"),
  urgency: z.string().optional(),
  verificationReqs: z.array(z.string()).min(1, "Select at least one"),
  currency: z.string().min(1, "Required"),
  budget: z.coerce.number().min(0, "Budget cannot be negative"),

  // Stage 4
  teamSize: z.coerce.number().min(1, "Must be at least 1"),
  activeProjects: z.coerce.number().min(0, "Cannot be negative"),
  workforceGoals: z.array(z.string()).min(1, "Add at least one goal"),
  assignmentWorkflow: z.string().min(1, "Required"),
  commsPref: z.array(z.string()).min(1, "Select at least one"),
  notifications: z.string().optional(),

  // Stage 5
  registration: z.any().refine((val) => !!val, "Required"),
  taxDocs: z.any().refine((val) => !!val, "Required"),
  rep: z.string().min(2, "Required"),
  identity: z.any().refine((val) => !!val, "Required"),
  portfolio: z.any().optional(),
  links: z.array(z.object({
    platform: z.string().min(1, "Required"),
    url: z.string().url("Invalid URL")
  })).optional()
}).refine((data) => {
  if (data.industry === "Other" && (!data.otherIndustry || data.otherIndustry.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Required",
  path: ["otherIndustry"]
});

type FormData = z.infer<typeof schema>;

const STAGE_FIELDS: (keyof FormData)[][] = [
  ["companyName", "email", "phone", "address", "hqLocation", "logo"],
  ["industry", "otherIndustry", "companySize", "businessCategory", "website", "regions", "about"],
  ["workforceType", "hiringFreq", "remotePref", "urgency", "verificationReqs", "currency", "budget"],
  ["teamSize", "activeProjects", "workforceGoals", "assignmentWorkflow", "commsPref", "notifications"],
  ["registration", "taxDocs", "rep", "identity", "portfolio", "links"]
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

const NumberInput = ({ label, placeholder, required, register, error }: any) => (
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
import { authApi, companyApi } from "@/lib/api";
import {
  formToCompanyCreate,
  resolveFileField,
} from "@/lib/onboarding-mappers";

export default function CompanyOnboarding({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalStages = 5;
  const { refreshUser } = useAuth();

  const { register, control, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    mode: "onChange",
    defaultValues: {
      businessCategory: [], regions: [], workforceType: [], verificationReqs: [],
      workforceGoals: [], commsPref: [], links: [], currency: "USD ($)"
    }
  });

  const industry = watch("industry");

  const { fields, append, remove } = useFieldArray({
    control, name: "links"
  });

  const handleAutofill = () => {
    setValue("companyName", "Tata Power Solar Ltd");
    setValue("email", "company@vero.com");
    setValue("phone", "+912266658282");
    setValue("address", "Carnac Receiving Station, Mumbai, Maharashtra");
    setValue("hqLocation", "Mumbai, Maharashtra");
    setValue("logo", new File([""], "logo.jpg", { type: "image/jpeg" }));

    setValue("industry", "Energy / Utilities");
    setValue("otherIndustry", "");
    setValue("companySize", "200+");
    setValue("businessCategory", ["Solar Construction", "Field Engineering"]);
    setValue("website", "https://tatapowersolar.com");
    setValue("regions", ["Bangalore South", "Mumbai West", "Delhi NCR"]);
    setValue("about", "Leading solar EPC and grid integration utility, executing clean energy allocations and large industrial rooftop solar installations.");

    setValue("workforceType", ["Field Technicians", "Contract-Based"]);
    setValue("hiringFreq", "Weekly");
    setValue("remotePref", "On-Site");
    setValue("urgency", "Immediate Dispatch");
    setValue("verificationReqs", ["Background Check", "License Verification"]);
    setValue("currency", "INR (₹)");
    setValue("budget", 15000);

    setValue("teamSize", 45);
    setValue("activeProjects", 8);
    setValue("workforceGoals", ["Scale dispatch latency", "Increase contractor validation"]);
    setValue("assignmentWorkflow", "Direct Hire");
    setValue("commsPref", ["Email", "SMS"]);
    setValue("notifications", "All Alerts");

    setValue("registration", new File([""], "reg.pdf", { type: "application/pdf" }));
    setValue("taxDocs", new File([""], "tax.pdf", { type: "application/pdf" }));
    setValue("rep", "Jane Director");
    setValue("identity", new File([""], "rep_id.pdf", { type: "application/pdf" }));
    setValue("portfolio", new File([""], "portfolio.pdf", { type: "application/pdf" }));
    setValue("links", [
      { platform: "Corporate Registry", url: "https://mca.gov.in/companies/tata-solar" }
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
      await authApi.completeOnboarding("customer");

      const payload = formToCompanyCreate({
        ...data,
        logo: await resolveFileField(data.logo, "company"),
        registration: await resolveFileField(data.registration, "company"),
        taxDocs: await resolveFileField(data.taxDocs, "company"),
        identity: await resolveFileField(data.identity, "identity"),
        portfolio: await resolveFileField(data.portfolio, "portfolio"),
      });

      await companyApi.create(payload);
      await refreshUser();
      onComplete();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to complete company onboarding";
      setSubmitError(message);
      console.error("Failed to complete company onboarding", err);
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.8, delay: 0.5 }}
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
              {stage === 1 && "Company Information"}
              {stage === 2 && "Organization Profile"}
              {stage === 3 && "Workforce Preferences"}
              {stage === 4 && "Operations & Management"}
              {stage === 5 && "Verification & Security"}
            </span>
          </div>
          <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
            <motion.div 
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              initial={{ width: "20%" }} animate={{ width: `${(stage / totalStages) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {submitError && (
          <p className="text-xs text-red-400 mb-4 border border-red-900/40 bg-red-950/30 px-3 py-2 rounded-lg">
            {submitError}
          </p>
        )}

        {/* Main Content Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.div key="stage1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Company Details.</h2>
                  <p className="text-xs font-medium text-zinc-400">Establish your organizational presence on Vero.</p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <Input label="Company Name" placeholder="Acme Corp" required register={register("companyName")} error={errors.companyName?.message} />
                  <Input label="Business Email" type="email" placeholder="contact@acme.com" required register={register("email")} error={errors.email?.message} />
                  
                  <Input 
                    label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" required maxLength={15}
                    register={register("phone")} error={errors.phone?.message} 
                    onKeyDown={(e: any) => {
                      if (!/[0-9+\-\s]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  
                  <Input label="Headquarters Location" placeholder="San Francisco, CA" required register={register("hqLocation")} error={errors.hqLocation?.message} />
                  
                  <div className="col-span-2">
                    <Input label="Company Address" placeholder="Full business address" required register={register("address")} error={errors.address?.message} />
                  </div>
                  
                  <div className="col-span-2">
                    <Controller name="logo" control={control} render={({ field }) => (
                      <FileUpload label="Company Logo Upload" required value={field.value} onChange={field.onChange} error={errors.logo?.message as string} />
                    )} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 2 && (
              <motion.div key="stage2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Organization Profile.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <Controller name="industry" control={control} render={({ field }) => (
                    <CustomSelect label="Industry Type" options={["Field Services & Maintenance", "Construction", "Logistics", "Healthcare", "Manufacturing", "Other"]} required value={field.value} onChange={field.onChange} error={errors.industry?.message} />
                  )} />
                  {industry === "Other" ? (
                    <Input label="Specify Industry" placeholder="e.g. Aerospace" required register={register("otherIndustry")} error={errors.otherIndustry?.message} />
                  ) : (
                    <Controller name="companySize" control={control} render={({ field }) => (
                      <CustomSelect label="Company Size" options={["1–10", "11–50", "51–200", "200+"]} required value={field.value} onChange={field.onChange} error={errors.companySize?.message} />
                    )} />
                  )}
                  
                  {industry === "Other" && (
                    <div className="col-span-2">
                      <Controller name="companySize" control={control} render={({ field }) => (
                        <CustomSelect label="Company Size" options={["1–10", "11–50", "51–200", "200+"]} required value={field.value} onChange={field.onChange} error={errors.companySize?.message} />
                      )} />
                    </div>
                  )}
                  
                  <div className="col-span-2">
                    <Controller name="businessCategory" control={control} render={({ field }) => (
                      <TagsInput label="Business Category" placeholder="e.g. Electrical Services, HVAC Repair, Plumbing Services (press enter)..." required value={field.value} onChange={field.onChange} error={errors.businessCategory?.message} />
                    )} />
                  </div>
                  
                  <Input label="Website URL" type="url" placeholder="https://acme.com" required register={register("website")} error={errors.website?.message} />
                  
                  <div className="col-span-2">
                    <Controller name="regions" control={control} render={({ field }) => (
                      <TagsInput label="Operating Regions" placeholder="e.g. Bangalore South, Hyderabad West, Delhi NCR..." required value={field.value} onChange={field.onChange} error={errors.regions?.message} />
                    )} />
                  </div>
                  
                  <div className="col-span-2">
                    <Textarea label="About Company" placeholder="e.g. Leading facility management firm servicing 150+ commercial client networks..." required register={register("about")} error={errors.about?.message} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 3 && (
              <motion.div key="stage3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Workforce Preferences.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-2">
                    <Controller name="workforceType" control={control} render={({ field }) => (
                      <MultiSelectChips label="Preferred Workforce Type" options={["Field Technicians", "Full-Time", "Contract-Based", "Emergency Workforce"]} required value={field.value} onChange={field.onChange} error={errors.workforceType?.message} />
                    )} />
                  </div>
                  
                  <Controller name="hiringFreq" control={control} render={({ field }) => (
                    <CustomSelect label="Hiring Frequency" options={["Daily", "Weekly", "Assignment-Based", "Permanent"]} required value={field.value} onChange={field.onChange} error={errors.hiringFreq?.message} />
                  )} />
                  
                  <Controller name="remotePref" control={control} render={({ field }) => (
                    <SingleSelectChips label="Remote / On-Site" options={["Fully Remote", "Hybrid", "On-Site"]} required value={field.value} onChange={field.onChange} error={errors.remotePref?.message} />
                  )} />
                  
                  <div className="col-span-2">
                    <Controller name="verificationReqs" control={control} render={({ field }) => (
                      <MultiSelectChips label="Verification Requirements" options={["Background Check", "License Verification", "Drug Test", "Govt ID Required"]} required value={field.value} onChange={field.onChange} error={errors.verificationReqs?.message} />
                    )} />
                  </div>

                  {/* Custom Budget Input with Currency Dropdown */}
                  <div className="flex gap-2 items-end">
                    <div className="w-[100px]">
                      <Controller name="currency" control={control} render={({ field }) => (
                        <CustomSelect label="Curr" options={["USD ($)", "EUR (€)", "GBP (£)", "INR (₹)"]} required value={field.value} onChange={field.onChange} error={errors.currency?.message} />
                      )} />
                    </div>
                    <div className="flex-1">
                      <NumberInput label="Expected Allocation Budget / Day" placeholder="0.00" required register={register("budget")} error={errors.budget?.message} />
                    </div>
                  </div>
                  
                  <Controller name="urgency" control={control} render={({ field }) => (
                    <SingleSelectChips label="Urgency Handling" options={["Standard Notice", "24hr Emergency", "Immediate Dispatch"]} value={field.value} onChange={field.onChange} error={errors.urgency?.message} />
                  )} />
                </div>
              </motion.div>
            )}

            {stage === 4 && (
              <motion.div key="stage4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Operations & Management.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <NumberInput label="Current Workforce Size" placeholder="e.g. 15" required register={register("teamSize")} error={errors.teamSize?.message} />
                  <NumberInput label="Active Assignments" placeholder="e.g. 3" required register={register("activeProjects")} error={errors.activeProjects?.message} />
                  
                  <div className="col-span-2">
                    <Controller name="workforceGoals" control={control} render={({ field }) => (
                      <TagsInput label="Workforce Management Goals" placeholder="e.g. Scale technical workforce, Reduce emergency response overhead..." required value={field.value} onChange={field.onChange} error={errors.workforceGoals?.message} />
                    )} />
                  </div>

                  <div className="col-span-2">
                    <Controller name="assignmentWorkflow" control={control} render={({ field }) => (
                      <CustomSelect label="Assignment Workflow" options={["Direct Hire", "Bidding/Tender", "Agency Sourced"]} required value={field.value} onChange={field.onChange} error={errors.assignmentWorkflow?.message} />
                    )} />
                  </div>

                  <div className="col-span-2">
                    <Controller name="commsPref" control={control} render={({ field }) => (
                      <MultiSelectChips label="Communication Preferences" options={["Email", "SMS", "In-App", "Slack"]} required value={field.value} onChange={field.onChange} error={errors.commsPref?.message} />
                    )} />
                  </div>

                  <div className="col-span-2">
                    <Controller name="notifications" control={control} render={({ field }) => (
                      <SingleSelectChips label="Notification Settings" options={["All Alerts", "Critical Only", "Muted"]} value={field.value} onChange={field.onChange} error={errors.notifications?.message} />
                    )} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 5 && (
              <motion.div key="stage5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-4 w-full">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Verification & Security.</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <Controller name="registration" control={control} render={({ field }) => <FileUpload label="Business Registration" required value={field.value} onChange={field.onChange} error={errors.registration?.message as string} />} />
                    <Controller name="taxDocs" control={control} render={({ field }) => <FileUpload label="Tax / Compliance Documents" required value={field.value} onChange={field.onChange} error={errors.taxDocs?.message as string} />} />
                    <Controller name="identity" control={control} render={({ field }) => <FileUpload label="Identity Verification" required value={field.value} onChange={field.onChange} error={errors.identity?.message as string} />} />
                    <Controller name="portfolio" control={control} render={({ field }) => <FileUpload label="Company Profile / Service Logs" value={field.value} onChange={field.onChange} error={errors.portfolio?.message as string} />} />
                  </div>
                  
                  <div className="col-span-2">
                    <Input label="Authorized Representative Name" placeholder="Jane Smith" required register={register("rep")} error={errors.rep?.message} />
                  </div>

                  <div className="col-span-2 pt-4 border-t border-zinc-900 mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Verification / Registry Links</span>
                      <button type="button" onClick={() => append({ platform: "", url: "" })} className="text-[9px] bg-white text-black px-2 py-1 rounded-full font-bold flex items-center gap-1 hover:scale-105 transition-transform"><Plus size={10} /> Add Link</button>
                    </div>
                    <div className="flex flex-col gap-4 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                      {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-4 items-end">
                          <div className="w-[140px]">
                            <Input label="Link Title" placeholder="e.g. CertRegistry" required register={register(`links.${index}.platform`)} error={errors.links?.[index]?.platform?.message} />
                          </div>
                          <div className="flex-1 flex gap-2 items-end">
                            <Input label="URL" type="url" placeholder="https://..." required register={register(`links.${index}.url`)} error={errors.links?.[index]?.url?.message} />
                            <button type="button" onClick={() => remove(index)} className="mb-1.5 p-1 text-zinc-500 hover:text-red-500 transition-colors"><X size={16} /></button>
                          </div>
                        </div>
                      ))}
                      {fields.length === 0 && <span className="text-xs text-zinc-600 text-center py-4 italic">No external links added.</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="w-full flex justify-between items-center mt-auto pt-6 border-t border-zinc-900 flex-shrink-0">
            <button type="button" onClick={prevStage} disabled={stage === 1} className={`text-xs font-bold uppercase tracking-widest transition-colors ${stage === 1 ? 'text-zinc-800 cursor-not-allowed' : 'text-zinc-400 hover:text-white'}`}>
              Back
            </button>
            {stage === totalStages ? (
              <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50">
                {isSubmitting ? "Submitting..." : <>Complete <CheckCircle2 size={16} strokeWidth={3} /></>}
              </button>
            ) : (
              <button type="button" onClick={handleNext} disabled={isSubmitting} className="px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50">
                Next Stage
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
