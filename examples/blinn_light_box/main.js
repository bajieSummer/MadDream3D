/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-24 18:26:06
 * @Description: file content
 */


function initCanvas(canvasId){
     // init Canvas
     var canvas = document.getElementById(canvasId);
     canvas.width = canvas.clientWidth;
     canvas.height = canvas.clientHeight;
     canvas.addEventListener("touchmove",responseToMouse,false);
     /** @type {WebGLRenderingContext} */
     var gl = canvas.getContext("webgl");
     if (gl === null){
         gl = canvas.getContext("experimental-webgl");
     }
     if (gl === null){
         alert("Unable to initialize the webgl context");
     }
     /** @type {WebGLRenderingContext} */
     return  gl;    
}
function responseToMouse(
    /**@type {TouchEvent} */
    ev){
        //console.log("move");
        var tc = ev.touches[0];
        var x = tc.clientX;
        var y = tc.clientY;
       // mdg.mat.setUniform("u_mouse",UTypeEnumn.Vec2,[x,y]);
        //mdg.scene.requireUpdate();
        //scene.require
        //console.log(x,y);


}

function initCamera(asp){
    console.log("camera,asp:",asp);
    var cam = new Mad3D.Camera();
    /**@type {Transform} */
    var transform  = cam.transform;
    cam.setFov(45);
    cam.setFar(100.0);
    cam.setNear(0.1);
    cam.setAsp(asp);
    transform.setPosition(0,0,6);
    //transform.rotate(0,0,0);
    return cam;
}
var mdg = {};


function initScene(){
    /**@type {WebGLRenderingContext} */
    var gl = initCanvas("sipc");
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    // set projection and mv matrix
    var w = gl.canvas.clientWidth;
    var h = gl.canvas.clientHeight;
    var asp  = w/h;
    var cam = initCamera(asp);
    // create Mesh:
    //var mesh =createSqModelMesh();
    //var mesh = MeshUtil.createColorBox();
    //var mesh = MeshUtil.createColorPlane(3,3);
    //var mesh =  MeshUtil.createCameraPlane(cam);
    //var mesh = MeshUtil.createBox(1,1,1);
    var mesh = Mad3D.MeshUtil.createBox(2,2,2);//createPlane(4,4,0);
    var shaderOps = new Mad3D.ShaderOption();
    shaderOps.dirLightCount = 1;
    shaderOps.texture0 = "pics/1.jpg";
    shaderOps.diffuse = new Mad3D.Vector3(1.0,1.0,1.0);
    shaderOps.specular = new Mad3D.Vector3(1.0,1.0,1.0);
    shaderOps.shininess = 50.0;

    var dlt = new Mad3D.Light();
    dlt.color = new Mad3D.Vector3(0.9,0.5,0.6);
    dlt.transform.setPosition(-5,-5,0);
    /**@type {Material} */
    var material = Mad3D.MaterialUtil.createFromShaderOption(shaderOps);

    mdg.mat = material;
    //var ets = [];
    var entity = new Mad3D.Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    entity.transform.rotate(25,45,0);
    entity.transform.setPosition(0,0,0);

    var ets = [];
    ets.push(entity);

    var scene = new Mad3D.Scene();
    scene.clearColor = [0.5,0.5,0.5,1.0];
    scene.dirLights = [];
    scene.dirLights.push(dlt);
    scene.ambientLight = new Mad3D.Vector3(0.1,0.1,0.1);
    mdg.scene = scene;

    
    scene.addCamera(cam);
    scene.entityList = ets;
    scene.gl = gl;


    var m2 = Mad3D.TransformAni(scene,entity.transform,
        {
            targets: entity.transform.rot,
            x: 360,
            duration: 8000,
            direction: 'alternate',
            loop: -1,
            easing: 'easeInCubic',
            autoplay:true,
            update: function(anim) {
                //console.log("dd",anim.progress);
            }
        });

        var m3 = Mad3D.TransformAni(scene,entity.transform,
            {
                targets: entity.transform.rot,
                y: 360,
                duration: 8000,
                direction: 'alternate',
                loop: -1,
                easing: 'easeInCubic',
                autoplay:true,
                update: function(anim) {
                    //console.log("dd",anim.progress);
                }
            });

      document.getElementById("shininess").addEventListener("input",function(evt){
         console.log(this.value);
         entity.material.setUniform("shininess",Mad3D.UTypeEnumn.float,this.value);
   
      });

    return scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();

    
    
}


window.onload = main;



