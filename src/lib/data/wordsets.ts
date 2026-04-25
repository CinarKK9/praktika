import type { Flashcard, WordSet } from "@/types";

const CEFR_ORDER: Record<WordSet["level"], number> = {
  A1: 1,
  A2: 2,
  B1: 3,
};

const GENERAL_SET_IDS = {
  A1: "genel-a1",
  A2: "genel-a2",
  B1: "genel-b1",
} as const;

const unsortedWordSets: WordSet[] = [
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
    id: "a1-temel-fiiller",
    title: "Temel Fiiller",
    description: "Günlük konuşmada en sık geçen temel Rusça fiiller.",
    level: "A1",
    topic: "Dilbilgisi",
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
    id: "a2-gunluk-eylemler",
    title: "Günlük Eylemler",
    description: "Rutinde sık yapılan eylemleri anlatan A2 seviye fiiller.",
    level: "A2",
    topic: "Dilbilgisi",
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
  {
    id: "b1-ileri-fiiller",
    title: "İleri Fiiller",
    description: "Fikir belirtme ve tartışma için gerekli B1 seviye fiiller.",
    level: "B1",
    topic: "Dilbilgisi",
  },
  {
    id: "a2-saglik-gunluk",
    title: "Sağlık ve Günlük Bakım",
    description: "Eczane, doktor ve günlük sağlık konuşmaları için kelimeler.",
    level: "A2",
    topic: "Sağlık",
  },
  {
    id: "b1-doga-cevre",
    title: "Doğa ve Çevre",
    description: "Çevre bilinci ve doğa sohbetlerinde kullanılan B1 kelimeleri.",
    level: "B1",
    topic: "Çevre",
  },
  {
    id: GENERAL_SET_IDS.A1,
    title: "Genel A1",
    description: "A1 seviyesindeki tüm setlerden karışık genel çalışma modu.",
    level: "A1",
    topic: "Genel",
  },
  {
    id: GENERAL_SET_IDS.A2,
    title: "Genel A2",
    description: "A2 seviyesindeki tüm setlerden karışık genel çalışma modu.",
    level: "A2",
    topic: "Genel",
  },
  {
    id: GENERAL_SET_IDS.B1,
    title: "Genel B1",
    description: "B1 seviyesindeki tüm setlerden karışık genel çalışma modu.",
    level: "B1",
    topic: "Genel",
  },
];

export const wordSets: WordSet[] = [...unsortedWordSets].sort((a, b) => {
  const levelDiff = CEFR_ORDER[a.level] - CEFR_ORDER[b.level];
  if (levelDiff !== 0) {
    return levelDiff;
  }

  return a.title.localeCompare(b.title, "tr-TR");
});

