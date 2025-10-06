import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // pastikan ada file auth.ts untuk config next-auth
import prisma from "@/utils/prisma"; // prisma client

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        visits: true,
        borrowings: {
          include: { book: true },
        },
        rewardPoints: {
          include: { rewardCycle: true },
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

    console.log("✅ Fetched user profile:", user);

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
