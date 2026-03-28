"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { LineChart } from "@/components/ui/line-chart";
import { readProgress } from "@/lib/storage/local-storage";
import { isDue } from "@/lib/sm2/algorithm";
import { getAllCards, getWordSetById } from "@/lib/data/wordsets";
import type { StoredProgress } from "@/types";

const INITIAL_PROGRESS: StoredProgress = {
  reviews: {},
  quizAttempts: [],
  lastSetId: undefined,
  autoPronounce: false,
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getKnowledgeBgColor(score: number): string {
  if (score < 30) return "bg-rose-500";
  if (score < 55) return "bg-rose-400";
  if (score < 75) return "bg-blue-400";
  if (score < 90) return "bg-blue-500";
  return "bg-blue-600";
}

function getSignalBars(score: number): number {
  if (score >= 85) return 4;
  if (score >= 60) return 3;
  if (score >= 35) return 2;
  if (score > 0) return 1;
  return 0;
}

function getKnowledgeLabel(score: number): string {
  if (score >= 85) return "Çok iyi";
  if (score >= 60) return "İyi";
  if (score >= 35) return "Orta";
  return "Kötü";
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<StoredProgress>(INITIAL_PROGRESS);
  const [nowTs, setNowTs] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(readProgress());
      setNowTs(Date.now());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const stats = useMemo(() => {
    const reviewEntries = Object.values(progress.reviews);
    const reviewedCards = reviewEntries.length;
    const dueCards = reviewEntries.filter((review) => isDue(review)).length;

    const attempts = [...progress.quizAttempts].sort((a, b) => a.completedAt - b.completedAt);
    const recentAttempts = attempts.slice(-7);
    const averageScorePercent = attempts.length
      ? Math.round(
          attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) /
            attempts.length,
        )
      : 0;

    const modeCounts = attempts.reduce(
      (acc, attempt) => {
        acc[attempt.mode] += 1;
        return acc;
      },
      { "multiple-choice": 0, writing: 0 },
    );

    const setStats = attempts.reduce<Record<string, { title: string; total: number; correct: number }>>(
      (acc, attempt) => {
        if (!acc[attempt.setId]) {
          const setInfo = getWordSetById(attempt.setId);
          acc[attempt.setId] = {
            title: setInfo?.title ?? attempt.setId,
            total: 0,
            correct: 0,
          };
        }

        acc[attempt.setId].total += attempt.total;
        acc[attempt.setId].correct += attempt.score;
        return acc;
      },
      {},
    );

    const setPerformance = Object.values(setStats)
      .map((entry) => ({
        ...entry,
        percentage: entry.total ? Math.round((entry.correct / entry.total) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    const allCardsById = new Map(getAllCards().map((card) => [card.id, card]));
    const dayMs = 24 * 60 * 60 * 1000;

    const wordKnowledge = reviewEntries
      .map((review) => {
        const card = allCardsById.get(review.cardId);
        if (!card) {
          return null;
        }

        const daysSinceLastReview = (nowTs - review.lastReviewAt) / dayMs;
        const overdueDays = review.nextReviewAt < nowTs ? (nowTs - review.nextReviewAt) / dayMs : 0;

        const baseScore =
          review.repetitions * 16 +
          review.intervalDays * 2.2 +
          ((review.easeFactor - 1.3) / 1.7) * 28;

        // Kelime puani tekrar edilmedikce zamanla azalir.
        const decay = daysSinceLastReview * 2.6 + overdueDays * 1.8;
        const knowledgeScore = Math.round(clamp(baseScore - decay, 0, 100));

        return {
          cardId: review.cardId,
          russian: card.russian,
          turkish: card.turkish,
          knowledgeScore,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.knowledgeScore - a.knowledgeScore)
      .slice(0, 12);

    return {
      reviewedCards,
      dueCards,
      totalAttempts: attempts.length,
      averageScorePercent,
      recentAttempts,
      modeCounts,
      setPerformance,
      wordKnowledge,
    };
  }, [progress, nowTs]);

  const totalMode = stats.modeCounts["multiple-choice"] + stats.modeCounts.writing;
  const multipleChoiceRatio = totalMode ? Math.round((stats.modeCounts["multiple-choice"] / totalMode) * 100) : 0;
  const writingRatio = totalMode ? 100 - multipleChoiceRatio : 0;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-rose-700 dark:text-rose-300">Öğrenme Paneli</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">Öğrenme İstatistikleri</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-white/80 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Takip Edilen Kart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100"><CountUp value={stats.reviewedCards} /></p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Tekrarı Gelen Kart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-rose-700 dark:text-rose-300"><CountUp value={stats.dueCards} /></p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Toplam Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-blue-700 dark:text-blue-300"><CountUp value={stats.totalAttempts} /></p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Ortalama Başarı</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-blue-700 dark:text-blue-300"><CountUp value={stats.averageScorePercent} prefix="%" /></p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-white/80 dark:bg-zinc-900/70 lg:col-span-2">
          <CardHeader>
            <CardTitle>Quiz Performans Grafiği</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentAttempts.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Henüz quiz verisi yok.</p>
            ) : (
              <LineChart
                data={stats.recentAttempts.map((attempt) => ({
                  x: formatDate(attempt.completedAt),
                  y: Math.round((attempt.score / attempt.total) * 100),
                }))}
                height={240}
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/70">
          <CardHeader>
            <CardTitle>Quiz Mod Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-200">Çoktan seçmeli</span>
                  <span className="text-zinc-600 dark:text-zinc-300">%{multipleChoiceRatio}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${multipleChoiceRatio}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-200">Yazma</span>
                  <span className="text-zinc-600 dark:text-zinc-300">%{writingRatio}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${writingRatio}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-white/80 dark:bg-zinc-900/70">
        <CardHeader>
          <CardTitle>Set Bazlı Başarı</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.setPerformance.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Set performansı için quiz çözmeye başla.</p>
          ) : (
            <div className="space-y-3">
              {stats.setPerformance.map((setItem) => (
                <div key={setItem.title}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-200">{setItem.title}</span>
                    <span className="text-zinc-600 dark:text-zinc-300">%{setItem.percentage}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-blue-500"
                      style={{ width: `${setItem.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-zinc-900/70">
        <CardHeader>
          <CardTitle>Kelime Bilme Seviyesi</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.wordKnowledge.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Kelime seviyesi için önce quiz veya kart çalışması yap.</p>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {stats.wordKnowledge.map((word) => {
                const bars = getSignalBars(word.knowledgeScore);
                const barColor = getKnowledgeBgColor(word.knowledgeScore);
                const levelText = getKnowledgeLabel(word.knowledgeScore);

                return (
                  <div key={word.cardId} className="relative rounded-lg bg-white/70 p-2.5 dark:bg-zinc-900/60">
                    <div className="absolute right-2 top-2 flex flex-col items-end gap-0.5">
                      <div className="flex items-end gap-0.5">
                        {[1, 2, 3, 4].map((bar) => (
                          <span
                            key={`${word.cardId}-bar-${bar}`}
                            className={[
                              "inline-block w-[3px] rounded-sm",
                              bar === 1 ? "h-[5px]" : "",
                              bar === 2 ? "h-[7px]" : "",
                              bar === 3 ? "h-[9px]" : "",
                              bar === 4 ? "h-[11px]" : "",
                              bar <= bars ? barColor : "bg-zinc-300/60 dark:bg-zinc-700/70",
                            ].join(" ")}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-medium text-zinc-700 dark:text-zinc-200">{levelText}</span>
                    </div>

                    <p className="pr-11 text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100">{word.russian}</p>
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300">{word.turkish}</p>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Not: Kelime puanı quiz ve tekrar performansına göre artar; tekrar edilmezse zamanla azalır.
          </p>

          <Link
            href={progress.lastSetId ? `/flashcards/${progress.lastSetId}` : "/wordsets"}
            className="mt-4 inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Tekrar Et
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}