/** Підрахунок бісеру по кольорах, грами із запасом, коди Preciosa 10/0. */
import { type Design, MM_PER_UNIT } from "./build";
import { nearestPreciosa } from "./color";

/** ≈ 90 бісерин Preciosa 10/0 в грамі (як у sylianka: ≈ 1 800 на 20 г, ≈ 2 600 на 30 г). */
export const BEADS_PER_GRAM = 90;
export const DEFAULT_RESERVE = 10;

export interface ColorRow {
  index: number;
  hex: string;
  code: string;
  article: string;
  en: string;
  dE: number;
  perRapport: number;
  total: number;
  grams: number;
}

export interface Stats {
  rows: ColorRow[];
  totalBeads: number;
  perRapportBeads: number;
  /** Краплі / біконуси (штук) за кольором. */
  drops: { index: number; hex: string; kind: string; sizeMm: number; count: number }[];
  lengthCm: number;
  heightCm: number;
}

export function gramsFor(count: number, reservePct: number): number {
  if (count <= 0) return 0;
  return Math.ceil(((count * (1 + reservePct / 100)) / BEADS_PER_GRAM) * 10 - 1e-9) / 10;
}

/** Діапазон x одного раппорту (середнього), для підрахунку «на раппорт». */
export function rapportRange(d: Design): [number, number] {
  const { X0, P, s } = d.layout;
  const r = Math.floor(d.spec.rapports / 2);
  const start = X0 - 2 * s + r * P;
  return [start, start + P];
}

export function computeStats(d: Design, reservePct = DEFAULT_RESERVE): Stats {
  const colors = d.spec.colors;
  const total = new Map<number, number>();
  const per = new Map<number, number>();
  const [x0, x1] = rapportRange(d);
  const dropMap = new Map<string, { index: number; hex: string; kind: string; sizeMm: number; count: number }>();
  let totalBeads = 0;
  let perRapportBeads = 0;
  for (const b of d.beads) {
    if (b.kind === "drop" || b.kind === "bicone") {
      const sizeMm = d.spec.pendants?.tip?.sizeMm ?? 4;
      const k = `${b.kind}-${b.color}`;
      const e = dropMap.get(k) ?? { index: b.color, hex: colors[b.color], kind: b.kind, sizeMm, count: 0 };
      e.count++;
      dropMap.set(k, e);
      continue;
    }
    totalBeads++;
    total.set(b.color, (total.get(b.color) ?? 0) + 1);
    if (b.px >= x0 && b.px < x1) {
      perRapportBeads++;
      per.set(b.color, (per.get(b.color) ?? 0) + 1);
    }
  }
  const rows: ColorRow[] = [...total.keys()]
    .sort((a, b) => a - b)
    .map((index) => {
      const p = nearestPreciosa(colors[index]);
      const t = total.get(index) ?? 0;
      return {
        index,
        hex: colors[index],
        code: p.code,
        article: p.article,
        en: p.en,
        dE: p.dE,
        perRapport: per.get(index) ?? 0,
        total: t,
        grams: gramsFor(t, reservePct)
      };
    });
  return {
    rows,
    totalBeads,
    perRapportBeads,
    drops: [...dropMap.values()],
    lengthCm: (d.layout.width * MM_PER_UNIT) / 10,
    heightCm: (d.layout.height * MM_PER_UNIT) / 10
  };
}
