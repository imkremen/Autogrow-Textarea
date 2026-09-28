/**
 * Побудова прикраси з повного опису (DesignSpec) за граматикою зверху вниз:
 * горловина → смуга мотивів → драбинка → нижня сітка → підвіски → кінчики.
 * Тут немає випадковості: та сама специфікація дає ту саму схему.
 */
import { type FriezeGroup, canonical, pointGroup } from "./frieze";
import { type Cell, cellKey, isNode, key, meshFromCells, mod, onGrid, parseKey, threadKey, toUV } from "./lattice";
import { BG, MOTIFS } from "./motifs";
import type { BandSpec, DesignSpec, PendantSpec, SlotSpec } from "./params";

export type BeadKind = "mesh" | "ladder" | "picot" | "tip" | "drop" | "bicone";
export type Layer = "neck" | "band" | "bottom" | "ladder" | "pendant" | "picot" | "tip";

export interface Bead {
  id: string;
  kind: BeadKind;
  layer: Layer;
  /** Частина сітки (0 — над драбинкою, 1 — під нею); -1 — не на сітці. */
  piece: number;
  /** Координати ґратки своєї частини (для бісерин поза сіткою — NaN). */
  x: number;
  y: number;
  /** Положення для малювання, в одиницях ґратки. */
  px: number;
  py: number;
  /** Індекс кольору в палітрі (0 — фон). */
  color: number;
  /** Діаметр для малювання (одиниці ґратки). */
  size: number;
}

export interface PendantInfo {
  x: number;
  shape: PendantSpec["shape"] | "between";
  /** Бісерини підвіски, спільні з сіткою (кріплення). */
  anchors: string[];
  ids: string[];
}

export interface Layout {
  s: number;
  /** Основних мотивів у смузі. */
  slots: number;
  /** Період смуги (одиниці x). */
  P: number;
  /** Центр першого мотиву. */
  X0: number;
  Y0: number;
  /** Колонок основних комірок (як cols у sylianka). */
  cols: number;
  /** Рядів основних комірок у кожній частині. */
  rows: number[];
  /** Зсув частин по вертикалі при малюванні. */
  pieceOffset: number[];
  bandTop: number;
  bandBottom: number;
  width: number;
  height: number;
}

export interface Design {
  spec: DesignSpec;
  beads: Bead[];
  /** Нитки: пари індексів бісерин. */
  threads: [number, number][];
  index: Map<string, number>;
  layout: Layout;
  pendants: PendantInfo[];
}

/** Діаметр звичайної бісерини при малюванні (крок по нитці — √2). */
export const BEAD_SIZE = 1.24;
/** Бісерина 10/0 ≈ 2,3 мм відповідає кроку √2 одиниць ґратки. */
export const MM_PER_UNIT = 2.3 / Math.SQRT2;

// ------------------------------------------------------------------ смуга

/** Внутрішні дані для розфарбування смуги. */
export interface BandFrame {
  s: number;
  band: BandSpec;
  /** Кількість основних мотивів уздовж смуги. */
  slots: number;
  X0: number;
  /** Середня лінія смуги (вісь горизонтальних операцій). */
  Ymid: number;
  P: number;
}

export function bandFrame(spec: DesignSpec): BandFrame {
  const s = spec.k + 1;
  const b = spec.band;
  const X0 = 4 * s;
  const Y0 = 4 * s;
  // Ціле число раппортів + замикальний мотив (перший мотив наступного раппорту), щоб обидва кінці
  // завершувалися цілим мотивом, а для груп із вертикальними дзеркалами вся прикраса була симетричною.
  return { s, band: b, slots: spec.rapports * b.perRapport + 1, X0, Ymid: Y0 + 2 * s * (b.rows - 1), P: 4 * s * b.perRapport };
}

