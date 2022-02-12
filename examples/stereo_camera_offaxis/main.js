/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
 * @Description: file content
 */

function initCamera(asp,w,h,layers){
   console.log("camera,asp:",asp);
   var cam = new Mad3D.Camera();
   cam.setFov(45);
   cam.setFar(100.0);
   cam.setNear(5);
   cam.setAsp(asp);
   var rt = new Mad3D.RenderTexture("Camera",w,h);
   cam.renderTarget = rt;
   cam.renderMask =Mad3D.RenderMask.layers;
   for (var i in layers){
      cam.addRenderLayer(layers[i]);
   }
   return cam;
}

class StereoCamera{
   constructor(asp,w,h,layers) {
      this.rightCam = initCamera(asp,w,h,layers);
      this.leftCam = initCamera(asp,w,h,layers);
      this.transform =  new Mad3D.Transform();
      this.rightCam.transform.setParent(this.transform);
      this.leftCam.transform.setParent(this.transform);
      this.rightCam.name = "rightCam";
      this.bks = 0.0645;
      this.leftCam.name = "leftCam";

      this.fov = 45;
      this.asp = w/h;
      //this.rightCam.clearColor=[0.4,0.3,0.2,1.0];
   }
   setEyeDistance(dist){
      this.bks = dist;
     // this.rightCam.transform.setPosition(-this.bks/2.0,0.0,0.0);
     // this.leftCam.transform.setPosition(-this.bks/2.0,0.0,0.0);
   }

   _innerCalFrustum(pa,pb,pc,pe,n){
      var va = pa.sub(pe);
      var vb = pb.sub(pe);
      var vc = pc.sub(pe);
      var vr = pb.sub(pa);
      vr.normalize();
      var vu = pc.sub(pa);
      vu.normalize();
      var vn = vr.cross(vu);
      vn.normalize();
      var d = vn.dot(va)*(-1.0);
      var l = vr.dot(va)*n/d;
      var r = vr.dot(vb)*n/d;
      var b = vu.dot(va)*n/d;
      var t = vu.dot(vc)*n/d;
      return {l:l,r:r,b:b,t:t};


   }
   moveProjectCam(x,y,z,entis){
      this.transform.setPosition(x,y,z);
      //this.transform.lookAt(0,0,-10);
      this.rightCam.transform.setPosition(this.bks/2.0,0.0,0.0);
     this.leftCam.transform.setPosition(-this.bks/2.0,0.0,0.0);
      this.moveEyes(this.transform.pos,null,entis);
   }
   moveEyes(eyePos,dir,entis){
      // eyePos.x 
      this.rightCam.isGeneral = true;
      this.leftCam.isGeneral = true;
      var n = this.rightCam.near;
      var fov = this.rightCam.fov;
      var h = n*Math.tan(fov/2.0);
      var a = h*this.asp;
      console.log("a =, h=",a,h);
      var pa = new Mad3D.Vector3(-a,-h,0); 
      var pb = new Mad3D.Vector3(a,-h,0);
      var pc = new Mad3D.Vector3(-a,h,0);
      var pel = new Mad3D.Vector3(eyePos.x-this.bks,eyePos.y,eyePos.z);
      var per = new Mad3D.Vector3(eyePos.x+this.bks,eyePos.y,eyePos.z);
      var frustuml = this._innerCalFrustum(pa,pb,pc,pel,n);
      var frustumr = this._innerCalFrustum(pa,pb,pc,per,n);
      this.leftCam.setFrustrum(frustuml.l,frustuml.r,frustuml.t,frustuml.b);
      this.rightCam.setFrustrum(frustumr.l,frustumr.r,frustumr.t,frustumr.b);
      if(entis!==undefined){
         entis[0].transform.setPosition(pa.x,pa.y,pa.z);
         entis[1].transform.setPosition(pb.x,pb.y,pb.z);
         entis[2].transform.setPosition(pc.x,pc.y,pc.z);
      }
   }

}

function createProjectPlaneEnties(layer,ds,steroCam){
   var n = steroCam.rightCam.near;
   var fov = steroCam.rightCam.fov;
   var h = n*Math.tan(fov/2.0);
   var a = h*steroCam.asp;
   console.log("a =, h=",a,h);
   //blackwhite.jpeg
   var baseUrl = "../pics/blackwhite.jpeg";//test3.jpg"; 
   var dep = 30;
   var smesh2 = Mad3D.MeshUtil.createBox(2*a,2*h,dep);
   var enti =Mad3D.SceneUtil.createEntity(ds.scene,"box",
      {mesh:smesh2,receiveLight:true,receiveShadow:false,texture0:baseUrl,
           matColor:[0.2,0.6,0.2,1.0],cullFace :"FRONT"});
           enti.setRenderLayer(layer);
          // ds.scene.addEntity(enti);
           enti.transform.setPosition(0,0,0);


   var smesh = Mad3D.MeshUtil.createBox(0.3,0.3,0.3);

   var res = [];
   for(var i = 0; i<3; i++){
      var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"box",
      {mesh:smesh,receiveLight:false,receiveShadow:false,
           matColor:[0.2,0.6,0.2,1.0]});
           enti1.setRenderLayer(layer);
           ds.scene.addEntity(enti1);
           res[i]=enti1;
   }
   return res;
}

