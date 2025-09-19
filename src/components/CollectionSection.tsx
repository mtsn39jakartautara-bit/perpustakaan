"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Sparkles,
  FileText,
  Newspaper,
  Download,
  Smartphone,
} from "lucide-react";
import { fontPlayFair } from "@/lib/fonts";

const CollectionSection = () => {
  const font = fontPlayFair.className;

  const collections = [
    {
      icon: BookOpen,
      title: "Buku Pelajaran",
      description:
        "Koleksi lengkap buku mata pelajaran sesuai kurikulum terbaru",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Sparkles,
      title: "Buku Fiksi",
      description:
        "Novel, cerpen, dan karya sastra untuk mengembangkan imajinasi",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: FileText,
      title: "Jurnal Ilmiah",
      description: "Publikasi akademik dan penelitian untuk referensi mendalam",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Newspaper,
      title: "Majalah & Koran",
      description: "Informasi terkini dan artikel menarik dari berbagai topik",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Download,
      title: "Layanan Peminjaman",
      description: "Sistem peminjaman modern dengan tracking yang mudah",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Smartphone,
      title: "Layanan Digital",
      description: "E-book, audiobook, dan konten digital interaktif",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <section className="py-20 px-4 bg-background">
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
            Koleksi & Layanan
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            Temukan beragam koleksi dan layanan yang kami sediakan untuk
            mendukung perjalanan literasi dan pembelajaran Anda.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {collections.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300 bg-gradient-card border-0 group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div
                      className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${item.color}`}
                    >
                      <item.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3
                    className={`text-xl font-semibold text-navy-soft mb-4 group-hover:text-navy-light transition-colors ${font}`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionSection;
