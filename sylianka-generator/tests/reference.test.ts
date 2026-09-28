import { describe, expect, it } from "vitest";
import { type Bead, buildDesign } from "../src/build";
import { toUV } from "../src/lattice";
import { BLACK, BORDO, GOLD, REFERENCE_SPEC } from "../src/reference";
import { validate } from "../src/validate";

const d = buildDesign(REFERENCE_SPEC);
const s = d.layout.s;
const at = (piece: number, x: number, y: number): Bead => {
  const i = d.index.get(`${piece}:${x},${y}`);
  if (i === undefined) throw new Error(`немає бісерини ${piece}:${x},${y}`);
  return d.beads[i];
};

describe("референс «чорний/бордо/золото»", () => {
  it("проходить усі перевірки", () => {
    const r = validate(d);
    expect(r.problems).toEqual([]);
    expect(r.colorsUsed).toBe(3);
  });

  it("смуга: золота «квітка» з бордовим центром чергується з бордовим квадратом із золотою серединкою", () => {
    const Y = d.layout.Y0;
    for (let i = 0; i < d.layout.slots; i++) {
      const X = d.layout.X0 + 4 * s * i;
      const flower = i % 2 === 0;
      expect(at(0, X, Y).color).toBe(flower ? BORDO : GOLD); // центр
      expect(at(0, X, Y - 2 * s).color).toBe(flower ? GOLD : BORDO); // верхня вершина контуру
      expect(at(0, X + s, Y - s).color).toBe(flower ? GOLD : BORDO); // середина сторони
      // Хрест: у квітки — фон, у квадрата найближчі до центру — золоті.
      expect(at(0, X + 1, Y - 1).color).toBe(flower ? BLACK : GOLD);
      expect(at(0, X + 2, Y - 2).color).toBe(BLACK);
    }
  });

  it("обидва кінці завершуються цілим мотивом («квіткою») і коміркою фону", () => {
    const first = d.layout.X0;
    const last = d.layout.X0 + 4 * s * (d.layout.slots - 1);
    expect(at(0, first, d.layout.Y0).color).toBe(BORDO);
    expect(at(0, last, d.layout.Y0).color).toBe(BORDO);
    // Ліва крайня колонка комірок — фон.
    for (const b of d.beads) if (b.piece === 0 && b.x < 2 * s) expect(b.color).toBe(BLACK);
  });

  it("драбинка: нитки по 4 бісерини, 2-га золота", () => {
    const ladder = d.beads.filter((b) => b.kind === "ladder");
    expect(ladder.length).toBe(4 * d.layout.cols);
    for (const b of ladder) {
      const j = Number(b.id.split(":")[2]);
      expect(b.color).toBe(j === 2 ? GOLD : BLACK);
    }
  });

  const roofs = d.pendants.filter((p) => p.shape === "roof");
  const yB = 2 * s * d.layout.rows[1];
  const rel = (X: number, du: number, dv: number): Bead => at(1, X + du + dv, yB + du - dv);

  it("підвіска-«дах»: 2 золоті парочки на вершині й по 3 на плече, кінці плечей бордові", () => {
    expect(roofs.length).toBeGreaterThanOrEqual(3);
    for (const p of roofs) {
      const pair = (du: number, dv: number): number[] => [rel(p.x, du, dv).color];
      // Щаблі лівого плеча: dv ∈ {s (вершина), 0, −s, −2s}, du ∈ {−2, −1}.
      for (const dv of [s, 0, -s, -2 * s]) for (const du of [-1, -2]) expect(pair(du, dv)).toEqual([GOLD]);
      // Щаблі правого плеча: du ∈ {−s (вершина), 0, s, 2s}, dv ∈ {1, 2}.
      for (const du of [-s, 0, s, 2 * s]) for (const dv of [1, 2]) expect(pair(du, dv)).toEqual([GOLD]);
      // Торці плечей — бордові рейки.
      for (const du of [-1, -2]) expect(rel(p.x, du, -3 * s).color).toBe(BORDO);
      for (const dv of [1, 2]) expect(rel(p.x, 3 * s, dv).color).toBe(BORDO);
      // Рейки — бордові.
      for (let t = 0; t <= 3 * s; t++) {
        expect(rel(p.x, -s, -t).color).toBe(BORDO);
        expect(rel(p.x, t, s).color).toBe(BORDO);
      }
      // Усього золотих бісерин у парочках: 8 щаблів × k = 16.
      const pairs = p.ids.filter((id) => {
        const b = d.beads[d.index.get(id)!];
        if (b.piece !== 1) return false;
        const [du, dv] = toUV(b.x - p.x, b.y - yB);
        const inRoof = (du >= -s && du <= 0) || (dv >= 0 && dv <= s);
        return inRoof && b.color === GOLD;
      });
      expect(pairs.length).toBe(8 * REFERENCE_SPEC.k);
    }
  });

  it("під дахом — ромб із золотим хрестиком і бордовим контуром", () => {
    for (const p of roofs) {
      const Q = 2 * s;
      expect(rel(p.x, s, -s).color).toBe(GOLD); // центр
      for (let t = 1; t < Q; t++) {
        expect(rel(p.x, t, -s).color).toBe(GOLD);
        expect(rel(p.x, s, -t).color).toBe(GOLD);
      }
      for (let t = 0; t <= Q; t++) {
        expect(rel(p.x, Q, -t).color).toBe(BORDO);
        expect(rel(p.x, t, -Q).color).toBe(BORDO);
      }
    }
  });

  it("пікоти по 3 чорні бісерини; кінчик — золота бісерина й бордова крапля 4 мм", () => {
    const picots = d.beads.filter((b) => b.kind === "picot");
    expect(picots.length).toBe(roofs.length * 2 * 3);
    expect(picots.every((b) => b.color === BLACK)).toBe(true);
    const drops = d.beads.filter((b) => b.kind === "drop");
    expect(drops.length).toBe(roofs.length);
    expect(drops.every((b) => b.color === BORDO)).toBe(true);
    expect(d.beads.filter((b) => b.kind === "tip").every((b) => b.color === GOLD)).toBe(true);
    expect(REFERENCE_SPEC.pendants?.tip?.sizeMm).toBe(4);
  });

  it("між сусідніми підвісками — малий бордовий ромб", () => {
    const between = d.pendants.filter((p) => p.shape === "between");
    expect(between.length).toBe(roofs.length - 1);
    for (const b of between) {
      expect(b.ids.length).toBe(4 * (s)); // 4 сторони × (k + 1)
      for (const id of b.ids) expect(d.beads[d.index.get(id)!].color).toBe(BORDO);
    }
  });

  it("підвіски дзеркально симетричні відносно своєї вертикалі", () => {
    for (const p of roofs)
      for (const id of p.ids) {
        const b = d.beads[d.index.get(id)!];
        if (b.piece !== 1) continue;
        expect(at(1, 2 * p.x - b.x, b.y).color).toBe(b.color);
      }
  });
});
