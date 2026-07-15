export type TutorialStep={id:string;title:string;goal:string;prompt:string};
export const tutorialOne={
 id:"find-enzyme-a",title:"Find Enzyme A",duration:"15–20 min",
 steps:[
  {id:"meet",title:"Meet the Sample",goal:"Read a crude lysate as a quantitative starting point.",prompt:"Which metric best combines enzyme activity with the amount of protein present?"},
  {id:"property",title:"Choose a Property",goal:"Connect molecular size to size-exclusion chromatography.",prompt:"Which physical property can SEC use to separate these proteins?"},
  {id:"predict",title:"Predict Separation",goal:"Predict elution order and recognize likely overlap.",prompt:"What should elute first, and what limits the separation?"},
  {id:"find",title:"Find Enzyme A",goal:"Use activity evidence—not protein alone—to locate the target.",prompt:"Can the protein trace alone identify Enzyme A?"},
  {id:"pool",title:"Pool Fractions",goal:"Balance purity against recovery before making a pool.",prompt:"What happens when the pool is made narrower?"},
  {id:"evaluate",title:"Evaluate Result",goal:"Use gels and purification metrics to defend a conclusion.",prompt:"What conclusion is supported by the evidence?"},
 ] satisfies TutorialStep[]
};
