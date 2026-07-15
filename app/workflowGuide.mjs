export const phases = [
  "Inspect Sample", "Choose a Property", "Configure Method", "Make a Prediction",
  "Run Experiment", "Examine Evidence", "Select Material", "Evaluate the Step", "Choose the Next Goal"
];

export const viewPurpose = {
  "Current Sample": "What is in my working sample now?",
  Fractions: "Where did the proteins and enzyme activity go?",
  Chromatogram: "How did proteins separate across the experiment?",
  Gel: "How complex is the sample, and which masses remain?",
  Assays: "Where is the active target and how much activity remains?",
  "Purification Table": "Did this step improve purity enough to justify the losses?",
  Dashboard: "How is the overall strategy balancing purity, recovery, cost, and time?"
};

export const evidenceMap = {
  salt: {primary:"Fractions", secondary:["Assays","Gel","Purification Table"], required:["inspectFractions","selectRetainedMaterial"], reveals:["which proteins precipitated","where active target was recovered","whether solubility differences enriched the target"], nextGoals:["removeSalt","inspectComplexity","improvePurity"]},
  iex: {primary:"Chromatogram", secondary:["Fractions","Assays","Purification Table"], required:["inspectChromatogram","selectRetainedMaterial"], reveals:["binding behavior","salt-dependent elution","separation by charge"], nextGoals:["inspectComplexity","improvePurity"]},
  sec: {primary:"Chromatogram", secondary:["Fractions","Assays","Gel"], required:["inspectChromatogram","selectRetainedMaterial"], reveals:["relative elution by size","overlap among similarly sized proteins","where active target eluted"], nextGoals:["inspectComplexity","improvePurity"]},
  gel: {primary:"Gel", secondary:["Assays","Purification Table"], required:["inspectGel"], reveals:["sample complexity","approximate molecular masses","co-migration of similarly sized proteins"], nextGoals:["compareEvidence"]},
  assay: {primary:"Assays", secondary:["Gel","Purification Table"], required:["inspectAssays"], reveals:["where active target is located","how much activity remains","whether target protein is still functional"], nextGoals:["compareEvidence"]}
};

export const viewIntroductions = {
  "Current Sample": {look:"Total protein, activity, target abundance, pH, salt, and major contaminants.",next:"Choose a protein property that could separate the target."},
  Fractions: {look:"Fractions with high Enzyme A activity and relatively low total protein.",next:"Select a defensible fraction or range and preview the pool."},
  Chromatogram: {look:"Activity that aligns with a resolved protein peak rather than a broad overlap.",next:"Compare the peak region with fractions and assay evidence."},
  Gel: {look:"Bands that disappeared or became fainter, and proteins that remain near 62 kDa.",next:"Compare the gel with activity and purification metrics."},
  Assays: {look:"The sample or fractions where active Enzyme A is concentrated.",next:"Compare activity retention with total protein and purity."},
  "Purification Table": {look:"Higher specific activity with acceptable target recovery, cost, and time.",next:"Decide whether the step was useful and choose the next limitation to address."},
  Dashboard: {look:"The strongest remaining tradeoff among purity, recovery, cost, and time.",next:"Choose the next scientific goal."}
};

export const decisionQuestions = {
  Fractions:"Which fractions best balance target recovery and contaminant removal?",
  Chromatogram:"Which peak or region most likely contains active Enzyme A?",
  Gel:"Did protein complexity decrease after the purification step?",
  Assays:"Where is active Enzyme A concentrated?",
  "Purification Table":"Was the increase in specific activity worth the loss in yield?",
  Dashboard:"Which limitation should the next step address?"
};

export const revealLimits = {
  Gel:{can:["Show the number of major protein bands","Estimate molecular masses","Show whether sample complexity decreased"],cannot:["Identify Enzyme A by itself","Show whether Enzyme A is active","Resolve co-migrating proteins"]},
  Assays:{can:["Locate active Enzyme A","Compare relative activity","Show activity loss"],cannot:["Show overall protein purity","Determine molecular mass","Detect inactive target protein"]},
  Fractions:{can:["Show protein and activity distribution","Support a recovery-versus-purity decision"],cannot:["Prove protein identity","Show molecular mass without another analysis"]},
  Chromatogram:{can:["Show separation and peak overlap","Locate activity across elution"],cannot:["Prove peak purity","Identify a protein without orthogonal evidence"]}
};

export function deriveWorkflow(s) {
  let phase=1;
  if(s.inspected) phase=2;
  if(s.methodChosen) phase=s.configured?4:3;
  if(s.committed && !s.outdated) phase=5;
  if(s.generated) phase=6;
  const primary=evidenceMap[s.method]?.primary;
  if(s.generated && (s.visitedViews||[]).includes(primary)) phase=7;
  if(s.pooled) phase=8;
  if(s.evaluated) phase=9;
  return {phase,completed:phases.map((_,i)=>i+1<phase),primary};
}

export function investigationFor(s) {
  const w=deriveWorkflow(s), methodName=s.methodName||"selected method";
  const copy={
    1:["Inspect the starting sample.","A defensible strategy begins with the mixture and its constraints.","Protein, activity, target abundance, pH, salt, and contaminants.","Review the Current Sample metrics."],
    2:["Choose a protein property to exploit.","A separation succeeds only when the target differs from contaminants.","Which method can turn a protein property into useful separation.","Select a method from the library."],
    3:[`Configure ${methodName}.`,"Experimental settings determine the intended separation.","How the chosen conditions define what will be retained or resolved.","Review compatibility and adjust the settings."],
    4:["Make a scientific prediction.","A recorded expectation makes the modeled outcome interpretable.","What should happen to Enzyme A under these exact conditions.","Review and commit the prediction."],
    5:["Run the experiment.","The model can now test the committed prediction.","Whether the outcome supports the prediction under the recorded settings.","Run Experiment."],
    6:[`Examine the ${w.primary||"primary"} evidence.`,"Determine where active target was recovered and what separated with it.","The distribution of protein, enzyme activity, and contaminants.",`Open ${w.primary||"the primary evidence view"}.`],
    7:["Select which material to retain.","The most active fraction is not always the purest choice.","The purity–recovery tradeoff among possible retained samples.","Select material, review the pool tradeoff, and create the pool."],
    8:["Evaluate the retained sample.","A successful operation must justify target loss, cost, and time.","Changes in specific activity, purity, yield, and remaining limitations.","Open the Purification Table."],
    9:["Choose the next scientific goal.","The strongest remaining limitation should drive the next operation.","Whether salt, complexity, purity, or recovery now limits the strategy.","Choose analyze, condition, purify, compare, or finish."]
  }[w.phase];
  return {workflow:w,current:copy[0],why:copy[1],reveals:copy[2],next:copy[3]};
}
