import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const q = req.nextUrl.searchParams.get("q");
  const userId = req.nextUrl.searchParams.get("userId") as string;

  const borrowing = await prisma.borrowing.findMany({
    where: {
      userId: userId,
    },
  });

  return NextResponse.json({ message: q });
}
