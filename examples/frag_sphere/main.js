/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-15 19:55:30
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
        console.log("move");
        var tc = ev.touches[0];
        var x = tc.clientX;
        var y = tc.clientY;
        mdg.mat.setUniform("u_mouse",Mad3D.UTypeEnumn.Vec2,[x,y]);
        mdg.scene.requireUpdate();
        //scene.require
        console.log(x,y);


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
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.FRONT);
    // set projection and mv matrix
    var w = gl.canvas.clientWidth;
    var h = gl.canvas.clientHeight;
    var asp  = w/h;
    var cam = initCamera(asp);
    // create Mesh:
    //var mesh =createSqModelMesh();
    //var mesh = MeshUtil.createColorBox();
   // var mesh = MeshUtil.createPlane(3,3,2.0);
  var mesh =  Mad3D.MeshUtil.createCameraPlane(cam);
    /**@type {Material} */
    var material = Mad3D.MaterialUtil.createFromShader(vsSource,fsSource);
    material.shaderOption.vertexColor = true;
    material.setUniform("u_mouse",Mad3D.UTypeEnumn.Vec2,[0.0,1.0]);
    
    console.log("resolution",w,h);
    material.setUniform("u_resolution",Mad3D.UTypeEnumn.Vec2,[w,h]);
    mdg.mat = material;
    //var ets = [];
    var entity = new Mad3D.Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    //entity.transform.setPosition(0,0,6);
    entity.transform.copyFrom(cam.transform);
    //entity.transform.translate(0,0,0);
    //var ets = createSineBoxes(entity);
    // test anim
    
    var ets = [];
    ets.push(entity);

    var scene = new Mad3D.Scene();
    mdg.scene = scene;
    
    scene.addCamera(cam);
    scene.entityList = ets;
    scene.gl = gl;
    return scene;
}

 function main(){
    scene = initScene();
    scene.enableActiveDraw(true);
    scene.draw();
    
}


window.onload = main;



