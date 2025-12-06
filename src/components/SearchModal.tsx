"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Book,
  User,
  Calendar,
  Filter,
  Hash,
  Building,
  MapPin,
  BookOpen,
} from "lucide-react";
import { Book as BookType } from "@/app/profile/types"; // Import tipe Book Anda

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    searchBy: "title", // 'title', 'author', 'isbn', 'bookCode', 'publisher'
  });

  // Fetch books based on search query
  useEffect(() => {
    if (searchQuery.length > 2) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery, searchFilters]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/book?search=${encodeURIComponent(searchQuery)}&limit=20`
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data.books || []);
      }
    } catch (error) {
      console.error("Error searching books:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Clear search when modal opens
      setSearchQuery("");
      setResults([]);
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

  const formatYear = (year: number | null) => {
    return year ? year.toString() : "Tidak diketahui";
  };

  const getStockStatus = (stock: number) => {
    if (stock > 5) return { label: "Tersedia", variant: "default" as const };
    if (stock > 0) return { label: "Terbatas", variant: "secondary" as const };
    return { label: "Habis", variant: "destructive" as const };
  };

  const handleBookClick = (bookId: string) => {
    // Navigate to book detail page or open book detail modal
    console.log("Book clicked:", bookId);
    // window.open(`/book/${bookId}`, "_blank"); // Uncomment untuk buka di tab baru
    // Atau buka modal detail buku
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 backdrop-blur-sm z-50 p-4 bg-background/50"
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
                  placeholder="Cari buku berdasarkan judul, penulis, ISBN, atau kode buku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-border focus:ring-2 focus:ring-ring w-[calc(100%-3rem)]"
                  autoFocus
                />
                <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <select
                    value={searchFilters.searchBy}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        searchBy: e.target.value,
                      })
                    }
                    className="text-sm bg-transparent border-none focus:outline-none focus:ring-0"
                  >
                    <option value="title">Judul</option>
                    <option value="author">Penulis</option>
                    <option value="isbn">ISBN</option>
                    <option value="bookCode">Kode Buku</option>
                    <option value="publisher">Penerbit</option>
                  </select>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Mencari buku...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((book) => {
                    const stockStatus = getStockStatus(book.stock);
                    return (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className="border-border hover:shadow-hover transition-all duration-300 cursor-pointer group"
                          onClick={() => handleBookClick(book.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {/* Book Icon/Thumbnail */}
                              <div className="w-16 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                                <Book className="h-8 w-8 text-primary" />
                              </div>

                              {/* Book Info */}
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {book.title}
                                    </h3>
                                    {book.author && (
                                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {book.author}
                                      </p>
                                    )}
                                  </div>
                                  <Badge variant={stockStatus.variant}>
                                    {stockStatus.label} ({book.stock})
                                  </Badge>
                                </div>

                                {/* Book Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                                  {/* Left Column */}
                                  <div className="space-y-1">
                                    {book.bookCode && (
                                      <div className="flex items-center gap-2">
                                        <Hash className="h-3 w-3 text-muted-foreground" />
                                        <span className="font-mono text-xs">
                                          {book.bookCode}
                                        </span>
                                      </div>
                                    )}
                                    {book.isbn && (
                                      <div className="flex items-center gap-2">
                                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                                        <span>ISBN: {book.isbn}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right Column */}
                                  <div className="space-y-1">
                                    {book.publisher && (
                                      <div className="flex items-center gap-2">
                                        <Building className="h-3 w-3 text-muted-foreground" />
                                        <span>{book.publisher}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3 text-muted-foreground" />
                                      <span>
                                        Tahun: {formatYear(book.publishYear)}
                                      </span>
                                    </div>
                                    {book.locationRack && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span>Rak: {book.locationRack}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Abstract Preview */}
                                {book.abstract && (
                                  <div className="mt-3">
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {book.abstract}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Tidak ditemukan buku untuk &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Coba dengan kata kunci yang berbeda atau filter lainnya
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Ketik minimal 3 karakter untuk mulai mencari buku
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground space-y-1">
                    <p>📚 Cari berdasarkan: Judul, Penulis, atau ISBN</p>
                    <p>🔍 Gunakan filter untuk hasil yang lebih spesifik</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Categories / Popular Publishers */}
            <div className="p-6 border-t border-border bg-muted/20">
              <h4 className="font-semibold text-foreground mb-3">
                Penerbit Populer
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Erlangga",
                  "Gramedia",
                  "Yudhistira",
                  "Grasindo",
                  "Mizan",
                  "Informatika",
                ].map((publisher) => (
                  <Button
                    key={publisher}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSearchQuery(publisher)}
                  >
                    {publisher}
                  </Button>
                ))}
              </div>

              {/* Statistics */}
              {results.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span>Menampilkan {results.length} buku</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>
                        Total stok:{" "}
                        {results.reduce((sum, book) => sum + book.stock, 0)}
                      </span>
                      <span>
                        Tahun terbit:{" "}
                        {
                          Array.from(
                            new Set(
                              results.map((b) => b.publishYear).filter(Boolean)
                            )
                          ).length
                        }{" "}
                        tahun berbeda
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
