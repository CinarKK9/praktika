const SET_IMAGE_URLS: Record<string, string> = {
  "a1-gunluk-ifadeler": "/wordsets/a1-gunluk-ifadeler.webp",
  "a1-sehir-ulasim": "/wordsets/a1-sehir-ulasim.webp",
  "a2-is-okul": "/wordsets/a2-is-okul.webp",
  "a2-saglik-gunluk": "/wordsets/a2-saglik-gunluk.webp",
  "a2-yemek-mutfak": "/wordsets/a2-yemek-mutfak.webp",
  "b1-doga-cevre": "/wordsets/b1-doga-cevre.webp",
  "b1-dostluk-diyaloglari": "/wordsets/b1-dostluk-diyaloglari.webp",
  "b1-kultur-turizm": "/wordsets/b1-kultur-turizm.webp",
  "b1-medya-teknoloji": "/wordsets/b1-medya-teknoloji.webp",
  "genel-a1": "/wordsets/a1-gunluk-ifadeler.webp",
  "genel-a2": "/wordsets/a2-is-okul.webp",
  "genel-b1": "/wordsets/b1-kultur-turizm.webp",
};

export function getWordSetImageUrl(setId: string, title: string, topic: string): string {
  return (
    SET_IMAGE_URLS[setId] ??
    "/wordsets/a1-gunluk-ifadeler.webp"
  );
}
