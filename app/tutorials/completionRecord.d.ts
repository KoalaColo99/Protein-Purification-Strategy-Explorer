export type CompletionData={studentName:string;tutorialNumber:string;tutorialTitle:string;version:string;timestamp?:string;responses:Record<string,string>;attempts:Record<string,number>;outcome:Record<string,string|number>};
export function completionIdentity(data:CompletionData):{timestamp:string;completionId:string;verificationCode:string};
export function buildCompletionPdf(data:CompletionData):{bytes:Uint8Array;timestamp:string;completionId:string;verificationCode:string};
export function downloadCompletionPdf(data:CompletionData):{bytes:Uint8Array;timestamp:string;completionId:string;verificationCode:string};
