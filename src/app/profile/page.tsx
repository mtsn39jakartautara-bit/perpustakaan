"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Award } from "lucide-react";
import HeroProfile from "./components/heroProfile";
import Loading from "@/components/Loading";

// Import tabs
import {
  ProfileTab,
  ActivityTab,
  RewardsTab,
  StudentManagementTab,
  BorrowingManagementTab,
  BookManagementTab,
  RewardManagementTab,
} from "./tabs";

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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setUserData(json);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <Badge variant="secondary" className="bg-green-100 text-green-800">
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

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  if (loading) return <Loading />;
  if (!userData) return <div>Data tidak ditemukan</div>;

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

  // Determine tabs based on user role
  const getTabsConfig = () => {
    if (userData.role === "ADMIN") {
      return [
        { value: "student-management", label: "Management Siswa" },
        { value: "borrowing-management", label: "Management Peminjaman" },
        { value: "reward-management", label: "Management Reward" },
        { value: "book-management", label: "Management Buku" },
      ];
    }

    // default (selain ADMIN)
    return [
      { value: "profile", label: "Profil" },
      { value: "activity", label: "Aktivitas" },
      { value: "rewards", label: "Reward" },
    ];
  };

  const tabsConfig = getTabsConfig();
  const isAdmin = userData.role === "ADMIN";

  return (
    <>
      <HeroProfile userData={userData} getRoleLabel={getRoleLabel} />

      {/* Main Content */}
      <div
        className={`container mx-auto px-4 py-12 -mt-20 relative z-10 pb-20 ${
          !isAdmin ? "min-h-screen bg-gradient-soft" : ""
        }`}
      >
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
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
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
                  {activeRewardCycle?.points || 0}
                </div>
                <p className="text-muted-foreground">Point Periode ini</p>
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
          <div className="pb-5">
            <TabsList
              className={`grid gap-2 w-full p-1 rounded-lg shadow-card bg-transparent ${
                tabsConfig.length >= 4 ? "grid-cols-2" : "grid-cols-3"
              }`}
            >
              {tabsConfig.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md text-xs md:text-sm bg-primary/20"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Contents */}
          {isAdmin ? (
            // Admin Tabs
            <>
              <TabsContent value="profile" className="space-y-6">
                <ProfileTab
                  userData={userData}
                  getRoleLabel={getRoleLabel}
                  formatDate={formatDate}
                />
              </TabsContent>
              <TabsContent value="student-management" className="space-y-6">
                <StudentManagementTab />
              </TabsContent>

              <TabsContent value="borrowing-management" className="space-y-6">
                <BorrowingManagementTab />
              </TabsContent>

              <TabsContent value="book-management" className="space-y-6">
                <BookManagementTab />
              </TabsContent>

              <TabsContent value="reward-management" className="space-y-6">
                <RewardManagementTab />
              </TabsContent>
            </>
          ) : (
            // Non-Admin Tabs
            <>
              <TabsContent value="profile" className="space-y-6">
                <ProfileTab
                  userData={userData}
                  getRoleLabel={getRoleLabel}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <ActivityTab
                  userData={userData}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                  activeBorrowings={activeBorrowings}
                />
              </TabsContent>

              <TabsContent value="rewards" className="space-y-6">
                <RewardsTab
                  userData={userData}
                  totalPoints={totalPoints}
                  activeRewardCycle={activeRewardCycle}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
export type { UserData };
