"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Reveal, Eyebrow } from "@/components/ui";

const slides = [
  {
    id: "sleep",
    title: "The science of sleep",
    subtitle: "Your body restores, learns, and heals while the world is still.",
    img: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    alt: "Peaceful sleeping person with soft light",
    c: "#f4b54d",
  },
  {
    id: "circadian",
    title: "Circadian biology",
    subtitle: "A 24-hour rhythm coded in your DNA, regulating everything you do.",
    img: "https://images.pexels.com/photos/2693750/pexels-photo-2693750.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    alt: "Morning light through window",
    c: "#e7a95b",
  },
  {
    id: "recovery",
    title: "Recovery through rest",
    subtitle: "Deep sleep triggers growth hormone, repairs tissue, and resets immunity.",
    img: "https://images.pexels.com/photos/1652278/pexels-photo-1652278.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    alt: "Person meditating in sunrise",
    c: "#354a82",
  },
  {
    id: "potential",
    title: "Human potential",
    subtitle: "When rhythm is aligned, every day unlocks more of what you can become.",
    img: "https://images.pexels.com/photos/1476861/pexels-photo-1476861.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    alt: "Mountain vista at dawn",
    c: "#e9e2f5",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 0.95]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => p + 0.5);
      if (progress >= 100) {
        setIndex((i) => (i + 1) % slides.length);
        setProgress(0);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [progress]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section ref={ref} className="relative overflow-hidden bg-midnight px-6 py-24 text-ivory">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow className="justify-center">The Science</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto mb-16 max-w-4xl text-center font-serif text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[1]">
            Where biology meets{" "}
            <span className="italic text-royal">potential.</span>
          </h2>
        </Reveal>

        <div className="relative">
          <div className="mb-8 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => setIndex(i)} className="group relative h-1 w-12 rounded-full" style={{ background: i === index ? s.c : "rgba(255,255,255,0.15)" }}>
                {i === index && (
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: s.c, width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative h-[50vh] min-h-[400px] overflow-hidden rounded-[2.5rem] border border-ivory/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${slides[index].img}')`,
                  backgroundPosition: "center 40%",
                  scale,
                }}
              />
            </AnimatePresence>

            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,16,30,0.85), rgba(8,16,30,0.4), transparent 60%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,16,30,0.85), transparent 50%)" }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute bottom-12 left-12 max-w-lg"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: slides[index].c }}>
                  {slides[index].id}
                </span>
                <h3 className="mt-2 font-serif text-4xl font-medium text-ivory">{slides[index].title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ivory/65">{slides[index].subtitle}</p>
              </motion.div>
            </AnimatePresence>

            <button onClick={prev} className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-ivory/10 text-xl text-ivory/60 transition-colors hover:bg-ivory/20 hover:text-ivory">
              ‹
            </button>
            <button onClick={next} className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-ivory/10 text-xl text-ivory/60 transition-colors hover:bg-ivory/20 hover:text-ivory">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
