// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Email / Username / NIS", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Masukkan email/username/nis & password");
        }

        // Cari user berdasarkan nis (studentProfile) atau name
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { studentProfile: { nis: credentials.login } },
              { name: credentials.login },
            ],
          },
        });

        if (!user || !user.password) {
          throw new Error("User tidak ditemukan / belum punya password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Password salah");

        // Data user yang akan masuk ke JWT
        return {
          id: user.id,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.role = (user as any).role;
        token.isActive = (user as any).isActive;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        role: token.role as string,
        isActive: token.isActive as boolean,
      };
      return session;
    },
  },
  // tidak pakai pages.signIn/error karena login via modal
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
