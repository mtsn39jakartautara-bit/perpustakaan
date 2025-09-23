import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/layouts/shell/app-layout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/providers/authProvider";

export const metadata: Metadata = {
  title: "pustakaan MTsN 39 Jakarta Utara - Pusat Literasi Terbaik",
  description:
    "Perpustakaan MTsN 39 adalah pusat literasi yang menyediakan berbagai koleksi buku, layanan informasi, dan ruang baca yang nyaman.",
  authors: [
    { name: "Muhammad Rhaihan Adzani", url: "https://www.rhaihanadzani.site/" },
  ],
  creator: "Muhammad Rhaihan Adzani",
  keywords: ["perpustakaan", "buku", "literasi", "MTsN 39", "Jakarta Utara"],
  category: "Education",
  robots: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <AppLayout>
            <main>
              {children}
              <SpeedInsights />
            </main>
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
