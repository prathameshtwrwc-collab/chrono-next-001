"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { HeroSlider } from "@/components/marketing/HeroSlider";
import { WhySleepMatters } from "@/components/marketing/SectionsEarly";
import { motion, useScroll, useSpring } from "framer-motion";

const SleepDisorders = dynamic(() => import("@/components/marketing/SectionsEarly").then((m) => m.SleepDisorders), { ssr: false });
const ScienceOfSleep = dynamic(() => import("@/components/marketing/SectionsEarly").then((m) => m.ScienceOfSleep), { ssr: false });
const ImageShowcase = dynamic(() => import("@/components/marketing/ImageShowcase").then((m) => m.ImageShowcase), { ssr: false });
const ChronotypeDiscovery = dynamic(() => import("@/components/marketing/Chronotypes").then((m) => m.ChronotypeDiscovery), { ssr: false });
const WhyChronotypesMatter = dynamic(() => import("@/components/marketing/Chronotypes").then((m) => m.WhyChronotypesMatter), { ssr: false });
const DailyRhythm = dynamic(() => import("@/components/marketing/SectionsMid").then((m) => m.DailyRhythm), { ssr: false });
const FeaturedInsight = dynamic(() => import("@/components/marketing/Chronotypes").then((m) => m.FeaturedInsight), { ssr: false });
const SleepBlueprint = dynamic(() => import("@/components/marketing/SectionsMid").then((m) => m.SleepBlueprint), { ssr: false });
const Transformation = dynamic(() => import("@/components/marketing/SectionsMid").then((m) => m.Transformation), { ssr: false });
const DidYouKnow = dynamic(() => import("@/components/marketing/SectionsMid").then((m) => m.DidYouKnow), { ssr: false });
const MythVsFact = dynamic(() => import("@/components/marketing/SectionsMid").then((m) => m.MythVsFact), { ssr: false });
const EducationalVisual = dynamic(() => import("@/components/marketing/Chronotypes").then((m) => m.EducationalVisual), { ssr: false });
const Corporate = dynamic(() => import("@/components/marketing/SectionsLate").then((m) => m.Corporate), { ssr: false });
const Authority = dynamic(() => import("@/components/marketing/SectionsLate").then((m) => m.Authority), { ssr: false });
const GlobalImpact = dynamic(() => import("@/components/marketing/SectionsLate").then((m) => m.GlobalImpact), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then((m) => m.Footer), { ssr: false });
const AssessmentModal = dynamic(() => import("@/components/AssessmentModal").then((m) => m.AssessmentModal), { ssr: false });

function SectionFallback() {
  return <div className="h-32 bg-midnight" />;
}

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
        <Suspense fallback={<SectionFallback />}><SleepDisorders /></Suspense>
        <Suspense fallback={<SectionFallback />}><ScienceOfSleep /></Suspense>
        <Suspense fallback={<SectionFallback />}><ImageShowcase /></Suspense>
        <Suspense fallback={<SectionFallback />}><ChronotypeDiscovery /></Suspense>
        <Suspense fallback={<SectionFallback />}><WhyChronotypesMatter /></Suspense>
        <Suspense fallback={<SectionFallback />}><DailyRhythm /></Suspense>
        <Suspense fallback={<SectionFallback />}><FeaturedInsight /></Suspense>
        <Suspense fallback={<SectionFallback />}><SleepBlueprint /></Suspense>
        <Suspense fallback={<SectionFallback />}><Transformation /></Suspense>
        <Suspense fallback={<SectionFallback />}><DidYouKnow /></Suspense>
        <Suspense fallback={<SectionFallback />}><MythVsFact /></Suspense>
        <Suspense fallback={<SectionFallback />}><EducationalVisual /></Suspense>
        <Suspense fallback={<SectionFallback />}><Corporate /></Suspense>
        <Suspense fallback={<SectionFallback />}><Authority /></Suspense>
        <Suspense fallback={<SectionFallback />}><GlobalImpact /></Suspense>
      </main>
      <Suspense fallback={null}><Footer /></Suspense>
      <AnimatePresence>
        {assessmentOpen && <Suspense fallback={null}><AssessmentModal onClose={() => setAssessmentOpen(false)} /></Suspense>}
      </AnimatePresence>
    </div>
  );
}
