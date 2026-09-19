# 乐队登场秀 `/show` 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用仓库里的 12 支乐队 logo 与 60 张角色立绘，做一个"Live 开场报幕"式全屏登场动画，独立页 `/show`，主页加入口。

**Architecture:** 纯客户端组件 + 纯 CSS 动画，零新增运行时依赖。一个 `useShowPlayer` hook 用 `setTimeout` 调度四个阶段（enter / names / hold / exit），把阶段名写进 `data-phase` 属性；CSS 选择器 `[data-phase="enter"] .tile` 驱动入场动画。每队切换时用 `key={band.slug}` 重挂载舞台子树，天然重置所有 CSS 动画。图片按队懒加载，首屏只取当前 5 张。

**Tech Stack:** Next.js App Router（vinext）、React 19、Tailwind v4（仅现有 `globals.css` 风格，不新增 Tailwind 类）、lucide-react 图标。

## Global Constraints

- **commit 格式：单行消息，禁止任何 Claude 署名**（无 `Co-Authored-By`、无 `🤖 Generated with`）。每个任务最后一步提交都遵守。
- **不新增运行时依赖**。不引入 GSAP / framer-motion / 任何动画库。
- **不新增自动化测试**。用户明确要求"不需要过多测试，仅保证效果没问题即可"。每个任务的验证 = `npm run build` 通过 + 浏览器肉眼确认。现有 `tests/rendered-html.test.mjs` 保持原样不动。
- **立绘路径**：`/bandori/characters/{乐队slug}/{角色slug}_{后缀}.webp`。后缀按乐队区分：
  旧官网 8 队为 `s3_1`，新官网 4 队（avemujica / yumemita / millsage / ikka-dumb-rock）为 `1`。
  已实测 60/60 全部存在对应文件，无降级分支。后缀由 `Band.artSuffix` 承载，缺省 `s3_1`。
- **logo 路径**：`/bandori/logos/{乐队slug}.webp`。
- **设计令牌**沿用 `app/globals.css` 的 `:root`：`--ink:#20232b` `--p:#6250b6` `--y:#f9d95a` `--o:#ff855f` `--cream:#fffdf8`。
- **必须支持** `prefers-reduced-motion: reduce`（`globals.css` 已有全局兜底规则，但舞台需自行处理"不播放、直接静态展示"）。
- 现有页面全部使用 `<img>`，**不要**改用 `next/image`。

---

### Task 1: 乐队与角色元数据

建立纯数据模块。没有它后面所有任务都无从渲染。数据已逐条核实（角色日文名取自官方角色页标题，并与 Bestdori API 交叉验证；官方覆盖 31 人的角色专属色，其余 29 人省略 `color` 字段、由组件回退到乐队主题色）。

**Files:**
- Create: `app/bandori-roster.ts`

**Interfaces:**
- Consumes: 无
- Produces:
  - `type Character = { slug: string; name: string; color?: string; stage?: string }`
  - `type Band = { slug: string; name: string; nameJp: string; accent: string; artSuffix?: string; characters: Character[] }`
  - `const BANDS: Band[]` — 12 项，顺序固定
  - `function artUrl(band: Band, character: Character): string`
  - `function logoUrl(band: Band): string`
  - `function plaqueColor(band: Band, character: Character): string`

- [ ] **Step 1: 写入完整数据模块**

创建 `app/bandori-roster.ts`：

