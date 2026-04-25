"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [useLightBackground, setUseLightBackground] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    const root = document.documentElement;

    update();
    media.addEventListener("change", update);

    // Brave can struggle with multiple fixed blurred layers + blend animations.
    // Fall back to a static background for smoother scrolling and interactions.
    const braveRuntime = (navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave;
    if (braveRuntime?.isBrave) {
      braveRuntime
        .isBrave()
        .then((isBrave) => {
          if (isBrave) {
            setUseLightBackground(true);
            root.classList.add("brave-lite");
          }
        })
        .catch(() => {
          // Ignore detection failures and keep default visuals.
        });
    }

    return () => {
      media.removeEventListener("change", update);
      root.classList.remove("brave-lite");
    };
  }, []);

  if (reduceMotion || useLightBackground) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-500/12" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/12" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-blob bg-blob-orange max-sm:hidden" />
      <div className="bg-blob bg-blob-cyan max-sm:hidden" />
      <div className="bg-blob bg-blob-fuchsia max-sm:hidden" />
      <div className="bg-wash max-sm:hidden" />
    </div>
  );
}
