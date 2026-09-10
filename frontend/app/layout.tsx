import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catálogo Geek — Hub de Entretenimento",
  description:
    "Gerencie seu catálogo de jogos, filmes, séries e livros favoritos. Avalie, descubra e compartilhe sua paixão geek.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="mt-12 py-6 border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <span
              className="text-xs font-semibold text-slate-500"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              CATÁLOGO GEEK © {new Date().getFullYear()} — Hub de Entretenimento Geek
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
