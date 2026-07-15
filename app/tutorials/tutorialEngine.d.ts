export type TutorialState={step:number;answers:Record<string,string>;assayRevealed:boolean;selection:string[];checks:string[];reflection:string;completed:boolean};
export function initialTutorialState():TutorialState;
export function closestContaminant(proteins:any[],targetId?:string):any;
export function selectionEvaluation(fractions:any[],ids:string[]):{ok:boolean;kind:string;message:string;recovered?:number;purity?:number};
export function supportedInterpretations(initial:any,pooled:any):{purityImproved:boolean;activityRetained:boolean;perfectlyPure:boolean};
