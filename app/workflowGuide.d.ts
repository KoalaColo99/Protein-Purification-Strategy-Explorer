export const phases:string[];
export const viewPurpose:Record<string,string>;
export const evidenceMap:Record<string,{primary:string;secondary:string[];required:string[];reveals:string[];nextGoals:string[]}>;
export const viewIntroductions:Record<string,{look:string;next:string}>;
export const decisionQuestions:Record<string,string>;
export const revealLimits:Record<string,{can:string[];cannot:string[]}>;
export function deriveWorkflow(state:Record<string,unknown>):{phase:number;completed:boolean[];primary?:string};
export function investigationFor(state:Record<string,unknown>):{workflow:{phase:number;completed:boolean[];primary?:string};current:string;why:string;reveals:string;next:string};
