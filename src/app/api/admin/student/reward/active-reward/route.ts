// app/api/admin/reward/active-period/route.ts
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verifikasi admin/auth
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 Fetching active reward cycle data...");

    // Ambil periode aktif (RewardCycle)
    const activePeriod = await prisma.rewardCycle.findFirst({
      where: { isActive: true },
      include: {
        _count: { select: { rewardPoints: true } },
      },
    });

    if (!activePeriod) {
      return NextResponse.json(
        { message: "Tidak ada periode aktif" },
        { status: 404 }
      );
    }

    console.log("✅ Active period:", activePeriod);

    // Hitung total poin di periode ini
    const totalPoints = await prisma.rewardPoint.aggregate({
      where: { rewardCycleId: activePeriod.id },
      _sum: { points: true },
    });

    const data = {
      activePeriod: {
        id: activePeriod.id,
        title: activePeriod.title,
        startDate: activePeriod.startDate,
        endDate: activePeriod.endDate,
      },
      totalPoints: totalPoints._sum.points || 0,
      userCount: activePeriod._count.rewardPoints,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching active period data:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data periode aktif" },
      { status: 500 }
    );
  }
}
