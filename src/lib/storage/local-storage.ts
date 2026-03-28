import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { StoredProgress } from "@/types";

const DEFAULT_PROGRESS: StoredProgress = {
  reviews: {},
  quizAttempts: [],
  lastSetId: undefined,
  autoPronounce: false,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readProgress(): StoredProgress {
  if (!isBrowser()) {
    return DEFAULT_PROGRESS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      reviews: parsed.reviews ?? {},
      quizAttempts: parsed.quizAttempts ?? [],
      lastSetId: parsed.lastSetId,
      autoPronounce: parsed.autoPronounce ?? false,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function writeProgress(progress: StoredProgress): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}
