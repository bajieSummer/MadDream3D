/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
 * @Description: file content
 */

function objLoad(url,callback){
   //REQUEST FILE
   var rawFile = new XMLHttpRequest();
   rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
         if (rawFile.status === 200 || rawFile.status === 0) {
            var text = rawFile.responseText;
            callback(text);
         }
      }
   };
   rawFile.open("GET", url, true);
   rawFile.send();
}

function _changeMeshOnNextFrame(rmesh,scene,enti){
   scene.postFrameRunnable(function(){
      enti.mesh = rmesh.mesh;
      if(rmesh.key ==="sphere"){
         enti.transform.resetScale(1.0,1.0,1.0);
         enti.transform.setPosition(0,0,0);
      }else{
         if(rmesh.key === "plane.obj"){
            enti.transform.resetScale(0.005,0.005,0.005);
         }else if(rmesh.key === "banana_plant.obj"){
            enti.transform.resetScale(0.08,0.08,0.08);
         }else{
            enti.transform.resetScale(0.8,0.8,0.8);
         }
      }
    },FrameState.BeforeDraw);
}
function changeMesh(key,meshDicts,scene,enti){
   if(meshDicts[key]!==null && meshDicts[key]!==undefined && meshDicts[key].mesh!=null){
      _changeMeshOnNextFrame({mesh:meshDicts[key].mesh,key:key},
                           scene,enti);
      return;
   }
   var path ="../pics/models/" +key;
   meshDicts[key] = {mesh:null,state:-1};
   meshDicts[key].state = 0;
   meshDicts[key].mesh = null;
   // objLoad(path,function(data){
   //    var ps =new OBJParser();
   //    var ms = ps.parse(data,{scene:scene,isMesh:true});
   //    console.log("load mesh>>",key);
   //    meshDicts[key].state = 1;
   //    meshDicts[key].mesh = ms[0];
   //    console.log(ms[0]);
   //    _changeMeshOnNextFrame({mesh:ms[0],key:key},
   //       scene,enti);
   // });
   AssetsMgr.getMgr().load(path,{scene:scene,isMesh:true},function(meshes){
      meshDicts[key].state = 1;
      meshDicts[key].mesh = meshes[0];
      _changeMeshOnNextFrame({mesh:meshes[0],key:key},
                            scene,enti);
   });
}


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
 // var noTex = false;
  if(sp.material.texList.length ===0){
     noTex = true;
   }
