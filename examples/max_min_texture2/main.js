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
        mdg.mat.setUniform("u_mouse",UTypeEnumn.Vec2,[x,y]);
        mdg.scene.requireUpdate();
        //scene.require
        console.log(x,y);


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
    transform.setPosition(0,0,10);
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
 
var colors = [0.6,0.4,1.0,1.0,
                0.6,0.4,1.0,1.0,
                0.6,0.4,1.0,1.0,
                0.6,0.4,1.0,1.0,
                0.6,0.4,1.0,1.0,
                0.6,0.4,1.0,1.0,
                0.6,0.4,1.0,1.0,
                0.6,0.4,1.0,1.0];


var c = 0.0; 
var posArr = [
        // inner
        -3, -1,  c,
        -2, -1,  c,
        -1, -1.3, c,
        1, -0.9, c,
        
        
        //out
        1,  1,  c,
        -1,  3.9, c,
        -2, 1.1, c,
        -3, 1.4, c,
    
    ];
    var inInds = [0,1,2,3];
    var outInds = [4,5,6,7];

var indices = [0,1,7,1,6,7,1,5,6,1,2,5,2,4,5,2,3,4];


var newColors = [
    
];
var newPosArr = [
    -3, -1,  c,
    -2.5, 2.0, c,
    -2, -1,  c,
    -1, -3.3, c,
    1, -0.9, c
];
var newInInds = [];
{
    for(var i = 0; i < newPosArr.length/3; i++){
        var posX = newPosArr[i];
        var posY = newPosArr[i*3+1];
        var posZ = newPosArr[i*3+2];
       // newPosArr.push(posX,posY,posZ);
        newColors.push(0.0,1.0,1.0,1.0);
        newInInds.push(i);
    } 
}
var newIndices = [];    
var step = 0.2;
var loop = 10;
var alphaStep = 1.0/(loop-1);
{
    for(var j = 0; j<loop; j++){
        for(var i = 0; i < newInInds.length; i++){
            var posX = newPosArr[newInInds[i]*3];
            var posY = newPosArr[newInInds[i]*3+1];
            var posZ = newPosArr[newInInds[i]*3+2];
            newPosArr.push(posX,posY+step*j,posZ);
            newColors.push(alphaStep*j,1.0,1.0,1.0);
        }
        var l1_st = j*newInInds.length;
        var l2_st = (j+1)*newInInds.length;
        for(var k = 0; k < newInInds.length-1; k++){
            newIndices.push(l1_st+k,l1_st+k+1,l2_st+k);
            newIndices.push(l1_st+k+1,l2_st+k+1,l2_st+k);
        }
    }
}
//var indices = [0,1,7,1,6,7,1,2,6,4,5,6,2,4,6,2,3,4];
//var indices  = [4,5,6];

// var posArr = [
//     // Front face
//     -0.5, -0.5,  c,
//     0.5, 0.4,  c,
//     0.0,  0.6,  c,
//     -0.5,  0.5,  c,
// ];


  



//var mesh = MeshUtil.createColorPolygon(colors,indices,posArr);
var mesh = MeshUtil.createColorPolygon(newColors,newIndices,newPosArr);
  //var mesh = MeshUtil.createColorPlane(2,2,colors,0);
    /**@type {Material} */
    var material = MaterialUtil.createFromShader(vsSource,fsSource);
    material.shaderOption.vertexColor = true;
    material.setUniform("u_mouse",UTypeEnumn.Vec2,[0.0,1.0]);
    
    console.log("resolution",w,h);
    material.setUniform("u_resolution",UTypeEnumn.Vec2,[w,h]);
    mdg.mat = material;
    //var ets = [];
    var entity = new Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    //entity.transform.setPosition(0,0,6);
    //entity.transform.copyFrom(cam.transform);
    //entity.transform.translate(0,0,0);
    //var ets = createSineBoxes(entity);
    // test anim
    
    var ets = [];
    ets.push(entity);

    var scene = new Scene();
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



