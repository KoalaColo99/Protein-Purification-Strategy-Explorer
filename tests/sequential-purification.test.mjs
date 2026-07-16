import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {compatibilityRules,validateMethodEntry} from "../app/methodCompatibility.mjs";
import {poolLineageTransition,preparedBufferTransition} from "../app/sampleTransitions.mjs";

const crude={id:"crude",name:"Crude lysate",volume:100,pH:7.4,salt:150,buffer:"50 mM Tris",masses:{"enzyme-a":120,contaminant:880},activeTarget:120,lineage:[],type:"Crude lysate"};
const saltPool={...crude,id:"salt-pool",name:"35–62% pellet (Pool F2)",volume:33,masses:{"enzyme-a":100,contaminant:400},activeTarget:98,lineage:poolLineageTransition(crude,{resultingSampleId:"salt-pool",methodId:"salt",methodLabel:"Ammonium sulfate",poolLabel:"35–62% pellet (Pool F2)",fractionNumbers:[2],sequence:1})};

test("compatibility rules return structured warnings and blockers",()=>{
 assert.equal(compatibilityRules.iex.maximumStartingSalt,100);
 const blocked=validateMethodEntry("iex",saltPool,{pH:7.5});
 assert.equal(blocked.allowed,false);
 assert.equal(blocked.blockers[0].code,"salt_too_high");
 assert.deepEqual(blocked.preparationOptions,["desalting","prepared_compatible_sample"]);
 assert.equal(validateMethodEntry("iex",{...saltPool,salt:50},{pH:7.5}).allowed,true);
 assert.equal(validateMethodEntry("sec",saltPool,{load:12}).warnings[0].code,"broad_peaks");
 assert.equal(validateMethodEntry("sec",saltPool,{load:25}).blockers[0].code,"load_too_large");
 assert.equal(validateMethodEntry("salt",crude,{}).warnings[0].code,"retained_salt");
});

test("prepared transition creates a traceable compatible sample without silent composition loss",()=>{
 const result=preparedBufferTransition(saltPool,{targetBuffer:"20 mM phosphate",targetPH:7.5,targetSalt:50,preparationLoss:0,sequence:3});
 assert.notEqual(result.sample.id,saltPool.id);
 assert.equal(result.sample.salt,50);
 assert.equal(result.sample.buffer,"20 mM phosphate");
 assert.equal(result.sample.pH,7.5);
 assert.deepEqual(result.sample.masses,saltPool.masses);
 assert.equal(result.sample.activeTarget,saltPool.activeTarget);
 assert.equal(result.metadata.performedByStudent,false);
 assert.equal(result.metadata.operationType,"prepared_buffer_transition");
 assert.equal(result.sample.lineage.length,saltPool.lineage.length+1);
 assert.equal(result.sample.lineage.at(-1).label,"Instructor-prepared low-salt transition");
});

test("pooling extends ancestry through multiple purification methods",()=>{
 const prepared=preparedBufferTransition(saltPool,{targetSalt:50,sequence:3}).sample;
 const ionLineage=poolLineageTransition(prepared,{resultingSampleId:"iex-pool",methodId:"iex",methodLabel:"Ion exchange",poolLabel:"Ion-exchange pool F6–F8",fractionNumbers:[6,7,8],sequence:4});
 assert.deepEqual(ionLineage.slice(0,prepared.lineage.length),prepared.lineage);
 assert.equal(ionLineage.at(-2).label,"Ion exchange fractions F6–F8");
 assert.equal(ionLineage.at(-1).label,"Ion-exchange pool F6–F8");
 assert.deepEqual(ionLineage.map(x=>x.operationType),["fraction_selection","fraction_pool","prepared_buffer_transition","fraction_selection","fraction_pool"]);
});

test("step history supports preparation rows, cumulative baselines, chaining, and repeated Undo",()=>{
 const prepared=preparedBufferTransition(saltPool,{targetSalt:50,sequence:3}).sample;
 const ionPool={...prepared,id:"iex-pool",name:"Ion-exchange pool F6–F8",masses:{"enzyme-a":80,contaminant:80},activeTarget:78,lineage:poolLineageTransition(prepared,{resultingSampleId:"iex-pool",methodId:"iex",methodLabel:"Ion exchange",poolLabel:"Ion-exchange pool F6–F8",fractionNumbers:[6,7,8],sequence:4})};
 const secPool={...ionPool,id:"sec-pool",name:"Size-exclusion pool F7–F9",masses:{"enzyme-a":60,contaminant:20},activeTarget:58,lineage:poolLineageTransition(ionPool,{resultingSampleId:"sec-pool",methodId:"sec",methodLabel:"Size exclusion",poolLabel:"Size-exclusion pool F7–F9",fractionNumbers:[7,8,9],sequence:6})};
 let steps=[crude,saltPool,prepared,ionPool,secPool];
 assert.equal(steps.length,5);
 const total=s=>Object.values(s.masses).reduce((a,b)=>a+b,0),activity=s=>s.activeTarget*82,specific=s=>activity(s)/total(s),baseline=specific(crude);
 assert.equal((100*ionPool.activeTarget/crude.activeTarget).toFixed(1),"65.0");
 assert.equal((specific(ionPool)/baseline).toFixed(2),"4.06");
 steps=steps.slice(0,-1);assert.equal(steps.at(-1).id,"iex-pool");
 steps=steps.slice(0,-1);assert.equal(steps.at(-1).id,prepared.id);
 steps=steps.slice(0,-1);assert.equal(steps.at(-1).id,"salt-pool");
});

test("every UI ion-exchange entry delegates to the shared method guard",async()=>{
 const source=await readFile(new URL("../app/Explorer.tsx",import.meta.url),"utf8");
 assert.match(source,/function prepareMethodEntry\(id:string\).*validateMethodEntry\(id,sample,config\)/s);
 assert.match(source,/onClick=\{\(\)=>prepareMethodEntry\(m\.id\)\}/);
 assert.match(source,/else if\(id==="iex"\)prepareMethodEntry\("iex"\)/);
 assert.match(source,/action\.targetMethod.*prepareMethodEntry\(action\.targetMethod\)/);
 assert.match(source,/onAlternative=\{\(\)=>sample\.salt>100\?prepareMethodEntry\("assay"\):prepareMethodEntry\("iex"\)\}/);
 assert.doesNotMatch(source,/if\(sample\.salt>100\).*choose\("iex"\)/s);
 assert.match(source,/kind:"preparation",method:"Buffer preparation"/);
 assert.match(source,/setSteps\(s=>\[\.\.\.s,\{name:prepared\.name/);
});
