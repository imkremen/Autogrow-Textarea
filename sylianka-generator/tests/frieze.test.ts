import { describe, expect, it } from "vitest";
import { bandColorLocal, bandFrame } from "../src/build";
import { FRIEZE_GROUPS, type FriezeGroup, canonical, compose, generators, groupOrder, ops, pointGroup, type Pt } from "../src/frieze";
import { onGrid } from "../src/lattice";
import type { DesignSpec, SlotSpec } from "../src/params";
import { REFERENCE_SPEC } from "../src/reference";
import { mulberry32 } from "../src/rng";

const rng = mulberry32(42);
const points: Pt[] = Array.from({ length: 300 }, () => {
  const x = Math.floor(rng() * 200) - 100;
  const y = Math.floor(rng() * 60) - 30;
  return [x, (x + y) % 2 === 0 ? y : y + 1];
});

describe("фризові групи: операції", () => {
  const s = 3;
  const P = 4 * s * 2;
  const o = ops(P);

  it("дзеркала й поворот, застосовані двічі, — тотожність", () => {
    for (const p of points) {
      expect(compose(o.mirrorV, o.mirrorV)(p)).toEqual(p);
      expect(compose(o.mirrorH, o.mirrorH)(p)).toEqual(p);
      expect(compose(o.rot, o.rot)(p)).toEqual(p);
    }
  });

  it("ковзна симетрія двічі — перенесення на період (тотожність за модулем P)", () => {
    for (const p of points) expect(compose(o.glide, o.glide)(p)).toEqual(o.translate(p));
  });

  it("поворот = добуток двох дзеркал", () => {
    for (const p of points) expect(compose(o.mirrorH, o.mirrorV)(p)).toEqual(o.rot(p));
  });

  it("кожна операція переводить бісерини сітки в бісерини сітки", () => {
    for (let k = 1; k <= 4; k++) {
      const s = k + 1;
      for (const nm of [2, 4]) {
        const o = ops(4 * s * nm);
        for (const g of [o.mirrorV, o.mirrorH, o.rot, o.glide, o.translate])
          for (let x = -30; x <= 30; x++)
            for (let y = -12; y <= 12; y++) {
              if (!onGrid(x, y, s)) continue;
              const [gx, gy] = g([x, y]);
              expect(onGrid(gx, gy, s)).toBe(true);
            }
      }
    }
  });

  it("порядки точкових груп: p1 = 1, p11g/p1m1/p11m/p2 = 2, p2mg/p2mm = 4", () => {
    expect(FRIEZE_GROUPS.map(groupOrder)).toEqual([1, 2, 2, 2, 2, 4, 4]);
  });

  it("канонічний представник однаковий для всієї орбіти", () => {
    for (const g of FRIEZE_GROUPS)
      for (const p of points) {
        const c = canonical(g, P, p);
        expect(c[0]).toBeGreaterThanOrEqual(0);
        expect(c[0]).toBeLessThan(P);
        for (const h of generators(g, P)) expect(canonical(g, P, h(p))).toEqual(c);
        for (const h of pointGroup(g, P)) expect(canonical(g, P, h(p))).toEqual(c);
      }
  });
});

/** Смуга з асиметричними мотивами, щоб перевірка інваріантності не була порожньою. */
function asymSpec(group: FriezeGroup, rows: number): DesignSpec {
  const slot = (motif: SlotSpec["motif"], a: number, b: number): SlotSpec => ({ motif, colors: [a, b, 1] });
  const row = [slot("roof", 1, 2), slot("chevron", 2, 1), slot("rings", 1, 2), slot("contourCross", 2, 1)];
  return {
    ...REFERENCE_SPEC,
    k: 2,
    rapports: 3,
    band: {
      rows,
      group,
      perRapport: 4,
      main: Array.from({ length: rows }, (_, r) => row.map((x, i) => row[(i + r) % 4] ?? x)),
      fillers: Array.from({ length: rows - 1 }, () => [slot("dot", 2, 2), null, slot("nodeDots", 1, 1), null])
    }
  };
}

describe("фризові групи: симетризований візерунок", () => {
  for (const group of FRIEZE_GROUPS)
    for (const rows of [1, 2, 3])
      it(`${group}, рядів ${rows}: колір інваріантний щодо твірних групи`, () => {
        const f = bandFrame(asymSpec(group, rows));
        const H = 2 * f.s * rows;
        for (let x = -3 * f.P; x <= 3 * f.P; x++)
          for (let y = -H; y <= H; y++) {
            if (!onGrid(x, y, f.s)) continue;
            const c = bandColorLocal(f, x, y, false);
            for (const g of generators(group, f.P)) {
              const [gx, gy] = g([x, y]);
              expect(bandColorLocal(f, gx, gy, false)).toBe(c);
            }
          }
      });

  it("p1 з «дахом» не має дзеркальної симетрії (перевірка не порожня)", () => {
    const f = bandFrame(asymSpec("p1", 1));
    let broken = 0;
    for (let x = -f.P; x <= f.P; x++)
      for (let y = -2 * f.s; y <= 2 * f.s; y++) {
        if (!onGrid(x, y, f.s)) continue;
        if (bandColorLocal(f, x, y, false) !== bandColorLocal(f, x, -y, false)) broken++;
      }
    expect(broken).toBeGreaterThan(0);
  });

  it("сім груп дають сім різних візерунків з тієї самої фундаментальної області", () => {
    const sigs = new Set<string>();
    for (const group of FRIEZE_GROUPS) {
      const f = bandFrame(asymSpec(group, 3));
      const out: number[] = [];
      for (let x = 0; x < 2 * f.P; x++) for (let y = -6 * f.s; y <= 6 * f.s; y++) if (onGrid(x, y, f.s)) out.push(bandColorLocal(f, x, y, false));
      sigs.add(out.join(""));
    }
    expect(sigs.size).toBe(7);
  });
});
