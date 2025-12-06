import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import UploadStudentData from "../components/uploadStudentData";
import PromoteStudent from "../components/promoteStudent";
import UploadTeacherData from "../components/uploadTeacherData";
import { motion } from "framer-motion";

const StudentManagementTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Management Siswa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload siswa */}
            <UploadStudentData />
            {/* Naik kelas Siswa */}
            <PromoteStudent />
            {/* Upload Guru */}
            <UploadTeacherData />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentManagementTab;