//   sp.material.loadedCallBack = function(e){
//       state.loaded = true;
//       console.log("material prepared>>>",sp.material.name);
//   };
  envCam.afterDrawFunc = function(context,entities){
     var isLoaded = sp.material.texList.length===0 || sp.material.texPrepared;
      if(isLoaded&& envCam.renderTarget.type ===TextureType.cube){
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
               envCam.renderTarget.generateMipMap(context);
               console.log("close camera>>>",envCam.name);
               if(!MathUtil.isNone(envCam.next)){
                  envCam.next.enable = true;
                  
                  console.log("open camera>>>",envCam.next.name);
               }
               // wait for next
               state.startShot = false;
               
         }
       
      }
      if(isLoaded&&envCam.renderTarget.type === TextureType.default){
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

function __createPBRMat(scene,key){
     // var folder = "../pics/steelplate1/"; //5
     //var folder ="../pics/modern-brick1/";
    //var folder = "../pics/streaked-metal1/";  //10
    // var folder ="../pics/gold/"; //10
     //var folder ="../pics/plastic/"; //5
    //var folder = "../pics/rusted_iron/";
   //var  folder = "../pics/wall/";
   var tf = 0.00;
   var diff = new Vector3(1.0*tf,1.0*tf,1.0*tf);
   var folder = "../pics/"+key+"/";
   var baseUrl = folder+"albedo.png";
   var metalUrl = folder+"metallic.png";
   var roughUrl = folder+"roughness.png";
   var normalUrl = folder +"normal.png";
   var aoUrl = folder+"ao.png"; 
   var heightUrl = folder+"height.png";
   var tex = new Texture("Camera",1,1);
   var mat = null;
   if(key === "white"){
         mat = SceneUtil.createMaterial(scene,{receiveLight:true,receiveShadow:false,diffuse:diff,
         PBR:true,
         matColor:[0.93, 0.91, 0.81,1.0],roughness:0.0,metalness:0.0,
          radianceMap:scene.currentEnvMap,
         gammaCorrect:true,hdrExposure:1.0});
   }else{
      // tex.type = TextureType.cube;
      mat = SceneUtil.createMaterial(scene,{receiveLight:true,receiveShadow:false,diffuse:diff,
      PBR:true,
       texture0:baseUrl,metalMap:metalUrl,roughMap:roughUrl,normalMap:normalUrl,
       radianceMap:scene.currentEnvMap,
       gammaCorrect:true,hdrExposure:1.0,aoMap:aoUrl,
       });
   }

  
   return mat;
}

function getPBRMat(scene,key,matDicts){
   var mat = matDicts[key];
   if( mat=== undefined){
      mat = __createPBRMat(scene,key);
      matDicts[key] = mat;
   }
   return mat;
}

function __createEnvMat(scene,key){
   var mat = null;

   if(key.indexOf(".")>=0){
      // textures mat
      mat = SceneUtil.createMaterial(scene,{
         texture0:"../pics/sphericalMap/"+key,receiveLight:false,
         cullFace:"FRONT"
      });
   }else{
      //cube mat
      var spMap = createCubeUrls("../pics/"+key+"/",".hdr");
      mat = SceneUtil.createMaterial(scene,{cubeMap:spMap,receiveLight:false,
         cullFace:"FRONT"});
   }
   return mat;
}

function getEnvMat(scene,key,skyMatDict){
   var mat = skyMatDict[key];
   if( mat=== undefined){
      mat = __createEnvMat(scene,key);
      skyMatDict[key] = mat;
   }
  return mat;
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

   ds.scene.envMatDict = {};
   var envMat = getEnvMat(ds.scene,"pisaHDR",ds.scene.envMatDict);
 var envSphere = createRenderSphere(
      { scene:ds.scene,envCam:cubeCam,layer:envLayer,namePrefix:"cube"},
      {mesh:smesh,material:envMat});
         ds.scene.addEntity(envSphere);
         ds.scene.currentEnvMap = cubeCam.renderTarget;
        
         //add sky
      var skycube =  MeshUtil.createBox(20,20,20);
        var sky = SceneUtil.createEntity(ds.scene,"sky",
         {mesh:skycube,cubeMap:ds.scene.currentEnvMap,receiveLight:false,
            cullFace:"FRONT",gammaCorrect:true});
            ds.scene.addEntity(sky);
 
  


        cubeCam.next =ds.camera;
        ds.camera.enable = false;
       cubeCam.enable = true;

         
      
      //step5 render sphere to main camera


      ds.scene.matDicts = {};
        var mat = getPBRMat(ds.scene,"white",ds.scene.matDicts);
         var enti2 =SceneUtil.createEntity(ds.scene,"sphere",
      {mesh:smesh,material:mat
         });
         ds.scene.addEntity(enti2);


   
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
      
      var matSl = document.getElementById("slectMat");
      matSl.addEventListener('change',function(){
        //ctxDraw.strokeWidth = (this.value);
        console.log(this.value);
        var cmat = getPBRMat(ds.scene,this.value,ds.scene.matDicts);
        enti2.material = cmat;
    });

    var skySl = document.getElementById("slectSkyBox");
    skySl.addEventListener('change',function(){
      console.log(this.value);
      var mat = getEnvMat(ds.scene,this.value,ds.scene.envMatDict);
      envSphere.material = mat;
      cubeCam.enable = true;
      ds.camera.enable = false;
    });

    var meshSl = document.getElementById("slectMesh");
    ds.meshDicts = {"sphere":{mesh:smesh,state:1}};
    AssetsMgr.getMgr().registerParser("obj",OBJParser);
    meshSl.addEventListener('change',function(){
      console.log(this.value);
      changeMesh(this.value,ds.meshDicts,ds.scene,chooseEnti);
   });
  

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
var tf = enti2.transform;
// var m1 = TransformAni(ds.scene,tf,{
//         targets: tf.rot,
//         y: 360,
//         duration: 20000,
//         direction: 'alternate',
//         loop: -1,
//         easing: 'linear',
//         autoplay:true,
//         update: function(anim) {
//         }
// });

   return ds.scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



