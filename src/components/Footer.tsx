"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      content:
        "J1. H. Amsir No. 71 Sunter Jaya - Tanjung Priok Jakarta Utara 14350",
    },
    {
      icon: Phone,
      title: "Telepon",
      content: "(021) 65837045",
    },
    {
      icon: Mail,
      title: "Email",
      content: "perpustakaan@mtsn39.sch.id",
    },
    {
      icon: Clock,
      title: "Jam Buka",
      content: "Senin - Jumat: 07.00 - 16.00",
    },
  ];

  return (
    <footer className="bg-primary text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-cream/10 rounded-full">
                  <info.icon className="h-6 w-6 text-cream" />
                </div>
              </div>
              <h3 className="font-semibold text-cream mb-2">{info.title}</h3>
              <p className="text-cream/80 text-sm">{info.content}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-cream/20 pt-8 text-center"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-cream mb-2">
              Perpustakaan MTsN 39
            </h2>
            <p className="text-cream/80 max-w-2xl mx-auto">
              Membangun generasi cerdas dan gemar membaca melalui layanan
              perpustakaan yang modern dan berkualitas.
            </p>
          </div>

          <div className="text-cream/60 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Perpustakaan MTsN 39. Semua hak
              cipta dilindungi.
            </p>
            <p className="mt-2">
              Dikembangkan dengan ❤️ untuk kemajuan literasi
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
