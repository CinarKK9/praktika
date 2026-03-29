import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { CustomWordSet, StoredProgress } from "@/types";

const DEFAULT_PROGRESS: StoredProgress = {
  reviews: {},
  quizAttempts: [],
  lastSetId: undefined,
  autoPronounce: false,
  dailyGoal: undefined,
  dailyIntensity: undefined,
  writingTolerance: "normal",
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
      dailyGoal: parsed.dailyGoal,
      dailyIntensity: parsed.dailyIntensity,
      writingTolerance: parsed.writingTolerance ?? "normal",
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

export function clearProgress(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.progress);
}

export function readCustomWordSets(): CustomWordSet[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.customWordSets);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Partial<CustomWordSet>[];
    return parsed
      .filter((item): item is Partial<CustomWordSet> & { id: string; name: string; cardIds: string[] } => {
        return Boolean(item?.id) && Boolean(item?.name) && Array.isArray(item?.cardIds);
      })
      .map((item) => ({
        id: item.id,
        name: item.name,
        cardIds: item.cardIds,
        createdAt: typeof item.createdAt === "number" ? item.createdAt : Date.now(),
      }));
  } catch {
    return [];
  }
}

export function writeCustomWordSets(sets: CustomWordSet[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.customWordSets, JSON.stringify(sets));
}
