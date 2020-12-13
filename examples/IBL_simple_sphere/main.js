/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-11-13 21:04:12
 * @Description: file content
 */
function createCubeUrls(pf,et){
   var envMap = [pf+"posx"+et,pf+"negx"+et,pf+"posy"+et,
   pf+"negy"+et,pf+"posz"+et,pf+"negz"+et
   ];
   return envMap;
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

   if(key.indexOf(".")>0){
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
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.camera.renderMask = RenderMask.layers;
    ds.camera.addRenderLayer(RenderLayer.default);
   
    //step2 light
    ds.scene.ambientLight = new Vector3(0.0,0.0,0.0);
    var lt = ds.dirLight;
    var intes = 0.0;
    lt.color = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    lt.specular = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    var smesh = MeshUtil.createSphere(2.0,100,100,true);

    // step3 : render sphere Hdr to cube
   ds.scene.envMatDict = {};
   var envMat = getEnvMat(ds.scene,"Brooklyn_Bridge.hdr",ds.scene.envMatDict);
   var envLayer = RenderLayer.default+2;
   var cubeCam = IBLUtil.createRadianceCamera(envMat,smesh,w,h,envLayer,ds.scene);
   ds.scene.currentEnvMap = cubeCam.renderTarget;
        
   //add sky
   var skycube =  MeshUtil.createBox(20,20,20);
   var sky = SceneUtil.createEntity(ds.scene,"sky",
      {mesh:skycube,cubeMap:ds.scene.currentEnvMap,receiveLight:false,
      cullFace:"FRONT",gammaCorrect:true});
   ds.scene.addEntity(sky);
      
   //set CameraOrder
   cubeCam.next =ds.camera;
   ds.camera.enable = false;
   cubeCam.enable = true;

   
   //step5 render object-sphere to main camera
   ds.scene.matDicts = {};
   var mat = getPBRMat(ds.scene,"white",ds.scene.matDicts);
   var enti1 =SceneUtil.createEntity(ds.scene,"sphere",{mesh:smesh,
               material:mat});
   ds.scene.addEntity(enti1);
   enti1.transform.setPosition(-1.3,0,0);
   enti1.transform.resetScale(0.6,0.6,0.6);

   var mat2 = getPBRMat(ds.scene,"gold",ds.scene.matDicts);
   var enti2 =SceneUtil.createEntity(ds.scene,"sphere",{mesh:smesh,
               material:mat2});
   ds.scene.addEntity(enti2);
   enti2.transform.setPosition(1.3,0,0);
   enti2.transform.resetScale(0.6,0.6,0.6);

      
    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
   var tf = enti2.transform;
   var m1 = TransformAni(ds.scene,tf,{
         targets: tf.rot,
         y: 360,
         duration: 20000,
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


