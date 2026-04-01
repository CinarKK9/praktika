import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeInitializer } from "@/components/layout/theme-initializer";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { TopLoadingBar } from "@/components/layout/top-loading-bar";
import { DesktopAnimatedNavbar } from "@/components/layout/desktop-animated-navbar";
import { Analytics } from "@vercel/analytics/next"

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
        <DesktopAnimatedNavbar />
        <Analytics />
        <div className="relative z-10 flex flex-1 flex-col md:pt-24">{children}</div>
      </body>
    </html>
  );
}
