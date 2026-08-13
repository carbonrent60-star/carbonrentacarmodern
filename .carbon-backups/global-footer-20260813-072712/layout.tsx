import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carbon Rent A Car | Avtomobil İcarəsi",
  description:
    "Bakıda premium və rahat avtomobil icarəsi. Carbon Rent A Car ilə avtomobilinizi asanlıqla seçin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" data-scroll-behavior="smooth">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
