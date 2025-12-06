import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "UserId wajib dikirim" },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // ------------------------------
    // 🔍 CEK VISIT HARI INI
    // ------------------------------

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingVisitToday = await prisma.rewardPoint.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingVisitToday) {
      return NextResponse.json(
        {
          success: false,
          alreadyVisited: true,
          message: "Hari ini kamu sudah mendapatkan reward point.",
        },
        { status: 200 }
      );
    }

    // ------------------------------
    // 📝 SIMPAN VISIT BARU
    // ------------------------------
    const visit = await prisma.visit.create({
      data: { userId },
    });

    // ------------------------------
    // 🔍 CARI CYCLE AKTIF
    // ------------------------------
    const activeCycle = await prisma.rewardCycle.findFirst({
      where: { isActive: true },
    });

    if (activeCycle) {
      // ------------------------------
      // 🎁 TAMBAH REWARD POINT (1x per hari)
      // ------------------------------

      await prisma.rewardPoint.upsert({
        where: {
          userId_rewardCycleId: {
            userId,
            rewardCycleId: activeCycle.id,
          },
        },
        update: { points: { increment: 10 } },
        create: {
          userId,
          rewardCycleId: activeCycle.id,
          points: 10,
        },
      });
    }

    return NextResponse.json({
      success: true,
      visit,
      message: "Visit berhasil dicatat & reward diberikan",
    });
  } catch (error) {
    console.error("❌ API /visit error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan visit" },
      { status: 500 }
    );
  }
}
