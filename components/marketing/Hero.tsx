"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CircadianOrbit } from "@/components/CircadianOrbit";

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pt-2 pb-7">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ onStartAssessment }: { onStartAssessment?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });
  const orbitScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const orbitRot = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "138vh" }}
    >
      <div className="absolute inset-0 bg-midnight" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 38%, rgba(53,74,130,0.45), transparent 60%), radial-gradient(circle at 50% 30%, rgba(244,181,77,0.18), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-ivory"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 47) % 100}%`,
              width: i % 4 === 0 ? 2 : 1.2,
              height: i % 4 === 0 ? 2 : 1.2,
              opacity: 0.15 + ((i * 17) % 50) / 100,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ scale: orbitScale, rotate: orbitRot }}
        className="absolute top-[34%] -translate-y-1/2"
      >
        <CircadianOrbit className="h-[90vmin] w-[90vmin] opacity-90" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mt-[-8vh] px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-8 text-[11px] font-semibold uppercase tracking-[0.5em] text-gold/90"
        >
          Sleep Intelligence · Human Performance
        </motion.p>
        <h1 className="font-serif text-[clamp(2.75rem,7.5vw,7rem)] font-medium leading-[1.15] pb-4 text-ivory drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          <Line delay={0.4}>Understand</Line>
          <Line delay={0.55}>
            Your <span className="gold-text italic">Natural Sleep</span>
          </Line>
          <Line delay={0.7}>Rhythm</Line>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ivory/65"
        >
          A living portrait of your biology. Discover your chronotype, decode
          your energy, and design a life aligned to the rhythm written within you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={onStartAssessment}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-7 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.03]"
          >
            <span className="relative z-10">Take Assessment Now</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => document.getElementById("science")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/25 px-7 py-3.5 text-sm font-semibold text-ivory transition-colors hover:bg-ivory hover:text-midnight"
          >
            Explore the Science
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-[8vh] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/40">Begin the descent</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-ivory/25 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="h-1.5 w-1.5 rounded-full bg-gold"
          />
        </span>
      </motion.div>
    </section>
    </>
  );
}
