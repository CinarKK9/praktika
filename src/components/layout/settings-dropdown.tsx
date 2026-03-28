"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { clearProgress } from "@/lib/storage/local-storage";

function isDarkThemeEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (savedTheme) {
    return savedTheme === "dark";
  }

  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function SettingsDropdown() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  function toggleTheme() {
    if (typeof window === "undefined") {
      return;
    }

    const isDark = isDarkThemeEnabled();
    const nextTheme = isDark ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  }

  function confirmResetProgress() {
    if (typeof window === "undefined") {
      return;
    }

    clearProgress();
    window.location.reload();
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label="Ayarlar"
          title="Ayarlar"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-input bg-background transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Settings2 className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Genel</DropdownMenuLabel>
            <DropdownMenuItem onClick={toggleTheme}>Temayı değiştir</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Veri</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setResetDialogOpen(true)}
              className="text-rose-700 focus:text-rose-700"
            >
              İlerlemeyi sıfırla
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen} modal={false}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>İlerleme sıfırlansın mı?</AlertDialogTitle>
            <AlertDialogDescription>
              Tüm öğrenme verileri silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetProgress}>
              Evet, sıfırla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MobileSettingsPanel() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  function toggleTheme() {
    if (typeof window === "undefined") {
      return;
    }

    const isDark = isDarkThemeEnabled();
    const nextTheme = isDark ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  }

  function confirmResetProgress() {
    if (typeof window === "undefined") {
      return;
    }

    clearProgress();
    window.location.reload();
  }

  return (
    <>
      <div className="mx-3 mt-2 border-t border-zinc-200 pt-2 dark:border-zinc-700">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">Ayarlar</p>
        <button
          type="button"
          onClick={toggleTheme}
          className="mt-2 block w-full rounded-md px-0 py-1.5 text-left text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Temayı değiştir
        </button>
        <button
          type="button"
          onClick={() => setResetDialogOpen(true)}
          className="mt-1 block w-full rounded-md px-0 py-1.5 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-900/30"
        >
          İlerlemeyi sıfırla
        </button>
      </div>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen} modal={false}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>İlerleme sıfırlansın mı?</AlertDialogTitle>
            <AlertDialogDescription>
              Tüm öğrenme verileri silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetProgress}>
              Evet, sıfırla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