```ts
export type Character = {
  /** 文件名前缀，对应 public/bandori/characters/{band}/{slug}_s3_1.webp */
  slug: string;
  /** 官方日文名，取自官方角色页 */
  name: string;
  /** 官方角色专属色。缺省时回退到所属乐队的 accent */
  color?: string;
  /** Ave Mujica 五人的舞台名 */
  stage?: string;
};

export type Band = {
  /** 目录名，也是 public/bandori/logos/{slug}.webp 的文件名 */
  slug: string;
  name: string;
  nameJp: string;
  /** 舞台灯光主题色 */
  accent: string;
  characters: Character[];
};

export const BANDS: Band[] = [
  {
    slug: "poppinparty", name: "Poppin'Party", nameJp: "Poppin'Party", accent: "#FF5522",
    characters: [
      { slug: "hanazono-tae", name: "花園 たえ", color: "#0077DD" },
      { slug: "ichigaya-arisa", name: "市ヶ谷 有咲", color: "#AA66DD" },
      { slug: "toyama-kasumi", name: "戸山 香澄" },
      { slug: "ushigome-rimi", name: "牛込 りみ", color: "#FF55BB" },
      { slug: "yamabuki-saya", name: "山吹 沙綾", color: "#FFCC11" },
    ],
  },
  {
    slug: "afterglow", name: "Afterglow", nameJp: "Afterglow", accent: "#EE0022",
    characters: [
      { slug: "aoba-moca", name: "青葉 モカ", color: "#00CCAA" },
      { slug: "hazawa-tsugumi", name: "羽沢 つぐみ", color: "#FFEE88" },
      { slug: "mitake-ran", name: "美竹 蘭" },
      { slug: "udagawa-tomoe", name: "宇田川 巴", color: "#BB0033" },
      { slug: "uehara-himari", name: "上原 ひまり", color: "#FF9999" },
    ],
  },
  {
    slug: "hello-happy-world", name: "Hello, Happy World!", nameJp: "ハロー、ハッピーワールド！", accent: "#FFEE22",
    characters: [
      { slug: "kitazawa-hagumi", name: "北沢 はぐみ", color: "#FF9922" },
      { slug: "matsubara-kanon", name: "松原 花音", color: "#44DDFF" },
      { slug: "michelle", name: "ミッシェル", color: "#006699" },
      { slug: "seta-kaoru", name: "瀬田 薫", color: "#AA33CC" },
      { slug: "tsurumaki-kokoro", name: "弦巻 こころ" },
    ],
  },
  {
    slug: "pastel-palettes", name: "Pastel＊Palettes", nameJp: "Pastel＊Palettes", accent: "#55DDEE",
    characters: [
      { slug: "hikawa-hina", name: "氷川 日菜" },
      { slug: "maruyama-aya", name: "丸山 彩", color: "#FF88BB" },
      { slug: "shirasagi-chisato", name: "白鷺 千聖", color: "#FFEEAA" },
      { slug: "wakamiya-eve", name: "若宮 イヴ", color: "#DDBBFF" },
      { slug: "yamato-maya", name: "大和 麻弥", color: "#99DD88" },
    ],
  },
  {
    slug: "roselia", name: "Roselia", nameJp: "Roselia", accent: "#2A5FD6",
    characters: [
      { slug: "hikawa-sayo", name: "氷川 紗夜", color: "#00AABB" },
      { slug: "imai-lisa", name: "今井 リサ", color: "#DD2200" },
      { slug: "minato-yukina", name: "湊 友希那", color: "#881188" },
      { slug: "shirokane-rinko", name: "白金 燐子", color: "#BBBBBB" },
      { slug: "udagawa-ako", name: "宇田川 あこ", color: "#DD0088" },
    ],
  },
  {
    slug: "morfonica", name: "Morfonica", nameJp: "Morfonica", accent: "#37A9E0",
    characters: [
      { slug: "futaba-tsukushi", name: "二葉 つくし", color: "#EE7788" },
      { slug: "hiromachi-nanami", name: "広町 七深", color: "#EE7744" },
      { slug: "kirigaya-toko", name: "桐ヶ谷 透子", color: "#EE6666" },
      { slug: "kurata-mashiro", name: "倉田 ましろ", color: "#6677CC" },
      { slug: "yashio-rui", name: "八潮 瑠唯", color: "#669988" },
    ],
  },
  {
    slug: "raise-a-suilen", name: "RAISE A SUILEN", nameJp: "RAISE A SUILEN", accent: "#4D76CB",
    characters: [
      { slug: "chu2", name: "チュチュ" },
      { slug: "layer", name: "レイヤ" },
      { slug: "lock", name: "ロック" },
      { slug: "masking", name: "マスキング" },
      { slug: "pareo", name: "パレオ" },
    ],
  },
  {
    slug: "mygo", name: "MyGO!!!!!", nameJp: "MyGO!!!!!", accent: "#38B1DF",
    characters: [
      { slug: "chihaya-anon", name: "千早 愛音", color: "#FF8899" },
      { slug: "kaname-rana", name: "要 楽奈", color: "#77DD77" },
      { slug: "nagasaki-soyo", name: "長崎 そよ", color: "#FFDD88" },
      { slug: "shiina-taki", name: "椎名 立希", color: "#7777AA" },
      { slug: "takamatsu-tomori", name: "高松 燈", color: "#77BBDD" },
    ],
  },
  {
    slug: "avemujica", name: "Ave Mujica", nameJp: "Ave Mujica", accent: "#EE298B",
    characters: [
      { slug: "misumi-uika", name: "三角 初華", stage: "ドロリス" },
      { slug: "togawa-sakiko", name: "豊川 祥子", stage: "オブリビオニス" },
      { slug: "wakaba-mutsumi", name: "若葉 睦", stage: "モーティス" },
      { slug: "yahata-umiri", name: "八幡 海鈴", stage: "ティモリス" },
      { slug: "yutenji-nyamu", name: "祐天寺 にゃむ", stage: "アモーリス" },
    ],
  },
  {
    slug: "yumemita", name: "Yumemita", nameJp: "夢限大みゅーたいぷ", accent: "#CB4D7D",
    characters: [
      { slug: "fuji-miyako", name: "藤 都子" },
      { slug: "minetsuki-ritsu", name: "峰月 律" },
      { slug: "miyanaga-nonoka", name: "宮永 ののか" },
      { slug: "nakamachi-arale", name: "仲町 あられ" },
      { slug: "sengoku-yuno", name: "千石 ユノ" },
    ],
  },
  {
    slug: "millsage", name: "millsage", nameJp: "millsage", accent: "#7B4DCB",
    characters: [
      { slug: "hamasaki-mahoro", name: "浜崎 まほろ" },
      { slug: "izawa-natsume", name: "伊沢 なつめ" },
      { slug: "izumi-houka", name: "和泉 朋花" },
      { slug: "kotohira-nagi", name: "琴平 凪" },
      { slug: "shiomi-hotaru", name: "汐見 蛍" },
    ],
  },
  {
    slug: "ikka-dumb-rock", name: "Ikka Dumb Rock", nameJp: "いっかさん", accent: "#4DCB56",
    characters: [
      { slug: "mahashi-miku", name: "馬橋 心玖" },
      { slug: "shinomiya-shizuku", name: "四宮 寧月" },
      { slug: "suga-raika", name: "須賀 蕾叶" },
      { slug: "umezato-chieri", name: "梅里 ちえり" },
      { slug: "yakura-yomogi", name: "矢倉 蓬咲" },
    ],
  },
];

/** 立绘地址。60 个角色全部存在 _s3_1 文件，无缺图分支。 */
export function artUrl(band: Band, character: Character): string {
  return `/bandori/characters/${band.slug}/${character.slug}_s3_1.webp`;
}

export function logoUrl(band: Band): string {
  return `/bandori/logos/${band.slug}.webp`;
}

/** 名条颜色：优先角色官方色，缺省回退乐队主题色。 */
export function plaqueColor(band: Band, character: Character): string {
  return character.color ?? band.accent;
}
```

