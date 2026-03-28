"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  if (reduceMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-500/12" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/12" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-blob bg-blob-orange" />
      <div className="bg-blob bg-blob-cyan" />
      <div className="bg-blob bg-blob-fuchsia" />
      <div className="bg-wash" />
    </div>
  );
}