const cardsBySet: Record<string, Flashcard[]> = {
  "a1-gunluk-ifadeler": [
    { id: "1", setId: "a1-gunluk-ifadeler", russian: "Привет", turkish: "Merhaba" },
    { id: "2", setId: "a1-gunluk-ifadeler", russian: "Спасибо", turkish: "Teşekkür ederim" },
    { id: "3", setId: "a1-gunluk-ifadeler", russian: "Пожалуйста", turkish: "Lütfen / Rica ederim" },
    { id: "4", setId: "a1-gunluk-ifadeler", russian: "Да", turkish: "Evet" },
    { id: "5", setId: "a1-gunluk-ifadeler", russian: "Нет", turkish: "Hayır" },
    { id: "6", setId: "a1-gunluk-ifadeler", russian: "Доброе утро", turkish: "Günaydın" },
    { id: "7", setId: "a1-gunluk-ifadeler", russian: "Добрый вечер", turkish: "İyi akşamlar" },
    { id: "8", setId: "a1-gunluk-ifadeler", russian: "Извините", turkish: "Affedersiniz" },
    { id: "9", setId: "a1-gunluk-ifadeler", russian: "Как дела?", turkish: "Nasılsın?" },
    { id: "10", setId: "a1-gunluk-ifadeler", russian: "Хорошо", turkish: "İyi" },
    { id: "11", setId: "a1-gunluk-ifadeler", russian: "Плохо", turkish: "Kötü" },
    { id: "12", setId: "a1-gunluk-ifadeler", russian: "До свидания", turkish: "Hoşça kal" },
    { id: "13", setId: "a1-gunluk-ifadeler", russian: "До завтра", turkish: "Yarın görüşürüz" },
    { id: "14", setId: "a1-gunluk-ifadeler", russian: "Сейчас", turkish: "Şimdi" },
    { id: "15", setId: "a1-gunluk-ifadeler", russian: "Потом", turkish: "Sonra" },
  ],
  "a1-sehir-ulasim": [
    { id: "16", setId: "a1-sehir-ulasim", russian: "Метро", turkish: "Metro" },
    { id: "17", setId: "a1-sehir-ulasim", russian: "Автобус", turkish: "Otobüs" },
    { id: "18", setId: "a1-sehir-ulasim", russian: "Вокзал", turkish: "Gar" },
    { id: "19", setId: "a1-sehir-ulasim", russian: "Улица", turkish: "Sokak" },
    { id: "20", setId: "a1-sehir-ulasim", russian: "Карта", turkish: "Harita" },
    { id: "21", setId: "a1-sehir-ulasim", russian: "Остановка", turkish: "Durak" },
    { id: "22", setId: "a1-sehir-ulasim", russian: "Билет", turkish: "Bilet" },
    { id: "23", setId: "a1-sehir-ulasim", russian: "Такси", turkish: "Taksi" },
    { id: "24", setId: "a1-sehir-ulasim", russian: "Переход", turkish: "Yaya geçidi" },
    { id: "25", setId: "a1-sehir-ulasim", russian: "Дорога", turkish: "Yol" },
    { id: "26", setId: "a1-sehir-ulasim", russian: "Мост", turkish: "Köprü" },
    { id: "27", setId: "a1-sehir-ulasim", russian: "Площадь", turkish: "Meydan" },
    { id: "28", setId: "a1-sehir-ulasim", russian: "Направо", turkish: "Sağa" },
    { id: "29", setId: "a1-sehir-ulasim", russian: "Налево", turkish: "Sola" },
    { id: "30", setId: "a1-sehir-ulasim", russian: "Прямо", turkish: "Düz" },
  ],
  "a1-temel-fiiller": [
    { id: "136", setId: "a1-temel-fiiller", russian: "Быть", turkish: "Olmak" },
    { id: "137", setId: "a1-temel-fiiller", russian: "Иметь", turkish: "Sahip olmak" },
    { id: "138", setId: "a1-temel-fiiller", russian: "Жить", turkish: "Yaşamak" },
    { id: "139", setId: "a1-temel-fiiller", russian: "Идти", turkish: "Gitmek" },
    { id: "140", setId: "a1-temel-fiiller", russian: "Ехать", turkish: "(Araçla) gitmek" },
    { id: "141", setId: "a1-temel-fiiller", russian: "Делать", turkish: "Yapmak" },
    { id: "142", setId: "a1-temel-fiiller", russian: "Говорить", turkish: "Konuşmak" },
    { id: "143", setId: "a1-temel-fiiller", russian: "Понимать", turkish: "Anlamak" },
    { id: "144", setId: "a1-temel-fiiller", russian: "Смотреть", turkish: "Bakmak / izlemek" },
    { id: "145", setId: "a1-temel-fiiller", russian: "Читать", turkish: "Okumak" },
    { id: "146", setId: "a1-temel-fiiller", russian: "Писать", turkish: "Yazmak" },
    { id: "147", setId: "a1-temel-fiiller", russian: "Работать", turkish: "Çalışmak" },
    { id: "148", setId: "a1-temel-fiiller", russian: "Учиться", turkish: "Öğrenim görmek" },
    { id: "149", setId: "a1-temel-fiiller", russian: "Любить", turkish: "Sevmek" },
    { id: "150", setId: "a1-temel-fiiller", russian: "Знать", turkish: "Bilmek" },
  ],
  "a2-yemek-mutfak": [
    { id: "31", setId: "a2-yemek-mutfak", russian: "Хлеб", turkish: "Ekmek" },
    { id: "32", setId: "a2-yemek-mutfak", russian: "Суп", turkish: "Çorba" },
    { id: "33", setId: "a2-yemek-mutfak", russian: "Вода", turkish: "Su" },
    { id: "34", setId: "a2-yemek-mutfak", russian: "Сыр", turkish: "Peynir" },
    { id: "35", setId: "a2-yemek-mutfak", russian: "Курица", turkish: "Tavuk" },
    { id: "36", setId: "a2-yemek-mutfak", russian: "Рис", turkish: "Pirinç" },
    { id: "37", setId: "a2-yemek-mutfak", russian: "Салат", turkish: "Salata" },
    { id: "38", setId: "a2-yemek-mutfak", russian: "Завтрак", turkish: "Kahvaltı" },
    { id: "39", setId: "a2-yemek-mutfak", russian: "Обед", turkish: "Öğle yemeği" },
    { id: "40", setId: "a2-yemek-mutfak", russian: "Ужин", turkish: "Akşam yemeği" },
    { id: "41", setId: "a2-yemek-mutfak", russian: "Ресторан", turkish: "Restoran" },
    { id: "42", setId: "a2-yemek-mutfak", russian: "Меню", turkish: "Menü" },
    { id: "43", setId: "a2-yemek-mutfak", russian: "Счёт", turkish: "Hesap" },
    { id: "44", setId: "a2-yemek-mutfak", russian: "Вкусно", turkish: "Lezzetli" },
    { id: "45", setId: "a2-yemek-mutfak", russian: "Горячий", turkish: "Sıcak" },
  ],
  "a2-is-okul": [
    { id: "46", setId: "a2-is-okul", russian: "Работа", turkish: "İş" },
    { id: "47", setId: "a2-is-okul", russian: "Учитель", turkish: "Öğretmen" },
    { id: "48", setId: "a2-is-okul", russian: "Студент", turkish: "Öğrenci" },
    { id: "49", setId: "a2-is-okul", russian: "Урок", turkish: "Ders" },
    { id: "50", setId: "a2-is-okul", russian: "Задание", turkish: "Görev" },
    { id: "51", setId: "a2-is-okul", russian: "Офис", turkish: "Ofis" },
    { id: "52", setId: "a2-is-okul", russian: "Коллега", turkish: "İş arkadaşı" },
    { id: "53", setId: "a2-is-okul", russian: "Собрание", turkish: "Toplantı" },
    { id: "54", setId: "a2-is-okul", russian: "Проект", turkish: "Proje" },
    { id: "55", setId: "a2-is-okul", russian: "Перерыв", turkish: "Mola" },
    { id: "56", setId: "a2-is-okul", russian: "Домашнее задание", turkish: "Ödev" },
    { id: "57", setId: "a2-is-okul", russian: "Экзамен", turkish: "Sınav" },
    { id: "58", setId: "a2-is-okul", russian: "Оценка", turkish: "Not" },
    { id: "59", setId: "a2-is-okul", russian: "Расписание", turkish: "Ders programı" },
    { id: "60", setId: "a2-is-okul", russian: "Каникулы", turkish: "Tatil" },
  ],
  "a2-gunluk-eylemler": [
    { id: "151", setId: "a2-gunluk-eylemler", russian: "Вставать", turkish: "Kalkmak" },
    { id: "152", setId: "a2-gunluk-eylemler", russian: "Готовить", turkish: "Hazırlamak / pişirmek" },
    { id: "153", setId: "a2-gunluk-eylemler", russian: "Убирать", turkish: "Toplamak / temizlemek" },
    { id: "154", setId: "a2-gunluk-eylemler", russian: "Покупать", turkish: "Satın almak" },
    { id: "155", setId: "a2-gunluk-eylemler", russian: "Продавать", turkish: "Satmak" },
    { id: "156", setId: "a2-gunluk-eylemler", russian: "Открывать", turkish: "Açmak" },
    { id: "157", setId: "a2-gunluk-eylemler", russian: "Закрывать", turkish: "Kapatmak" },
    { id: "158", setId: "a2-gunluk-eylemler", russian: "Начинать", turkish: "Başlamak" },
    { id: "159", setId: "a2-gunluk-eylemler", russian: "Заканчивать", turkish: "Bitirmek" },
    { id: "160", setId: "a2-gunluk-eylemler", russian: "Звонить", turkish: "Aramak" },
    { id: "161", setId: "a2-gunluk-eylemler", russian: "Встречать", turkish: "Karşılamak / buluşmak" },
    { id: "162", setId: "a2-gunluk-eylemler", russian: "Помогать", turkish: "Yardım etmek" },
    { id: "163", setId: "a2-gunluk-eylemler", russian: "Выбирать", turkish: "Seçmek" },
    { id: "164", setId: "a2-gunluk-eylemler", russian: "Ждать", turkish: "Beklemek" },
    { id: "165", setId: "a2-gunluk-eylemler", russian: "Путешествовать", turkish: "Seyahat etmek" },
  ],
  "b1-medya-teknoloji": [
    { id: "61", setId: "b1-medya-teknoloji", russian: "Новости", turkish: "Haberler" },
    { id: "62", setId: "b1-medya-teknoloji", russian: "Сайт", turkish: "Web sitesi" },
    { id: "63", setId: "b1-medya-teknoloji", russian: "Приложение", turkish: "Uygulama" },
    { id: "64", setId: "b1-medya-teknoloji", russian: "Сеть", turkish: "Ağ" },
    { id: "65", setId: "b1-medya-teknoloji", russian: "Пароль", turkish: "Şifre" },
    { id: "66", setId: "b1-medya-teknoloji", russian: "Пользователь", turkish: "Kullanıcı" },
    { id: "67", setId: "b1-medya-teknoloji", russian: "Настройки", turkish: "Ayarlar" },
    { id: "68", setId: "b1-medya-teknoloji", russian: "Сообщение", turkish: "Mesaj" },
    { id: "69", setId: "b1-medya-teknoloji", russian: "Подписка", turkish: "Abonelik" },
    { id: "70", setId: "b1-medya-teknoloji", russian: "Канал", turkish: "Kanal" },
    { id: "71", setId: "b1-medya-teknoloji", russian: "Запись", turkish: "Kayıt" },
    { id: "72", setId: "b1-medya-teknoloji", russian: "Обновление", turkish: "Güncelleme" },
    { id: "73", setId: "b1-medya-teknoloji", russian: "Безопасность", turkish: "Güvenlik" },
    { id: "74", setId: "b1-medya-teknoloji", russian: "Загрузка", turkish: "İndirme" },
    { id: "75", setId: "b1-medya-teknoloji", russian: "Файл", turkish: "Dosya" },
  ],
  "b1-dostluk-diyaloglari": [
    { id: "76", setId: "b1-dostluk-diyaloglari", russian: "Дружба", turkish: "Dostluk" },
    { id: "77", setId: "b1-dostluk-diyaloglari", russian: "Сотрудничество", turkish: "İş birliği" },
    { id: "78", setId: "b1-dostluk-diyaloglari", russian: "Встреча", turkish: "Buluşma" },
    { id: "79", setId: "b1-dostluk-diyaloglari", russian: "Приглашение", turkish: "Davet" },
    { id: "80", setId: "b1-dostluk-diyaloglari", russian: "Поддержка", turkish: "Destek" },
    { id: "81", setId: "b1-dostluk-diyaloglari", russian: "Разговор", turkish: "Sohbet" },
    { id: "82", setId: "b1-dostluk-diyaloglari", russian: "Доверие", turkish: "Güven" },
    { id: "83", setId: "b1-dostluk-diyaloglari", russian: "Совет", turkish: "Tavsiye" },
    { id: "84", setId: "b1-dostluk-diyaloglari", russian: "Команда", turkish: "Takım" },
    { id: "85", setId: "b1-dostluk-diyaloglari", russian: "Партнёр", turkish: "Ortak" },
    { id: "86", setId: "b1-dostluk-diyaloglari", russian: "Компромисс", turkish: "Uzlaşma" },
    { id: "87", setId: "b1-dostluk-diyaloglari", russian: "Уважение", turkish: "Saygı" },
    { id: "88", setId: "b1-dostluk-diyaloglari", russian: "Тепло", turkish: "Samimiyet" },
    { id: "89", setId: "b1-dostluk-diyaloglari", russian: "Общение", turkish: "İletişim" },
    { id: "90", setId: "b1-dostluk-diyaloglari", russian: "Согласие", turkish: "Anlaşma" },
  ],
  "b1-kultur-turizm": [
    { id: "91", setId: "b1-kultur-turizm", russian: "Музей", turkish: "Müze" },
    { id: "92", setId: "b1-kultur-turizm", russian: "Площадь", turkish: "Meydan" },
    { id: "93", setId: "b1-kultur-turizm", russian: "Экскурсия", turkish: "Gezi" },
    { id: "94", setId: "b1-kultur-turizm", russian: "Традиция", turkish: "Gelenek" },
    { id: "95", setId: "b1-kultur-turizm", russian: "Гостеприимство", turkish: "Misafirperverlik" },
    { id: "96", setId: "b1-kultur-turizm", russian: "Праздник", turkish: "Bayram" },
    { id: "97", setId: "b1-kultur-turizm", russian: "Ремесло", turkish: "El sanatı" },
    { id: "98", setId: "b1-kultur-turizm", russian: "Выставка", turkish: "Sergi" },
    { id: "99", setId: "b1-kultur-turizm", russian: "Театр", turkish: "Tiyatro" },
    { id: "100", setId: "b1-kultur-turizm", russian: "Памятник", turkish: "Anıt" },
    { id: "101", setId: "b1-kultur-turizm", russian: "Маршрут", turkish: "Rota" },
    { id: "102", setId: "b1-kultur-turizm", russian: "Гид", turkish: "Rehber" },
    { id: "103", setId: "b1-kultur-turizm", russian: "Билетер", turkish: "Bilet görevlisi" },
    { id: "104", setId: "b1-kultur-turizm", russian: "История", turkish: "Tarih" },
    { id: "105", setId: "b1-kultur-turizm", russian: "Наследие", turkish: "Miras" },
  ],
  "a2-saglik-gunluk": [
    { id: "106", setId: "a2-saglik-gunluk", russian: "Больница", turkish: "Hastane" },
    { id: "107", setId: "a2-saglik-gunluk", russian: "Аптека", turkish: "Eczane" },
    { id: "108", setId: "a2-saglik-gunluk", russian: "Врач", turkish: "Doktor" },
    { id: "109", setId: "a2-saglik-gunluk", russian: "Лекарство", turkish: "İlaç" },
    { id: "110", setId: "a2-saglik-gunluk", russian: "Температура", turkish: "Ateş" },
    { id: "111", setId: "a2-saglik-gunluk", russian: "Боль", turkish: "Ağrı" },
    { id: "112", setId: "a2-saglik-gunluk", russian: "Голова", turkish: "Baş" },
    { id: "113", setId: "a2-saglik-gunluk", russian: "Горло", turkish: "Boğaz" },
    { id: "114", setId: "a2-saglik-gunluk", russian: "Кашель", turkish: "Öksürük" },
    { id: "115", setId: "a2-saglik-gunluk", russian: "Усталость", turkish: "Yorgunluk" },
    { id: "116", setId: "a2-saglik-gunluk", russian: "Отдых", turkish: "Dinlenme" },
    { id: "117", setId: "a2-saglik-gunluk", russian: "Сон", turkish: "Uyku" },
    { id: "118", setId: "a2-saglik-gunluk", russian: "Здоровье", turkish: "Sağlık" },
    { id: "119", setId: "a2-saglik-gunluk", russian: "Рецепт", turkish: "Reçete" },
    { id: "120", setId: "a2-saglik-gunluk", russian: "Осмотр", turkish: "Muayene" },
  ],
  "b1-doga-cevre": [
    { id: "121", setId: "b1-doga-cevre", russian: "Природа", turkish: "Doğa" },
    { id: "122", setId: "b1-doga-cevre", russian: "Лес", turkish: "Orman" },
    { id: "123", setId: "b1-doga-cevre", russian: "Озеро", turkish: "Göl" },
    { id: "124", setId: "b1-doga-cevre", russian: "Река", turkish: "Nehir" },
    { id: "125", setId: "b1-doga-cevre", russian: "Гора", turkish: "Dağ" },
    { id: "126", setId: "b1-doga-cevre", russian: "Погода", turkish: "Hava durumu" },
    { id: "127", setId: "b1-doga-cevre", russian: "Ветер", turkish: "Rüzgar" },
    { id: "128", setId: "b1-doga-cevre", russian: "Дождь", turkish: "Yağmur" },
    { id: "129", setId: "b1-doga-cevre", russian: "Снег", turkish: "Kar" },
    { id: "130", setId: "b1-doga-cevre", russian: "Климат", turkish: "İklim" },
    { id: "131", setId: "b1-doga-cevre", russian: "Загрязнение", turkish: "Kirlilik" },
    { id: "132", setId: "b1-doga-cevre", russian: "Переработка", turkish: "Geri dönüşüm" },
    { id: "133", setId: "b1-doga-cevre", russian: "Энергия", turkish: "Enerji" },
    { id: "134", setId: "b1-doga-cevre", russian: "Защита", turkish: "Koruma" },
    { id: "135", setId: "b1-doga-cevre", russian: "Будущее", turkish: "Gelecek" },
  ],
  "b1-ileri-fiiller": [
    { id: "166", setId: "b1-ileri-fiiller", russian: "Решать", turkish: "Karar vermek / çözmek" },
    { id: "167", setId: "b1-ileri-fiiller", russian: "Обсуждать", turkish: "Tartışmak" },
    { id: "168", setId: "b1-ileri-fiiller", russian: "Объяснять", turkish: "Açıklamak" },
    { id: "169", setId: "b1-ileri-fiiller", russian: "Развивать", turkish: "Geliştirmek" },
    { id: "170", setId: "b1-ileri-fiiller", russian: "Сравнивать", turkish: "Karşılaştırmak" },
    { id: "171", setId: "b1-ileri-fiiller", russian: "Достигать", turkish: "Ulaşmak" },
    { id: "172", setId: "b1-ileri-fiiller", russian: "Менять", turkish: "Değiştirmek" },
    { id: "173", setId: "b1-ileri-fiiller", russian: "Улучшать", turkish: "İyileştirmek" },
    { id: "174", setId: "b1-ileri-fiiller", russian: "Исследовать", turkish: "Araştırmak" },
    { id: "175", setId: "b1-ileri-fiiller", russian: "Поддерживать", turkish: "Desteklemek" },
    { id: "176", setId: "b1-ileri-fiiller", russian: "Организовывать", turkish: "Organize etmek" },
    { id: "177", setId: "b1-ileri-fiiller", russian: "Планировать", turkish: "Planlamak" },
    { id: "178", setId: "b1-ileri-fiiller", russian: "Продолжать", turkish: "Devam etmek" },
    { id: "179", setId: "b1-ileri-fiiller", russian: "Избегать", turkish: "Kaçınmak" },
    { id: "180", setId: "b1-ileri-fiiller", russian: "Предлагать", turkish: "Önermek" },
  ],
};

