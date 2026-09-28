/**
 * Референс «чорний/бордо/золото» як фіксований набір параметрів (DesignSpec).
 * Розбір референсу й припущення — docs/research.md, розділ 4.
 */
import type { DesignSpec } from "./params";

export const BLACK = 0;
export const BORDO = 1;
export const GOLD = 2;

export const REFERENCE_SPEC: DesignSpec = {
  version: 1,
  name: "Референс: чорний / бордо / золото",
  type: "collar",
  k: 2,
  rapports: 8,
  colors: ["#141414", "#7A1428", "#C9A232"],
  paletteName: "Чорний / бордо / золото",
  band: {
    rows: 1,
    group: "p1m1",
    perRapport: 2,
    main: [
      [
        // Золота «квітка» з бордовим центром.
        { motif: "flower", colors: [GOLD, BORDO] },
        // Бордовий квадрат із золотою серединкою.
        { motif: "squareCenter", colors: [BORDO, GOLD] }
      ]
    ],
    fillers: []
  },
  // Драбинка з 4 бісерин, 2-га золота.
  ladder: { length: 4, color: BLACK, accentIndex: 2, accentColor: GOLD },
  // Нижня сітка в один ряд; малий бордовий ромб між підвісками.
  bottom: { rows: 1, betweenColor: BORDO },
  pendants: {
    // «Дах» із 3 золотими парочками на плече + 2 на вершині; під ним ромб із золотим хрестиком.
    shape: "roof",
    size: 3,
    every: 4,
    centerOnly: false,
    railColor: BORDO,
    pairColor: GOLD,
    rhombContour: BORDO,
    inner: "cross",
    innerColor: GOLD,
    // Пікоти по 3 чорні бісерини.
    picot: { beads: 3, color: BLACK },
    // Кінчик: золота бісерина + бордова крапля 4 мм.
    tip: { beadColor: GOLD, kind: "drop", color: BORDO, sizeMm: 4 }
  }
};
