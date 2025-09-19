"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Heart, Target } from "lucide-react";
import { fontPlayFair } from "@/lib/fonts";

const AboutSection = () => {
  const font = fontPlayFair.className;

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

  const features = [
    {
      icon: BookOpen,
      title: "Koleksi Lengkap",
      description:
        "Ribuan buku dari berbagai kategori untuk mendukung pembelajaran",
    },
    {
      icon: Users,
      title: "Layanan Prima",
      description:
        "Tim pustakawan profesional siap membantu kebutuhan literasi Anda",
    },
    {
      icon: Heart,
      title: "Lingkungan Nyaman",
      description: "Suasana tenang dan kondusif untuk membaca dan belajar",
    },
    {
      icon: Target,
      title: "Visi Literasi",
      description: "Membangun generasi cerdas dan gemar membaca",
    },
  ];

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
          <h2
            className={`text-3xl md:text-4xl font-bold text-navy-soft mb-6 ${font}`}
          >
            Perpustakaan MTsN 39
          </h2>
          <p className="text-lg text-warm-gray max-w-3xl mx-auto leading-relaxed">
            Perpustakaan MTsN 39 adalah pusat literasi yang menyediakan berbagai
            koleksi buku, layanan informasi, dan ruang baca yang nyaman bagi
            siswa dan guru. Kami berkomitmen untuk menciptakan lingkungan
            pembelajaran yang inspiratif dan mendukung.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-soft-blue rounded-full">
                      <feature.icon className="h-8 w-8 text-navy-soft" />
                    </div>
                  </div>
                  <h3
                    className={`text-xl font-semibold text-navy-soft mb-3 ${font}`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-warm-gray leading-relaxed">
                    {feature.description}
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

export default AboutSection;
