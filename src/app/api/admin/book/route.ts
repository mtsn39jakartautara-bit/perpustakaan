import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where condition for search
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { bookCode: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search, mode: "insensitive" } },
        { publisher: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count and books
    const [total, books] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          bookCode: true,
          isbn: true,
          title: true,
          publisher: true,
          author: true,
          locationRack: true,
          publishYear: true,
          stock: true,
          abstract: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      books,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST untuk create book manual (optional)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      bookCode,
      isbn,
      title,
      publisher,
      author,
      locationRack,
      publishYear,
      stock,
      abstract,
    } = body;

    // Validasi
    if (!bookCode || !title) {
      return NextResponse.json(
        { error: "Kode buku dan judul wajib diisi" },
        { status: 400 }
      );
    }

    // Cek duplikasi kode buku
    const existingBook = await prisma.book.findFirst({
      where: { bookCode },
    });

    if (existingBook) {
      return NextResponse.json(
        { error: "Kode buku sudah terdaftar" },
        { status: 400 }
      );
    }

    // Create book
    const book = await prisma.book.create({
      data: {
        bookCode,
        isbn: isbn || null,
        title,
        publisher: publisher || null,
        author: author || null,
        locationRack: locationRack || null,
        publishYear: publishYear ? parseInt(publishYear) : null,
        stock: stock ? parseInt(stock) : 0,
        abstract: abstract || null,
      },
    });

    return NextResponse.json({
      message: "Buku berhasil ditambahkan",
      book,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan buku" },
      { status: 500 }
    );
  }
}
