/** Експорт: JSON генератора, сумісний .sylianka.json (формат 2), SVG. */
import type { Design } from "./build";
import { nearestPreciosa } from "./color";
import type { GenParams } from "./params";
import type { LayerSeeds } from "./generate";

// ------------------------------------------------------------------ .sylianka.json

export interface SyliankaFile {
  app: "sylianka";
  format: 2;
  project: {
    name: string;
    rows: number;
    cols: number;
    side: number;
    palette: string[];
    fills: Record<string, Record<string, string>>;
    woven: Record<string, string[]>;
    gaps: { unit: number; x: number[]; y: number[] };
    repeat: number;
    shape: Record<string, number[]>;
    createdAt: number;
    updatedAt: number;
  };
  colors: never[];
}

const fmt3 = (v: number): string => (Math.round(v * 1000) / 1000).toFixed(3);

/**
 * Трафарет для https://binyachovo.github.io/sylianka/: side = k + 2, lx = x/s − 1, ly = y/s
 * (див. docs/research.md, розділ 2). Береться верхня частина сітки (над драбинкою); якщо драбинки немає —
 * уся сітка разом із підвісками в межах прямокутника. Бісерини поза ним формат не описує.
 */
export function toSylianka(d: Design, now = Date.now()): { file: SyliankaFile; skipped: number } {
  const s = d.layout.s;
  const side = d.spec.k + 2;
  const hasLadder = d.spec.ladder !== null;
  const cols = d.layout.cols;
  let maxY = 0;
  for (const b of d.beads) if (b.kind === "mesh" && b.piece === 0) maxY = Math.max(maxY, b.y);
  const rows = hasLadder ? d.layout.rows[0] : Math.ceil(maxY / (2 * s));
  const code = d.spec.colors.map((hex) => `p:${nearestPreciosa(hex).code}`);
  const fills: Record<string, string> = {};
  let skipped = 0;
  for (const b of d.beads) {
    if (b.kind !== "mesh" || b.piece !== 0) {
      skipped++;
      continue;
    }
    const lx = b.x / s - 1;
    const ly = b.y / s;
    if (lx < -1e-9 || ly < -1e-9 || lx > 2 * cols + 1e-9 || ly > 2 * rows + 1e-9) {
      skipped++;
      continue;
    }
    fills[`${fmt3(lx)},${fmt3(ly)}`] = code[b.color];
  }
  const repeat = 2 * d.spec.band.perRapport;
  return {
    skipped,
    file: {
      app: "sylianka",
      format: 2,
      project: {
        name: d.spec.name.slice(0, 80),
        rows,
        cols,
        side,
        palette: [...new Set(code)],
        fills: { [String(side)]: fills },
        woven: { [String(side)]: [] },
        gaps: { unit: 2520, x: [], y: [] },
        repeat,
        shape: {},
        createdAt: now,
        updatedAt: now
      },
      colors: []
    }
  };
}

// ------------------------------------------------------------------ JSON генератора

export function toJson(d: Design, meta: { seed: number | null; params: GenParams | null; seeds: LayerSeeds | null }): string {
  return JSON.stringify(
    {
      app: "sylianka-generator",
      version: 1,
      seed: meta.seed,
      params: meta.params,
      layerSeeds: meta.seeds,
      spec: d.spec,
      colors: d.spec.colors.map((hex, i) => {
        const p = nearestPreciosa(hex);
        return { index: i, hex, preciosa: p.code, article: p.article };
      }),
      beads: d.beads.map((b) => ({
        id: b.id,
        kind: b.kind,
        layer: b.layer,
        x: Number.isFinite(b.x) ? b.x : null,
        y: Number.isFinite(b.y) ? b.y : null,
        px: Math.round(b.px * 1000) / 1000,
        py: Math.round(b.py * 1000) / 1000,
        color: b.color
      })),
      threads: d.threads
    },
    null,
    1
  );
}

// ------------------------------------------------------------------ SVG

export function toSvg(d: Design, scale = 8, threads = true): string {
  const pad = 2;
  const minX = d.beads.reduce((m, b) => Math.min(m, b.px - b.size / 2), 0);
  const W = (d.layout.width + 2 * pad) * scale;
  const H = (d.layout.height + 2 * pad) * scale;
  const tx = (x: number): number => Math.round((x - minX + pad) * scale * 100) / 100;
  const ty = (y: number): number => Math.round((y + pad) * scale * 100) / 100;
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(W)}" height="${Math.ceil(H)}" viewBox="0 0 ${Math.ceil(W)} ${Math.ceil(H)}">`,
    `<rect width="100%" height="100%" fill="#F7F4EE"/>`
  ];
  if (threads) {
    parts.push(`<g stroke="#9A948A" stroke-width="${(scale * 0.08).toFixed(2)}" fill="none">`);
    for (const [a, b] of d.threads) {
      const A = d.beads[a];
      const B = d.beads[b];
      parts.push(`<line x1="${tx(A.px)}" y1="${ty(A.py)}" x2="${tx(B.px)}" y2="${ty(B.py)}"/>`);
    }
    parts.push("</g>");
  }
  for (const b of d.beads) {
    const fill = d.spec.colors[b.color];
    const r = (b.size / 2) * scale;
    const x = tx(b.px);
    const y = ty(b.py);
    if (b.kind === "drop") {
      const top = y - r * 1.3;
      parts.push(
        `<path d="M${x} ${top.toFixed(2)} C ${(x + r).toFixed(2)} ${(y - r * 0.2).toFixed(2)}, ${(x + r).toFixed(2)} ${(y + r).toFixed(2)}, ${x} ${(y + r).toFixed(2)} C ${(x - r).toFixed(2)} ${(y + r).toFixed(2)}, ${(x - r).toFixed(2)} ${(y - r * 0.2).toFixed(2)}, ${x} ${top.toFixed(2)} Z" fill="${fill}" stroke="#00000055"/>`
      );
    } else if (b.kind === "bicone") {
      parts.push(
        `<path d="M${x} ${(y - r).toFixed(2)} L${(x + r * 0.8).toFixed(2)} ${y} L${x} ${(y + r).toFixed(2)} L${(x - r * 0.8).toFixed(2)} ${y} Z" fill="${fill}" stroke="#00000055"/>`
      );
    } else {
      parts.push(`<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="${fill}" stroke="#00000040" stroke-width="${(scale * 0.06).toFixed(2)}"/>`);
    }
  }
  parts.push("</svg>");
  return parts.join("\n");
}
