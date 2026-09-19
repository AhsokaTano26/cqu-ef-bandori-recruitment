export type RevealStyle = "supernova" | "embers" | "confetti" | "ribbons" | "rose" | "butterfly" | "glitch" | "rain" | "eclipse" | "dream" | "prism" | "impact";
type Choreography = { style: RevealStyle; title: string; dissolveAt: number; membersAt: number; order: number[] };

// Art direction is editorial, not an official description of the bands.
export const CHOREOGRAPHY: Record<string, Choreography> = {
  poppinparty: { style: "supernova", title: "STAR / BURST", dissolveAt: 2.25, membersAt: 4.45, order: [3,1,0,2,4] },
  afterglow: { style: "embers", title: "BURN / AFTERGLOW", dissolveAt: 2.4, membersAt: 4.6, order: [4,2,0,1,3] },
  "hello-happy-world": { style: "confetti", title: "SMILE / EXPLOSION", dissolveAt: 1.9, membersAt: 4.1, order: [1,3,0,4,2] },
  "pastel-palettes": { style: "ribbons", title: "PASTEL / REVERIE", dissolveAt: 2.5, membersAt: 4.7, order: [0,1,2,3,4] },
  roselia: { style: "rose", title: "ROSE / CATHEDRAL", dissolveAt: 2.7, membersAt: 4.9, order: [4,2,0,1,3] },
  morfonica: { style: "butterfly", title: "WINGS / AWAKEN", dissolveAt: 2.5, membersAt: 4.7, order: [4,2,0,1,3] },
  "raise-a-suilen": { style: "glitch", title: "SYSTEM / OVERDRIVE", dissolveAt: 1.9, membersAt: 4.1, order: [0,3,1,4,2] },
  mygo: { style: "rain", title: "LOST / IN THE RAIN", dissolveAt: 2.8, membersAt: 5, order: [4,3,2,1,0] },
  avemujica: { style: "eclipse", title: "ACT / LUNAR ECLIPSE", dissolveAt: 3, membersAt: 5.2, order: [0,1,4,2,3] },
  yumemita: { style: "dream", title: "DREAM / DIVE", dissolveAt: 2.2, membersAt: 4.4, order: [2,4,0,3,1] },
  millsage: { style: "prism", title: "LIGHT / REFRACTION", dissolveAt: 2.5, membersAt: 4.7, order: [0,1,2,3,4] },
  "ikka-dumb-rock": { style: "impact", title: "LOUD / BREAKOUT", dissolveAt: 1.85, membersAt: 4.05, order: [2,0,4,1,3] },
};

export function choreography(slug: string) {
  return CHOREOGRAPHY[slug] ?? CHOREOGRAPHY.poppinparty;
}

export function fragmentGeometry(style: RevealStyle, index: number) {
  const column = index % 8;
  const row = Math.floor(index / 8);
  const angle = index / 48 * Math.PI * 2;
  const grid = `inset(${row * 100 / 6}% ${100 - (column + 1) * 12.5}% ${100 - (row + 1) * 100 / 6}% ${column * 12.5}%)`;
  const stripes = ["glitch", "ribbons", "rain", "eclipse"].includes(style);
  const vertical = ["rain", "eclipse"].includes(style);
  let clip = stripes ? vertical
    ? `inset(0 ${100 - (index + 1) * 100 / 48}% 0 ${index * 100 / 48}%)`
    : `inset(${index * 100 / 48}% 0 ${100 - (index + 1) * 100 / 48}% 0)` : grid;
  if (["rose", "prism", "impact"].includes(style)) {
    // Two triangles per cell tessellate the complete logo without missing pixels.
    const cell = Math.floor(index / 2), x = cell % 6 * 100 / 6, y = Math.floor(cell / 6) * 25;
    clip = index % 2 ? `polygon(${x}% ${y}%,${x + 100 / 6}% ${y + 25}%,${x}% ${y + 25}%)` : `polygon(${x}% ${y}%,${x + 100 / 6}% ${y}%,${x + 100 / 6}% ${y + 25}%)`;
  }
  let dx = Math.cos(angle) * (160 + index % 5 * 28), dy = Math.sin(angle) * (120 + index % 7 * 22);
  if (style === "embers") { dx = (column - 3.5) * 22; dy = -160 - row * 24; }
  if (style === "rain") { dx = -25; dy = 150 + index % 6 * 30; }
  if (style === "glitch") { dx = (index % 2 ? 1 : -1) * (180 + index % 5 * 55); dy = 0; }
  if (style === "eclipse") { dx = (index < 24 ? -1 : 1) * 420; dy = 0; }
  if (style === "ribbons") { dx = (index % 2 ? 1 : -1) * 140; dy = -90 - index * 2; }
  return { clip, dx, dy, turn: (index % 9 - 4) * 18, lag: (index * 7 % 11) * .025 };
}
