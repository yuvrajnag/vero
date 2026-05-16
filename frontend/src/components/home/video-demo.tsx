"use client";

import { Play, Volume2, Maximize, Settings } from "lucide-react";

export function VideoDemo() {
  return (
    <section className="relative flex h-svh flex-col justify-center overflow-hidden bg-white px-6">
      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Aligned Heading and Subtext */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end gap-10">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 md:text-7xl leading-[0.85]">
              Experience<br />The Power.
            </h2>
          </div>
          <div className="max-w-[280px] border-l-2 border-zinc-900 pl-6 pb-1">
            <p className="text-[11px] font-bold leading-relaxed text-zinc-600 uppercase tracking-[0.1em]">
              Detailed architecture overview. 
              Efficiency through precision engineering.
            </p>
          </div>
        </div>

        {/* The "Dope" Video Box */}
        <div className="group relative w-full">
          {/* Decorative Corner Brackets */}
          <div className="absolute -left-6 -top-6 h-12 w-12 border-l border-t border-zinc-300 transition-all duration-500 group-hover:-left-4 group-hover:-top-4" />
          <div className="absolute -right-6 -bottom-6 h-12 w-12 border-r border-b border-zinc-300 transition-all duration-500 group-hover:-right-4 group-hover:-bottom-4" />
          
          <div className="relative bg-zinc-950 p-1">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {/* Grain Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* Bottom Control Bar - Removed as requested */}
            </div>
          </div>

          {/* Sticker - demo.png */}
          <div className="absolute -right-24 -top-16 z-40 h-28 w-28 rotate-12">
            <img src="/demo.png" alt="Demo sticker" className="h-full w-full object-contain drop-shadow-2xl" />
          </div>
        </div>

        {/* Extra spacing below the video */}
        <div className="h-12 md:h-16" />
      </div>
    </section>
  );
}
