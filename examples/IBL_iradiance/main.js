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
   var ft = 1.3;
   var mat_diff = new Mad3D.Vector3(23.47*ft, 21.31*ft, 20.79*ft);
  // var mat_diff = new Vector3(1.0, 1.0, 1.0);
   var stepi = 1.0/rows;
   var stepj = 1.0/columns;
   var space = 0.9;
   var initx = 3.0; inity =2.8;
   for (var i=0; i<rows; i++){
      for (var j=0;j<columns; j++){
         var rough = norml(0.09,1.0,j*stepj);
         var metal = i*stepi;
         console.log("createPBREntity varying:",i,j,rough,metal);
         var enti1 =Mad3D.SceneUtil.createEntity(scene,"sphere"+i,
            {receiveLight:true,receiveShadow:false,hdrExposure:1.0,gammaCorrect:true,matColor:[0.5,0.0,0.0,1.0],
            roughness:rough,metalness:metal,PBR:isPBR,diffuse:mat_diff});
            enti1.transform.setPosition(space*j-initx,space*i-inity,0.0);
            enti1.transform.resetScale(0.4,0.4,0.4);
            scene.addEntity(enti1);
      }
   }
  
}

function createCubeUrls(pf,et){
   var envMap = [pf+"posx"+et,pf+"negx"+et,pf+"posy"+et,
   pf+"negy"+et,pf+"posz"+et,pf+"negz"+et
   ];
   return envMap;
}

function initScene(){
   //default scene
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.scene.ambientLight = new Mad3D.Vector3(0.02,0.02,0.02);
    //light
    var lt = ds.dirLight;
    lt.color = new Mad3D.Vector3(1.0,1.0,1.0);
    //lt.color = new Vector3(5.0,5.0,5.0);
    lt.specular = new Mad3D.Vector3(1.0,1.0,1.0);
    var gl = ds.scene.gl;

   //  var lt2 = LightUtil.createShadowLight(0,0,new Vector3(-4,4,4),false,true);
   //  ds.scene.addLight(lt2);

   //  var lt3 = LightUtil.createShadowLight(0,0,new Vector3(-4,4,4),false,true);
   //  ds.scene.addLight(lt3);

   //  var lt4 = LightUtil.createShadowLight(0,0,new Vector3(-4,-4,4),false,true);
   //  ds.scene.addLight(lt4);


    //skybox
   // var skybox = SceneUtil.createSkyBox(ds.scene);
    //ds.scene.addEntity(skybox);        
     
    //small sphere
   //  var isPBR = false;
   //  var mat_diff = new Vector3(0.5,0.5,0.5);
   //var mat_specular = new Vector3(0.5,0.5,0.5);
   //var mat_shiness = 20.0;
   // var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
   // {receiveLight:true,receiveShadow:false,gammaCorrect:true,hdrExposure:1.0,matColor:[0.5,0.0,0.0,1.0],
   //    PBR:isPBR,diffuse:mat_diff,specular:mat_specular,shiness:mat_shiness});

    var isPBR = true;
     var ft = 0.001;
     var mat_diff = new Mad3D.Vector3(23.47*ft, 21.31*ft, 20.79*ft);
   //var mat_diff = new Vector3(0.01, 1, 1.0);
   // var folder = "../pics/rusticMetal1/";
   //var folder = "../pics/steelplate1/";
   var folder ="../pics/modern-brick1/";
   //var folder = "../pics/streaked-metal1/";
    var baseUrl = folder+"albedo.png";
    var metalUrl = folder+"metallic.png";
    var roughUrl = folder+"roughness.png";
    var normalUrl = folder +"normal.png";
    var aoUrl = folder+"ao.png";
    var heightUrl = folder+"height.png";
    var martx= "../pics/mars_1k_color.jpg";
    var smesh = Mad3D.MeshUtil.createSphere(1,100,100,true);
    //var smesh = MeshUtil.createBox(3,3,2,true);
   // var pf = "../pics/cube/bridge/";
   
   var envMap1 =createCubeUrls("../pics/sky1_irradiance/",".hdr");
 
   var envMap = createCubeUrls("../pics/pisaHDR/",".hdr");
   
   var pf_spec = "../pics/sky1_radiance/";
   var iblspecul = createCubeUrls(pf_spec,".hdr");
   var ibllut = pf_spec+"brdf.png";
    //roughness:0.5,metalness:0.7  irradianceMap:envMap,radianceMap:iblspecul,
   // var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
   // {mesh:smesh,receiveLight:true,receiveShadow:false,
   //    texture0:baseUrl,normalMap:normalUrl,PBR:isPBR,
   //    diffuse:mat_diff,metalMap:metalUrl,roughMap:roughUrl,aoMap:aoUrl,
   //     gammaCorrect:true,hdrExposure:1.0
   //    });

      var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"sphere",
      {mesh:smesh,receiveLight:true,receiveShadow:false,
         matColor:[0.97, 0.96, 0.91,1.0],PBR:true,
         diffuse:mat_diff,metalness:0.2,roughness:0.2,
         irradianceMap:envMap1,gammaCorrect:true,
          
         });
   //  var mat_diff_n = new Vector3(2.0, 2.0, 2.0);
   //  var mat_specu = new Vector3(2.0,2.0,2.0);
   //  var shiness = 20.0;
   // // //normalMap:normalUrl
   // var enti1 =SceneUtil.createEntity(ds.scene,"sphere",
   // {mesh:smesh,receiveLight:true,receiveShadow:false,
   //    texture0:baseUrl,normalMap:normalUrl,reflective:0.5,
   //    diffuse:mat_diff_n,specular:mat_specu,shiness:shiness
   //    });
   
   

   ds.scene.addEntity(enti1);
  // enti1.transform.resetScale(2,2,2);
   //enti1.transform.setPosition(-1.0,-1.0,0);

   //createPBREntity(7,7,ds.scene);

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
   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
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



