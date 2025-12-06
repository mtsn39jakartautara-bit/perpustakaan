import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookCheck, BookOpen, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const BorrowingManagementTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookCheck className="h-5 w-5" />
            Management Peminjaman dan Pengembalian Buku
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Peminjaman Buku
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Kelola proses peminjaman buku oleh siswa dan guru
                </p>
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Kelola Peminjaman
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5" />
                  Pengembalian Buku
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Proses pengembalian buku dan perhitungan denda
                </p>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Kelola Pengembalian
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className=" gap-2 ">
                  <div className="flex gap-2 items-center text-lg">
                    <BookOpen className="h-5 w-5 " />
                    Peminjaman Buku
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Kelola proses peminjaman buku oleh siswa dan guru
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h1>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Dolorem eaque velit perferendis iste accusantium placeat
                    recusandae neque exercitationem id, dignissimos nemo
                    veritatis aperiam sunt earum doloremque eum fuga, nostrum
                    corporis eos officia illo, quidem assumenda non. Excepturi
                    ullam modi, expedita totam ea consequuntur soluta delectus
                    incidunt blanditiis nostrum. Excepturi, sit?
                  </h1>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Corporis nihil ut dolore rem cum facere asperiores
                    accusantium sunt eligendi impedit assumenda dolorem, culpa
                    dicta quis aperiam perspiciatis libero doloremque et!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BorrowingManagementTab;
