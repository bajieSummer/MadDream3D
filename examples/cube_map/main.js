/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-24 18:26:06
 * @Description: file content
 */
function initCamera(asp){
    console.log("camera,asp:",asp);
    var cam = new Camera();
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
    var mesh = MeshUtil.createBox(1,1,1);
    var shaderOps = new ShaderOption();
    shaderOps.depthTest = false;
    shaderOps.depthWrite = false;
    shaderOps.cullFace = "FRONT";
    var pf = "../pics/cube/bridge/";
    shaderOps.cubeMap =[  pf+"posx.jpg",pf+"negx.jpg",pf+"posy.jpg",
                        pf+"negy.jpg",pf+"posz.jpg",pf+"negz.jpg"
                      
                        ];
    var material = MaterialUtil.createFromShaderOption(shaderOps);
    var entity = new Entity("skybox");
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
    var dlt = new DirectionLight();
    dlt.color = new Vector3(1.0,1.0,1.0);
    dlt.specular = new Vector3(1.0,1.0,1.0);
    dlt.transform.setPosition(2.0,2.0,2.0);
    //dlt.transform.setPosition(-2.0,-2.0,0.0);
    //dlt.specular = new Vector3(0.9,0.9,0.9);

    //pointLight
    var dlt2 = new PointLight();
    //dlt2.color = new Vector3(1.0,1.0,1.0);
    dlt2.transform.setPosition(-3.0,0.0,0.0);
    dlt2.constant = 0.95;
    dlt2.linear = 0.07;
    dlt2.quadratic = 0.001;

    scene.dirLights = [];
    scene.dirLights.push(dlt);
    scene.pointLights = [];
    //scene.pointLights.push(dlt2);
    scene.ambientLight = new Vector3(0.5,0.5,0.5);

}

function createEntity(scene){
   // var mesh = MeshUtil.createPlane(2,2,0);
   var mesh = MeshUtil.createSphere(1,30,30);
    var shaderOps = new ShaderOption();
   
    
    //shaderOps.vertexColor = true;
  //  shaderOps.matColor = [0.0,1.0,1.0,1.0];
   //shaderOps.normalMap = "../pics/mars_normal.png";
   // shaderOps.texture0 = "../pics/test3.jpg";
  // shaderOps.texture0 = "../pics/earthmap1k.jpg";
   //shaderOps.texture0 = "../pics/mars_1k_color.jpg";
    shaderOps.diffuse = new Vector3(0.7,0.7,0.7);
    shaderOps.specular = new Vector3(0.8,0.8,0.8);
    shaderOps.shininess = 10.0;
    shaderOps.dirLightCount = scene.dirLights.length;
    shaderOps.pointLightCount =scene.pointLights.length; 
    var pf = "../pics/cube/bridge/";
    shaderOps.envMap = [pf+"posx.jpg",pf+"negx.jpg",pf+"posy.jpg",
    pf+"negy.jpg",pf+"posz.jpg",pf+"negz.jpg"
    ];
    shaderOps.reflective = 1.0;
   // console.log(shaderOps.dirLightCount,shaderOps.pointLightCount);
    /**@type {Material} */
    var material = MaterialUtil.createFromShaderOption(shaderOps,scene);
    
    var entity = new Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    entity.transform.setPosition(0,0,0);
    
    return entity;
    
}

function initScene(){
    /**@type {WebGLRenderingContext} */
    var gl = CanvasUtil.initCanvas("sipc");
    gl.canvas.width = gl.canvas.clientWidth*2.0;
    gl.canvas.height = gl.canvas.clientHeight*2.0;
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    //gl.enable(gl.DEPTH_TEST);
    var m = gl.getParameter(gl.DEPTH_TEST);
    var n = gl.getParameter(gl.DEPTH_WRITEMASK);
    console.log("defaut dtest, dwrite=",m,n);
     //gl.enable(gl.CULL_FACE);
   //gl.frontFace(gl.CCW);
   //  gl.cullFace(gl.FRONT);
    // set projection and mv matrix
    gl.getExtension('EXT_shader_texture_lod');
    var w = gl.canvas.clientWidth;
    var h = gl.canvas.clientHeight;
    var asp  = w/h;
    var cam = initCamera(asp);
    //create scene
    var scene = new Scene();
    scene.clearColor = [0.5,0.5,0.5,1.0];
    createLights(scene);
    scene.addCamera(cam);
    scene.entityList = [];

    var sky = createSkyBox();
    scene.entityList.push(sky);

    var ent1 = createEntity(scene);
    scene.entityList.push(ent1);
    var initPos = new Vector3(cam.transform.pos.x,cam.transform.pos.y,cam.transform.pos.z);
    cam.transform.rotOrder = RotationOrder.zyx;
    InteractUtil.registerMovehandler(gl.canvas,cam.transform,[360,45],function(tf){
        var r = Math.sqrt(initPos.x*initPos.x +initPos.y*initPos.y + initPos.z*initPos.z);
        var cita = tf.rot.x*Math.PI/180.0;
        tf.pos.y = -1.0*r*Math.sin(cita);
        var l  = 1.0*r*Math.cos(cita);
        var cita2 = tf.rot.y*Math.PI/180.0;
        tf.pos.x =l*Math.sin(cita2);
        tf.pos.z =l*Math.cos(cita2);
    });
    scene.gl = gl;

    var m2 = TransformAni(scene,cam.transform,
        {
            targets: cam.transform.rot,
            y: 360,
            duration: 6000,
            direction: 'alternate',
            loop: 4,
            easing: 'linear',
            autoplay:false,
            update: function(anim) {
                var cita = cam.transform.rot.y*Math.PI/180.0;
                cam.transform.pos.z = 6.0*Math.cos(cita);
                cam.transform.pos.x = 6.0*Math.sin(cita);
                //console.log("dd",anim.progress);
            }
        });


        var m1 = TransformAni(scene,cam.transform,
            {
                targets: cam.transform.rot,
                x: 360,
                duration: 6000,
                direction: 'alternate',
                loop: 4,
                easing: 'linear',
                autoplay:false,
                update: function(anim) {
                    var cita = cam.transform.rot.x*Math.PI/180.0;
                    cam.transform.pos.z = 6.0*Math.cos(cita);
                    cam.transform.pos.y = -1.0*6.0*Math.sin(cita);
                    console.log(cita);
                    console.log(cam.transform.pos);
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



