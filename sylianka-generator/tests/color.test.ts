import { describe, expect, it } from "vitest";
import {
  MIN_CONTRAST,
  TRADITIONAL,
  deltaE,
  harmonyPalette,
  hexToOklab,
  hexToOklch,
  nearestPreciosa,
  oklchToHex,
  preciosaCatalog
} from "../src/color";
import { mulberry32 } from "../src/rng";
import { gramsFor } from "../src/stats";

describe("кольори", () => {
  it("OKLab: білий ≈ (1, 0, 0), чорний = (0, 0, 0)", () => {
    const w = hexToOklab("#FFFFFF");
    expect(w[0]).toBeCloseTo(1, 3);
    expect(Math.abs(w[1]) + Math.abs(w[2])).toBeLessThan(1e-3);
    expect(hexToOklab("#000000").every((v) => Math.abs(v) < 1e-9)).toBe(true);
  });

  it("HEX → OKLCH → HEX повертає той самий колір", () => {
    for (const hex of ["#7A1428", "#C9A232", "#1F4FA8", "#2A9D9A", "#F4F1EA", "#141414"]) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex);
    }
  });

  it("гармонії OKLCH: усі пари кольорів відрізняються щонайменше на MIN_CONTRAST", () => {
    for (let seed = 0; seed < 200; seed++) {
      for (const mode of ["analog", "complementary"] as const) {
        const rng = mulberry32(seed);
        const p = harmonyPalette(rng, mode, 3 + (seed % 3));
        for (let i = 0; i < p.colors.length; i++)
          for (let j = i + 1; j < p.colors.length; j++) expect(deltaE(p.colors[i], p.colors[j])).toBeGreaterThanOrEqual(MIN_CONTRAST);
      }
    }
  });

  it("традиційні палітри: 4–5 кольорів, попарно контрастні", () => {
    for (const p of TRADITIONAL) {
      expect(p.colors.length).toBeGreaterThanOrEqual(4);
      for (let i = 0; i < p.colors.length; i++)
        for (let j = i + 1; j < p.colors.length; j++) expect(deltaE(p.colors[i], p.colors[j])).toBeGreaterThanOrEqual(MIN_CONTRAST);
    }
  });

  it("каталог Preciosa 10/0: 1 372 кольори, найближчий до кольору з каталогу — він сам", () => {
    const cat = preciosaCatalog();
    expect(cat.length).toBe(1372);
    for (const c of cat.slice(0, 50)) {
      const n = nearestPreciosa(c.hex);
      expect(n.dE).toBeLessThan(1e-9);
      expect(n.hex).toBe(c.hex);
    }
    expect(nearestPreciosa("#141414").en).toMatch(/black/);
  });

  it("грами: ≈ 90 бісерин у грамі, запас, округлення вгору до десятих", () => {
    expect(gramsFor(0, 10)).toBe(0);
    expect(gramsFor(90, 0)).toBe(1);
    expect(gramsFor(90, 10)).toBe(1.1);
    expect(gramsFor(1000, 10)).toBe(12.3);
  });
});
