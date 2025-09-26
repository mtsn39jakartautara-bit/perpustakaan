import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // ambil semua siswa aktif
    const students = await prisma.studentProfile.findMany({
      include: { gradeLevel: true, user: true },
    });

    for (const student of students) {
      if (!student.user.isActive) continue; // skip kalau sudah non-aktif

      if (student.gradeLevel.isFinal) {
        // === CASE: Kelas terakhir (9) → LULUS ===
        await prisma.user.update({
          where: { id: student.userId },
          data: { isActive: false },
        });
      } else {
        // === CASE: Naik kelas ===
        const nextLevel = await prisma.gradeLevel.findFirst({
          where: { order: student.gradeLevel.order + 1 },
        });

        if (nextLevel) {
          await prisma.studentProfile.update({
            where: { id: student.id },
            data: { gradeLevelId: nextLevel.id },
          });
        }
      }
    }

    return NextResponse.json({
      message: "✅ Promosi kelas berhasil dijalankan",
      totalStudents: students.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat promosi kelas" },
      { status: 500 }
    );
  }
}
