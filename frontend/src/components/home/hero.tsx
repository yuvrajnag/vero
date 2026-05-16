import Link from "next/link";
import { HeroLaser } from "@/components/home/hero-laser";
import { HeroMockup } from "@/components/home/hero-mockup";
import { Header } from "@/components/layout/header";

export function Hero() {
  return (
    <section className="relative min-h-svh overflow-hidden bg-black text-white">
      <Header variant="dark" />

      {/* Laser + product mockup */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-svh" aria-hidden>
        <div className="mx-auto h-full w-[98vw] max-w-[90rem] [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <HeroLaser className="h-full w-full" />
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black from-30% via-black/85 via-45% to-transparent to-72%" />
      </div>

      {/* Copy — left, vertically centered */}
      <div className="relative z-10 mx-auto flex min-h-svh w-[98vw] max-w-[90rem] flex-col pb-16 pt-28 lg:pt-32">
        <div className="flex flex-1 flex-col justify-center">
        <div className="max-w-3xl text-left">
          <h1 className="text-[2.75rem] font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4rem]">
            The Future of Workforce Allocation
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Vero intelligently matches companies with skilled professionals using real-time availability, pricing, location, and qualification analysis — streamlining workforce allocation and negotiation at scale.
          </p>
          <div className="mt-10">
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium uppercase tracking-wider text-black transition-all duration-300 hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-[0.98]"
            >
              <span className="relative z-10">See in action</span>
              <span
                className="absolute -right-4 top-1/2 h-12 w-24 -translate-y-1/2 rounded-full bg-gradient-to-l from-orange-400/50 via-violet-400/30 to-transparent blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </div>
        </div>
        </div>
        <div className="relative mt-24 w-[98vw] max-w-[90rem] self-center">
          <div className="relative h-80 sm:h-96 md:h-[26rem] translate-y-[7px]">
            <HeroMockup />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent via-black/70 to-black" />
          </div>
          <div className="pointer-events-none -mt-6 pb-8 text-center">
            <p className="text-sm text-zinc-500">The platform for modern workforce allocation:</p>
            <p className="mt-2 text-sm font-medium text-white sm:text-base">
              Availability · Pricing · Location · Qualification · Allocation · Negotiation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
