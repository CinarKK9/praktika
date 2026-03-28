import type { Flashcard, WordSet } from "@/types";

export const wordSets: WordSet[] = [
  {
    id: "a1-gunluk-ifadeler",
    title: "Günlük İfadeler",
    description: "Selamlama ve temel günlük iletişim kelimeleri.",
    level: "A1",
    topic: "İletişim",
  },
  {
    id: "a1-sehir-ulasim",
    title: "Şehir ve Ulaşım",
    description: "Yol tarifi ve toplu taşıma odaklı temel kelimeler.",
    level: "A1",
    topic: "Seyahat",
  },
  {
    id: "a2-yemek-mutfak",
    title: "Yemek ve Mutfak",
    description: "Restoran ve mutfak kullanımı için pratik kelimeler.",
    level: "A2",
    topic: "Yaşam",
  },
  {
    id: "a2-is-okul",
    title: "İş ve Okul",
    description: "İş hayatı ve eğitim bağlamında sık kullanılan kelimeler.",
    level: "A2",
    topic: "Eğitim",
  },
  {
    id: "b1-medya-teknoloji",
    title: "Medya ve Teknoloji",
    description: "Orta seviye dijital dünya ve medya terimleri.",
    level: "B1",
    topic: "Teknoloji",
  },
  {
    id: "b1-dostluk-diyaloglari",
    title: "Dostluk Diyalogları",
    description: "Türkiye-Rusya dostluk temasında günlük konuşma ifadeleri.",
    level: "B1",
    topic: "Diyalog",
  },
  {
    id: "b1-kultur-turizm",
    title: "Kültür ve Turizm",
    description: "Seyahat, şehir ve kültürel paylaşım odaklı kelimeler.",
    level: "B1",
    topic: "Kültür",
  },
];

const cardsBySet: Record<string, Flashcard[]> = {
  "a1-gunluk-ifadeler": [
    { id: "1", setId: "a1-gunluk-ifadeler", russian: "Привет", turkish: "Merhaba" },
    { id: "2", setId: "a1-gunluk-ifadeler", russian: "Спасибо", turkish: "Teşekkür ederim" },
    { id: "3", setId: "a1-gunluk-ifadeler", russian: "Пожалуйста", turkish: "Lütfen / Rica ederim" },
    { id: "4", setId: "a1-gunluk-ifadeler", russian: "Да", turkish: "Evet" },
    { id: "5", setId: "a1-gunluk-ifadeler", russian: "Нет", turkish: "Hayır" },
  ],
  "a1-sehir-ulasim": [
    { id: "6", setId: "a1-sehir-ulasim", russian: "Метро", turkish: "Metro" },
    { id: "7", setId: "a1-sehir-ulasim", russian: "Автобус", turkish: "Otobüs" },
    { id: "8", setId: "a1-sehir-ulasim", russian: "Вокзал", turkish: "Gar" },
    { id: "9", setId: "a1-sehir-ulasim", russian: "Улица", turkish: "Sokak" },
    { id: "10", setId: "a1-sehir-ulasim", russian: "Карта", turkish: "Harita" },
  ],
  "a2-yemek-mutfak": [
    { id: "11", setId: "a2-yemek-mutfak", russian: "Хлеб", turkish: "Ekmek" },
    { id: "12", setId: "a2-yemek-mutfak", russian: "Суп", turkish: "Çorba" },
    { id: "13", setId: "a2-yemek-mutfak", russian: "Вода", turkish: "Su" },
    { id: "14", setId: "a2-yemek-mutfak", russian: "Сыр", turkish: "Peynir" },
    { id: "15", setId: "a2-yemek-mutfak", russian: "Курица", turkish: "Tavuk" },
  ],
  "a2-is-okul": [
    { id: "16", setId: "a2-is-okul", russian: "Работа", turkish: "İş" },
    { id: "17", setId: "a2-is-okul", russian: "Учитель", turkish: "Öğretmen" },
    { id: "18", setId: "a2-is-okul", russian: "Студент", turkish: "Öğrenci" },
    { id: "19", setId: "a2-is-okul", russian: "Урок", turkish: "Ders" },
    { id: "20", setId: "a2-is-okul", russian: "Задание", turkish: "Görev" },
  ],
  "b1-medya-teknoloji": [
    { id: "21", setId: "b1-medya-teknoloji", russian: "Новости", turkish: "Haberler" },
    { id: "22", setId: "b1-medya-teknoloji", russian: "Сайт", turkish: "Web sitesi" },
    { id: "23", setId: "b1-medya-teknoloji", russian: "Приложение", turkish: "Uygulama" },
    { id: "24", setId: "b1-medya-teknoloji", russian: "Сеть", turkish: "Ağ" },
    { id: "25", setId: "b1-medya-teknoloji", russian: "Пароль", turkish: "Şifre" },
  ],
  "b1-dostluk-diyaloglari": [
    { id: "26", setId: "b1-dostluk-diyaloglari", russian: "Дружба", turkish: "Dostluk" },
    { id: "27", setId: "b1-dostluk-diyaloglari", russian: "Сотрудничество", turkish: "İş birliği" },
    { id: "28", setId: "b1-dostluk-diyaloglari", russian: "Встреча", turkish: "Buluşma" },
    { id: "29", setId: "b1-dostluk-diyaloglari", russian: "Приглашение", turkish: "Davet" },
    { id: "30", setId: "b1-dostluk-diyaloglari", russian: "Поддержка", turkish: "Destek" },
  ],
  "b1-kultur-turizm": [
    { id: "31", setId: "b1-kultur-turizm", russian: "Музей", turkish: "Müze" },
    { id: "32", setId: "b1-kultur-turizm", russian: "Площадь", turkish: "Meydan" },
    { id: "33", setId: "b1-kultur-turizm", russian: "Экскурсия", turkish: "Gezi" },
    { id: "34", setId: "b1-kultur-turizm", russian: "Традиция", turkish: "Gelenek" },
    { id: "35", setId: "b1-kultur-turizm", russian: "Гостеприимство", turkish: "Misafirperverlik" },
  ],
};

export function getWordSetById(setId: string): WordSet | undefined {
  return wordSets.find((setItem) => setItem.id === setId);
}

export function getCardsBySetId(setId: string): Flashcard[] {
  return cardsBySet[setId] ?? [];
}

export function getAllCards(): Flashcard[] {
  return Object.values(cardsBySet).flat();
}
