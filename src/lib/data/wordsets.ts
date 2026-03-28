import type { Flashcard, WordSet } from "@/types";

export const wordSets: WordSet[] = [
  {
    id: "a1-gunluk-ifadeler",
    title: "Gunluk Ifadeler",
    description: "Selamlama ve temel gunluk iletisim kelimeleri.",
    level: "A1",
    topic: "Iletisim",
  },
  {
    id: "a1-sehir-ulasim",
    title: "Sehir ve Ulasim",
    description: "Yol tarifi ve toplu tasima odakli temel kelimeler.",
    level: "A1",
    topic: "Seyahat",
  },
  {
    id: "a2-yemek-mutfak",
    title: "Yemek ve Mutfak",
    description: "Restoran ve mutfak kullanimi icin pratik kelimeler.",
    level: "A2",
    topic: "Yasam",
  },
  {
    id: "a2-is-okul",
    title: "Is ve Okul",
    description: "Is hayati ve egitim baglaminda sik kullanilan kelimeler.",
    level: "A2",
    topic: "Egitim",
  },
  {
    id: "b1-medya-teknoloji",
    title: "Medya ve Teknoloji",
    description: "Orta seviye dijital dunya ve medya terimleri.",
    level: "B1",
    topic: "Teknoloji",
  },
];

const cardsBySet: Record<string, Flashcard[]> = {
  "a1-gunluk-ifadeler": [
    { id: "1", setId: "a1-gunluk-ifadeler", russian: "Privet", turkish: "Merhaba" },
    { id: "2", setId: "a1-gunluk-ifadeler", russian: "Spasibo", turkish: "Tesekkur ederim" },
    { id: "3", setId: "a1-gunluk-ifadeler", russian: "Pozhaluysta", turkish: "Lutfen / Rica ederim" },
    { id: "4", setId: "a1-gunluk-ifadeler", russian: "Da", turkish: "Evet" },
    { id: "5", setId: "a1-gunluk-ifadeler", russian: "Net", turkish: "Hayir" },
  ],
  "a1-sehir-ulasim": [
    { id: "6", setId: "a1-sehir-ulasim", russian: "Metro", turkish: "Metro" },
    { id: "7", setId: "a1-sehir-ulasim", russian: "Avtobus", turkish: "Otobus" },
    { id: "8", setId: "a1-sehir-ulasim", russian: "Vokzal", turkish: "Gar" },
    { id: "9", setId: "a1-sehir-ulasim", russian: "Ulitsa", turkish: "Sokak" },
    { id: "10", setId: "a1-sehir-ulasim", russian: "Karta", turkish: "Harita" },
  ],
  "a2-yemek-mutfak": [
    { id: "11", setId: "a2-yemek-mutfak", russian: "Khleb", turkish: "Ekmek" },
    { id: "12", setId: "a2-yemek-mutfak", russian: "Sup", turkish: "Corba" },
    { id: "13", setId: "a2-yemek-mutfak", russian: "Voda", turkish: "Su" },
    { id: "14", setId: "a2-yemek-mutfak", russian: "Syr", turkish: "Peynir" },
    { id: "15", setId: "a2-yemek-mutfak", russian: "Kuritsa", turkish: "Tavuk" },
  ],
  "a2-is-okul": [
    { id: "16", setId: "a2-is-okul", russian: "Rabota", turkish: "Is" },
    { id: "17", setId: "a2-is-okul", russian: "Uchitel", turkish: "Ogretmen" },
    { id: "18", setId: "a2-is-okul", russian: "Student", turkish: "Ogrenci" },
    { id: "19", setId: "a2-is-okul", russian: "Urok", turkish: "Ders" },
    { id: "20", setId: "a2-is-okul", russian: "Zadanie", turkish: "Gorev" },
  ],
  "b1-medya-teknoloji": [
    { id: "21", setId: "b1-medya-teknoloji", russian: "Novosti", turkish: "Haberler" },
    { id: "22", setId: "b1-medya-teknoloji", russian: "Sait", turkish: "Web sitesi" },
    { id: "23", setId: "b1-medya-teknoloji", russian: "Prilozhenie", turkish: "Uygulama" },
    { id: "24", setId: "b1-medya-teknoloji", russian: "Set", turkish: "Ag" },
    { id: "25", setId: "b1-medya-teknoloji", russian: "Parol", turkish: "Sifre" },
  ],
};

export function getWordSetById(setId: string): WordSet | undefined {
  return wordSets.find((setItem) => setItem.id === setId);
}

export function getCardsBySetId(setId: string): Flashcard[] {
  return cardsBySet[setId] ?? [];
}
