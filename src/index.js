import { Scene, 
         Engine, 
         FreeCamera,
         HemisphericLight ,
         Vector3,
         } from 'babylonjs';
import BuildDemoRagDoll from  './RagDollLiferDemo';

var canvas = document.getElementById('viewport');
var engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
var camera;

var createScene =  async function(){
  var scene = new Scene(engine);
  scene.enablePhysics();
  camera = new FreeCamera('camera1', new BABYLON.Vector3(0, 2.5, 3), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, false);
  scene.mainCamera = camera;
  var light = new HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  BuildDemoRagDoll(scene);
  return scene;
}
createScene().then((scene)=>{
  engine.runRenderLoop(function(){
    scene.render();
  });
  window.addEventListener('resize', function(){
    engine.resize();
  });
})
