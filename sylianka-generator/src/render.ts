/** Малювання схеми на <canvas>. */
import type { Design } from "./build";
import { BEAD_SIZE } from "./build";
import { hexToOklab } from "./color";
import { MOTIFS } from "./motifs";
import type { SlotSpec } from "./params";
import { onGrid, toXY } from "./lattice";

export interface DrawOptions {
  /** Пікселів на одиницю ґратки. */
  scale: number;
  threads?: boolean;
  /** Фон полотна. */
  paper?: string;
  /** Показати межі раппорту. */
  rapport?: boolean;
  /** Ділянка (одиниці ґратки) для малювання; за замовчуванням — уся схема. */
  view?: { x0: number; y0: number; x1: number; y1: number };
}

export const PAPER = "#F7F4EE";
const PAD = 1.5;

/** Світлий відблиск для темних бісерин і темний контур для світлих. */
function outlineFor(hex: string): string {
  return hexToOklab(hex)[0] > 0.6 ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.55)";
}

export function drawBead(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, d: number, fill: string, scale: number): void {
  const r = (d / 2) * scale;
  ctx.fillStyle = fill;
  ctx.strokeStyle = outlineFor(fill);
  ctx.lineWidth = Math.max(0.6, scale * 0.06);
  ctx.beginPath();
  if (kind === "drop") {
    ctx.moveTo(x, y - r * 1.3);
    ctx.bezierCurveTo(x + r, y - r * 0.2, x + r, y + r, x, y + r);
    ctx.bezierCurveTo(x - r, y + r, x - r, y - r * 0.2, x, y - r * 1.3);
  } else if (kind === "bicone") {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.8, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r * 0.8, y);
    ctx.closePath();
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
  if (r >= 3) {
    // Відблиск.
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.32, r * 0.22, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Розмір полотна (у пікселях CSS) для схеми чи ділянки. */
export function canvasSize(d: Design, o: DrawOptions): { w: number; h: number } {
  const v = o.view ?? { x0: minX(d), y0: 0, x1: minX(d) + d.layout.width, y1: d.layout.height };
  return { w: Math.ceil((v.x1 - v.x0 + 2 * PAD) * o.scale), h: Math.ceil((v.y1 - v.y0 + 2 * PAD) * o.scale) };
}

const minX = (d: Design): number => d.beads.reduce((m, b) => Math.min(m, b.px - b.size / 2), 0);

export function drawDesign(canvas: HTMLCanvasElement, d: Design, o: DrawOptions): void {
  const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;
  const { w, h } = canvasSize(d, o);
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = o.paper ?? PAPER;
  ctx.fillRect(0, 0, w, h);
  const v = o.view ?? { x0: minX(d), y0: 0, x1: minX(d) + d.layout.width, y1: d.layout.height };
  const X = (x: number): number => (x - v.x0 + PAD) * o.scale;
  const Y = (y: number): number => (y - v.y0 + PAD) * o.scale;
  const inView = (x: number, y: number): boolean => x >= v.x0 - 2 && x <= v.x1 + 2 && y >= v.y0 - 2 && y <= v.y1 + 2;

  if (o.rapport) {
    const { X0, P, s } = d.layout;
    ctx.fillStyle = "rgba(210, 160, 40, 0.10)";
    const r = Math.floor(d.spec.rapports / 2);
    const x0 = X0 - 2 * s + r * P;
    ctx.fillRect(X(x0), Y(d.layout.bandTop - 0.5), P * o.scale, (d.layout.bandBottom - d.layout.bandTop + 1) * o.scale);
  }

  if (o.threads !== false) {
    ctx.strokeStyle = "rgba(120,112,100,0.55)";
    ctx.lineWidth = Math.max(0.5, o.scale * 0.08);
    ctx.beginPath();
    for (const [a, b] of d.threads) {
      const A = d.beads[a];
      const B = d.beads[b];
      if (!inView(A.px, A.py) && !inView(B.px, B.py)) continue;
      ctx.moveTo(X(A.px), Y(A.py));
      ctx.lineTo(X(B.px), Y(B.py));
    }
    ctx.stroke();
  }
  for (const b of d.beads) {
    if (!inView(b.px, b.py)) continue;
    drawBead(ctx, b.kind, X(b.px), Y(b.py), b.size, d.spec.colors[b.color], o.scale);
  }
}

/** Мотив окремо: усі бісерини сітки з m ≤ s навколо вузла. */
export function drawMotif(canvas: HTMLCanvasElement, slot: SlotSpec, colors: string[], s: number, scale: number): void {
  const R = s;
  const size = (4 * R + 2 * PAD) * scale;
  const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;
  canvas.width = Math.ceil(size * dpr);
  canvas.height = Math.ceil(size * dpr);
  canvas.style.width = `${Math.ceil(size)}px`;
  canvas.style.height = `${Math.ceil(size)}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, size, size);
  const motif = MOTIFS[slot.motif];
  for (let du = -R; du <= R; du++)
    for (let dv = -R; dv <= R; dv++) {
      const [x, y] = toXY(du, dv);
      if (!onGrid(x, y, s)) continue;
      const val = motif.fn(du, dv, s, R);
      const color = val === null || val < 0 ? 0 : (slot.colors[val] ?? 0);
      drawBead(ctx, "mesh", (x + 2 * R + PAD) * scale, (y + 2 * R + PAD) * scale, BEAD_SIZE, colors[color], scale);
    }
}
