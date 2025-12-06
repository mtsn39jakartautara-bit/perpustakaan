// app/profile/types.ts
export interface UserData {
  id: string;
  name: string;
  isActive: boolean;
  role: "STUDENT" | "TEACHER" | "VISITOR" | "ADMIN";
  createdAt: Date;
  studentProfile?: {
    nis: string;
    grade: string;
    major?: string;
  };
  teacherProfile?: {
    nip: string;
    subject: string;
    position?: string;
  };
  visitorProfile?: {
    address?: string;
    phone?: string;
  };
  visits: {
    id: string;
    visitedAt: Date;
  }[];
  borrowings: {
    id: string;
    book: {
      title: string;
      author: string;
    };
    borrowedAt: Date;
    dueDate: Date;
    returnedAt: Date | null;
    status: "active" | "returned" | "overdue";
  }[];
  rewardPoints: {
    points: number;
    rewardCycle: {
      title: string;
      isActive: boolean;
    };
  }[];
}

export interface Book {
  id: string;
  bookCode: string;
  isbn: string | null;
  title: string;
  publisher: string | null;
  author: string | null;
  locationRack: string | null;
  publishYear: number | null;
  stock: number;
  abstract: string | null;
  createdAt: Date;
  updatedAt: Date;
}
