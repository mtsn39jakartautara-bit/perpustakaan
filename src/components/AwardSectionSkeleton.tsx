"use client";

import { Trophy, Star, BookOpen, User, Award, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FontGorditas, fontPlayFair } from "@/lib/fonts";
import { useEffect, useState } from "react";

// Tipe data berdasarkan response API
interface StudentLeaderboard {
  userId: string;
  points: number;
  name: string;
  gradeLevel: string | null;
  gradeOrder: number | null;
  studentProfile: {
    id: string;
    nis: string;
    major: string | null;
  } | null;
}

interface TeacherLeaderboard {
  userId: string;
  points: number;
  name: string;
  subject: string | null;
  teacherProfile: {
    id: string;
    nip: string;
    position: string | null;
  } | null;
}

interface AwardApiResponse {
  cycleId: string | null;
  cycleTitle: string | null;
  students: StudentLeaderboard[];
  teachers: TeacherLeaderboard[];
}

interface AwardData {
  currentMonth: string;
  students: StudentLeaderboard[];
  teachers: TeacherLeaderboard[];
}

// Skeleton Loading Components
const AwardSectionSkeleton = () => {
  const font = fontPlayFair.className;
  const font2 = FontGorditas.className;

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header Section Skeleton */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gray-200 rounded-full mb-4 animate-pulse">
            <div className="h-8 w-8"></div>
          </div>
          <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="inline-flex items-center mt-4 bg-gray-200 px-4 py-2 rounded-full shadow-sm animate-pulse">
            <div className="h-5 w-5 mr-2 bg-gray-300 rounded"></div>
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pemenang Siswa Skeleton */}
          <div className="lg:col-span-2">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student 1 (Juara 1) */}
              <div className="md:col-span-2">
                <Card className="border-0 shadow-md bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center"></div>
                        <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
                          <div className="h-4 w-4 bg-gray-500 rounded"></div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="h-6 w-40 bg-gray-300 rounded"></div>
                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                            <div className="h-3 w-24 bg-gray-300 rounded"></div>
                          </div>
                          <div className="h-6 w-16 bg-gray-400 rounded"></div>
                        </div>

                        <div className="flex items-center mt-3">
                          <div className="h-4 w-4 bg-gray-300 rounded mr-1"></div>
                          <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        </div>

                        <div className="mt-2">
                          <div className="inline-flex items-center px-2 py-1 rounded-full">
                            <div className="h-3 w-3 bg-gray-300 rounded mr-1"></div>
                            <div className="h-3 w-24 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student 2 */}
              <Card className="border-0 shadow-md bg-gray-100 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="h-6 w-36 bg-gray-200 rounded"></div>
                          <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-12 bg-gray-300 rounded"></div>
                      </div>

                      <div className="flex items-center mt-3">
                        <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>

                      <div className="mt-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200">
                          <div className="h-3 w-3 bg-gray-300 rounded mr-1"></div>
                          <div className="h-3 w-20 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student 3 */}
              <Card className="border-0 shadow-md bg-gray-100 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="h-6 w-32 bg-gray-200 rounded"></div>
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-12 bg-gray-300 rounded"></div>
                      </div>

                      <div className="flex items-center mt-3">
                        <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>

                      <div className="mt-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200">
                          <div className="h-3 w-3 bg-gray-300 rounded mr-1"></div>
                          <div className="h-3 w-28 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pemenang Guru & Info Skeleton */}
          <div className="space-y-8">
            {/* Guru Section Skeleton */}
            <div>
              <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>

              <div className="space-y-4">
                {/* Teacher 1 */}
                <Card className="border-0 shadow-md bg-gray-100 animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-36 bg-gray-200 rounded"></div>
                        <div className="h-3 w-40 bg-gray-200 rounded"></div>
                        <div className="h-3 w-28 bg-gray-200 rounded"></div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-gray-200 rounded mr-1"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-24 bg-gray-300 rounded"></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Teacher 2 */}
                <Card className="border-0 shadow-md bg-gray-100 animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-36 bg-gray-200 rounded"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-gray-200 rounded mr-1"></div>
                          <div className="h-3 w-14 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-28 bg-gray-300 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Info Section Skeleton */}
            <Card className="bg-gradient-to-r from-gray-200 to-gray-300 border-0 animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 bg-gray-400 rounded mr-1"></div>
                  <div className="h-5 w-40 bg-gray-400 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-400 rounded"></div>
                  <div className="h-3 w-5/6 bg-gray-400 rounded"></div>
                  <div className="space-y-1 mt-2">
                    <div className="h-2 w-3/4 bg-gray-400 rounded"></div>
                    <div className="h-2 w-2/3 bg-gray-400 rounded"></div>
                    <div className="h-2 w-4/5 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const AwardSections = () => {
  const font = fontPlayFair.className;
  const font2 = FontGorditas.className;
  const [awardData, setAwardData] = useState<AwardData>({
    currentMonth: new Date().toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    }),
    students: [],
    teachers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwardData();
  }, []);

  const fetchAwardData = async () => {
    try {
      setLoading(true);

      // Ambil data leaderboard langsung dari satu API
      const response = await fetch(`/api/user/award`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AwardApiResponse = await response.json();

      // Gunakan title dari API jika ada, jika tidak gunakan bulan saat ini
      const currentMonth =
        data.cycleTitle ||
        new Date().toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        });

      // Ambil hanya 3 siswa teratas dan 2 guru teratas
      const topStudents = data.students.slice(0, 3);
      const topTeachers = data.teachers.slice(0, 2);

      setAwardData({
        currentMonth,
        students: topStudents,
        teachers: topTeachers,
      });
    } catch (error) {
      console.error("Error fetching award data:", error);

      // Fallback data jika API error
      setAwardData({
        currentMonth: new Date().toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }),
        students: [],
        teachers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getStudentRole = (index: number): string => {
    const roles = ["Siswa Teraktif", "Pembaca Terbanyak", "Reviewer Terbaik"];
    return roles[index] || "Siswa Berprestasi";
  };

  const getTeacherRole = (index: number): string => {
    const roles = ["Guru Teraktif", "Peminjam Terbanyak"];
    return roles[index] || "Guru Berdedikasi";
  };

  if (loading) {
    return <AwardSectionSkeleton />;
  }

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[hsl(var(--primary))] rounded-full mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h2
            className={`text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] ${font}`}
          >
            Penghargaan Bulanan
          </h2>
          <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mt-2">
            Berikan apresiasi untuk siswa dan guru yang paling rajin mengunjungi
            perpustakaan kami
          </p>
          <div className="inline-flex items-center mt-4 bg-[hsl(var(--card))] px-4 py-2 rounded-full shadow-sm">
            <Calendar className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />
            <span className="font-medium">{awardData.currentMonth}</span>
          </div>
        </div>

        {awardData.students.length === 0 && awardData.teachers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[hsl(var(--muted-foreground))]">
              Belum ada data penghargaan untuk periode ini.
            </p>
            <button
              onClick={fetchAwardData}
              className="mt-4 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pemenang Siswa */}
            <div className="lg:col-span-2">
              <h3 className={`text-2xl mb-6 flex items-center ${font2}`}>
                <User className={`h-6 w-6 mr-2 text-[hsl(var(--primary))]`} />
                Penghargaan Siswa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {awardData.students.map((student, index) => (
                  <Card
                    key={student.userId}
                    className={`overflow-hidden border-0 shadow-md transition-all hover:shadow-lg ${
                      index === 0
                        ? "md:col-span-2 bg-gradient-to-r from-primary to-accent text-white"
                        : "bg-[hsl(var(--card))]"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`relative ${
                            index === 0
                              ? "ring-2 ring-white"
                              : "ring-2 ring-[hsl(var(--primary))]"
                          } rounded-full p-1`}
                        >
                          <div className="w-14 h-14 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center">
                            <User className="h-8 w-8" />
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                              <Star className="h-4 w-4 fill-white text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4
                                className={`font-bold text-lg ${font2} ${
                                  index === 0
                                    ? "text-white"
                                    : "text-[hsl(var(--foreground))]"
                                }`}
                              >
                                {student.name}
                              </h4>
                              <p
                                className={
                                  index === 0
                                    ? "text-blue-100"
                                    : "text-[hsl(var(--muted-foreground))]"
                                }
                              >
                                {student.gradeLevel
                                  ? `Kelas ${student.gradeLevel}`
                                  : "Kelas tidak diketahui"}
                                {student.studentProfile?.major &&
                                  ` • ${student.studentProfile.major}`}
                              </p>
                              {student.studentProfile?.nis && (
                                <p
                                  className={`text-xs ${
                                    index === 0 ? "opacity-90" : "opacity-75"
                                  }`}
                                >
                                  NIS: {student.studentProfile.nis}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={index === 0 ? "secondary" : "default"}
                              className={
                                index === 0
                                  ? "bg-white text-[hsl(var(--primary))]"
                                  : ""
                              }
                            >
                              {index === 0 ? "Juara 1" : `#${index + 1}`}
                            </Badge>
                          </div>

                          <div className="flex items-center mt-3 text-sm">
                            <BookOpen
                              className={`h-4 w-4 mr-1 ${
                                index === 0
                                  ? "text-blue-100"
                                  : "text-[hsl(var(--muted-foreground))]"
                              }`}
                            />
                            <span
                              className={
                                index === 0
                                  ? "text-blue-100"
                                  : "text-[hsl(var(--muted-foreground))]"
                              }
                            >
                              {student.points} poin
                            </span>
                          </div>

                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                index === 0
                                  ? "bg-white text-[hsl(var(--primary))]"
                                  : "bg-[hsl(var(--primary))] text-white"
                              }`}
                            >
                              <Award className="h-3 w-3 mr-1" />
                              {getStudentRole(index)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pemenang Guru & Info */}
            <div className="space-y-8">
              {/* Guru Section */}
              {awardData.teachers.length > 0 && (
                <div>
                  <h3 className={`text-2xl mb-6 flex items-center ${font2}`}>
                    <User className="h-6 w-6 mr-2 text-[hsl(var(--primary))]" />
                    Penghargaan Guru
                  </h3>

                  <div className="space-y-4">
                    {awardData.teachers.map((teacher, index) => (
                      <Card
                        key={teacher.userId}
                        className="border-0 shadow-md bg-[hsl(var(--card))]"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center">
                              <User className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-semibold ${font2}`}>
                                {teacher.name}
                              </h4>
                              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                {teacher.subject ||
                                  "Mata pelajaran tidak diketahui"}
                                {teacher.teacherProfile?.position &&
                                  ` • ${teacher.teacherProfile.position}`}
                              </p>
                              {teacher.teacherProfile?.nip && (
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                  NIP: {teacher.teacherProfile.nip}
                                </p>
                              )}
                              <div className="flex items-center mt-1">
                                <BookOpen className="h-3 w-3 mr-1 text-[hsl(var(--muted-foreground))]" />
                                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                  {teacher.points} poin
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-[hsl(var(--primary))] text-white"
                            >
                              {getTeacherRole(index)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Section */}
              <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                <CardContent className="p-4">
                  <h4 className="font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-primary-foreground text-primary-foreground" />
                    Bagaimana cara menang?
                  </h4>
                  <p className="text-sm mt-1">
                    Kunjungi perpustakaan secara rutin, pinjam buku, dan tulis
                    review untuk mendapatkan poin dan kesempatan menang!
                  </p>
                  <div className="mt-2 text-xs opacity-90">
                    <p>• Kunjungi perpustakaan: +1 poin</p>
                    <p>• Pinjam buku: +2 poin</p>
                    <p>• Kembalikan tepat waktu: +1 poin</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AwardSections;
