import { NextResponse } from "next/server";
import prisma from "@/utils/prisma"; // pastikan Anda punya prisma client

export async function POST() {
  try {
    // 1. Nonaktifkan periode aktif
    const activeCycle = await prisma.rewardCycle.findFirst({
      where: { isActive: true },
    });

    if (activeCycle) {
      await prisma.rewardCycle.update({
        where: { id: activeCycle.id },
        data: {
          isActive: false,
          endDate: new Date(),
        },
      });
    }

    // 2. Buat periode baru
    const now = new Date();
    const month = now.toLocaleString("id-ID", { month: "long" });
    const year = now.getFullYear();
    const newCycle = await prisma.rewardCycle.create({
      data: {
        title: `Periode ${month} ${year}`,
        startDate: now,
        isActive: true,
      },
    });

    // 3. Buat RewardPoint baru untuk semua user dengan role STUDENT
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    await prisma.$transaction(
      students.map((s) =>
        prisma.rewardPoint.create({
          data: {
            userId: s.id,
            rewardCycleId: newCycle.id,
            points: 0,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Periode baru berhasil dibuat dan poin siswa direset",
      newCycle,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan", error },
      { status: 500 }
    );
  }
}
