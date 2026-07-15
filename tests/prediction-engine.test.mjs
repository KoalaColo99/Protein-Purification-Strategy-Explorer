import test from "node:test";
import assert from "node:assert/strict";
import { saltSuggestedText, predictionConfigSnapshot, retainedSaltFractionIndex } from "../app/predictionEngine.mjs";

test("salt wording follows both saturation sliders", () => {
  assert.equal(saltSuggestedText({low:40, high:70, retain:"intermediate"}), "Enter the 40–70% pellet");
});

test("salt wording follows retained fraction", () => {
  assert.equal(saltSuggestedText({low:40, high:70, retain:"first"}), "Enter the 0–40% pellet");
  assert.equal(saltSuggestedText({low:40, high:70, retain:"supernatant"}), "Remain soluble above 70% saturation");
  assert.deepEqual(["first","intermediate","supernatant"].map(retainedSaltFractionIndex), [0,1,2]);
});

test("committed snapshot retains configuration, wording, and authorship", () => {
  assert.deepEqual(predictionConfigSnapshot("salt", {low:40,high:70,retain:"first"}, "My prediction", "student"), {
    method:"salt", lowerSaturation:40, upperSaturation:70, retainedFraction:"first", predictionText:"My prediction", textSource:"student"
  });
});

test("other scientifically dependent method configurations are snapshotted", () => {
  assert.deepEqual(predictionConfigSnapshot("iex", {exchanger:"anion",pH:7,gradient:400,fraction:2}, "Bind", "generated"), {
    method:"iex", exchanger:"anion", pH:7, gradientEnd:400, fractionSize:2, predictionText:"Bind", textSource:"generated"
  });
});

test("explorer protects student wording, invalidates commits, and blocks stale runs", async () => {
  const source = await (await import("node:fs/promises")).readFile(new URL("../app/Explorer.tsx", import.meta.url), "utf8");
  assert.match(source, /predictionSource==="generated"/);
  assert.match(source, /setPredictionSettingsNotice\(true\)/);
  assert.match(source, /setPredictionOutdated\(true\)/);
  assert.match(source, /if\(predictionOutdated\)/);
  assert.match(source, /button\.disabled=predictionOutdated/);
  assert.match(source, /setPredictionSnapshot\(predictionConfigSnapshot/);
  assert.match(source, /committedSnapshot:predictionSnapshot/);
  assert.match(source, /Update suggested wording/);
  assert.match(source, /Keep my wording/);
});
