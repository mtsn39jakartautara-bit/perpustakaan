"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Heart, Clock, Smartphone, Coffee, Users } from "lucide-react";
import { fontPlayFair } from "@/lib/fonts";

const RulesSection = () => {
  const font = fontPlayFair.className;

  const rules = [
    {
      icon: Volume2,
      title: "Menjaga Ketenangan",
      description:
        "Berbicara dengan suara pelan dan menjaga suasana tenang untuk kenyamanan bersama",
    },
    {
      icon: Heart,
      title: "Merawat Buku dengan Baik",
      description:
        "Tidak mencoret, melipat, atau merusak buku dalam bentuk apapun",
    },
    {
      icon: Clock,
      title: "Mengembalikan Tepat Waktu",
      description:
        "Mengembalikan buku sesuai dengan jadwal yang telah ditentukan",
    },
    {
      icon: Smartphone,
      title: "Penggunaan Gadget Bijak",
      description:
        "Menggunakan ponsel dalam mode senyap dan tidak mengganggu aktivitas membaca",
    },
    {
      icon: Coffee,
      title: "Menjaga Kebersihan",
      description:
        "Tidak membawa makanan dan minuman ke area baca, menjaga kebersihan ruangan",
    },
    {
      icon: Users,
      title: "Menghormati Sesama",
      description:
        "Bersikap sopan dan menghormati pengunjung lain serta petugas perpustakaan",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
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
            Tata Tertib Perpustakaan
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            Kami berkomitmen menciptakan lingkungan belajar yang nyaman dan
            kondusif. Mari bersama-sama menjaga perpustakaan sebagai rumah kedua
            kita.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 bg-gradient-card border-0 group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-navy-soft rounded-xl group-hover:bg-navy-light transition-colors duration-300">
                        <rule.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold text-navy-soft mb-2 group-hover:text-navy-light transition-colors ${font}`}
                      >
                        {rule.title}
                      </h3>
                      <p className="text-warm-gray leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-soft-blue/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-navy-soft mb-4">
              Terima Kasih atas Kerja Sama Anda
            </h3>
            <p className="text-warm-gray">
              Dengan mengikuti tata tertib ini, kita bersama-sama menciptakan
              lingkungan perpustakaan yang nyaman dan kondusif untuk semua
              pengunjung.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RulesSection;
