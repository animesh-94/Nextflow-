"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Image,
  Video,
  Sliders,
  Database,
  Box,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/* ─── Feature data ────────────────────────────────────────────────── */
const columns = [
  {
    label: "Generate",
    items: [
      {
        icon: Image,
        title: "AI Image Generation",
        links: ["Text to Image", "Realtime Image Generation"],
      },
      {
        icon: Video,
        title: "AI Video Generation",
        links: ["Text to Video", "Motion Transfer"],
      },
      {
        icon: Box,
        title: "AI 3D Generation",
        links: ["Text to 3D Object", "Image to 3D Object"],
      },
    ],
  },
  {
    label: "Edit",
    items: [
      {
        icon: Sliders,
        title: "AI Image Enhancements",
        links: ["Upscaling", "Generative Image Editing"],
      },
      {
        icon: Video,
        title: "AI Video Enhancements",
        links: ["Frame Interpolation", "Video Style Transfer", "Video Upscaling"],
      },
    ],
  },
  {
    label: "Customize",
    items: [
      {
        icon: Sparkles,
        title: "AI Finetuning",
        links: ["Image LoRa Finetuning", "Video LoRa Finetuning", "LoRa Sharing"],
      },
      {
        icon: Database,
        title: "File Management",
        links: ["Krea Asset Manager"],
      },
    ],
  },
];

/* ─── Mega-menu panel ────────────────────────────────────────────── */
function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    /* 
     * KEY FIX: This is rendered inside the <nav> which is position:fixed full-width.
     * absolute + left-1/2 -translate-x-1/2 now centers relative to the full viewport.
     */
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden z-50"
      style={{ width: "min(860px, 92vw)" }}
      onMouseLeave={onClose}
    >
      <div className="flex">

        {/* ── Feature columns ── */}
        <div className="flex-1 grid grid-cols-3 gap-0 p-7 pr-6">
          {columns.map((col, ci) => (
            <div
              key={col.label}
              className={ci < columns.length - 1 ? "pr-6 mr-6 border-r border-zinc-100" : ""}
            >
              {/* Column heading */}
              <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-5 whitespace-nowrap">
                {col.label}
              </p>

              {col.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="mb-6 last:mb-0">
                    {/* Category row */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-[30px] h-[30px] rounded-[8px] bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} strokeWidth={1.75} className="text-zinc-500" />
                      </div>
                      <span className="text-[13px] font-semibold text-zinc-800 leading-tight whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                    {/* Sub-links */}
                    <div className="flex flex-col gap-[6px] pl-[42px]">
                      {item.links.map((link) => (
                        <Link
                          key={link}
                          href="#"
                          className="group text-[12.5px] text-zinc-500 hover:text-zinc-900 flex items-center gap-0.5 transition-colors whitespace-nowrap w-fit"
                          onClick={onClose}
                        >
                          {link}
                          <ChevronRight
                            size={11}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Promo card ── */}
        <div className="w-[215px] flex-shrink-0 relative overflow-hidden m-3 rounded-xl bg-zinc-900 min-h-[330px]">
          {/* Background portrait */}
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80"
            alt="Promo"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* Brand badge */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
            <div className="w-5 h-5 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
            <span className="text-white text-[11.5px] font-bold tracking-tight">NextFlow 1</span>
          </div>

          {/* Bottom CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-1.5">
              Prompt
            </p>
            <p className="text-white text-[13px] font-bold leading-[1.35] mb-3">
              &ldquo;Cinematic photo of a<br />person in a linen jacket&rdquo;
            </p>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[11.5px] font-semibold py-2 px-3 rounded-lg transition-colors">
              Generate image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Main Navbar ─────────────────────────────────────────────────── */
export function Navbar() {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close when clicking outside the whole navbar
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    /* nav is position:fixed full-width → MegaMenu uses THIS as its relative parent */
    <nav
      ref={navRef}
      className="w-full fixed top-0 left-0 right-0 z-50 px-16 py-5 flex items-center justify-between bg-black/80 backdrop-blur-xl border-b border-white/[0.04]"
    >
      {/* Left – Logo */}
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white text-black font-extrabold text-[12px]">
          N
        </div>
        <span className="text-[15px] font-bold tracking-tight text-white">NextFlow</span>
      </Link>

      {/* Center – Nav links (Features button triggers dropdown rendered in nav scope) */}
      <div className="hidden lg:flex items-center gap-8 text-[14.5px] text-white tracking-tight">
        <Link href="#app" className="hover:text-zinc-300 transition-colors">App</Link>

        {/* Features – hover to open */}
        <button
          onMouseEnter={() => setFeaturesOpen(true)}
          onClick={() => setFeaturesOpen((v) => !v)}
          className={`flex items-center gap-1 transition-colors focus:outline-none ${
            featuresOpen ? "text-white" : "hover:text-zinc-300"
          }`}
        >
          Features
          <ChevronDown
            size={13}
            className={`text-zinc-400 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`}
          />
        </button>

        <Link href="#image-generator" className="hover:text-zinc-300 transition-colors whitespace-nowrap">Image Generator</Link>
        <Link href="#video-generator" className="hover:text-zinc-300 transition-colors whitespace-nowrap">Video Generator</Link>
        <Link href="#upscaler" className="hover:text-zinc-300 transition-colors">Upscaler</Link>
        <Link href="#api" className="hover:text-zinc-300 transition-colors">API</Link>
        <Link href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
        <Link href="#enterprise" className="hover:text-zinc-300 transition-colors">Enterprise</Link>
      </div>

      {/* Right – Auth */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href="/sign-up"
          className="px-5 py-2 rounded-full bg-white text-black text-[13px] font-bold hover:scale-105 transition-transform tracking-tight whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          Sign up for free
        </Link>
        <Link
          href="/sign-in"
          className="px-5 py-1.5 rounded-full bg-white/10 text-white text-[13px] hover:bg-white/15 transition-colors hidden sm:block tracking-tight"
        >
          Log in
        </Link>
      </div>

      {/* Mega-menu anchored to nav (full-width fixed) → truly centers in viewport */}
      {featuresOpen && <MegaMenu onClose={() => setFeaturesOpen(false)} />}
    </nav>
  );
}
