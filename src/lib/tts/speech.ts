/**
 * Simple Web Speech API wrapper - direct and straightforward
 */

export function speak(text: string, language: string = "ru-RU"): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
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

  // Try to find and set Russian voice
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const ruVoice = voices.find((v) => v.lang.toLowerCase().includes("ru"));
    if (ruVoice) {
      utterance.voice = ruVoice;
    }
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
