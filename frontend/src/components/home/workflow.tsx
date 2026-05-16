"use client";

import LightRays from "@/components/LightRays";
import { WorkflowDiagram } from "@/components/home/workflow-diagram";

export function Workflow() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-black bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:128px_128px,128px_128px,32px_32px,32px_32px] px-6 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#6b6b6b"
          raysSpeed={1}
          lightSpread={0.8}
          rayLength={5}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Your workflow, smarter and faster.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            Vero connects everything you need. Here&apos;s how it all comes together.
          </p>
        </div>
        <WorkflowDiagram />
      </div>
    </section>
  );
}
