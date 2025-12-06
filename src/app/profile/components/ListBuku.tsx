"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Edit,
  Trash2,
  BookOpen,
  Bookmark,
  Hash,
  User,
  Building,
  MapPin,
  Calendar,
  Copy,
  Eye,
  Loader2,
} from "lucide-react";
import { Book } from "../types";
import EditBookModal from "../components/EditBookModal"; // Import modal

interface ListBukuProps {
  onDelete: (bookId: string) => void;
}

const ListBuku = ({ onDelete }: ListBukuProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch books data
  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  // Filter books based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.bookCode.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/book?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  const handleSaveBook = async (
    bookId: string,
    data: Partial<Book>
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/book/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh book list
        fetchBooks();
        // Show success message
        alert(result.message || "Buku berhasil diperbarui");
        return true; // Return true untuk success
      } else {
        alert(result.error || "Gagal memperbarui buku");
        return false; // Return false untuk failure
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Terjadi kesalahan saat memperbarui buku");
      return false; // Return false untuk error
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) return;

    try {
      const response = await fetch(`/api/admin/book/${bookId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh book list
        fetchBooks();
        alert(result.message || "Buku berhasil dihapus");
      } else {
        alert(result.error || "Gagal menghapus buku");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Terjadi kesalahan saat menghapus buku");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Bisa tambahkan toast notification di sini
  };

  const renderSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </TableCell>
          <TableCell>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, filteredBooks.length)} dari{" "}
        {filteredBooks.length} buku
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          Sebelumnya
        </Button>
        <span className="flex items-center px-3 text-sm">
          Halaman {currentPage} dari {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loading}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Daftar Buku
          </CardTitle>
          <CardDescription>
            Kelola koleksi buku yang tersedia di perpustakaan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari buku berdasarkan judul, kode, penulis, atau ISBN..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchBooks} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          {/* Books Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Kode Buku</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead className="w-[150px]">Penulis</TableHead>
                  <TableHead className="w-[100px]">Stok</TableHead>
                  <TableHead className="w-[120px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  renderSkeleton()
                ) : filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        Tidak ada data buku
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book) => (
                    <TableRow key={book.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {book.bookCode}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(book.bookCode)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{book.title}</div>
                          {book.publisher && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building className="h-3 w-3" />
                              {book.publisher}
                              {book.publishYear && `, ${book.publishYear}`}
                            </div>
                          )}
                          {book.isbn && (
                            <div className="text-xs text-muted-foreground">
                              ISBN: {book.isbn}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {book.author ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {book.author}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            book.stock > 5
                              ? "default"
                              : book.stock > 0
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {book.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              // Navigate to book detail or show modal
                              window.open(`/book/${book.id}`, "_blank");
                            }}
                            title="Lihat detail"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(book)}
                            title="Edit buku"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(book.id)}
                            title="Hapus buku"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && filteredBooks.length > 0 && renderPagination()}

          {/* Book Details Summary */}
          {!loading && filteredBooks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
            >
              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {filteredBooks.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Buku</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded">
                    <Bookmark className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {filteredBooks.reduce((sum, book) => sum + book.stock, 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Stok</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {
                        Array.from(
                          new Set(
                            filteredBooks
                              .map((b) => b.locationRack)
                              .filter(Boolean)
                          )
                        ).length
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">Lokasi Rak</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {
                        Array.from(
                          new Set(
                            filteredBooks
                              .map((b) => b.publishYear)
                              .filter(Boolean)
                          )
                        ).length
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tahun Terbit
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBook(null);
        }}
        book={editingBook}
        onSave={handleSaveBook}
      />
    </>
  );
};

export default ListBuku;