/** Специфікація слота за його центром у локальних координатах смуги (xs, ys). */
function slotSpecAt(f: BandFrame, xs: number, ys: number): { spec: SlotSpec | null; main: boolean } {
  const { s, band } = f;
  const i = xs / (2 * s);
  const j = (ys + 2 * s * (band.rows - 1)) / (2 * s);
  const nm = band.perRapport;
  if (mod(j, 2) === 0) return { spec: band.main[j / 2]?.[mod(i / 2, nm)] ?? null, main: true };
  return { spec: band.fillers[(j - 1) / 2]?.[mod((i - 1) / 2, nm)] ?? null, main: false };
}

/** Слоти, яким належить точка (xl, yl) — від 1 до 4 (на спільних сторонах і вершинах). */
function ownerSlots(s: number, xl: number, yl: number): [number, number][] {
  const [u, v] = toUV(xl, yl);
  const around = (w: number): number[] => {
    const q = w / (2 * s);
    const lo = Math.floor(q);
    const out = new Set<number>();
    for (const p of [lo, lo + 1]) if (Math.abs(w - 2 * s * p) <= s) out.add(p);
    return [...out];
  };
  const out: [number, number][] = [];
  for (const p of around(u)) for (const q of around(v)) out.push([2 * s * (p + q), 2 * s * (p - q)]);
  return out;
}

/**
 * Колір бісерини смуги (індекс палітри) у локальних координатах (xl від центру першого мотиву,
 * yl від середньої лінії). f(b) = max по мінімізуючих g значення мотиву слота-образу g(S) у точці g(b).
 * Точки поза діапазоном мотивів (кінці смуги, краї) — фон.
 */
export function bandColorLocal(f: BandFrame, xl: number, yl: number, masked = true): number {
  const { s, band, P } = f;
  const levels = 2 * band.rows - 2;
  const valid = ownerSlots(s, xl, yl).filter(([xs, ys]) => {
    const j = (ys + 2 * s * (band.rows - 1)) / (2 * s);
    if (j < 0 || j > levels) return false;
    if (!masked) return true;
    const i = xs / (2 * s);
    return i >= 0 && i <= 2 * (f.slots - 1);
  });
  if (valid.length === 0) return 0;

  // Мінімізуючі елементи точкової групи.
  const group: FriezeGroup = band.group;
  let best: [number, number] | null = null;
  let gs: { g: (p: [number, number]) => [number, number]; shift: number }[] = [];
  for (const g of pointGroup(group, P)) {
    const [gx, gy] = g([xl, yl]);
    const shift = P * Math.floor(gx / P);
    const c: [number, number] = [gx - shift, gy];
    if (!best || c[0] < best[0] || (c[0] === best[0] && c[1] < best[1])) {
      best = c;
      gs = [{ g, shift }];
    } else if (c[0] === best[0] && c[1] === best[1]) gs.push({ g, shift });
  }
  const bp = best!;

  let mainVal: number | null = null;
  let fillVal: number | null = null;
  for (const [xs, ys] of valid) {
    for (const { g, shift } of gs) {
      const [sx, sy] = g([xs, ys]);
      const sxr = sx - shift;
      const { spec, main } = slotSpecAt(f, sxr, sy);
      if (!spec) continue;
      const [du, dv] = toUV(bp[0] - sxr, bp[1] - sy);
      const val = MOTIFS[spec.motif].fn(du, dv, s, s);
      if (val === null) continue;
      const color = val === BG ? 0 : (spec.colors[val] ?? 0);
      if (main) mainVal = mainVal === null ? color : Math.max(mainVal, color);
      else fillVal = fillVal === null ? color : Math.max(fillVal, color);
    }
  }
  return mainVal ?? fillVal ?? 0;
}

/** Мотиви, що справді з'являються в смузі (з урахуванням групи), по одному на різний слот. */
export function usedSlotSpecs(spec: DesignSpec): SlotSpec[] {
  const f = bandFrame(spec);
  const out = new Map<string, SlotSpec>();
  const levels = 2 * spec.band.rows - 1;
  for (let j = 0; j < levels; j++)
    for (let i = j % 2; i <= 2 * (f.slots - 1); i += 2) {
      const xs = 2 * f.s * i;
      const ys = 2 * f.s * j - 2 * f.s * (spec.band.rows - 1);
      const [cx, cy] = canonical(spec.band.group, f.P, [xs, ys]);
      const { spec: slot } = slotSpecAt(f, cx, cy);
      if (slot) out.set(JSON.stringify(slot), slot);
    }
  return [...out.values()];
}

