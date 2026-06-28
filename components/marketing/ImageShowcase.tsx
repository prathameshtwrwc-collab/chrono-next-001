"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Reveal, Eyebrow } from "@/components/ui";

const visuals = [
  {
    id: "cycles",
    title: "Sleep Cycle Architecture",
    img: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
    alt: "Sleep cycle visualization",
    c: "#f4b54d",
  },
  {
    id: "light",
    title: "Light & Circadian Rhythm",
    img: "https://images.pexels.com/photos/2693750/pexels-photo-2693750.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
    alt: "Morning light exposure",
    c: "#e7a95b",
  },
  {
    id: "recovery",
    title: "Recovery Biology",
    img: "https://images.pexels.com/photos/1652278/pexels-photo-1652278.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
    alt: "Deep rest and recovery",
    c: "#354a82",
  },
];

export function ImageShowcase() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section className="relative overflow-hidden bg-linen px-6 py-28 text-midnight">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow dark className="justify-center">Visual Insights</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto mb-14 max-w-3xl text-center font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1]">
            Science made <span className="italic text-royal">visible.</span>
          </h2>
        </Reveal>

        <div className="relative">
          <div className="mb-8 flex justify-center gap-3">
            {visuals.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-10" : "w-2.5 bg-midnight/20 hover:bg-midnight/40"}`}
                style={{ background: active === i ? visuals[i].c : undefined }}
              />
            ))}
          </div>

          <motion.div style={{ y }} className="relative h-[50vh] min-h-[320px] max-h-[500px] overflow-hidden rounded-[2rem] border border-midnight/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${visuals[active].img}')` }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-ivory/90 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ivory/80 via-transparent to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`txt-${active}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute bottom-10 left-10 max-w-sm"
              >
                <p className="font-serif text-3xl font-medium text-midnight">{visuals[active].title}</p>
                <p className="mt-2 text-sm text-midnight/55">Research-backed insights for daily practice.</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
