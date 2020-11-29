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

function initScene(){
   //step1 default scene
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [0.2,0.3,0.1,1.0];
   
   ds.camera.renderMask = RenderMask.layers;
    ds.camera.addRenderLayer(RenderLayer.default); 
    ds.scene.ambientLight = new Vector3(0.2,0.2,0.2);
    //step2 light
    var lt = ds.dirLight;
    var intes = 2.0;
    lt.color = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    lt.specular = new Vector3(1.0*intes,1.0*intes,1.0*intes);
 
    // step3 : render sphere Hdr to cube
   // var m = SceneUtil.createEntity(ds.scene,"sp1",{
   //    matColor:[1.0,1.0,1.0,1],receiveLight:true,
   // });
   //ds.scene.addEntity(m);

   // objLoad("../pics/models/testMesh.obj",function(data){
   //    var ps = OBJParser(data);
   //    /**@type {Mesh} */
   //    var ms = Mesh.createFromArray(ps.positions.length/3.0,ps.positions,null);
   //    ms.setPrimitiveType(PrimitiveType.TriangularStrip);
   //    ms.vertexNormal = ps.normals;
   //    ms.uv =ps.uvs;
   //    m.mesh = ms;
   //    console.log(ps);
   // });
  // var obju = "../pics/models/testMesh.obj";
   var obju = "../pics/models/plane.obj";
   objLoad(obju,function(data){
         var ps =OBJParser();
         var cts = ps.parse(data,{scene:ds.scene});
         /**@type {Mesh} */
        for(var i in cts){
           var enti = cts[i];
           enti.transform.scale(0.008,0.008,0.008);
           enti.transform.setPosition(0,-1,0);
           ds.scene.addEntity(enti);
        }
         //console.log(ps);
      });

   //m.transform.scale(0.08,0.08,0.08);
  // ds.camera.transform.setPosition(0,0,-9.0);
    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
   });
    
// var m2 = TransformAni(ds.scene,tf,{
//    targets: tf.rot,
//    y: 360,
//    duration: 2000,
//    direction: 'alternate',
//    loop: -1,
//    easing: 'linear',
//    autoplay:true,
//    update: function(anim) {
//    }
// });

   return ds.scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



