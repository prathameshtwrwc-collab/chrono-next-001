"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/marketing/Hero";
import { HeroSlider } from "@/components/marketing/HeroSlider";
import { WhySleepMatters, SleepDisorders, ScienceOfSleep } from "@/components/marketing/SectionsEarly";
import { ImageShowcase } from "@/components/marketing/ImageShowcase";
import { ChronotypeDiscovery, WhyChronotypesMatter } from "@/components/marketing/Chronotypes";
import { DailyRhythm, SleepBlueprint, Transformation, DidYouKnow, MythVsFact } from "@/components/marketing/SectionsMid";
import { Corporate, Authority, GlobalImpact } from "@/components/marketing/SectionsLate";
import { FeaturedInsight, EducationalVisual } from "@/components/marketing/Chronotypes";
import { AssessmentModal } from "@/components/AssessmentModal";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Landing() {
  useLenis();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  return (
    <div className="relative bg-midnight">
      <div className="grain" />
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-champagne via-gold to-sunrise" />
      <Navbar onStartAssessment={() => setAssessmentOpen(true)} />
      <main>
        <Hero onStartAssessment={() => setAssessmentOpen(true)} />
        <HeroSlider />
        <WhySleepMatters />
        <SleepDisorders />
        <ScienceOfSleep />
        <ImageShowcase />
        <ChronotypeDiscovery />
        <WhyChronotypesMatter />
        <DailyRhythm />
        <FeaturedInsight />
        <SleepBlueprint />
        <Transformation />
        <DidYouKnow />
        <MythVsFact />
        <EducationalVisual />
        <Corporate />
        <Authority />
        <GlobalImpact />
      </main>
      <Footer />
      <AnimatePresence>
        {assessmentOpen && <AssessmentModal onClose={() => setAssessmentOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
