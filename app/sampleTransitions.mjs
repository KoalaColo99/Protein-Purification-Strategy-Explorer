const cloneMasses=masses=>Object.fromEntries(Object.entries(masses));

export function poolLineageTransition(sample,{resultingSampleId,methodId="unknown",methodLabel="Purification",poolLabel="Fraction pool",fractionNumbers=[],sequence=(sample.lineage?.length||0)+1}){
 const range=fractionNumbers.length?`F${fractionNumbers[0]}${fractionNumbers.length>1?`–F${fractionNumbers[fractionNumbers.length-1]}`:""}`:"selected fractions";
 return [...(sample.lineage||[]),{operationId:`selection-${sequence}`,operationType:"fraction_selection",sourceSampleId:sample.id,resultingSampleId,label:`${methodLabel} fractions ${range}`,sequence,metadata:{methodId,fractionNumbers}},{operationId:`pool-${sequence}`,operationType:"fraction_pool",sourceSampleId:sample.id,resultingSampleId,label:poolLabel,sequence:sequence+.1,metadata:{methodId,fractionNumbers}}];
}

export function preparedBufferTransition(sample,{targetBuffer="20 mM phosphate",targetPH=7.5,targetSalt=50,preparationLoss=0,reason="Prepare for ion-exchange chromatography",sequence=(sample.lineage?.length||0)+1}={}){
 const retention=Math.max(0,Math.min(1,1-preparationLoss));
 const resultingSampleId=`${sample.id}-prepared-${sequence}`;
 const metadata={operationType:"prepared_buffer_transition",performedByStudent:false,sourceSampleId:sample.id,resultingSampleId,reason,priorConditions:{buffer:sample.buffer,pH:sample.pH,saltConcentration:sample.salt,ammoniumSulfate:sample.salt>100?"retained from ammonium sulfate fractionation":"not elevated"},newConditions:{buffer:targetBuffer,pH:targetPH,saltConcentration:targetSalt,ammoniumSulfate:"reduced by external buffer exchange"},preparationLoss};
 const lineageEntry={operationId:`prepare-${sequence}`,operationType:metadata.operationType,sourceSampleId:sample.id,resultingSampleId,label:"Instructor-prepared low-salt transition",sequence,metadata};
 return {sample:{...sample,id:resultingSampleId,name:"Instructor-prepared low-salt transition",volume:sample.volume,buffer:targetBuffer,pH:targetPH,salt:targetSalt,masses:Object.fromEntries(Object.entries(cloneMasses(sample.masses)).map(([id,mass])=>[id,Number(mass)*retention])),activeTarget:sample.activeTarget*retention,lineage:[...(sample.lineage||[]),lineageEntry],type:"Sample-preparation transition"},metadata,lineageEntry};
}
