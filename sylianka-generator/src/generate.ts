/**
 * Випадковий вибір повного опису схеми з параметрів і зерна.
 * Кожен шар бере числа зі свого генератора mulberry32(зерно шару), тож шар можна «заморозити».
 */
import { type Design, buildDesign } from "./build";
import { type Palette, randomPalette, TRADITIONAL } from "./color";
import { FRIEZE_GROUPS, type FriezeGroup, flipsVertically, hasGlide } from "./frieze";
import { MOTIFS, type MotifId } from "./motifs";
import {
  type BandSpec,
  type BottomSpec,
  type DesignSpec,
  type GenParams,
  JEWELRY_NAMES,
  LAYERS,
  type LadderSpec,
  type LayerName,
  type PendantSpec,
  type SlotSpec
} from "./params";
import { type Rng, chance, layerSeed, mix, mulberry32, pick, pickWeighted, randInt, shuffle } from "./rng";
import { type Report, validate } from "./validate";

export type LayerSeeds = Record<LayerName, number>;

export interface SeedState {
  seed: number;
  /** Заморожені шари: зерно шару, яке треба зберегти. */
  frozen: Partial<LayerSeeds>;
}

export function baseLayerSeeds(state: SeedState): LayerSeeds {
  const out = {} as LayerSeeds;
  for (const l of LAYERS) out[l] = state.frozen[l] ?? layerSeed(state.seed, l);
  return out;
}

const clampInt = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, Math.round(v)));

// ------------------------------------------------------------------ шари

function resolvePalette(rng: Rng, params: GenParams): Palette {
  const choice =
    params.palette === "auto"
      ? pickWeighted(rng, [
          ...TRADITIONAL.map((p) => [p.id, 1] as const),
          ["harmony-analog", 1.5] as const,
          ["harmony-complementary", 1.5] as const
        ])
      : params.palette;
  const pal = randomPalette(rng, choice);
  const want = clampInt(2 + Math.floor(params.complexity / 2) + (rng() < 0.5 ? 0 : 1), 2, 5);
  return { ...pal, colors: pal.colors.slice(0, Math.min(want, pal.colors.length)) };
}

const MAIN_POOL: MotifId[] = ["contour", "contourCross", "rings", "nodeDots", "roof", "chevron", "squareCenter", "flower"];
const FILLER_POOL: MotifId[] = ["dot", "nodeDots", "contour"];

function slotColors(rng: Rng, motif: MotifId, accents: number[], shift: number): number[] {
  const roles = MOTIFS[motif].roles;
  const out: number[] = [];
  for (let r = 0; r < roles; r++) out.push(accents[(shift + r) % accents.length]);
  // Сусідні ролі не повинні мати однаковий колір, якщо є з чого вибрати.
  if (roles > 1 && accents.length > 1 && out[0] === out[1]) out[1] = accents[(shift + 1) % accents.length];
  if (rng() < 0.15 && roles > 1) out.reverse();
  return out;
}

function resolveBand(rng: Rng, params: GenParams, nColors: number): { band: BandSpec; rapports: number } {
  const c = clampInt(params.complexity, 1, 5);
  const maxRows = params.type === "gerdan" ? 1 : params.type === "bracelet" ? 2 : c >= 4 ? 3 : c >= 3 ? 2 : 1;
  const rows = randInt(rng, 1, maxRows);
  const group: FriezeGroup =
    params.symmetry === "auto"
      ? pickWeighted(rng, FRIEZE_GROUPS.map((g) => [g, g === "p1" ? 0.6 : 1] as const))
      : params.symmetry;
  let nm = clampInt([1, 2, 2 + (rng() < 0.5 ? 0 : 1), 3 + (rng() < 0.5 ? 0 : 1), 4][c - 1], 1, 4);
  if (group === "p1m1" || group === "p2mm" || group === "p2") nm = Math.max(nm, 2);
  if (hasGlide(group) && nm % 2 === 1) nm++;

  const accents = shuffle(
    rng,
    Array.from({ length: nColors - 1 }, (_, i) => i + 1)
  );
  // Мотиви з вертикальною симетрією (дах, шеврон) гарні там, де група не перевертає смугу.
  const pool = MAIN_POOL.filter((m) => MOTIFS[m].symmetry === "D4" || !flipsVertically(group) || rng() < 0.35);
  const distinct = shuffle(rng, pool).slice(0, Math.min(pool.length, Math.max(1, Math.ceil(c / 1.5))));
  const main: SlotSpec[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: SlotSpec[] = [];
    for (let i = 0; i < nm; i++) {
      const motif = distinct[(i + r) % distinct.length];
      row.push({ motif, colors: slotColors(rng, motif, accents, i + r) });
    }
    main.push(row);
  }
  const fillers: (SlotSpec | null)[][] = [];
  for (let r = 0; r < rows - 1; r++) {
    const use = rng() < 0.7;
    const motif = pick(rng, FILLER_POOL);
    const color = accents[(r + 1) % accents.length];
    fillers.push(Array.from({ length: nm }, () => (use ? { motif, colors: [color] } : null)));
  }
  const slotsTarget = { choker: [10, 14], collar: [10, 14], bracelet: [4, 6], gerdan: [16, 22] }[params.type];
  const rapports =
    params.rapports > 0 ? params.rapports : Math.max(1, Math.round(randInt(rng, slotsTarget[0], slotsTarget[1]) / nm));
  return { band: { rows, group, perRapport: nm, main, fillers }, rapports };
}

