"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  X,
  Book,
  User,
  Calendar,
  ArrowRight,
  Filter,
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: number;
  title: string;
  author: string;
  category: string;
  kelas: string;
  thumbnail: string;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - replace with actual API call
  const sampleBooks: SearchResult[] = [
    {
      id: 1,
      title: "Matematika Kelas 7",
      author: "Dr. Ahmad Rizali",
      category: "Matematika",
      kelas: "7",
      thumbnail: "/api/placeholder/80/120",
    },
    {
      id: 2,
      title: "IPA Terpadu Kelas 8",
      author: "Prof. Siti Rahayu",
      category: "Ilmu Pengetahuan Alam",
      kelas: "8",
      thumbnail: "/api/placeholder/80/120",
    },
    {
      id: 3,
      title: "Sejarah Indonesia Kelas 9",
      author: "Dr. Bambang Sutowo",
      category: "Sejarah",
      kelas: "9",
      thumbnail: "/api/placeholder/80/120",
    },
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const filteredResults = sampleBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filteredResults);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 backdrop-blur-sm z-50  p-4 bg-background/50"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              x: "-50%",
              y: "-50%",
              clipPath: "circle(0% at 50% 50%)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              clipPath: "circle(100% at 50% 50%)",
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              clipPath: "circle(0% at 50% 50%)",
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="absolute top-[40%] left-1/2 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden bg-gradient-soft"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Search Header */}
            <div className="p-6 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Cari buku berdasarkan judul, penulis, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-border focus:ring-2 focus:ring-ring w-[calc(100%-3rem)]"
                  autoFocus
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 gap-2"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Mencari...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((book) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-border hover:shadow-hover transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-16 h-24 bg-muted rounded-lg flex items-center justify-center">
                            <Book className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {book.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {book.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Book className="h-4 w-4" />
                                {book.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Kelas {book.kelas}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Coba dengan kata kunci yang berbeda
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Ketik minimal 3 karakter untuk mulai mencari
                  </p>
                </div>
              )}
            </div>

            {/* Quick Categories */}
            <div className="p-6 border-t border-border bg-muted/20">
              <h4 className="font-semibold text-foreground mb-3">
                Kategori Populer
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Matematika", "IPA", "IPS", "Bahasa", "Sejarah", "Seni"].map(
                  (category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      className="rounded-full border-border hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setSearchQuery(category)}
                    >
                      {category}
                    </Button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
