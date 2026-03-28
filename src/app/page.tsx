"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { wordSets } from "@/lib/data/wordsets";
import { readProgress } from "@/lib/storage/local-storage";
import type { StoredProgress } from "@/types";
import { CountUp } from "@/components/ui/count-up";

const INITIAL_PROGRESS: StoredProgress = {
  reviews: {},
  quizAttempts: [],
  lastSetId: undefined,
  autoPronounce: false,
};

export default function Home() {
  const [progress, setProgress] = useState<StoredProgress>(INITIAL_PROGRESS);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(readProgress());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <section className="animate-fade-up rounded-3xl bg-white/38 p-8 shadow-sm backdrop-blur-sm dark:bg-zinc-900/35">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-700 dark:text-rose-300">Praktika&apos;ya Hoş geldin</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-zinc-900 dark:text-zinc-100">
          Türkiye-Rusya dostluğunu dil ile güçlendiren Rusça öğrenme deneyimi
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
          Seviyene uygun kelime setleriyle çalış, kısa testlerle bilgini pekiştir ve iki ülke arasında iletişimi güçlendirecek pratik bir dil akışıyla ilerle.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="interactive-lift interactive-pulse rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" href="/wordsets">
            Kelime setlerini aç
          </Link>
          {progress.lastSetId ? (
            <Link className="interactive-lift rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-bold dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" href={`/flashcards/${progress.lastSetId}`}>
              Son çalışmaya dön
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl bg-rose-50/85 p-5 shadow-sm dark:bg-rose-950/30">
          <p className="text-sm text-rose-700 dark:text-rose-300">Set sayısı</p>
          <p className="mt-2 text-3xl font-black text-rose-950 dark:text-rose-100"><CountUp value={wordSets.length} /></p>
        </article>
        <article className="rounded-2xl bg-blue-50/85 p-5 shadow-sm dark:bg-blue-950/30">
          <p className="text-sm text-blue-700 dark:text-blue-300">Quiz geçmişi</p>
          <p className="mt-2 text-3xl font-black text-blue-950 dark:text-blue-100"><CountUp value={progress.quizAttempts.length} /></p>
        </article>
        <article className="rounded-2xl bg-indigo-50/85 p-5 shadow-sm dark:bg-indigo-950/30">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">Takip edilen kart</p>
          <p className="mt-2 text-3xl font-black text-indigo-950 dark:text-indigo-100"><CountUp value={Object.keys(progress.reviews).length} /></p>
        </article>
      </section>

      <section className="rounded-3xl bg-white/40 p-6 shadow-sm backdrop-blur-sm dark:bg-zinc-900/35">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-700 dark:text-rose-300">Kültür Köprüsü</p>
            <h2 className="mt-3 text-3xl font-black text-zinc-900 dark:text-zinc-100">Türkiye ve Rusya Arasında Dostluk Odaklı Bir Dil Yolculuğu</h2>
            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
              Bu platform, dili sadece kelime ezberi değil bir kültür buluşması olarak görür. Rusça öğrenirken ortak tarih,
              komşuluk, turizm, ticaret ve günlük iletişim bağlarını da güçlendirecek bir deneyim sunar.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-rose-900 dark:text-rose-200">
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                <span>Türkçe açıklamalı Rusça kelime kartları</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                <span>Gündelik diyaloglara uygun mini quizler</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                <span>Dostluk ve iletişim temasına uygun örnekler</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/55 p-3 dark:bg-zinc-900/55">
            <Image
              src="/rs-tr.jpg"
              alt="Türkiye ve Rusya bayragi"
              width={860}
              height={520}
              className="h-auto w-full rounded-xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white/40 p-6 shadow-sm backdrop-blur-sm dark:bg-zinc-900/35">
        <h2 className="text-xl font-bold dark:text-zinc-100">Dostluk Odaklı Öğrenme Başlıkları</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Selamlama ve tanışma diyalogları</li>
          <li>Turizm ve seyahat konuşmaları</li>
          <li>Ortak mutfak ve kültür kelimeleri</li>
          <li>Ticaret ve iş hayatı ifadeleri</li>
        </ul>
      </section>
      </main>
  );
}
