export type BindingResult={result:"weak or uncertain binding"|"flow-through"|"binds";strength:number;elution:number};
export function proteinCharge(pI:number,pH:number):"positive"|"negative"|"approximately neutral";
export function resinCharge(type:"cation"|"anion"):"negative"|"positive";
export function bindingPrediction(x:{pI:number;pH:number;resinType:"cation"|"anion";startSalt?:number}):BindingResult;
export function modeledProteins(pH:number,resinType:"cation"|"anion"):Array<{name:string;pI:number;charge:string;result:string;strength:number;elution:number}>;
