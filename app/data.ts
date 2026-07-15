export type Protein = { id:string; name:string; mass:number; pI:number; initialMass:number; specificActivity:number; precip:[number,number]; abundance:number; color:string };
export type Method = { id:string; name:string; group:string; property:string; purpose:string; cost:string; time:string; status:"Functional"|"Planned" };

export const proteins: Protein[] = [
  {id:"enzyme-a",name:"Enzyme A",mass:62,pI:5.4,initialMass:120,specificActivity:82,precip:[45,65],abundance:12,color:"#16a394"},
  {id:"chaperonin",name:"Chaperonin C",mass:60,pI:4.8,initialMass:195,specificActivity:0,precip:[55,76],abundance:19.5,color:"#64748b"},
  {id:"ribosomal",name:"Ribosomal protein R",mass:18,pI:9.2,initialMass:245,specificActivity:0,precip:[28,48],abundance:24.5,color:"#8291a3"},
  {id:"dehydrogenase",name:"Dehydrogenase D",mass:38,pI:5.6,initialMass:165,specificActivity:0,precip:[42,61],abundance:16.5,color:"#99a6b5"},
  {id:"porin",name:"Porin P",mass:35,pI:7.1,initialMass:100,specificActivity:0,precip:[65,84],abundance:10,color:"#b2bcc7"},
  {id:"ferredoxin",name:"Ferredoxin F",mass:12,pI:4.6,initialMass:70,specificActivity:0,precip:[38,58],abundance:7,color:"#c5ccd4"},
  {id:"protease",name:"Protease Q",mass:66,pI:8.0,initialMass:60,specificActivity:0,precip:[50,72],abundance:6,color:"#d2d7dd"},
  {id:"regulator",name:"Regulator X",mass:58,pI:5.2,initialMass:45,specificActivity:0,precip:[48,68],abundance:4.5,color:"#e0e3e7"},
];

export const methods: Method[] = [
  {id:"clarify",name:"Clarification",group:"Sample preparation",property:"Solubility & size",purpose:"Remove cells and insoluble debris.",cost:"$",time:"20 min",status:"Planned"},
  {id:"heat",name:"Heat treatment",group:"Sample preparation",property:"Thermal stability",purpose:"Precipitate less stable proteins.",cost:"$",time:"45 min",status:"Planned"},
  {id:"salt",name:"Ammonium sulfate",group:"Sample preparation",property:"Solubility",purpose:"Enrich proteins by differential precipitation.",cost:"$",time:"75 min",status:"Functional"},
  {id:"dialysis",name:"Dialysis / desalting",group:"Sample preparation",property:"Molecular size",purpose:"Exchange buffer and remove small solutes.",cost:"$",time:"3 h",status:"Planned"},
  {id:"iex",name:"Ion exchange",group:"Chromatography",property:"Net charge",purpose:"Separate proteins by charge at a chosen pH.",cost:"$$",time:"2 h",status:"Functional"},
  {id:"sec",name:"Size exclusion",group:"Chromatography",property:"Molecular size",purpose:"Separate proteins by hydrodynamic size.",cost:"$$$",time:"3 h",status:"Functional"},
  {id:"hic",name:"Hydrophobic interaction",group:"Chromatography",property:"Hydrophobicity",purpose:"Resolve exposed hydrophobic surfaces.",cost:"$$",time:"2.5 h",status:"Planned"},
  {id:"affinity",name:"Affinity",group:"Chromatography",property:"Ligand specificity",purpose:"Capture proteins with selective binding.",cost:"$$$$",time:"2 h",status:"Planned"},
  {id:"gel",name:"1D SDS-PAGE",group:"Analysis",property:"Molecular mass",purpose:"Inspect protein complexity and abundance.",cost:"$$",time:"90 min",status:"Functional"},
  {id:"assay",name:"Enzyme activity assay",group:"Analysis",property:"Catalytic activity",purpose:"Locate active target across fractions.",cost:"$",time:"30 min",status:"Functional"},
  {id:"twod",name:"2D PAGE",group:"Analysis",property:"pI + molecular mass",purpose:"Resolve complex mixtures in two dimensions.",cost:"$$$$",time:"6 h",status:"Planned"},
];

export const initialMasses = Object.fromEntries(proteins.map(p=>[p.id,p.initialMass]));
