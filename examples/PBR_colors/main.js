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
function createPBREntity(rows,columns,scene){
   var isPBR = true;
   var ft = 0.2;
   var mat_diff = new Vector3(23.47*ft, 21.31*ft, 20.79*ft);
   var stepi = 1.0/rows;
   var stepj = 1.0/columns;
   var space = 0.9;
   var initx = 3.0; inity =2.8;
   console.log("rough from left to right,metal from bottom to top");
   var smesh = MeshUtil.createSphere(1.0,80,80);
   for (var i=0; i<rows; i++){
      for (var j=0;j<columns; j++){
         var rough = norml(0.09,1.0,j*stepj);
         var metal = i*stepi;
         console.log("createPBREntity varying:",i,j,rough,metal);
         var enti1 =SceneUtil.createEntity(scene,"sphere"+i,
            {mesh:smesh,receiveLight:true,receiveShadow:false,gammaCorrect:true,matColor:[0.1, 0.01, 0.5,1.0],
            roughness:rough,metalness:metal,PBR:isPBR,diffuse:mat_diff});
            enti1.transform.setPosition(space*j-initx,space*i-inity,0.0);
            enti1.transform.resetScale(0.4,0.4,0.4);
            scene.addEntity(enti1);
      }
   }
  
}

function initScene(){
   //default scene
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:true});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.scene.ambientLight = new Vector3(0.03,0.03,0.03);
    //light
    var lt = ds.dirLight;
    lt.color = new Vector3(1.0,1.0,1.0);
    //lt.color = new Vector3(5.0,5.0,5.0);
    lt.specular = new Vector3(1.0,1.0,1.0);

    var lt2 = LightUtil.createShadowLight(0,0,new Vector3(2,-2,2),false,true);
    ds.scene.addLight(lt2);

    var lt3 = LightUtil.createShadowLight(0,0,new Vector3(-2,2,2),false,true);
    ds.scene.addLight(lt3);

    var lt4 = LightUtil.createShadowLight(0,0,new Vector3(-2,-2,2),false,true);
    ds.scene.addLight(lt4);


    //skybox
   // var skybox = SceneUtil.createSkyBox(ds.scene);
    //ds.scene.addEntity(skybox);        
     
    //small sphere
   //  var isPBR = false;
   //  var mat_diff = new Vector3(0.5,0.5,0.5);

   //  var isPBR = true;
   //  var mat_diff = new Vector3(23.47, 21.31, 20.79);

   //  var mat_specular = new Vector3(0.5,0.5,0.5);
   // var mat_shiness = 20.0;
   // var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
   // {receiveLight:true,receiveShadow:false,gammaCorrect:true,matColor:[0.5,0.0,0.0,1.0],
   //    PBR:isPBR,diffuse:mat_diff,specular:mat_specular,shiness:mat_shiness});
   // ds.scene.addEntity(enti1);

   createPBREntity(7,7,ds.scene);

   //floor
   //  var meshP = MeshUtil.createBox(100,0.5,100);
   // var enti2 = SceneUtil.createEntity(ds.scene,"floor",
   // {mesh:meshP,receiveLight:true,receiveShadow:true});
   //  enti2.transform.setPosition(0,-2,-2);
   //  ds.scene.addEntity(enti2);

    //light cube
   //  var lcb_mesh = MeshUtil.createBox(0.5,0.5,0.5);
   //  var lcb = SceneUtil.createEntity(ds.scene,"light_cube",
   //  {mesh:lcb_mesh,receiveLight:false,matColor:[0.6,1.2,1.2,1.0],receiveShadow:false});
   //  lcb.transform.setPosition(2,2,2);
   //  ds.scene.addEntity(lcb);


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



