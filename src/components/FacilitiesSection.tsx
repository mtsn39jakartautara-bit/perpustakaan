"use client";

import { fontPlayFair } from "@/lib/fonts";
import { motion } from "framer-motion";
import { Armchair, Monitor, Wifi, Layers, Coffee } from "lucide-react";

const FacilitiesSection = () => {
  const font = fontPlayFair.className;

  const facilities = [
    {
      icon: Armchair,
      title: "Ruang Baca Nyaman",
      description: "Area baca dengan kursi ergonomis dan pencahayaan optimal",
    },
    {
      icon: Monitor,
      title: "Area Multimedia",
      description:
        "Ruang khusus dengan peralatan audio visual untuk pembelajaran",
    },
    {
      icon: Wifi,
      title: "Komputer & Internet",
      description: "Akses internet gratis dan komputer untuk riset online",
    },
    {
      icon: Layers,
      title: "Rak Buku Modern",
      description:
        "Sistem penyimpanan buku yang terorganisir dan mudah diakses",
    },
    {
      icon: Coffee,
      title: "Pojok Literasi",
      description: "Area santai untuk diskusi dan kegiatan literasi bersama",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-20 px-4 bg-soft-blue/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-3xl md:text-4xl font-bold text-navy-soft mb-6 ${font}`}
          >
            Fasilitas Unggulan
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            Nikmati berbagai fasilitas modern yang dirancang untuk memberikan
            pengalaman belajar dan membaca yang optimal.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {facilities.map((facility, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-white/50">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-navy-soft rounded-2xl group-hover:bg-navy-light transition-colors duration-300">
                    <facility.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3
                  className={`text-xl font-semibold text-navy-soft mb-4 text-center group-hover:text-navy-light transition-colors ${font}`}
                >
                  {facility.title}
                </h3>
                <p className="text-warm-gray text-center leading-relaxed">
                  {facility.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
