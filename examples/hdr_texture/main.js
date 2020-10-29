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


function initScene(){
   //default scene
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.scene.ambientLight = new Vector3(0.02,0.02,0.02);
    //light
    var lt = ds.dirLight;
    lt.color = new Vector3(1.0,1.0,1.0);
    //lt.color = new Vector3(5.0,5.0,5.0);
    lt.specular = new Vector3(1.0,1.0,1.0);
      var baseUrl = "../pics/memorial.hdr";
     // var baseUrl = "../pics/pisaHDR/negx.hdr";
    //skybox
   var skybox = SceneUtil.createSkyBox(ds.scene,{skyBoxPath:"../pics/pisaHDR/",extension:".hdr"});
   ds.scene.addEntity(skybox);        
      var iw = 3.0;
      var ratio = 512.0/768.0;
      var ih = iw*1.5;
      var smesh = MeshUtil.createBox(iw,ih,0.5);
      var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
      {mesh:smesh,receiveLight:false,receiveShadow:false,
         texture0:baseUrl,
          gammaCorrect:true,hdrExposure:200.0,
         });

   ds.scene.addEntity(enti1);
  

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
// var tf = enti1.transform;
// var m1 = TransformAni(ds.scene,tf,{
//         targets: tf.pos,
//         z: -20,
//         duration: 5000,
//         direction: 'alternate',
//         loop: -1,
//         easing: 'linear',
//         autoplay:false,
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



