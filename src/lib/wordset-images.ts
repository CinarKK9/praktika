const SET_QUERY_HINTS: Record<string, string[]> = {
  "a1-gunluk-ifadeler": ["people", "conversation"],
  "a1-sehir-ulasim": ["city", "transport"],
  "a1-temel-fiiller": ["action", "daily-life"],
  "a2-gunluk-eylemler": ["routine", "activity"],
  "a2-is-okul": ["office", "school"],
  "a2-saglik-gunluk": ["health", "clinic"],
  "a2-yemek-mutfak": ["food", "kitchen"],
  "b1-doga-cevre": ["nature", "environment"],
  "b1-dostluk-diyaloglari": ["friendship", "teamwork"],
  "b1-ileri-fiiller": ["discussion", "strategy"],
  "b1-kultur-turizm": ["travel", "culture"],
  "b1-medya-teknoloji": ["technology", "media"],
  "genel-a1": ["language", "beginner"],
  "genel-a2": ["learning", "intermediate"],
  "genel-b1": ["communication", "advanced"],
};

function toApiToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function getWordSetImageUrl(setId: string, title: string, topic: string): string {
  const hints = SET_QUERY_HINTS[setId] ?? [toApiToken(topic), toApiToken(title)].filter(Boolean);
  const query = hints.join(",");

  // LoremFlickr returns themed random photos; lock keeps each set visually stable.
  return `https://loremflickr.com/1200/675/${query}?lock=${encodeURIComponent(setId)}`;
}