// ------------------------------------------------------------------ підвіски

interface PendantGeom {
  cells: Cell[];
  /** Колір за (du, dv) від вузла кріплення; null — не чіпати. */
  color: (du: number, dv: number) => number | null;
  /** Вузли для пікотів і кінчика (du, dv). */
  picots: [number, number][];
  tip: [number, number] | null;
  halfWidth: number;
}

function blockCells(uN: number, vN: number, s: number, duLo: number, duHi: number, dvLo: number, dvHi: number): Cell[] {
  const out: Cell[] = [];
  for (let du = duLo; du < duHi; du += s) for (let dv = dvLo; dv < dvHi; dv += s) out.push({ a: (uN + du) / s, b: (vN + dv) / s });
  return out;
}

/** Внутрішній мотив ромба q×q (du ∈ [0, qs], dv ∈ [−qs, 0]). */
function rhombColor(p: PendantSpec, q: number, s: number, du: number, dv: number): number | null {
  const Q = q * s;
  if (du < 0 || du > Q || dv > 0 || dv < -Q) return null;
  if (du === 0 || du === Q || dv === 0 || dv === -Q) return p.rhombContour;
  if (q % 2 !== 0 && Q % 2 !== 0) return 0;
  const cu = du - Q / 2;
  const cv = dv + Q / 2;
  const r = Math.max(Math.abs(cu), Math.abs(cv));
  switch (p.inner) {
    case "cross":
      return cu === 0 || cv === 0 ? p.innerColor : 0;
    case "rings":
      return r % s === 0 ? p.innerColor : 0;
    case "dots":
      return cu % s === 0 && cv % s === 0 ? p.innerColor : 0;
    default:
      return 0;
  }
}

function pendantGeom(p: PendantSpec, s: number, uN: number, vN: number): PendantGeom {
  if (p.shape === "roof") {
    const La = p.size;
    const q = La - 1;
    const cells = [
      // Вершина — комірка нижнього ряду сітки: її верхні сторони несуть 2 парочки вершини.
      ...blockCells(uN, vN, s, -s, 0, 0, s),
      ...blockCells(uN, vN, s, -s, 0, -La * s, 0), // ліве плече
      ...blockCells(uN, vN, s, 0, La * s, 0, s), // праве плече
      ...(q > 0 ? blockCells(uN, vN, s, 0, q * s, -q * s, 0) : [])
    ];
    const color = (du: number, dv: number): number | null => {
      const inLeft = du >= -s && du <= 0 && dv >= -La * s && dv <= s;
      const inRight = dv >= 0 && dv <= s && du >= -s && du <= La * s;
      if (inLeft || inRight) {
        if (du % s === 0 && dv % s === 0) return p.railColor;
        const rail = ((du === -s || du === 0) && dv >= -La * s && dv <= 0) || ((dv === 0 || dv === s) && du >= 0 && du <= La * s);
        if (rail) return p.railColor;
        if (inLeft && du > -s && du < 0 && dv % s === 0) return dv > -La * s ? p.pairColor : p.railColor;
        if (inRight && dv > 0 && dv < s && du % s === 0) return du < La * s ? p.pairColor : p.railColor;
        return 0;
      }
      return q > 0 ? rhombColor(p, q, s, du, dv) : null;
    };
    return {
      cells,
      color,
      picots: [
        [0, -La * s],
        [La * s, 0]
      ],
      tip: q > 0 ? [q * s, -q * s] : [0, 0],
      halfWidth: (La + 1) * s
    };
  }
  if (p.shape === "rhomb") {
    const q = p.size;
    return {
      cells: blockCells(uN, vN, s, 0, q * s, -q * s, 0),
      color: (du, dv) => rhombColor(p, q, s, du, dv),
      picots: [
        [q * s, 0],
        [0, -q * s]
      ],
      tip: [q * s, -q * s],
      halfWidth: q * s
    };
  }
  // Трикутник вістрям униз: ряд t має w − t комірок; верхній ряд висить на w вузлах.
  const w = p.size;
  const h = ((w + 1) * s) / 2;
  const X = uN + vN;
  const yB = uN - vN;
  const cells: Cell[] = [];
  for (let t = 0; t < w; t++)
    for (let i = 0; i < w - t; i++) {
      const cx = X + s * (2 * i - (w - 1 - t));
      const cy = yB + s + t * s;
      cells.push({ a: (cx / s - 1 + cy / s) / 2, b: (cx / s - 1 - cy / s) / 2 });
    }
  return {
    cells,
    color: (du, dv) => {
      if (dv < -h || du > h || du - dv < 0) return null;
      if (dv === -h || du === h) return p.railColor;
      const j = (h - du) / s;
      const i = (dv + h) / s;
      if ((Number.isInteger(j) && j % 2 === 1) || (Number.isInteger(i) && i % 2 === 1)) return p.pairColor;
      return 0;
    },
    picots: [
      [-h + s, -h],
      [h, h - s]
    ],
    tip: [h, -h],
    halfWidth: w * s
  };
}

