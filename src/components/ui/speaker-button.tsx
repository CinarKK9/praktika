"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak, stopSpeech } from "@/lib/tts/speech";

type SpeakerButtonProps = {
  text: string;
  language?: string;
  size?: "sm" | "md" | "lg";
};

export function SpeakerButton({
  text,
  language = "ru-RU",
  size = "md",
}: SpeakerButtonProps) {
  const [isSupported] = useState(() => {
    return typeof window !== "undefined" && !!window.speechSynthesis;
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Don't render until client-side
  if (!isSupported) {
    return null;
  }

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setNotice(null);

    try {
      speak(text, language, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: (reason) => {
          setIsSpeaking(false);
          if (reason === "unsupported") {
            setNotice("Tarayicin TTS ozelligini desteklemiyor.");
          } else if (reason === "synthesis-error") {
            setNotice("Seslendirme baslatilamadi.");
          }
        },
        onNotice: (message) => {
          setNotice(message);
          window.setTimeout(() => setNotice(null), 3500);
        },
      });
    } catch (error) {
      console.debug("Speech error:", error);
      setIsSpeaking(false);
      setNotice("Seslendirme baslatilamadi.");
    }
  };

  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizeMap = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <div className="relative inline-flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className={`${sizeMap[size]} p-0 hover:bg-zinc-200 dark:hover:bg-zinc-700`}
        onClick={handleSpeak}
        title={isSpeaking ? "Telaffuzu durdur" : "Telaffuzu dinle"}
        aria-label={isSpeaking ? "Stop pronunciation" : "Listen to pronunciation"}
      >
        {isSpeaking ? (
          <VolumeX size={iconSizeMap[size]} className="text-rose-500" />
        ) : (
          <Volume2 size={iconSizeMap[size]} className="text-zinc-600 dark:text-zinc-300" />
        )}
      </Button>
      {notice ? (
        <p className="pointer-events-none absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-900 shadow-sm dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
