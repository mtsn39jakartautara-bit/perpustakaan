import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    console.log("-----------------------------");

    // 1️⃣ AMBIL USER + PROFILES + BORROWINGS SEKALIGUS (1 query)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        visits: true,
        borrowings: { include: { book: true } },
        studentProfile: { include: { gradeLevel: true } },
        teacherProfile: true,
        visitorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2️⃣ AMBIL SEMUA CYCLE + REWARD POINT USER SEKALIGUS (1 query)
    const cycles = await prisma.rewardCycle.findMany({
      orderBy: { startDate: "desc" },
      include: {
        rewardPoints: {
          where: { userId },
          select: { points: true },
        },
      },
    });

    // 3️⃣ BENTUK REWARD HISTORY TANPA find() LAGI
    const rewardHistory = cycles.map((cycle) => ({
      rewardCycle: {
        id: cycle.id,
        title: cycle.title,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        isActive: cycle.isActive,
      },
      points: cycle.rewardPoints.length > 0 ? cycle.rewardPoints[0].points : 0,
    }));

    // 4️⃣ TOTAL POINT
    const totalPoints = rewardHistory.reduce((sum, r) => sum + r.points, 0);

    // 5️⃣ CYCLE AKTIF
    const activeRewardCycle = rewardHistory.find((r) => r.rewardCycle.isActive);

    return NextResponse.json({
      ...user,
      rewardPoints: rewardHistory,
      totalPoints,
      activeRewardCycle,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
