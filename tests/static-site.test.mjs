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

test("tutorial chromatogram labels protein and Enzyme A activity separately", async () => {
  const tutorial=await readFile(new URL("../app/tutorials/TutorialExperience.tsx",import.meta.url),"utf8");
  assert.match(tutorial,/Blue-gray: Total protein, measured by A₂₈₀/);
  assert.match(tutorial,/Orange: Enzyme A activity, measured by the activity assay/);
  assert.match(tutorial,/Left y-axis|left-axis/);
  assert.match(tutorial,/right-axis/);
  assert.match(tutorial,/gel-comparison/);
  assert.match(tutorial,/figcaption/);
});

test("ion-exchange rules predict charge, resin charge, and binding", async () => {
  const {proteinCharge,resinCharge,bindingPrediction,numberLineMarkers,phPIRelationship,simplePI,modeledProteins}=await import("../app/tutorials/ionExchangeEngine.mjs");
  assert.equal(proteinCharge(8.5,6.5),"positive");
  assert.equal(proteinCharge(5.0,7.0),"negative");
  assert.equal(proteinCharge(7.0,7.1),"approximately neutral");
  assert.equal(resinCharge("cation"),"negative");
  assert.equal(resinCharge("anion"),"positive");
  assert.equal(bindingPrediction({pI:8.5,pH:6.5,resinType:"cation"}).result,"binds");
  assert.equal(bindingPrediction({pI:8.5,pH:6.5,resinType:"anion"}).result,"flow-through");
  assert.deepEqual(numberLineMarkers(8.5,6.5).order,["pH","pI"]);
  assert.deepEqual(numberLineMarkers(4.7,6.5).order,["pI","pH"]);
  assert.equal(phPIRelationship(6.8,6.5),"pH ≈ pI");
  assert.equal(bindingPrediction({pI:6.8,pH:6.5,resinType:"cation"}).result,"weak or uncertain binding");
  const comparison=modeledProteins(6.5,"cation");
  assert.equal(comparison.find(p=>p.name==="Protein Z").result,"flow-through");
  assert.equal(comparison.find(p=>p.name==="Protein Y").result,"weak or uncertain binding");
  assert.equal(comparison.find(p=>p.name==="Protein X").result,"binds");
  assert.ok(Math.abs(simplePI(2.3,9.6)-5.95)<1e-9);
});

test("pH-pI instruction is reusable and scientifically bounded", async () => {
  const visual=await readFile(new URL("../app/tutorials/PHPIVisuals.tsx",import.meta.url),"utf8");
  const tutorial=await readFile(new URL("../app/tutorials/IonExchangeTutorial.tsx",import.meta.url),"utf8");
  assert.match(visual,/PHPINumberLine/);
  assert.match(tutorial,/PHPINumberLine pI=\{8\.5\} pH=\{6\.5\}/);
  assert.match(tutorial,/PHPINumberLine pI=\{pI\} pH=\{pH\}/);
  assert.match(tutorial,/PHPINumberLine pI=\{p\.pI\} pH=\{6\.5\}/);
  assert.match(visual,/Do not average every protein/);
  assert.match(visual,/300-residue protein/);
  assert.match(visual,/Glycine scaffold/);
  assert.match(visual,/Beyond the simple pH–pI rule/);
  assert.match(tutorial,/Salt gradient/);
  assert.match(tutorial,/protein-peak/);
});

test("completion PDF requires a name and embeds submission fields", async () => {
  const {buildCompletionPdf}=await import("../app/tutorials/completionRecord.mjs");
  assert.throws(()=>buildCompletionPdf({studentName:"",tutorialNumber:"Guided Tutorial 2",tutorialTitle:"Will the Protein Bind?",version:"1.0",responses:{},attempts:{},outcome:{}}),/name is required/i);
  const result=buildCompletionPdf({studentName:"Student Example",tutorialNumber:"Guided Tutorial 2",tutorialTitle:"Will the Protein Bind?",version:"1.0",timestamp:"2026-07-15T15:00:00.000Z",responses:{charge:"positive"},attempts:{charge:2},outcome:{result:"binds"}});
  const pdf=new TextDecoder().decode(result.bytes);
  assert.match(pdf,/Student Example/);
  assert.match(pdf,/2026-07-15T15:00:00.000Z/);
  assert.match(pdf,/Guided Tutorial 2/);
  assert.match(pdf,/Completion ID: PPS-/);
});

test("tutorial student data remains session-only and is not transmitted", async () => {
  const sources=await Promise.all(["TutorialExperience.tsx","IonExchangeTutorial.tsx","completionRecord.mjs"].map(f=>readFile(new URL(`../app/tutorials/${f}`,import.meta.url),"utf8")));
  const joined=sources.join("\n");
  assert.doesNotMatch(joined,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/);
});

