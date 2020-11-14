# MadDream3D
3D Rendering Engine

Hi, I'm Sophie, this Engine includes 3D animation, basic lights, PBR (physically based rendering), and IBL (image based lighting).

Now Only support obj 3D format, I'm trying to add more formats.

I'm still working on it. (features, functions)

Any suggests or tips please email me. (bajie615@126.com)

## Requirements 
   WEBGL1.0 or Higher

Usage
   step1: download or pull code and resources
   step2: run a http server (node server1.js)
   step3: check examples

## sample codes:
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    var baseUrl = "../pics/MD3d_hello.png";      
   
    var smesh = MeshUtil.createBox(3,3,3);
    var enti1 =SceneUtil.createEntity(ds.scene,"box",
      {mesh:smesh,receiveLight:false,receiveShadow:false,
         texture0:baseUrl});
    ds.scene.addEntity(enti1);
    ds.draw();







