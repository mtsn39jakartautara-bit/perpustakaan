import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, MapPin } from "lucide-react";
import HeroBaner from "./ui/banner";
import { useSession } from "next-auth/react";

const HeroSection = () => {
  const { status } = useSession();

  return (
    <HeroBaner>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
        >
          Selamat Datang di
          <span className="block text-cream mt-2">
            Perpustakaan Asy-Syifa Binti Abdillah MTsN 39 Jakarta
          </span>
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
          className="flex flex-col sm:flex-row gap-4 justify-center items-center "
        >
          <Button
            onClick={() =>
              (window.location.href = `${
                status === "authenticated"
                  ? "/libraries"
                  : "?callbackUrl=%252Flibraries&isLogin=false"
              }`)
            }
            size="lg"
            variant={"default"}
            className="border border-white"
          >
            <BookOpen className="mr-2 h-5 w-5 dura" />
            Jelajahi Rak Buku
          </Button>
          <Button
            onClick={() =>
              window.open("https://buku.kemendikdasmen.go.id/", "_blank")
            }
            size="lg"
            variant="outline"
          >
            <BookOpen className="mr-2 h-5 w-5 dura" />
            Buku Sekolah Elektronik
          </Button>
        </motion.div>
      </div>
    </HeroBaner>
  );
};

export default HeroSection;
