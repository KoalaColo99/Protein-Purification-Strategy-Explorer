import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("build emits a project-relative static entry point", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /Protein Purification Strategy Explorer/);
  assert.match(html, /\/Protein-Purification-Strategy-Explorer\/assets\//);
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

test("tutorial engine evaluates evidence without changing scientific values", async () => {
  const {closestContaminant,selectionEvaluation,supportedInterpretations} = await import("../app/tutorials/tutorialEngine.mjs");
  const proteins=[{id:"enzyme-a",mass:62},{id:"near",mass:60},{id:"far",mass:18}];
  assert.equal(closestContaminant(proteins).id,"near");
  const fs=[1,2,3,4].map((n)=>({id:`f${n}`,n,activity:[5,35,40,5][n-1],masses:{"enzyme-a":[1,7,8,1][n-1],near:[8,2,2,8][n-1]}}));
  assert.equal(selectionEvaluation(fs,["f2","f3"]).ok,true);
  assert.equal(selectionEvaluation(fs,["f1","f3"]).kind,"split");
  const initial={masses:{"enzyme-a":10,near:90},activeTarget:10};
  const pooled={masses:{"enzyme-a":8,near:4},activeTarget:7};
  assert.deepEqual(supportedInterpretations(initial,pooled),{purityImproved:true,activityRetained:true,perfectlyPure:false});
});

test("tutorial registry contains all six scaffolded steps", async () => {
  const registry=await readFile(new URL("../app/tutorials/tutorialRegistry.ts",import.meta.url),"utf8");
  for(const title of ["Meet the Sample","Choose a Property","Predict Separation","Find Enzyme A","Pool Fractions","Evaluate Result"]) assert.match(registry,new RegExp(title));
  assert.match(registry,/satisfies TutorialStep\[\]/);
});
