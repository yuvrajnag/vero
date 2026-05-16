"use client";

import LaserFlow from "@/components/LaserFlow";

type HeroLaserProps = {
  className?: string;
};

export function HeroLaser({ className }: HeroLaserProps) {
  return (
    <div className={`relative bg-black ${className ?? ""}`}>
      <LaserFlow
        style={{ width: "100%", height: "100%", position: "relative" }}
        color="#e4e4e7"
        wispDensity={1.2}
        flowSpeed={0}
        verticalSizing={5.8}
        horizontalSizing={2.5}
        fogIntensity={0.78}
        fogScale={0.3}
        wispSpeed={15}
        wispIntensity={7.5}
        flowStrength={0.25}
        decay={1.1}
        falloffStart={0.9}
        horizontalBeamOffset={0.11}
        verticalBeamOffset={-0.27}
        className="h-full min-h-svh w-full"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_65%_68%,rgba(161,161,170,0.3),transparent_58%),radial-gradient(ellipse_50%_80%_at_68%_0%,rgba(212,212,216,0.18),transparent_50%)]"
        aria-hidden
      />
    </div>
  );
}
