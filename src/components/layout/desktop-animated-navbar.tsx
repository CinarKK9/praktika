"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SettingsDropdown } from "@/components/layout/settings-dropdown";
import { MobileNavMenu } from "@/components/layout/mobile-nav-menu";

export function DesktopAnimatedNavbar() {
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastYRef.current;

      // Hem desktop hem mobil: aşağı kayınca gizle, yukarı kayınca göster.
      if (currentY < 16) {
        setHidden(false);
      } else if (delta > 8) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }
      lastYRef.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-md transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1.2,0.36,1)] dark:border-white/10 dark:bg-zinc-950/80",
        "md:fixed md:left-1/2 md:top-4 md:w-[calc(100%-4rem)] md:max-w-[68rem] md:-translate-x-1/2 md:rounded-full md:border md:border-white/70 md:bg-white/82 md:shadow-[0_16px_40px_-22px_rgba(15,23,42,0.6)] md:backdrop-blur-xl dark:md:border-white/15 dark:md:bg-zinc-950/72",
        hidden ? "-translate-y-[150%]" : "translate-y-0",
      )}
      style={{ marginBottom: 0 }}
    >
      <nav className="mx-auto flex w-full items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex items-center justify-center h-8 gap-2 text-zinc-900 dark:text-zinc-100">
          <span className="leading-none text-lg font-black tracking-tight">Praktika</span>
          <span aria-hidden className="leading-none text-xs text-zinc-400 dark:text-zinc-500">-</span>
          <span className="align-middle leading-none text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700 dark:text-rose-300">
            Rusça Öğren
          </span>
        </Link>
        <div className="hidden items-center gap-2 text-sm font-semibold md:flex">
          <SettingsDropdown />
        </div>
        <MobileNavMenu />
      </nav>
    </header>
  );
}
