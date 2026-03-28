"use client";

import { useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { getCardsBySetId, getWordSetById } from "@/lib/data/wordsets";
import { applySm2, getDefaultReviewState, type QualityScore } from "@/lib/sm2/algorithm";
import { readProgress, writeProgress } from "@/lib/storage/local-storage";
import { canSpeak, speakRussian } from "@/lib/speech/web-speech";

export default function FlashcardsPage() {
  const params = useParams<{ setId: string }>();
  const setId = Array.isArray(params.setId) ? params.setId[0] : params.setId;

  const setItem = getWordSetById(setId);
  const cards = getCardsBySetId(setId);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [viewTimestamp] = useState<number>(() => Date.now());

  if (!setItem) {
    notFound();
  }

  const current = cards[index];

  const progress = useMemo(() => readProgress(), []);
  const dueCount = cards.filter((card) => {
    const review = progress.reviews[card.id] ?? getDefaultReviewState(card.id);
    return review.nextReviewAt <= viewTimestamp;
  }).length;

  function handleAnswer(quality: QualityScore) {
    const latest = readProgress();
    const currentReview = latest.reviews[current.id] ?? getDefaultReviewState(current.id);
    const nextReview = applySm2(currentReview, quality);

    latest.reviews[current.id] = nextReview;
    latest.lastSetId = setId;
    writeProgress(latest);

    setRevealed(false);
    setIndex((prev) => (prev + 1) % cards.length);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-700">Flashcard Modu</p>
          <h1 className="mt-2 text-2xl font-bold">{setItem.title}</h1>
        </div>
        <p className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">
          Bugun tekrar: {dueCount}
        </p>
      </header>

      <section className="rounded-3xl border border-cyan-100 bg-white/80 p-8 shadow-lg backdrop-blur">
        <p className="text-sm text-zinc-500">Kart {index + 1} / {cards.length}</p>
        <h2 className="mt-5 text-4xl font-black tracking-wide text-zinc-900">{current.russian}</h2>

        {revealed ? (
          <p className="mt-5 text-xl text-zinc-700">{current.turkish}</p>
        ) : (
          <button className="mt-5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold" onClick={() => setRevealed(true)}>
            Anlami goster
          </button>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            onClick={() => speakRussian(current.russian)}
            disabled={!canSpeak()}
          >
            Telaffuzu dinle
          </button>
        </div>
      </section>

      {revealed ? (
        <section className="grid gap-3 sm:grid-cols-3">
          <button className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-900" onClick={() => handleAnswer(2)}>
            Zorlandim
          </button>
          <button className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-900" onClick={() => handleAnswer(3)}>
            Orta
          </button>
          <button className="rounded-xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-900" onClick={() => handleAnswer(5)}>
            Kolay
          </button>
        </section>
      ) : null}
    </main>
  );
}
