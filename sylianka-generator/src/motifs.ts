/**
 * Бібліотека мотивів. Мотив — функція від (du, dv) відносно вузла-центру → роль кольору, BG чи null.
 * R — радіус мотиву в одиницях u/v (зазвичай s: мотив займає 2×2 комірки навколо вузла).
 * Роль 0, 1, … — індекс у кольорах слота; BG — явно фон; null — бісерина не належить мотиву
 * (тоді її може забрати сусідній мотив).
 */

export const BG = -1;
export type MotifValue = number | null;

export type MotifId =
  | "contour"
  | "contourCross"
  | "rings"
  | "nodeDots"
  | "roof"
  | "chevron"
  | "squareCenter"
  | "flower"
  | "dot";

export interface Motif {
  id: MotifId;
  name: string;
  /** Скільки ролей кольору використовує. */
  roles: number;
  /** Симетрія мотиву: D4 — повна (обидва дзеркала й поворот), V — лише дзеркало відносно вертикалі. */
  symmetry: "D4" | "V";
  /** Чи годиться як «наповнювач» між основними мотивами (дрібний). */
  filler: boolean;
  fn: (du: number, dv: number, s: number, R: number) => MotifValue;
}

const m = (du: number, dv: number): number => Math.max(Math.abs(du), Math.abs(dv));
const isNodeRel = (du: number, dv: number, s: number): boolean => du % s === 0 && dv % s === 0;

export const MOTIFS: Record<MotifId, Motif> = {
  contour: {
    id: "contour",
    name: "Ромб-контур",
    roles: 1,
    symmetry: "D4",
    filler: true,
    fn: (du, dv, _s, R) => (m(du, dv) === R ? 0 : m(du, dv) < R ? BG : null)
  },
  contourCross: {
    id: "contourCross",
    name: "Ромб із хрестиком",
    roles: 2,
    symmetry: "D4",
    filler: false,
    fn: (du, dv, _s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      if (r === R) return 0;
      return du === 0 || dv === 0 ? 1 : BG;
    }
  },
  rings: {
    id: "rings",
    name: "Концентричні кільця",
    roles: 3,
    symmetry: "D4",
    filler: false,
    fn: (du, dv, _s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      return (R - r) % 3;
    }
  },
  nodeDots: {
    id: "nodeDots",
    name: "Крапки у вузлах",
    roles: 1,
    symmetry: "D4",
    filler: true,
    fn: (du, dv, s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      return isNodeRel(du, dv, s) ? 0 : BG;
    }
  },
  roof: {
    id: "roof",
    name: "«Дах» із парочками",
    roles: 2,
    symmetry: "V",
    filler: false,
    // Λ-смуга завширшки в комірку вздовж верхніх сторін ромба: рейки dv==R, dv==R−s / du==−R, du==−R+s,
    // парочки — внутрішні бісерини поперечних сторін (щаблів) між рейками.
    fn: (du, dv, s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      const inLeft = du >= -R && du <= -R + s && dv <= R;
      const inRight = dv >= R - s && dv <= R && du >= -R;
      if (!inLeft && !inRight) return BG;
      const rail = du === -R || dv === R || (du === -R + s && dv <= R - s) || (dv === R - s && du >= -R + s);
      if (rail) return 0;
      const leftRung = du > -R && du < -R + s && dv % s === 0 && dv > -R && dv <= R - s;
      const rightRung = dv > R - s && dv < R && du % s === 0 && du < R && du >= -R + s;
      if (leftRung || rightRung) return 1;
      return BG;
    }
  },
  chevron: {
    id: "chevron",
    name: "Шеврон",
    roles: 2,
    symmetry: "V",
    filler: false,
    fn: (du, dv, s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      if (du === -R || dv === R) return 0;
      if (du === 0 && dv === 0) return 1;
      if ((du === -R + s && dv <= R - s && dv >= 0) || (dv === R - s && du >= -R + s && du <= 0)) return 1;
      return BG;
    }
  },
  squareCenter: {
    id: "squareCenter",
    name: "Квадрат із серединкою",
    roles: 2,
    symmetry: "D4",
    filler: false,
    fn: (du, dv, _s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      if (r === R) return 0;
      // Серединка: центр і найближчі бісерини хреста (див. docs/research.md, розділ 4).
      return r <= 1 ? 1 : BG;
    }
  },
  flower: {
    id: "flower",
    name: "Квітка",
    roles: 2,
    symmetry: "D4",
    filler: false,
    // Контур + хрест фону + центр.
    fn: (du, dv, _s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      if (r === R) return 0;
      if (r === 0) return 1;
      return BG;
    }
  },
  dot: {
    id: "dot",
    name: "Крапка",
    roles: 1,
    symmetry: "D4",
    filler: true,
    fn: (du, dv, _s, R) => {
      const r = m(du, dv);
      if (r > R) return null;
      return r === 0 ? 0 : null;
    }
  }
};

export const MOTIF_IDS = Object.keys(MOTIFS) as MotifId[];
export const MAIN_MOTIFS = MOTIF_IDS.filter((id) => !MOTIFS[id].filler || id === "contour");
export const FILLER_MOTIFS = MOTIF_IDS.filter((id) => MOTIFS[id].filler);
