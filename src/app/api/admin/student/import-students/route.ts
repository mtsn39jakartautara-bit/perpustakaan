import { NextResponse } from "next/server";

import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  try {
    // ambil file dari form-data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // baca buffer excel
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // parse excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json: any[] = XLSX.utils.sheet_to_json(sheet);

    console.log(json);

    let created = 0;

    for (const row of json) {
      /**
       * Pastikan format kolom di Excel:
       * name | nis | gradeLevelOrder
       */
      const { name, nis, gradeLevelOrder } = row;

      if (!name || !nis || !gradeLevelOrder) continue;

      const gradeLevel = await prisma.gradeLevel.findFirst({
        where: { order: Number(gradeLevelOrder) },
      });

      if (!gradeLevel) continue;

      const hashed = await bcrypt.hash(String(nis), 10);

      await prisma.user.create({
        data: {
          name,
          role: "STUDENT",
          password: hashed,
          studentProfile: {
            create: {
              nis: String(nis),
              gradeLevelId: gradeLevel.id,
            },
          },
        },
      });

      created++;
    }

    console.log(`✅ Import selesai, ${created} siswa berhasil ditambahkan.`);

    return NextResponse.json({
      message: `✅ Import selesai, ${created} siswa berhasil ditambahkan.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal import data siswa" },
      { status: 500 }
    );
  }
}
