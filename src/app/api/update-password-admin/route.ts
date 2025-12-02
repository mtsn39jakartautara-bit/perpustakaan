import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const GET = async () => {
  const idAdmin = "cmg0mnmty0003yu3o8dflxp4b";

  const newPassword = bcrypt.hashSync("password", 10);

  const updatePassword = await prisma.user.update({
    where: {
      id: idAdmin,
    },
    data: {
      password: newPassword,
    },
  });

  //   const updatePassword = await prisma.user.findFirst({
  //     where: {
  //       id: idAdmin,
  //     },
  //   });

  // $2b$10$OqWDauo0eopvRZXZf9eW/uFFKgvojWU8q9Na8qmzt9gH6ePnXQSJa
  return NextResponse.json({ message: "OK", updatePassword });
};
