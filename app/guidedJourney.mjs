export const investigations = {
  "investigation-solubility": {
    id:"investigation-solubility",tutorialId:"tutorial-1",number:1,
    title:"Can differences in solubility enrich Enzyme A?",concept:"Differential precipitation",
    methodIds:["salt"],nextInvestigationId:"investigation-charge",
    learningGoals:["Predict partitioning from solubility","Use activity to locate Enzyme A","Evaluate enrichment and recovery with orthogonal evidence"],
    conclusionPrompt:"Did differential solubility provide useful enrichment of Enzyme A?",
    orderedStages:[
      stage("inspect","Inspect sample","What constraints define the starting mixture?","Review the crude lysate metrics.","The mixture determines which protein difference may be useful.","Current Sample","Review sample"),
      stage("property","Compare properties","Which property could separate Enzyme A?","Select ammonium sulfate fractionation.","Solubility differences can partition proteins without requiring a column.","Current Sample","Select ammonium sulfate"),
      stage("configure","Configure fractionation","Which saturation cuts define the retained material?","Set lower and upper cuts and choose the retained fraction.","The cuts determine which proteins precipitate in each interval.","Current Sample","Review settings"),
      stage("predict","Predict partitioning","Where should Enzyme A partition?","Commit a prediction tied to the settings.","A prediction makes the modeled result scientifically testable.","Current Sample","Review prediction"),
      stage("run","Run fractionation","How will proteins distribute under these conditions?","Run the committed experiment.","Fractionation generates material and activity evidence.","Fractions","Run Experiment"),
      stage("fractions","Locate active Enzyme A","Which fraction recovered active target?","Inspect the fraction evidence.","Protein and activity must be compared before retaining material.","Fractions","Open Fractions"),
      stage("retain","Retain target-rich fraction","Which fraction best balances recovery and contaminant removal?","Select and pool a defensible fraction.","Retention creates the next working sample and commits the recovery tradeoff.","Fractions","Create selected pool"),
      stage("evaluate","Evaluate the purified sample","Was the solubility step useful?","Review the Purification Table.","Specific activity and yield reveal whether enrichment justified loss.","Purification Table","Evaluate retained sample"),
      stage("gel","Examine protein complexity","Did the number of major protein species decrease?","Run a crude-versus-current 1D SDS-PAGE comparison.","A gel reveals complexity and co-migration but not enzyme identity.","Gel","Continue to SDS-PAGE"),
      stage("activity","Confirm enzyme activity","Does the retained sample still contain active Enzyme A?","Review the enzyme activity assay.","Activity confirms function but cannot establish purity.","Assays","Confirm activity"),
      stage("conclusion","Draw a conclusion","Did differential solubility provide useful enrichment?","Choose a defensible conclusion and briefly justify it.","A conclusion must integrate specific activity, yield, gel, and activity evidence.","Purification Table","Record conclusion")
    ]
  },
  "investigation-charge": {
    id:"investigation-charge",tutorialId:"tutorial-2",number:2,
    title:"Can differences in charge improve the purification further?",concept:"Ion-exchange chromatography",
    methodIds:["iex"],nextInvestigationId:null,
    learningGoals:["Relate pH and pI to net charge","Predict binding to charged resin","Interpret salt-dependent elution"],
    conclusionPrompt:"Did net charge provide better separation of Enzyme A from the remaining contaminants?",
    orderedStages:[
      stage("review-retained","Review retained sample","Is the sample ready for charge separation?","Review salt, pH, and contaminants.","Ion exchange requires compatible salt and buffer conditions.","Current Sample","Review sample"),
      stage("prepare","Prepare for ion exchange","How will high ammonium sulfate affect binding?","Desalt or use a prepared compatible sample.","High ionic strength competes with protein binding to the resin.","Current Sample","Prepare sample"),
      stage("charge","Compare pH and pI","What net charge will each protein carry?","Compare buffer pH with protein pI values.","The sign and magnitude of net charge predict resin interaction.","Current Sample","Review pH and pI"),
      stage("exchanger","Choose exchanger","Which resin charge should capture the target?","Choose anion or cation exchange.","Opposite charges attract under compatible conditions.","Current Sample","Choose exchanger"),
      stage("binding-prediction","Predict binding and elution","Will Enzyme A bind, and when should it elute?","Commit a charge-based prediction.","A salt gradient weakens electrostatic interactions.","Chromatogram","Commit prediction"),
      stage("run-iex","Run ion exchange","Does net charge provide useful separation?","Run the configured chromatography model.","The chromatogram distributes protein and activity across elution.","Chromatogram","Run ion exchange"),
      stage("interpret-iex","Interpret chromatogram","Which region most likely contains active Enzyme A?","Compare protein signal with activity.","Peak overlap limits what chromatography alone can identify.","Chromatogram","Inspect chromatogram"),
      stage("locate-activity","Locate active Enzyme A","Where is active target concentrated?","Review fraction activity.","Activity anchors target location independently of protein abundance.","Assays","Review activity"),
      stage("pool-iex","Select and pool fractions","Which region balances purity and recovery?","Pool a defensible range.","Pooling determines the final recovery-versus-purity tradeoff.","Fractions","Pool fractions"),
      stage("evaluate-iex","Evaluate purification metrics","Did charge improve the sample?","Compare the purification metrics with Investigation 1.","Specific activity, yield, cost, and time support the judgment.","Purification Table","Evaluate result"),
      stage("compare","Compare investigations","Which property produced the better separation?","Compare solubility and charge evidence.","Orthogonal protein properties can solve different contaminants.","Dashboard","Compare results"),
      stage("conclusion-iex","Draw a conclusion","Did net charge improve the purification?","Record a defensible conclusion.","The conclusion integrates chromatography, activity, and purification metrics.","Purification Table","Record conclusion")
    ]
  }
};

