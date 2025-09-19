"use client";

import { Trophy, Star, BookOpen, User, Award, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FontGorditas, fontPlayFair } from "@/lib/fonts";

// Data dummy untuk penghargaan
const awardData = {
  currentMonth: "Januari 2024",
  students: [
    {
      id: 1,
      name: "Siti Nurhaliza",
      grade: "8A",
      visits: 28,
      role: "Siswa Teraktif",
      avatar: "/avatars/student1.jpg",
    },
    {
      id: 2,
      name: "Ahmad Rizky",
      grade: "9B",
      visits: 25,
      role: "Pembaca Terbanyak",
      avatar: "/avatars/student2.jpg",
    },
    {
      id: 3,
      name: "Dewi Lestari",
      grade: "7C",
      visits: 22,
      role: "Reviewer Terbaik",
      avatar: "/avatars/student3.jpg",
    },
    {
      id: 4,
      name: "Rizki Pratama",
      grade: "8D",
      visits: 20,
      role: "Pencari Referensi",
      avatar: "/avatars/student4.jpg",
    },
  ],
  teachers: [
    {
      id: 1,
      name: "Bu Sari, S.Pd",
      subject: "Matematika",
      visits: 35,
      role: "Guru Teraktif",
      avatar: "/avatars/teacher1.jpg",
    },
    {
      id: 2,
      name: "Pak Budi, M.Pd",
      subject: "Bahasa Indonesia",
      visits: 30,
      role: "Peminjam Terbanyak",
      avatar: "/avatars/teacher2.jpg",
    },
  ],
  previousWinners: [
    {
      id: 1,
      name: "Rina Wijaya",
      period: "Desember 2023",
      role: "Siswa Teraktif",
    },
    {
      id: 2,
      name: "Pak Joko, S.Pd",
      period: "Desember 2023",
      role: "Guru Teraktif",
    },
  ],
};

const AwardSections = () => {
  const font = fontPlayFair.className;
  const font2 = FontGorditas.className;

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
                  key={student.id}
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
                              Kelas {student.grade}
                            </p>
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
                            {student.visits} kunjungan
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
                            {student.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pemenang Guru & Previous Winners */}
          <div className="space-y-8">
            {/* Guru Section */}
            <div>
              <h3 className={`text-2xl mb-6 flex items-center ${font2}`}>
                <User className="h-6 w-6 mr-2 text-[hsl(var(--primary))] " />
                Penghargaan Guru
              </h3>

              <div className="space-y-4">
                {awardData.teachers.map((teacher, index) => (
                  <Card
                    key={teacher.id}
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
                            {teacher.subject}
                          </p>
                          <div className="flex items-center mt-1">
                            <BookOpen className="h-3 w-3 mr-1 text-[hsl(var(--muted-foreground))]" />
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                              {teacher.visits} kunjungan
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-[hsl(var(--primary))] text-white"
                        >
                          {teacher.role}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
              <CardContent className="p-4">
                <h4 className="font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-primary-foreground text-primary-foreground" />
                  Bagaimana cara menang?
                </h4>
                <p className="text-sm mt-1 ">
                  Kunjungi perpustakaan secara rutin, pinjam buku, dan tulis
                  review untuk mendapatkan poin dan kesempatan menang!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardSections;
