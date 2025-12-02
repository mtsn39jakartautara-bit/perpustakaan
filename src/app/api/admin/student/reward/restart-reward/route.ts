import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

// export async function POST() {
//   try {
//     const result = await prisma.$transaction(async (tx) => {
//       const now = new Date();
//       const month = now.toLocaleString("id-ID", { month: "long" });
//       const year = now.getFullYear();

//       // 1. Nonaktifkan periode aktif dengan 1 query
//       await tx.$executeRaw`
//         UPDATE "RewardCycle"
//         SET "isActive" = false, "endDate" = NOW()
//         WHERE "isActive" = true
//       `;

//       // 2. Buat periode baru dan dapatkan ID-nya
//       const newCycle = await tx.rewardCycle.create({
//         data: {
//           title: `Periode ${month} ${year}`,
//           startDate: now,
//           isActive: true,
//         },
//       });

//       // 3. Insert semua student DAN teacher sekaligus dengan 1 query
//       await tx.$executeRaw`
//         INSERT INTO "RewardPoint"
//           ("id", "userId", "rewardCycleId", "points", "createdAt", "updatedAt")
//         SELECT
//           gen_random_uuid(),
//           u.id,
//           ${newCycle.id},
//           0,
//           NOW(),
//           NOW()
//         FROM "User" u
//         LEFT JOIN "RewardPoint" rp
//           ON rp."userId" = u.id
//           AND rp."rewardCycleId" = ${newCycle.id}
//         WHERE u."isActive" = true
//           AND u.role IN ('STUDENT', 'TEACHER')
//           AND rp.id IS NULL  -- Hanya insert jika belum ada
//       `;

//       // 4. Dapatkan statistik untuk response
//       const stats = await tx.$queryRaw<
//         {
//           totalStudents: number;
//           totalTeachers: number;
//           totalUsers: number;
//         }[]
//       >`
//         SELECT
//           COUNT(CASE WHEN role = 'STUDENT' THEN 1 END) as "totalStudents",
//           COUNT(CASE WHEN role = 'TEACHER' THEN 1 END) as "totalTeachers",
//           COUNT(*) as "totalUsers"
//         FROM "User" u
//         WHERE u."isActive" = true
//           AND u.role IN ('STUDENT', 'TEACHER')
//       `;

//       return {
//         newCycle,
//         totalStudents: Number(stats[0]?.totalStudents || 0),
//         totalTeachers: Number(stats[0]?.totalTeachers || 0),
//         totalUsers: Number(stats[0]?.totalUsers || 0),
//       };
//     });

//     return NextResponse.json({
//       success: true,
//       message: `Periode baru berhasil dibuat. ${result.totalStudents} siswa dan ${result.totalTeachers} guru direset.`,
//       newCycle: result.newCycle,
//       statistics: {
//         students: result.totalStudents,
//         teachers: result.totalTeachers,
//         total: result.totalUsers,
//       },
//     });
//   } catch (error) {
//     console.error("Error in restart reward:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Terjadi kesalahan dalam membuat periode baru",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST() {
  try {
    const now = new Date();
    const month = now.toLocaleString("id-ID", { month: "long" });
    const year = now.getFullYear();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Nonaktifkan periode aktif
      await tx.rewardCycle.updateMany({
        where: { isActive: true },
        data: {
          isActive: false,
          endDate: now,
        },
      });

      // 2. Buat periode (cycle) baru
      const newCycle = await tx.rewardCycle.create({
        data: {
          title: `Periode ${month} ${year}`,
          startDate: now,
          isActive: true,
        },
      });

      return {
        newCycle,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Periode baru berhasil dibuat (${result.newCycle.title}).`,
      newCycle: result.newCycle,
    });
  } catch (error) {
    console.error("Error in restart reward:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan dalam membuat periode baru",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