function stage(id,title,scientificQuestion,studentAction,whyItMatters,recommendedViewId,primaryActionLabel){return {id,title,scientificQuestion,studentAction,whyItMatters,evidenceGenerated:whyItMatters,evidenceLimitations:"Use orthogonal evidence before assigning protein identity.",requiredState:id,completionRule:id,recommendedViewId,primaryActionLabel,optionalAlternativeActions:["Review Current Sample","Review purification metrics"],completionMessage:`${title} complete.`,conceptLearned:whyItMatters}}

export function deriveSolubilityStage(s){
 if(s.conclusionResponse)return "complete";
 if(s.assayReviewed)return "conclusion";
 if(s.gelReviewed)return "activity";
 if(s.evaluated)return "gel";
 if(s.pooled)return "evaluate";
 if(s.selected)return "retain";
 if(s.generated&&s.fractionsVisited)return "retain";
 if(s.generated)return "fractions";
 if(s.committed&&!s.outdated)return "run";
 if(s.configured)return "predict";
 if(s.methodChosen)return "configure";
 if(s.inspected)return "property";
 return "inspect";
}

export function journeyProgress(investigationId,state){const inv=investigations[investigationId],activeId=investigationId==="investigation-solubility"?deriveSolubilityStage(state):state.activeStageId||inv.orderedStages[0].id;const index=activeId==="complete"?inv.orderedStages.length:Math.max(0,inv.orderedStages.findIndex(x=>x.id===activeId));return {investigation:inv,activeId,index,complete:activeId==="complete",stages:inv.orderedStages.map((x,i)=>({...x,status:i<index?"complete":i===index?"current":"future"}))}}

export const conclusionOptions=[
 "Yes, the sample became substantially purer while retaining acceptable activity.",
 "Partly, the sample improved but substantial contaminants remain.",
 "No, the activity loss was too large relative to the purification gained.",
 "The evidence is insufficient."
];

export function classifySolubilityConclusion({fold,yieldPct},response){if(!response)return {defensible:false,reason:"Choose a conclusion."};const partly=response.startsWith("Partly"),yes=response.startsWith("Yes"),no=response.startsWith("No");const defensible=(partly&&fold>1&&fold<2.5)||(yes&&fold>=2&&yieldPct>=60)||(no&&(yieldPct<50||fold<=1));return {defensible:!!defensible,reason:defensible?"This conclusion is supported by the modeled enrichment and recovery.":"Reconsider the balance between purification fold and target recovery; more than one answer can be defensible when justified by the evidence."}}
