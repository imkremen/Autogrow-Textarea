import { type Design, buildDesign, usedSlotSpecs } from "./build";
import { TRADITIONAL } from "./color";
import { toJson, toSvg, toSylianka } from "./export";
import { FRIEZE_GROUPS, FRIEZE_NAMES, type FriezeGroup } from "./frieze";
import { type Generated, type LayerSeeds, type SeedState, gallerySeeds, generate } from "./generate";
import { MOTIFS } from "./motifs";
import { DEFAULT_PARAMS, type GenParams, JEWELRY_NAMES, type JewelryType, LAYERS, LAYER_NAMES, type LayerName } from "./params";
import { REFERENCE_SPEC } from "./reference";
import { drawDesign, drawMotif } from "./render";
import { freshSeed } from "./rng";
import { BEADS_PER_GRAM, computeStats } from "./stats";
import { type Report, validate } from "./validate";

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Немає #${id}`);
  return el as T;
};

interface Current {
  design: Design;
  report: Report;
  seed: number | null;
  seeds: LayerSeeds | null;
  params: GenParams | null;
  attempts: number;
}

const state = {
  params: { ...DEFAULT_PARAMS } as GenParams,
  master: 0,
  items: [] as { seed: number; gen: Generated }[],
  selected: -1,
  current: null as Current | null,
  frozen: new Set<LayerName>(),
  /** Заморожені зерна, з якими згенеровано поточну галерею (для посилання). */
  galleryFrozen: {} as Partial<LayerSeeds>
};

// ------------------------------------------------------------------ параметри

function fillSelect(sel: HTMLSelectElement, options: [string, string][], value: string): void {
  sel.innerHTML = "";
  for (const [v, label] of options) {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = label;
    sel.append(o);
  }
  sel.value = value;
}

function initParams(): void {
  fillSelect($("p-type"), Object.entries(JEWELRY_NAMES) as [string, string][], state.params.type);
  fillSelect(
    $("p-palette"),
    [
      ["auto", "Авто"],
      ...TRADITIONAL.map((p) => [p.id, p.name] as [string, string]),
      ["harmony-analog", "Гармонія OKLCH: аналогові"],
      ["harmony-complementary", "Гармонія OKLCH: комплементарні"]
    ],
    state.params.palette
  );
  fillSelect(
    $("p-symmetry"),
    [["auto", "Авто"], ...FRIEZE_GROUPS.map((g) => [g, FRIEZE_NAMES[g]] as [string, string])],
    state.params.symmetry
  );
  $<HTMLSelectElement>("p-k").value = String(state.params.k);
  $<HTMLInputElement>("p-rapports").value = String(state.params.rapports);
  $<HTMLInputElement>("p-complexity").value = String(state.params.complexity);
  $("p-complexity-out").textContent = String(state.params.complexity);

  const freeze = $("p-freeze");
  freeze.innerHTML = "";
  for (const l of LAYERS) {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = state.frozen.has(l);
    cb.addEventListener("change", () => {
      if (cb.checked) state.frozen.add(l);
      else state.frozen.delete(l);
    });
    label.append(cb, ` ${LAYER_NAMES[l]}`);
    freeze.append(label);
  }
}

function readParams(): GenParams {
  return {
    type: $<HTMLSelectElement>("p-type").value as JewelryType,
    k: Number($<HTMLSelectElement>("p-k").value),
    rapports: Math.max(0, Math.min(30, Math.round(Number($<HTMLInputElement>("p-rapports").value) || 0))),
    palette: $<HTMLSelectElement>("p-palette").value,
    symmetry: $<HTMLSelectElement>("p-symmetry").value as GenParams["symmetry"],
    complexity: Number($<HTMLInputElement>("p-complexity").value)
  };
}

/** Заморожені шари беруться з обраної схеми. */
function frozenSeeds(): Partial<LayerSeeds> {
  const out: Partial<LayerSeeds> = {};
  const seeds = state.current?.seeds;
  if (!seeds) return out;
  for (const l of state.frozen) out[l] = seeds[l];
  return out;
}

// ------------------------------------------------------------------ посилання

function hashFor(seed: number, p: GenParams, frozen: Partial<LayerSeeds>): string {
  const q = new URLSearchParams({
    seed: String(seed),
    type: p.type,
    k: String(p.k),
    r: String(p.rapports),
    pal: p.palette,
    sym: p.symmetry,
    c: String(p.complexity)
  });
  const fz = Object.entries(frozen)
    .map(([l, v]) => `${l}:${v}`)
    .join(",");
  if (fz) q.set("fz", fz);
  return `#${q.toString()}`;
}

