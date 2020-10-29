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

function createCubeCamera(w,h,layer){
   var rt = new RenderTexture("Camera",w,h,TextureType.cube);
   rt.elType =TextureElemType.float;
   rt.hasMipMap =false;
   var cam = CameraUtil.createDefaultCamera(w/h);
   var n =0.1;
   cam.setFov(90);
   cam.setNear(n);
   cam.clearColor = [1.0,0.0,0.0,1.0];
   cam.transform.setPosition(0,0,0);
   cam.renderTarget = rt;
   cam.renderMask = RenderMask.layers;
   cam.addRenderLayer(layer);
   return cam;
}


function createRenderSphere(params,entiParams){
   var scene = params.scene;
   var envCam = params.envCam;
   var layer = params.layer;
   var pos = params.pos;
   var namePrefix = params.namePrefix;
   var reqCam = params.reqCam;
   if(namePrefix === undefined){
      namePrefix = "dft";
   }
   if(pos === undefined){
      pos = new Vector3(0,0,0);
   }
   if(layer === undefined || scene === undefined  || envCam === undefined){
      console.log("we need information of layer, scene, envCam");
      return;
   }


   var spName = namePrefix +"entity";
   var sp = SceneUtil.createEntity(scene,spName,entiParams);
   envCam.name =namePrefix+"Cam";
   envCam.renderTarget.name=namePrefix+"Tex";
   sp.material.name= namePrefix+"Mat";
   sp.finishShot = false;
   sp.setRenderLayer(layer);

   sp.transform.setPosition(pos.x,pos.y,pos.z);
  envCam.transform.setPosition(pos.x,pos.y,pos.z);
  var state = {loaded:false,startShot:false};
  sp.material.loadedCallBack = function(e){
      state.loaded = true;
      console.log("material prepared>>>",sp.material.name);
  };
  envCam.afterDrawFunc = function(entities){
      if(state.loaded){
         if(envCam.renderTarget.currentFace ===0){
            state.startShot = true;
            console.log("start take shot >>>",envCam.name);
         }
         var otherReq = true;
         if(reqCam !==undefined){
            otherReq = reqCam.finishShot;
         }
         if(otherReq&&state.startShot&&
            envCam.renderTarget.currentFace === 5){
               envCam.enable = false;
               envCam.finishShot = true;
               console.log("close camera>>>",envCam.name);
               if(!MathUtil.isNone(envCam.next)){
                  envCam.next.enable = true;
                  console.log("open camera>>>",envCam.next.name);
               }
         }
       
      }
  };
  return sp;
   
}


function initScene(){
   //step1 default scene
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.camera.renderMask = RenderMask.layers;
    ds.camera.addRenderLayer(RenderLayer.default);
    ds.scene.ambientLight = new Vector3(0.1,0.1,0.1);
    //step2 light
    var lt = ds.dirLight;
    var intes = 0.0;
    lt.color = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    lt.specular = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    var smesh = MeshUtil.createSphere(2.0,50,50,true);

    // step3 : render sphere Hdr to cube
   var envLayer = RenderLayer.default+2;
   var cubeCam = createCubeCamera(w,h,envLayer);
   ds.scene.addCamera(cubeCam);
   var spMap = "../pics/sphericalMap/Brooklyn_Bridge.hdr";
   //var spMap = "../pics/sphericalMap/env.hdr";
    // var spMap = "../pics/sphericalMap/room1.png";
   var envSphere = createRenderSphere(
      {scene:ds.scene,envCam:cubeCam,layer:envLayer,namePrefix:"cube"},
      {texture0:spMap,receiveLight:false,
         cullFace:"FRONT"});
   ds.scene.addEntity(envSphere);


 
   // step4 :render iradiance from envcube to iradianceMap
   var iradLayer = RenderLayer.default +3;
   var iradCam = createCubeCamera(w,h,iradLayer);
   iradCam.clearColor = [0.0,1.0,0.0,1.0];
   ds.scene.addCamera(iradCam);

   var  bm = MeshUtil.createBox(1,1,1);
   var iradSp = createRenderSphere(
      {scene:ds.scene,envCam:iradCam,layer:iradLayer,
         reqCam:cubeCam,namePrefix:"irad"},
      {mesh:bm,cubeMap:cubeCam.renderTarget,calRadiance:true,
      receiveLight:false, cullFace:"FRONT"});
   ds.scene.addEntity(iradSp);

    // set camera enable order
      cubeCam.next = iradCam;
      iradCam.enable = false;
      ds.camera.enable = false;
      iradCam.next = ds.camera;

//ds.camera.transform.setPosition(0,0,0);

     //   var radUrl= "../pics/sphericalMap/Brooklyn_Bridge.hdr";
//   var specLayer = RenderLayer.default+3;
//   var specCam = createCubeCamera(w,h,specLayer);
// ds.scene.addCamera(specCam);
// var specSphere = createEnvSphere(ds.scene,specCam,specLayer,radUrl);
//  ds.scene.addEntity(specSphere);
     
      // radianceMap:specCam.renderTarget,lutMap:ibllut,
      
      //step5 render sphere to main camera
      var tf = 0.00;
      var diff = new Vector3(1.0*tf,1.0*tf,1.0*tf);
      var pf_spec = "../pics/sky1_radiance/";
      var ibllut = pf_spec+"brdf.png";
     // var folder = "../pics/rusticMetal1/";
      //var folder = "../pics/steelplate1/";
     var folder ="../pics/modern-brick1/";
      //var folder = "../pics/streaked-metal1/";
       var baseUrl = folder+"albedo.png";
       var metalUrl = folder+"metallic.png";
       var roughUrl = folder+"roughness.png";
       var normalUrl = folder +"normal.png";
       var aoUrl = folder+"ao.png"; 

       var envMap1 =createCubeUrls("../pics/sky1_irradiance/",".hdr");
   //normalMap:normalUrl,
   //metalMap:metalUrl,roughMap:roughUrl,
      var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
      {mesh:smesh,receiveLight:true,receiveShadow:false,diffuse:diff,
         texture0:baseUrl,PBR:true,normalMap:normalUrl,
         metalMap:metalUrl,roughMap:roughUrl,
         irradianceMap:iradCam.renderTarget,

         gammaCorrect:true
         });
       
   ds.scene.addEntity(enti1);
   enti1.material.name="sphereMat";
   enti1.material.loadedCallBack = function(){
      console.log("material prepared ::>>",enti1.material.name);
   }
  

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
var tf = enti1.transform;
var m1 = TransformAni(ds.scene,tf,{
        targets: tf.rot,
        y: 360,
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



