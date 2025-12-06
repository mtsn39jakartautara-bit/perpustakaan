"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  CheckCircle,
  X,
  Download,
  Loader2,
  FileText,
  Book,
} from "lucide-react";

const ImportBuku = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/json",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv|json)$/)
    ) {
      setUploadStatus("error");
      setMessage(
        "Format file tidak didukung. Harap upload file Excel, CSV, atau JSON."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      setMessage("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage("");
    setImportStats(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage("");
    setImportStats(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImportData = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "book");

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        // Update bagian API call di handleImportData
        xhr.open("POST", "/api/admin/book/import");
        xhr.responseType = "json";
        xhr.send(formData);
      });

      const response: any = await uploadPromise;

      setUploadStatus("success");
      setImportStats({
        total: response.total || 0,
        success: response.success || 0,
        failed: response.failed || 0,
      });
      setMessage(response.message || "Data buku berhasil diimport!");

      setTimeout(() => {
        handleRemoveFile();
      }, 3000);
    } catch (error: any) {
      console.error("Error importing book data:", error);
      setUploadStatus("error");
      setMessage(
        error.message || "Terjadi kesalahan saat mengimport data buku."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const templateUrl = "/templates/book-import-template.xlsx";
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "template-import-buku.xlsx";
    link.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card className="bg-gradient-card border-border hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Book className="h-5 w-5" />
          Import Data Buku
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Import data buku baru dari file Excel, CSV, atau JSON. Format kolom
          yang diperlukan: bookCode, isbn, title, publisher, author,
          locationRack, publishYear, stock, abstract
        </p>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg mb-4 ${
              uploadStatus === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : uploadStatus === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-blue-50 border border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {uploadStatus === "success" && (
                <CheckCircle className="h-4 w-4" />
              )}
              {uploadStatus === "error" && <X className="h-4 w-4" />}
              <span className="text-sm">{message}</span>
            </div>

            {/* Import Stats */}
            {importStats && uploadStatus === "success" && (
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold">{importStats.total}</div>
                  <div>Total Data</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {importStats.success}
                  </div>
                  <div>Berhasil</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">
                    {importStats.failed}
                  </div>
                  <div>Gagal</div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* File Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Drag & Drop Zone */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              id="book-upload"
              accept=".xlsx, .xls, .csv, .json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileSelect(file);
                }
              }}
              disabled={isImporting}
            />

            <motion.div
              whileHover={{ scale: isImporting ? 1 : 1.02 }}
              whileTap={{ scale: isImporting ? 1 : 0.98 }}
              onDrop={isImporting ? undefined : handleDrop}
              onDragOver={isImporting ? undefined : handleDragOver}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                isImporting
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                  : "border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div
                  className={`p-3 rounded-full ${
                    isImporting ? "bg-gray-200" : "bg-primary/10"
                  }`}
                >
                  {isImporting ? (
                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                  ) : (
                    <Upload className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isImporting ? "text-gray-500" : "text-foreground"
                    }`}
                  >
                    {isImporting
                      ? "Sedang memproses..."
                      : "Klik untuk upload atau drag & drop file"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: .xlsx, .xls, .csv, .json
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maksimal ukuran: 10MB
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Selected File Info */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: selectedFile ? 1 : 0,
              height: selectedFile ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={isImporting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleImportData}
              disabled={!selectedFile || isImporting}
              className="flex-1 gap-2"
              variant={selectedFile ? "default" : "outline"}
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses... {uploadProgress > 0 && `(${uploadProgress}%)`}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import Buku
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="gap-2"
              disabled={isImporting}
            >
              <Download className="h-4 w-4" />
              Template
            </Button>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: uploadProgress > 0 ? 1 : 0,
              height: uploadProgress > 0 ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress Upload</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ImportBuku;
