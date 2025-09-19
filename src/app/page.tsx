"use client";
import AboutSection from "@/components/AboutSection";
import AwardsSection from "@/components/AwardsSection";
import CollectionSection from "@/components/CollectionSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import RulesSection from "@/components/RulesSection";
import AwardSections from "@/components/Award";
import { FontGorditas, fontPlayFair, fontWorkSans } from "@/lib/fonts";

export default function Home() {
  const font = fontPlayFair.className;
  const font2 = FontGorditas.className;
  const font3 = fontWorkSans.className;
  return (
    <main className={`min-h-screen font-sans ${font3}`}>
      <HeroSection />
      <AboutSection />
      <CollectionSection />
      <FacilitiesSection />
      {/* <AwardsSection /> */}
      <AwardSections />
      <RulesSection />
      <Footer />
    </main>
  );
}