export function getWordSetById(setId: string): WordSet | undefined {
  return wordSets.find((setItem) => setItem.id === setId);
}

export function getCardsBySetId(setId: string): Flashcard[] {
  if (setId === GENERAL_SET_IDS.A1) {
    return Object.values(cardsBySet)
      .flat()
      .filter((card) => card.setId.startsWith("a1-"));
  }

  if (setId === GENERAL_SET_IDS.A2) {
    return Object.values(cardsBySet)
      .flat()
      .filter((card) => card.setId.startsWith("a2-"));
  }

  if (setId === GENERAL_SET_IDS.B1) {
    return Object.values(cardsBySet)
      .flat()
      .filter((card) => card.setId.startsWith("b1-"));
  }

  return cardsBySet[setId] ?? [];
}

export function getAllCards(): Flashcard[] {
  return Object.values(cardsBySet).flat();
}

export function getCardsByIds(cardIds: string[]): Flashcard[] {
  const wanted = new Set(cardIds);
  return getAllCards().filter((card) => wanted.has(card.id));
}

export function getCardExample(card: Flashcard): { russian: string; turkish: string } {
  if (card.example) {
    return {
      russian: card.example,
      turkish: `${card.turkish} kelimesi bu cumlede kullaniliyor.`,
    };
  }

  return {
    russian: `Я часто использую слово "${card.russian}" в разговоре.`,
    turkish: `Bu kelimeyi konusmada sik kullanirim: ${card.turkish}.`,
  };
}
