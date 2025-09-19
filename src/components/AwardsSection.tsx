"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, Award } from "lucide-react";

const AwardsSection = () => {
  const awards = [
    {
      name: "Ahmad Fadli",
      role: "Siswa Kelas IX-A",
      achievement: "Pembaca Terbanyak",
      books: "47 buku",
      avatar: "/placeholder.svg",
      month: "Februari 2024",
    },
    {
      name: "Siti Nurhaliza",
      role: "Siswa Kelas VIII-B",
      achievement: "Pengunjung Terlama",
      books: "120 jam",
      avatar: "/placeholder.svg",
      month: "Februari 2024",
    },
    {
      name: "Pak Wahyu",
      role: "Guru Bahasa Indonesia",
      achievement: "Pembimbing Literasi Terbaik",
      books: "15 program",
      avatar: "/placeholder.svg",
      month: "Februari 2024",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, rotateY: -15 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-20 px-4 bg-gradient-soft">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-soft mb-6">
            Penghargaan Bulanan
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            Apresiasi untuk siswa dan guru yang paling rajin mengunjungi
            perpustakaan dan aktif dalam kegiatan literasi.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {awards.map((award, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="relative overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 bg-gradient-card border-0">
                {/* Award Badge */}
                <div className="absolute top-4 right-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Star className="h-5 w-5 text-yellow-600 fill-current" />
                  </div>
                </div>

                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <Avatar className="h-20 w-20 border-4 border-soft-blue">
                      <AvatarImage src={award.avatar} alt={award.name} />
                      <AvatarFallback className="bg-navy-soft text-white text-xl font-semibold">
                        {award.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <h3 className="text-xl font-bold text-navy-soft mb-2">
                    {award.name}
                  </h3>
                  <p className="text-warm-gray mb-4 text-sm">{award.role}</p>

                  <div className="mb-4 p-4 bg-soft-blue/30 rounded-xl">
                    <div className="flex justify-center mb-2">
                      <Award className="h-6 w-6 text-navy-soft" />
                    </div>
                    <p className="font-semibold text-navy-soft mb-1">
                      {award.achievement}
                    </p>
                    <p className="text-2xl font-bold text-navy-light">
                      {award.books}
                    </p>
                  </div>

                  <div className="text-xs text-warm-gray bg-muted/50 rounded-full px-3 py-1 inline-block">
                    {award.month}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AwardsSection;
