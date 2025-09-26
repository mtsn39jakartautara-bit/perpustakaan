// app/profile/components/uploadStudentData.tsx
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
} from "lucide-react";

const UploadStudentData = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  // Ref untuk mengakses input file secara langsung
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk menangani pemilihan file
  const handleFileSelect = (file: File) => {
    // Validasi tipe file
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv)$/)
    ) {
      setUploadStatus("error");
      setMessage(
        "Format file tidak didukung. Harap upload file Excel atau CSV."
      );
      return;
    }

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      setMessage("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage("");
  };

  // Fungsi untuk menghapus file yang dipilih dan reset input
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage("");

    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fungsi untuk handle import data dengan API
  const handleImportData = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Menggunakan Fetch API dengan progress tracking
      const xhr = new XMLHttpRequest();

      // Setup progress tracking
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      // Promise wrapper untuk XHR
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

        xhr.open("POST", "/api/admin/student/import-students");
        xhr.responseType = "json";
        xhr.send(formData);
      });

      await uploadPromise;

      // Jika menggunakan fetch biasa (tanpa progress tracking):
      // const res = await fetch("/api/import-students", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   throw new Error(errorData.message || "Upload failed");
      // }

      // const data = await res.json();

      // Simulasi progress untuk demo (jika tidak butuh progress tracking yang real)
      // const progressInterval = setInterval(() => {
      //   setUploadProgress((prev) => {
      //     if (prev >= 90) {
      //       clearInterval(progressInterval);
      //       return 90;
      //     }
      //     return prev + 10;
      //   });
      // }, 200);

      // const res = await fetch("/api/import-students", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!res.ok) {
      //   throw new Error("Upload failed");
      // }

      // const data = await res.json();
      // setUploadProgress(100);

      // Set status sukses
      setUploadStatus("success");
      setMessage("Data berhasil diimport!");

      // Reset setelah delay singkat
      setTimeout(() => {
        handleRemoveFile();
      }, 2000);
    } catch (error) {
      console.error("Error importing data:", error);
      setUploadStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengimport data."
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Fungsi untuk download template
  const downloadTemplate = () => {
    // Logic untuk download template Excel
    const templateUrl = "/templates/student-import-template.xlsx";
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "template-import-siswa.xlsx";
    link.click();
  };

  // Fungsi untuk handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Fungsi untuk prevent default behavior pada drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card className="bg-gradient-card border-border hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          Import Data Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Import data siswa baru dari file Excel atau CSV
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
              id="excel-upload"
              accept=".xlsx, .xls, .csv"
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
                    Format yang didukung: .xlsx, .xls, .csv
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maksimal ukuran file: 10MB
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
                  Import Data
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

export default UploadStudentData;
