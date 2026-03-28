import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8">
      <div className="text-center space-y-3">
        <h1 className="text-6xl font-black text-zinc-900 dark:text-zinc-100">404</h1>
        <p className="text-sm uppercase tracking-[0.2em] text-rose-700 dark:text-rose-300">Sayfa Bulunamadı</p>
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
          Aradığınız sayfa mevcut değil
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
          Türkçe-Rusça öğrenme platformunda bu adresle hiçbir şey yok. Lütfen ana sayfaya dönüp devam edin.
        </p>
      </div>

      <Card className="w-full border-zinc-200 bg-white/80 p-8 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/" className="group">
              <Button className="interactive-lift w-full">
                Ana Sayfaya Dön
              </Button>
            </Link>
            <Link href="/wordsets" className="group">
              <Button variant="outline" className="w-full hover:border-blue-400">
                Setlere Göz At
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sizi ana sayfaya döndüreceğiz.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-8 text-center space-y-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Praktika - Rusça Öğren
        </p>
      </div>
    </main>
  );
}
