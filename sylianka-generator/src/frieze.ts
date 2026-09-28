/**
 * Сім фризових груп для стрічки.
 *
 * Координати — локальні для смуги: початок у вузлі на середній лінії смуги, P — період (у одиницях x).
 * Точкова група за модулем трансляції T(P) скінченна; візерунок будуємо як f(b) = f₀(rep(b)),
 * де rep(b) — канонічний (лексикографічно найменший) образ b за модулем P. Така f інваріантна щодо групи
 * за побудовою, а значення на фундаментальній області задає f₀.
 */

export const FRIEZE_GROUPS = ["p1", "p11g", "p1m1", "p11m", "p2", "p2mg", "p2mm"] as const;
export type FriezeGroup = (typeof FRIEZE_GROUPS)[number];

export const FRIEZE_NAMES: Record<FriezeGroup, string> = {
  p1: "p1 — лише перенесення",
  p11g: "p11g — ковзна симетрія",
  p1m1: "p1m1 — вертикальні дзеркала",
  p11m: "p11m — горизонтальне дзеркало",
  p2: "p2 — поворот на 180°",
  p2mg: "p2mg — вертикальні дзеркала + ковзна",
  p2mm: "p2mm — обидва дзеркала"
};

export type Pt = [number, number];
export type Op = (p: Pt) => Pt;

/** Елементарні операції (P — період). */
export function ops(P: number) {
  const id: Op = ([x, y]) => [x, y];
  /** Дзеркало відносно вертикалі x = 0. */
  const mirrorV: Op = ([x, y]) => [-x, y];
  /** Дзеркало відносно середньої лінії y = 0. */
  const mirrorH: Op = ([x, y]) => [x, -y];
  /** Поворот на 180° навколо початку. */
  const rot: Op = ([x, y]) => [-x, -y];
  /** Ковзна симетрія: дзеркало y = 0 і зсув на P/2. */
  const glide: Op = ([x, y]) => [x + P / 2, -y];
  /** Перенесення на період. */
  const translate: Op = ([x, y]) => [x + P, y];
  return { id, mirrorV, mirrorH, rot, glide, translate };
}

export const compose =
  (...fs: Op[]): Op =>
  (p) =>
    fs.reduceRight((acc, f) => f(acc), p);

/** Представники точкової групи (за модулем перенесення на P). */
export function pointGroup(group: FriezeGroup, P: number): Op[] {
  const o = ops(P);
  switch (group) {
    case "p1":
      return [o.id];
    case "p11g":
      return [o.id, o.glide];
    case "p1m1":
      return [o.id, o.mirrorV];
    case "p11m":
      return [o.id, o.mirrorH];
    case "p2":
      return [o.id, o.rot];
    case "p2mg":
      return [o.id, o.mirrorV, o.glide, compose(o.glide, o.mirrorV)];
    case "p2mm":
      return [o.id, o.mirrorV, o.mirrorH, o.rot];
  }
}

/** Твірні групи (разом із перенесенням) — для перевірки інваріантності. */
export function generators(group: FriezeGroup, P: number): Op[] {
  const o = ops(P);
  const gens: Record<FriezeGroup, Op[]> = {
    p1: [o.translate],
    p11g: [o.glide],
    p1m1: [o.translate, o.mirrorV],
    p11m: [o.translate, o.mirrorH],
    p2: [o.translate, o.rot],
    p2mg: [o.translate, o.mirrorV, o.glide],
    p2mm: [o.translate, o.mirrorV, o.mirrorH]
  };
  return gens[group];
}

/** Чи має група ковзну симетрію (їй потрібна парна кількість мотивів у раппорті). */
export const hasGlide = (g: FriezeGroup): boolean => g === "p11g" || g === "p2mg";
/** Чи перевертає група смугу догори дриґом (горизонтальне дзеркало, поворот чи ковзна). */
export const flipsVertically = (g: FriezeGroup): boolean => g !== "p1" && g !== "p1m1";

const modP = (x: number, P: number): number => ((x % P) + P) % P;

/** Канонічний представник орбіти точки: найменший (x mod P, y). */
export function canonical(group: FriezeGroup, P: number, p: Pt): Pt {
  let best: Pt | null = null;
  for (const g of pointGroup(group, P)) {
    const [x, y] = g(p);
    const c: Pt = [modP(x, P), y === 0 ? 0 : y];
    if (!best || c[0] < best[0] || (c[0] === best[0] && c[1] < best[1])) best = c;
  }
  return best!;
}

/** Порядок точкової групи. */
export const groupOrder = (g: FriezeGroup): number => pointGroup(g, 1).length;
