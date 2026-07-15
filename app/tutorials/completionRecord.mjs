const esc=s=>String(s).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/[^\x20-\x7E]/g,"-");
export function completionIdentity(data){
 const timestamp=data.timestamp||new Date().toISOString(), source=JSON.stringify({...data,timestamp});
 let hash=2166136261; for(let i=0;i<source.length;i++){hash^=source.charCodeAt(i);hash=Math.imul(hash,16777619)}
 const code=(hash>>>0).toString(36).toUpperCase().padStart(7,"0");
 return {timestamp,completionId:`PPS-${timestamp.slice(0,10).replaceAll("-","")}-${code}`,verificationCode:code.slice(0,6)};
}
export function buildCompletionPdf(data){
 if(!data.studentName?.trim())throw new Error("Student name is required before generating a PDF record.");
 const identity=completionIdentity(data), lines=[
  "PROTEIN PURIFICATION STRATEGY EXPLORER",`${data.tutorialNumber}: ${data.tutorialTitle}`,
  `Student: ${data.studentName.trim()}`,`Tutorial version: ${data.version}`,`Completed: ${identity.timestamp}`,
  `Completion ID: ${identity.completionId}`,`Verification code: ${identity.verificationCode}`,"",
  `This record documents completion of ${data.tutorialNumber}: ${data.tutorialTitle}.`,"",
  "RESPONSES AND ATTEMPTS",...Object.entries(data.responses||{}).map(([k,v])=>`${k}: ${v}`),
  ...Object.entries(data.attempts||{}).map(([k,v])=>`Attempts - ${k}: ${v}`),"",
  "FINAL OUTCOME",...Object.entries(data.outcome||{}).map(([k,v])=>`${k}: ${v}`),"",
  "This record reflects locally generated tutorial work and does not prove identity."
 ];
 const content=["BT","/F1 10 Tf","50 750 Td","13 TL",...lines.slice(0,48).flatMap((line,i)=>[`${i?"T* ":""}(${esc(line)}) Tj`]),"ET"].join("\n");
 const objs=["<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids [3 0 R] /Count 1 >>","<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",`<< /Length ${content.length} >>\nstream\n${content}\nendstream`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`];
 let pdf="%PDF-1.4\n", offsets=[0]; objs.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`});const xref=pdf.length;pdf+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,"0")+" 00000 n ").join("\n")}\ntrailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 return {bytes:new TextEncoder().encode(pdf),...identity};
}
export function downloadCompletionPdf(data){const record=buildCompletionPdf(data),url=URL.createObjectURL(new Blob([record.bytes],{type:"application/pdf"})),a=document.createElement("a");a.href=url;a.download=`${data.tutorialNumber.toLowerCase().replaceAll(" ","-")}-completion-record.pdf`;a.click();URL.revokeObjectURL(url);return record}