function createBuildBox(layer,ds){
   var dep = 10;
  
   var smesh = Mad3D.MeshUtil.createBox(1,1,1);


   var enti3 =Mad3D.SceneUtil.createEntity(ds.scene,"box",
   {mesh:smesh,receiveLight:true,receiveShadow:false,
        matColor:[0.2,0.6,0.2,1.0]});
        enti3.setRenderLayer(layer);
        enti3.transform.setPosition(0,0,2);
        ds.scene.addEntity(enti3);
   var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"box",
   {mesh:smesh,receiveLight:true,receiveShadow:false,
        matColor:[0.2,0.6,0.2,1.0]});
        enti1.setRenderLayer(layer);
        ds.scene.addEntity(enti1);
        enti1.transform.setPosition(1,0,-5);
        var enti2 =Mad3D.SceneUtil.createEntity(ds.scene,"box",
        {mesh:smesh,receiveLight:true,receiveShadow:false,
             matColor:[0.2,0.6,0.2,1.0]});
             enti2.setRenderLayer(layer);
             enti2.transform.setPosition(-1,0,-5);
            
       
                  ds.scene.addEntity(enti2);
                  
}





function initScene(){
   //default scene
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.scene.ambientLight = new Mad3D.Vector3(0.2,0.2,0.2);
   //  //light
    var lt = ds.dirLight;
    lt.color = new Mad3D.Vector3(1.0,1.0,1.0);
    lt.specular = new Mad3D.Vector3(1.5,1.5,1.5);
    var contentLayer = Mad3D.RenderLayer.default+1;
    var viewLayer = Mad3D.RenderLayer.default+2;

   ds.camera.renderMask = Mad3D.RenderMask.layers;
    ds.camera.addRenderLayer(viewLayer);
    //ds.camera.addRenderLayer(contentLayer);
    var w = ds.scene.gl.canvas.width;
    var h = ds.scene.gl.canvas.height;
    var steroCam = new StereoCamera(w/h,w,h,[contentLayer]);
   ds.scene.addCamera(steroCam.leftCam);
   ds.scene.addCamera(steroCam.rightCam);
   ds.steroCam = steroCam;
   //ds.steroCam.transform.setParent(ds.camera.transform);
   createBuildBox(contentLayer,ds);
   
   ds.projentis =createProjectPlaneEnties(contentLayer,ds,steroCam);
   
         //enti1.transform.setPosition(0.5,0.5,1.0);
    
    
         // var baseUrl = "../pics/MD3d_hello.png";  
      var pR = Mad3D.MeshUtil.createPlane(5,5*h/w,0.0);
      var viewL = Mad3D.SceneUtil.createEntity(ds.scene,"viewL",
      {mesh:pR,receiveLight:false,receiveShadow:false,
         matColor:[0.2,0.8,0.1,1.0],texture0:steroCam.leftCam.renderTarget
         });
      viewL.setRenderLayer(viewLayer);
         viewL.transform.setPosition(-2.6,1.5,0);

      ds.scene.addEntity(viewL);

      var viewR = Mad3D.SceneUtil.createEntity(ds.scene,"viewR",
      {mesh:pR,receiveLight:false,receiveShadow:false,
         matColor:[0.2,0.2,0.8,1.0],texture0:ds.steroCam.rightCam.renderTarget
         });
      viewR.transform.setPosition(2.6,1.5,0);
      viewR.setRenderLayer(viewLayer);
      ds.scene.addEntity(viewR);
      var fbody_add =`
      if(mod(gl_FragCoord.x,2.0)>1.0){
         gl_FragColor = color_tex0;
      }else{
         gl_FragColor = color_tex1;
      }
      `;
      var merge = Mad3D.SceneUtil.createEntity(ds.scene,"viewMerge",
      {mesh:pR,receiveLight:false,receiveShadow:false,
         matColor:[0.2,0.0,0.0,1.0],texture0:steroCam.leftCam.renderTarget,
         texture1:steroCam.rightCam.renderTarget,fbody_add:fbody_add
         });
      merge.transform.setPosition(0,-1.5,0);
      merge.setRenderLayer(viewLayer);
      ds.scene.addEntity(merge);
      var cpos ={x:0,y:0,z:8};
      ds.steroCam.transform.setPosition(cpos.x,cpos.y,cpos.z);
      //var eyePos = ds.steroCam.transform.pos;
      steroCam.moveProjectCam(cpos.x,cpos.y,cpos.z,ds.projentis);

      //ds.steroCam.transform.lookAt(0,0,0);
      //steroCam.moveEyes({x:1,y:0.0,z:8});
   
    //interaction
    var transform = new Mad3D.Transform();
    var pa = {transform: transform};

   Mad3D.InteractUtil.registerMovehandler(ds.scene.gl.canvas,transform,[360,45],function(tf){
      steroCam.moveProjectCam(tf.rot.y*0.1,tf.rot.x*0.1,cpos.z,ds.projentis);
   });

   return ds.scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



