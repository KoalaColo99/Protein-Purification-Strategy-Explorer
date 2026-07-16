export const journeyActions={
 "review-starting-sample":action("Review sample","Current Sample",null,"acknowledge-starting-sample"),
 "select-ammonium-sulfate":action("Select ammonium sulfate",null,"salt","select-method"),
 "review-fractionation-settings":action("Review settings",null,"salt","focus-prediction"),
 "commit-solubility-prediction":action("Commit prediction",null,"salt","focus-prediction"),
 "run-fractionation":action("Run Experiment",null,"salt","run-method"),
 "review-fractions":action("Review fraction evidence","Fractions",null,"review-fractions"),
 "pool-target-material":action("Create target-rich pool","Fractions",null,"pool-selection","Select a target-rich fraction before continuing."),
 "review-purification-metrics":action("Evaluate the retained sample","Purification Table",null,"review-metrics"),
 "start-sds-page":action("Continue to SDS-PAGE","Gel","gel","select-analysis"),
 "interpret-sds-page":action("Interpret the gel","Gel","gel","interpret-gel"),
 "start-activity-assay":action("Confirm activity","Assays","assay","select-analysis"),
 "interpret-activity":action("Interpret activity evidence","Assays","assay","interpret-activity"),
 "answer-solubility-conclusion":action("Record conclusion","Purification Table",null,"focus-conclusion"),
 "begin-investigation-2":action("Begin Investigation 2","Current Sample",null,"begin-investigation-2"),
 "use-prepared-compatible-sample":action("Use prepared compatible sample","Current Sample",null,"prepare-compatible-sample"),
 "review-charge-rationale":action("Why charge may help","Current Sample",null,"acknowledge-charge-rationale"),
 "review-ph-pi":action("Compare pH and pI","Current Sample",null,"acknowledge-ph-pi"),
 "choose-exchanger":action("Choose exchanger",null,"iex","focus-setup"),
 "commit-charge-prediction":action("Commit binding prediction",null,"iex","focus-prediction"),
 "configure-gradient":action("Configure salt gradient",null,"iex","focus-setup"),
 "run-ion-exchange":action("Run ion exchange",null,"iex","run-method"),
 "interpret-chromatogram":action("Interpret chromatogram","Chromatogram",null,"review-chromatogram"),
 "review-iex-activity":action("Review target activity","Assays",null,"review-iex-activity"),
 "pool-iex-target":action("Pool target-rich fractions","Fractions",null,"pool-selection"),
 "review-iex-metrics":action("Evaluate ion exchange","Purification Table",null,"review-metrics"),
 "compare-investigations":action("Compare investigations","Dashboard",null,"compare-investigations"),
 "answer-charge-conclusion":action("Record charge conclusion","Purification Table",null,"focus-conclusion")
 ,"complete-scientific-journey":action("Complete Scientific Journey","Dashboard",null,"complete-journey")
};
function action(label,targetView,targetMethod,behavior,disabledExplanation){return {id:"",label,targetView,targetMethod,behavior,prerequisite:null,completionEvent:null,disabledExplanation}}
for(const [id,value] of Object.entries(journeyActions)){value.id=id}
export function actionFor(id){return journeyActions[id]||null}
