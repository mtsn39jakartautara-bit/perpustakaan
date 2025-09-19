"use client";
import React from "react"; //
import { motion } from "framer-motion";
import { Button } from "./button";
import { BookOpen, MapPin } from "lucide-react";

const HeroBaner = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={"/assets/library-hero.jpg"}
          alt="Perpustakaan MTsN 39"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>

      {/* Content */}
      {children}

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-20 left-10 w-20 h-20 border border-cream rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute bottom-32 right-16 w-16 h-16 border border-cream rounded-full"
      />
    </section>
  );
};

export default HeroBaner;
