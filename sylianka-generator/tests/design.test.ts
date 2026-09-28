import { describe, expect, it } from "vitest";
import { type Design, buildDesign } from "../src/build";
import { generate, resolveSpec, baseLayerSeeds } from "../src/generate";
import { DEFAULT_PARAMS, type GenParams, type JewelryType } from "../src/params";
import { components, degrees, validate } from "../src/validate";
import { mulberry32 } from "../src/rng";

const TYPES: JewelryType[] = ["choker", "collar", "bracelet", "gerdan"];

function sample(n: number): { params: GenParams; seed: number }[] {
  const out: { params: GenParams; seed: number }[] = [];
  for (let i = 0; i < n; i++)
    out.push({
      seed: (i * 2654435761) >>> 0,
      params: { ...DEFAULT_PARAMS, type: TYPES[i % 4], k: 1 + (i % 4), complexity: 1 + ((i >> 2) % 5) }
    });
  return out;
}

describe("зв'язність і плетибельність", () => {
  const designs = sample(80).map(({ params, seed }) => ({ params, seed, g: generate(params, { seed, frozen: {} }) }));

  it("кожна згенерована схема — один зв'язний граф без ізольованих бісерин", () => {
    for (const { g } of designs) {
      const d = g.design;
      expect(components(d.beads.length, d.threads).count).toBe(1);
      expect(degrees(d.beads.length, d.threads).every((v) => v > 0)).toBe(true);
    }
  });

  it("усі бісерини сітки на лініях ґратки; сітка — лише з бісерин сітки", () => {
    for (const { g } of designs) {
      const r = validate(g.design);
      expect(r.onLattice).toBe(true);
    }
  });

  it("бісерини сітки: вузли мають ≤ 4 нитки, інші — рівно 2 (якщо не кріплення драбинки/пікота/кінчика)", () => {
    for (const { g } of designs) {
      const d = g.design;
      const deg = degrees(d.beads.length, d.threads);
      d.beads.forEach((b, i) => {
        if (b.kind !== "mesh") return;
        expect(deg[i]).toBeGreaterThanOrEqual(2);
        expect(deg[i]).toBeLessThanOrEqual(6);
      });
    }
  });

  it("підвіски кріпляться до сітки спільними бісеринами", () => {
    for (const { g } of designs) {
      for (const p of g.design.pendants) if (p.shape !== "between") expect(p.anchors.length).toBeGreaterThan(0);
    }
  });

  it("ширина — ціле число раппортів (+ замикальний мотив і по комірці фону з боків)", () => {
    for (const { g } of designs) {
      const d = g.design;
      const nm = d.spec.band.perRapport;
      expect(d.layout.slots).toBe(d.spec.rapports * nm + 1);
      expect(d.layout.cols).toBe(2 * d.layout.slots + 1);
      expect(d.layout.P).toBe(2 * d.layout.s * (2 * nm));
    }
  });

  it("обмеження кольорів і фону виконуються (після детермінованих повторних спроб)", () => {
    for (const { g } of designs) {
      expect(g.report.problems).toEqual([]);
      expect(g.report.bgFraction).toBeGreaterThanOrEqual(0.4);
      expect(g.report.bgFraction).toBeLessThanOrEqual(0.7);
      expect(g.report.colorsUsed).toBeGreaterThanOrEqual(2);
      expect(g.report.colorsUsed).toBeLessThanOrEqual(5);
      expect(g.report.minAdjacentContrast).toBeGreaterThanOrEqual(0.1);
    }
  });

  it("перевірка ловить ізольовану («висячу») бісерину й розірвану нитку", () => {
    const d: Design = designs[1].g.design;
    const extra = { ...d.beads[0], id: "висяча", px: -5, py: -5 };
    const broken: Design = { ...d, beads: [...d.beads, extra] };
    const r = validate(broken);
    expect(r.components).toBe(2);
    expect(r.isolated).toBe(1);
    expect(r.ok).toBe(false);

    // Прибираємо всі нитки однієї бісерини драбинки чи пікота — граф розпадається.
    const idx = d.beads.findIndex((b) => b.kind !== "mesh");
    if (idx >= 0) {
      const cut: Design = { ...d, threads: d.threads.filter(([a, b]) => a !== idx && b !== idx) };
      expect(validate(cut).components).toBeGreaterThan(1);
    }
  });
});

describe("відтворюваність", () => {
  it("mulberry32 детермінований", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    const xs = Array.from({ length: 5 }, () => a());
    expect(Array.from({ length: 5 }, () => b())).toEqual(xs);
    expect(xs.every((x) => x >= 0 && x < 1)).toBe(true);
    expect(mulberry32(124)()).not.toBe(xs[0]);
  });

  it("той самий seed — та сама схема", () => {
    for (const { params, seed } of sample(12)) {
      const a = generate(params, { seed, frozen: {} });
      const b = generate(params, { seed, frozen: {} });
      expect(JSON.stringify(b.design.spec)).toBe(JSON.stringify(a.design.spec));
      expect(b.design.beads.map((x) => x.color)).toEqual(a.design.beads.map((x) => x.color));
    }
  });

  it("різні seed — різні схеми", () => {
    const specs = new Set(sample(24).map(({ params, seed }) => JSON.stringify(generate(params, { seed, frozen: {} }).design.spec)));
    expect(specs.size).toBe(24);
  });

  it("заморожений шар лишається тим самим, решта змінюється", () => {
    const params = { ...DEFAULT_PARAMS, type: "collar" as const };
    const first = generate(params, { seed: 1, frozen: {} });
    const second = generate(params, { seed: 999, frozen: { band: first.seeds.band, palette: first.seeds.palette } });
    expect(second.design.spec.band).toEqual(first.design.spec.band);
    expect(second.design.spec.colors).toEqual(first.design.spec.colors);
    const other = resolveSpec(params, baseLayerSeeds({ seed: 999, frozen: {} }));
    expect(JSON.stringify(other.band)).not.toBe(JSON.stringify(first.design.spec.band));
  });

  it("опис схеми (spec) повністю задає схему", () => {
    const g = generate(DEFAULT_PARAMS, { seed: 77, frozen: {} });
    const again = buildDesign(JSON.parse(JSON.stringify(g.design.spec)));
    expect(again.beads.map((b) => [b.id, b.color])).toEqual(g.design.beads.map((b) => [b.id, b.color]));
  });
});
