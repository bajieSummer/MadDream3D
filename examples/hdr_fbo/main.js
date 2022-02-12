/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
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
    transform.setPosition(0,0,4);
    //transform.rotate(-90,0,0);
    return cam;
}
var mdg = {};

function createSkyBox(){
    var mesh = Mad3D.MeshUtil.createBox(1,1,1);
    var shaderOps = new Mad3D.ShaderOption();
    shaderOps.depthTest = false;
    shaderOps.depthWrite = false;
    shaderOps.cullFace = "FRONT";
    var pf = "../pics/cube/bridge/";
    shaderOps.cubeMap =[  pf+"posx.jpg",pf+"negx.jpg",pf+"posy.jpg",
                        pf+"negy.jpg",pf+"posz.jpg",pf+"negz.jpg"
                      
                        ];
    var material = Mad3D.MaterialUtil.createFromShaderOption(shaderOps);
    var entity = new Mad3D.Entity("skybox");
    entity.mesh = mesh;
    entity.material = material;
   // entity.transform.rotate(0,0,0);
   // entity.transform.setPosition(0,0,0);
    entity.transform.followCameraPos = true;
    //entity.transform.rotate(0,120,0);
    return entity;
}
function createLights(scene){
    // directionLight
    var dlt = new Mad3D.DirectionLight();
    //dlt.color = new Vector3(1.0,1.0,1.0);
    dlt.transform.setPosition(2.0,2.0,2.0);
    //dlt.transform.setPosition(-2.0,-2.0,0.0);
    //dlt.specular = new Vector3(0.9,0.9,0.9);

    //pointLight
    var dlt2 = new Mad3D.PointLight();
    //dlt2.color = new Vector3(1.0,1.0,1.0);
    dlt2.transform.setPosition(-3.0,0.0,0.0);
    dlt2.constant = 0.95;
    dlt2.linear = 0.07;
    dlt2.quadratic = 0.001;

    scene.dirLights = [];
    scene.dirLights.push(dlt);
   scene.pointLights = [];
    //scene.pointLights.push(dlt2);
    scene.ambientLight = new Mad3D.Vector3(0.3,0.3,0.3);

}

function createEntity(scene){
    //var mesh = MeshUtil.createPlane(2,2,0);
    var mesh = Mad3D.MeshUtil.createSphere(1,20,20);
   //var mesh = MeshUtil.createDoughnuts(1.3,2.0);
   // var mesh = MeshUtil.createTaper(1.2,0.7,6);
  // var mesh = MeshUtil.createBox(2,2,2);

    var shaderOps = new Mad3D.ShaderOption();
    
     
     //shaderOps.vertexColor = true;
     shaderOps.matColor = [0.2,1.0,1.0,1.0];
    //shaderOps.normalMap = "../pics/mars_normal.png";
     //shaderOps.texture0 = "../pics/memorial.hdr";
     // shaderOps.texture0 ="../pics/earthmap1k.jpg";

    //shaderOps.texture0 = "../pics/mars_1k_color.jpg";
      shaderOps.diffuse = new Mad3D.Vector3(0.5,0.5,0.5);
      shaderOps.specular = new Mad3D.Vector3(0.8,0.8,0.8);
     shaderOps.shininess = 10.0;
     shaderOps.dirLightCount = scene.dirLights.length;
     shaderOps.pointLightCount =scene.pointLights.length; 
 
     //shaderOps.refraction = 0.5;
    // console.log(shaderOps.dirLightCount,shaderOps.pointLightCount);
 
     /**@type {Material} */
     var material = Mad3D.MaterialUtil.createFromShaderOption(shaderOps,scene);
     
     var entity = new Mad3D.Entity("t2");
     entity.mesh = mesh;
     entity.material = material;
     entity.transform.setPosition(1.5,0,0);
     //entity.transform.scale(1.0,1.0,0.5);
     
     return entity;
     
 }

