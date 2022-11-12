import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";
import * as BABYLON from 'babylonjs';
const SMALL=0.0000001;

function calcOrientation(v){
  v.x+=SMALL;
  v.y+=SMALL;
  v.z+=SMALL;
  const theta = Math.atan2(v.y,v.x);
  return[
    theta < 0 ?  2*Math.PI+theta : theta ,
    Math.asin(v.z/Math.sqrt(v.x**2+v.y**2+v.z**2))
  ]
}
function Euclidean(r,theta,phi){
  return new BABYLON.Vector3(
    r*Math.cos(theta)*Math.cos(phi),
    r*Math.sin(theta)*Math.cos(phi),
    r*Math.sin(phi)
  );
}

export default function LoadRagdollDemo(scene){
  SceneLoader.ImportMesh("", "../models/", "Testia.glb", scene, function (newMeshes, particleSystems, skeletons) {

    var skeleton = skeletons[0];
    const boneIndexA = skeleton.getBoneIndexByName("J_Sec_R_Bust1");
    const boneA = skeleton.bones[boneIndexA]

    const boneIndexB = skeleton.getBoneIndexByName("J_Sec_R_Bust2");
    const boneB = skeleton.bones[boneIndexB]

    var faceColors = new Array(6).fill(new BABYLON.Color4(0,1,0,1))

    const box=BABYLON.MeshBuilder.CreateBox("ARM",{
      size   :0.1,
      height :0.1,
      width  :1,
      faceColors : faceColors
    });
    const posB  = boneB.getAbsolutePosition();
    const posA  = boneA.getAbsolutePosition();

    const diff  = posB.subtract(posA);
    const dist  = BABYLON.Vector3.Distance(posA,posB);

    box.scaling._x = dist;

    const rot = calcOrientation(diff)
    const mid = Euclidean(dist/2.0,rot[0],rot[1]);

    console.log("midddle",mid)
    box.setAbsolutePosition(
      boneA.getAbsolutePosition().add(mid));
    box.rotation._x = rot[1];
    box.rotation._z = rot[0];
    console.log("rotations",rot)
 
  });
}

