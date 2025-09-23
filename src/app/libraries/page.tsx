"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import HeroLibrary from "./components/HeroSection";

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState("pelajaran");
  const [isExpanded, setIsExpanded] = useState({
    pelajaran: true,
    fiksi: true,
    agama: true,
  });

  const toggleExpand = (kelas: string) => {
    setIsExpanded((prev) => ({
      ...prev,
      [kelas]: !prev[kelas as keyof typeof prev],
    }));
  };

  const bookcases = {
    pelajaran: "https://fliphtml5.com/bookcase/urghv/",
    fiksi: "https://fliphtml5.com/bookcase/rsdsk/",
    agama: "https://fliphtml5.com/bookcase/dsnge/",
  };

  const getDisplayName = (key: string) => {
    switch (key) {
      case "pelajaran":
        return "Buku Pelajaran";
      case "fiksi":
        return "Buku Fiksi dan Non Fiksi";
      case "agama":
        return "Buku Agama";
      default:
        return key;
    }
  };

  return (
    <>
      <HeroLibrary />

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Rak Buku Digital
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Jelajahi koleksi buku digital untuk setiap kategori. Temukan bacaan
            menarik yang sesuai dengan minat pembelajaran Anda.
          </p>
        </motion.div>

        {/* Bookcase Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-card p-1 rounded-lg shadow-card">
            <TabsTrigger
              value="pelajaran"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
            >
              Buku Pelajaran
            </TabsTrigger>
            <TabsTrigger
              value="fiksi"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
            >
              Buku Fiksi
            </TabsTrigger>
            <TabsTrigger
              value="agama"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
            >
              Buku Agama
            </TabsTrigger>
          </TabsList>

          {/* Bookcase Content */}
          {Object.entries(bookcases).map(([kelas, url]) => (
            <TabsContent key={kelas} value={kelas} className="mt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden border-border shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Header dengan toggle */}
                    <div
                      className="flex items-center justify-between p-6 bg-gradient-soft cursor-pointer"
                      onClick={() => toggleExpand(kelas)}
                    >
                      <h3 className="text-xl font-semibold text-foreground">
                        {getDisplayName(kelas)}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(kelas);
                        }}
                      >
                        {isExpanded[kelas as keyof typeof isExpanded] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>

                    {/* Iframe Content */}
                    <AnimatePresence>
                      {isExpanded[kelas as keyof typeof isExpanded] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "600px", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <iframe
                            src={url}
                            className="w-full h-[600px] border-0"
                            seamless
                            scrolling="no"
                            allowFullScreen
                            loading="lazy"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <Card className="text-center p-6 bg-gradient-card border-border shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Total Buku Tersedia</p>
          </Card>
          <Card className="text-center p-6 bg-gradient-card border-border shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <p className="text-muted-foreground">Kategori Buku</p>
          </Card>
          <Card className="text-center p-6 bg-gradient-card border-border shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <p className="text-muted-foreground">Akses Digital</p>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LibraryPage;
