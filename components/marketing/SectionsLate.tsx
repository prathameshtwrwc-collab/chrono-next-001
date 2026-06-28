"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, Eyebrow, GoldButton, GhostButton } from "@/components/ui";
import { CircadianOrbit } from "@/components/CircadianOrbit";

export function Corporate() {
  const outcomes = [
    { v: "−38%", l: "Burnout", d: "Measurable reduction in reported exhaustion." },
    { v: "+27%", l: "Productivity", d: "Output gains from rhythm-aligned scheduling." },
    { v: "+41%", l: "Engagement", d: "Teams more present, energised and motivated." },
    { v: "+33%", l: "Retention", d: "People stay where their wellbeing is valued." },
  ];
  return (
    <section id="corporate" className="relative scroll-mt-20 overflow-hidden bg-stone px-6 py-32 text-midnight">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal><Eyebrow dark>Corporate Wellbeing</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[1.08]">
                Better teams start with <span className="italic text-royal">better sleep.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-midnight/65">
                Fatigue is the silent tax on every organisation. CHRONOTYPE equips
                your people with the science of their own rhythm — and gives
                leaders a clear view of collective wellbeing.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-9 flex flex-wrap gap-3">
                {["Wellbeing programs", "Team dashboards", "Anonymous insights", "Leadership reports"].map((t) => (
                  <span key={t} className="rounded-full border border-midnight/15 px-4 py-2 text-sm font-medium text-midnight/70">{t}</span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4}><div className="mt-9"><GoldButton to="/admin">Explore for Teams</GoldButton></div></Reveal>
          </div>
          <div className="lg:col-span-6 lg:mt-0 mt-12">
            <div className="grid grid-cols-2 gap-5">
              {outcomes.map((o, i) => (
                <Reveal key={o.l} delay={i * 0.1}>
                  <div className="group rounded-3xl border border-midnight/10 bg-ivory p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <p className="font-serif text-5xl font-medium text-royal">{o.v}</p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-widest text-amber">{o.l}</p>
                    <p className="mt-2 text-sm leading-relaxed text-midnight/55">{o.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-12 mt-12 lg:hidden">
            <Reveal>
              <div className="aspect-video overflow-hidden rounded-[2rem] border border-midnight/10 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.pexels.com/photos/3184320/pexels-photo-3184320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800')" }} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Authority() {
  const stats = [
    { v: "50+", l: "Years of Experience" }, { v: "5", l: "Generations of Legacy" },
    { v: "50,000+", l: "Cases Studied" }, { v: "4.5M+", l: "Patients Reached" },
    { v: "500+", l: "Seminars Delivered" }, { v: "108", l: "Countries Touched" },
  ];
  return (
    <section id="authority" className="relative scroll-mt-20 overflow-hidden bg-midnight px-6 py-32 text-ivory">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30">
        <CircadianOrbit className="absolute -right-1/4 top-1/2 h-[120%] w-[120%] -translate-y-1/2" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>Authority & Leadership</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5.5rem)] font-medium leading-[1.08]">
              Decades of <span className="gold-text italic">healthcare leadership.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-7 text-lg leading-relaxed text-ivory/65">
              CHRONOTYPE is built on a lineage of medical and scientific stewardship —
              five generations devoted to human health, now translated into the
              language of modern performance.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-ivory/10 bg-ivory/5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="bg-midnight/60 p-10 backdrop-blur transition-colors hover:bg-ocean/60">
                <p className="font-serif text-6xl font-medium text-gold">{s.v}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-ivory/55">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <blockquote className="mt-16 max-w-3xl border-l-2 border-gold pl-8 font-serif text-3xl font-medium italic leading-snug text-ivory/85">
            “We have spent a century learning how the body heals. Sleep was always
            the first medicine.”
            <footer className="mt-5 text-sm not-italic uppercase tracking-widest text-gold/70">— The CHRONOTYPE Scientific Council</footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

export function GlobalImpact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "end start"] });
  const orbitScale = useTransform(scrollYProgress, [0, 1], [0.7, 1.3]);
  const orbitY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-ivory" style={{ background: "linear-gradient(180deg, #e9ded4 0%, #354a82 35%, #10203b 70%, #081421 100%)" }}>
      <motion.div style={{ scale: orbitScale, y: orbitY }} className="pointer-events-none absolute top-1/2 -translate-y-1/2">
        <CircadianOrbit className="h-[100vmin] w-[100vmin] opacity-60" />
      </motion.div>
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Reveal><p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.5em] text-gold">Global Impact</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-[clamp(3rem,8vw,7rem)] font-medium leading-[1.08]">
            <span className="block text-midnight/80">Better Sleep.</span>
            <span className="block text-ivory">Better Humans.</span>
            <span className="gold-text block italic">Better Future.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-9 max-w-xl text-lg leading-relaxed text-ivory/70">
            A movement spanning 108 countries and millions of lives — reuniting
            humanity with the rhythm it was born to keep.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GoldButton to="/app">Discover Your Blueprint</GoldButton>
            <GhostButton to="/admin">For Organizations</GhostButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
