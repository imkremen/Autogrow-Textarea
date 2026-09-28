/** Перевірка «плетибельності» й естетичних обмежень схеми. */
import type { Design } from "./build";
import { MIN_CONTRAST, deltaE } from "./color";
import { onGrid } from "./lattice";
import { RANGES } from "./params";

export interface Report {
  ok: boolean;
  /** Кількість компонент зв'язності графа (має бути 1). */
  components: number;
  /** Бісерини без жодної нитки. */
  isolated: number;
  /** Усі бісерини сітки лежать на лініях ґратки. */
  onLattice: boolean;
  bgFraction: number;
  colorsUsed: number;
  /** Найменший ΔE між різними кольорами, що стоять поруч на нитці. */
  minAdjacentContrast: number;
  /** Кожна підвіска має спільні бісерини з сіткою. */
  pendantsAttached: boolean;
  problems: string[];
}

/** Компоненти зв'язності (BFS). Повертає номер компоненти для кожної бісерини. */
export function components(n: number, edges: readonly [number, number][]): { count: number; comp: Int32Array } {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const comp = new Int32Array(n).fill(-1);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (comp[i] !== -1) continue;
    const queue = [i];
    comp[i] = count;
    while (queue.length) {
      const v = queue.pop()!;
      for (const w of adj[v]) {
        if (comp[w] === -1) {
          comp[w] = count;
          queue.push(w);
        }
      }
    }
    count++;
  }
  return { count, comp };
}

export function degrees(n: number, edges: readonly [number, number][]): Int32Array {
  const deg = new Int32Array(n);
  for (const [a, b] of edges) {
    deg[a]++;
    deg[b]++;
  }
  return deg;
}

export function validate(d: Design): Report {
  const problems: string[] = [];
  const n = d.beads.length;
  const { count } = components(n, d.threads);
  const deg = degrees(n, d.threads);
  const isolated = deg.reduce((s, v) => s + (v === 0 ? 1 : 0), 0);
  if (count !== 1) problems.push(`граф розпадається на ${count} частин`);
  if (isolated > 0) problems.push(`${isolated} бісерин без нитки`);

  const s = d.layout.s;
  const onLattice = d.beads.every((b) => b.kind !== "mesh" || onGrid(b.x, b.y, s));
  if (!onLattice) problems.push("бісерина сітки поза лініями ґратки");

  // Частка фону й кількість кольорів (крапля/біконус не рахуються як бісер).
  const seed = d.beads.filter((b) => b.kind !== "drop" && b.kind !== "bicone");
  const bg = seed.filter((b) => b.color === 0).length;
  const bgFraction = bg / seed.length;
  const used = new Set(d.beads.map((b) => b.color));
  const colorsUsed = used.size;
  if (bgFraction < RANGES.background[0] || bgFraction > RANGES.background[1])
    problems.push(`фон ${(bgFraction * 100).toFixed(0)} % (потрібно 40–70 %)`);
  if (colorsUsed < RANGES.colors[0] || colorsUsed > RANGES.colors[1]) problems.push(`${colorsUsed} кольорів (потрібно 2–5)`);

  let minAdjacentContrast = Infinity;
  const colors = d.spec.colors;
  const seen = new Set<string>();
  for (const [a, b] of d.threads) {
    const ca = d.beads[a].color;
    const cb = d.beads[b].color;
    if (ca === cb) continue;
    const k = ca < cb ? `${ca}-${cb}` : `${cb}-${ca}`;
    if (seen.has(k)) continue;
    seen.add(k);
    minAdjacentContrast = Math.min(minAdjacentContrast, deltaE(colors[ca], colors[cb]));
  }
  if (minAdjacentContrast < MIN_CONTRAST) problems.push(`сусідні кольори надто схожі (ΔE ${minAdjacentContrast.toFixed(3)})`);

  const pendantsAttached = d.pendants.every((p) => p.shape === "between" || p.anchors.length > 0);
  if (!pendantsAttached) problems.push("підвіска не кріпиться до сітки");

  return {
    ok: problems.length === 0,
    components: count,
    isolated,
    onLattice,
    bgFraction,
    colorsUsed,
    minAdjacentContrast: Number.isFinite(minAdjacentContrast) ? minAdjacentContrast : 1,
    pendantsAttached,
    problems
  };
}
