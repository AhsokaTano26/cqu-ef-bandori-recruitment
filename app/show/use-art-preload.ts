"use client";

import { useEffect } from "react";
import { BANDS, artUrl, logoUrl } from "@/app/bandori-roster";

function load(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // 单张失败不阻断整体流程
    img.src = src;
  });
}

/** 先把当前乐队 + 下一队加载完，其余在空闲时并发补齐。 */
export function useArtPreload(currentIndex: number): void {
  useEffect(() => {
    let cancelled = false;

    const current = BANDS[currentIndex];
    const upcoming = BANDS[(currentIndex + 1) % BANDS.length];

    const priority = [
      logoUrl(current),
      ...current.characters.map((c) => artUrl(current, c)),
    ];
    const second = [
      logoUrl(upcoming),
      ...upcoming.characters.map((c) => artUrl(upcoming, c)),
    ];
    const rest = BANDS.filter(
      (_, i) => i !== currentIndex && i !== (currentIndex + 1) % BANDS.length,
    ).flatMap((band) => [logoUrl(band), ...band.characters.map((c) => artUrl(band, c))]);

    const idle = (fn: () => void) => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(fn, { timeout: 2000 });
      } else {
        window.setTimeout(fn, 1200);
      }
    };

    void (async () => {
      await Promise.all(priority.map(load)); // 首屏必需
      if (cancelled) return;
      await Promise.all(second.map(load)); // 下一队，保证切队不空白
      if (cancelled) return;

      idle(() => {
        if (cancelled) return;
        // 并发 4 路，避免一次打满连接数
        const queue = [...rest];
        const workers = Array.from({ length: 4 }, async () => {
          while (queue.length && !cancelled) {
            const src = queue.shift();
            if (src) await load(src);
          }
        });
        void Promise.all(workers);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [currentIndex]);
}