- [ ] **Step 2: 校验数据与磁盘文件一一对应**

运行：

```bash
node -e "
const src = require('fs').readFileSync('app/bandori-roster.ts','utf8');
const bands = [...src.matchAll(/slug: \"([a-z0-9-]+)\", name:/g)].map(m=>m[1]);
console.log('bands parsed:', bands.length);
" 
```

再逐条核对文件真实存在（这是唯一会静默出错的地方，必须跑）：

```bash
node --input-type=module -e "
import fs from 'fs';
const lines = fs.readFileSync('app/bandori-roster.ts','utf8').split('\n');
let band = null, suffix = 's3_1', missing = [], total = 0, bands = 0;
const perBand = {};
for (const line of lines) {
  const withSuffix = line.match(/^    slug: \"([a-z0-9-]+)\", name: .*artSuffix: \"([^\"]+)\"/);
  const plain      = line.match(/^    slug: \"([a-z0-9-]+)\", name: .*accent: \"[^\"]+\",\$/);
  if (withSuffix) { band = withSuffix[1]; suffix = withSuffix[2]; bands++; perBand[band] = 0; continue; }
  if (plain)      { band = plain[1]; suffix = 's3_1'; bands++; perBand[band] = 0; continue; }
  const c = line.match(/^      \{ slug: \"([a-z0-9-]+)\", name: /);
  if (c && band) {
    total++; perBand[band]++;
    const p = 'public/bandori/characters/' + band + '/' + c[1] + '_' + suffix + '.webp';
    if (!fs.existsSync(p)) missing.push(p);
  }
}
console.log('bands parsed:', bands, '| characters checked:', total, '| missing artwork:', missing.length);
missing.forEach(m => console.log('  MISSING', m));
Object.keys(perBand).forEach(b => {
  if (!fs.existsSync('public/bandori/logos/' + b + '.webp')) console.log('  MISSING LOGO', b);
  if (perBand[b] !== 5) console.log('  BAD COUNT', b, perBand[b]);
});
"
```

