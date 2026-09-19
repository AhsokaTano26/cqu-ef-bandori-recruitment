"use client";

import { useCallback, useEffect, useState } from "react";
import { BANDS, type Band } from "@/app/bandori-roster";

export type ShowPhase = "idle" | "enter" | "names" | "hold" | "exit";

/** 单个乐队的时间轴（毫秒，未经 speed 缩放）。 */
const T = {
  enter: 1800,
  names: 2400,
  hold: 4500,
  exit: 5400,
  end: 6800,
} as const;

export type ShowPlayer = {
  band: Band;
  bandIndex: number;
  phase: ShowPhase;
  playing: boolean;
  speed: number;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  setSpeed: (speed: number) => void;
};

/** 系统是否要求减弱动效。SSR 阶段返回 false。 */
function prefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * 一队的起始相位。
 * 减弱动效时直接给 "hold" —— 这是唯一能让立绘与名条立刻可见的相位，
 * 若从 "idle" 起步，跳过动画就等于什么都看不见。
 */
function initialPhase(): ShowPhase {
  return prefersReduced() ? "hold" : "idle";
}

export function useShowPlayer(): ShowPlayer {
  const [bandIndex, setBandIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState<ShowPhase>(initialPhase);

  // 换队必须同时重置相位，否则新一队会带着上一队的相位直接显现
  const goto = useCallback((index: number) => {
    setBandIndex(((index % BANDS.length) + BANDS.length) % BANDS.length);
    setPhase(initialPhase());
  }, []);

  useEffect(() => {
    if (prefersReduced() || !playing) return;

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms / speed));
    };

    at(T.enter, () => setPhase("names"));
    at(T.names, () => setPhase("hold"));
    at(T.hold, () => setPhase("exit"));
    at(T.end, () => goto(bandIndex + 1));

    return () => timers.forEach(window.clearTimeout);
  }, [bandIndex, playing, speed, goto]);

  const next = useCallback(() => goto(bandIndex + 1), [goto, bandIndex]);
  const prev = useCallback(() => goto(bandIndex - 1), [goto, bandIndex]);
  const toggle = useCallback(() => setPlaying((p) => !p), []);

  return {
    band: BANDS[bandIndex],
    bandIndex,
    phase,
    playing,
    speed,
    toggle,
    next,
    prev,
    goTo: goto,
    setSpeed,
  };
}
