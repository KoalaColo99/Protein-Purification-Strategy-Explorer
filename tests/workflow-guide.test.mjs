import test from "node:test";
import assert from "node:assert/strict";
import {deriveWorkflow,evidenceMap,investigationFor,phases,viewPurpose} from "../app/workflowGuide.mjs";

const base={inspected:false,methodChosen:false,configured:false,committed:false,outdated:false,generated:false,pooled:false,evaluated:false,visitedViews:[],method:"salt",methodName:"Ammonium sulfate fractionation"};

test("nine workflow phases derive from scientific state rather than tab changes",()=>{
 assert.equal(phases.length,9);
 assert.equal(deriveWorkflow({...base,visitedViews:["Gel","Dashboard"]}).phase,1);
 assert.equal(deriveWorkflow({...base,inspected:true,methodChosen:true,configured:true,committed:true}).phase,5);
 assert.equal(deriveWorkflow({...base,inspected:true,methodChosen:true,configured:true,committed:true,generated:true}).phase,6);
 assert.equal(deriveWorkflow({...base,inspected:true,methodChosen:true,configured:true,committed:true,generated:true,visitedViews:["Fractions"]}).phase,7);
 assert.equal(deriveWorkflow({...base,pooled:true}).phase,8);
 assert.equal(deriveWorkflow({...base,pooled:true,evaluated:true}).phase,9);
});

test("each functional method recommends scientifically relevant evidence",()=>{
 assert.equal(evidenceMap.salt.primary,"Fractions");
 assert.equal(evidenceMap.iex.primary,"Chromatogram");
 assert.equal(evidenceMap.sec.primary,"Chromatogram");
 assert.equal(evidenceMap.gel.primary,"Gel");
 assert.equal(evidenceMap.assay.primary,"Assays");
});

test("investigation copy follows transitions",()=>{
 assert.match(investigationFor({...base,committed:true,generated:true}).current,/Fractions/);
 assert.match(investigationFor({...base,pooled:true}).next,/Purification Table/);
 assert.match(investigationFor({...base,pooled:true,evaluated:true}).current,/next scientific goal/i);
});

test("view purpose labels retain the requested interpretation questions",()=>{
 assert.equal(viewPurpose.Fractions,"Where did the proteins and enzyme activity go?");
 assert.match(viewPurpose["Purification Table"],/improve purity/);
 assert.match(viewPurpose.Gel,/which masses remain/);
});

test("explorer includes lineage, guidance modes, actual feedback and guarded Next",async()=>{
 const source=await (await import("node:fs/promises")).readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
 assert.match(source,/CurrentInvestigation/);
 assert.match(source,/Full/);assert.match(source,/Compact/);assert.match(source,/Off/);
 assert.match(source,/sample-lineage/);
 assert.match(source,/selected:.*mg protein/);
 assert.match(source,/Specific activity changed from/);
 assert.match(source,/disabled=\{guide\.workflow\.phase===7&&!selected\.length\}/);
 assert.match(source,/setEvaluated\(true\)/);
 assert.match(source,/setGenerated\(true\)/);
});
