import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rusca Ogrenme Platformu",
  description: "Turk kullanicilar icin Rusca flashcard, quiz ve SM-2 tekrar platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={cn("h-full", "antialiased", bricolage.variable, spaceGrotesk.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-md">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
            <Link href="/" className="text-lg font-black tracking-tight text-zinc-900">
              Rusca Ogrenme
            </Link>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link href="/wordsets" className="rounded-lg px-3 py-2 hover:bg-zinc-100">
                Setler
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
