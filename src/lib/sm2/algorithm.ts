import type { ReviewState } from "@/types";

export type QualityScore = 0 | 1 | 2 | 3 | 4 | 5;

export function getDefaultReviewState(cardId: string, now = Date.now()): ReviewState {
  return {
    cardId,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewAt: now,
    lastReviewAt: now,
  };
}

export function applySm2(
  current: ReviewState,
  quality: QualityScore,
  now = Date.now(),
): ReviewState {
  let repetitions = current.repetitions;
  let intervalDays = current.intervalDays;
  let easeFactor = current.easeFactor;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);

    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    }
  }

  return {
    ...current,
    repetitions,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    lastReviewAt: now,
    nextReviewAt: now + intervalDays * 24 * 60 * 60 * 1000,
  };
}

export function isDue(state: ReviewState, now = Date.now()): boolean {
  return state.nextReviewAt <= now;
}
