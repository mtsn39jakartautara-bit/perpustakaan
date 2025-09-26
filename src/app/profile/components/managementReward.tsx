"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Calculator, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const ManagementReward = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [activePeriod, setActivePeriod] = useState(null) as any;
  const [totalPoints, setTotalPoints] = useState(0);
  const [userCount, setUserCount] = useState(0);

  // Fetch data periode aktif dan total poin
  useEffect(() => {
    fetchActivePeriodData();
  }, []);

  const fetchActivePeriodData = async () => {
    try {
      const res = await fetch("/api/admin/student/reward/active-reward");

      console.log(res);
      const data = await res.json();

      if (res.ok) {
        setActivePeriod(data.activePeriod);
        setTotalPoints(data.totalPoints);
        setUserCount(data.userCount);
      }
    } catch (error) {
      console.error("Error fetching active period data:", error);
    }
  };

  const handleHitungReward = async () => {
    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/admin/student/reward/restart-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat menghitung reward"
        );
      }

      setStatus("success");
      setMessage(data.message || "Reward berhasil dihitung!");

      // Refresh data setelah perhitungan
      setTimeout(() => {
        fetchActivePeriodData();
      }, 1000);

      // Reset status setelah 3 detik
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error calculating rewards:", error);
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghitung reward"
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

  const handleConfirmHitungReward = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghitung reward periode aktif?\n\n" +
          "Tindakan ini akan:\n" +
          "• Menghitung total poin semua siswa\n" +
          "• Menentukan pemenang reward\n" +
          "• Mengupdate status reward\n" +
          "• Mengirim notifikasi ke siswa\n\n" +
          "Pastikan semua data sudah valid sebelum melanjutkan!"
      )
    ) {
      handleHitungReward();
    }
  };

  console.log(activePeriod);

  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Management Reward
        </CardTitle>
      </CardHeader>
      <CardContent>
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

        <div className="text-center p-6 bg-gradient-card rounded-lg mb-6">
          <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            Kalkulasi Reward Periode Aktif
          </h3>
          <p className="text-muted-foreground mb-4">
            Hitung semua reward untuk periode yang sedang aktif
          </p>
          <Button
            onClick={handleConfirmHitungReward}
            size="lg"
            disabled={isLoading || !activePeriod}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menghitung...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Hitung Reward Periode Aktif
              </>
            )}
          </Button>

          {!activePeriod && (
            <p className="text-sm text-red-500 mt-2">
              Tidak ada periode aktif yang ditemukan
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Periode Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              {activePeriod ? (
                <>
                  <p className="font-semibold">{activePeriod.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Dibuat pada</p>
                    <p className="text-sm ">
                      {new Date(activePeriod.startDate).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">Memuat data...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Poin Terekap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-2xl">
                {totalPoints.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-muted-foreground">
                Poin dari {userCount} pengguna
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementReward;