Expected: `bands parsed: 12 | characters checked: 60 | missing artwork: 0`，且无 `MISSING` / `BAD COUNT` 行。

- [ ] **Step 3: 提交**

```bash
git add app/bandori-roster.ts
git commit -m "feat: add Bandori band and character roster data"
```

---

### Task 2: 播放状态机 hook

把 6.8 秒的编排做成可暂停、可调速、可跳队的调度器。这是整个动画的时钟，独立于渲染，便于单独推敲。

**Files:**
- Create: `app/show/use-show-player.ts`

**Interfaces:**
- Consumes: `BANDS`, `Band` from `@/app/bandori-roster`
- Produces:
  - `type ShowPhase = "idle" | "enter" | "names" | "hold" | "exit"`
  - `useShowPlayer(): { band: Band; bandIndex: number; phase: ShowPhase; playing: boolean; speed: number; toggle(): void; next(): void; prev(): void; goTo(index: number): void; setSpeed(s: number): void }`

**阶段时长（毫秒，未乘 speed）**：enter 0→1800，names 1800→2400，hold 2400→4500，exit 4500→5400，5400→6800 空场后切下一队。

- [ ] **Step 1: 实现 hook**

创建 `app/show/use-show-player.ts`：

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export function useShowPlayer(): ShowPlayer {
  const [bandIndex, setBandIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeedState] = useState(1);
  const [phase, setPhase] = useState<ShowPhase>("idle");

  // 用 ref 读取最新值，避免把 speed/playing 放进 effect 依赖导致重排时间轴
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const timers: number[] = [];

    // 尊重系统偏好：直接停在定格态，不跑时间轴。
    // 注意此时不能 return —— 控制条仍需可用，换队靠 next/prev/goTo。
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 暂停时不重置 phase，避免恢复播放时画面跳回入场。
    // 副作用：effect 重跑会把整条时间轴从头计时，即"暂停后再播从本队开头起"。
    if (!reduced) setPhase("idle");

    if (reduced || !playing) return;

    const s = speedRef.current;
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms / s));
    };

    at(T.enter, () => setPhase("names"));
    at(T.names, () => setPhase("hold"));
    at(T.hold, () => setPhase("exit"));
    at(T.end, () => {
      setBandIndex((i) => (i + 1) % BANDS.length);
    });

    return () => timers.forEach(window.clearTimeout);
  }, [bandIndex, playing, speed]);

  const goTo = useCallback((index: number) => {
    setBandIndex(((index % BANDS.length) + BANDS.length) % BANDS.length);
  }, []);

  const next = useCallback(() => {
    setBandIndex((i) => (i + 1) % BANDS.length);
  }, []);

  const prev = useCallback(() => {
    setBandIndex((i) => (i - 1 + BANDS.length) % BANDS.length);
  }, []);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const setSpeed = useCallback((v: number) => setSpeedState(v), []);

  return {
    band: BANDS[bandIndex],
    bandIndex,
    phase,
    playing,
    speed,
    toggle,
    next,
    prev,
    goTo,
    setSpeed,
  };
}
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 编译通过，无 TS 报错。此任务尚无页面引用，属正常。

- [ ] **Step 3: 提交**

```bash
git add app/show/use-show-player.ts
git commit -m "feat: add show player state machine hook"
```

---

### Task 3: 图片预加载 hook

首屏只加载当前 5 张，其余 55 张在浏览器空闲时后台补齐。

**Files:**
- Create: `app/show/use-art-preload.ts`

**Interfaces:**
- Consumes: `BANDS`, `artUrl`, `logoUrl` from `@/app/bandori-roster`
- Produces: `useArtPreload(currentIndex: number): void`

- [ ] **Step 1: 实现 hook**

创建 `app/show/use-art-preload.ts`：

