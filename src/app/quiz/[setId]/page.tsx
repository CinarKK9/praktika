"use client";

import { useState, type CSSProperties } from "react";
import { notFound, useParams } from "next/navigation";
import { getCardsBySetId, getWordSetById } from "@/lib/data/wordsets";
import { applySm2, getDefaultReviewState } from "@/lib/sm2/algorithm";
import { readProgress, writeProgress } from "@/lib/storage/local-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { Flashcard, QuizAttempt } from "@/types";

type QuizMode = "multiple-choice" | "writing";

type QuizQuestionResult = {
  cardId: string;
  russian: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  mode: QuizMode;
  explanation: string;
};

function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }

  const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#a855f7", "#f97316"];
  const pieces = Array.from({ length: 46 }, (_, index) => index);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
      {pieces.map((piece) => {
        const angle = (piece / pieces.length) * Math.PI * 2;
        const distance = 110 + (piece % 7) * 18;
        const xSpread = Math.cos(angle) * distance;
        const ySpread = Math.sin(angle) * distance - (56 + (piece % 5) * 10);
        const sizeScale = 0.75 + (piece % 4) * 0.15;
        const rotation = (piece % 2 === 0 ? 1 : -1) * (300 + (piece % 9) * 40);
        const delay = (piece % 12) * 26;
        const duration = 1200 + (piece % 8) * 90;

        return (
          <span
            key={`confetti-${piece}`}
            className="confetti-piece"
            style={{
              left: "50%",
              top: "56%",
              backgroundColor: colors[piece % colors.length],
              animationDelay: `${delay}ms`,
              animationDuration: `${duration}ms`,
              ["--x-spread" as string]: `${xSpread}px`,
              ["--y-spread" as string]: `${ySpread}px`,
              ["--piece-rotation" as string]: `${rotation}deg`,
              ["--piece-scale" as string]: `${sizeScale}`,
            } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

function getTimestamp(): number {
  return new Date().getTime();
}

function buildChoices(cards: Flashcard[], current: Flashcard): string[] {
  const sortedDistractors = cards
    .filter((card) => card.id !== current.id)
    .map((card) => {
      const sameInitial = card.turkish.charAt(0).toLocaleLowerCase("tr-TR") === current.turkish.charAt(0).toLocaleLowerCase("tr-TR");
      const lengthDelta = Math.abs(card.turkish.length - current.turkish.length);
      const score = (sameInitial ? 0 : 2) + lengthDelta;

      return { card, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((item) => item.card);

  const all = [current, ...sortedDistractors];
  const shift = Number(current.id) % all.length;

  return all.slice(shift).concat(all.slice(0, shift)).map((card) => card.turkish);
}

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getEditDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[a.length][b.length];
}

export default function QuizPage() {
  const params = useParams<{ setId: string }>();
  const setId = Array.isArray(params.setId) ? params.setId[0] : params.setId;

  const setItem = getWordSetById(setId);
  const cards = getCardsBySetId(setId);

  const [mode, setMode] = useState<QuizMode>("multiple-choice");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [textAnswer, setTextAnswer] = useState("");
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<QuizQuestionResult[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [awaitingNext, setAwaitingNext] = useState(false);

  if (!setItem) {
    notFound();
  }

  if (!cards.length) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Bu sette henüz kart bulunmuyor</CardTitle>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const current = cards[index];
  const choices = buildChoices(cards, current);
  const progressRate = ((index + 1) / cards.length) * 100;
  const successRate = cards.length > 0 ? score / cards.length : 0;
  const showCelebration = successRate >= 0.8;

  function finishQuiz(finalScore: number) {
    const completedAt = getTimestamp();

    const attempt: QuizAttempt = {
      id: `${completedAt}`,
      setId,
      mode,
      score: finalScore,
      total: cards.length,
      completedAt,
    };

    const progress = readProgress();
    progress.quizAttempts = [attempt, ...progress.quizAttempts].slice(0, 50);
    progress.lastSetId = setId;
    writeProgress(progress);

    setDone(true);
  }

  function updateReviewFromQuiz(isCorrect: boolean, questionMode: QuizMode) {
    const quality = isCorrect ? (questionMode === "writing" ? 5 : 4) : 2;
    const latest = readProgress();
    const currentReview = latest.reviews[current.id] ?? getDefaultReviewState(current.id);
    const nextReview = applySm2(currentReview, quality);

    latest.reviews[current.id] = nextReview;
    latest.lastSetId = setId;
    writeProgress(latest);
  }

  function moveNext() {
    if (index + 1 >= cards.length) {
      finishQuiz(score);
      return;
    }

    setIndex((prev) => prev + 1);
    setTextAnswer("");
    setSelectedChoice(null);
    setAwaitingNext(false);
  }

  function registerAnswer(userAnswer: string, isCorrect: boolean, questionMode: QuizMode, explanation: string) {
    updateReviewFromQuiz(isCorrect, questionMode);

    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    setResults((prev) => [
      ...prev,
      {
        cardId: current.id,
        russian: current.russian,
        correctAnswer: current.turkish,
        userAnswer,
        isCorrect,
        mode: questionMode,
        explanation,
      },
    ]);
    setAwaitingNext(true);
  }

  function handleChoiceAnswer(answer: string) {
    if (awaitingNext) {
      return;
    }

    setSelectedChoice(answer);
    const isCorrect = answer === current.turkish;
    const explanation = isCorrect
      ? "Doğru seçim. Bu kartın tekrar aralığı uzatılacak."
      : `Bu seçenek doğru değildi. Doğru cevap: ${current.turkish}`;
    registerAnswer(answer, isCorrect, "multiple-choice", explanation);
  }

  function handleWritingSubmit() {
    if (awaitingNext) {
      return;
    }

    const rawAnswer = textAnswer.trim();
    const normalizedAnswer = normalizeText(rawAnswer);
    const normalizedTruth = normalizeText(current.turkish);
    const distance = getEditDistance(normalizedAnswer, normalizedTruth);
    const tolerance = normalizedTruth.length > 6 ? 2 : normalizedTruth.length > 3 ? 1 : 0;
    const isCorrect = distance <= tolerance;

    const explanation = isCorrect
      ? distance === 0
        ? "Doğru yazdın."
        : "Yazımın çok yakındı, doğru kabul edildi."
      : `Yanlış cevap. Doğru yazım: ${current.turkish}`;

    registerAnswer(rawAnswer, isCorrect, "writing", explanation);
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <ConfettiBurst show={showCelebration} />
        <Card className="animate-pop-in relative overflow-hidden border-zinc-200 bg-white/90 dark:border-zinc-800 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-3xl font-black dark:text-zinc-100">Quiz Tamamlandı</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-zinc-200 bg-white/90 dark:border-zinc-800 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-xl font-bold dark:text-zinc-100">Soru Sonuçları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((result, questionIndex) => (
              <div
                key={`${result.cardId}-${questionIndex}`}
                className={[
                  "rounded-xl border p-4",
                  result.isCorrect
                    ? "border-emerald-300 bg-emerald-50/90 dark:border-emerald-700 dark:bg-emerald-900/20"
                    : "border-rose-300 bg-rose-50/90 dark:border-rose-700 dark:bg-rose-900/20",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {questionIndex + 1}. {result.russian}
                  </p>
                  <Badge variant={result.isCorrect ? "secondary" : "destructive"}>
                    {result.isCorrect ? "Doğru" : "Yanlış"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Senin cevabın: <span className="font-semibold">{result.userAnswer || "(boş)"}</span>
                </p>
                {!result.isCorrect ? (
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    Doğru cevap: <span className="font-semibold">{result.correctAnswer}</span>
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="animate-fade-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-700">Quiz</p>
          <h1 className="mt-2 text-2xl font-bold dark:text-zinc-100">{setItem.title}</h1>
        </div>
        <div className="relative grid grid-cols-2 rounded-full border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div
            className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-zinc-900 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] dark:bg-zinc-100"
            style={{
              width: "calc(50% - 0.25rem)",
              transform: mode === "writing" ? "translateX(100%)" : "translateX(0%)",
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className={[
              "relative z-10 rounded-full px-4 transition-colors duration-300",
              mode === "multiple-choice"
                ? "text-white hover:bg-transparent hover:text-white focus-visible:bg-transparent dark:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-900"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
            ].join(" ")}
            onClick={() => setMode("multiple-choice")}
          >
            Çoktan seçmeli
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={[
              "relative z-10 rounded-full px-4 transition-colors duration-300",
              mode === "writing"
                ? "text-white hover:bg-transparent hover:text-white focus-visible:bg-transparent dark:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-900"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
            ].join(" ")}
            onClick={() => setMode("writing")}
          >
            Yazma
          </Button>
        </div>
      </header>

      <Card key={current.id} className="animate-pop-in border-fuchsia-100 bg-white/85 dark:border-fuchsia-900/60 dark:bg-zinc-900/80">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">Soru {index + 1} / {cards.length}</Badge>
          </div>
          <Progress className="mt-3" value={progressRate} />
          <CardTitle className="mt-4 text-4xl font-black tracking-wide text-zinc-900 dark:text-zinc-100">{current.russian}</CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "multiple-choice" ? (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {choices.map((choice) => (
                  <Button
                    key={choice}
                    variant="outline"
                    disabled={awaitingNext}
                    className={[
                      "h-auto cursor-pointer justify-start rounded-xl px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed",
                      awaitingNext && choice === current.turkish
                        ? "border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-100"
                        : "",
                      awaitingNext && selectedChoice === choice && choice !== current.turkish
                        ? "border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-600 dark:bg-rose-900/40 dark:text-rose-100"
                        : "",
                      awaitingNext && selectedChoice !== choice && choice !== current.turkish
                        ? "opacity-60"
                        : "",
                    ].join(" ")}
                    onClick={() => handleChoiceAnswer(choice)}
                  >
                    {choice}
                  </Button>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Input
                value={textAnswer}
                onChange={(event) => setTextAnswer(event.target.value)}
                placeholder="Türkçe karşılığı yaz"
                disabled={awaitingNext}
              />
              <Button className="interactive-lift" onClick={handleWritingSubmit} disabled={awaitingNext || !textAnswer.trim()}>
                Cevabı kontrol et
              </Button>

            </div>
          )}

          {awaitingNext ? (
            <Button className="mt-4 interactive-lift" onClick={moveNext}>
              {index + 1 >= cards.length ? "Sonuçları gör" : "Devam et"}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
