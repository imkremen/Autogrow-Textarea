import { describe, expect, it } from "vitest";
import { buildDesign } from "../src/build";
import { toJson, toSvg, toSylianka } from "../src/export";
import { generate } from "../src/generate";
import { DEFAULT_PARAMS } from "../src/params";
import { REFERENCE_SPEC } from "../src/reference";

const fmt = (v: number): string => (Math.round(v * 1000) / 1000).toFixed(3);

/** Ключі бісерин трафарету sylianka rows × cols (як buildGeometry у binyachovo/sylianka). */
function syliankaKeys(rows: number, cols: number, side: number): Set<string> {
  const keys = new Set<string>();
  const add = (x: number, y: number): void => {
    keys.add(`${fmt(x)},${fmt(y)}`);
  };
  for (let r = 0; r < rows; r++) for (let i = 0; i <= cols; i++) add(2 * i, 2 * r + 1);
  for (let r = 0; r <= rows; r++) for (let i = 0; i < cols; i++) add(2 * i + 1, 2 * r);
  for (let r = 0; r < rows; r++)
    for (let i = 0; i < cols; i++) {
      const cx = 2 * i + 1;
      const cy = 2 * r + 1;
      const pts = [
        [cx - 1, cy],
        [cx, cy - 1],
        [cx + 1, cy],
        [cx, cy + 1]
      ];
      for (let e = 0; e < 4; e++) {
        const a = pts[e];
        const b = pts[(e + 1) % 4];
        const m = side - 2;
        for (let j = 1; j <= m; j++) {
          const t = j / (m + 1);
          add(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
        }
      }
    }
  return keys;
}

describe("експорт .sylianka.json", () => {
  it("сітка над драбинкою збігається з трафаретом sylianka бісерина в бісерину", () => {
    for (let k = 1; k <= 4; k++) {
      const d = buildDesign({ ...REFERENCE_SPEC, k });
      const { file } = toSylianka(d, 0);
      const p = file.project;
      expect(p.side).toBe(k + 2);
      const fills = p.fills[String(p.side)];
      const expected = syliankaKeys(p.rows, p.cols, p.side);
      expect(new Set(Object.keys(fills))).toEqual(expected);
    }
  });

  it("формат: app, format 2, ключі й коди кольорів у форматі sylianka", () => {
    const g = generate({ ...DEFAULT_PARAMS, type: "choker" }, { seed: 5, frozen: {} });
    const { file } = toSylianka(g.design, 0);
    expect(file.app).toBe("sylianka");
    expect(file.format).toBe(2);
    const fills = file.project.fills[String(file.project.side)];
    for (const [k, v] of Object.entries(fills)) {
      expect(k).toMatch(/^\d+\.\d{3},\d+\.\d{3}$/);
      expect(v).toMatch(/^p:[0-9A-Za-z]{5}$/);
      expect(file.project.palette).toContain(v);
    }
    expect(file.project.repeat).toBe(2 * g.design.spec.band.perRapport);
  });

  it("колір бісерини в трафареті — код Preciosa її кольору", () => {
    const d = buildDesign(REFERENCE_SPEC);
    const { file } = toSylianka(d, 0);
    const fills = file.project.fills["4"];
    const s = 3;
    // Центр першої «квітки» (x = 12, y = 12) — бордовий; ключ (x/s − 1, y/s).
    const centre = fills[`${fmt(12 / s - 1)},${fmt(12 / s)}`];
    const top = fills[`${fmt(12 / s - 1)},${fmt(6 / s)}`];
    expect(centre).not.toBe(top);
    expect(new Set(Object.values(fills)).size).toBe(3);
  });
});

describe("експорт JSON і SVG", () => {
  it("JSON містить seed, параметри й spec, з яких схема відтворюється", () => {
    const g = generate(DEFAULT_PARAMS, { seed: 31, frozen: {} });
    const data = JSON.parse(toJson(g.design, { seed: 31, params: DEFAULT_PARAMS, seeds: g.seeds }));
    expect(data.seed).toBe(31);
    expect(data.beads.length).toBe(g.design.beads.length);
    const again = buildDesign(data.spec);
    expect(again.beads.map((b) => b.color)).toEqual(g.design.beads.map((b) => b.color));
    expect(generate(data.params, { seed: data.seed, frozen: {} }).design.spec).toEqual(g.design.spec);
  });

  it("SVG: по фігурі на кожну бісерину", () => {
    const d = buildDesign(REFERENCE_SPEC);
    const svg = toSvg(d, 6, false);
    const shapes = (svg.match(/<circle /g) ?? []).length + (svg.match(/<path /g) ?? []).length;
    expect(shapes).toBe(d.beads.length);
    expect(svg.startsWith("<svg")).toBe(true);
  });
});
