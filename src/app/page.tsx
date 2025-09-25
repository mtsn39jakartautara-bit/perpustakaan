"use client";
import AboutSection from "@/components/AboutSection";
import CollectionSection from "@/components/CollectionSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import RulesSection from "@/components/RulesSection";
import AwardSections from "@/components/Award";
import { fontWorkSans } from "@/lib/fonts";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoginModal from "@/components/LoginModal";
import { useSession } from "next-auth/react";

export default function Home() {
  const params = useSearchParams();
  const [isModalLogin, setIsModalLogin] = useState(false);

  const { data } = useSession();
  console.log(data);

  const redirect = params.get("callbackUrl");
  const decodedRedirect = redirect ? decodeURIComponent(redirect) : "/";
  console.log(redirect);
  console.log(decodedRedirect);
  const isLogin = params.get("isLogin");

  // kalau ada salah satu param -> buka modal
  useEffect(() => {
    if (redirect || isLogin === "true") {
      setIsModalLogin(true);
    }
  }, [redirect, isLogin]);

  const font3 = fontWorkSans.className;

  return (
    <main className={`min-h-screen font-sans ${font3}`}>
      {/* Modal Login */}
      <LoginModal
        callbackUrl={decodedRedirect}
        isOpen={isModalLogin}
        onClose={() => setIsModalLogin(false)}
        onSwitchToRegister={() => {
          // contoh: nanti bisa ubah ke register modal
          console.log("Switch ke register");
        }}
      />

      {/* Sections */}
      {/* <HeroSection /> */}
      <AboutSection />
      <CollectionSection />
      <FacilitiesSection />
      <AwardSections />
      <RulesSection />
      <Footer />
    </main>
  );
}
