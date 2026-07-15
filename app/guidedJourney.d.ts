export const investigations:Record<string,any>;
export const conclusionOptions:string[];
export function deriveSolubilityStage(state:Record<string,unknown>):string;
export function journeyProgress(investigationId:string,state:Record<string,unknown>):any;
export function classifySolubilityConclusion(metrics:{fold:number;yieldPct:number},response:string):{defensible:boolean;reason:string};
