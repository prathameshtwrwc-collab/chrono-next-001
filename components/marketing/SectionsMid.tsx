"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal, Eyebrow, GoldButton } from "@/components/ui";
import { CircadianOrbit } from "@/components/CircadianOrbit";

export function DailyRhythm() {
  const ritual = [
    { t: "06:30", n: "Sunlight", d: "Anchor your clock with morning light.", a: 0 },
    { t: "08:00", n: "Movement", d: "Wake the body, prime circulation.", a: 51 },
    { t: "10:00", n: "Deep Work", d: "Cognitive peak — protect it fiercely.", a: 102 },
    { t: "13:00", n: "Nutrition", d: "Fuel without spiking the afternoon dip.", a: 154 },
    { t: "16:00", n: "Performance", d: "Physical peak — train and create.", a: 206 },
    { t: "19:00", n: "Recovery", d: "Dim light, lower stimulation, unwind.", a: 257 },
    { t: "22:30", n: "Sleep", d: "Consistent descent into restoration.", a: 308 },
  ];
  const [active, setActive] = useState(2);
  return (
    <section id="rhythm" className="relative scroll-mt-20 overflow-hidden px-6 py-32 text-midnight" style={{ background: "linear-gradient(160deg, #f5d18c 0%, #faf8f4 40%, #e9ded4 100%)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Reveal><Eyebrow dark className="justify-center">Daily Rhythm Optimization</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto max-w-3xl font-serif text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[1.08]">
              Optimize your day around <span className="italic text-royal">your biology.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-lg">
              <CircadianOrbit className="absolute inset-0 opacity-25" intensity={0.4} />
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
                <circle cx="200" cy="200" r="150" fill="none" stroke="#08142115" strokeWidth="1" />
                {ritual.map((r, i) => {
                  const rad = ((r.a - 90) * Math.PI) / 180;
                  const x = 200 + 150 * Math.cos(rad);
                  const y = 200 + 150 * Math.sin(rad);
                  return (
                    <g key={i} onMouseEnter={() => setActive(i)} className="cursor-pointer">
                      <circle cx={x} cy={y} r={active === i ? 14 : 8} fill={active === i ? "#e7a95b" : "#2c3d73"} style={{ transition: "all .3s" }} />
                      {active === i && <circle cx={x} cy={y} r="22" fill="none" stroke="#e7a95b" strokeOpacity="0.4" />}
                    </g>
                  );
                })}
              </svg>
              <div className="absolute left-1/2 top-1/2 w-48 -translate-x-1/2 -translate-y-1/2 text-center">
                <motion.div key={active} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                  <p className="font-mono text-sm text-amber">{ritual[active].t}</p>
                  <p className="font-serif text-3xl font-medium">{ritual[active].n}</p>
                  <p className="mt-2 text-xs leading-relaxed text-midnight/60">{ritual[active].d}</p>
                </motion.div>
              </div>
            </div>
          </Reveal>

          <div>
            {ritual.map((r, i) => (
              <Reveal key={r.n} delay={i * 0.04}>
                <button onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-5 border-b border-midnight/10 py-4 text-left transition-colors ${active === i ? "opacity-100" : "opacity-55 hover:opacity-90"}`}>
                  <span className="font-mono text-sm text-amber w-14">{r.t}</span>
                  <span className="font-serif text-2xl font-medium">{r.n}</span>
                  <span className="ml-auto text-sm text-midnight/55 hidden sm:block">{r.d}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SleepBlueprint() {
  const steps = [
    { n: "01", t: "Assessment", d: "A guided 4-minute portrait of your sleep, energy and habits." },
    { n: "02", t: "Analysis", d: "Our engine maps your responses against circadian science models." },
    { n: "03", t: "Chronotype Detection", d: "Your biological type — Lark, Eagle, or Owl — revealed with confidence." },
    { n: "04", t: "Personal Insights", d: "A living profile of your peaks, dips and recovery windows." },
    { n: "05", t: "Recommendations", d: "Daily protocols tuned precisely to the rhythm within you." },
  ];
  return (
    <section className="relative overflow-hidden bg-sage px-6 py-32 text-midnight">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-lavender/60 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><Eyebrow dark>Sleep Blueprint</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[1.08]">
                Discover your <span className="italic text-royal">sleep blueprint.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-midnight/65">
                A premium intelligence engine that translates your biology into a
                clear, personal map — and a plan you can actually live by.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-9 rounded-3xl border border-midnight/10 bg-ivory/70 p-7 backdrop-blur">
                <div className="flex items-center gap-4">
                  <CircadianOrbit className="h-16 w-16" intensity={0.8} />
                  <div>
                    <p className="font-serif text-3xl font-medium text-royal">94%</p>
                    <p className="text-xs uppercase tracking-widest text-midnight/50">Detection confidence</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-8"><GoldButton to="/app">Begin Assessment</GoldButton></div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <div className="relative">
              <span className="absolute left-6 top-4 bottom-4 w-px bg-midnight/15" />
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.1}>
                  <div className="group relative mb-3 flex gap-6 rounded-2xl border border-transparent p-5 transition-all hover:border-midnight/10 hover:bg-ivory/70">
                    <span className="z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full bg-midnight font-mono text-sm text-gold">{s.n}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-medium">{s.t}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-midnight/60">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Transformation() {
  const items = [
    { k: "Focus", d: "Sustained clarity in the hours that matter most." },
    { k: "Recovery", d: "Wake genuinely restored, not merely awake." },
    { k: "Productivity", d: "More from less — work aligned to your peaks." },
    { k: "Wellbeing", d: "Mood, resilience and calm built on real rest." },
    { k: "Energy", d: "Steady reserves instead of caffeine cliffs." },
    { k: "Balance", d: "A life that finally moves with its own rhythm." },
  ];
  return (
    <section className="relative overflow-hidden bg-indigo-deep px-6 py-32 text-ivory">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 20% 80%, rgba(244,181,77,0.12), transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>Transformation</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5.5rem)] font-medium leading-[1.08]">
              Aligned rhythm.<br /><span className="gold-text italic">Better life.</span>
            </h2>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-ivory/10 bg-ivory/5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.k} delay={i * 0.08}>
              <div className="group h-full bg-indigo-deep p-10 transition-colors hover:bg-ocean">
                <span className="font-serif text-sm italic text-gold/70">Better</span>
                <h3 className="mt-1 font-serif text-4xl font-medium">{it.k}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/60">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DidYouKnow() {
  const facts = [
    "Sleep actively consolidates memory — your brain rehearses the day while you rest.",
    "Chronotype is partly genetic, encoded in genes like PER3 and CLOCK.",
    "REM sleep is when learning is wired in and emotions are processed.",
    "Morning light exposure resets your internal clock and lifts energy.",
    "Sleep deprivation slows reaction time as much as mild intoxication.",
    "Body temperature naturally dips before sleep — a signal to descend.",
  ];
  return (
    <section className="relative overflow-hidden bg-sand px-6 py-32 text-midnight">
      <div className="mx-auto max-w-7xl">
        <Reveal><Eyebrow dark>Did You Know?</Eyebrow></Reveal>
        <Reveal delay={0.1}>
          <h2 className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[1.08]">
            Knowledge worth <span className="italic text-royal">sharing.</span>
          </h2>
        </Reveal>
        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {facts.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1}>
              <div className="group relative overflow-hidden rounded-3xl border border-midnight/10 bg-ivory p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-serif text-5xl font-medium text-gold/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs uppercase tracking-widest text-midnight/40 transition-colors group-hover:text-amber">Share ↗</span>
                </div>
                <p className="font-serif text-2xl leading-snug text-midnight/85">{f}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MythVsFact() {
  const rows = [
    { m: "Everyone should wake at 5 AM to succeed.", f: "Different chronotypes thrive on different schedules. Forcing the wrong one costs performance." },
    { m: "You can fully catch up on sleep at weekends.", f: "Recovery sleep helps, but it cannot fully repay accumulated sleep debt." },
    { m: "More sleep is always better.", f: "Quality and rhythm matter as much as quantity — consistency is king." },
    { m: "Alcohol helps you sleep deeply.", f: "It speeds onset but fragments REM and deep sleep, lowering true recovery." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="relative overflow-hidden bg-elegant px-6 py-32 text-ivory">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <Reveal><Eyebrow className="justify-center">Myth vs Fact</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[1.08]">
              Separate the <span className="gold-text italic">science</span> from the noise.
            </h2>
          </Reveal>
        </div>
        <div className="mt-14 space-y-4">
          {rows.map((r, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full overflow-hidden rounded-3xl border border-ivory/15 bg-ivory/5 text-left backdrop-blur transition-colors hover:bg-ivory/10">
                <div className="flex items-center gap-5 p-7">
                  <span className="rounded-full bg-red-400/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-200">Myth</span>
                  <span className="font-serif text-xl font-medium md:text-2xl">{r.m}</span>
                  <span className={`ml-auto text-2xl transition-transform ${open === i ? "rotate-180 text-gold" : "text-ivory/40"}`}>⌄</span>
                </div>
                <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden">
                  <div className="flex items-start gap-5 border-t border-ivory/10 bg-midnight/30 p-7">
                    <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">Fact</span>
                    <p className="text-lg leading-relaxed text-ivory/80">{r.f}</p>
                  </div>
                </motion.div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
