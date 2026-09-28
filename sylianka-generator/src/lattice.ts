/**
 * Ромбічна сітка силянки.
 *
 * Бісерина має координати (x, y), x + y парне; u = (x + y) / 2, v = (x − y) / 2.
 * k — бісерин між вузлами (1–4), крок s = k + 1. Бісерина лежить на сітці, якщо u ≡ 0 або v ≡ 0 (mod s);
 * вузол — якщо обидва. Лінії u = const ідуть праворуч-угору, v = const — праворуч-униз.
 * Комірка (a, b) — квадрат as ≤ u ≤ (a+1)s, bs ≤ v ≤ (b+1)s, тобто ромб із центром
 * x = (a+b+1)s, y = (a−b)s, шириною й висотою 2s.
 */

export const K_MIN = 1;
export const K_MAX = 4;

export const mod = (a: number, n: number): number => ((a % n) + n) % n;

export const toUV = (x: number, y: number): [number, number] => [(x + y) / 2, (x - y) / 2];
export const toXY = (u: number, v: number): [number, number] => [u + v, u - v];

export function isLatticePoint(x: number, y: number): boolean {
  return Number.isInteger(x) && Number.isInteger(y) && mod(x + y, 2) === 0;
}

export function onGrid(x: number, y: number, s: number): boolean {
  if (!isLatticePoint(x, y)) return false;
  const [u, v] = toUV(x, y);
  return mod(u, s) === 0 || mod(v, s) === 0;
}

export function isNode(x: number, y: number, s: number): boolean {
  if (!isLatticePoint(x, y)) return false;
  const [u, v] = toUV(x, y);
  return mod(u, s) === 0 && mod(v, s) === 0;
}

/** «Ромбічне кільце»: m = max(|du|, |dv|) від центру (cx, cy). */
export function ring(x: number, y: number, cx: number, cy: number): number {
  const [du, dv] = toUV(x - cx, y - cy);
  return Math.max(Math.abs(du), Math.abs(dv));
}

export const key = (x: number, y: number): string => `${x},${y}`;

export function parseKey(k: string): [number, number] {
  const i = k.indexOf(",");
  return [Number(k.slice(0, i)), Number(k.slice(i + 1))];
}

/** Комірка за індексами (a, b). */
export interface Cell {
  a: number;
  b: number;
}

export const cellKey = (c: Cell): string => `${c.a},${c.b}`;

/** Центр комірки в (x, y). */
export function cellCenter(c: Cell, s: number): [number, number] {
  return [(c.a + c.b + 1) * s, (c.a - c.b) * s];
}

/** Комірка з центром (x, y) (центр мусить бути центром комірки). */
export function cellAt(x: number, y: number, s: number): Cell {
  const a = (x / s - 1 + y / s) / 2;
  const b = (x / s - 1 - y / s) / 2;
  if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error(`(${x}, ${y}) не центр комірки для s=${s}`);
  return { a, b };
}

/** Чи є (x, y) центром комірки. */
export function isCellCenter(x: number, y: number, s: number): boolean {
  if (!Number.isInteger(x / s) || !Number.isInteger(y / s)) return false;
  return mod(x / s + y / s, 2) === 1;
}

/**
 * Чотири сторони комірки, кожна як список бісерин від вузла до вузла (s + 1 бісерина).
 * Порядок: верхня-ліва, верхня-права, нижня-права, нижня-ліва.
 */
export function cellEdges(c: Cell, s: number): [number, number][][] {
  const u0 = c.a * s;
  const u1 = u0 + s;
  const v0 = c.b * s;
  const v1 = v0 + s;
  const seg = (ua: number, va: number, ub: number, vb: number): [number, number][] => {
    const out: [number, number][] = [];
    for (let t = 0; t <= s; t++) {
      const u = ua + ((ub - ua) / s) * t;
      const v = va + ((vb - va) / s) * t;
      out.push(toXY(u, v));
    }
    return out;
  };
  // Вершини: ліва (u0, v0), верхня (u0, v1), права (u1, v1), нижня (u1, v0).
  return [seg(u0, v0, u0, v1), seg(u0, v1, u1, v1), seg(u1, v1, u1, v0), seg(u1, v0, u0, v0)];
}

/** Сусіди бісерини по нитках сітки (лише ті, що на сітці; чи є вони у виробі — вирішує виріб). */
export function gridNeighbors(x: number, y: number, s: number): [number, number][] {
  const [u, v] = toUV(x, y);
  const out: [number, number][] = [];
  if (mod(u, s) === 0) {
    out.push(toXY(u, v + 1), toXY(u, v - 1));
  }
  if (mod(v, s) === 0) {
    out.push(toXY(u + 1, v), toXY(u - 1, v));
  }
  return out;
}

/** Бісерин у сітці, складеній з набору комірок, і нитки між ними. */
export function meshFromCells(cells: Iterable<Cell>, s: number): { beads: Set<string>; threads: Set<string> } {
  const beads = new Set<string>();
  const threads = new Set<string>();
  for (const c of cells) {
    for (const edge of cellEdges(c, s)) {
      for (let i = 0; i < edge.length; i++) {
        const k = key(edge[i][0], edge[i][1]);
        beads.add(k);
        if (i > 0) threads.add(threadKey(key(edge[i - 1][0], edge[i - 1][1]), k));
      }
    }
  }
  return { beads, threads };
}

export const threadKey = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
