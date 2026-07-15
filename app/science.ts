import { proteins } from "./data";
export type Sample = { id:string; name:string; volume:number; pH:number; salt:number; buffer:string; masses:Record<string,number>; activeTarget:number; lineage:string[]; type:string };
export type Fraction = { id:string; n:number; volume:number; masses:Record<string,number>; activity:number; absorbance:number };
export const totalProtein=(s:{masses:Record<string,number>})=>Object.values(s.masses).reduce((a,b)=>a+b,0);
export const targetMass=(s:{masses:Record<string,number>})=>s.masses["enzyme-a"]||0;
export const purity=(s:{masses:Record<string,number>})=>100*targetMass(s)/Math.max(totalProtein(s),.001);
export const activity=(s:Sample)=>s.activeTarget*82;
export const makeInitial=():Sample=>({id:"crude",name:"Crude bacterial lysate",volume:100,pH:7.4,salt:150,buffer:"50 mM Tris",masses:Object.fromEntries(proteins.map(p=>[p.id,p.initialMass])),activeTarget:120,lineage:[],type:"Crude lysate"});

const gaussian=(x:number,mu:number,sigma:number)=>Math.exp(-.5*((x-mu)/sigma)**2);
export function fractionate(sample:Sample,method:string,config:any):Fraction[]{
 const count=method==="salt"?3:16; const fractions:Array<Fraction>=[];
 const weights:Record<string,number[]>={};
 proteins.forEach(p=>{
   let ws:number[]=[];
   if(method==="salt"){
    const low=Number(config.low), high=Number(config.high);
    const below=Math.max(0,Math.min(1,(low-p.precip[0])/(p.precip[1]-p.precip[0])));
    const above=Math.max(0,Math.min(1,(high-p.precip[0])/(p.precip[1]-p.precip[0])));
    ws=[below,Math.max(0,above-below),Math.max(0,1-above)];
   } else {
    for(let i=1;i<=count;i++){
     let center=8;
     if(method==="iex"){
       const binds=config.exchanger==="anion" ? config.pH>p.pI : config.pH<p.pI;
       center=binds ? 4+Math.min(9,Math.abs(config.pH-p.pI)*2.1) : 2;
     } else center=13-(Math.log(p.mass)-Math.log(12))/(Math.log(90)-Math.log(12))*9;
     ws.push(gaussian(i,center,method==="sec" ? 1.65+Number(config.load)/120 : 1.25));
    }
   }
   const sum=ws.reduce((a,b)=>a+b,0)||1; weights[p.id]=ws.map(w=>w/sum*.96);
 });
 for(let i=0;i<count;i++){
   const masses=Object.fromEntries(proteins.map(p=>[p.id,(sample.masses[p.id]||0)*weights[p.id][i]]));
   const tm=masses["enzyme-a"]||0; fractions.push({id:`${method}-${Date.now()}-${i}`,n:i+1,volume:method==="salt"?sample.volume/3:Number(config.fraction),masses,activity:tm*82*(method==="salt"?.96:.98),absorbance:totalProtein({masses})/12});
 }
 return fractions;
}
export function pool(sample:Sample,fs:Fraction[]):Sample{
 const masses=Object.fromEntries(proteins.map(p=>[p.id,fs.reduce((a,f)=>a+(f.masses[p.id]||0),0)]));
 return {id:`pool-${Date.now()}`,name:`Pool F${fs[0].n}–F${fs[fs.length-1].n}`,volume:fs.reduce((a,f)=>a+f.volume,0),pH:sample.pH,salt:sample.salt,buffer:sample.buffer,masses,activeTarget:fs.reduce((a,f)=>a+f.activity/82,0),lineage:fs.map(f=>f.id),type:"Fraction pool"};
}
