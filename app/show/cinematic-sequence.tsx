import type { CSSProperties } from "react";
import { artUrl, type Band } from "@/app/bandori-roster";

export function CinematicSequence({ band }: { band: Band }) {
  return (
    <div className="cinematic-sequence" aria-hidden="true">
      <div className="cinema-speedlines">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ "--ray": `${i * 22.5}deg` } as CSSProperties} />)}</div>
      <div className="cinema-hero-word">{band.name}</div>
      <div className="cinema-strips">
        {band.characters.map((character, i) => <div className="cinema-strip" key={character.slug} style={{ "--slot": i, "--side": i - 2, "--spread": Math.abs(i - 2) } as CSSProperties}>
          <img src={artUrl(band, character)} alt="" decoding="async" />
          <span>{character.name}</span>
        </div>)}
      </div>
      <div className="cinema-credit"><span>THE VOICE / THE MOMENT</span><strong>{band.characters[2].name}</strong><span>{band.name}</span></div>
      <div className="cinema-shutter cinema-shutter-top" /><div className="cinema-shutter cinema-shutter-bottom" />
      <div className="cinema-frame"><i /><i /><i /><i /></div>
    </div>
  );
}
