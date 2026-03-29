"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllCards, getWordSetById } from "@/lib/data/wordsets";
import { applySm2, getDefaultReviewState } from "@/lib/sm2/algorithm";
import { readProgress, writeProgress } from "@/lib/storage/local-storage";
import type { Flashcard, StoredProgress } from "@/types";

const INITIAL_PROGRESS: StoredProgress = {
  reviews: {},
  quizAttempts: [],
  lastSetId: undefined,
  autoPronounce: false,
};

type DueCard = {
  card: Flashcard;
  dueAt: number;
};

export default function ReviewPage() {
  const [progress, setProgress] = useState<StoredProgress>(INITIAL_PROGRESS);
  const [nowTs, setNowTs] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(readProgress());
      setNowTs(Date.now());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const dueCards = useMemo<DueCard[]>(() => {
    return getAllCards()
      .map((card) => {
        const review = progress.reviews[card.id];
        if (!review) {
          return null;
        }

        return { card, dueAt: review.nextReviewAt };
      })
      .filter((entry): entry is DueCard => entry !== null)
      .filter((entry) => entry.dueAt <= nowTs)
      .sort((a, b) => a.dueAt - b.dueAt);
  }, [progress, nowTs]);

  if (dueCards.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Card className="bg-white/85 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle>Tekrar Merkezi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-700 dark:text-zinc-300">Harika, şu an tekrar zamanı gelen kart yok.</p>
            <Link
              href="/wordsets"
              className="inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Yeni kart çalış
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const current = dueCards[index]?.card;
  const progressRate = ((index + 1) / dueCards.length) * 100;

  function handleContinue() {
    if (!current) return;

    const latest = readProgress();
    const currentReview = latest.reviews[current.id] ?? getDefaultReviewState(current.id);
    latest.reviews[current.id] = applySm2(currentReview, 4);
    latest.lastSetId = current.setId;
    writeProgress(latest);

    if (index + 1 >= dueCards.length) {
      setDone(true);
      setRevealed(false);
      return;
    }

    setIndex((prev) => prev + 1);
    setRevealed(false);
  }

  if (!current || done) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Card className="border-emerald-200 bg-emerald-50/90 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <CardHeader>
            <CardTitle className="text-3xl font-black dark:text-zinc-100">Tekrar Tamamlandı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-700 dark:text-zinc-300">Bugün gelen tüm tekrar kartlarını bitirdin.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                İlerleme Merkezi
              </Link>
              <Link
                href="/wordsets"
                className="inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                Setlere dön
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const setItem = getWordSetById(current.setId);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-700 dark:text-rose-300">Tekrar Merkezi</p>
          <h1 className="mt-2 text-2xl font-bold dark:text-zinc-100">Bugünkü Tekrarlar</h1>
        </div>
        <Badge className="bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100 dark:bg-rose-900 dark:text-rose-200 dark:hover:bg-rose-900">
          Kalan: {dueCards.length - index}
        </Badge>
      </header>

      <Card className="max-sm:ring-0 bg-white/85 dark:bg-zinc-900/80">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">Kart {index + 1} / {dueCards.length}</Badge>
            <Badge variant="outline">{setItem?.title ?? current.setId}</Badge>
          </div>
          <Progress className="mt-3" value={progressRate} />
          <CardTitle className="mt-4 text-4xl font-black tracking-wide text-zinc-900 dark:text-zinc-100">
            {current.russian}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revealed ? (
            <p className="text-xl text-zinc-700 dark:text-zinc-300">{current.turkish}</p>
          ) : (
            <Button variant="outline" onClick={() => setRevealed(true)}>Anlamı göster</Button>
          )}
        </CardContent>
      </Card>

      {revealed ? (
        <section>
          <Button className="h-auto w-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" onClick={handleContinue}>
            {index + 1 >= dueCards.length ? "Tekrarı bitir" : "Devam et"}
          </Button>
        </section>
      ) : null}
    </main>
  );
}