function parseHash(): { seed: number; params: GenParams; frozen: Partial<LayerSeeds> } | "ref" | null {
  const h = location.hash.slice(1);
  if (h === "ref") return "ref";
  const q = new URLSearchParams(h);
  const seed = Number(q.get("seed"));
  if (!q.has("seed") || !Number.isFinite(seed)) return null;
  const type = q.get("type") as JewelryType;
  const params: GenParams = {
    type: type in JEWELRY_NAMES ? type : DEFAULT_PARAMS.type,
    k: Math.min(4, Math.max(1, Number(q.get("k")) || DEFAULT_PARAMS.k)),
    rapports: Math.min(30, Math.max(0, Number(q.get("r")) || 0)),
    palette: q.get("pal") || "auto",
    symmetry: (FRIEZE_GROUPS as readonly string[]).includes(q.get("sym") ?? "") ? (q.get("sym") as FriezeGroup) : "auto",
    complexity: Math.min(5, Math.max(1, Number(q.get("c")) || DEFAULT_PARAMS.complexity))
  };
  const frozen: Partial<LayerSeeds> = {};
  for (const part of (q.get("fz") ?? "").split(",")) {
    const [l, v] = part.split(":");
    if ((LAYERS as readonly string[]).includes(l) && Number.isFinite(Number(v))) frozen[l as LayerName] = Number(v) >>> 0;
  }
  return { seed: Math.floor(seed) >>> 0, params, frozen };
}

// ------------------------------------------------------------------ галерея

function renderGallery(): void {
  const root = $("gallery");
  root.innerHTML = "";
  state.items.forEach((item, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card" + (i === state.selected ? " selected" : "");
    const canvas = document.createElement("canvas");
    const d = item.gen.design;
    drawDesign(canvas, d, { scale: 560 / d.layout.width, threads: false });
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    const cap = document.createElement("div");
    cap.className = "cap";
    const r = item.gen.report;
    cap.innerHTML = `<span>seed <b>${item.seed}</b></span><span>${d.spec.band.group} · ${r.colorsUsed} кол. · фон ${Math.round(r.bgFraction * 100)}%</span>`;
    card.append(canvas, cap);
    card.addEventListener("click", () => select(i));
    root.append(card);
  });
}

function newGallery(master: number, frozen: Partial<LayerSeeds>): void {
  state.params = readParams();
  state.master = master;
  state.galleryFrozen = frozen;
  state.items = gallerySeeds(master).map((seed) => ({ seed, gen: generate(state.params, { seed, frozen }) }));
  state.selected = -1;
  renderGallery();
  select(0);
}

function select(i: number): void {
  const item = state.items[i];
  state.selected = i;
  for (const [j, el] of [...$("gallery").children].entries()) el.classList.toggle("selected", j === i);
  showDetail({
    design: item.gen.design,
    report: item.gen.report,
    seed: item.seed,
    seeds: item.gen.seeds,
    params: state.params,
    attempts: item.gen.attempts
  });
  history.replaceState(null, "", hashFor(item.seed, state.params, state.galleryFrozen));
}

function showReference(): void {
  const design = buildDesign(REFERENCE_SPEC);
  state.selected = -1;
  for (const el of $("gallery").children) el.classList.remove("selected");
  showDetail({ design, report: validate(design), seed: null, seeds: null, params: null, attempts: 1 });
  history.replaceState(null, "", "#ref");
}

// ------------------------------------------------------------------ деталі

