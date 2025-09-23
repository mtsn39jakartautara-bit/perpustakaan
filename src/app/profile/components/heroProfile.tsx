"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

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

type HeroProfileProps = {
  userData: UserData;
  getRoleLabel: (role: string) => string;
};

const HeroProfile = ({ userData, getRoleLabel }: HeroProfileProps) => {
  return (
    <div
      className="relative h-[50vh] bg-gradient-hero flex items-end pb-10 justify-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTUiLz48L2c+PC9zdmc+')]"></div>
      </div>

      {/* Animated Elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-white/10 rounded-full"></div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-full">
            <User className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{userData.name}</h1>
        <div className="flex items-center justify-center gap-3">
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-none"
          >
            {getRoleLabel(userData.role)}
          </Badge>
          <Badge
            variant="secondary"
            className={
              userData.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {userData.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroProfile;
