/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-12-13 11:30:29
 * @Description: file content
 */
class IBLUtil {


static createCubeCamera(w,h,layer,type){
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
 
 
 static createRenderSphere(params,entiParams){
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

   static createRadianceCamera(envMat,smesh,w,h,envLayer,scene){
      var cubeCam = IBLUtil.createCubeCamera(w,h,envLayer);
      cubeCam.renderTarget.hasMipMap = true;
      scene.addCamera(cubeCam);
      var envSphere = IBLUtil.createRenderSphere(
         { scene:scene,envCam:cubeCam,layer:envLayer,namePrefix:"cube_rad"},
         {mesh:smesh,material:envMat});
      scene.addEntity(envSphere);
      return cubeCam;
   }

}