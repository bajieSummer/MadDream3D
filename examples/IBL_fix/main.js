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

function createCubeCamera(w,h,layer,type){
   if(type === undefined){
      type = TextureType.cube;
   }
   var rt = new RenderTexture("Camera",w,h,type);
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
  if(sp.material.texList.length ===0){
     state.loaded = true;
  }
  sp.material.loadedCallBack = function(e){
      state.loaded = true;
      console.log("material prepared>>>",sp.material.name);
  };
  envCam.afterDrawFunc = function(context,entities){
      if(state.loaded&& envCam.renderTarget.type ===TextureType.cube){
         var otherReq = true;
         if(envCam.drawMips){
            if(envCam.renderTarget.currentMip ===0){
               state.startShot = true;
               console.log("start take shot >>>",envCam.name);
            }
            if(reqCam !==undefined){
               otherReq = reqCam.finishShot;
            }
            if(state.startShot){
               var mipRough = envCam.renderTarget.currentMip/envCam.renderTarget.mipCount;
               window.specMat.setUniform("roughness",UTypeEnumn.float,mipRough);
               console.log("setCurrentMipRough>>",mipRough);
            }
            if(otherReq&&state.startShot&&
               envCam.renderTarget.currentMip === envCam.renderTarget.mipCount){
                  envCam.enable = false;
                  envCam.finishShot = true;
                  envCam.renderTarget.generateMipMap(context);
                  console.log("close camera>>>",envCam.name);
                  if(!MathUtil.isNone(envCam.next)){
                     envCam.next.enable = true;
                     console.log("open camera>>>",envCam.next.name);
                  }
            }
         }else{
            if(envCam.renderTarget.currentFace ===0){
               state.startShot = true;
               console.log("start take shot >>>",envCam.name);
            }
            
            if(reqCam !==undefined){
               otherReq = reqCam.finishShot;
            }
            if(otherReq&&state.startShot&&
               envCam.renderTarget.currentFace === 5){
                  envCam.enable = false;
                  envCam.finishShot = true;
                  envCam.renderTarget.generateMipMap(context);
                  console.log("close camera>>>",envCam.name);
                  if(!MathUtil.isNone(envCam.next)){
                     envCam.next.enable = true;
                     console.log("open camera>>>",envCam.next.name);
                  }
            }
         }
         
       
      }
      if(state.loaded&&envCam.renderTarget.type === TextureType.default){
         var otherReq2d = true;
         if(reqCam !==undefined){
            otherReq2d = reqCam.finishShot;
         }
         if(otherReq2d &&state.startShot){
            envCam.enable = false;
            envCam.finishShot = true;
     
            console.log("close camera>>>",envCam.name);
            if(!MathUtil.isNone(envCam.next)){
               envCam.next.enable = true;
               console.log("open camera>>>",envCam.next.name);
            }
         }
         if(otherReq2d){
            state.startShot = true;
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
  
    ds.scene.ambientLight = new Vector3(0.0,0.0,0.0);
    //step2 light
    var lt = ds.dirLight;
    var intes = 0.0;
    lt.color = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    lt.specular = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    var smesh = MeshUtil.createSphere(2.0,100,100,true);

    // step3 : render sphere Hdr to cube
   var envLayer = RenderLayer.default+2;
   var cubeCam = createCubeCamera(w,h,envLayer);
   cubeCam.renderTarget.hasMipMap = true;
   ds.scene.addCamera(cubeCam);
  // var spMap = "../pics/sphericalMap/Brooklyn_Bridge.hdr";
   //var spMap = "../pics/sphericalMap/env.hdr";
    // var spMap = "../pics/sphericalMap/room1.png";
   // var envSphere = createRenderSphere(
   //    {scene:ds.scene,envCam:cubeCam,layer:envLayer,namePrefix:"cube"},
   //    {texture0:spMap,receiveLight:false,
   //       cullFace:"FRONT"});
   //  ds.scene.addEntity(envSphere);
    var sm = MeshUtil.createBox(50,50,50);
   var spMap = createCubeUrls("../pics/pisaHDR/",".hdr");
 var envSphere = createRenderSphere(
      { scene:ds.scene,envCam:cubeCam,layer:envLayer,namePrefix:"cube"},
      {mesh:sm,cubeMap:spMap,receiveLight:false,
         cullFace:"FRONT"});
         ds.scene.addEntity(envSphere);

         //add sky

        var sky = SceneUtil.createEntity(ds.scene,"sky",
         {mesh:sm,cubeMap:cubeCam.renderTarget,receiveLight:false,
            cullFace:"FRONT",gammaCorrect:true});
            ds.scene.addEntity(sky);
 
   //step4 :render iradiance from envcube to iradianceMap
   var iradLayer = RenderLayer.default +3;
   var iradCam = createCubeCamera(w,h,iradLayer);
   iradCam.clearColor = [0.0,1.0,0.0,1.0];
   ds.scene.addCamera(iradCam);
   var  bm = MeshUtil.createBox(10,10,10);
   var iradSp = createRenderSphere(
      {scene:ds.scene,envCam:iradCam,layer:iradLayer,
         reqCam:cubeCam,namePrefix:"irad"},
      {mesh:bm,cubeMap:cubeCam.renderTarget,calRadiance:true,
      receiveLight:false, cullFace:"FRONT"});
   ds.scene.addEntity(iradSp);

   //step5 :brdf layer
   var brdfLayer = RenderLayer.default +4;
   var brdfCam = createCubeCamera(w,h,brdfLayer,TextureType.default);
   brdfCam.clearColor = [0.0,0.0,1.0,1.0];
   ds.scene.addCamera(brdfCam);
   var brdfEnti = createRenderSphere({
      scene:ds.scene,envCam:brdfCam,layer:brdfLayer,
         namePrefix:"brdf"
   },{mesh:bm,cullFace:"FRONT",calBrdf:true,
   matColor:[1.0,1.0,1.0,1.0],receiveLight:false});
   ds.scene.addEntity(brdfEnti);

   var rough = 0.9;
   //step6: radianceLayer
   var radSpecLayer = RenderLayer.default+5;
   var radSpecCam = createCubeCamera(w,h,radSpecLayer);
   radSpecCam.clearColor = [0.5,0.5,1.0,1.0];
   radSpecCam.renderTarget.hasMipMap = true;
   radSpecCam.drawMips = false;
   ds.scene.addCamera(radSpecCam);
   var radEnti = createRenderSphere({
      scene:ds.scene,envCam:radSpecCam,reqCam:cubeCam,
      layer:radSpecLayer,namePrefix:"radspec"},
      {mesh:bm,cullFace:"FRONT",calIBLSpec:true,
      cubeMap:cubeCam.renderTarget,roughness:rough,receiveLight:false});
      ds.scene.addEntity(radEnti);
   window.specMat = radEnti.material;

    // set camera enable order
      //cubeCam.next = radSpecCam;
      //radSpecCam.next = ds.camera;
        cubeCam.next =iradCam;
       iradCam.next = brdfCam;
        brdfCam.next =ds.camera;
       //radSpecCam.next = ds.camera;
       //cubeCam.enable = false;
      // cubeCam.next = ds.camera;
       radSpecCam.enable = false;
       iradCam.enable = false;
       brdfCam.enable = false;
       ds.camera.enable = false;

      cubeCam.enable = true;

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
  // var folder = "../pics/steelplate1/"; //5
     //var folder ="../pics/modern-brick1/";
    //var folder = "../pics/streaked-metal1/";  //10
    // var folder ="../pics/gold/"; //10
     //var folder ="../pics/plastic/"; //5
    //var folder = "../pics/rusted_iron/";
   //var  folder = "../pics/wall/";
   var folder = "../pics/ornate-brass3/";
       var baseUrl = folder+"albedo.png";
       var metalUrl = folder+"metallic.png";
       var roughUrl = folder+"roughness.png";
       var normalUrl = folder +"normal.png";
       var aoUrl = folder+"ao.png"; 

       var envMap1 =createCubeUrls("../pics/sky1_irradiance/",".hdr");
   //texture0:baseUrl, normalMap:normalUrl,metalMap:metalUrl,roughMap:roughUrl,
   //
   //0.93, 0.91, 0.81
    //var enti1 = SceneUtil.createEntity(ds.scene,"sphere",{receiveLight:false});
      // var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
      // {mesh:smesh,receiveLight:true,receiveShadow:false,diffuse:diff,
      //    PBR:true,
      //    matColor:[0.93, 0.91, 0.81,1.0],roughness:0.0,metalness:0.0,
      //    irradianceMap:iradCam.renderTarget,radianceMap:cubeCam.renderTarget,
      //    lutMap:brdfCam.renderTarget,gammaCorrect:true,hdrExposure:1.0
      //    });
       //  ds.scene.addEntity(enti1);
        //    enti1.transform.scale(0.7,0.7,0.7);
         //  enti1.transform.setPosition(-1.5,0.0,0.0);
          
           

        // enti1.material.name="sphereMat";
        //radianceMap:radSpecCam.renderTarget,linearMip:true,

         var enti2 =SceneUtil.createEntity(ds.scene,"sphere",
      {mesh:smesh,receiveLight:true,receiveShadow:false,diffuse:diff,
        PBR:true,
         texture0:baseUrl,metalMap:metalUrl,roughMap:roughUrl,normalMap:normalUrl,
         irradianceMap:iradCam.renderTarget,radianceMap:cubeCam.renderTarget,
         lutMap:brdfCam.renderTarget,gammaCorrect:true,hdrExposure:1.0,aoMap:aoUrl,
         });
         ds.scene.addEntity(enti2);
        // enti2.transform.scale(0.7,0.7,0.7);
         // enti2.transform.setPosition(1.5,0.0,0.0);
         
      // var enti1 =SceneUtil.createEntity(ds.scene,"sphere",{
      //    receiveLight:true,envMap:radSpecCam.renderTarget,reflective:1.0,gammaCorrect:true
      // });
      // ds.camera.transform.setPosition(0,0,0);
      // var cm = MeshUtil.createPlane(5,5,0.0);
      // var enti1 = SceneUtil.createEntity(ds.scene,"sphere",{
      //    mesh:bm,
      //    texture0:brdfCam.renderTarget,receiveLight:false,gamaCorrect:true,
      //    hdrExposure:1.0
      // });
   
     
   
   // enti1.material.loadedCallBack = function(){
   //    console.log("material prepared ::>>",enti1.material.name);
   // };

      var chooseEnti =enti2;
      document.getElementById("myRange").addEventListener("input",function(evt){
         //console.log(this.value);
         chooseEnti.material.setUniform("metalness",UTypeEnumn.float,this.value*0.01);
   
      });
      document.getElementById("myRange2").addEventListener("input",function(evt){
         //console.log(this.value);
         chooseEnti.material.setUniform("roughness",UTypeEnumn.float,this.value*0.02);
   
      });
      document.getElementById("sp1_exposure").addEventListener("input",function(evt){
         //console.log(this.value);
         chooseEnti.material.setUniform("hdrExposure",UTypeEnumn.float,this.value*0.04);
   
      });
   //    var matDicts = {};
   //    var whiteMat = SceneUtil.createMaterial(ds.scene,{receiveLight:true,receiveShadow:false,diffuse:diff,
   //       PBR:true,
   //       matColor:[0.93, 0.91, 0.81,1.0],roughness:0.0,metalness:0.0,
   //       irradianceMap:iradCam.renderTarget,radianceMap:cubeCam.renderTarget,
   //       lutMap:brdfCam.renderTarget,gammaCorrect:true,hdrExposure:1.0});
   //       matDicts["white"] = whiteMat;
      
   //    var matSl = document.getElementById("slectMat");
   //    matSl.addEventListener('change',function(){
   //      //ctxDraw.strokeWidth = (this.value);
   //      console.log(this.value);
        
   //  });
  

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
var tf = enti2.transform;
var m1 = TransformAni(ds.scene,tf,{
        targets: tf.rot,
        y: 360,
        duration: 10000,
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



