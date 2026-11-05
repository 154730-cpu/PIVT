import { readFile, writeFile } from "node:fs/promises";

const template = await readFile(
  "a.html",
  "utf8"
);

const websites = JSON.parse(
  await readFile("list.json", "utf8")
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
   data-tags="${escapeHTML(site.tags)}">
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

await writeFile("index.html", html);

console.log(`Generated ${websites.length} cards!`);
