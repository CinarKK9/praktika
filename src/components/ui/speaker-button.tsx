"use client";

import { useEffect, useRef, useState } from "react";
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    // Auto-stop after 10 seconds
    timeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
    }, 10000);

    try {
      speak(text, language);
    } catch (error) {
      console.debug("Speech error:", error);
      setIsSpeaking(false);
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
  );
}