```ts
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

    const priority = BANDS[currentIndex].characters.map((c) =>
      artUrl(BANDS[currentIndex], c),
    );
    priority.push(logoUrl(BANDS[currentIndex]));

    const upcoming = BANDS[(currentIndex + 1) % BANDS.length];
    const second = upcoming.characters.map((c) => artUrl(upcoming, c));
    second.push(logoUrl(upcoming));

    const rest = BANDS.filter(
      (_, i) => i !== currentIndex && i !== (currentIndex + 1) % BANDS.length,
    ).flatMap((band) => [
      logoUrl(band),
      ...band.characters.map((c) => artUrl(band, c)),
    ]);

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

    (async () => {
      await Promise.all(priority);      // 首屏必需
      if (cancelled) return;
      await Promise.all(second);        // 下一队，保证切队不空白
      if (cancelled) return;

      idle(async () => {
        if (cancelled) return;
        // 并发 4 路，避免一次打满连接数
        const queue = [...rest];
        const workers = Array.from({ length: 4 }, async () => {
          while (queue.length && !cancelled) {
            const src = queue.shift();
            if (src) await load(src);
          }
        });
        await Promise.all(workers);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [currentIndex]);
}
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 编译通过。

- [ ] **Step 3: 提交**

```bash
git add app/show/use-art-preload.ts
git commit -m "feat: add progressive artwork preload hook"
```

---

### Task 4: 舞台样式

把编排写成 CSS。沿用 `globals.css` 的 keyframes 命名风格与设计令牌。

**Files:**
- Create: `app/show/stage.css`

**Interfaces:**
- Consumes: 无
- Produces: 供 Task 5 使用的类名与契约：
  - `.stage` 根容器，需带 `data-phase` 与 `--accent` 自定义属性
  - `.stage-logo` 乐队 logo
  - `.lineup` 五人横排容器
  - `.tile` 单个角色格子，需带 `--i`（0–4，用于错升延迟）与 `--plaque`（名条色）
  - `.tile-art` 立绘 `<img>`
  - `.tile-plaque` 名条
  - `.tile-name` / `.tile-stage` 名条内文字
  - `.stage-band-name` 底部乐队名
  - `.show-controls` / `.show-btn` / `.show-band-picker` / `.picker-item` 控制条

- [ ] **Step 1: 写样式**

创建 `app/show/stage.css`：

```css
/* 乐队登场秀舞台。配色沿用 globals.css 的 :root 令牌。 */

.show-page {
  min-height: 100vh;
  background: #111426;
  color: #fff;
  overflow: hidden;
}

/* ---------- 舞台 ---------- */
.stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px 0 132px;
  isolation: isolate;
  overflow: hidden;
}

/* 舞台灯光：随乐队主题色变化 */
.stage::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 48% at 50% 30%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 70%),
    linear-gradient(180deg, #15172a 0%, #1b1740 55%, #111426 100%);
  content: "";
  transition: background 0.5s ease;
}

/* 地面反光 */
.stage::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 34%;
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 22%, transparent));
  content: "";
  pointer-events: none;
}

.stage-logo {
  position: relative;
  z-index: 1;
  width: clamp(160px, 22vw, 300px);
  height: auto;
  object-fit: contain;
  opacity: 0;
  filter: blur(14px);
  transform: scale(0.86);
}

