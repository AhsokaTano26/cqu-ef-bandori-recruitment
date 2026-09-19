import type { CSSProperties } from "react";
import { choreography, fragmentGeometry } from "./band-choreography";

/** The supplied artwork itself breaks apart; every shard samples the same image. */
export function LogoReveal({ src, name, slug }: { src: string; name: string; slug: string }) {
  const direction = choreography(slug);
  return (
    <div className="logo-reveal">
      <div className="logo-reveal-halo" aria-hidden="true" />
      <div className="logo-reveal-ring" aria-hidden="true" />
      <div className="reveal-world" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--n": index, "--angle": `${index * 30}deg`, "--lane": `${index * 8.33}%` } as CSSProperties} />)}
      </div>
      <div className="reveal-sweep" aria-hidden="true" />
      <div className="logo-reveal-art">
        <img className="logo-reveal-original" src={src} alt={`${name} 乐队 Logo`} fetchPriority="high" />
        <div className="logo-fragments" aria-hidden="true">
          {Array.from({ length: 48 }, (_, index) => {
            const { clip, dx, dy, turn, lag } = fragmentGeometry(direction.style, index);
            return <span key={index} className="logo-fragment" style={{
              backgroundImage: `url("${src}")`,
              clipPath: clip,
              transformOrigin: `${(index % 8 + .5) * 12.5}% ${(Math.floor(index / 8) + .5) * 100 / 6}%`,
              "--fragment-delay": `${direction.dissolveAt + lag}s`,
              "--fragment-x": `${dx}px`,
              "--fragment-y": `${dy}px`,
              "--fragment-turn": `${turn}deg`,
            } as CSSProperties} />;
          })}
        </div>
        <div className="logo-dust" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => <i key={index} style={{
            left: `${12 + (index * 17 % 76)}%`, top: `${18 + (index * 23 % 64)}%`,
            "--dust-x": `${(index % 6 - 2) * 70}px`,
            "--dust-y": `${-70 - index % 5 * 40}px`,
            "--dust-delay": `${direction.dissolveAt + index % 8 * .055}s`,
          } as CSSProperties} />)}
        </div>
      </div>
      <div className="logo-reveal-caption" aria-hidden="true"><span>{direction.title}</span><b>{name}</b><span>—— MEET THE BAND ——</span></div>
    </div>
  );
}