// ------------------------------------------------------------------ збирання

export function buildDesign(spec: DesignSpec): Design {
  const s = spec.k + 1;
  const f = bandFrame(spec);
  const cols = 2 * f.slots + 1;
  const bandRows = 2 * spec.band.rows;
  const bandTop = 2 * s;
  const bandBottom = 2 * s + 4 * s * spec.band.rows;
  const ladder = spec.ladder;
  const bottomRows = spec.bottom.rows;
  const rows = ladder ? [1 + bandRows, Math.max(1, bottomRows)] : [1 + bandRows + bottomRows];

  const beads: Bead[] = [];
  const index = new Map<string, number>();
  const threads = new Set<string>();

  const addBead = (b: Bead): number => {
    const existing = index.get(b.id);
    if (existing !== undefined) return existing;
    index.set(b.id, beads.length);
    beads.push(b);
    return beads.length - 1;
  };
  const link = (a: string, b: string): void => {
    threads.add(threadKey(a, b));
  };
  const meshId = (piece: number, x: number, y: number): string => `${piece}:${key(x, y)}`;

  // Частини сітки: основні комірки (як у sylianka), рядки r з центрами y = (2r+1)s, x = (2i+2)s.
  const pieceOffset: number[] = [];
  let yCursor = 0;
  const lastPiece = rows.length - 1;
  const pieceCells: Cell[][] = rows.map((nRows) => {
    const cells: Cell[] = [];
    for (let r = 0; r < nRows; r++)
      for (let i = 0; i < cols; i++) {
        const cx = (2 * i + 2) * s;
        const cy = (2 * r + 1) * s;
        cells.push({ a: (cx / s - 1 + cy / s) / 2, b: (cx / s - 1 - cy / s) / 2 });
      }
    return cells;
  });

  // Підвіски (на останній частині).
  const pendants: PendantInfo[] = [];
  const pendantPaint: { geom: PendantGeom; X: number; info: PendantInfo }[] = [];
  const yB = 2 * s * rows[lastPiece];
  const xMax = (2 * cols + 1) * s;
  if (spec.pendants && rows[lastPiece] > 0) {
    const p = spec.pendants;
    const Xc = f.X0 + 2 * s * (f.slots - 1);
    const pitch = 4 * s * p.every;
    const positions: number[] = [];
    if (p.centerOnly) positions.push(Xc);
    else {
      const probe = pendantGeom(p, s, 0, 0).halfWidth;
      for (let j = -200; j <= 200; j++) {
        const X = Xc + j * pitch;
        if (X - probe >= 0 && X + probe <= xMax + s) positions.push(X);
      }
    }
    const taken = new Set<string>();
    for (const X of positions) {
      const [uN, vN] = toUV(X, yB);
      const geom = pendantGeom(p, s, uN, vN);
      const clash = geom.cells.some((c) => taken.has(cellKey(c)));
      if (clash) continue;
      geom.cells.forEach((c) => taken.add(cellKey(c)));
      pieceCells[lastPiece].push(...geom.cells);
      const info: PendantInfo = { x: X, shape: p.shape, anchors: [], ids: [] };
      pendants.push(info);
      pendantPaint.push({ geom, X, info });
    }
  }

  // Бісерини й нитки сітки.
  for (let piece = 0; piece < rows.length; piece++) {
    pieceOffset.push(yCursor);
    const mesh = meshFromCells(pieceCells[piece], s);
    const meshOnly = meshFromCells(pieceCells[piece].slice(0, rows[piece] * cols), s).beads;
    for (const k of [...mesh.beads].sort(compareKeys)) {
      const [x, y] = parseKey(k);
      const inMesh = meshOnly.has(k);
      let layer: Layer = "bottom";
      if (!inMesh) layer = "pendant";
      else if (piece === 0 && y < bandTop) layer = "neck";
      else if (piece === 0 && y <= bandBottom) layer = "band";
      addBead({ id: meshId(piece, x, y), kind: "mesh", layer, piece, x, y, px: x, py: y + yCursor, color: 0, size: BEAD_SIZE });
    }
    for (const t of mesh.threads) {
      const [a, b] = t.split("|");
      link(`${piece}:${a}`, `${piece}:${b}`);
    }
    const bottomY = 2 * s * rows[piece];
    if (piece === 0 && ladder) yCursor += bottomY + (ladder.length + 1) * Math.SQRT2;
  }

  // Смуга.
  for (const b of beads) {
    if (b.piece !== 0 || b.y < bandTop || b.y > bandBottom) continue;
    b.color = bandColorLocal(f, b.x - f.X0, b.y - f.Ymid);
  }

  // Драбинка: вертикальні нитки від нижніх вузлів частини 0 до верхніх вузлів частини 1.
  if (ladder) {
    const y0 = 2 * s * rows[0];
    for (let i = 0; i < cols; i++) {
      const x = (2 * i + 2) * s;
      let prev = meshId(0, x, y0);
      for (let j = 1; j <= ladder.length; j++) {
        const id = `L:${x}:${j}`;
        addBead({
          id,
          kind: "ladder",
          layer: "ladder",
          piece: -1,
          x: NaN,
          y: NaN,
          px: x,
          py: y0 + j * Math.SQRT2,
          color: ladder.accentIndex === j ? ladder.accentColor : ladder.color,
          size: BEAD_SIZE
        });
        link(prev, id);
        prev = id;
      }
      link(prev, meshId(1, x, 0));
    }
  }

  // Малі ромби між підвісками (у нижньому ряду останньої частини).
  const between = spec.bottom.betweenColor;
  if (between !== null && pendantPaint.length > 1) {
    const xs = pendantPaint.map((p) => p.X).sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i++) {
      const Xb = (xs[i] + xs[i + 1]) / 2;
      if (mod(Xb, 2 * s) !== 0) continue;
      const cy = yB - s;
      const ids: string[] = [];
      for (const b of beads) {
        if (b.piece !== lastPiece) continue;
        const [du, dv] = toUV(b.x - Xb, b.y - cy);
        // Комірка з центром (Xb, cy): |du ± …| — сторони квадрата [−s/2, s/2] у (u − u_c, v − v_c).
        if (Math.max(Math.abs(du), Math.abs(dv)) * 2 === s) {
          b.color = between;
          ids.push(b.id);
        }
      }
      pendants.push({ x: Xb, shape: "between", anchors: [], ids });
    }
  }

  // Розфарбування підвісок і пікоти з кінчиками.
  if (spec.pendants) {
    const p = spec.pendants;
    const meshCellsBeads = meshFromCells(pieceCells[lastPiece].slice(0, rows[lastPiece] * cols), s).beads;
    for (const { geom, X, info } of pendantPaint) {
      const own = meshFromCells(geom.cells, s).beads;
      for (const k of own) {
        const [x, y] = parseKey(k);
        const id = meshId(lastPiece, x, y);
        info.ids.push(id);
        if (meshCellsBeads.has(k)) info.anchors.push(id);
        const [du, dv] = toUV(x - X, y - yB);
        const c = geom.color(du, dv);
        if (c !== null) beads[index.get(id)!].color = c;
      }
      const at = ([du, dv]: [number, number]): Bead => beads[index.get(meshId(lastPiece, X + du + dv, yB + du - dv))!];
      if (p.picot) {
        for (const node of geom.picots) {
          const n = at(node);
          if (!n) continue;
          const c = p.picot.beads;
          const rho = Math.SQRT2 / (2 * Math.sin(Math.PI / (c + 1)));
          let prev = n.id;
          for (let i = 0; i < c; i++) {
            const beta = (2 * Math.PI * (i + 1)) / (c + 1);
            const id = `K:${n.id}:${i}`;
            addBead({
              id,
              kind: "picot",
              layer: "picot",
              piece: -1,
              x: NaN,
              y: NaN,
              px: n.px + rho * Math.sin(beta),
              py: n.py + rho - rho * Math.cos(beta),
              color: p.picot.color,
              size: BEAD_SIZE
            });
            link(prev, id);
            prev = id;
            info.ids.push(id);
          }
          link(prev, n.id);
        }
      }
      if (p.tip && geom.tip) {
        const n = at(geom.tip);
        if (n) {
          const beadId = `T:${n.id}`;
          addBead({ id: beadId, kind: "tip", layer: "tip", piece: -1, x: NaN, y: NaN, px: n.px, py: n.py + Math.SQRT2, color: p.tip.beadColor, size: BEAD_SIZE });
          const d = (p.tip.sizeMm / 2.3) * Math.SQRT2;
          const dropId = `D:${n.id}`;
          addBead({
            id: dropId,
            kind: p.tip.kind,
            layer: "tip",
            piece: -1,
            x: NaN,
            y: NaN,
            px: n.px,
            py: n.py + Math.SQRT2 + BEAD_SIZE / 2 + d * 0.55,
            color: p.tip.color,
            size: d
          });
          link(n.id, beadId);
          link(beadId, dropId);
          info.ids.push(beadId, dropId);
        }
      }
    }
  }

  const threadList: [number, number][] = [];
  for (const t of threads) {
    const [a, b] = splitThread(t);
    const ia = index.get(a);
    const ib = index.get(b);
    if (ia !== undefined && ib !== undefined) threadList.push([ia, ib]);
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const b of beads) {
    minX = Math.min(minX, b.px - b.size / 2);
    maxX = Math.max(maxX, b.px + b.size / 2);
    maxY = Math.max(maxY, b.py + b.size / 2);
  }
  return {
    spec,
    beads,
    threads: threadList,
    index,
    pendants,
    layout: {
      s,
      slots: f.slots,
      P: f.P,
      X0: f.X0,
      Y0: 4 * s,
      cols,
      rows,
      pieceOffset,
      bandTop,
      bandBottom,
      width: maxX - Math.min(0, minX),
      height: maxY
    }
  };
}

/** Нитка "a|b", де a і b самі містять ":" і ",". */
function splitThread(t: string): [string, string] {
  const i = t.indexOf("|");
  return [t.slice(0, i), t.slice(i + 1)];
}

function compareKeys(a: string, b: string): number {
  const [ax, ay] = parseKey(a);
  const [bx, by] = parseKey(b);
  return ay - by || ax - bx;
}

/** Чи всі бісерини сітки лежать на ґратці (x + y парне, на лінії сітки). */
export function meshOnLattice(d: Design): boolean {
  const s = d.layout.s;
  return d.beads.filter((b) => b.kind === "mesh").every((b) => onGrid(b.x, b.y, s));
}

export { isNode };
