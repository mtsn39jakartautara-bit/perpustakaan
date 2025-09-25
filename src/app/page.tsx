import AboutSection from "@/components/AboutSection";
import CollectionSection from "@/components/CollectionSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import Footer from "@/components/Footer";
import RulesSection from "@/components/RulesSection";
import AwardSections from "@/components/Award";
import LoginModalHome from "@/components/LoginModalHome";
import { fontWorkSans } from "@/lib/fonts";
import { Suspense } from "react";

export default function Home() {
  const font3 = fontWorkSans.className;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={`min-h-screen font-sans ${font3}`}>
        <LoginModalHome />

        {/* Sections */}
        {/* <HeroSection /> */}
        <AboutSection />
        <CollectionSection />
        <FacilitiesSection />
        <AwardSections />
        <RulesSection />
        <Footer />
      </main>
    </Suspense>
  );
}
