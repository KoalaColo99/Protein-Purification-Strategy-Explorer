export const initialTutorialState=()=>({step:0,answers:{},assayRevealed:false,selection:[],checks:[],reflection:"",completed:false});
export function closestContaminant(proteins,targetId="enzyme-a"){
 const target=proteins.find(p=>p.id===targetId);
 return proteins.filter(p=>p.id!==targetId).map(p=>({...p,difference:Math.abs(p.mass-target.mass)})).sort((a,b)=>a.difference-b.difference)[0];
}
export function selectionEvaluation(fractions,ids){
 const picked=fractions.filter(f=>ids.includes(f.id)).sort((a,b)=>a.n-b.n);
 if(!picked.length)return {ok:false,kind:"empty",message:"Select a contiguous group around the activity peak."};
 const contiguous=picked.every((f,i)=>i===0||f.n===picked[i-1].n+1);
 if(!contiguous)return {ok:false,kind:"split",message:"Pool neighboring fractions; separated islands cannot form one defensible peak pool."};
 const totalAct=fractions.reduce((s,f)=>s+f.activity,0), recovered=picked.reduce((s,f)=>s+f.activity,0)/Math.max(totalAct,.001);
 const target=picked.reduce((s,f)=>s+(f.masses["enzyme-a"]||0),0), contaminants=picked.reduce((s,f)=>s+Object.entries(f.masses).filter(([id])=>id!=="enzyme-a").reduce((a,[,v])=>a+v,0),0);
 const purity=target/Math.max(target+contaminants,.001);
 if(recovered<.55)return {ok:false,kind:"narrow",recovered,purity,message:"This range misses too much of the activity peak. Include an adjacent active fraction."};
 if(picked.length>7||purity<.2)return {ok:false,kind:"broad",recovered,purity,message:"This range recovers activity but carries substantial contaminating protein. Tighten it around the activity peak."};
 return {ok:true,kind:"balanced",recovered,purity,message:"Defensible pool: contiguous, activity-rich, and selective enough to improve purity."};
}
export function supportedInterpretations(initial,pooled){
 const total=s=>Object.values(s.masses).reduce((a,b)=>a+b,0), target=s=>s.masses["enzyme-a"]||0;
 return {purityImproved:target(pooled)/total(pooled)>target(initial)/total(initial),activityRetained:pooled.activeTarget>0,perfectlyPure:Object.entries(pooled.masses).filter(([id])=>id!=="enzyme-a").every(([,v])=>v<.01)};
}
