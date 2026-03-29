"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MobileSettingsPanel } from "@/components/layout/settings-dropdown";

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        <span className="relative inline-flex h-5 w-5 items-center justify-center">
          <Menu
            className={cn(
              "absolute h-5 w-5 transition-all duration-300 ease-out",
              open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
            )}
          />
          <X
            className={cn(
              "absolute h-5 w-5 transition-all duration-300 ease-out",
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
            )}
          />
        </span>
      </button>

      <div
        className={cn(
          "fixed inset-x-0 z-30 border-b border-zinc-200 bg-white shadow-none backdrop-blur-none transition-all duration-300 ease-out dark:border-white/10 dark:bg-zinc-950/95 dark:shadow-xl dark:backdrop-blur-md",
          open ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none",
        )}
        style={{ top: 48 }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 pb-4 pt-3 sm:px-8">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">Menü</p>
          <Link
            href="/review"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-md px-3 py-2 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-100 dark:text-indigo-200 dark:hover:bg-indigo-900/30"
          >
            Tekrar Merkezi
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-md px-3 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-blue-900/30"
          >
            İlerleme Merkezi
          </Link>
          <MobileSettingsPanel />
        </div>
      </div>

      {open ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-transparent dark:bg-black/20"
        />
      ) : null}
    </div>
  );
}
