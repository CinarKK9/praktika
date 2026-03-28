import Link from "next/link";
import { wordSets } from "@/lib/data/wordsets";
import type { CEFRLevel } from "@/types";
import type { CSSProperties } from "react";

const levelStyles: Record<
  CEFRLevel,
  { card: string; badge: string; topic: string }
> = {
  A1: {
    card: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/30",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    topic: "text-emerald-700 dark:text-emerald-300",
  },
  A2: {
    card: "border-cyan-200 bg-cyan-50/70 dark:border-cyan-900/60 dark:bg-cyan-950/30",
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    topic: "text-cyan-700 dark:text-cyan-300",
  },
  B1: {
    card: "border-orange-200 bg-orange-50/70 dark:border-orange-900/60 dark:bg-orange-950/30",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    topic: "text-orange-700 dark:text-orange-300",
  },
};

export default function WordSetsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Kelime Setleri</p>
        <h1 className="mt-2 text-3xl font-bold dark:text-zinc-100">Seviye ve konuya göre çalış</h1>
        <Link
          href="/review"
          className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
        >
          Tekrar Merkezi
        </Link>
      </div>

      <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wordSets.map((setItem, index) => {
          const style = levelStyles[setItem.level];

          return (
          <article
            key={setItem.id}
            className={`animate-pop-in animate-stagger flex h-full flex-col rounded-2xl border p-5 shadow-sm backdrop-blur ${style.card}`}
            style={{ "--stagger-delay": `${80 + index * 60}ms` } as CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                {setItem.level}
              </span>
              <span className={`text-xs ${style.topic}`}>{setItem.topic}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{setItem.title}</h2>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{setItem.description}</p>
            <div className="mt-auto flex gap-3 pt-6">
              <Link className="interactive-lift rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900" href={`/flashcards/${setItem.id}`}>
                Kartlarla Çalış
              </Link>
              <Link className="interactive-lift rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700 dark:text-zinc-100" href={`/quiz/${setItem.id}`}>
                Quiz
              </Link>
            </div>
          </article>
          );
        })}
      </section>
    </main>
  );
}