function createHdrEntity(scene,tex,ratio){
    var mesh = Mad3D.MeshUtil.createPlane(2*ratio,2,0);
    var shaderOps = new Mad3D.ShaderOption();
    //shaderOps.matColor = [0.0,1.0,1.0,1.0];
    shaderOps.matColor = [1.0,1.0,1.0,1.0];
    //shaderOps.texture0 = "../pics/memorial.hdr";
    shaderOps.texture0 =tex;//"../pics/earthmap1k.jpg";
    shaderOps.hdrExposure = 2.0;
    /**@type {Material} */
    var material = Mad3D.MaterialUtil.createFromShaderOption(shaderOps,scene);
    var entity = new Mad3D.Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    entity.transform.setPosition(-1.5,0.5,0);
    return entity;
}

function initScene(){
    /**@type {WebGLRenderingContext} */
    var gl = Mad3D.CanvasUtil.initCanvas("sipc");
    gl.canvas.width = gl.canvas.clientWidth*2.0;
    gl.canvas.height = gl.canvas.clientHeight*2.0;
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    //gl.getExtension(extensionName:"OES_texture_float"};
      //  );
    //alert(gl.getSupportedExtensions());
    //gl.enable(gl.DEPTH_TEST);
    var m = gl.getParameter(gl.DEPTH_TEST);
    var n = gl.getParameter(gl.DEPTH_WRITEMASK);
    console.log("defaut dtest, dwrite=",m,n);
     //gl.enable(gl.CULL_FACE);
   //gl.frontFace(gl.CCW);
   //  gl.cullFace(gl.FRONT);
    // set projection and mv matrix
    
    var w = gl.canvas.width;
    var h = gl.canvas.height;
    var asp  = w/h;
    var cgLayer = Mad3D.RenderLayer.default+1;
    var cam = initCamera(asp);
    cam.name = "main";
    //cam.renderMask = RenderMask.layers;
    //cam.addRenderLayer(cgLayer);
    var cam2 = initCamera(asp);
    cam2.depth = 30;
    cam2.name = "texcam";
    /**@type {RenderTexture} */
    var rt = new Mad3D.RenderTexture("Camera",w,h);
    rt.elType = Mad3D.TextureElemType.float;
    cam2.renderTarget = rt;
    cam2.renderMask =Mad3D.RenderMask.layers;
    cam2.addRenderLayer(Mad3D.RenderLayer.default);
    //create scene
    var scene = new Mad3D.Scene();
    scene.clearColor = [0.5,0.5,0.5,1.0];
    createLights(scene);
    scene.addCamera(cam2);
    scene.addCamera(cam);
   //scene.entityList = [];

    var sky = createSkyBox();
    
    scene.addEntity(sky);
    var ent2 = createEntity(scene);
    scene.addEntity(ent2);
   
    var ent1 = createHdrEntity(scene,cam2.renderTarget,asp);
  
    //ent1.transform.rotate(0,0,180);
    ent1.setRenderLayer(cgLayer);
    scene.addEntity(ent1);
    var initPos = new Mad3D.Vector3(cam.transform.pos.x,cam.transform.pos.y,cam.transform.pos.z);
    cam.transform.rotOrder = Mad3D.RotationOrder.zyx;
    Mad3D.InteractUtil.registerMovehandler(gl.canvas,cam.transform,[360,45],function(tf){
        var r = Math.sqrt(initPos.x*initPos.x +initPos.y*initPos.y + initPos.z*initPos.z);
        var cita = tf.rot.x*Math.PI/180.0;
        tf.pos.y = -1.0*r*Math.sin(cita);
        var l  = 1.0*r*Math.cos(cita);
        var cita2 = tf.rot.y*Math.PI/180.0;
        tf.pos.x =l*Math.sin(cita2);
        tf.pos.z =l*Math.cos(cita2);
        cam2.transform.copyFrom(cam.transform);
    });
    scene.gl = gl;
    var mat = ent1.material;
    var m2 = Mad3D.MaterialAni(scene,mat,"hdrExposure",
        {
            targets: mat.shaderOption,
            hdrExposure: 10.0,
            duration: 5000,
            direction: 'alternate',
            loop: 4,
            easing: 'linear',
            autoplay:true,
            update: function(anim) {
            }
        });
    var tf = ent2.transform;
    var m1 = Mad3D.TransformAni(scene,tf,{
            targets: tf.pos,
            z: -10,
            duration: 2000,
            direction: 'alternate',
            loop: 4,
            easing: 'linear',
            autoplay:false,
            update: function(anim) {
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



