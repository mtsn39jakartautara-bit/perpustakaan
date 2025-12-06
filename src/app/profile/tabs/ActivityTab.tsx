// app/profile/tabs/ActivityTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { UserData } from "../types";

interface ActivityTabProps {
  userData: UserData;
  getStatusBadge: (status: string) => JSX.Element;
  formatDate: (date: string | Date) => string;
  activeBorrowings: UserData["borrowings"];
}

const ActivityTab = ({
  userData,
  getStatusBadge,
  formatDate,
  activeBorrowings,
}: ActivityTabProps) => {
  return (
    <>
      {/* Current Borrowings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Buku Sedang Dipinjam
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeBorrowings.length > 0 ? (
              <div className="space-y-4">
                {activeBorrowings.map((borrowing) => (
                  <div
                    key={borrowing.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{borrowing.book.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {borrowing.book.author}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Jatuh Tempo: {formatDate(borrowing.dueDate)}
                        </span>
                        {getStatusBadge(borrowing.status)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Perpanjang
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada buku yang sedang dipinjam</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Visits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Kunjungan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userData.visits.length > 0 ? (
              <div className="space-y-3">
                {userData.visits.slice(0, 5).map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Kunjungan perpustakaan</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(visit.visitedAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada riwayat kunjungan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ActivityTab;
