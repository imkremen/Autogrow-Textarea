/**
 * Параметри генератора й повний опис схеми (DesignSpec).
 *
 * Діапазони нижче — проєктні припущення з умови задачі, а не виміряна статистика
 * (датасету схем немає, див. docs/research.md, розділ 1).
 */
import type { FriezeGroup } from "./frieze";
import type { MotifId } from "./motifs";

export type JewelryType = "choker" | "collar" | "bracelet" | "gerdan";

export const JEWELRY_NAMES: Record<JewelryType, string> = {
  choker: "Чокер",
  collar: "Комірець з підвісками",
  bracelet: "Браслет",
  gerdan: "Гердан"
};

export const RANGES = {
  colors: [2, 5],
  background: [0.4, 0.7],
  bandRows: [1, 3],
  ladderLength: [3, 8],
  complexity: [1, 5]
} as const;

/** Параметри з інтерфейсу. */
export interface GenParams {
  type: JewelryType;
  /** Бісерин між вузлами (1–4). */
  k: number;
  /** Кількість раппортів; 0 — автоматично за типом. */
  rapports: number;
  /** "auto", id традиційної палітри, "harmony-analog", "harmony-complementary". */
  palette: string;
  symmetry: "auto" | FriezeGroup;
  /** 1–5: скільки різних мотивів і рядів. */
  complexity: number;
}

export const DEFAULT_PARAMS: GenParams = {
  type: "collar",
  k: 2,
  rapports: 0,
  palette: "auto",
  symmetry: "auto",
  complexity: 3
};

/** Шари, які можна «заморозити» (кожен має власне зерно). */
export const LAYERS = ["palette", "band", "ladder", "bottom", "pendants"] as const;
export type LayerName = (typeof LAYERS)[number];

export const LAYER_NAMES: Record<LayerName, string> = {
  palette: "Палітра",
  band: "Смуга мотивів",
  ladder: "Драбинка",
  bottom: "Нижня сітка",
  pendants: "Підвіски"
};

// ------------------------------------------------------------ повний опис схеми

/** Мотив у слоті: id і кольори для його ролей (індекси в палітрі, 0 — фон). */
export interface SlotSpec {
  motif: MotifId;
  colors: number[];
}

export interface BandSpec {
  /** Рядів мотивів (1–3). */
  rows: number;
  group: FriezeGroup;
  /** Основних мотивів у раппорті (раппорт = 2·perRapport комірок). */
  perRapport: number;
  /** Для кожного ряду мотивів — perRapport слотів. */
  main: SlotSpec[][];
  /** Для кожного проміжного ряду (між рядами мотивів) — perRapport слотів або null. */
  fillers: (SlotSpec | null)[][];
}

export interface LadderSpec {
  length: number;
  color: number;
  /** Номер акцентної бісерини (з 1) або null. */
  accentIndex: number | null;
  accentColor: number;
}

export interface BottomSpec {
  /** Рядів комірок нижньої сітки (0 — немає). */
  rows: number;
  /** Колір малого ромба між підвісками (null — немає). */
  betweenColor: number | null;
}

export type PendantShape = "roof" | "rhomb" | "triangle";
export type InnerMotif = "cross" | "rings" | "dots" | "none";

export interface PendantSpec {
  shape: PendantShape;
  /** roof — довжина плеча (комірок); rhomb — сторона q; triangle — ширина w (непарна). */
  size: number;
  /** Крок підвісок в основних мотивах смуги. */
  every: number;
  /** Лише одна підвіска посередині (медальйон гердана). */
  centerOnly: boolean;
  railColor: number;
  pairColor: number;
  /** Ромб (під дахом чи сам по собі): контур і внутрішній мотив. */
  rhombContour: number;
  inner: InnerMotif;
  innerColor: number;
  picot: { beads: number; color: number } | null;
  tip: { beadColor: number; kind: "drop" | "bicone"; color: number; sizeMm: number } | null;
}

export interface DesignSpec {
  version: 1;
  name: string;
  type: JewelryType;
  k: number;
  rapports: number;
  /** colors[0] — фон. */
  colors: string[];
  paletteName: string;
  band: BandSpec;
  ladder: LadderSpec | null;
  bottom: BottomSpec;
  pendants: PendantSpec | null;
}
