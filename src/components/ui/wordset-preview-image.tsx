"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type WordsetPreviewImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function WordsetPreviewImage({ src, alt, className }: WordsetPreviewImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const imageEl = imageRef.current;
    if (!imageEl) {
      return;
    }

    if (imageEl.complete) {
      if (imageEl.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setFailed(true);
      }
    }
  }, [src]);

  if (failed) {
    return (
      <div
        className={cn(
          "wordsets-image-frame mt-4 flex h-36 w-full items-center justify-center rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 text-xs font-semibold tracking-wide text-zinc-700 ring-1 ring-white/35 dark:from-zinc-800 dark:to-zinc-700 dark:text-zinc-200 dark:ring-white/10",
          className,
        )}
      >
        Gorsel yuklenemedi
      </div>
    );
  }

  return (
    <div className={cn("wordsets-image-frame mt-4 relative h-36 w-full overflow-hidden rounded-xl ring-1 ring-white/35 dark:ring-white/10", className)}>
      {!loaded ? <div className="absolute inset-0 animate-pulse bg-zinc-200/75 dark:bg-zinc-800/75" aria-hidden /> : null}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}
