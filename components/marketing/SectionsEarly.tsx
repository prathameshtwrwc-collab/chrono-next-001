"use client";

import { motion } from "framer-motion";
import { Reveal, Eyebrow, Parallax } from "@/components/ui";
import { useState } from "react";

export function WhySleepMatters() {
  const stats = [
    { v: "7–9", u: "hours", d: "of restorative sleep the human body is engineered to require each night." },
    { v: "90–120", u: "minutes", d: "the length of a single sleep cycle as your brain moves through its phases." },
    { v: "4–6", u: "cycles", d: "completed each night — each one deepening recovery and consolidating memory." },
    { v: "1 in 3", u: "adults", d: "live with disrupted sleep, quietly eroding focus, mood and longevity." },
  ];
  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-32 text-midnight">
      <Parallax speed={60} className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-gradient-to-br from-champagne/40 to-transparent blur-3xl"><span /></Parallax>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow dark>Why Sleep Matters</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[1.08]">
                The foundation of
                <br />
                <span className="italic text-royal">human performance.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <p className="text-lg leading-relaxed text-midnight/70">
                Every breakthrough, every recovery, every clear decision begins
                in the dark. Sleep is not downtime — it is the most productive
                biological process you will ever undertake.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-midnight/10 bg-midnight/10 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1} className="bg-ivory">
              <div className="group relative h-full p-9 transition-colors hover:bg-linen">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-6xl font-medium text-midnight">{s.v}</span>
                  <span className="text-sm font-semibold uppercase tracking-widest text-amber">{s.u}</span>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-midnight/60">{s.d}</p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-gold to-sunrise transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SleepDisorders() {
  const disorders = [
    { n: "Insomnia", d: "The mind that will not surrender. Difficulty falling or staying asleep despite the opportunity." },
    { n: "Sleep Apnea", d: "Breath interrupted in the night — repeated pauses that fracture deep, restorative sleep." },
    { n: "Narcolepsy", d: "The boundary between wake and sleep dissolves, pulling rest into the brightest hours." },
    { n: "Bruxism", d: "Tension finds the jaw. Grinding and clenching that quietly drains the body's recovery." },
    { n: "Restless Legs", d: "An irresistible urge to move — the body restless precisely when it seeks stillness." },
    { n: "Parasomnias", d: "Sleepwalking, talking, terrors. The sleeping brain acting out its own hidden theatre." },
    { n: "Hypersomnia", d: "Sleep without satisfaction. Excessive daytime drowsiness no amount of rest resolves." },
  ];
  const [active, setActive] = useState(0);
  return (
    <section className="relative overflow-hidden bg-ocean px-6 py-32 text-ivory">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 80% 20%, rgba(44,61,115,0.6), transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>Sleep Disorders</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="max-w-3xl font-serif text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[1]">
            When your rhythm falls <span className="gold-text italic">out of sync.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-ivory/10 bg-ivory/5 lg:grid-cols-6">
            {[
              "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&h=300&w=400",
              "https://images.pexels.com/photos/1652278/pexels-photo-1652278.jpeg?auto=compress&cs=tinysrgb&h=300&w=400",
              "https://images.pexels.com/photos/2693750/pexels-photo-2693750.jpeg?auto=compress&cs=tinysrgb&h=300&w=400",
            ].map((src, i) => (
              <div key={i} className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url('${src}')` }} />
            ))}
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {disorders.map((d, i) => (
              <Reveal key={d.n} delay={i * 0.05}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-center justify-between gap-6 border-b border-ivory/10 py-6 text-left transition-colors"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-gold/60">0{i + 1}</span>
                    <span
                      className={`font-serif text-3xl font-medium transition-colors md:text-4xl ${
                        active === i ? "text-gold" : "text-ivory/80 group-hover:text-ivory"
                      }`}
                    >
                      {d.n}
                    </span>
                  </span>
                  <span className={`text-2xl transition-transform ${active === i ? "rotate-45 text-gold" : "text-ivory/30"}`}>+</span>
                </button>
              </Reveal>
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-32 rounded-3xl border border-ivory/10 bg-indigo-deep/60 p-10 backdrop-blur">
              <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-royal to-elegant">
                  <span className="h-3 w-3 animate-pulse-glow rounded-full bg-gold" />
                </div>
                <h3 className="font-serif text-4xl font-medium text-gold">{disorders[active].n}</h3>
                <p className="mt-5 text-lg leading-relaxed text-ivory/70">{disorders[active].d}</p>
                <p className="mt-8 text-xs uppercase tracking-[0.3em] text-ivory/40">
                  CHRONOTYPE detects early signatures of disrupted rhythm.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ScienceOfSleep() {
  const phases = [
    { n: "N1 · Drift", c: "#e9e2f5", d: "The threshold. Muscles soften, brainwaves slow, awareness gently releases." },
    { n: "N2 · Settle", c: "#f5d18c", d: "Heart rate and temperature drop. Spindles of activity protect and stabilise sleep." },
    { n: "N3 · Deep", c: "#354a82", d: "Slow-wave restoration. Tissue repairs, growth hormone releases, the body rebuilds." },
    { n: "REM · Dream", c: "#f4b54d", d: "The brain reignites. Memory consolidates, emotion processes, learning takes root." },
  ];
  return (
    <section id="science" className="relative scroll-mt-20 overflow-hidden bg-linen px-6 py-32 text-midnight">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Reveal><Eyebrow dark className="justify-center">The Science of Sleep</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto max-w-4xl font-serif text-[clamp(2.5rem,5.5vw,5.5rem)] font-medium leading-[1]">
              Sleep is <span className="italic text-royal">restoration</span>, written in waves.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-midnight/65">
              Across the night you descend and rise through NREM and REM — each
              phase a distinct act of repair, from cellular renewal to the
              architecture of memory itself.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="relative mt-20 overflow-hidden rounded-3xl border border-midnight/10 bg-ivory p-8">
            <svg viewBox="0 0 1000 260" className="h-56 w-full">
              <defs>
                <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#354a82" />
                  <stop offset="50%" stopColor="#f4b54d" />
                  <stop offset="100%" stopColor="#e7a95b" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((g) => (
                <line key={g} x1="0" y1={50 + g * 55} x2="1000" y2={50 + g * 55} stroke="#0814211a" strokeWidth="1" strokeDasharray="3 6" />
              ))}
              <motion.path
                d="M0,90 C80,40 120,200 200,160 C280,120 320,210 420,190 C520,170 540,60 640,90 C740,120 760,210 860,180 C940,156 980,80 1000,100"
                fill="none"
                stroke="url(#waveStroke)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
              />
              {["Awake", "REM", "Light", "Deep"].map((l, i) => (
                <text key={l} x="8" y={42 + i * 55} fontSize="11" fill="#08142188" fontFamily="Manrope">{l}</text>
              ))}
            </svg>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {phases.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-midnight/10 bg-ivory p-7 transition-all hover:-translate-y-1.5 hover:shadow-xl">
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: p.c, boxShadow: `0 0 14px ${p.c}` }} />
                <h3 className="mt-5 text-lg font-bold">{p.n}</h3>
                <p className="mt-3 text-sm leading-relaxed text-midnight/60">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
