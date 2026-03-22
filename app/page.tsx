"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // ✅ add this
import Link from "next/link";
import {
  User,
  ArrowRight,
  Sparkles,
  Play,
  MousePointer2,
  Check,
  Twitter,
  Instagram,
  Linkedin,
  Github
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter(); // ✅ add this
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/workflow");
    }
  }, [isLoaded, isSignedIn, router]);

  const plans = [
    {
      name: "Free",
      desc: "Get free daily credits to try basic features.",
      price: 0,
      features: ["No credit card required", "Full access to real-time models", "Limited image upscaling"],
      button: "Start for Free",
    },
    {
      name: "Basic",
      desc: "Access our most popular features.",
      price: billingCycle === "monthly" ? 9 : 7,
      features: ["Commercial license", "5,000 compute units / month", "Upscale & enhance to 4K"],
      plus: "Everything in Free plus:",
      button: "Get Basic",
    },
    {
      name: "Pro",
      desc: "Advanced features and discounts on units.",
      price: billingCycle === "monthly" ? 35 : 28,
      features: ["Workflow automation with Nodes", "Access to all video models", "Bulk discounts on units"],
      plus: "Everything in Basic plus:",
      button: "Get Pro",
      highlight: true,
    },
    {
      name: "Max",
      desc: "Full access with higher discounts.",
      price: billingCycle === "monthly" ? 105 : 84,
      features: ["Unlimited Concurrency", "Unlimited relaxed generations", "Upscale & enhance to 22K"],
      plus: "Everything in Pro plus:",
      button: "Get Max",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      <Navbar />

      <main className="w-full flex flex-col items-center">

        {/* --- 1. HERO SECTION --- */}
        <section className="w-full max-w-[1400px] mx-auto px-6 pt-32 pb-16 flex flex-col items-center text-center relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 mb-8 backdrop-blur-md"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-black bg-zinc-700" />
              ))}
            </div>
            <span className="text-[12px] font-medium text-zinc-400">Trusted by 2M+ creatives</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[4.5rem] md:text-[6.5rem] font-bold tracking-[-0.06em] mb-7 max-w-[1100px] text-balance leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30"
          >
            The most powerful AI <br className="hidden md:block" />
            suite for Creatives.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[20px] text-[#A1A1AA] mb-12 max-w-2xl pt-2 text-balance leading-relaxed tracking-tight"
          >
            Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mb-24"
          >
            <Link href="/sign-up" className="px-8 py-4 rounded-full bg-white text-black font-bold transition-all hover:scale-105 active:scale-95 text-[15px] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-tight">
              <Sparkles size={16} fill="currentColor" /> Sign Up Free
            </Link>
            <Link href="/workflow" className="px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all hover:scale-105 active:scale-95 text-[15px] flex items-center justify-center gap-2 border border-zinc-800">
              Launch App <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="w-full relative px-4 md:px-0 max-w-[1200px]">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group rounded-[20px] border border-zinc-800 bg-zinc-950 p-2 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <div className="px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE PREVIEW
                </div>
              </div>
              <video autoPlay loop muted playsInline className="w-full rounded-[14px] object-cover aspect-video" src="https://cdn.krea.ai/home/home-video.mp4" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                  <Play fill="white" size={24} />
                </div>
              </div>
            </motion.div>

            <div className="absolute -top-10 -right-10 hidden lg:block">
              <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <MousePointer2 size={12} fill="white" /> Sarah
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. THE WHITE TRANSITION SECTION --- */}
        <section className="w-full bg-white text-black pt-32 pb-40 px-6 mt-10 rounded-t-[40px] md:rounded-t-[80px] selection:bg-black selection:text-white relative z-20">
          <div className="max-w-7xl mx-auto">

            {/* A. Model Showcase Carousel */}
            <div className="mb-32">
              <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x">
                <div className="min-w-[340px] md:min-w-[400px] aspect-[4/5] relative rounded-[40px] overflow-hidden snap-center bg-zinc-100 border border-zinc-200 group">
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="NextFlow 1" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-8 left-8 flex items-center gap-2 text-white font-bold">
                    <div className="w-5 h-5 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center text-[10px]">N</div> NextFlow 1
                  </div>
                  <div className="absolute bottom-10 left-8 right-8 text-white">
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-2">Prompt</p>
                    <h4 className="text-2xl font-bold leading-tight">“Cinematic photo of a person in a linen jacket”</h4>
                  </div>
                </div>

                <div className="min-w-[340px] md:min-w-[400px] aspect-[4/5] relative rounded-[40px] overflow-hidden snap-center bg-[#E5D5C0] border border-zinc-200 group">
                  <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Veo 3" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-8 left-8 flex items-center gap-2 text-white font-bold">
                    <div className="w-5 h-5 bg-white/20 backdrop-blur-md rounded-full border border-white/30" /> Veo 3
                  </div>
                  <div className="absolute bottom-10 left-8 right-8 text-white">
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-2">Prompt</p>
                    <h4 className="text-2xl font-bold leading-tight">“An animated character exploring a neon jungle”</h4>
                  </div>
                </div>

                <div className="min-w-[340px] md:min-w-[400px] aspect-[4/5] relative rounded-[40px] overflow-hidden snap-center bg-zinc-900 border border-zinc-200 group">
                  <div className="absolute inset-0 flex"><div className="w-1/2 h-full bg-zinc-800 opacity-50" /><div className="w-1/2 h-full bg-zinc-700" /></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-8 right-8 text-white">
                    <h4 className="text-2xl font-bold leading-tight">Upscale image <br /> 512px → 8K</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* B. Animated Model List Header */}
            <div className="mb-20">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl md:text-[82px] font-bold tracking-[-0.06em] leading-[0.85] mb-12 max-w-4xl">
                The industry's best Creative models. <br /> <span className="text-zinc-400">In one subscription.</span>
              </motion.h2>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="flex flex-wrap items-center gap-x-8 gap-y-6">
                {[
                  { name: "NextFlow 1", color: "from-blue-600 to-indigo-400" },
                  { name: "Veo 3.1", color: "from-emerald-500 to-teal-400" },
                  { name: "Ideogram", color: "from-orange-500 to-amber-400" },
                  { name: "Runway", color: "from-purple-600 to-pink-400" },
                  { name: "Flux", color: "from-rose-500 to-orange-400" },
                  { name: "Gemini", color: "from-blue-500 via-purple-500 to-red-400" },
                ].map((model, idx) => (
                  <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -2, scale: 1.05 }} className="group relative cursor-default">
                    <span className={`text-xl md:text-2xl font-bold tracking-tighter transition-all bg-clip-text text-transparent bg-gradient-to-r ${model.color} opacity-70 group-hover:opacity-100`}>
                      {model.name}
                    </span>
                    {idx < 5 && <span className="ml-8 text-zinc-200 font-light hidden md:inline">•</span>}
                    <div className={`absolute -inset-x-4 -inset-y-2 bg-gradient-to-r ${model.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-full`} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* C. High-Density Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[240px] mb-40">
              <div className="md:col-span-5 rounded-[32px] bg-zinc-100 overflow-hidden relative group p-8 flex items-end">
                <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-20" alt="" />
                <h3 className="text-4xl font-black tracking-tighter w-full leading-none">Industry-leading inference speed</h3>
              </div>
              <div className="md:col-span-2 rounded-[32px] bg-[#F4F4F4] p-8 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black tracking-tighter">22K</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-2">Pixels upscaling</span>
              </div>
              <div className="md:col-span-5 rounded-[32px] bg-[#F4F4F4] p-10 flex flex-col items-center justify-center text-center">
                <h3 className="text-5xl font-black tracking-tighter mb-2">Train</h3>
                <p className="text-sm font-bold text-zinc-500">Fine-tune models with your own data</p>
              </div>
              <div className="md:col-span-3 rounded-[32px] bg-zinc-100 p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-5xl font-black tracking-tighter">4K</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-2">Native image generation</p>
              </div>
              <div className="md:col-span-6 rounded-[32px] bg-zinc-100 p-10 flex flex-col items-center justify-center text-center group">
                <h3 className="text-8xl font-black tracking-tighter relative z-10">NextFlow 1</h3>
                <p className="text-sm font-bold text-zinc-500 relative z-10">Ultra-realistic flagship model</p>
              </div>
              <div className="md:col-span-3 rounded-[32px] bg-[#F4F4F4] p-8 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black tracking-tighter">64+</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-2">Models</span>
              </div>
            </div>

            {/* D. Subscription & Pricing */}
            <div className="mb-40">
              <div className="text-center mb-16">
                <h2 className="text-6xl md:text-[80px] font-bold tracking-[-0.06em] leading-tight mb-8">We've got a plan for everybody...</h2>
                <div className="inline-flex items-center p-1 bg-zinc-100 rounded-full border border-zinc-200">
                  <button onClick={() => setBillingCycle("monthly")} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-white shadow-sm" : "text-zinc-500"}`}>Monthly</button>
                  <button onClick={() => setBillingCycle("yearly")} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === "yearly" ? "bg-white shadow-sm" : "text-zinc-500"}`}>Yearly <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">-20%</span></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {plans.map((plan, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`p-10 rounded-[40px] border border-zinc-200 flex flex-col min-h-[620px] bg-white ${plan.highlight ? 'ring-2 ring-blue-600/10 shadow-xl' : ''}`}>
                    <h4 className="text-2xl font-bold mb-3">{plan.name}</h4>
                    <p className="text-zinc-500 text-[13px] mb-8">{plan.desc}</p>
                    <div className="text-5xl font-bold mb-10 tracking-tighter">${plan.price}<span className="text-sm text-zinc-400 font-medium tracking-normal">/month</span></div>
                    <div className="flex-1 space-y-4">
                      {plan.plus && <p className="text-[12px] font-black uppercase tracking-wider flex items-center gap-2"><span className="text-blue-600">✧</span> {plan.plus}</p>}
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-[13px] font-medium text-zinc-600"><Check size={14} className="mt-0.5 text-zinc-400" />{feat}</div>
                      ))}
                    </div>
                    <button className={`w-full py-4 rounded-full font-bold text-sm mt-8 transition-all ${plan.highlight ? 'bg-black text-white' : 'bg-zinc-100 text-black hover:bg-zinc-200'}`}>{plan.button}</button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* E. Partners/Investors */}
            <div className="text-center pt-20 border-t border-zinc-100">
              <p className="text-sm font-bold text-zinc-400 mb-12 uppercase tracking-widest">Backed by world-class teams</p>
              <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-30 grayscale contrast-200">
                <span className="text-3xl font-bold">Microsoft</span><span className="text-3xl font-bold">Shopify</span><span className="text-3xl font-bold">SAMSUNG</span><span className="text-3xl font-bold">NIKE</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. FOOTER --- */}
        <footer className="w-full bg-[#F5F5F7] text-black pt-24 pb-12 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
              <div className="col-span-2 lg:col-span-1">
                <div className="w-8 h-8 bg-black rounded-lg mb-6 flex items-center justify-center text-white font-bold">N</div>
                <p className="text-zinc-500 text-[13px] font-medium leading-relaxed">The real-time AI creative suite for professionals.</p>
              </div>
              <div>
                <h5 className="font-bold text-sm mb-6">Product</h5>
                <ul className="space-y-4 text-[13px] text-zinc-500 font-medium">
                  <li>Image Generator</li><li>Video Generator</li><li>Upscaler</li><li>Realtime</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-sm mb-6">Resources</h5>
                <ul className="space-y-4 text-[13px] text-zinc-500 font-medium">
                  <li>Pricing</li><li>API</li><li>Documentation</li><li>Community</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-sm mb-6">About</h5>
                <ul className="space-y-4 text-[13px] text-zinc-500 font-medium">
                  <li>Blog</li><li>Careers</li><li>Terms</li><li>Privacy</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[12px] font-medium text-zinc-400">© 2024 NextFlow. All rights reserved.</p>
              <div className="flex items-center gap-6 text-zinc-400">
                <Twitter size={18} className="hover:text-black cursor-pointer transition-colors" />
                <Instagram size={18} className="hover:text-black cursor-pointer transition-colors" />
                <Linkedin size={18} className="hover:text-black cursor-pointer transition-colors" />
                <Github size={18} className="hover:text-black cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}