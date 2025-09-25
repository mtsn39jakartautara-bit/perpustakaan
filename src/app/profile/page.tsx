// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  BookOpen,
  Calendar,
  Clock,
  Award,
  MapPin,
  Phone,
  Mail,
  School,
  Bookmark,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Edit,
} from "lucide-react";
import HeroProfile from "./components/heroProfile";
import { signOut } from "next-auth/react";

// Mock data based on your schema
interface UserData {
  id: string;
  name: string;
  isActive: boolean;
  role: "STUDENT" | "TEACHER" | "VISITOR" | "ADMIN";
  createdAt: Date;
  studentProfile?: {
    nis: string;
    grade: string;
    major?: string;
  };
  teacherProfile?: {
    nip: string;
    subject: string;
    position?: string;
  };
  visitorProfile?: {
    address?: string;
    phone?: string;
  };
  visits: {
    id: string;
    visitedAt: Date;
  }[];
  borrowings: {
    id: string;
    book: {
      title: string;
      author: string;
    };
    borrowedAt: Date;
    dueDate: Date;
    returnedAt: Date | null;
    status: "active" | "returned" | "overdue";
  }[];
  rewardPoints: {
    points: number;
    rewardCycle: {
      title: string;
      isActive: boolean;
    };
  }[];
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<UserData | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUserData: UserData = {
      id: "user_123",
      name: "Ahmad Rizki",
      isActive: true,
      role: "STUDENT",
      createdAt: new Date("2024-01-01"),
      studentProfile: {
        nis: "202407001",
        grade: "VII A",
        major: "Umum",
      },
      visits: [
        { id: "1", visitedAt: new Date("2024-03-01") },
        { id: "2", visitedAt: new Date("2024-03-05") },
        { id: "3", visitedAt: new Date("2024-03-10") },
      ],
      borrowings: [
        {
          id: "1",
          book: { title: "Matematika Kelas 7", author: "Dr. Ahmad Rizali" },
          borrowedAt: new Date("2024-02-15"),
          dueDate: new Date("2024-03-01"),
          returnedAt: new Date("2024-02-28"),
          status: "returned",
        },
        {
          id: "2",
          book: { title: "IPA Terpadu", author: "Prof. Siti Rahayu" },
          borrowedAt: new Date("2024-03-05"),
          dueDate: new Date("2024-03-19"),
          returnedAt: null,
          status: "active",
        },
      ],
      rewardPoints: [
        {
          points: 150,
          rewardCycle: { title: "Periode Maret 2024", isActive: true },
        },
      ],
    };

    setUserData(mockUserData);
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "Siswa";
      case "TEACHER":
        return "Guru";
      case "VISITOR":
        return "Pengunjung";
      case "ADMIN":
        return "Administrator";
      default:
        return role;
    }
  };

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const activeBorrowings = userData.borrowings.filter(
    (b) => b.status === "active"
  );
  const totalVisits = userData.visits.length;
  const totalPoints = userData.rewardPoints.reduce(
    (sum, rp) => sum + rp.points,
    0
  );
  const activeRewardCycle = userData.rewardPoints.find(
    (rp) => rp.rewardCycle.isActive
  );

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Banner dengan tinggi 50vh */}

      <HeroProfile userData={userData} getRoleLabel={getRoleLabel} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10  pb-20">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-card border-border shadow-soft">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {activeBorrowings.length}
                </div>
                <p className="text-muted-foreground">Buku Dipinjam</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-soft">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {totalVisits}
                </div>
                <p className="text-muted-foreground">Total Kunjungan</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-soft">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {totalPoints}
                </div>
                <p className="text-muted-foreground">Poin Reward</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-gradient-card p-1 rounded-lg shadow-card">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              Profil
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              Aktivitas
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              Reward
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Pribadi
                  </CardTitle>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    logout
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Nama Lengkap
                      </label>
                      <p className="text-foreground font-medium">
                        {userData.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Role
                      </label>
                      <p className="text-foreground font-medium">
                        {getRoleLabel(userData.role)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <Badge
                        variant={userData.isActive ? "default" : "secondary"}
                      >
                        {userData.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Bergabung Sejak
                      </label>
                      <p className="text-foreground font-medium">
                        {formatDate(userData.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Role Specific Information */}
                  {userData.studentProfile && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <School className="h-4 w-4" />
                        Informasi Siswa
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            NIS
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.studentProfile.nis}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Kelas
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.studentProfile.grade}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Jurusan
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.studentProfile.major || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {userData.teacherProfile && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <School className="h-4 w-4" />
                        Informasi Guru
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            NIP
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.teacherProfile.nip}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Mata Pelajaran
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.teacherProfile.subject}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Posisi
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.teacherProfile.position || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {userData.visitorProfile && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Informasi Pengunjung
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Alamat
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.visitorProfile.address || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Telepon
                          </label>
                          <p className="text-foreground font-medium">
                            {userData.visitorProfile.phone || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
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
                            <h4 className="font-semibold">
                              {borrowing.book.title}
                            </h4>
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
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Poin Reward
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Points */}
                  <div className="text-center p-6 bg-gradient-card rounded-lg">
                    <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {totalPoints}
                    </div>
                    <p className="text-muted-foreground">Total Poin Reward</p>
                    {activeRewardCycle && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Periode Aktif: {activeRewardCycle.rewardCycle.title}
                      </p>
                    )}
                  </div>

                  {/* Reward History */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Riwayat Poin
                    </h4>
                    <div className="space-y-3">
                      {userData.rewardPoints.map((rp, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {rp.rewardCycle.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {rp.rewardCycle.isActive
                                ? "Sedang berjalan"
                                : "Telah berakhir"}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            +{rp.points} poin
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
