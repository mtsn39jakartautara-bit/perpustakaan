import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    console.log("🔍 Received visit request for userId:", userId);

    if (!userId) {
      console.error("❌ UserId is required");
      return NextResponse.json(
        { success: false, error: "UserId wajib dikirim" },
        { status: 400 }
      );
    }

    // Cek apakah user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("❌ User not found:", userId);
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    console.log("✅ User found:", user.name);

    // 1. Simpan visit baru
    const visit = await prisma.visit.create({
      data: { userId },
    });

    console.log("✅ Visit created:", visit.id);

    // 2. Cari rewardCycle yang sedang aktif
    const activeCycle = await prisma.rewardCycle.findFirst({
      where: { isActive: true },
    });

    console.log("🔍 Active reward cycle:", activeCycle);

    if (activeCycle) {
      // 3. Tambahkan / buat rewardPoint user pada cycle aktif
      const rewardPoint = await prisma.rewardPoint.upsert({
        where: {
          userId_rewardCycleId: {
            userId,
            rewardCycleId: activeCycle.id,
          },
        },
        update: {
          points: { increment: 10 },
        },
        create: {
          userId,
          rewardCycleId: activeCycle.id,
          points: 10,
        },
      });

      console.log("✅ Reward point updated:", rewardPoint);
    } else {
      console.log("⚠️ No active reward cycle found");
    }

    return NextResponse.json({
      success: true,
      visit,
      message: "Visit berhasil dicatat",
    });
  } catch (error) {
    console.error("❌ API /visit error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan visit" },
      { status: 500 }
    );
  }
}
