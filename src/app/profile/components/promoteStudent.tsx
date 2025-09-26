import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const PromoteStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleNaikKelas = async () => {
    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/admin/student/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat memproses kenaikan kelas"
        );
      }

      setStatus("success");
      setMessage(data.message || "Kenaikan kelas berhasil diproses!");

      // Reset status setelah 3 detik
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error promoting students:", error);
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses kenaikan kelas"
      );

      // Reset status error setelah 5 detik
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmNaikKelas = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin memproses kenaikan kelas?\n\n" +
          "Tindakan ini akan:\n" +
          "• Menaikkan semua siswa ke kelas berikutnya\n" +
          "• Membuat periode akademik baru\n" +
          "• Mengupdate status semua siswa\n\n" +
          "Proses ini tidak dapat dibatalkan!"
      )
    ) {
      handleNaikKelas();
    }
  };

  return (
    <Card className="bg-gradient-card border-border hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ArrowUp className="h-5 w-5" />
          Naik Kelas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Proses kenaikan kelas untuk periode baru. Semua siswa akan dinaikkan
          ke tingkat berikutnya.
        </p>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: status !== "idle" ? 1 : 0,
            height: status !== "idle" ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-4"
        >
          {status !== "idle" && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                status === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {status === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}
        </motion.div>

        <Button
          onClick={handleConfirmNaikKelas}
          variant="outline"
          className="w-full gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <ArrowUp className="h-4 w-4" />
              Proses Naik Kelas
            </>
          )}
        </Button>

        {/* Additional Information */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 text-sm mb-2">
            Informasi Kenaikan Kelas:
          </h4>
          <ul className="text-xs text-green-600 space-y-1">
            <li>• Siswa akan naik ke tingkat berikutnya secara otomatis</li>
            <li>• Periode akademik baru akan dibuat</li>
            <li>• Data siswa akan diperbarui</li>
            <li>• Pastikan backup data sudah dilakukan</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoteStudent;
