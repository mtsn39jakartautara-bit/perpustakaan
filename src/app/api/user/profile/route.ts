import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // pastikan ada file auth.ts untuk config next-auth
import prisma from "@/utils/prisma"; // prisma client

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // ambil data user seperti API lama
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        visits: true,
        borrowings: {
          include: { book: true },
        },
        studentProfile: {
          include: { gradeLevel: true },
        },
        teacherProfile: true,
        visitorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ambil semua cycle
    const cycles = await prisma.rewardCycle.findMany({
      orderBy: { startDate: "desc" },
    });

    // ambil rewardPoint user yang ada
    const userPoints = await prisma.rewardPoint.findMany({
      where: { userId },
    });

    // bentuk rewardHistory (cycle + poin)
    const rewardHistory = cycles.map((cycle) => {
      const rp = userPoints.find((p) => p.rewardCycleId === cycle.id);
      return {
        rewardCycle: cycle,
        points: rp ? rp.points : 0,
      };
    });

    // hitung total point
    const totalPoints = rewardHistory.reduce((sum, r) => sum + r.points, 0);

    // cycle aktif
    const activeCycle = rewardHistory.find((r) => r.rewardCycle.isActive);

    // RETURN FORMAT YANG SAMA + tambahan reward
    return NextResponse.json({
      ...user, // visits, borrowings, profile, dsb.
      rewardPoints: rewardHistory, // override lama
      totalPoints,
      activeRewardCycle: activeCycle,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
