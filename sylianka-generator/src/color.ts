/** Кольори: OKLab / OKLCH, традиційні палітри, гармонії, найближчий Preciosa 10/0. */
import { PRECIOSA_DATA } from "./data/preciosa";
import { type Rng, pick, randInt } from "./rng";

export type Lab = [number, number, number];
export type Lch = [number, number, number];

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    "#" +
    [r, g, b]
      .map((c) =>
        Math.round(clamp01(c) * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  ).toUpperCase();
}

const toLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number): number => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToOklab([r, g, b]: [number, number, number]): Lab {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
}

/** OKLab → лінійний sRGB (може виходити за [0, 1]). */
function oklabToLinear([L, a, b]: Lab): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ];
}

export function oklabToRgb(lab: Lab): [number, number, number] {
  return oklabToLinear(lab).map((c) => clamp01(toGamma(c))) as [number, number, number];
}

export const hexToOklab = (hex: string): Lab => rgbToOklab(hexToRgb(hex));

export function oklabToOklch([L, a, b]: Lab): Lch {
  const C = Math.hypot(a, b);
  const h = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return [L, C, h];
}

export function oklchToOklab([L, C, h]: Lch): Lab {
  const r = (h * Math.PI) / 180;
  return [L, C * Math.cos(r), C * Math.sin(r)];
}

function inGamut(lab: Lab): boolean {
  return oklabToLinear(lab).every((c) => c >= -1e-4 && c <= 1 + 1e-4);
}

/** OKLCH → HEX із зменшенням насиченості, доки колір не влізе в sRGB. */
export function oklchToHex([L, C, h]: Lch): string {
  let c = C;
  while (c > 0 && !inGamut(oklchToOklab([L, c, h]))) c -= 0.005;
  return rgbToHex(oklabToRgb(oklchToOklab([L, Math.max(0, c), h])));
}

export const hexToOklch = (hex: string): Lch => oklabToOklch(hexToOklab(hex));

/** ΔE в OKLab (евклідова відстань). */
export function deltaE(a: string, b: string): number {
  const x = hexToOklab(a);
  const y = hexToOklab(b);
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

/** Мінімальний контраст між кольорами, що стоять поруч на нитці. */
export const MIN_CONTRAST = 0.1;

// ---------------------------------------------------------------- палітри

export interface Palette {
  id: string;
  name: string;
  /** colors[0] — фон. */
  colors: string[];
}

/** Традиційні набори (фон перший). */
export const TRADITIONAL: readonly Palette[] = [
  { id: "black-bordo-gold", name: "Чорний / бордо / золото", colors: ["#141414", "#7A1428", "#C9A232", "#F2EEE4"] },
  { id: "white-red-black", name: "Білий / червоний / чорний", colors: ["#F4F1EA", "#C0182A", "#161616", "#E0A526"] },
  { id: "black-red-white", name: "Чорний / червоний / білий", colors: ["#141414", "#C21B2C", "#F4F1EA", "#2E7D4F"] },
  { id: "blue-yellow", name: "Синій / жовтий", colors: ["#F4F1EA", "#1F4FA8", "#F2C12E", "#10245A"] },
  { id: "navy-yellow-white", name: "Темно-синій / жовтий / білий", colors: ["#13234F", "#F2C12E", "#F4F1EA", "#3F7BD6"] },
  { id: "hutsul", name: "Гуцульський (червоний / зелений / жовтий)", colors: ["#F4F1EA", "#B3162B", "#2F7A45", "#E8B321", "#161616"] },
  { id: "turquoise-coral", name: "Бірюза / корал / білий", colors: ["#F4F1EA", "#2A9D9A", "#E0674B", "#1E3B4F"] },
  { id: "green-white-red", name: "Зелений / білий / червоний", colors: ["#1F5E3A", "#F4F1EA", "#C0182A", "#E3B230"] }
];

export type HarmonyMode = "analog" | "complementary";

/**
 * Палітра-гармонія в OKLCH: фон темний або світлий, 1–4 акценти.
 * analog — відтінки поруч (±30°), complementary — протилежні (180°).
 * Кожна пара кольорів має ΔE ≥ MIN_CONTRAST (перевіряємо й підправляємо світлоту).
 */
export function harmonyPalette(rng: Rng, mode: HarmonyMode, count: number): Palette {
  const dark = rng() < 0.5;
  const baseHue = rng() * 360;
  const bg: Lch = dark ? [0.2 + rng() * 0.06, 0.02 + rng() * 0.03, baseHue] : [0.95 + rng() * 0.02, 0.01 + rng() * 0.02, baseHue + 40];
  const hues: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    if (mode === "analog") hues.push(baseHue + (i - (count - 2) / 2) * 30);
    else hues.push(baseHue + (i % 2) * 180 + Math.floor(i / 2) * 25);
  }
  const colors = [oklchToHex(bg)];
  for (let i = 0; i < hues.length; i++) {
    let L = dark ? 0.62 + ((i * 0.13) % 0.3) : 0.42 + ((i * 0.13) % 0.3);
    let hex = oklchToHex([L, 0.13 + rng() * 0.05, (hues[i] + 360) % 360]);
    // Підправляємо світлоту, доки колір не відрізнятиметься від усіх попередніх.
    for (let tries = 0; tries < 12 && colors.some((c) => deltaE(c, hex) < MIN_CONTRAST * 1.2); tries++) {
      L += dark ? 0.04 : -0.04;
      L = Math.min(0.92, Math.max(0.25, L));
      hex = oklchToHex([L, 0.15, (hues[i] + 17 * tries + 360) % 360]);
    }
    colors.push(hex);
  }
  return { id: `harmony-${mode}`, name: mode === "analog" ? "Гармонія: аналогові" : "Гармонія: комплементарні", colors };
}

/** Випадкова палітра: традиційна або гармонія. */
export function randomPalette(rng: Rng, choice: string): Palette {
  if (choice === "harmony-analog") return harmonyPalette(rng, "analog", randInt(rng, 3, 5));
  if (choice === "harmony-complementary") return harmonyPalette(rng, "complementary", randInt(rng, 3, 5));
  const found = TRADITIONAL.find((p) => p.id === choice);
  if (found) return found;
  return pick(rng, TRADITIONAL);
}

// ---------------------------------------------------------------- Preciosa

export interface PreciosaColor {
  code: string;
  article: string;
  hex: string;
  finish: string;
  en: string;
  lab: Lab;
}

let catalog: PreciosaColor[] | null = null;

export function preciosaCatalog(): PreciosaColor[] {
  if (!catalog) {
    catalog = PRECIOSA_DATA.split("\n").map((line) => {
      const [code, hole, hex, finish, en] = line.split("|");
      return {
        code,
        article: hole === "r" ? "311-19001" : "331-19001",
        hex: `#${hex}`,
        finish,
        en,
        lab: hexToOklab(`#${hex}`)
      };
    });
  }
  return catalog;
}

/** Найближчий колір каталогу Preciosa 10/0 за ΔE в OKLab. */
export function nearestPreciosa(hex: string): PreciosaColor & { dE: number } {
  const lab = hexToOklab(hex);
  let best = preciosaCatalog()[0];
  let bestD = Infinity;
  for (const c of preciosaCatalog()) {
    const d = Math.hypot(c.lab[0] - lab[0], c.lab[1] - lab[1], c.lab[2] - lab[2]);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return { ...best, dE: bestD };
}