test("portal selection uses one session-level accessible active state", async () => {
  const explorer=await readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
  assert.match(explorer,/activePortal/);
  assert.match(explorer,/setActivePortal\(portal\)/);
  assert.match(explorer,/aria-current/);
  assert.match(explorer,/Active portal/);
  assert.doesNotMatch(explorer,/className="entry primary"/);
  assert.match(explorer,/active===id\?"selected"/);
});

test("Tutorial 2 Step 6 answers remain rendered and exported after reveal", async () => {
  const tutorial=await readFile(new URL("../app/tutorials/IonExchangeTutorial.tsx",import.meta.url),"utf8");
  for(const snippet of ['selected={answers["flow-through"]}','selected={answers.weakest}','selected={answers.last}','selected={answers["why-x"]}']) assert.ok(tutorial.includes(snippet));
  assert.match(tutorial,/aria-pressed=\{chosen\}/);
  assert.match(tutorial,/answer-selected/);
  assert.match(tutorial,/Selected and correct/);
  assert.match(tutorial,/Selected — try again/);
  assert.match(tutorial,/responses:\{\.\.\.answers/);
  const step6=tutorial.slice(tutorial.indexOf('step===5'));
  assert.ok(step6.indexOf('selected={answers["flow-through"]}')<step6.indexOf('!revealed?'));
});

test("free explorer guides a pooled sample through gel analysis to evaluation", async () => {
  const explorer=await readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
  assert.match(explorer,/Pool created\. Specific activity changed from/);
  assert.match(explorer,/Run SDS-PAGE/);
  assert.match(explorer,/openView\("Purification Table"\)/);
  assert.match(explorer,/CurrentInvestigation/);
  assert.match(explorer,/Molecular-weight marker/);
  assert.match(explorer,/Crude lysate/);
  assert.match(explorer,/saltName=config\.retain/);
  assert.match(explorer,/pellet \(Pool F2\)/);
  assert.match(explorer,/Does the darkest band identify Enzyme A/);
  assert.match(explorer,/SDS-PAGE shows protein abundance, not enzyme identity/);
  assert.match(explorer,/Evaluate this step in the Purification Table/);
  assert.match(explorer,/phases\.map/);
});

test("mentor evaluates actual metric changes and common scientific limitations", async () => {
  const {evaluateOperation,goalsFor,mentorNarrative,evaluateFractions}=await import("../app/mentor/mentorEngine.mjs");
  const proteins=[{id:"enzyme-a",mass:62,pI:5.4},{id:"near-mass",mass:60,pI:8},{id:"near-pi",mass:30,pI:5.6}];
  const before={id:"crude",name:"Crude",masses:{"enzyme-a":120,"near-mass":500,"near-pi":380},activeTarget:120,pH:7.4,salt:150,volume:100};
  const after={id:"pool",name:"35–62% pellet",masses:{"enzyme-a":95,"near-mass":310,"near-pi":195},activeTarget:94,pH:7.4,salt:150,volume:33};
  const e=evaluateOperation({experimentId:"pool",before,after,operation:"Ammonium sulfate",property:"Solubility",proteins});
  assert.ok(e.metricChanges.totalProteinPercentChange<0);
  assert.ok(e.metricChanges.yield>75);
  assert.ok(e.detectedOutcomes.includes("salt_high"));
  assert.ok(e.unresolvedProblems.includes("target_overlaps_similar_mass_contaminants"));
  assert.ok(e.unresolvedProblems.includes("target_overlaps_similar_charge_contaminants"));
  assert.ok(goalsFor(e).some(g=>g.id==="desalt"&&g.methods.includes("dialysis")));
  assert.match(mentorNarrative(e,"Purification Table","iex").problems.join(" "),/may not bind effectively/i);
  const fs=[{id:"f1",activity:1,masses:{"enzyme-a":.1,c:10}},{id:"f2",activity:80,masses:{"enzyme-a":8,c:3}},{id:"f3",activity:15,masses:{"enzyme-a":1.5,c:12}}];
  assert.equal(evaluateFractions(fs,["f2"]).classification,"target_rich_balanced");
});

test("mentor architecture separates rule state, UI state, and student exports", async () => {
  const [engine,panel,explorer,tutorial]=await Promise.all(["../app/mentor/mentorEngine.mjs","../app/mentor/MentorPanel.tsx","../app/Explorer.tsx","../app/tutorials/TutorialExperience.tsx"].map(x=>readFile(new URL(x,import.meta.url),"utf8")));
  assert.match(engine,/metricChanges/);
  assert.match(engine,/unresolvedProblems/);
  assert.doesNotMatch(engine,/useState|<section/);
  assert.match(panel,/Thinking Like a Biochemist/);
  assert.match(panel,/Full/);assert.match(panel,/Light/);assert.match(panel,/Off/);
  assert.match(explorer,/mentorReasoning/);
  assert.match(explorer,/studentWork/);
  assert.match(explorer,/evidence-context/);
  assert.match(explorer,/What do you expect the gel to reveal/);
  assert.match(explorer,/Which sample or fractions contain active Enzyme A/);
  assert.match(tutorial,/evaluateOperation/);
});
