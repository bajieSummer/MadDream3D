/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
 * @Description: file content
 */
function norml(start,end,value){
   if(value<start){
      return start;
   }
   if(value >end){
      return end;
   }
   return value*(end-start)+start;
}

function createCubeUrls(pf,et){
   var envMap = [pf+"posx"+et,pf+"negx"+et,pf+"posy"+et,
   pf+"negy"+et,pf+"posz"+et,pf+"negz"+et
   ];
   return envMap;
}

function createCubeCamera(w,h){
   var rt = new RenderTexture("Camera",w,h,TextureType.cube);
   var cam = CameraUtil.createDefaultCamera(w/h);
   var n = 10.0;
   cam.setFov(90);
   cam.setNear(n);
   cam.clearColor = [1.0,0.0,0.0,1.0];
   cam.transform.setPosition(0,0,0);
   cam.renderTarget = rt;
   cam.renderMask = RenderMask.layers;
   cam.addRenderLayer(RenderLayer.default);
   return cam;
}

function initScene(){
   //default scene
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.scene.ambientLight = new Vector3(0.1,0.1,0.1);
    //light
    var lt = ds.dirLight;
    lt.color = new Vector3(2.0,2.0,2.0);
    //lt.color = new Vector3(5.0,5.0,5.0);
    lt.specular = new Vector3(1.5,1.5,1.5);
    var skyfolder = "../pics/cube/bridge/";
    var skyEnv = createCubeUrls(skyfolder,".jpg");
   var skybox = SceneUtil.createSkyBox(ds.scene);
   ds.scene.addEntity(skybox); 
  
   // var cubeCam = createCubeCamera(w,h);
   // ds.scene.addCamera(cubeCam);
   // var boxMesh1 = MeshUtil.createBox(10,10*w/h,0.5);
   // //var boxMesh1 = MeshUtil.createSphere(1.5,50,50);
   // var box = SceneUtil.createEntity(ds.scene,"box",{
   //    envMap:cubeCam.renderTarget,reflective:1.0,mesh:boxMesh1,receiveLight:true
   // });
   // box.transform.setPosition(0,0,-10);
   // var tc = box.transform.pos;
   // cubeCam.transform.setPosition(tc.x,tc.y,tc.z-cubeCam.getNear());
   // ds.scene.addEntity(box);
   // box.renderLayer = RenderLayer.default+2;
   // matColor:[0.7,0.2,0.3,1.0]
  // var spMap = "../pics/sphericalMap/Brooklyn_Bridge.hdr";
   var spMap = "../pics/sphericalMap/room1.png";
   var boxMesh = MeshUtil.createSphere(1,50,50);
   var box2 = SceneUtil.createEntity(ds.scene,"box",{
     rectSphereMap:spMap,mesh:boxMesh,receiveLight:false
   });
  // box2.transform.setPosition(-3,0,-3);
   ds.scene.addEntity(box2);


      // var iw = 3.0;
      // var ratio = 512.0/768.0;
      // var ih = iw*1.5;
   //    var smesh = MeshUtil.createSphere(1.2,50,50);
     
   //    var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
   //    {matColor:[0.97, 0.6, 0.91,1.0], mesh:smesh,receiveLight:true,receiveShadow:false,envMap:skyEnv,reflective:0.8
   //       });
   // ds.scene.addEntity(enti1);
  

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
var tf = box2.transform;
var m1 = TransformAni(ds.scene,tf,{
        targets: tf.pos,
        z: -10,
        duration: 5000,
        direction: 'alternate',
        loop: -1,
        easing: 'linear',
        autoplay:false,
        update: function(anim) {
        }
});

   return ds.scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



