import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  try {
    // Ambil file dari form-data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Baca buffer file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json: any[] = XLSX.utils.sheet_to_json(sheet);

    // console.log("Data dari Excel:", json);
    // console.log(
    //   "Header kolom:",
    //   json.length > 0 ? Object.keys(json[0]) : "No data"
    // );

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Gunakan for loop biasa
    for (let i = 0; i < json.length; i++) {
      const row = json[i];
      const rowNumber = i + 2; // +2 karena header di baris 1, data mulai baris 2

      try {
        // Mapping kolom dari data Excel yang sebenarnya
        // Coba semua kemungkinan nama kolom (case-insensitive)
        const bookCode =
          row["bookCode"] ||
          row["BookCode"] ||
          row["bookcode"] ||
          row["Kode Buku"] ||
          row["kode buku"] ||
          row["Kode_Buku"] ||
          row["kode_buku"];

        const isbn = row["isbn"] || row["ISBN"] || row["Isbn"];

        const title =
          row["title"] ||
          row["Title"] ||
          row["Judul Buku"] ||
          row["Judul Buku"] ||
          row["judul_buku"] ||
          row["Judul"] ||
          row["judul"];

        const publisher =
          row["publisher"] ||
          row["Publisher"] ||
          row["Penerbit"] ||
          row["penerbit"];

        const author =
          row["author"] ||
          row["Author"] ||
          row["Pengarang"] ||
          row["Penulis"] ||
          row["pengarang"] ||
          row["penulis"];

        const locationRack =
          row["locationRack"] ||
          row["locationrack"] ||
          row["LocationRack"] ||
          row["Lokasi Rak"] ||
          row["Lokasi"] ||
          row["lokasi_rak"] ||
          row["Rak"] ||
          row["rak"];

        const publishYear =
          row["publishYear"] ||
          row["publishyear"] ||
          row["PublishYear"] ||
          row["TahunTerbit"] ||
          row["Tahun"] ||
          row["Tahun Terbit"] ||
          row["tahun_terbit"];

        const stock =
          row["stock"] || row["Stock"] || row["Stok"] || row["stok"];

        const abstract =
          row["abstract"] ||
          row["Abstract"] ||
          row["Abstraksi"] ||
          row["abstraksi"] ||
          row["Deskripsi"] ||
          row["deskripsi"];

        // Debug log untuk melihat mapping
        console.log(`Baris ${rowNumber} - Data mentah:`, {
          bookCode,
          isbn,
          title,
          publisher,
          author,
          locationRack,
          publishYear,
          stock,
          abstract,
        });

        // Validasi data yang diperlukan
        if (!bookCode) {
          errors.push(
            `Baris ${rowNumber}: Kode buku tidak boleh kosong (ditemukan: ${JSON.stringify(
              Object.keys(row)
            )})`
          );
          errorCount++;
          continue;
        }

        if (!title) {
          errors.push(
            `Baris ${rowNumber}: Judul buku tidak boleh kosong (ditemukan: ${JSON.stringify(
              Object.keys(row)
            )})`
          );
          errorCount++;
          continue;
        }

        // Clean data
        const cleanBookCode = String(bookCode).trim();
        const cleanTitle = String(title).trim();
        const cleanIsbn = isbn ? String(isbn).trim() : null;
        const cleanPublisher = publisher ? String(publisher).trim() : null;
        const cleanAuthor = author ? String(author).trim() : null;
        const cleanLocationRack = locationRack
          ? String(locationRack).trim()
          : null;
        const cleanPublishYear = publishYear
          ? parseInt(String(publishYear).trim())
          : null;
        const cleanStock = stock ? parseInt(String(stock).trim()) : 0;
        const cleanAbstract = abstract ? String(abstract).trim() : null;

        // Validasi numeric
        if (cleanPublishYear && isNaN(cleanPublishYear)) {
          errors.push(
            `Baris ${rowNumber}: Tahun terbit harus angka, ditemukan: ${publishYear}`
          );
          errorCount++;
          continue;
        }

        if (isNaN(cleanStock)) {
          errors.push(
            `Baris ${rowNumber}: Stok harus angka, ditemukan: ${stock}`
          );
          errorCount++;
          continue;
        }

        // Cek apakah buku dengan kode yang sama sudah ada
        const existingBook = await prisma.book.findFirst({
          where: { bookCode: cleanBookCode },
        });

        if (existingBook) {
          // Update buku yang sudah ada
          await prisma.book.update({
            where: { id: existingBook.id },
            data: {
              isbn: cleanIsbn,
              title: cleanTitle,
              publisher: cleanPublisher,
              author: cleanAuthor,
              locationRack: cleanLocationRack,
              publishYear: cleanPublishYear,
              stock: cleanStock,
              abstract: cleanAbstract,
            },
          });
          successCount++;
          console.log(`📝 Update buku: ${cleanBookCode} - ${cleanTitle}`);
        } else {
          // Buat buku baru
          await prisma.book.create({
            data: {
              bookCode: cleanBookCode,
              isbn: cleanIsbn,
              title: cleanTitle,
              publisher: cleanPublisher,
              author: cleanAuthor,
              locationRack: cleanLocationRack,
              publishYear: cleanPublishYear,
              stock: cleanStock,
              abstract: cleanAbstract,
            },
          });
          successCount++;
          console.log(`✅ Tambah buku: ${cleanBookCode} - ${cleanTitle}`);
        }
      } catch (error) {
        console.error(`Error pada baris ${rowNumber}:`, error);
        const errorMsg =
          error instanceof Error ? error.message : "Error tidak diketahui";

        // Cek error constraint unique
        if (errorMsg.includes("Unique constraint")) {
          errors.push(`Baris ${rowNumber}: Kode buku sudah digunakan`);
        } else {
          errors.push(`Baris ${rowNumber}: ${errorMsg}`);
        }
        errorCount++;
      }
    }

    console.log(
      `📊 Import selesai, ${successCount} buku berhasil diproses, ${errorCount} error.`
    );

    return NextResponse.json({
      message: `Import selesai! ${successCount} buku berhasil diproses, ${errorCount} error.`,
      total: json.length,
      success: successCount,
      failed: errorCount,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    });
  } catch (error) {
    console.error("Error importing book data:", error);
    return NextResponse.json(
      {
        error: "Gagal import data buku",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
