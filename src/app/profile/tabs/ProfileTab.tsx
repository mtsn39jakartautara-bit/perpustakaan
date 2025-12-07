import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, School, MapPin, Phone, Edit } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserData } from "../page";
import { motion } from "framer-motion";

interface ProfileTabProps {
  userData: UserData;
  getRoleLabel: (role: string) => string;
  formatDate: (date: string | Date) => string;
}

const ProfileTab = ({
  userData,
  getRoleLabel,
  formatDate,
}: ProfileTabProps) => {
  return (
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
            Logout
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nama Lengkap
              </label>
              <p className="text-foreground font-medium">{userData.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Role
              </label>
              <p className="text-foreground font-medium">
                {getRoleLabel(userData.role)}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Badge
                className="self-start mt-2"
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
  );
};

export default ProfileTab;