[data-phase="enter"] .stage-logo,
[data-phase="names"] .stage-logo,
[data-phase="hold"] .stage-logo {
  animation: stage-logo-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes stage-logo-in {
  to { opacity: 1; filter: blur(0); transform: scale(1); }
}

/* ---------- 五人横排 ---------- */
.lineup {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(6px, 1.4vw, 22px);
  width: 100%;
  margin-top: clamp(14px, 2.4vh, 34px);
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: clamp(96px, 15vw, 190px);
  opacity: 0;
  transform: translateY(110%);
}

[data-phase="enter"] .tile,
[data-phase="names"] .tile,
[data-phase="hold"] .tile {
  animation: tile-rise 0.78s cubic-bezier(0.18, 0.86, 0.22, 1) forwards;
  /* 中心先起、向两侧扩散：|i-2| 越大延迟越多 */
  animation-delay: calc((0.02 + var(--spread) * 0.075) * 1s);
}

@keyframes tile-rise {
  to { opacity: 1; transform: translateY(0); }
}

/* 定格时的呼吸感 */
[data-phase="hold"] .tile-art {
  animation: tile-breathe 2.1s ease-in-out infinite;
}

@keyframes tile-breathe {
  50% { transform: scale(1.022); }
}

.tile-art {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 12px 22px #0006);
}

/* ---------- 名条 ---------- */
.tile-plaque {
  width: 100%;
  margin-top: 10px;
  padding: 7px 6px 8px;
  border: 2px solid var(--plaque);
  border-radius: 12px;
  background: #0d0f1ecc;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
}

[data-phase="names"] .tile-plaque,
[data-phase="hold"] .tile-plaque {
  animation: plaque-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: calc((0.02 + var(--spread) * 0.075) * 1s);
}

@keyframes plaque-in {
  to { opacity: 1; transform: translateY(0); }
}

.tile-name {
  display: block;
  font-size: clamp(11px, 1.05vw, 15px);
  font-weight: 900;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.tile-stage {
  display: block;
  margin-top: 3px;
  color: color-mix(in srgb, var(--plaque) 78%, #fff);
  font-size: clamp(8px, 0.72vw, 10px);
  font-weight: 700;
  letter-spacing: 0.08em;
}

/* ---------- 底部乐队名 ---------- */
.stage-band-name {
  position: relative;
  z-index: 1;
  margin: clamp(16px, 2.6vh, 30px) 0 0;
  font-size: clamp(15px, 1.5vw, 21px);
  font-weight: 900;
  letter-spacing: 0.02em;
  opacity: 0;
}

[data-phase="names"] .stage-band-name,
[data-phase="hold"] .stage-band-name {
  animation: plaque-in 0.45s ease 0.5s forwards;
}

/* ---------- 退场 ---------- */
[data-phase="exit"] .stage-logo,
[data-phase="exit"] .lineup,
[data-phase="exit"] .stage-band-name {
  animation: stage-out 0.9s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes stage-out {
  to { opacity: 0; transform: translateY(-4%); }
}

/* ---------- 控制条 ---------- */
.show-controls {
  position: fixed;
  z-index: 5;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 14px clamp(16px, 4vw, 40px);
  background: #0b0d18e6;
  border-top: 1px solid #ffffff1a;
  backdrop-filter: blur(8px);
}

.show-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  border-radius: 99px;
  padding: 9px 15px;
  background: #ffffff1f;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.show-btn:hover { background: #ffffff33; }

.show-band-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-left: auto;
}

.picker-item {
  border: 1px solid #ffffff2e;
  border-radius: 99px;
  padding: 5px 10px;
  background: transparent;
  color: #ffffffb3;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.picker-item[aria-current="true"] {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 26%, transparent);
  color: #fff;
}

.show-back { margin-left: 4px; }
```

- [ ] **Step 2: 提交**

本任务只有样式，构建验证与视觉验证合并在 Task 5。

```bash
git add app/show/stage.css
git commit -m "feat: add show stage animation styles"
```

---

### Task 5: 舞台组件与页面

组装。这一步之后 `/show` 可访问、可播放。

**Files:**
- Create: `app/show/show-stage.tsx`
- Create: `app/show/page.tsx`

**Interfaces:**
- Consumes: `BANDS`、`artUrl`、`logoUrl`、`plaqueColor`（Task 1）；`useShowPlayer`（Task 2）；`useArtPreload`（Task 3）；`./stage.css`（Task 4）
- Produces: `default export ShowStage`（客户端组件）

**名条色回退**：`plaqueColor(band, character)` 已封装"角色色缺失则用乐队 accent"。

**错升延迟**：`--spread` = `|i - 2|`，即索引 2（正中）为 0，两侧递增。

- [ ] **Step 1: 写舞台组件**

创建 `app/show/show-stage.tsx`：

```tsx
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

      <div className="show-controls" style={{ "--accent": band.accent } as React.CSSProperties}>
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
```

- [ ] **Step 2: 写页面**

创建 `app/show/page.tsx`：

```tsx
import type { Metadata } from "next";
import ShowStage from "./show-stage";

export const metadata: Metadata = {
  title: "乐队登场｜重庆大学 EF 邦多利马群",
  description: "12 支乐队、60 位角色依次登场，在校园里遇见频率相同的伙伴。",
};

export default function ShowPage() {
  return <ShowStage />;
}
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 编译通过，路由列表中出现 `/show`。

- [ ] **Step 4: 视觉验证**

Run: `npm run dev`

浏览器打开 `http://localhost:3000/show`，逐项确认：

1. 页面加载后第 1 队（Poppin'Party）logo 从模糊变清晰
2. 5 张立绘从下方升起，**中间那张先出现，向两侧依次延迟**
3. 名条依次点亮，颜色各不相同（香澄那张应无独立色、用队伍橙红）
4. 定格约 2 秒后整队淡出，自动切到 Afterglow
5. 点「暂停」动画停住；点「下一支」立刻换队
6. 点速度 `2×` 后整轮明显加快
7. 点底部任一乐队名，立即切到该队
8. Avatar Mujica 一队的名条应显示舞台名（ドロリス 等）

**暂停的预期行为**：点「暂停」画面立即停住；点「播放」会**从当前这支乐队的开头重新播**，
而不是从停住的那一帧接上。这是带键 CSS 动画的固有取舍（真正做到暂停需改用 Web Animations API
并记录 elapsed，不在本次范围）。这是有意设计，不是 bug。

- [ ] **Step 5: 提交**

```bash
git add app/show/show-stage.tsx app/show/page.tsx
git commit -m "feat: add /show band entrance stage and page"
```

---

### Task 6: 响应式与降级

桌面一字排开在窄屏会挤成一条，必须处理；`prefers-reduced-motion` 需给出静态形态。

**Files:**
- Modify: `app/show/stage.css`（在文件末尾追加）

**Interfaces:**
- Consumes: Task 4 定义的类名
- Produces: 无新接口

- [ ] **Step 1: 追加移动端与降级样式**

在 `app/show/stage.css` 末尾追加：

```css
/* ---------- 移动端：横排超宽，横向卷动画卷 ---------- */
@media (max-width: 720px) {
  .stage {
    padding: 20px 0 150px;
    justify-content: flex-start;
  }

  .lineup {
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    overflow-x: auto;
    padding: 0 16px 8px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .lineup::-webkit-scrollbar { display: none; }

  .tile {
    flex: 0 0 40vw;      /* 每屏约 2.5 人 */
    width: 40vw;
    scroll-snap-align: center;
  }

  .stage-logo { width: 150px; }

  .stage-band-name { font-size: 18px; }

  .show-controls { padding: 10px 14px; gap: 8px; }
  .show-band-picker {
    order: 3;
    width: 100%;
    margin-left: 0;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 2px;
  }
  .show-back { margin-left: auto; }
}

/* ---------- 静态降级：不播放动画，直接展示阵容 ---------- */
@media (prefers-reduced-motion: reduce) {
  .stage-logo,
  .tile,
  .tile-plaque,
  .stage-band-name {
    opacity: 1;
    filter: none;
    transform: none;
    animation: none !important;
  }
}
```

- [ ] **Step 2: 视觉验证**

Run: `npm run dev`

1. 浏览器窗口缩到手机宽度（或 DevTools 设备模拟），打开 `/show`
   - 立绘应为可左右拖动的横排，每屏约 2.5 人
   - 入场动画照常播放
2. 系统开启"减弱动态效果"后刷新（macOS：系统设置 → 辅助功能 → 显示）
   - 应直接静态显示全员与名条，无动画

- [ ] **Step 3: 提交**

```bash
git add app/show/stage.css
git commit -m "feat: add mobile horizontal scroll and reduced-motion fallback for show"
```

---

### Task 7: 主页入口

把入口接进主页，否则 `/show` 无从抵达。

**Files:**
- Modify: `app/page.tsx`（hero 区的 CTA 之后、"hero-note" 之前）

**Interfaces:**
- Consumes: 无
- Produces: 无

- [ ] **Step 1: 在 hero 区加入口按钮**

在 `app/page.tsx` 中找到这一行（约 194 行）：

```tsx
          <a className="cta" href="#join">申请进群 <ArrowRight aria-hidden="true" size={18} /></a>
```

在它**之前**插入：

```tsx
          <Link className="cta cta-show" href="/show"><Play aria-hidden="true" size={17} /> 观看乐队登场</Link>
```

- [ ] **Step 2: 补 import**

在 `app/page.tsx` 顶部的 `import { useEffect, useState } from "react";` 之后加：

```tsx
import Link from "next/link";
```

在既有 `lucide-react` 的 import 列表中，按字母序插入 `Play`（应在 `PencilRuler` 之后、`QrCode` 之前）。

- [ ] **Step 3: 让两个按钮并排**

在 `app/globals.css` 中找到 `.hero .wrap` 相关规则之后追加：

```css
.hero-actions { display:flex; flex-wrap:wrap; gap:12px; margin:12px 0; }
.cta-show { background:var(--ink); box-shadow:5px 5px var(--y); }
```

然后把 `app/page.tsx` 里刚插入的按钮与紧随其后的 `<a className="cta" ...>` 一起包进容器：

```tsx
          <div className="hero-actions">
            <Link className="cta cta-show" href="/show"><Play aria-hidden="true" size={17} /> 观看乐队登场</Link>
            <a className="cta" href="#join">申请进群 <ArrowRight aria-hidden="true" size={18} /></a>
          </div>
```

- [ ] **Step 4: 视觉验证**

Run: `npm run dev`，打开 `http://localhost:3000`

1. hero 区应出现两个并排按钮：「观看乐队登场」（黑底黄阴影）与「申请进群」（紫底）
2. 点「观看乐队登场」跳到 `/show`
3. 在 `/show` 点「返回主页」能回到 `/`
4. 手机宽度下两个按钮应换行堆叠，不溢出

- [ ] **Step 5: 提交**

```bash
git add app/page.tsx app/globals.css
git commit -m "feat: add homepage entry point to /show"
```

---

### Task 8: 收尾验证

**Files:** 无新增

- [ ] **Step 1: 全量构建**

Run: `npm run build`
Expected: 通过，无 TS / ESLint 报错。

Run: `npm run lint`
Expected: 通过。

- [ ] **Step 2: 确认无新增运行时依赖**

Run: `git diff --stat 50b952e -- package.json`
Expected: **无输出**（package.json 未改动）。

- [ ] **Step 3: 确认首屏未加载全部素材**

打开 `/show`，DevTools → Network → 筛选 `img`，刷新页面。
Expected: 初始请求只含当前队 5 张立绘 + 1 个 logo；其余在页面空闲后陆续出现，且不阻塞。总量最终约 23.9 MB。

- [ ] **Step 4: 完整走查一轮**

打开 `/show`，让它自己跑完 12 支乐队一整轮（约 82 秒），确认：

- 每队都正常登场，无空白队、无缺图
- 名条颜色与该角色对应（Roselia 队应各色不同）
- 回到第 1 队时循环正常

- [ ] **Step 5: 提交（若有微调）**

若前面步骤发现视觉问题并已修正：

```bash
git add -A
git commit -m "fix: polish show animation details"
```

若无改动则跳过此步。

---

## 自查记录

**Spec 覆盖**

| Spec 要求 | 对应任务 |
|---|---|
| 6.8s 编排、五段时序 | Task 2（时长表）+ Task 4（CSS keyframes） |
| 错升入场（中心先起） | Task 4 `--spread` + Task 5 传入 `Math.abs(i-2)` |
| 2.1s 定格 + 呼吸微缩放 | Task 4 `tile-breathe` |
| 角色名 + 乐队名 + 舞台名 | Task 1 数据 + Task 5 渲染 |
| 角色专属色 / 乐队主题色分离 | Task 1 `plaqueColor` + `accent` |
| logo 冲击波 | Task 4 `stage-logo-in`（模糊放大定格） |
| 首屏只加载 1 队 + 后台预载 | Task 3 |
| 暂停/上下队/直选/调速 | Task 2 + Task 5 控制条 |
| 手机横向卷动画卷 | Task 6 |
| prefers-reduced-motion | Task 2（停 hold）+ Task 6（静态样式） |
| 主页入口 | Task 7 |
| 不新增依赖 | Task 8 Step 2 显式核查 |
| 不做过多测试 | 全程无自动化测试，仅 build + 肉眼 |

**类型一致性**：`ShowPhase` 五个字面量在 Task 2 定义、Task 4 CSS 选择器中逐一使用（`enter`/`names`/`hold`/`exit`），`idle` 无样式即"未入场"初态。`--spread` 与 `--plaque` 在 Task 4 消费、Task 5 产出，名称一致。`plaqueColor` 在 Task 1 定义、Task 5 调用。`artUrl`/`logoUrl` 签名 `(band, character?)` 在 Task 1 定义，Task 3 与 Task 5 调用方式一致。

**已知需目视确认项**（写进计划而非假装确定）：
- Morfonica `#37A9E0` / MyGO `#38B1DF` / RAISE A SUILEN `#4D76CB` 三队提取色都偏蓝，连续播放时区分度可能不足 —— Task 5 Step 4 与 Task 8 Step 4 走查时留意，必要时手动调 `accent`。
- 名条在 `clamp(96px,15vw,190px)` 宽度下，`チュチュ` 等短名与 `オブリビオニス` 等长舞台名的换行表现需实看。
