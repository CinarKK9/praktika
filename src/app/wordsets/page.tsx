import Link from "next/link";
import { wordSets } from "@/lib/data/wordsets";

export default function WordSetsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Kelime Setleri</p>
        <h1 className="mt-2 text-3xl font-bold">Seviye ve konuya gore calis</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wordSets.map((setItem) => (
          <article key={setItem.id} className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {setItem.level}
              </span>
              <span className="text-xs text-zinc-600">{setItem.topic}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{setItem.title}</h2>
            <p className="mt-2 text-sm text-zinc-700">{setItem.description}</p>
            <div className="mt-5 flex gap-3">
              <Link className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white" href={`/flashcards/${setItem.id}`}>
                Flashcard
              </Link>
              <Link className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold" href={`/quiz/${setItem.id}`}>
                Quiz
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
