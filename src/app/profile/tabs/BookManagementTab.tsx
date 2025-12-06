// app/profile/tabs/BookManagementTab.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookCheck,
  BookOpen,
  CheckCircle,
  Upload,
  List,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ImportBuku from "../components/ImportBuku";
import ListBuku from "../components/ListBuku";
import { Book } from "../types";

const BookManagementTab = () => {
  const [activeSection, setActiveSection] = useState<"import" | "list">("list");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    // Bisa buka modal atau form edit di sini
    alert(
      `Edit buku: ${book.title}\nID: ${book.id}\n\n(Silahkan implement form edit)`
    );
  };

  const handleDeleteBook = (bookId: string) => {
    console.log("Delete book with ID:", bookId);
    // Delete logic sudah dihandle di ListBuku component
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookCheck className="h-5 w-5" />
            Management Buku
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Toggle Buttons */}
          <div className="flex gap-3">
            <Button
              variant={activeSection === "list" ? "default" : "outline"}
              onClick={() => setActiveSection("list")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Daftar Buku
            </Button>
            <Button
              variant={activeSection === "import" ? "default" : "outline"}
              onClick={() => setActiveSection("import")}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import Buku
            </Button>
          </div>

          {/* Content based on active section */}
          {activeSection === "import" ? (
            <ImportBuku />
          ) : (
            <ListBuku onDelete={handleDeleteBook} />
          )}
        </CardContent>

        {/* Quick Actions */}
        <CardContent className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Tambah Buku Manual</h4>
                    <p className="text-sm text-muted-foreground">
                      Tambah buku satu per satu
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Tambah
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Export data buku ke Excel
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded">
                    <BookCheck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Backup Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Backup data buku
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <BookCheck className="h-4 w-4" />
                    Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookManagementTab;
