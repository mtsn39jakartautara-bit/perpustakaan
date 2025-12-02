import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Ambil reward cycle aktif
    const activeCycle = await prisma.rewardCycle.findFirst({
      where: { isActive: true },
      select: { id: true, title: true, startDate: true },
    });

    if (!activeCycle) {
      return NextResponse.json({
        cycleId: null,
        cycleTitle: null,
        students: [],
        teachers: [],
      });
    }

    const cycleId = activeCycle.id;

    // ===============================
    //  STUDENTS
    // ===============================
    const students = await prisma.rewardPoint.findMany({
      where: {
        rewardCycleId: cycleId,
        user: {
          role: "STUDENT",
          isActive: true,
        },
      },
      include: {
        user: {
          include: {
            studentProfile: {
              include: {
                gradeLevel: true,
              },
            },
          },
        },
      },
      orderBy: { points: "desc" },
    });

    // ===============================
    //  TEACHERS
    // ===============================
    const teachers = await prisma.rewardPoint.findMany({
      where: {
        rewardCycleId: cycleId,
        user: {
          role: "TEACHER",
          isActive: true,
        },
      },
      include: {
        user: {
          include: {
            teacherProfile: true,
          },
        },
      },
      orderBy: { points: "desc" },
    });

    // ===============================
    //  TRANSFORM OUTPUT
    // ===============================

    const studentLeaderboard = students.map((item) => ({
      userId: item.user.id,
      points: item.points,
      name: item.user.name,
      gradeLevel: item.user.studentProfile?.gradeLevel?.name ?? null,
      gradeOrder: item.user.studentProfile?.gradeLevel?.order ?? null,
      studentProfile: item.user.studentProfile
        ? {
            id: item.user.studentProfile.id,
            nis: item.user.studentProfile.nis,
            major: item.user.studentProfile.major,
          }
        : null,
    }));

    const teacherLeaderboard = teachers.map((item) => ({
      userId: item.user.id,
      points: item.points,
      name: item.user.name,
      subject: item.user.teacherProfile?.subject ?? null,
      teacherProfile: item.user.teacherProfile
        ? {
            id: item.user.teacherProfile.id,
            nip: item.user.teacherProfile.nip,
            position: item.user.teacherProfile.position,
          }
        : null,
    }));

    return NextResponse.json({
      cycleId,
      cycleTitle: activeCycle.title,
      cycleStartDate: activeCycle.startDate,
      students: studentLeaderboard,
      teachers: teacherLeaderboard,
    });
  } catch (error) {
    console.error("ERROR GET /api/user/award", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
