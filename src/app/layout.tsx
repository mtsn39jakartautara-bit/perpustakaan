import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/layouts/shell/app-layout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/providers/authProvider";

export const metadata: Metadata = {
  title: {
    default: "E-Perpustakaan MTSN 39", // fallback kalau page tidak override title
    template: "%s | E-Perpustakaan MTSN 39", // format dinamis
  },
  description:
    "Perpustakaan MTsN 39 adalah pusat literasi yang menyediakan berbagai koleksi buku, layanan informasi, dan ruang baca yang nyaman.",
  authors: [
    { name: "Muhammad Rhaihan Adzani", url: "https://www.rhaihanadzani.site/" },
  ],
  creator: "Muhammad Rhaihan Adzani",
  keywords: ["perpustakaan", "buku", "literasi", "MTsN 39", "Jakarta Utara"],
  category: "Education",
  robots: "index, follow",

  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: "/favicon_io/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/favicon_io/site.webmanifest" }],
  },
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
