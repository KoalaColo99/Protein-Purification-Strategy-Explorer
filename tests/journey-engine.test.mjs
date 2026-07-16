import test from "node:test";
import assert from "node:assert/strict";
import {evaluateInvestigation,evaluateStage,targetSelectionAssessment} from "../app/journeyEngine.mjs";
import {investigations} from "../app/guidedJourney.mjs";
import {actionFor,journeyActions} from "../app/journeyActions.mjs";

const eventTypes=(types)=>types.map(type=>({type}));
const baseContext={events:[],selectedFractions:[],totalTargetActivity:100,currentSample:{targetActivity:1},analysisEvidence:{},conclusions:{}};

test("generic completion evaluator reports missing requirements and next stage",()=>{
 const result=evaluateInvestigation(investigations["investigation-solubility"],baseContext);
 assert.equal(result.activeId,"inspect");
 assert.deepEqual(result.missing,["startingSampleReviewed"]);
 const inspect=evaluateStage(investigations["investigation-solubility"].orderedStages[0],{...baseContext,events:eventTypes(["startingSampleReviewed"])});
 assert.equal(inspect.complete,true);
});

test("target-containing selection requires meaningful activity but permits multiple valid pools",()=>{
 assert.equal(targetSelectionAssessment([{activity:0}],100,.1).valid,false);
 assert.equal(targetSelectionAssessment([{activity:4}],100,.1).valid,false);
 assert.equal(targetSelectionAssessment([{activity:12}],100,.1).valid,true);
 assert.equal(targetSelectionAssessment([{activity:7},{activity:8}],100,.1).valid,true);
});

test("Investigation 1 requires explicit fraction, metric, gel, activity and conclusion evidence",()=>{
 const events=eventTypes(["startingSampleReviewed","ammoniumSulfateSelected","fractionationSettingsReviewed","solubilityPredictionCommitted","fractionationGenerated","fractionEvidenceReviewed","purificationMetricsReviewed","gelGenerated","gelInterpretationAnswered","activityAssayGenerated","activityInterpretationAnswered","investigationConclusionSubmitted"]);events.push({type:"targetContainingMaterialRetained",targetActivity:20,targetFraction:.2});
 const context={...baseContext,events,analysisEvidence:{"sds-page":{generated:true,interpretationAnswered:true},"activity-assay":{generated:true,interpretationAnswered:true}},conclusions:{"investigation-solubility":{submitted:true}}};
 assert.equal(evaluateInvestigation(investigations["investigation-solubility"],context).complete,true);
 assert.equal(evaluateInvestigation(investigations["investigation-solubility"],{...context,analysisEvidence:{...context.analysisEvidence,"sds-page":{generated:true,interpretationAnswered:false}}}).activeId,"gel");
});

test("Investigation 2 uses all fifteen registry stages and completes generically",()=>{
 const inv=investigations["investigation-charge"];
 assert.equal(inv.orderedStages.length,15);
 const events=eventTypes(["investigation2SampleReviewed","chargeRationaleReviewed","compatibleSamplePrepared","phPiReviewed","exchangerChosen","chargePredictionCommitted","gradientConfigured","ionExchangeGenerated","chromatogramInterpreted","ionExchangeActivityReviewed","ionExchangeMetricsReviewed","investigationsCompared","investigation2ConclusionSubmitted","scientificJourneyCompleted"]);events.push({type:"ionExchangeTargetPoolRetained",targetActivity:25,targetFraction:.25});
 const context={...baseContext,events,conclusions:{"investigation-charge":{submitted:true}}};
 assert.equal(evaluateInvestigation(inv,context).complete,true);
 assert.equal(evaluateInvestigation(inv,{...context,events:events.filter(x=>x.type!=="compatibleSamplePrepared")}).activeId,"prepare");
});

test("every guided stage resolves to a real registered action",()=>{
 for(const inv of Object.values(investigations))for(const stage of inv.orderedStages)assert.ok(actionFor(stage.primaryActionId),`${inv.id}/${stage.id}`);
 assert.ok(Object.keys(journeyActions).length>=25);
});

test("contextual panel, prepared lineage, challenge availability and export separation are present",async()=>{
 const fs=await import("node:fs/promises");
 const explorer=await fs.readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
 const journey=await fs.readFile(new URL("../app/ScientificJourney.tsx",import.meta.url),"utf8");
 assert.match(explorer,/preparedBufferTransition/);
 assert.match(explorer,/kind:"preparation",method:"Buffer preparation"/);
 assert.match(explorer,/guidedJourneyRecord/);
 assert.match(explorer,/standaloneTutorialRecords/);
 assert.match(explorer,/systemInterpretations/);
 assert.match(explorer,/GuidedContextPanel/);
 assert.match(explorer,/mode==="Guided Explorer".*GuidedContextPanel/);
 assert.match(journey,/disabled=\{!enabled\}/);
 assert.match(journey,/co-migrate on SDS-PAGE/);
 assert.match(journey,/competes with protein–resin electrostatic interactions/);
});
