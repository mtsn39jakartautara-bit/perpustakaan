import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Pastikan body berupa array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Request body harus array of students" },
        { status: 400 }
      );
    }

    const name = body.map((s: any) => s.name);
    const nis = body.map((s: any) => s.nis);
    const grade = body.map((s: any) => s.grade);
    const major = body.map((s: any) => s.major);

    if (
      !name.every((n: any) => typeof n === "string") ||
      !nis.every((n: any) => typeof n === "string") ||
      !grade.every((n: any) => typeof n === "string") ||
      !major.every((n: any) => typeof n === "string")
    ) {
      return NextResponse.json(
        { message: "Data student harus berupa string" },
        { status: 400 }
      );
    }

    const users = await Promise.all(
      body.map((s: any) =>
        prisma.user.create({
          data: {
            name: s.name,
            role: "STUDENT",
            studentProfile: {
              create: {
                nis: s.nis,
                grade: s.grade,
                major: s.major,
              },
            },
          },
        })
      )
    );

    return NextResponse.json({ users, message: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error saat membuat student" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get("userId") as string;

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
        studentProfile: {
          update: {
            nis: body.nis,
            grade: body.grade,
            major: body.major,
          },
        },
      },
    });

    return NextResponse.json({ user, message: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error saat membuat student" },
      { status: 500 }
    );
  }
}