function resolveLadder(rng: Rng, params: GenParams, nColors: number): LadderSpec | null {
  const p = { choker: 0.5, collar: 0.7, bracelet: 0, gerdan: 0.3 }[params.type];
  if (!chance(rng, p)) return null;
  const length = randInt(rng, 3, 8);
  const accent = chance(rng, 0.6) && nColors > 1;
  return {
    length,
    color: 0,
    accentIndex: accent ? randInt(rng, 1, length) : null,
    accentColor: accent ? randInt(rng, 1, nColors - 1) : 0
  };
}

function resolveBottom(rng: Rng, params: GenParams, ladder: LadderSpec | null, nColors: number): BottomSpec {
  const needs = ladder !== null || params.type === "collar" || params.type === "gerdan";
  let rows = 0;
  if (params.type === "bracelet") rows = 1;
  else if (needs) rows = randInt(rng, 1, 2);
  else rows = chance(rng, 0.4) ? 1 : 0;
  const betweenColor = params.type === "collar" && chance(rng, 0.6) && nColors > 1 ? randInt(rng, 1, nColors - 1) : null;
  return { rows, betweenColor };
}

function resolvePendants(rng: Rng, params: GenParams, nm: number, nColors: number): PendantSpec | null {
  if (params.type !== "collar" && params.type !== "gerdan") return null;
  const acc = shuffle(
    rng,
    Array.from({ length: nColors - 1 }, (_, i) => i + 1)
  );
  const a = acc[0];
  const b = acc[1 % acc.length];
  const tip = chance(rng, 0.85)
    ? { beadColor: b, kind: chance(rng, 0.6) ? ("drop" as const) : ("bicone" as const), color: a, sizeMm: pick(rng, [4, 4, 6]) }
    : null;
  const picot = chance(rng, 0.6) ? { beads: randInt(rng, 2, 4), color: chance(rng, 0.5) ? 0 : b } : null;
  if (params.type === "gerdan") {
    return {
      shape: "rhomb",
      size: 4,
      every: 1,
      centerOnly: true,
      railColor: a,
      pairColor: b,
      rhombContour: a,
      inner: pick(rng, ["cross", "rings", "dots"] as const),
      innerColor: b,
      picot,
      tip: tip ?? { beadColor: b, kind: "drop", color: a, sizeMm: 6 }
    };
  }
  const shape = pickWeighted(rng, [
    ["roof", 0.45],
    ["rhomb", 0.35],
    ["triangle", 0.2]
  ] as const);
  // Підвіска не ширша за крок: крок — ціле число мотивів смуги (≥ раппорт, якщо раппорт короткий).
  const every = nm >= 2 ? nm : 2;
  const room = (4 * every) / 2; // півкроку в одиницях s
  let size: number;
  if (shape === "roof") size = clampInt(randInt(rng, 2, 3), 1, room - 1);
  else if (shape === "rhomb") size = clampInt(pick(rng, [1, 2, 2]), 1, room);
  else size = clampInt(pick(rng, [1, 3]), 1, room % 2 === 0 ? room - 1 : room);
  return {
    shape,
    size,
    every,
    centerOnly: false,
    railColor: a,
    pairColor: b,
    rhombContour: a,
    inner: pick(rng, ["cross", "cross", "dots", "none"] as const),
    innerColor: b,
    picot,
    tip
  };
}

/** Повний опис схеми з параметрів і зерен шарів. */
export function resolveSpec(params: GenParams, seeds: LayerSeeds): DesignSpec {
  const palette = resolvePalette(mulberry32(seeds.palette), params);
  const nColors = palette.colors.length;
  const { band, rapports } = resolveBand(mulberry32(seeds.band), params, nColors);
  const ladder = resolveLadder(mulberry32(seeds.ladder), params, nColors);
  const bottom = resolveBottom(mulberry32(seeds.bottom), params, ladder, nColors);
  const pendants = resolvePendants(mulberry32(seeds.pendants), params, band.perRapport, nColors);
  return {
    version: 1,
    name: `${JEWELRY_NAMES[params.type]} — ${palette.name}`,
    type: params.type,
    k: clampInt(params.k, 1, 4),
    rapports,
    colors: palette.colors,
    paletteName: palette.name,
    band,
    ladder,
    bottom,
    pendants
  };
}

export interface Generated {
  design: Design;
  report: Report;
  /** Зерна шарів, з якими вийшла схема (їх зберігають для «заморожування»). */
  seeds: LayerSeeds;
  attempts: number;
}

export const MAX_ATTEMPTS = 24;

/**
 * Генерує схему. Якщо обмеження не виконано (фон поза 40–70 %, мало кольорів тощо), детерміновано
 * перебирає зерна незаморожених шарів: спроба n бере mix(зерно, n). Той самий seed — та сама схема.
 */
export function generate(params: GenParams, state: SeedState): Generated {
  const base = baseLayerSeeds(state);
  let best: Generated | null = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const seeds = { ...base };
    if (attempt > 0) for (const l of LAYERS) if (state.frozen[l] === undefined) seeds[l] = mix(base[l], attempt);
    const design = buildDesign(resolveSpec(params, seeds));
    const report = validate(design);
    const g: Generated = { design, report, seeds, attempts: attempt + 1 };
    if (report.ok) return g;
    if (!best || report.problems.length < best.report.problems.length) best = g;
  }
  return best!;
}

/** Зерна 12 варіантів галереї з головного зерна. */
export function gallerySeeds(master: number, count = 12): number[] {
  return Array.from({ length: count }, (_, i) => (i === 0 ? master : mix(master, i + 1) % 1_000_000_000));
}
