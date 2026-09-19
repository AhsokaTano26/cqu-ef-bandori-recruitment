"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BANDS } from "@/app/bandori-roster";
import { choreography } from "./band-choreography";

/** A single clock keeps cuts, pause, speed and replay in sync without frame renders. */
export function useShowPlayer() {
  const stageRef = useRef<HTMLElement>(null);
  const elapsed = useRef(0);
  const [bandIndex, setBandIndex] = useState(0);
  const [revision, setRevision] = useState(0);
  const [seekVersion, setSeekVersion] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const playingRef = useRef(playing);
  const goTo = useCallback((index: number) => {
    const target = ((index % BANDS.length) + BANDS.length) % BANDS.length;
    elapsed.current = playingRef.current ? 0 : (choreography(BANDS[target].slug).membersAt + 2.3) * 1000;
    setBandIndex(target);
    setRevision((value) => value + 1);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const membersAt = choreography(BANDS[bandIndex].slug).membersAt * 1000;
    const duration = membersAt + 8600;
    const animations = stage.querySelector(".show-scene")?.getAnimations({ subtree: true }) ?? [];
    const scrubber = stage.querySelector<HTMLInputElement>(".show-scrubber");
    animations.forEach((animation) => animation.pause());
    const paint = () => {
      animations.forEach((animation) => { animation.currentTime = elapsed.current; });
      stage.style.setProperty("--progress", `${elapsed.current / duration}`);
      stage.dataset.act = elapsed.current < membersAt ? "intro" : elapsed.current >= duration - 850 ? "outro" : "portraits";
      if (scrubber) scrubber.value = String(elapsed.current / 1000);
    };
    paint();
    if (!playing || reduced) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      if (playing && !reduced && !document.hidden) elapsed.current += Math.min(now - previous, 80) * speed;
      previous = now;
      if (elapsed.current >= duration) { goTo(bandIndex + 1); return; }
      paint();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [bandIndex, revision, seekVersion, playing, speed, reduced, goTo]);

  const duration = choreography(BANDS[bandIndex].slug).membersAt + 8.6;
  const seek = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds)) return;
    elapsed.current = Math.max(0, Math.min(seconds, duration - .01)) * 1000;
    playingRef.current = false;
    setPlaying(false);
    setSeekVersion((value) => value + 1);
  }, [duration]);

  const next = useCallback(() => goTo(bandIndex + 1), [goTo, bandIndex]);
  const prev = useCallback(() => goTo(bandIndex - 1), [goTo, bandIndex]);
  const replay = useCallback(() => {
    playingRef.current = true;
    setPlaying(true);
    goTo(bandIndex);
  }, [goTo, bandIndex]);
  const toggle = useCallback(() => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("button, a, input, textarea, select") || event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.code === "Space") { event.preventDefault(); toggle(); }
      if (event.code === "ArrowRight") { event.preventDefault(); next(); }
      if (event.code === "ArrowLeft") { event.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, toggle]);

  return { stageRef, band: BANDS[bandIndex], bandIndex, revision, playing, speed, reduced, toggle, next, prev, replay, goTo, setSpeed, seek, duration };
}
