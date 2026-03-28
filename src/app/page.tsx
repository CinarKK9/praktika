"use client";

import Link from "next/link";
import { useMemo } from "react";
import { wordSets } from "@/lib/data/wordsets";
import { readProgress } from "@/lib/storage/local-storage";

export default function Home() {
  const progress = useMemo(() => readProgress(), []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
      <section className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-700">Rusca Ogrenme Platformu</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-zinc-900">
          Turkce arayuzlu flashcard, SM-2 tekrar ve quiz akisi
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-700">
          Yarisma odakli MVP su an localStorage ile calisir. Sonraki adimda Supabase katmani eklenebilir.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white" href="/wordsets">
            Kelime setlerini ac
          </Link>
          {progress.lastSetId ? (
            <Link className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-bold" href={`/flashcards/${progress.lastSetId}`}>
              Son calismaya don
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-orange-100 bg-orange-50/80 p-5">
          <p className="text-sm text-orange-700">Set sayisi</p>
          <p className="mt-2 text-3xl font-black text-orange-950">{wordSets.length}</p>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-5">
          <p className="text-sm text-emerald-700">Quiz gecmisi</p>
          <p className="mt-2 text-3xl font-black text-emerald-950">{progress.quizAttempts.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-5">
          <p className="text-sm text-cyan-700">Takip edilen kart</p>
          <p className="mt-2 text-3xl font-black text-cyan-950">{Object.keys(progress.reviews).length}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Bu sprintte gelenler</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700">
          <li>Flashcard modu ve SM-2 hesaplama</li>
          <li>Quiz: coktan secmeli + yazma</li>
          <li>Web Speech API ile Rusca telaffuz</li>
          <li>localStorage tabanli ilerleme takibi</li>
        </ul>
      </section>
    </main>
  );
}
