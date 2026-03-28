"use client";

import { useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { getCardsBySetId, getWordSetById } from "@/lib/data/wordsets";
import { readProgress, writeProgress } from "@/lib/storage/local-storage";
import type { Flashcard, QuizAttempt } from "@/types";

type QuizMode = "multiple-choice" | "writing";

function getTimestamp(): number {
  return new Date().getTime();
}

function buildChoices(cards: Flashcard[], current: Flashcard): string[] {
  const distractors = cards
    .filter((card) => card.id !== current.id)
    .slice(0, 3)
    .map((card) => card.turkish);

  const all = [current.turkish, ...distractors];
  return [...all].sort(() => Math.random() - 0.5);
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

  if (!setItem) {
    notFound();
  }

  const current = cards[index];
  const choices = useMemo(() => buildChoices(cards, current), [cards, current]);

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

  function moveNext(nextScore: number) {
    if (index + 1 >= cards.length) {
      finishQuiz(nextScore);
      return;
    }

    setIndex((prev) => prev + 1);
    setTextAnswer("");
  }

  function handleChoiceAnswer(answer: string) {
    const isCorrect = answer === current.turkish;
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    moveNext(nextScore);
  }

  function handleWritingSubmit() {
    const normalizedAnswer = textAnswer.trim().toLowerCase();
    const normalizedTruth = current.turkish.toLowerCase();
    const isCorrect = normalizedAnswer === normalizedTruth;
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    moveNext(nextScore);
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <h1 className="text-3xl font-black">Quiz Tamamlandi</h1>
        <p className="rounded-2xl bg-emerald-100 p-5 text-lg font-semibold text-emerald-900">
          Sonuc: {score} / {cards.length}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-700">Quiz</p>
          <h1 className="mt-2 text-2xl font-bold">{setItem.title}</h1>
        </div>
        <div className="flex gap-2 rounded-full bg-white p-1 shadow">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "multiple-choice" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            onClick={() => setMode("multiple-choice")}
          >
            Coktan secmeli
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "writing" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
            onClick={() => setMode("writing")}
          >
            Yazma
          </button>
        </div>
      </header>

      <section className="rounded-3xl border border-fuchsia-100 bg-white/80 p-8 shadow-lg backdrop-blur">
        <p className="text-sm text-zinc-500">Soru {index + 1} / {cards.length}</p>
        <h2 className="mt-5 text-4xl font-black tracking-wide text-zinc-900">{current.russian}</h2>

        {mode === "multiple-choice" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {choices.map((choice) => (
              <button
                key={choice}
                className="rounded-xl border border-zinc-300 px-4 py-3 text-left text-sm font-semibold hover:bg-zinc-50"
                onClick={() => handleChoiceAnswer(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            <input
              value={textAnswer}
              onChange={(event) => setTextAnswer(event.target.value)}
              placeholder="Turkce karsiligi yaz"
              className="rounded-xl border border-zinc-300 px-4 py-3"
            />
            <button
              className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
              onClick={handleWritingSubmit}
            >
              Cevabi kontrol et
            </button>
          </div>
        )}
      </section>

      <p className="text-sm text-zinc-600">Anlik skor: {score}</p>
    </main>
  );
}
