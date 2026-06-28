"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Reveal, Eyebrow, Parallax } from "@/components/ui";

const types = [
  {
    key: "LARK", title: "The Lark", tag: "Sunrise · Morning Momentum",
    desc: "Energy ignites at first light. Larks rise naturally with the sun, finding their sharpest focus before noon and a quiet wind-down as evening falls.",
    traits: ["Natural early energy", "Peak focus before noon", "Disciplined, structured days"],
    text: "#f5d18c", glow: "rgba(244,181,77,0.35)", sub: "#e7a95b", bg: "#0a140f",
    img: "https://images.pexels.com/photos/32848270/pexels-photo-32848270.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    imgAlt: "Rufous-naped Lark singing at sunrise",
    quote: "I wake before the world and love the quiet of early hours.",
    peak: "6 AM – 12 PM", style: "Solar",
  },
  {
    key: "EAGLE", title: "The Eagle", tag: "Balanced Daylight · Adaptable",
    desc: "Steady through the day's full arc. Eagles glide between morning and evening with consistent performance and remarkable adaptability to changing demands.",
    traits: ["Consistent all-day output", "Highly adaptable rhythm", "Balanced recovery windows"],
    text: "#c7d2f0", glow: "rgba(53,74,130,0.5)", sub: "#8fa8e0", bg: "#08101e",
    img: "https://images.pexels.com/photos/12568767/pexels-photo-12568767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    imgAlt: "Majestic Eagle soaring through blue sky",
    quote: "I find my rhythm in the steady flow of the full day.",
    peak: "9 AM – 6 PM", style: "Harmonic",
  },
  {
    key: "OWL", title: "The Owl", tag: "Night Energy · Deep Focus",
    desc: "The mind comes alive after dusk. Owls find their creative current in the quiet of night — deep focus, reflection, and ideas that arrive when the world sleeps.",
    traits: ["Creative night energy", "Deep, uninterrupted focus", "Reflective late hours"],
    text: "#e9e2f5", glow: "rgba(120,90,180,0.4)", sub: "#cabfe0", bg: "#0c0a18",
    img: "https://images.pexels.com/photos/9932858/pexels-photo-9932858.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    imgAlt: "Eurasian Pygmy Owl in the night forest",
    quote: "My best thoughts arrive when everyone else is asleep.",
    peak: "6 PM – 1 AM", style: "Nocturnal",
  },
];

