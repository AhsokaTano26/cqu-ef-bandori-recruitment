"use client";

import { ChevronLeft, ChevronRight, Home, Pause, Play } from "lucide-react";
import Link from "next/link";
import { BANDS, artUrl, logoUrl, plaqueColor } from "@/app/bandori-roster";
import { useArtPreload } from "./use-art-preload";
import { useShowPlayer } from "./use-show-player";
import "./stage.css";

const SPEEDS = [0.5, 1, 2];

export default function ShowStage() {
  const { band, bandIndex, phase, playing, speed, toggle, next, prev, goTo, setSpeed } =
    useShowPlayer();

  useArtPreload(bandIndex);

  return (
    <main className="show-page">
      <section
        className="stage"
        data-phase={phase}
        style={{ "--accent": band.accent } as React.CSSProperties}
        aria-label={`${band.name} 登场`}
      >
        {/* 每个子元素都挂 band.slug 作 key：换队时重挂载，CSS 动画自然重置 */}
        <img
          key={`logo-${band.slug}`}
          className="stage-logo"
          src={logoUrl(band)}
          alt={`${band.name} 乐队标志`}
        />
        <div className="lineup" key={`lineup-${band.slug}`}>
          {band.characters.map((character, i) => (
            <div
              className="tile"
              key={character.slug}
              style={
                {
                  "--spread": Math.abs(i - 2),
                  "--plaque": plaqueColor(band, character),
                } as React.CSSProperties
              }
            >
              <img
                className="tile-art"
                src={artUrl(band, character)}
                alt={character.name}
                decoding="async"
              />
              <div className="tile-plaque">
                <span className="tile-name">{character.name}</span>
                {character.stage ? (
                  <span className="tile-stage">{character.stage}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <p className="stage-band-name" key={`name-${band.slug}`}>
          {band.nameJp}
        </p>
      </section>

      <div className="show-controls">
        <button className="show-btn" type="button" onClick={prev} aria-label="上一支乐队">
          <ChevronLeft aria-hidden="true" size={16} />
        </button>
        <button className="show-btn" type="button" onClick={toggle}>
          {playing ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
          {playing ? "暂停" : "播放"}
        </button>
        <button className="show-btn" type="button" onClick={next} aria-label="下一支乐队">
          <ChevronRight aria-hidden="true" size={16} />
        </button>

        {SPEEDS.map((s) => (
          <button
            className="show-btn"
            type="button"
            key={s}
            onClick={() => setSpeed(s)}
            aria-pressed={speed === s}
            style={speed === s ? { background: "#ffffff40" } : undefined}
          >
            {s}×
          </button>
        ))}

        <div className="show-band-picker">
          {BANDS.map((b, i) => (
            <button
              className="picker-item"
              type="button"
              key={b.slug}
              onClick={() => goTo(i)}
              aria-current={i === bandIndex}
              style={{ "--accent": b.accent } as React.CSSProperties}
            >
              {b.name}
            </button>
          ))}
        </div>

        <Link className="show-btn show-back" href="/">
          <Home aria-hidden="true" size={16} /> 返回主页
        </Link>
      </div>
    </main>
  );
}
