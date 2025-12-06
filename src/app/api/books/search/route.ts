import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const searchBy = searchParams.get("searchBy") || "title"; // 'title', 'author', 'isbn', 'bookCode', 'publisher'
    const skip = (page - 1) * limit;

    // Build search conditions based on searchBy parameter
    const whereConditions: any = {};

    if (query.trim()) {
      const searchQuery = query.trim().toLowerCase();

      switch (searchBy) {
        case "title":
          whereConditions.title = {
            contains: searchQuery,
            mode: "insensitive" as const,
          };
          break;

        case "author":
          whereConditions.author = {
            contains: searchQuery,
            mode: "insensitive" as const,
          };
          break;

        case "isbn":
          whereConditions.isbn = {
            contains: searchQuery,
            mode: "insensitive" as const,
          };
          break;

        case "bookCode":
          whereConditions.bookCode = {
            contains: searchQuery,
            mode: "insensitive" as const,
          };
          break;

        case "publisher":
          whereConditions.publisher = {
            contains: searchQuery,
            mode: "insensitive" as const,
          };
          break;

        default:
          // Default: search in multiple fields
          whereConditions.OR = [
            { title: { contains: searchQuery, mode: "insensitive" as const } },
            { author: { contains: searchQuery, mode: "insensitive" as const } },
            { isbn: { contains: searchQuery, mode: "insensitive" as const } },
            {
              bookCode: { contains: searchQuery, mode: "insensitive" as const },
            },
            {
              publisher: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
            {
              abstract: { contains: searchQuery, mode: "insensitive" as const },
            },
          ];
      }
    }

    // Get total count and books
    const [total, books] = await Promise.all([
      prisma.book.count({
        where: whereConditions,
      }),
      prisma.book.findMany({
        where: whereConditions,
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

    // Get statistics
    const statistics = {
      totalBooks: total,
      totalStock: books.reduce((sum, book) => sum + book.stock, 0),
      uniquePublishers: Array.from(
        new Set(books.map((b) => b.publisher).filter(Boolean))
      ).length,
      uniqueYears: Array.from(
        new Set(books.map((b) => b.publishYear).filter(Boolean))
      ).length,
      uniqueLocations: Array.from(
        new Set(books.map((b) => b.locationRack).filter(Boolean))
      ).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        books,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
        statistics,
        searchInfo: {
          query,
          searchBy,
          resultsCount: books.length,
        },
      },
    });
  } catch (error) {
    console.error("Error searching books:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal melakukan pencarian buku",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST method for more complex searches (optional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query = "",
      filters = {},
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = body;

    const skip = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = {};

    // Text search
    if (query.trim()) {
      const searchQuery = query.trim().toLowerCase();
      whereConditions.OR = [
        { title: { contains: searchQuery, mode: "insensitive" as const } },
        { author: { contains: searchQuery, mode: "insensitive" as const } },
        { isbn: { contains: searchQuery, mode: "insensitive" as const } },
        { bookCode: { contains: searchQuery, mode: "insensitive" as const } },
        { publisher: { contains: searchQuery, mode: "insensitive" as const } },
        { abstract: { contains: searchQuery, mode: "insensitive" as const } },
      ];
    }

    // Apply filters
    if (filters.publishYear) {
      whereConditions.publishYear = filters.publishYear;
    }

    if (filters.publisher) {
      whereConditions.publisher = {
        contains: filters.publisher,
        mode: "insensitive" as const,
      };
    }

    if (filters.author) {
      whereConditions.author = {
        contains: filters.author,
        mode: "insensitive" as const,
      };
    }

    if (filters.minStock !== undefined) {
      whereConditions.stock = {
        gte: parseInt(filters.minStock),
      };
    }

    if (filters.maxStock !== undefined) {
      whereConditions.stock = {
        ...whereConditions.stock,
        lte: parseInt(filters.maxStock),
      };
    }

    if (filters.locationRack) {
      whereConditions.locationRack = {
        contains: filters.locationRack,
        mode: "insensitive" as const,
      };
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === "title") {
      orderBy.title = sortOrder;
    } else if (sortBy === "author") {
      orderBy.author = sortOrder;
    } else if (sortBy === "publishYear") {
      orderBy.publishYear = sortOrder;
    } else if (sortBy === "stock") {
      orderBy.stock = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Get total count and books
    const [total, books] = await Promise.all([
      prisma.book.count({
        where: whereConditions,
      }),
      prisma.book.findMany({
        where: whereConditions,
        orderBy,
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

    // Get aggregation data
    const aggregation = await prisma.book.aggregate({
      where: whereConditions,
      _sum: {
        stock: true,
      },
      _avg: {
        publishYear: true,
      },
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        books,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        aggregation: {
          totalStock: aggregation._sum.stock || 0,
          averageYear: aggregation._avg.publishYear,
          count: aggregation._count._all,
        },
      },
    });
  } catch (error) {
    console.error("Error in advanced book search:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal melakukan pencarian buku",
      },
      { status: 500 }
    );
  }
}
