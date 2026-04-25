"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { LineChart } from "@/components/ui/line-chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { readProgress, writeProgress } from "@/lib/storage/local-storage";
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

function isSameDay(timestampA: number, timestampB: number): boolean {
  const dateA = new Date(timestampA);
  const dateB = new Date(timestampB);
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
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

function startOfDayTimestamp(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function calculateDailyStreak(
  reviewEntries: Array<{ lastReviewAt: number }>,
  attempts: Array<{ completedAt: number }>,
  nowTs: number,
): number {
  const dayMs = 24 * 60 * 60 * 1000;
  const today = startOfDayTimestamp(nowTs || Date.now());
  const activeDays = new Set<number>();

  reviewEntries.forEach((review) => {
    if (review.lastReviewAt > 0) {
      activeDays.add(startOfDayTimestamp(review.lastReviewAt));
    }
  });

  attempts.forEach((attempt) => {
    if (attempt.completedAt > 0) {
      activeDays.add(startOfDayTimestamp(attempt.completedAt));
    }
  });

  if (activeDays.size === 0) {
    return 0;
  }

  let cursor = activeDays.has(today) ? today : today - dayMs;
  let streak = 0;

  while (activeDays.has(cursor)) {
    streak += 1;
    cursor -= dayMs;
  }

  return streak;
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<StoredProgress>(INITIAL_PROGRESS);
  const [nowTs, setNowTs] = useState(0);
  const [dailyPlan, setDailyPlan] = useState<"sakin" | "orta" | "ciddi">("orta");
  const [settingsSaved, setSettingsSaved] = useState(false);

  const minutesByPlan: Record<"sakin" | "orta" | "ciddi", number> = {
    sakin: 15,
    orta: 30,
    ciddi: 60,
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = readProgress();
      setProgress(stored);

      const inferredPlan =
        typeof stored.dailyGoal === "number"
          ? stored.dailyGoal <= 20
            ? "sakin"
            : stored.dailyGoal <= 40
              ? "orta"
              : "ciddi"
          : stored.dailyIntensity === "dusuk"
            ? "sakin"
            : stored.dailyIntensity === "yogun"
              ? "ciddi"
              : "orta";

      setDailyPlan(inferredPlan);
      setNowTs(Date.now());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const stats = useMemo(() => {
    const reviewEntries = Object.values(progress.reviews);
    const reviewedCards = reviewEntries.length;
    const dueCards = reviewEntries.filter((review) => isDue(review)).length;

    const attempts = [...progress.quizAttempts].sort((a, b) => a.completedAt - b.completedAt);
    const todayAttempts = attempts.filter((attempt) => isSameDay(attempt.completedAt, nowTs));
    const todayAttemptsCount = todayAttempts.length;
    const todayReviewCount = reviewEntries.filter((review) => isSameDay(review.lastReviewAt, nowTs)).length;
    const todayCompleted = todayAttemptsCount + todayReviewCount;
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

    const dailyStreak = calculateDailyStreak(reviewEntries, attempts, nowTs);

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
      todayCompleted,
      totalAttempts: attempts.length,
      averageScorePercent,
      dailyStreak,
      recentAttempts,
      modeCounts,
      setPerformance,
      wordKnowledge,
    };
  }, [progress, nowTs]);

  useEffect(() => {
    if (settingsSaved) {
      const timer = window.setTimeout(() => setSettingsSaved(false), 1600);
      return () => window.clearTimeout(timer);
    }
  }, [settingsSaved]);

  function persistDailySettings() {
    const dailyGoal = minutesByPlan[dailyPlan];
    const nextProgress: StoredProgress = {
      ...progress,
      dailyGoal,
      dailyIntensity: dailyPlan === "sakin" ? "dusuk" : dailyPlan === "orta" ? "orta" : "yogun",
    };
    writeProgress(nextProgress);
    setProgress(nextProgress);
    setSettingsSaved(true);
  }

  const dailyGoal = minutesByPlan[dailyPlan];
  const todayEstimatedMinutes = stats.todayCompleted;
  const dailyProgressPercent = dailyGoal > 0 ? Math.min(100, Math.round((stats.todayCompleted / dailyGoal) * 100)) : 0;
  const hasConfiguredPlan = typeof progress.dailyGoal === "number";
  const dailyPlanLabel =
    dailyPlan === "sakin" ? "Sakin (15 dk/gün)" : dailyPlan === "orta" ? "Orta (30 dk/gün)" : "Ciddi (60 dk/gün)";

  const totalMode = stats.modeCounts["multiple-choice"] + stats.modeCounts.writing;
  const multipleChoiceRatio = totalMode ? Math.round((stats.modeCounts["multiple-choice"] / totalMode) * 100) : 0;
  const writingRatio = totalMode ? 100 - multipleChoiceRatio : 0;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-0 max-sm:gap-0 sm:gap-6 px-0 max-sm:px-0 sm:px-8 py-0 max-sm:py-0 sm:py-8">
      <header className="animate-fade-up flex flex-col items-start gap-2 rounded-3xl max-sm:rounded-none bg-white/80 p-5 max-sm:p-4 shadow-sm max-sm:shadow-none backdrop-blur-sm dark:bg-zinc-900/70">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-700 dark:text-rose-300">Öğrenme Paneli</p>
          <h1 className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">Öğrenme İstatistikleri</h1>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 max-sm:gap-0">
        <Card className="dashboard-card bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Takip Edilen Kart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100"><CountUp value={stats.reviewedCards} /></p>
          </CardContent>
        </Card>

        <Card className="dashboard-card bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Tekrarı Gelen Kart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-rose-700 dark:text-rose-300"><CountUp value={stats.dueCards} /></p>
          </CardContent>
        </Card>

        <Card className="dashboard-card bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Toplam Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-blue-700 dark:text-blue-300"><CountUp value={stats.totalAttempts} /></p>
          </CardContent>
        </Card>

        <Card className="dashboard-card bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Ortalama Başarı</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-blue-700 dark:text-blue-300"><CountUp value={stats.averageScorePercent} prefix="%" /></p>
          </CardContent>
        </Card>

        <Card className="dashboard-card bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Günlük Seri</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-indigo-700 dark:text-indigo-300">
              <CountUp value={stats.dailyStreak} suffix=" gün" />
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3 max-sm:gap-0">
        <Card className="dashboard-card bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 lg:col-span-2 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
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

        <Card className="bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
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
                <div className="dashboard-progress-bar h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${multipleChoiceRatio}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-200">Yazma</span>
                  <span className="text-zinc-600 dark:text-zinc-300">%{writingRatio}</span>
                </div>
                <div className="dashboard-progress-bar h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${writingRatio}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
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
                  <div className="dashboard-progress-bar h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
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

      <Card className="bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none">
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

      <Card
        className={cn(
          "bg-white/80 backdrop-blur-sm dark:bg-zinc-900/70 max-sm:border-0 max-sm:rounded-none max-sm:shadow-none",
          hasConfiguredPlan ? "" : "ring-2 ring-rose-300 dark:ring-rose-700",
        )}
      >
        <CardHeader>
          <CardTitle>Günlük Program Ayarı</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasConfiguredPlan ? (
            <p className="text-sm text-rose-700 dark:text-rose-300">
              İlk kez ayarlamak için günlük planını seç.
            </p>
          ) : null}

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Hedef süre (dk/gün)</span>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  className="inline-flex items-center justify-between rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  aria-label="Hedef süre"
                >
                  {dailyPlanLabel}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={dailyPlan}
                    onValueChange={(value) => setDailyPlan(value as "sakin" | "orta" | "ciddi")}
                  >
                    <DropdownMenuRadioItem value="sakin">Sakin (15 dk/gün)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="orta">Orta (30 dk/gün)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ciddi">Ciddi (60 dk/gün)</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={persistDailySettings}
                className="inline-flex h-10 items-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Ayarları kaydet
              </button>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-zinc-700 dark:text-zinc-200">Bugünkü tahmini süre</span>
              <span className="text-zinc-600 dark:text-zinc-300">
                {todayEstimatedMinutes}/{dailyGoal} dk (%{dailyProgressPercent})
              </span>
            </div>
            <div className="dashboard-progress-bar h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-blue-500" style={{ width: `${dailyProgressPercent}%` }} />
            </div>
          </div>

          {settingsSaved ? <p className="text-xs text-blue-700 dark:text-blue-300">Ayarlar kaydedildi.</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}