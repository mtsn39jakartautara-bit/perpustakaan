// app/api/auth/[...nextauth]/route.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
  providers: [
    // GOOGLE OAUTH
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Email atau Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Masukkan email/username & password");
        }

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
          user.password as string
        );
        if (!isValid) throw new Error("Password salah");

        // Hanya return data yang diperlukan (bukan seluruh object user)
        return {
          id: user.id,
          role: user.role,
          name: user.name,
          isActive: user.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // if (account?.provider === "google") {
      //   // cek apakah email dari Google sudah ada
      //   const existing = await prisma.user.findUnique({
      //     where: { email: user.email! },
      //   });

      //   if (existing) {
      //     // tambahkan roleId ke user agar ikut ke jwt
      //     (user as any).id = existing.uuid;
      //     (user as any).roleId = existing.roleId;
      //     return true;
      //   }

      //   // belum ada -> buat token untuk bawa email ke /signUp
      //   const token = await new SignJWT({ email: user.email })
      //     .setProtectedHeader({ alg: "HS256" })
      //     .setExpirationTime("10m") // token berlaku 10 menit
      //     .sign(secret);

      //   // redirect ke halaman lengkapi data
      //   return `/signUp?token=${encodeURIComponent(token)}`;
      // }

      // credentials sudah diverifikasi di authorize()
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roleId = (user as any).roleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
