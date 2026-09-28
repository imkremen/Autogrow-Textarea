// Будує src/data/preciosa.ts з каталогу Preciosa 10/0 репозиторію binyachovo/sylianka.
// Використання: node scripts/build-catalog.mjs [шлях до preciosa-10-0.txt]
// Без аргументу файл завантажується з GitHub.
// Беремо лише фактичні дані: код, артикул (отвір), HEX, опис Preciosa англійською.
import { readFile, writeFile } from "node:fs/promises";

const SOURCE_URL = "https://raw.githubusercontent.com/binyachovo/sylianka/main/data/preciosa-10-0.txt";
const src = process.argv[2];
const text = src ? await readFile(src, "utf8") : await (await fetch(SOURCE_URL)).text();

const rows = [];
for (const line of text.split("\n")) {
  if (!line.trim() || line.startsWith("#")) continue;
  const [code, hole, hex, , finish, en] = line.split("|");
  if (!/^[0-9A-Za-z]{5}$/.test(code) || !/^[0-9A-F]{6}$/i.test(hex)) continue;
  rows.push([code, hole === "r" ? "r" : "s", hex.toUpperCase(), finish ?? "", (en ?? "").trim()].join("|"));
}

const out = `/* Згенеровано scripts/build-catalog.mjs. Не редагувати вручну.
 * Джерело: https://github.com/binyachovo/sylianka (data/preciosa-10-0.txt), яке зібрано з офіційного
 * каталогу https://catalog.preciosa-ornela.com. HEX — усереднений колір фото бісерини, приблизний.
 * Рядок: код|отвір (r — 311-19001, s — 331-19001)|HEX|покриття|опис Preciosa. */
export const PRECIOSA_DATA = \`${rows.join("\n")}\`;
`;
await writeFile(new URL("../src/data/preciosa.ts", import.meta.url), out);
console.log(`Записано ${rows.length} кольорів`);
