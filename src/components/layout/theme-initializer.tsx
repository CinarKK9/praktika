"use client";

import { useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/storage/keys";

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

      document.documentElement.classList.toggle("dark", shouldUseDark);
    } catch {
      // No-op: theme preference is optional.
    }
  }, []);

  return null;
}
