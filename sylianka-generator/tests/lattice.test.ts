import { describe, expect, it } from "vitest";
import {
  cellCenter,
  cellEdges,
  gridNeighbors,
  isCellCenter,
  isNode,
  meshFromCells,
  onGrid,
  ring,
  toUV,
  toXY,
  type Cell
} from "../src/lattice";

describe("модель сітки", () => {
  it("u = (x+y)/2, v = (x−y)/2 і назад", () => {
    for (let x = -12; x <= 12; x++)
      for (let y = -12; y <= 12; y++) {
        if ((x + y) % 2 !== 0) continue;
        const [u, v] = toUV(x, y);
        expect(Number.isInteger(u) && Number.isInteger(v)).toBe(true);
        expect(toXY(u, v)).toEqual([x, y]);
      }
  });

  it("бісерина на сітці ⇔ u ≡ 0 або v ≡ 0 (mod s); вузол ⇔ обидва", () => {
    for (let k = 1; k <= 4; k++) {
      const s = k + 1;
      for (let u = -3 * s; u <= 3 * s; u++)
        for (let v = -3 * s; v <= 3 * s; v++) {
          const [x, y] = toXY(u, v);
          const um = ((u % s) + s) % s === 0;
          const vm = ((v % s) + s) % s === 0;
          expect(onGrid(x, y, s)).toBe(um || vm);
          expect(isNode(x, y, s)).toBe(um && vm);
        }
      // x + y непарне — не бісерина.
      expect(onGrid(1, 0, s)).toBe(false);
    }
  });

  it("між сусідніми вузлами рівно k бісерин", () => {
    for (let k = 1; k <= 4; k++) {
      const s = k + 1;
      const edges = cellEdges({ a: 0, b: 0 }, s);
      expect(edges).toHaveLength(4);
      for (const e of edges) {
        expect(e).toHaveLength(k + 2);
        expect(isNode(...e[0], s)).toBe(true);
        expect(isNode(...e[e.length - 1], s)).toBe(true);
        for (const p of e.slice(1, -1)) {
          expect(onGrid(...p, s)).toBe(true);
          expect(isNode(...p, s)).toBe(false);
        }
        // Сусіди по нитці відрізняються на (±1, ±1).
        for (let i = 1; i < e.length; i++) {
          expect(Math.abs(e[i][0] - e[i - 1][0])).toBe(1);
          expect(Math.abs(e[i][1] - e[i - 1][1])).toBe(1);
        }
      }
    }
  });

  it("ромбічні кільця: m = max(|du|, |dv|); на сітці кільце m = s має 8s бісерин, 0 < m < s — 4", () => {
    for (let k = 1; k <= 4; k++) {
      const s = k + 1;
      const count = (m: number): number => {
        let n = 0;
        for (let x = -4 * s; x <= 4 * s; x++)
          for (let y = -4 * s; y <= 4 * s; y++) if (onGrid(x, y, s) && ring(x, y, 0, 0) === m) n++;
        return n;
      };
      expect(count(s)).toBe(8 * s);
      expect(count(2 * s)).toBe(16 * s);
      for (let m = 1; m < s; m++) expect(count(m)).toBe(4);
    }
    // Кільце — ромб: (2, 0) і (0, 2) мають m = 1, а (1, 1) — теж 1 (u=1, v=0).
    expect(ring(2, 0, 0, 0)).toBe(1);
    expect(ring(0, 2, 0, 0)).toBe(1);
    expect(ring(1, 1, 0, 0)).toBe(1);
  });

  it("центр комірки (a, b): x = (a+b+1)s, y = (a−b)s", () => {
    const s = 3;
    const c: Cell = { a: 2, b: -1 };
    const [x, y] = cellCenter(c, s);
    expect([x, y]).toEqual([6, 9]);
    expect(isCellCenter(x, y, s)).toBe(true);
  });

  it("вузол має 4 сусіди по нитках, бісерина сторони — 2", () => {
    const s = 3;
    expect(gridNeighbors(0, 0, s)).toHaveLength(4);
    expect(gridNeighbors(1, 1, s)).toHaveLength(2);
    for (const [x, y] of gridNeighbors(1, 1, s)) expect(onGrid(x, y, s)).toBe(true);
  });

  it("сітка rows × cols має стільки ж бісерин, як трафарет sylianka", () => {
    for (const [rows, cols, k] of [
      [3, 5, 1],
      [4, 7, 2],
      [2, 3, 3],
      [5, 9, 4]
    ]) {
      const s = k + 1;
      const cells: Cell[] = [];
      for (let r = 0; r < rows; r++)
        for (let i = 0; i < cols; i++) {
          const cx = (2 * i + 2) * s;
          const cy = (2 * r + 1) * s;
          cells.push({ a: (cx / s - 1 + cy / s) / 2, b: (cx / s - 1 - cy / s) / 2 });
        }
      const side = k + 2;
      const expected = rows * (cols + 1) + (rows + 1) * cols + 4 * rows * cols * (side - 2);
      expect(meshFromCells(cells, s).beads.size).toBe(expected);
    }
  });
});
