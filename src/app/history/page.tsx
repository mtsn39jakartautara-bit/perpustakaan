"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Calendar,
  BookOpen,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import HeroLibrary from "./components/HeroHistory";

// Mock data based on your schema
interface BorrowingHistory {
  id: string;
  book: {
    title: string;
    author: string;
  };
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date | null;
  status: "active" | "returned" | "overdue";
}

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "returned" | "overdue"
  >("all");
  const [sortBy, setSortBy] = useState<"borrowedAt" | "dueDate" | "title">(
    "borrowedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [history, setHistory] = useState<BorrowingHistory[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockHistory: BorrowingHistory[] = [
      {
        id: "1",
        book: {
          title: "Matematika Kelas 7",
          author: "Dr. Ahmad Rizali",
        },
        borrowedAt: new Date("2024-01-15"),
        dueDate: new Date("2024-01-29"),
        returnedAt: new Date("2024-01-25"),
        status: "returned",
      },
      {
        id: "2",
        book: {
          title: "IPA Terpadu Kelas 8",
          author: "Prof. Siti Rahayu",
        },
        borrowedAt: new Date("2024-02-01"),
        dueDate: new Date("2024-02-15"),
        returnedAt: null,
        status: "active",
      },
      {
        id: "3",
        book: {
          title: "Sejarah Indonesia Kelas 9",
          author: "Dr. Bambang Sutowo",
        },
        borrowedAt: new Date("2024-01-20"),
        dueDate: new Date("2024-02-03"),
        returnedAt: null,
        status: "overdue",
      },
      {
        id: "4",
        book: {
          title: "Bahasa Indonesia Kelas 7",
          author: "Dra. Maria Ulfa",
        },
        borrowedAt: new Date("2023-12-10"),
        dueDate: new Date("2023-12-24"),
        returnedAt: new Date("2023-12-22"),
        status: "returned",
      },
    ];

    setHistory(mockHistory);
  }, []);

  // Filter and sort history
  const filteredHistory = history
    .filter((item) => {
      const matchesSearch =
        item.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.book.title;
          bValue = b.book.title;
          break;
        case "dueDate":
          aValue = a.dueDate;
          bValue = b.dueDate;
          break;
        case "borrowedAt":
        default:
          aValue = a.borrowedAt;
          bValue = b.borrowedAt;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Aktif
          </Badge>
        );
      case "returned":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Dikembalikan
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Terlambat
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "returned":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Banner dengan tinggi 50vh */}
      <HeroLibrary />
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-card border-border shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {history.length}
              </div>
              <p className="text-muted-foreground">Total Peminjaman</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {history.filter((h) => h.status === "returned").length}
              </div>
              <p className="text-muted-foreground">Telah Dikembalikan</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {history.filter((h) => h.status === "active").length}
              </div>
              <p className="text-muted-foreground">Sedang Dipinjam</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {history.filter((h) => h.status === "overdue").length}
              </div>
              <p className="text-muted-foreground">Terlambat</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-soft p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari judul atau penulis buku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border-border focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                Semua
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Aktif
              </Button>
              <Button
                variant={filterStatus === "returned" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("returned")}
              >
                Dikembalikan
              </Button>
              <Button
                variant={filterStatus === "overdue" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("overdue")}
              >
                Terlambat
              </Button>
            </div>

            {/* Sort Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sortir
            </Button>
          </div>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Book Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg text-foreground">
                            {item.book.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {item.book.author}
                          </p>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Dipinjam: {formatDate(item.borrowedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Jatuh Tempo: {formatDate(item.dueDate)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>

                        {item.returnedAt && (
                          <p className="text-sm text-muted-foreground">
                            Dikembalikan: {formatDate(item.returnedAt)}
                          </p>
                        )}

                        {item.status === "overdue" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200"
                          >
                            Perpanjang Pinjaman
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="border-border text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Tidak ada riwayat peminjaman
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterStatus !== "all"
                    ? "Coba ubah pencarian atau filter Anda"
                    : "Mulai pinjam buku pertama Anda dari perpustakaan"}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;
