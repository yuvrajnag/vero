"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type HeaderProps = {
  variant?: "light" | "dark";
};

export function Header({ variant = "light" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isDark = variant === "dark";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-1/2 z-[100] -translate-x-1/2 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
        isScrolled
          ? "top-[3px] w-[calc(99vw-6px)] max-w-[calc(94rem-6px)] border border-zinc-800 bg-black/90 backdrop-blur-xl"
          : "top-0 w-[99vw] max-w-[94rem] bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-10">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-black tracking-tighter uppercase text-white"
          >
            <img src="/logo.png" alt="Vero Logo" className="h-6 w-auto" />
            Vero
          </Link>

          <nav className="hidden items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Workspace</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Protocol</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/signup"
            className="hidden rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-white/20 bg-white/5 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-white/10"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
