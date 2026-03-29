"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { getCardExample, getCardsByIds, getCardsBySetId, getWordSetById } from "@/lib/data/wordsets";
import { applySm2, getDefaultReviewState } from "@/lib/sm2/algorithm";
import { readProgress, writeProgress } from "@/lib/storage/local-storage";
import { speak, stopSpeech } from "@/lib/tts/speech";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SpeakerButtonWrapper } from "@/components/ui/speaker-button-wrapper";
import type { Flashcard, StoredProgress } from "@/types";

function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function FlashcardsPage() {
  const params = useParams<{ setId: string }>();
  const searchParams = useSearchParams();
  const setId = Array.isArray(params.setId) ? params.setId[0] : params.setId;
  const customCardIds = (searchParams.get("cards") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const customSetName = (searchParams.get("name") ?? "").trim();
  const isCustomMode = setId === "custom" && customCardIds.length > 0;

  const setItem =
    getWordSetById(setId) ??
    (isCustomMode
      ? {
          id: "custom",
          title: customSetName || "Custom Flashcards",
          description: "Seçilen kelimelerle oluşturulan özel set.",
          level: "A1",
          topic: "Custom",
        }
      : undefined);

  const [cards, setCards] = useState<Flashcard[]>(() =>
    isCustomMode ? getCardsByIds(customCardIds) : getCardsBySetId(setId),
  );
  const [progress, setProgress] = useState<StoredProgress | null>(null);
  const [viewTimestamp, setViewTimestamp] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    const sourceCards = isCustomMode ? getCardsByIds(customCardIds) : getCardsBySetId(setId);
    setCards(shuffleArray(sourceCards));
    setProgress(readProgress());
    setViewTimestamp(Date.now());
    setIndex(0);
    setRevealed(false);
    setDone(false);
    setShowExample(false);
  }, [setId, isCustomMode, searchParams]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    if (!progress?.autoPronounce || !cards.length || !cards[index]) {
      return;
    }

    speak(cards[index].russian, "ru-RU");
  }, [progress?.autoPronounce, cards, index]);

  if (!setItem) {
    notFound();
  }

  if (!cards.length) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Bu sette henüz kart bulunmuyor</CardTitle>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const current = cards[index];
  const progressRate = ((index + 1) / cards.length) * 100;
  const dueCount = progress
    ? cards.filter((card) => {
        const review = progress.reviews[card.id] ?? getDefaultReviewState(card.id);
        return review.nextReviewAt <= viewTimestamp;
      }).length
    : 0;

  function handleContinue() {
    const latest = readProgress();
    const currentReview = latest.reviews[current.id] ?? getDefaultReviewState(current.id);
    const nextReview = applySm2(currentReview, 4);

    latest.reviews[current.id] = nextReview;
    latest.lastSetId = setId;
    writeProgress(latest);

    if (index + 1 >= cards.length) {
      setDone(true);
      setRevealed(false);
      return;
    }

    setRevealed(false);
    setShowExample(false);
    setIndex((prev) => prev + 1);
  }

  function restartSession() {
    setIndex(0);
    setRevealed(false);
    setDone(false);
    setShowExample(false);
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Card className="animate-pop-in border-emerald-200 bg-emerald-50/90 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <CardHeader>
            <CardTitle className="text-3xl font-black dark:text-zinc-100">Set Tamamlandı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-700 dark:text-zinc-300">
              {setItem.title} setindeki {cards.length} kartın tamamını bitirdin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="interactive-lift" onClick={restartSession}>
                Aynı seti yeniden başlat
              </Button>
              <Link
                href="/"
                className="interactive-lift inline-flex h-8 items-center justify-center rounded-lg border border-input bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                Ana sayfaya dön
              </Link>
              <Link
                href={`/quiz/${setId}`}
                className="interactive-lift inline-flex h-8 items-center justify-center rounded-lg border border-input bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                Quiz’e geç
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="animate-fade-up flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-700">Kart Modu</p>
          <h1 className="mt-2 text-2xl font-bold dark:text-zinc-100">{setItem.title}</h1>
        </div>
        <Badge className="bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-900 dark:text-cyan-200 dark:hover:bg-cyan-900">
          Bugün tekrar: {dueCount}
        </Badge>
      </header>

      <Card key={current.id} className="animate-pop-in max-sm:ring-0 border-cyan-100 bg-white/85 dark:border-cyan-900/60 dark:bg-zinc-900/80">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">Kart {index + 1} / {cards.length}</Badge>
            <Badge variant="outline">Set: {setItem.level}</Badge>
          </div>
          <Progress className="mt-3" value={progressRate} />
          <div className="mt-4 flex items-center justify-between gap-3">
            <CardTitle className="text-4xl font-black tracking-wide text-zinc-900 dark:text-zinc-100">{current.russian}</CardTitle>
            <SpeakerButtonWrapper text={current.russian} language="ru-RU" size="md" />
          </div>
        </CardHeader>
        <CardContent>
          {revealed ? (
            <div className="space-y-3">
              <p className="text-xl text-zinc-700 dark:text-zinc-300">{current.turkish}</p>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setRevealed(true)}>
              Anlamı göster
            </Button>
          )}
        </CardContent>
      </Card>

      {revealed ? (
        <section className="animate-fade-up">
          <Button className="h-auto w-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" onClick={handleContinue}>
            {index + 1 >= cards.length ? "Seti bitir" : "Devam et"}
          </Button>
        </section>
      ) : null}
    </main>
  );
}
