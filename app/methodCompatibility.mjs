export const compatibilityRules={
 iex:{maximumStartingSalt:100,pHRange:[4,10],targetPI:5.4},
 sec:{maximumLoadVolume:20,recommendedLoadVolume:10,columnRangeKDa:[3,80]},
 salt:{retainedSaltConsequence:true},
 assay:{modeledInterferences:[]}
};

export function validateMethodEntry(methodId,sample,config={}){
 const warnings=[],blockers=[],preparationOptions=[];
 if(methodId==="iex"){
  const rule=compatibilityRules.iex;
  if(sample.salt>rule.maximumStartingSalt){blockers.push({code:"salt_too_high",message:`Your current sample contains ${sample.salt} mM salt. This is above the recommended binding range for the selected ion exchanger.`});preparationOptions.push("desalting","prepared_compatible_sample");}
  if(config.pH<rule.pHRange[0]||config.pH>rule.pHRange[1])blockers.push({code:"ph_out_of_range",message:`Ion exchange requires a modeled pH between ${rule.pHRange[0]} and ${rule.pHRange[1]}.`});
  else if(Math.abs(config.pH-rule.targetPI)<=.35)warnings.push({code:"target_near_pi",message:"Enzyme A is near its pI and may bind weakly or unpredictably."});
 }
 if(methodId==="sec"){
  const load=Number(config.load||0),rule=compatibilityRules.sec;
  if(load>rule.maximumLoadVolume)blockers.push({code:"load_too_large",message:`The ${load} mL load exceeds the modeled column capacity.`});
  else if(load>rule.recommendedLoadVolume)warnings.push({code:"broad_peaks",message:"This sample load may broaden peaks and reduce resolution."});
 }
 if(methodId==="salt")warnings.push({code:"retained_salt",message:"Ammonium sulfate remains in retained fractions; plan a compatible buffer transition before ion exchange."});
 return {allowed:blockers.length===0,warnings,blockers,preparationOptions,nextAction:blockers.some(x=>x.code==="salt_too_high")?"prepare_sample":"configure_method"};
}
