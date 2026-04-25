"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllCards, getCardsBySetId, wordSets } from "@/lib/data/wordsets";
import { getWordSetImageUrl } from "@/lib/wordset-images";
import { WordsetPreviewImage } from "@/components/ui/wordset-preview-image";
import { Button } from "@/components/ui/button";
import {
  AlertDialogAction,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { readCustomWordSets, writeCustomWordSets } from "@/lib/storage/local-storage";
import { MoreHorizontal, X } from "lucide-react";
import type { CEFRLevel, CustomWordSet } from "@/types";
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

const customSetStyle = {
  card: "border-blue-200 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/30",
  badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  topic: "text-blue-700 dark:text-blue-300",
};

export default function WordSetsPage() {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | CEFRLevel>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [customSets, setCustomSets] = useState<CustomWordSet[]>([]);
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);
  const [setToDelete, setSetToDelete] = useState<CustomWordSet | null>(null);
  const [customSetName, setCustomSetName] = useState("");
  const [customQuery, setCustomQuery] = useState("");
  const [selectedCustomIds, setSelectedCustomIds] = useState<string[]>([]);

  useEffect(() => {
    setCustomSets(readCustomWordSets());
  }, []);

  const topics = useMemo(() => {
    return ["all", ...Array.from(new Set(wordSets.map((setItem) => setItem.topic)))];
  }, []);

  const filteredWordSets = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    return wordSets.filter((setItem) => {
      if (levelFilter !== "all" && setItem.level !== levelFilter) {
        return false;
      }

      if (topicFilter !== "all" && setItem.topic !== topicFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const setCards = getCardsBySetId(setItem.id);
      const inSetMeta =
        setItem.title.toLocaleLowerCase("tr-TR").includes(normalizedQuery) ||
        setItem.description.toLocaleLowerCase("tr-TR").includes(normalizedQuery) ||
        setItem.topic.toLocaleLowerCase("tr-TR").includes(normalizedQuery);

      const inWords = setCards.some(
        (card) =>
          card.russian.toLocaleLowerCase("tr-TR").includes(normalizedQuery) ||
          card.turkish.toLocaleLowerCase("tr-TR").includes(normalizedQuery),
      );

      return inSetMeta || inWords;
    });
  }, [levelFilter, query, topicFilter]);

  const filteredCustomSets = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedQuery) {
      return customSets;
    }

    const cardsById = new Map(getAllCards().map((card) => [card.id, card]));
    return customSets.filter((setItem) => {
      if (setItem.name.toLocaleLowerCase("tr-TR").includes(normalizedQuery)) {
        return true;
      }

      return setItem.cardIds.some((cardId) => {
        const card = cardsById.get(cardId);
        if (!card) {
          return false;
        }

        return (
          card.russian.toLocaleLowerCase("tr-TR").includes(normalizedQuery) ||
          card.turkish.toLocaleLowerCase("tr-TR").includes(normalizedQuery)
        );
      });
    });
  }, [customSets, query]);

  const selectedLevelLabel =
    levelFilter === "all" ? "Tüm seviyeler" : levelFilter;
  const selectedTopicLabel =
    topicFilter === "all" ? "Tüm konular" : topicFilter;

  const filteredCustomCards = useMemo(() => {
    const normalized = customQuery.trim().toLocaleLowerCase("tr-TR");
    const cards = getAllCards();

    if (!normalized) {
      return cards.slice(0, 40);
    }

    return cards
      .filter(
        (card) =>
          card.russian.toLocaleLowerCase("tr-TR").includes(normalized) ||
          card.turkish.toLocaleLowerCase("tr-TR").includes(normalized),
      )
      .slice(0, 60);
  }, [customQuery]);

  function toggleCustomCard(cardId: string) {
    setSelectedCustomIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    );
  }

  function createCustomSet() {
    const normalizedName = customSetName.trim();
    if (!normalizedName || selectedCustomIds.length === 0) {
      return;
    }

    const nextSet: CustomWordSet = {
      id: `custom-${Date.now()}`,
      name: normalizedName,
      cardIds: selectedCustomIds,
      createdAt: Date.now(),
    };

    const nextSets = [...customSets, nextSet];
    setCustomSets(nextSets);
    writeCustomWordSets(nextSets);

    setCustomSetName("");
    setCustomQuery("");
    setSelectedCustomIds([]);
    setShowCustomCreator(false);
  }

  function closeCustomCreatorWithoutSaving() {
    setShowDiscardWarning(false);
    setShowCustomCreator(false);
    setCustomSetName("");
    setCustomQuery("");
    setSelectedCustomIds([]);
  }

  function handleCustomCreatorOpenChange(nextOpen: boolean) {
    if (!nextOpen && selectedCustomIds.length > 0) {
      setShowDiscardWarning(true);
      return;
    }

    setShowCustomCreator(nextOpen);
  }

  function buildCustomSetHref(basePath: "/flashcards/custom" | "/quiz/custom", setItem: CustomWordSet): string {
    const cardsParam = encodeURIComponent(setItem.cardIds.join(","));
    const nameParam = encodeURIComponent(setItem.name);
    return `${basePath}?cards=${cardsParam}&name=${nameParam}`;
  }

  function formatCustomDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function requestDeleteCustomSet(setItem: CustomWordSet) {
    setSetToDelete(setItem);
  }

  function confirmDeleteCustomSet() {
    if (!setToDelete) {
      return;
    }

    const nextSets = customSets.filter((item) => item.id !== setToDelete.id);
    setCustomSets(nextSets);
    writeCustomWordSets(nextSets);
    setSetToDelete(null);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-0 max-sm:gap-0 sm:gap-6 px-0 max-sm:px-0 sm:px-4 py-0 max-sm:py-0 sm:py-8">
      <header className="animate-fade-up flex flex-col items-start gap-2 rounded-3xl bg-white/38 p-5 shadow-sm backdrop-blur-sm dark:bg-zinc-900/35">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Kelime Setleri</p>
          <h1 className="mt-2 text-3xl font-bold dark:text-zinc-100">Seviye ve konuya göre çalış</h1>
        </div>
        <Link
          href="/review"
          className="interactive-lift rounded-xl border px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-w-[180px] text-center border-indigo-300 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200"
        >
          Tekrar Merkezi
        </Link>
      </header>

      <section className="wordsets-top-border rounded-2xl border-zinc-200 bg-white/38 backgdrop-blur-sm lg:bg-white lg:shadow-sm p-4 dark:border-zinc-800 dark:bg-zinc-900/75">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input
            className="h-9 bg-white"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Set veya kelime ara"
          />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-between rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              aria-label="Seviye filtresi"
            >
              {selectedLevelLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={levelFilter}
                onValueChange={(value) => setLevelFilter(value as "all" | CEFRLevel)}
              >
                <DropdownMenuRadioItem value="all">Tüm seviyeler</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="A1">A1</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="A2">A2</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="B1">B1</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-between rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              aria-label="Konu filtresi"
            >
              {selectedTopicLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup value={topicFilter} onValueChange={setTopicFilter}>
                {topics.map((topic) => (
                  <DropdownMenuRadioItem key={topic} value={topic}>
                    {topic === "all" ? "Tüm konular" : topic}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWordSets.map((setItem, index) => {
          const style = levelStyles[setItem.level];
          const previewImage = getWordSetImageUrl(setItem.id, setItem.title, setItem.topic);

          return (
          <article
            key={setItem.id}
            className={`wordsets-top-border animate-pop-in animate-stagger flex h-full flex-col rounded-2xl border-x-0 border-b-0 p-5 shadow-sm backdrop-blur ${style.card}`}
            style={{ "--stagger-delay": `${80 + index * 60}ms` } as CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                {setItem.level}
              </span>
              <span className={`text-xs ${style.topic}`}>{setItem.topic}</span>
            </div>
            <WordsetPreviewImage
              src={previewImage}
              alt={`${setItem.title} görsel önizleme`}
              className="h-36"
            />
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

        {filteredCustomSets.map((setItem, index) => (
          <article
            key={setItem.id}
            className="wordsets-top-border animate-pop-in animate-stagger flex h-full flex-col rounded-2xl border-x-0 border-b-0 p-5 shadow-sm backdrop-blur border-blue-200 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/30"
            style={{ "--stagger-delay": `${80 + (filteredWordSets.length + index + 1) * 60}ms` } as CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${customSetStyle.badge}`}>
                ÖZEL
              </span>
              <div className="flex items-center gap-2">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger
                    aria-label="Özel set menüsü"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-blue-200 bg-white/75 text-blue-700 transition hover:bg-white dark:border-blue-800 dark:bg-zinc-900/60 dark:text-blue-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Aksiyonlar</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => requestDeleteCustomSet(setItem)}
                      >
                        Seti sil
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="wordsets-image-frame mt-4 h-36 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-100 via-cyan-100 to-sky-100 p-4 dark:border-blue-800 dark:from-blue-950 dark:via-cyan-950 dark:to-sky-950">
              <p className="text-xs uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">Set Özeti</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-md bg-white/70 px-3 py-2 text-sm dark:bg-zinc-900/45">
                  <span className="text-zinc-600 dark:text-zinc-300">Kelime</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{setItem.cardIds.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/70 px-3 py-2 text-sm dark:bg-zinc-900/45">
                  <span className="text-zinc-600 dark:text-zinc-300">Oluşturma</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCustomDate(setItem.createdAt)}</span>
                </div>
              </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold line-clamp-2">{setItem.name}</h2>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Bu seti kart veya quiz modunda çalışabilirsin.</p>
            <div className="mt-auto flex gap-3 pt-6">
              <Link
                className="interactive-lift rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                href={buildCustomSetHref("/flashcards/custom", setItem)}
              >
                Kartlarla Çalış
              </Link>
              <Link
                className="interactive-lift rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700 dark:text-zinc-100"
                href={buildCustomSetHref("/quiz/custom", setItem)}
              >
                Quiz
              </Link>
            </div>
          </article>
        ))}

        <button
          type="button"
          onClick={() => setShowCustomCreator(true)}
          aria-label="Kendi setini oluştur"
          className="custom-set-add-button wordsets-top-border-dashed flex h-full flex-col rounded-2xl border-x-0 border-b-0 border-dashed border-zinc-300 bg-white/65 p-5 text-left shadow-sm backdrop-blur transition hover:border-blue-400 hover:bg-blue-50/40 dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
        >
          <div className="custom-set-add-icon-box flex h-36 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/70">
            <span className="text-6xl font-light text-zinc-500 dark:text-zinc-300">+</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Kendi setini ekle</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">İsim ver, kelime seç ve kendi setini oluştur.</p>
        </button>
      </section>

      <AlertDialog open={showCustomCreator} onOpenChange={handleCustomCreatorOpenChange}>
        <AlertDialogContent
          size="default"
          className="custom-set-modal w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] data-[size=default]:!max-w-6xl sm:data-[size=default]:!max-w-6xl p-0"
        >
          <div className="custom-set-modal-inner flex h-[78vh] min-h-[620px] max-h-[820px] flex-col rounded-xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/60 dark:bg-blue-950/30">
            <AlertDialogCancel
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-9 w-9 rounded-full"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </AlertDialogCancel>
            <AlertDialogHeader className="items-start text-left">
              <AlertDialogTitle className="text-lg font-bold dark:text-zinc-100">Kendi setini ekle</AlertDialogTitle>
            </AlertDialogHeader>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Sete isim ver, kelimeleri seç ve kaydet.</p>

            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Input
                value={customSetName}
                onChange={(event) => setCustomSetName(event.target.value)}
                placeholder="Örnek: İş Görüşmesi Kelimeleri"
              />
              <Input
                value={customQuery}
                onChange={(event) => setCustomQuery(event.target.value)}
                placeholder="Kelime ara (Rusça veya Türkçe)"
              />
              <Button
                onClick={createCustomSet}
                disabled={!customSetName.trim() || selectedCustomIds.length === 0}
              >
                Seti kaydet
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomIds([])}>
                Seçimi temizle
              </Button>
              <span>Seçilen kelime: {selectedCustomIds.length}</span>
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900/70">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCustomCards.map((card) => {
                    const selected = selectedCustomIds.includes(card.id);
                    return (
                      <button
                        key={`${card.id}-${card.setId}`}
                        type="button"
                        onClick={() => toggleCustomCard(card.id)}
                        className={[
                          "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                          selected
                            ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-100"
                            : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
                        ].join(" ")}
                      >
                        <p className="font-semibold">{card.russian}</p>
                        <p className="text-xs opacity-80">{card.turkish}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDiscardWarning} onOpenChange={setShowDiscardWarning}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Kaydetmeden kapatmak istiyor musun?</AlertDialogTitle>
            <AlertDialogDescription>
              Seçili kelimeler kaydedilmedi. Kapatırsan bu seçim kaybolacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 flex justify-end gap-2">
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={closeCustomCreatorWithoutSaving}>
              Kaydetmeden kapat
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(setToDelete)} onOpenChange={(open) => !open && setSetToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Bu özel set silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{setToDelete?.name}</span> kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 flex justify-end gap-2">
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCustomSet}>Seti sil</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
