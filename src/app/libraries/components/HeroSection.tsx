"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import HeroBaner from "@/components/ui/banner";

const HeroLibrary = () => {
  return (
    <HeroBaner>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          Rak Buku Pelajaran
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl mb-8 text-cream/90 max-w-2xl mx-auto leading-relaxed"
        >
          Temukan buku pelajaran sesuai kelasmu dengan mudah. Mulai dari
          Matematika, IPA, Bahasa, hingga pelajaran lainnya — semua tersedia
          untuk mendukung kegiatan belajarmu setiap hari.
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
            Lihat Buku Pelajaran
          </Button>
        </motion.div>
      </div>
    </HeroBaner>
  );
};

export default HeroLibrary;
