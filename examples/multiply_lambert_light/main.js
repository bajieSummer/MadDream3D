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
    var cam = new Camera();
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
    var mesh = MeshUtil.createBox(2,2,2);//createPlane(4,4,0);
    var shaderOps = new ShaderOption();
    shaderOps.texture0 = "pics/1.jpg";
    shaderOps.diffuse = new Vector3(1.5,1.5,1.5);
    shaderOps.dirLightCount = 2; 
    var dlt = new Light();
    dlt.color = new Vector3(0.3,0.3,1.0);
    dlt.transform.setPosition(-1.0,-1.0,0);

    var dlt2 = new Light();
    dlt2.color = new Vector3(1.0,0.2,0.3);
    dlt2.transform.setPosition(1.0,0.0,0.0);
    /**@type {Material} */
    var material = MaterialUtil.createFromShaderOption(shaderOps);
    mdg.mat = material;
    //var ets = [];
    var entity = new Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    entity.transform.rotate(25,45,0);
    entity.transform.setPosition(0,0,0);

    var ets = [];
    ets.push(entity);

    var scene = new Scene();
    scene.clearColor = [0.5,0.5,0.5,1.0];
    scene.dirLights = [];
    scene.dirLights.push(dlt);
    scene.dirLights.push(dlt2);
    scene.ambientLight = new Vector3(0.1,0.1,0.1);
    mdg.scene = scene;

    
    scene.addCamera(cam);
    scene.entityList = ets;
    scene.gl = gl;


    var m2 = TransformAni(scene,entity.transform,
        {
            targets: entity.transform.rot,
            x: 360,
            duration: 3000,
            direction: 'alternate',
            loop: -1,
            easing: 'easeInCubic',
            autoplay:true,
            update: function(anim) {
                //console.log("dd",anim.progress);
            }
        });

        var m3 = TransformAni(scene,entity.transform,
            {
                targets: entity.transform.rot,
                y: 360,
                duration: 3000,
                direction: 'alternate',
                loop: -1,
                easing: 'easeInCubic',
                autoplay:true,
                update: function(anim) {
                    //console.log("dd",anim.progress);
                }
            });

    return scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();

    
    
}


window.onload = main;



