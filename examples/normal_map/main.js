/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-24 18:26:06
 * @Description: file content
 */
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
    var gl = Mad3D.CanvasUtil.initCanvas("sipc");
   gl.enable(gl.CULL_FACE);
   //gl.frontFace(gl.CCW);
   // gl.cullFace(gl.BACK);
    // set projection and mv matrix
    var w = gl.canvas.clientWidth;
    var h = gl.canvas.clientHeight;
    var asp  = w/h;
    var cam = initCamera(asp);
    // create Mesh:
    //var mesh = MeshUtil.createColorBox(2,2,2);
     //var mesh = MeshUtil.createCircle(2.0,11);
    //var mesh = MeshUtil.createTaper(2.5,1.0,6);
    var mesh = Mad3D.MeshUtil.createSphere(2,250,250,true);
     //var mesh = MeshUtil.createPlane(4,4,0,true);
     //var mesh = MeshUtil.createBox(3,3,3,true);
    //create scene
    var scene = new Mad3D.Scene();
    scene.clearColor = [0.5,0.5,0.5,1.0];


    // directionLight
    var dlt = new Mad3D.DirectionLight();
    //dlt.color = new Vector3(1.0,1.0,1.0);
    dlt.transform.setPosition(2.0,2.0,2.0);
    //dlt.transform.setPosition(-2.0,-2.0,0.0);
    //dlt.specular = new Vector3(0.9,0.9,0.9);

    //pointLight
    var dlt2 = new Mad3D.PointLight();
    //dlt2.color = new Vector3(1.0,1.0,1.0);
    dlt2.transform.setPosition(0.0,0.0,3.5);
    dlt2.constant = 0.95;
    dlt2.linear = 0.07;
    dlt2.quadratic = 0.001;

    scene.dirLights = [];
    scene.dirLights.push(dlt);
    scene.pointLights = [];
    //scene.pointLights.push(dlt2);
    scene.ambientLight = new Mad3D.Vector3(0.1,0.1,0.1);
    
    var shaderOps = new Mad3D.ShaderOption();
    //shaderOps.vertexColor = true;
    shaderOps.matColor = [0.0,1.0,1.0,1.0];
   // shaderOps.normalMap = "../pics/steelplate1/normal.png";
   shaderOps.normalMap = "../pics/mars_normal.png";
   // shaderOps.texture0 = "../pics/test3.jpg";
  // shaderOps.texture0 = "../pics/earthmap1k.jpg";
   shaderOps.texture0 = "../pics/mars_1k_color.jpg";
    shaderOps.diffuse = new Mad3D.Vector3(0.7,0.7,0.7);
    shaderOps.specular = new Mad3D.Vector3(0.5,0.5,0.5);
    shaderOps.shininess = 10.0;
    shaderOps.dirLightCount = scene.dirLights.length;
    shaderOps.pointLightCount =scene.pointLights.length; 
    console.log(shaderOps.dirLightCount,shaderOps.pointLightCount);
    /**@type {Material} */
    var material = Mad3D.MaterialUtil.createFromShaderOption(shaderOps);
    mdg.mat = material;
    //var ets = [];
    var entity = new Mad3D.Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    entity.transform.rotate(0,0,0);
    entity.transform.setPosition(0,0,0);
    var ets = [];
    ets.push(entity);
    Mad3D.InteractUtil.registerMovehandler(gl.canvas,entity.transform);
    scene.addCamera(cam);
    scene.entityList = ets;
    scene.gl = gl;
    return scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



