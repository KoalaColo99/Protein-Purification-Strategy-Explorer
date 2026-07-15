export type PredictionTextSource = "generated" | "student";
export function saltSuggestedText(config: {low:number; high:number; retain:string}): string;
export function predictionConfigSnapshot(method:string, config:Record<string,unknown>, text:string, source:PredictionTextSource): Record<string,unknown>;
export function retainedSaltFractionIndex(retain:string): number;
