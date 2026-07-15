import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("build emits a project-relative static entry point", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /Protein Purification Strategy Explorer/);
  assert.match(html, /\/protein-purification-strategy-explorer\/assets\//);
  assert.doesNotMatch(html, /_next|cloudflare|worker|chatgpt/i);
  await access(new URL("../dist/.nojekyll", import.meta.url));
});

test("scientific registries and calculations remain separated", async () => {
  const [data, science, view] = await Promise.all([
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/science.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/Explorer.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(data, /status:"Functional"/);
  assert.match(data, /status:"Planned"/);
  assert.match(science, /fractionate/);
  assert.match(science, /pool/);
  assert.match(view, /Commit prediction/);
  assert.match(view, /protein-purification-notebook\.json/);
});

test("source entry has no backend runtime dependency", async () => {
  const main = await readFile(new URL("../src/main.tsx", import.meta.url), "utf8");
  assert.match(main, /createRoot/);
  assert.doesNotMatch(main, /fetch\(|worker|headers\(|cookies\(|chatgpt/i);
  await access(new URL("../index.html", import.meta.url));
});
