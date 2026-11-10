
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const template = await readFile(
  path.join(__dirname, "template.html"),
  "utf8"
);

const websites = JSON.parse(
  await readFile(path.join(__dirname, "list.json"), "utf8")
);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

const cards = websites.map(site => {
  const style = site.style
    ? ` class="${escapeHTML(site.style)}"`
    : "";

  return `
<a href="${escapeHTML(site.url)}"
   target="_blank"
   rel="noopener noreferrer"
   data-tags="${escapeHTML(site.tags ?? "")}">
  <button${style}>${escapeHTML(site.name)}</button>
</a>`;
}).join("\n");

if (!template.includes("<!-- GENERATED-CARDS -->")) {
  throw new Error("Could not find GENERATED-CARDS marker!");
}

const html = template.replace(
  "<!-- GENERATED-CARDS -->",
  cards
);

await writeFile(path.join(rootDir, "index.html"), html, "utf8");

console.log(`Generated ${websites.length} cards in index.html!`);