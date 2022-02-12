/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
 * @Description: file content
 */



function initScene(){
   //default scene
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
   //  ds.scene.ambientLight = new Vector3(0.02,0.02,0.02);
   //  //light
   //  var lt = ds.dirLight;
   //  lt.color = new Vector3(1.0,1.0,1.0);
   //  lt.specular = new Vector3(1.0,1.0,1.0);

   var baseUrl = "../pics/MD3d_hello.png";      
   
      var smesh = Mad3D.MeshUtil.createBox(3,3,3);
      var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"box",
      {mesh:smesh,receiveLight:false,receiveShadow:false,
         texture0:baseUrl
         });

   ds.scene.addEntity(enti1);
  

    //interaction
   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){ 
   });

   return ds.scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



