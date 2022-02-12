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
function initScene(){
   //default scene
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.scene.ambientLight = new Mad3D.Vector3(0.1,0.1,0.1);
    //light
    var lt = ds.dirLight;
    lt.color = new Mad3D.Vector3(2.0,2.0,2.0);
    //lt.color = new Vector3(5.0,5.0,5.0);
    lt.specular = new Mad3D.Vector3(1.5,1.5,1.5);
   var skybox = Mad3D.SceneUtil.createSkyBox(ds.scene);
   ds.scene.addEntity(skybox); 
   var gl = ds.scene.gl;       
   var w = gl.canvas.width; var h = gl.canvas.height;
   //h = w;
  // w = 512.0;h =512.0;
   var rt = new Mad3D.RenderTexture("Camera",w,h,Mad3D.TextureType.cube);
   /**@type {Camera} */
   var cam = Mad3D.CameraUtil.createDefaultCamera(w/h);
   var n = 10.0;
   cam.setFov(90);
   cam.setNear(n);
   cam.clearColor = [1.0,0.0,0.0,1.0];
   cam.transform.setPosition(0,0,0);
   cam.renderTarget = rt;
   ds.scene.addCamera(cam);
   cam.renderMask = Mad3D.RenderMask.layers;
   cam.addRenderLayer(Mad3D.RenderLayer.default);
   var skyfolder = "../pics/cube/bridge/";
   var skyEnv = createCubeUrls(skyfolder,".jpg");

   var boxMesh1 = Mad3D.MeshUtil.createBox(10,10*w/h,0.5);
   //var boxMesh1 = MeshUtil.createSphere(1.5,50,50);
   var box = Mad3D.SceneUtil.createEntity(ds.scene,"box",{
      envMap:rt,reflective:1.0,mesh:boxMesh1,receiveLight:true
   });
   box.transform.setPosition(0,0,-10);
   var tc = ds.camera.transform.pos;
   tc = box.transform.pos;
   cam.transform.setPosition(tc.x,tc.y,tc.z-n);
   ds.scene.addEntity(box);
   box.renderLayer = Mad3D.RenderLayer.default+2;

   var boxMesh = Mad3D.MeshUtil.createBox(1,1,1);
   var box2 = Mad3D.SceneUtil.createEntity(ds.scene,"box",{
      matColor:[0.7,0.2,0.3,1.0],mesh:boxMesh
   });
   box2.transform.setPosition(-3,0,-3);
   ds.scene.addEntity(box2);


      // var iw = 3.0;
      // var ratio = 512.0/768.0;
      // var ih = iw*1.5;
      var smesh = Mad3D.MeshUtil.createSphere(1.2,50,50);
     
      var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"sphere",
      {matColor:[0.97, 0.6, 0.91,1.0], mesh:smesh,receiveLight:true,receiveShadow:false,envMap:skyEnv,reflective:0.8
         });
   ds.scene.addEntity(enti1);
  

    //interaction
   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
var tf = box2.transform;
var m1 = Mad3D.TransformAni(ds.scene,tf,{
        targets: tf.pos,
        z: -10,
        duration: 5000,
        direction: 'alternate',
        loop: -1,
        easing: 'linear',
        autoplay:true,
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



