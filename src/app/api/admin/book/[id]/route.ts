import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const bookId = params.id;

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if book is currently borrowed
    const activeBorrowings = await prisma.borrowing.count({
      where: {
        bookId: bookId,
        status: "active",
      },
    });

    if (activeBorrowings > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus buku yang sedang dipinjam" },
        { status: 400 }
      );
    }

    // Delete the book
    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({
      message: "Buku berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Gagal menghapus buku" },
      { status: 500 }
    );
  }
}

// GET single book (optional untuk edit)
export async function GET(request: Request, { params }: Params) {
  try {
    const bookId = params.id;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
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
    });

    if (!book) {
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}

// PUT update book (optional untuk edit)
export async function PUT(request: Request, { params }: Params) {
  try {
    const bookId = params.id;
    const body = await request.json();

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

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!existingBook) {
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check for duplicate bookCode (except current book)
    if (bookCode && bookCode !== existingBook.bookCode) {
      const duplicateBook = await prisma.book.findFirst({
        where: { bookCode },
      });

      if (duplicateBook) {
        return NextResponse.json(
          { error: "Kode buku sudah digunakan oleh buku lain" },
          { status: 400 }
        );
      }
    }

    // Update book
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        bookCode: bookCode || existingBook.bookCode,
        isbn: isbn !== undefined ? isbn || null : existingBook.isbn,
        title: title || existingBook.title,
        publisher:
          publisher !== undefined ? publisher || null : existingBook.publisher,
        author: author !== undefined ? author || null : existingBook.author,
        locationRack:
          locationRack !== undefined
            ? locationRack || null
            : existingBook.locationRack,
        publishYear:
          publishYear !== undefined
            ? publishYear
              ? parseInt(publishYear)
              : null
            : existingBook.publishYear,
        stock: stock !== undefined ? parseInt(stock) : existingBook.stock,
        abstract:
          abstract !== undefined ? abstract || null : existingBook.abstract,
      },
    });

    return NextResponse.json({
      message: "Buku berhasil diperbarui",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui buku" },
      { status: 500 }
    );
  }
}
