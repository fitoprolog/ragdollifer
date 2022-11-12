import {RagDollBuilder} from './RagDollLifer';

export default function BuildDemoRagDoll(scene){
  console.log("called")

  const ragDoll = new RagDollBuilder(
    scene,
    "Fulgencia",
    [
      ["J_Bip_L_UpperArm","J_Bip_L_LowerArm"],
      ["J_Bip_L_LowerArm","J_Bip_L_Hand"],
      ["J_Bip_R_UpperArm","J_Bip_R_LowerArm"],
      ["J_Bip_R_LowerArm","J_Bip_R_Hand"],
      ["J_Bip_C_UpperChest","J_Bip_C_Chest",0.22,0.2],
      ["J_Bip_C_Chest","J_Bip_C_Hips",0.22,0.3],
      
    ],
    [],
    ["../models/" ,"Testia.glb"]
  ).build();
  console.log(ragDoll)
}

