"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  easing?: "linear" | "easeOut" | "easeInOut";
};

function applyEasing(progress: number, easing: CountUpProps["easing"]): number {
  if (easing === "linear") {
    return progress;
  }

  if (easing === "easeInOut") {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  // easeOut (default)
  return 1 - Math.pow(1 - progress, 3);
}

export function CountUp({
  value,
  durationMs = 900,
  prefix = "",
  suffix = "",
  easing = "easeOut",
}: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const lastTargetRef = useRef(0);

  const target = useMemo(() => Math.max(0, Math.round(value)), [value]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    const startValue = lastTargetRef.current;
    const delta = target - startValue;
    const adaptiveDuration = Math.min(1600, Math.max(650, Math.abs(delta) * 45, durationMs));

    if (reduceMotion || delta === 0) {
      frameId = window.requestAnimationFrame(() => {
        setDisplay(target);
      });
      lastTargetRef.current = target;

      return () => window.cancelAnimationFrame(frameId);
    }

    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / adaptiveDuration);

      const eased = applyEasing(progress, easing);
      setDisplay(Math.round(startValue + delta * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        lastTargetRef.current = target;
        setDisplay(target);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [target, durationMs, easing]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
