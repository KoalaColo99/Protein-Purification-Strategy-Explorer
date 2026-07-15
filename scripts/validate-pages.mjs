import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const base = "/Protein-Purification-Strategy-Explorer/";
const forbidden = [
  /chatgpt(?:\.site)?/i,
  /localhost/i,
  /127\.0\.0\.1/,
  /art_v1_[a-z0-9]+/i,
  /(?:api[_-]?key|private[_-]?key|access[_-]?token)\s*[:=]/i,
];

await access(join(dist, "index.html"));
await access(join(dist, ".nojekyll"));

const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);
    (await stat(path)).isDirectory() ? await walk(path) : files.push(path);
  }
}
await walk(dist);

const index = await readFile(join(dist, "index.html"), "utf8");
assert.match(index, new RegExp(`(?:src|href)=["']${base.replaceAll("/", "\\/")}`));

for (const path of files) {
  if (!/\.(?:html|css|js|json|svg|txt)$/i.test(path)) continue;
  const text = await readFile(path, "utf8");
  for (const pattern of forbidden) assert.doesNotMatch(text, pattern, `${path} contains ${pattern}`);
}

const references = [...index.matchAll(/(?:src|href)=["']([^"'#?]+)["']/g)].map(match => match[1]);
for (const reference of references) {
  if (/^(?:https?:|data:|mailto:)/.test(reference)) continue;
  const relative = reference.startsWith(base) ? reference.slice(base.length) : reference.replace(/^\.\//, "");
  await access(join(dist, relative));
}

console.log(`GitHub Pages validation passed: ${files.length} generated files, ${references.length} entry references resolved.`);
