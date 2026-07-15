export type BindingResult={result:"weak or uncertain binding"|"flow-through"|"binds";strength:number;elution:number};
export function proteinCharge(pI:number,pH:number):"positive"|"negative"|"approximately neutral";
export function phPIRelationship(pI:number,pH:number):"pH < pI"|"pH > pI"|"pH ≈ pI";
export function numberLineMarkers(pI:number,pH:number):{pI:number;pH:number;order:string[]};
export function simplePI(pKa1:number,pKa2:number):number;
export function resinCharge(type:"cation"|"anion"):"negative"|"positive";
export function bindingPrediction(x:{pI:number;pH:number;resinType:"cation"|"anion";startSalt?:number}):BindingResult;
export function modeledProteins(pH:number,resinType:"cation"|"anion"):Array<{name:string;pI:number;charge:string;result:string;strength:number;elution:number}>;
