/**
 * Simple Web Speech API wrapper - direct and straightforward
 */

type SpeakOptions = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (reason?: string) => void;
  onNotice?: (message: string) => void;
};

function pickVoice(language: string): { voice?: SpeechSynthesisVoice; matchedByLanguage: boolean } {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    return { voice: undefined, matchedByLanguage: false };
  }

  const normalized = language.toLowerCase();
  const languageMatch =
    voices.find((voice) => voice.lang.toLowerCase() === normalized) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(normalized.split("-")[0]));

  if (languageMatch) {
    return { voice: languageMatch, matchedByLanguage: true };
  }

  const fallbackVoice = voices.find((voice) => voice.default) ?? voices[0];
  return { voice: fallbackVoice, matchedByLanguage: false };
}

export function speak(text: string, language: string = "ru-RU", options?: SpeakOptions): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    options?.onError?.("unsupported");
    return;
  }

  if (!text.trim()) {
    options?.onError?.("empty-text");
    return;
  }

  // Cancel any existing speech
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = () => options?.onError?.("synthesis-error");

  const voiceSelection = pickVoice(language);
  if (voiceSelection.voice) {
    utterance.voice = voiceSelection.voice;
  }

  const languageBase = language.toLowerCase().split("-")[0];
  if (!voiceSelection.matchedByLanguage && languageBase === "ru") {
    options?.onNotice?.("Bu cihazda Rusca TTS sesi bulunamadi. Varsayilan ses kullaniliyor.");
  }

  // Speak immediately
  window.speechSynthesis.speak(utterance);
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

export function stopSpeech(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
