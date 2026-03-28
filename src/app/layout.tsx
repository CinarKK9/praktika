import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SettingsDropdown } from "@/components/layout/settings-dropdown";
import { ThemeInitializer } from "@/components/layout/theme-initializer";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { TopLoadingBar } from "@/components/layout/top-loading-bar";
import { MobileNavMenu } from "@/components/layout/mobile-nav-menu";

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
  title: "Praktika - Rusça Öğren",
  description: "Türkiye-Rusya dostluğunu güçlendirmeye odaklı Rusça flashcard, quiz ve SM-2 tekrar platformu.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", bricolage.variable, spaceGrotesk.variable, "font-sans", geist.variable)}
    >
      <body className="relative min-h-full overflow-x-hidden flex flex-col">
        <ThemeInitializer />
        <TopLoadingBar />
        <AnimatedBackground />
        <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
            <Link href="/" className="flex flex-col leading-tight text-zinc-900 dark:text-zinc-100">
              <span className="text-lg font-black tracking-tight">Praktika</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700 dark:text-rose-300">
                Rusça Öğren
              </span>
            </Link>
            <div className="hidden items-center gap-2 text-sm font-semibold md:flex">
              <Link
                href="/review"
                className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-rose-800 transition hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200 dark:hover:bg-rose-900/45"
              >
                Tekrar Merkezi
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                İlerleme Merkezi
              </Link>
              <SettingsDropdown />
            </div>
            <MobileNavMenu />
          </nav>
        </header>
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