function showDetail(c: Current): void {
  state.current = c;
  $("detail").hidden = false;
  $<HTMLInputElement>("seed-input").value = c.seed === null ? "" : String(c.seed);
  const d = c.design;
  $("d-title").textContent = d.spec.name;
  const slots = d.layout.slots;
  $("d-meta").textContent = [
    c.seed === null ? "фіксовані параметри" : `seed ${c.seed}`,
    `k = ${d.spec.k}`,
    `група ${FRIEZE_NAMES[d.spec.band.group]}`,
    `${d.spec.rapports} раппортів × ${d.spec.band.perRapport} мотиви + замикальний (${slots} мотивів)`,
    `раппорт ${2 * d.spec.band.perRapport} комірок`,
    d.spec.ladder ? `драбинка ${d.spec.ladder.length}` : "без драбинки",
    d.spec.pendants ? `підвіски: ${pendantName(d)}` : "без підвісок"
  ].join(" · ");
  const fit = Math.floor(($("detail").clientWidth - 40) / d.layout.width);
  $<HTMLInputElement>("d-scale").value = String(Math.max(3, Math.min(14, fit)));
  drawDetail();
  renderReport(c);
  renderMotifs(d);
  renderStats();
  $("detail").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function pendantName(d: Design): string {
  const p = d.spec.pendants!;
  const shape = { roof: "«дах» із ромбом", rhomb: "ромб", triangle: "трикутник" }[p.shape];
  return p.centerOnly ? `медальйон-${shape}` : shape;
}

function drawDetail(): void {
  const c = state.current;
  if (!c) return;
  drawDesign($<HTMLCanvasElement>("d-canvas"), c.design, {
    scale: Number($<HTMLInputElement>("d-scale").value),
    threads: $<HTMLInputElement>("d-threads").checked,
    rapport: $<HTMLInputElement>("d-rapport").checked
  });
}

function renderReport(c: Current): void {
  const r = c.report;
  const checks: [boolean, string][] = [
    [r.components === 1 && r.isolated === 0, `зв'язність: ${r.components} компонента, без ізольованих бісерин`],
    [r.onLattice, "усі бісерини сітки на лініях ґратки"],
    [r.pendantsAttached, "підвіски кріпляться до сітки"],
    [r.bgFraction >= 0.4 && r.bgFraction <= 0.7, `фон ${(r.bgFraction * 100).toFixed(1)} %`],
    [r.colorsUsed >= 2 && r.colorsUsed <= 5, `${r.colorsUsed} кольорів`],
    [r.minAdjacentContrast >= 0.1, `мін. контраст сусідніх кольорів ΔE ${r.minAdjacentContrast.toFixed(3)}`]
  ];
  $("d-report").innerHTML =
    checks.map(([ok, t]) => `<span class="${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${t}</span>`).join(" · ") +
    (c.attempts > 1 ? ` · <span>спроба ${c.attempts}</span>` : "");
}

function renderMotifs(d: Design): void {
  const root = $("d-motifs");
  root.innerHTML = "";
  const s = d.layout.s;
  for (const slot of usedSlotSpecs(d.spec)) {
    const box = document.createElement("div");
    box.className = "motif";
    const canvas = document.createElement("canvas");
    drawMotif(canvas, slot, d.spec.colors, s, 9);
    box.append(canvas, MOTIFS[slot.motif].name);
    root.append(box);
  }
  // Підвіска й малий ромб — вирізані зі схеми.
  const shown = new Set<string>();
  for (const p of d.pendants) {
    if (shown.has(p.shape)) continue;
    shown.add(p.shape);
    const pts = p.ids.map((id) => d.beads[d.index.get(id)!]);
    if (!pts.length) continue;
    const m = p.shape === "between" ? 2 * s : 1;
    const x0 = Math.min(...pts.map((b) => b.px)) - m;
    const x1 = Math.max(...pts.map((b) => b.px)) + m;
    const y0 = Math.min(...pts.map((b) => b.py)) - m;
    const y1 = Math.max(...pts.map((b) => b.py + b.size / 2)) + 0.5;
    const box = document.createElement("div");
    box.className = "motif";
    const canvas = document.createElement("canvas");
    const scale = Math.min(9, 200 / (x1 - x0));
    drawDesign(canvas, d, { scale, threads: true, view: { x0, y0, x1, y1 } });
    box.append(canvas, p.shape === "between" ? "Малий ромб між підвісками" : `Підвіска: ${pendantName(d)}`);
    root.append(box);
  }
}

function renderStats(): void {
  const c = state.current;
  if (!c) return;
  const reserve = Number($<HTMLSelectElement>("d-reserve").value);
  const st = computeStats(c.design, reserve);
  const fmt = (n: number): string => n.toLocaleString("uk-UA");
  const rows = st.rows
    .map(
      (r) => `<tr>
        <td><span class="swatch" style="background:${r.hex}"></span>${r.index === 0 ? "фон" : `колір ${r.index}`}</td>
        <td><b>${r.code}</b> <small>${r.article}</small></td>
        <td><small>${r.en} (ΔE ${r.dE.toFixed(3)})</small></td>
        <td class="n">${fmt(r.perRapport)}</td>
        <td class="n">${fmt(r.total)}</td>
        <td class="n">${r.grams.toLocaleString("uk-UA")} г</td>
      </tr>`
    )
    .join("");
  const grams = st.rows.reduce((s, r) => s + r.grams, 0);
  const drops = st.drops
    .map(
      (dr) =>
        `<tr><td><span class="swatch" style="background:${dr.hex}"></span>${dr.kind === "drop" ? "крапля" : "біконус"} ${dr.sizeMm} мм</td><td colspan="3"></td><td class="n">${dr.count} шт.</td><td></td></tr>`
    )
    .join("");
  $("d-stats").innerHTML = `<table class="stats">
      <thead><tr><th>Колір</th><th>Preciosa 10/0</th><th>Опис каталогу</th><th>На раппорт</th><th>Усього</th><th>Грами (+${reserve} %)</th></tr></thead>
      <tbody>${rows}${drops}</tbody>
      <tfoot><tr><th colspan="3">Разом · довжина ≈ ${st.lengthCm.toFixed(1)} см, висота ≈ ${st.heightCm.toFixed(1)} см</th>
      <th class="n">${fmt(st.perRapportBeads)}</th><th class="n">${fmt(st.totalBeads)}</th><th class="n">${(Math.round(grams * 10) / 10).toLocaleString("uk-UA")} г</th></tr></tfoot>
    </table>
    <p class="hint">≈ ${BEADS_PER_GRAM} бісерин у грамі. Коди — найближчі за ΔE в OKLab з каталогу sylianka; кольори каталогу обчислено з фото, тож вони приблизні.</p>`;
}

// ------------------------------------------------------------------ експорт

function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const baseName = (): string => {
  const c = state.current!;
  return c.seed === null ? "sylianka-reference" : `sylianka-${c.seed}`;
};

function toast(text: string): void {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.append(el);
  setTimeout(() => el.remove(), 2200);
}

function initExport(): void {
  $("x-png").addEventListener("click", () => {
    const c = state.current;
    if (!c) return;
    const canvas = document.createElement("canvas");
    drawDesign(canvas, c.design, { scale: 12, threads: $<HTMLInputElement>("d-threads").checked });
    canvas.toBlob((b) => b && download(`${baseName()}.png`, b), "image/png");
  });
  $("x-svg").addEventListener("click", () => {
    const c = state.current;
    if (c) download(`${baseName()}.svg`, new Blob([toSvg(c.design, 8, $<HTMLInputElement>("d-threads").checked)], { type: "image/svg+xml" }));
  });
  $("x-json").addEventListener("click", () => {
    const c = state.current;
    if (c) download(`${baseName()}.json`, new Blob([toJson(c.design, { seed: c.seed, params: c.params, seeds: c.seeds })], { type: "application/json" }));
  });
  $("x-sylianka").addEventListener("click", () => {
    const c = state.current;
    if (!c) return;
    const { file, skipped } = toSylianka(c.design);
    download(`${baseName()}.sylianka.json`, new Blob([JSON.stringify(file, null, 1)], { type: "application/json" }));
    if (skipped) toast(`У трафарет sylianka не ввійшло ${skipped} бісерин (драбинка й частини поза сіткою).`);
  });
}

// ------------------------------------------------------------------ старт

function init(): void {
  const fromHash = parseHash();
  if (fromHash && fromHash !== "ref") {
    state.params = fromHash.params;
    for (const l of Object.keys(fromHash.frozen)) state.frozen.add(l as LayerName);
  }
  initParams();
  initExport();

  $("p-complexity").addEventListener("input", () => {
    $("p-complexity-out").textContent = $<HTMLInputElement>("p-complexity").value;
  });
  $("new").addEventListener("click", () => newGallery(freshSeed(), frozenSeeds()));
  $("reference").addEventListener("click", showReference);
  $("seed-open").addEventListener("click", () => {
    const v = Number($<HTMLInputElement>("seed-input").value.trim());
    if (!Number.isFinite(v) || v < 0) return toast("Seed — ціле невід'ємне число");
    newGallery(Math.floor(v) >>> 0, frozenSeeds());
  });
  $<HTMLInputElement>("seed-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("seed-open").click();
  });
  $("seed-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast("Посилання скопійовано");
    } catch {
      $<HTMLInputElement>("seed-input").select();
      toast("Скопіюйте seed вручну");
    }
  });
  for (const id of ["d-threads", "d-rapport", "d-scale"]) $(id).addEventListener("input", drawDetail);
  $("d-reserve").addEventListener("change", renderStats);

  if (fromHash === "ref") {
    newGallery(freshSeed(), {});
    showReference();
  } else if (fromHash) {
    const state0: SeedState = { seed: fromHash.seed, frozen: fromHash.frozen };
    newGallery(state0.seed, state0.frozen);
  } else newGallery(freshSeed(), {});
}

init();
