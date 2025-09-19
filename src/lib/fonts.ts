import { Gorditas, Playfair_Display, Work_Sans } from "next/font/google";

export const fontPlayFair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playFair",
  display: "swap",
});
export const FontGorditas = Gorditas({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-gorditas",
  display: "swap",
});

export const fontWorkSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-workSans",
  display: "swap",
});
