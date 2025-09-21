// components/HeroSection.tsx (update)
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import HeroBaner from "@/components/ui/banner";
import SearchModal from "@/components/SearchModal";
import LoginModal from "@/components/LoginModal";

const HeroLibrary = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <HeroBaner>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Selamat Datang di
            <span className="block text-cream mt-2">Perpustakaan MTsN 39</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl mb-8 text-cream/90 max-w-2xl mx-auto leading-relaxed"
          >
            Tempat terbaik untuk menumbuhkan budaya literasi dan cinta membaca.
            Bergabunglah dengan komunitas pembelajar di pusat pengetahuan kami.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="text-navy-soft font-semibold px-8 py-3 text-lg shadow-hover transition-all duration-300 hover:scale-105"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Jelajahi Koleksi
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-cream border-cream font-semibold px-8 py-3 text-lg hover:bg-cream/10 transition-all duration-300 hover:scale-105"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="mr-2 h-5 w-5" />
              Cari Buku
            </Button>
          </motion.div>
        </div>
      </HeroBaner>

      {/* <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      /> */}
      <LoginModal
        onSwitchToRegister={() => setIsSearchOpen(true)}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default HeroLibrary;
