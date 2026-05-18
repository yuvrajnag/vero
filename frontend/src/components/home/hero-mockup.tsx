"use client";

import { useState } from "react";

const Icons = {
  Dashboard: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  Postings: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ),
  Talent: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Negotiations: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 11 2-2-2-2"/><path d="M11 13h4"/><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
  ),
  Lock: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Check: () => (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
};

const WORKERS = [
  { id: 1, name: "Marcus Chen", role: "Senior HVAC Specialist", score: 98, price: "$85/hr", distance: "2.4 miles", certs: ["EPA Section 608", "NATE"] },
  { id: 2, name: "Sarah Jenkins", role: "Electrical Engineer", score: 94, price: "$95/hr", distance: "4.1 miles", certs: ["PE License", "OSHA 30"] },
  { id: 3, name: "David Volek", role: "Mechanical Technician", score: 89, price: "$75/hr", distance: "6.8 miles", certs: ["AWS Certified", "ASE"] },
];

export function HeroMockup() {
  const [selectedWorker] = useState(WORKERS[0]);

  return (
    <div className="relative h-full w-full group/mockup perspective-[1000px] overflow-hidden" aria-hidden>
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080808] shadow-[0_40px_120px_rgba(0,0,0,0.9)] transition-all duration-700 hover:border-white/20 lg:rounded-3xl">
        
        {/* Browser Top Bar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-black/60 px-4 py-3 backdrop-blur-xl">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-900 border border-white/5" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-900 border border-white/5" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-900 border border-white/5" />
          </div>
          <div className="ml-4 flex flex-1 items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[10px] text-zinc-500">
            <span className="opacity-30 tracking-tight">https://</span>
            <span className="text-zinc-400 font-bold tracking-tight">vero.engine.ai</span>
            <span className="ml-auto opacity-30"><Icons.Lock /></span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <aside className="hidden w-36 shrink-0 border-r border-white/5 bg-zinc-950/20 p-4 sm:block">
            <div className="mb-6 flex items-center gap-2 px-1">
              <div className="h-6 w-6 rounded bg-white text-[10px] font-black text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)]">V</div>
              <span className="text-[11px] font-black tracking-tighter text-white uppercase">Vero OS</span>
            </div>
            
            <nav className="space-y-0.5">
              {["Overview", "Allocation", "Network", "Audit"].map((label, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded px-2 py-1.5 text-[8px] font-black transition-all duration-300 ${
                    i === 1 ? "bg-white/[0.05] text-white" : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  <div className={`h-1 w-1 rounded-full ${i === 1 ? "bg-white" : "bg-transparent"}`} />
                  {label.toUpperCase()}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <div className="space-y-0.5">
                <p className="text-[7px] font-black uppercase tracking-[0.4em] text-zinc-600">Central Command</p>
                <h3 className="text-xs font-black text-white tracking-tight uppercase">Operational Grid NY-04</h3>
              </div>
              <div className="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-white/20" />
              </div>
            </header>

            <div className="flex flex-1 min-h-0">
              {/* Workers List */}
              <section className="w-1/2 border-r border-white/5 overflow-hidden p-3.5">
                <div className="flex items-center gap-2 mb-3.5 px-1">
                  <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Matched Units</h4>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="space-y-2">
                  {WORKERS.map((worker) => (
                    <div
                      key={worker.id}
                      className={`relative w-full rounded-lg border p-2.5 transition-all duration-700 ${
                        selectedWorker.id === worker.id
                          ? "border-white/20 bg-white/[0.03] shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                          : "border-white/5 opacity-40"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-white tracking-tighter uppercase">{worker.name}</p>
                          <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-wide">{worker.role}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-black text-white">{worker.score}%</div>
                          <div className="h-0.5 w-8 bg-white/5 mt-0.5 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${worker.score}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Worker Details View */}
              <section className="w-1/2 flex flex-col overflow-hidden p-4 bg-black/20">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white text-black flex items-center justify-center text-sm font-black italic shadow-[0_10px_20px_rgba(255,255,255,0.15)]">
                      {selectedWorker.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-black text-white tracking-tighter uppercase">{selectedWorker.name}</h5>
                      <div className="flex gap-1.5">
                        <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest border-r border-white/10 pr-1.5">Security Clear</span>
                        <span className="text-[7px] text-white font-black uppercase tracking-widest">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                    <div className="space-y-0.5">
                      <p className="text-[7px] text-zinc-650 uppercase font-black tracking-[0.2em]">Deployment</p>
                      <p className="text-[10px] font-black text-white">{selectedWorker.distance}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[7px] text-zinc-650 uppercase font-black tracking-[0.2em]">Valuation</p>
                      <p className="text-[10px] font-black text-white">{selectedWorker.price}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 shadow-inner">
                    <p className="text-[8px] text-zinc-400 leading-relaxed font-medium italic opacity-85">
                      "Protocol match identified. Strategic alignment score {selectedWorker.score}%. Verification of certificates complete. Ready for immediate command execution."
                    </p>
                  </div>

                  <button className="w-full rounded-full py-2.5 text-[8px] font-black uppercase tracking-[0.3em] bg-white text-black hover:invert shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all duration-300">
                    Confirm Allocation
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
}
