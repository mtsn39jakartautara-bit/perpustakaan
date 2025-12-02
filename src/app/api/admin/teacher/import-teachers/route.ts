// app/api/admin/teacher/import-teachers/route.ts
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

    console.log("Data yang diimport:", json);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of json) {
      /**
       * Format kolom di Excel:
       * name | nip | subject | position (opsional)
       */
      const { name, nip, subject, position } = row;

      // Validasi kolom wajib
      if (!name || !nip || !subject) {
        errors.push(
          `Baris ${
            skipped + created + 1
          }: Nama, NIP, atau Mata Pelajaran kosong`
        );
        skipped++;
        continue;
      }

      // Cek apakah NIP sudah ada
      const existingTeacher = await prisma.teacherProfile.findFirst({
        where: { nip: String(nip) },
      });

      if (existingTeacher) {
        errors.push(
          `Baris ${skipped + created + 1}: NIP ${nip} sudah terdaftar`
        );
        skipped++;
        continue;
      }

      // Hash password default (menggunakan NIP)
      const hashedPassword = await bcrypt.hash(String(nip), 10);

      try {
        await prisma.user.create({
          data: {
            name: String(name),
            role: "TEACHER",
            password: hashedPassword,
            teacherProfile: {
              create: {
                nip: String(nip),
                subject: String(subject),
                position: position ? String(position) : null,
              },
            },
          },
        });

        created++;
      } catch (error) {
        console.error(`Error creating teacher ${nip}:`, error);
        errors.push(
          `Baris ${skipped + created + 1}: Gagal membuat data untuk ${name}`
        );
        skipped++;
      }
    }

    console.log(`✅ Import selesai, ${created} guru berhasil ditambahkan.`);

    return NextResponse.json({
      message: `✅ Import selesai, ${created} guru berhasil ditambahkan.`,
      summary: {
        total: json.length,
        created,
        skipped,
        errors: errors.length > 0 ? errors.slice(0, 5) : [], // Batasi error yang ditampilkan
      },
    });
  } catch (error) {
    console.error("Error importing teacher data:", error);
    return NextResponse.json(
      { error: "Gagal import data guru" },
      { status: 500 }
    );
  }
}
