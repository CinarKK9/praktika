"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 320;

export function TopLoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const start = () => {
      if (active) {
        return;
      }

      startTimeRef.current = Date.now();
      setActive(true);
      setProgress(10);

      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 88) {
            return prev;
          }

          const step = Math.max(1, (90 - prev) / 8);
          return Math.min(88, prev + step);
        });
      }, 120);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }

      if (/^mailto:|^tel:|^javascript:/i.test(href)) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      start();
    };

    document.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const timeout = setTimeout(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setProgress(100);
      setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 220);
    }, wait);

    return () => clearTimeout(timeout);
  }, [pathname, active]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1.5">
      <div
        className="h-full origin-left rounded-r-full bg-gradient-to-r from-orange-500 via-cyan-500 to-fuchsia-500 shadow-[0_0_18px_rgba(6,182,212,0.45)] transition-[width,opacity] duration-200"
        style={{
          width: `${progress}%`,
          opacity: active || progress > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}