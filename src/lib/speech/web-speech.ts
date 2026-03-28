export function getRussianVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  return voices.filter((voice) => voice.lang.toLowerCase().startsWith("ru"));
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function hydrateVoices(): void {
  if (!canSpeak()) {
    return;
  }

  // Bazi tarayicilarda ses listesi ilk cagrida bos gelir; bu cagrilar listeyi tetikler.
  window.speechSynthesis.getVoices();
}

export function canSpeakRussian(): boolean {
  if (!canSpeak()) {
    return false;
  }

  return getRussianVoices().length > 0;
}

export function onVoicesChanged(callback: () => void): () => void {
  if (!canSpeak()) {
    return () => undefined;
  }

  window.speechSynthesis.addEventListener("voiceschanged", callback);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", callback);
}

function pickRussianVoice(): SpeechSynthesisVoice | undefined {
  const russianVoices = getRussianVoices();

  return (
    russianVoices.find((voice) => voice.lang.toLowerCase() === "ru-ru") ??
    russianVoices.find((voice) => voice.lang.toLowerCase().startsWith("ru"))
  );
}

export function speakRussian(text: string): void {
  if (!canSpeak()) {
    return;
  }

  const russianVoice = pickRussianVoice();
  if (!russianVoice) {
    // Rus sesi yoksa farkli dilde yanlis telaffuz cikarmak yerine sessizce cik.
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = russianVoice.lang;
  utterance.rate = 0.9;
  utterance.voice = russianVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
