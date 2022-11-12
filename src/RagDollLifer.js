import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";
import * as BABYLON from 'babylonjs';
const SMALL=0.0000001;

function thetaPhiCalculator(v){
  v.x+=SMALL;
  v.y+=SMALL;
  v.z+=SMALL;
  const theta = Math.atan2(v.y,v.x);
  return[
    theta < 0 ?  2*Math.PI+theta : theta ,
    Math.asin(v.z/Math.sqrt(v.x**2+v.y**2+v.z**2))
  ]
}
function thetaPhiToEuclidean(r,theta,phi){
  return new BABYLON.Vector3(
    r*Math.cos(theta)*Math.cos(phi),
    r*Math.sin(theta)*Math.cos(phi),
    r*Math.sin(phi)
  );
}
export class RagDollBuilder {
  constructor (scene,name,pairsOfBones,connections,modelPath)
  {
    this.name = name;
    this.pairsOfBones = pairsOfBones;
    this.connections  = connections;
    this.modelPath    = modelPath;
    this.scene = scene;
  
  }
  buildPair(pair)
  {
    const skeleton = this.skeleton;
    const boneIndexA = skeleton.getBoneIndexByName(pair[0]);
    const boneIndexB = skeleton.getBoneIndexByName(pair[1]);
    if (boneIndexA <0 || boneIndexB < 0){
      throw `Some of this bones are invalid ${pair.toString()}`;
    }
    const boneA = skeleton.bones[boneIndexA]
    const boneB = skeleton.bones[boneIndexB]

    var faceColors = new Array(6).fill(
      new BABYLON.Color4(Math.random(),Math.random(),Math.random(),1))

    const box=BABYLON.MeshBuilder.CreateBox("ARM",{
      size   : pair.length > 2 ? pair[2] : 0.1,
      height : pair.length > 3 ? pair[3] : 0.1,
      width  :1,
      faceColors : faceColors
    });
    const posB  = boneB.getAbsolutePosition();
    const posA  = boneA.getAbsolutePosition();

    const diff  = posB.subtract(posA);
    const dist  = BABYLON.Vector3.Distance(posA,posB);

    box.scaling._x = dist-dist*0.1;

    const rot = thetaPhiCalculator(diff)
    const mid = thetaPhiToEuclidean(dist/2.0,rot[0],rot[1]);

    box.setAbsolutePosition(
      boneA.getAbsolutePosition().add(mid));
    box.rotation._x = rot[1];
    box.rotation._z = rot[0];
  }

  build()
  {
    SceneLoader.ImportMesh("",...this.modelPath, this.scene, 
      (newMeshes, particleSystems, skeletons)=> {
        const skeleton = skeletons[0];
        this.skeleton = skeleton;
        this.pairsOfBones.forEach((pair)=>this.buildPair(pair));
      });
  }
}

