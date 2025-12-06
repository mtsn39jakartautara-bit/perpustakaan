"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Save,
  X,
  Book,
  Hash,
  User,
  Building,
  MapPin,
  Calendar,
  Type,
  Barcode,
} from "lucide-react";
import { Book as BookType } from "../types";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookType | null;
  onSave: (bookId: string, data: Partial<BookType>) => Promise<boolean>;
}

const EditBookModal = ({
  isOpen,
  onClose,
  book,
  onSave,
}: EditBookModalProps) => {
  const [formData, setFormData] = useState({
    bookCode: "",
    isbn: "",
    title: "",
    publisher: "",
    author: "",
    locationRack: "",
    publishYear: "",
    stock: "",
    abstract: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when book changes
  useEffect(() => {
    if (book) {
      setFormData({
        bookCode: book.bookCode || "",
        isbn: book.isbn || "",
        title: book.title || "",
        publisher: book.publisher || "",
        author: book.author || "",
        locationRack: book.locationRack || "",
        publishYear: book.publishYear?.toString() || "",
        stock: book.stock?.toString() || "0",
        abstract: book.abstract || "",
      });
      setErrors({});
    }
  }, [book]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookCode.trim()) {
      newErrors.bookCode = "Kode buku wajib diisi";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Judul buku wajib diisi";
    }

    if (formData.publishYear && isNaN(parseInt(formData.publishYear))) {
      newErrors.publishYear = "Tahun terbit harus angka";
    }

    if (
      !formData.stock ||
      isNaN(parseInt(formData.stock)) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Stok harus angka positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!book || !validateForm()) return;

    setLoading(true);

    try {
      const updateData: Partial<BookType> = {
        bookCode: formData.bookCode.trim(),
        isbn: formData.isbn.trim() || null,
        title: formData.title.trim(),
        publisher: formData.publisher.trim() || null,
        author: formData.author.trim() || null,
        locationRack: formData.locationRack.trim() || null,
        publishYear: formData.publishYear
          ? parseInt(formData.publishYear)
          : null,
        stock: parseInt(formData.stock),
        abstract: formData.abstract.trim() || null,
      };

      await onSave(book.id, updateData);
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
      setErrors({ submit: "Gagal menyimpan perubahan" });
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Edit Buku
                </DialogTitle>
                <DialogDescription>
                  Perbarui informasi buku. Semua perubahan akan disimpan ke
                  database.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {/* Error Message */}
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Book Code */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="bookCode"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      Kode Buku *
                    </Label>
                    <Input
                      id="bookCode"
                      name="bookCode"
                      value={formData.bookCode}
                      onChange={handleChange}
                      placeholder="Contoh: F.101.20"
                      className={errors.bookCode ? "border-red-500" : ""}
                    />
                    {errors.bookCode && (
                      <p className="text-xs text-red-500">{errors.bookCode}</p>
                    )}
                  </div>

                  {/* ISBN */}
                  <div className="space-y-2">
                    <Label htmlFor="isbn" className="flex items-center gap-2">
                      <Barcode className="h-4 w-4" />
                      ISBN
                    </Label>
                    <Input
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      placeholder="Contoh: 978-602-03-1234-5"
                    />
                  </div>

                  {/* Title */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Judul Buku *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Masukkan judul buku"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500">{errors.title}</p>
                    )}
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Penulis
                    </Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Nama penulis"
                    />
                  </div>

                  {/* Publisher */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="publisher"
                      className="flex items-center gap-2"
                    >
                      <Building className="h-4 w-4" />
                      Penerbit
                    </Label>
                    <Input
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                      placeholder="Nama penerbit"
                    />
                  </div>

                  {/* Location Rack */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="locationRack"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Lokasi Rak
                    </Label>
                    <Input
                      id="locationRack"
                      name="locationRack"
                      value={formData.locationRack}
                      onChange={handleChange}
                      placeholder="Contoh: Rak A-01"
                    />
                  </div>

                  {/* Publish Year */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="publishYear"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Tahun Terbit
                    </Label>
                    <Input
                      id="publishYear"
                      name="publishYear"
                      value={formData.publishYear}
                      onChange={handleChange}
                      placeholder="Contoh: 2023"
                      type="number"
                      className={errors.publishYear ? "border-red-500" : ""}
                    />
                    {errors.publishYear && (
                      <p className="text-xs text-red-500">
                        {errors.publishYear}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      Stok *
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Jumlah stok"
                      type="number"
                      min="0"
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && (
                      <p className="text-xs text-red-500">{errors.stock}</p>
                    )}
                  </div>
                </div>

                {/* Abstract */}
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstraksi / Deskripsi</Label>
                  <Textarea
                    id="abstract"
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleChange}
                    placeholder="Deskripsi singkat tentang buku..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">ID Buku:</div>
                    <code className="text-xs bg-gray-100 p-1 rounded">
                      {book.id}
                    </code>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">Dibuat:</div>
                    <div>
                      {new Date(book.createdAt).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditBookModal;
