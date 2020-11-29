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
    var intes = 0.5;
    lt.color = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    lt.specular = new Vector3(1.0*intes,1.0*intes,1.0*intes);
    var lt2 = LightUtil.createShadowLight(0,0,new Vector3(2,-2,2),false,true);
    ds.scene.addLight(lt2);

    var lt3 = LightUtil.createShadowLight(0,0,new Vector3(-2,2,2),false,true);
    ds.scene.addLight(lt3);

    var lt4 = LightUtil.createShadowLight(0,0,new Vector3(-2,-2,2),false,true);
    ds.scene.addLight(lt4);
 
    
   var obju = "../pics/models/deer.obj";
   var isPBR = true;
   var ft = 0.2;
   var metal = 0.1;
   var rough = 0.1;
   var mat_diff = new Vector3(23.47*ft, 21.31*ft, 20.79*ft);
   var mat = SceneUtil.createMaterial(ds.scene,{receiveLight:true,receiveShadow:false,
      gammaCorrect:true,matColor:[0.7, 0.6, 0.9,1.0],
      roughness:rough,metalness:metal,PBR:isPBR,diffuse:mat_diff});
   objLoad(obju,function(data){
         var ps =OBJParser();
         var cts = ps.parse(data,{scene:ds.scene});
         /**@type {Mesh} */
        for(var i in cts){
           var enti = cts[i];
           enti.transform.scale(0.008,0.008,0.008);
         // enti.transform.scale(0.8,0.8,0.8);
           enti.transform.setPosition(0,-1,0);
           enti.material  = mat;
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