export function ChronotypeDiscovery() {
  const [active, setActive] = useState(0);
  const t = types[active];

  return (
    <section id="chronotypes" className="relative overflow-hidden" style={{ background: "#08101e" }}>
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-12 text-center">
          <Reveal><Eyebrow className="justify-center">Chronotype Discovery</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto max-w-4xl font-serif text-[clamp(2.5rem,5.5vw,5.5rem)] font-medium leading-[1]">
              Not every body clock{" "}
              <span className="italic" style={{ color: t.sub }}>runs the same.</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative grid gap-px overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-deep/60 to-midnight" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }}>
          <div className="relative flex flex-col gap-8 p-10 md:p-14">
            <div className="flex gap-3">
              {types.map((ct, i) => (
                <button key={ct.key} onClick={() => setActive(i)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    active === i ? "border-gold/40 bg-gold/15 text-gold" : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
                  }`}>{ct.title}</button>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-5xl font-medium" style={{ color: t.sub }}>
                  {active === 0 ? "OI" : active === 1 ? "OII" : "OIII"}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: t.sub }}>
                  {active === 0 ? "first light" : active === 1 ? "midday" : "nightfall"}
                </span>
              </div>
              <h1 className="mt-4 font-serif text-7xl font-medium md:text-8xl lg:text-9xl" style={{ color: t.text }}>{t.title}</h1>
              <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: t.sub }}>{t.tag}</p>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/65">{t.desc}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {t.traits.map((tr) => (
                  <span key={tr} className="rounded-full border px-5 py-2.5 text-sm font-medium text-white/70"
                    style={{ borderColor: `${t.text}30`, background: `${t.text}10` }}>{tr}</span>
                ))}
              </div>
              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">peak window</p>
                <p className="mt-2 font-serif text-3xl font-medium" style={{ color: t.sub }}>{t.peak}</p>
                <div className="mt-6 flex items-center gap-2">
                  {types.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${active === i ? "w-12" : "w-4 bg-white/20"}`}
                      style={active === i ? { background: t.sub } : {}} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full min-h-[500px] w-full"
              >
                <div className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${t.img}')`, backgroundPosition: "center 30%" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(8,16,30,0.4) 0%, rgba(8,16,30,0.1) 30%, transparent 60%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,16,30,0.6) 0%, transparent 40%)" }} />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    <span className="text-sm text-white/80">{t.imgAlt}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyChronotypesMatter() {
  const profiles = {
    Lark: [25, 55, 90, 95, 80, 60, 45, 35, 50, 40, 25, 15],
    Eagle: [30, 45, 65, 80, 88, 85, 78, 70, 72, 60, 42, 28],
    Owl: [15, 22, 35, 50, 62, 70, 78, 85, 92, 95, 80, 55],
  };
  const labels = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a", "4a"];
  const [type, setType] = useState<keyof typeof profiles>("Eagle");
  const data = profiles[type];
  const w = 1000, h = 320;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 100) * (h - 40) - 20}`);
  const path = `M${pts.join(" L")}`;
  const area = `${path} L${w},${h} L0,${h} Z`;
  const windows = [
    { label: "Focus Peak", c: "#f4b54d" }, { label: "Deep Work", c: "#354a82" },
    { label: "Creative Window", c: "#e7a95b" }, { label: "Recovery", c: "#e9e2f5" }, { label: "Sleep Prep", c: "#2c3d73" },
  ];

  return (
    <section id="rhythm-energy" className="relative overflow-hidden bg-stone px-6 py-32 text-midnight">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><Eyebrow dark>Why Chronotypes Matter</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[1]">
                Your energy has a <span className="italic text-royal">pattern.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-midnight/65">
                Once you see the shape of your day, everything changes. Schedule
                deep work in your peaks. Protect your recovery windows. Stop
                fighting a clock that was never yours.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex gap-3">
                {(Object.keys(profiles) as (keyof typeof profiles)[]).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                      type === t ? "bg-midnight text-ivory shadow-lg" : "border border-midnight/15 text-midnight/60 hover:border-midnight/40"
                    }`}>{t}</button>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {windows.map((wd) => (
                  <span key={wd.label} className="flex items-center gap-2 text-xs font-medium text-midnight/60">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: wd.c }} />{wd.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.2}>
              <div className="rounded-[2rem] border border-midnight/10 bg-ivory p-6 shadow-2xl shadow-midnight/5 sm:p-9">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-serif text-2xl font-medium">{type} · Energy Curve</span>
                  <span className="text-xs uppercase tracking-widest text-amber">24-hour cycle</span>
                </div>
                <svg viewBox={`0 0 ${w} ${h + 30}`} className="w-full">
                  <defs>
                    <linearGradient id="energyArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f4b54d" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f4b54d" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 0.5, 1].map((g) => (
                    <line key={g} x1="0" y1={20 + g * (h - 40)} x2={w} y2={20 + g * (h - 40)} stroke="#08142112" strokeDasharray="3 6" />
                  ))}
                  <motion.path key={type + "a"} d={area} fill="url(#energyArea)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
                  <motion.path key={type + "l"} d={path} fill="none" stroke="#e7a95b" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
                  {data.map((v, i) => (
                    <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (v / 100) * (h - 40) - 20} r="4" fill="#081421" />
                  ))}
                  {labels.map((l, i) => (
                    <text key={l} x={(i / (labels.length - 1)) * w} y={h + 22} fontSize="14" fill="#08142188" textAnchor="middle" fontFamily="Manrope">{l}</text>
                  ))}
                </svg>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedInsight() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section className="relative overflow-hidden bg-ivory py-32 text-midnight">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div ref={ref} className="relative overflow-hidden rounded-[2rem] border border-midnight/8 bg-stone/50" style={{ minHeight: "480px" }}>
                <Parallax speed={25} className="absolute inset-0">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-12">
                    <div className="relative h-40 w-40">
                      <div className="animate-orbit-slow absolute inset-0 rounded-full border border-midnight/10" />
                      <div className="animate-orbit-rev absolute inset-4 rounded-full border border-midnight/15" />
                      <div className="animate-orbit absolute inset-8 rounded-full border border-midnight/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-champagne to-sunrise shadow-[0_0_24px_rgba(244,181,77,0.5)]" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-serif text-xl font-medium text-midnight/50">Featured Visual</p>
                      <p className="mt-2 max-w-xs text-sm text-midnight/35">Insert your designed infographic, sleep science graphic, or campaign artwork here.</p>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {["Infographic", "Campaign", "Poster", "Awareness"].map((t) => (
                        <span key={t} className="rounded-full border border-midnight/10 px-3 py-1 text-[11px] text-midnight/40">{t}</span>
                      ))}
                    </div>
                  </div>
                </Parallax>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory/90 to-transparent" />
              </div>
            </Reveal>
          </div>
          <motion.div style={{ y: textY }} className="flex flex-col justify-center lg:col-span-5">
            <Reveal><Eyebrow dark>Featured Insight</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-[clamp(2.3rem,4.5vw,4rem)] font-medium leading-[1]">
                The architecture of a <span className="italic text-royal">perfect night.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-midnight/65">
                Four distinct sleep phases, each with a unique purpose — from the
                first drift into lightness to the deep slow waves of N3 and the
                vivid theatre of REM. Understanding this cycle transforms how you
                approach rest.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 space-y-4">
                {[
                  ["N1 — The Gateway", "Lasting 5–10 minutes. Brainwaves shift from alpha to theta."],
                  ["N2 — The Stabiliser", "Sleep spindles emerge. Memory and learning consolidate."],
                  ["N3 — The Restorer", "Deep slow waves. Cellular repair, immunity, growth."],
                  ["REM — The Dreamer", "Brain活跃. Emotional processing and creativity."],
                ].map(([t, d]) => (
                  <div key={t as string} className="flex items-start gap-4 rounded-xl border border-midnight/8 bg-linen/50 p-4">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                    <div>
                      <p className="font-semibold text-midnight/90">{t}</p>
                      <p className="mt-0.5 text-sm text-midnight/55">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function EducationalVisual() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "Sleep Cycles", icon: "∿" },
    { label: "Circadian Rhythm", icon: "◐" },
    { label: "Chronotypes", icon: "✦" },
    { label: "Recovery", icon: "◈" },
  ];
  const content = [
    { title: "How sleep cycles shape your night", body: "Across 4–6 complete cycles, the brain descends through progressively deeper stages before rising into REM. Each descent lasts roughly 90–120 minutes. Waking mid-cycle leaves you groggy. Aligning to this rhythm transforms how you feel.", tags: ["90–120 min cycles", "NREM → REM progression", "Wake at cycle end"] },
    { title: "Your 24-hour biological clock", body: "The suprachiasmatic nucleus (SCN) coordinates your entire body — hormone release, temperature, alertness — on a roughly 24-hour rhythm. Light is the primary synchroniser. When light hits your eyes at dawn, cortisol rises. When darkness falls, melatonin flows.", tags: ["SCN master clock", "Light as synchroniser", "Hormonal cascade"] },
    { title: "Three genetically distinct chronotypes", body: "Research across 200,000+ individuals confirms three distinct chronotype clusters — Larks, Eagles, and Owls — each with unique genetic markers (PER3, CLOCK, BMAL1). Your chronotype affects not just sleep timing, but cognition, creativity, and even lifespan.", tags: ["PER3 & CLOCK genes", "Morning vs evening preference", "Performance timing"] },
    { title: "Recovery is built during sleep", body: "During deep N3 sleep, growth hormone peaks. The immune system actively replenishes. The glymphatic system flushes neural waste. This is why sleep deprivation — even one night — measurably impairs immune function, reaction time, and emotional regulation.", tags: ["Growth hormone", "Glymphatic clearance", "Immune restoration"] },
  ];

  return (
    <section className="relative overflow-hidden bg-midnight px-6 py-32 text-ivory">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(53,74,130,0.25), transparent 70%)" }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <Reveal><Eyebrow className="justify-center">Educational Visual</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto max-w-3xl font-serif text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[1]">
              Science made <span className="gold-text italic">visually clear.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-ivory/10" style={{ minHeight: "440px", background: "rgba(16,32,59,0.6)" }}>
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(53,74,130,0.4), transparent 70%)" }} />
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.5 }}
                    className="flex h-full w-full flex-col items-center justify-center gap-6 p-12"
                  >
                    <div className="relative h-32 w-32">
                      <div className="animate-orbit-slow absolute inset-0 rounded-full border border-gold/30" />
                      <div className="animate-orbit-rev absolute inset-3 rounded-full border border-champagne/25" />
                      <div className="animate-orbit absolute inset-6 rounded-full border border-royal/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl text-gold/70">{tabs[activeTab].icon}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-serif text-2xl font-medium">{content[activeTab].title}</p>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/55">{content[activeTab].body}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {content[activeTab].tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs text-gold/80">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-midnight/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-midnight/60 to-transparent" />
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col justify-center lg:col-span-5">
            <Reveal>
              <div className="space-y-3">
                {tabs.map((tab, i) => (
                  <button key={tab.label}
                    onMouseEnter={() => setActiveTab(i)}
                    onClick={() => setActiveTab(i)}
                    className={`group relative flex w-full items-center gap-5 rounded-2xl border p-6 text-left transition-all duration-300 ${
                      activeTab === i ? "border-gold/30 bg-gold/10" : "border-ivory/10 bg-ivory/[0.03] hover:border-ivory/20"
                    }`}
                  >
                    {activeTab === i && (
                      <motion.span layoutId="activeTab" className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r bg-gold" />
                    )}
                    <span className={`text-2xl ${activeTab === i ? "text-gold" : "text-ivory/40"}`}>{tab.icon}</span>
                    <div>
                      <p className={`font-serif text-xl font-medium ${activeTab === i ? "text-gold" : "text-ivory/70"}`}>{tab.label}</p>
                      <p className="mt-1 text-sm text-ivory/45">{content[i].tags[0]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <p className="max-w-xl font-serif text-2xl italic text-ivory/60">Explore our full research library for deeper scientific insights.</p>
            <a href="#" className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-8 py-3.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/20">Access Research Library →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
