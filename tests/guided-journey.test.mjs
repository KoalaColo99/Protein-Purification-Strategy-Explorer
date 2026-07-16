import test from "node:test";
import assert from "node:assert/strict";
import {classifySolubilityConclusion,deriveSolubilityStage,investigations,journeyProgress} from "../app/guidedJourney.mjs";

const base={inspected:false,methodChosen:false,configured:false,committed:false,outdated:false,generated:false,fractionsVisited:false,selected:false,pooled:false,evaluated:false,gelReviewed:false,assayReviewed:false,conclusionResponse:""};

test("Tutorial 1 is an ordered registry-driven solubility investigation",()=>{
 const inv=investigations["investigation-solubility"];
 assert.equal(inv.tutorialId,"tutorial-1");
 assert.equal(inv.orderedStages.length,11);
 assert.deepEqual(inv.orderedStages.map(x=>x.id),["inspect","property","configure","predict","run","fractions","retain","evaluate","gel","activity","conclusion"]);
 assert.equal(inv.nextInvestigationId,"investigation-charge");
});

test("real scientific evidence advances evaluation, gel, activity, and conclusion",()=>{
 assert.equal(deriveSolubilityStage(base),"inspect");
 assert.equal(deriveSolubilityStage({...base,pooled:true}),"evaluate");
 assert.equal(deriveSolubilityStage({...base,pooled:true,evaluated:true}),"gel");
 assert.equal(deriveSolubilityStage({...base,pooled:true,evaluated:true,gelReviewed:true}),"activity");
 assert.equal(deriveSolubilityStage({...base,pooled:true,evaluated:true,gelReviewed:true,assayReviewed:true}),"conclusion");
 assert.equal(deriveSolubilityStage({...base,conclusionResponse:"Partly"}),"complete");
});

test("tab visits alone cannot complete guided stages",()=>{
 assert.equal(deriveSolubilityStage({...base,fractionsVisited:true}),"inspect");
 assert.equal(journeyProgress("investigation-solubility",base).index,0);
});

test("more than one conclusion can be defensible when supported",()=>{
 assert.equal(classifySolubilityConclusion({fold:1.4,yieldPct:92},"Partly, the sample improved but substantial contaminants remain.").defensible,true);
 assert.equal(classifySolubilityConclusion({fold:2.4,yieldPct:80},"Yes, the sample became substantially purer while retaining acceptable activity.").defensible,true);
});

test("Investigation 2 begins with compatibility preparation and never auto-runs ion exchange",()=>{
 const inv=investigations["investigation-charge"];
 assert.equal(inv.tutorialId,"tutorial-2");
 assert.equal(inv.orderedStages[1].id,"charge-rationale");
 assert.equal(inv.orderedStages[2].id,"prepare");
 assert.match(inv.orderedStages[2].whyItMatters,/ionic strength/i);
});

test("guided, challenge, and free presentations are distinct",async()=>{
 const fs=await import("node:fs/promises");
 const explorer=await fs.readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
 const panel=await fs.readFile(new URL("../app/ScientificJourney.tsx",import.meta.url),"utf8");
 assert.match(explorer,/mode==="Guided Explorer"\?<ScientificJourney/);
 assert.match(explorer,/mode==="Purification Challenge"\?<ChallengeGoals/);
 assert.match(explorer,/mode==="Free Exploration"/);
 assert.match(panel,/Other valid options/);
 assert.match(panel,/Coming next in Investigation 2/);
 assert.match(panel,/INVESTIGATION 1 COMPLETE/);
 assert.match(panel,/Evaluate the sample/);
 assert.match(panel,/Prepare the sample/);
 assert.match(panel,/Continue purifying/);
 assert.match(panel,/Finish or revise/);
});

test("guided analysis methods replace stale purification predictions",async()=>{
 const fs=await import("node:fs/promises");
 const explorer=await fs.readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
 const context=await fs.readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
 assert.match(explorer,/id==="gel"\)setPrediction\(\{property:"Molecular mass"/);
 assert.match(explorer,/id==="assay"\)setPrediction\(\{property:"Catalytic activity"/);
 assert.match(context,/GuidedContextPanel/);
 assert.match(context,/ExperimentPanel/);
});
