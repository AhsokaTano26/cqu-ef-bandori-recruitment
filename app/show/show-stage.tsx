"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";
import { BANDS, artUrl, logoUrl, plaqueColor } from "@/app/bandori-roster";
import { useArtPreload } from "./use-art-preload";
import { useShowPlayer } from "./use-show-player";
import { LogoReveal } from "./logo-reveal";
import { choreography } from "./band-choreography";
import "./stage.css";
import "./logo-reveal.css";
import "./band-effects.css";

const DIRECTIONS = ["burst", "slash", "burst", "float", "noir", "float", "slash", "drift", "noir", "burst", "drift", "slash"];
// Original chapter captions, not official band taglines.
const WORDS = ["キラキラ、ドキドキ。", "いつも通りの、その先へ。", "世界を笑顔に！", "夢は、ここから。", "頂点へ、咲き誇れ。", "響け、私たちの音。", "世界を、撃ち抜け。", "迷子でも、進め。", "さあ、月の舞台へ。", "夢の、その向こうへ。", "この音で、つながる。", "鳴らせ、私たちの今。"];

export default function ShowStage() {
  const { stageRef, band, bandIndex, revision, playing, speed, reduced, toggle, next, prev, replay, goTo, setSpeed, seek, duration } = useShowPlayer();
  useArtPreload(bandIndex);
  const direction = choreography(band.slug);

  function moveCamera(event: PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== "mouse" || !playing) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--camera-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 16}px`);
    event.currentTarget.style.setProperty("--camera-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 10}px`);
  }

  return (
    <main className="show-page" ref={stageRef} data-direction={DIRECTIONS[bandIndex]} data-playing={playing} data-reduced={reduced}
      data-reveal={direction.style}
      style={{ "--accent": band.accent, "--dissolve-at": `${direction.dissolveAt}s`, "--members-at": `${direction.membersAt}s`, "--outro-at": `${direction.membersAt + 7.75}s` } as CSSProperties}>
      <header className="show-header">
        <Link href="/" className="show-brand" aria-label="返回 EF 邦多利主页">EF<span> × </span>BanG Dream!</Link>
        <span className="show-edition">THE BAND CHRONICLES <span>／</span> 12 BANDS. ONE UNIVERSE.</span>
        <Link href="/" className="show-home">返回主页 <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </header>
      <section className="stage" aria-label={`${band.name} 乐队演出`} onPointerMove={moveCamera}
        onPointerLeave={(event) => { event.currentTarget.style.setProperty("--camera-x", "0px"); event.currentTarget.style.setProperty("--camera-y", "0px"); }}>
        <div className="show-scene" key={`${band.slug}-${revision}`}>
          <div className="scene-paper" aria-hidden="true" /><div className="scene-halftone" aria-hidden="true" />
          <div className="scene-cross scene-cross-one" aria-hidden="true">✳</div><div className="scene-cross scene-cross-two" aria-hidden="true">✳</div>
          <div className="scene-type" aria-hidden="true"><span>{band.name}</span><span>{band.name}</span></div>
          <div className="scene-orbit" aria-hidden="true" />
          <div className="scene-topline"><span>CHAPTER / {String(bandIndex + 1).padStart(2, "0")}</span><span>少女たちの音楽は、止まらない。</span></div>
          <div className="lineup">
            {band.characters.map((character, i) => (
              <article className="character-panel" key={character.slug} style={{ "--i": i, "--order": direction.order[i], "--lean": `${(i - 2) * 3}deg`, "--plaque": plaqueColor(band, character) } as CSSProperties}>
                <div className="panel-back"><span>0{i + 1}</span></div>
                <div className="character-window"><img className="character-art" src={artUrl(band, character)} alt={character.name} decoding="async" /></div>
                <div className="character-caption"><span className="character-number">0{i + 1}</span><div><h2>{character.name}</h2>{character.stage && <small>{character.stage}</small>}</div><span className="caption-star" aria-hidden="true">✦</span></div>
              </article>
            ))}
          </div>
          <div className="scene-title"><span className="scene-eyebrow">NOW SHOWING <i /> BAND / {String(bandIndex + 1).padStart(2, "0")}</span><h1>{band.name}</h1><p>{WORDS[bandIndex]}</p></div>
          <img className="scene-logo" src={logoUrl(band)} alt={`${band.name} 标志`} />
          <div className="scene-stamp" aria-hidden="true">音を鳴らせ。<span>MAKE SOME NOISE!</span></div>
          <LogoReveal src={logoUrl(band)} name={band.name} slug={band.slug} />
          <div className="chapter-wipe" aria-hidden="true" />
        </div>
        <div className="scene-bottomline"><span>重庆大学 EF 邦多利马群</span><span>YOUR NEXT FAVORITE BAND IS HERE ↗</span></div>
      </section>
      <section className="show-console" aria-label="演出控制台">
        <div className="show-transport">
          <div className="show-now"><span className="status-dot" /><span>{reduced ? "静态观赏" : playing ? "ON AIR" : "PAUSED"}</span><b>{String(bandIndex + 1).padStart(2, "0")}<span> / {BANDS.length}</span></b></div>
          <div className="transport-buttons"><button type="button" className="show-btn" onClick={prev} aria-label="上一支乐队"><ChevronLeft size={20} /></button><button type="button" className="show-btn play-btn" onClick={toggle} aria-label={playing ? "暂停演出" : "播放演出"} disabled={reduced}>{playing && !reduced ? <Pause size={18} /> : <Play size={18} />}</button><button type="button" className="show-btn" onClick={next} aria-label="下一支乐队"><ChevronRight size={20} /></button><button type="button" className="show-btn replay-btn" onClick={replay} aria-label="重播当前乐队" disabled={reduced}><RotateCcw size={16} /></button></div>
          <div className="show-speeds" aria-label="播放速度">{[.5, 1, 2].map((value) => <button type="button" key={value} onClick={() => setSpeed(value)} aria-pressed={speed === value} disabled={reduced}>{value}×</button>)}</div>
          <div className="show-cue-points" aria-label="动画关键帧"><button type="button" disabled={reduced} onClick={() => seek(direction.dissolveAt - .35)}>Logo</button><button type="button" disabled={reduced} onClick={() => seek(direction.dissolveAt + .65)}>消散</button><button type="button" disabled={reduced} onClick={() => seek(direction.membersAt + 2.3)}>成员</button></div>
          <span className="show-keyboard">← → 切换 <span>／</span> SPACE 暂停</span>
        </div>
        <div className="show-progress"><span aria-hidden="true" /><input className="show-scrubber" type="range" min="0" max={duration} step="0.01" defaultValue="0" aria-label="演出进度（秒），拖动定格动画" onChange={(event) => seek(Number(event.target.value))} disabled={reduced} /></div>
        <div className="show-band-picker" aria-label="选择乐队">{BANDS.map((item, i) => <button className="picker-item" type="button" key={item.slug} onClick={() => goTo(i)} aria-current={i === bandIndex ? "true" : undefined} style={{ "--band-color": item.accent } as CSSProperties}><span>{String(i + 1).padStart(2, "0")}</span>{item.name}<i /></button>)}</div>
      </section>
    </main>
  );
}
