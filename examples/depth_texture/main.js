/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
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
    transform.setPosition(0,0,8);
    //transform.rotate(-90,0,0);
    return cam;
}
var mdg = {};


function createLights(scene,lp){
    // directionLight
    var dlt = new DirectionLight();
    //dlt.color = new Vector3(1.0,1.0,1.0);
   // dlt.transform.setPosition(-1.0*lightPos.x,-1.0*lightPos.y,-1.0*lightPos.z);
    //dlt.transform.setPosition(-2.0,-2.0,0.0);
    //dlt.specular = new Vector3(0.9,0.9,0.9);

    //pointLight
    var dlt2 = new PointLight();
    //dlt2.color = new Vector3(1.0,1.0,1.0);
    dlt2.transform.setPosition(lp.x,lp.y,lp.z);
    dlt2.constant = 0.95;
    dlt2.linear = 0.07;
    dlt2.quadratic = 0.001;

    scene.dirLights = [];
   // scene.dirLights.push(dlt);
    scene.pointLights = [];
    scene.pointLights.push(dlt2);
    scene.ambientLight = new Vector3(0.3,0.3,0.3);

}

function createEntity(scene,mesh,color,isL){
    //var mesh = MeshUtil.createPlane(2,2,0);
    if(mesh === undefined){
        mesh = MeshUtil.createSphere(1,20,20);
    }

    var shaderOps = new ShaderOption();
     var r= Math.random();
     shaderOps.matColor = [0.3,0.5,1.0,1.0];
     if(color !== undefined && color instanceof Array){
        shaderOps.matColor = color;
     }
    
    
    if(isL ===false){

    }else{
        shaderOps.diffuse = new Vector3(1.0,1.0,1.0);
       shaderOps.specular = new Vector3(2.2,2.2,2.2);
      shaderOps.shininess = 10.0;
      shaderOps.dirLightCount = scene.dirLights.length;
      shaderOps.pointLightCount =scene.pointLights.length; 
 
    }
     /**@type {Material} */
     var material = MaterialUtil.createFromShaderOption(shaderOps,scene);
     
     var entity = new Entity("t2");
     entity.mesh = mesh;
     entity.material = material;
     entity.transform.setPosition(1.5,0,0);
     //entity.transform.scale(1.0,1.0,0.5);
     
     return entity;
     
 }

function createDepthEntity(scene,tex,ratio){
    var mesh = MeshUtil.createPlane(2*ratio,2,0);
    var shaderOps = new ShaderOption();
    shaderOps.matColor = [0.0,1.0,1.0,1.0];
    //shaderOps.texture0 = "../pics/memorial.hdr";
    shaderOps.texture0 =tex;//"../pics/earthmap1k.jpg";
    
    shaderOps.fbody_add = `
       float n = 0.1;
       float f = 100.0;
       float z = gl_FragColor.x;
       float grey = (2.0 * n) / (f + n - z*(f-n));
       gl_FragColor = vec4(grey, grey, grey, 1.0);
    `;

    
    /**@type {Material} */
    var material = MaterialUtil.createFromShaderOption(shaderOps,scene);
    var entity = new Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    entity.transform.setPosition(-1.5,0.5,0);


    return entity;
}

function initScene(){
    /**@type {WebGLRenderingContext} */
    var gl = CanvasUtil.initCanvas("sipc");
    gl.canvas.width = gl.canvas.clientWidth*2.0;
    gl.canvas.height = gl.canvas.clientHeight*2.0;
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
   
    var w = gl.canvas.width;
    var h = gl.canvas.height;
    var asp  = w/h;
    var cgLayer = RenderLayer.default+1;
    var cam = initCamera(asp);
    cam.name = "main";
    //cam.renderMask = RenderMask.layers;
     //cam.addRenderLayer(cgLayer);
    var cam2 = initCamera(asp);
    //cam2.depth = 30;
    cam2.name = "texcam";
    cam2.clearColor =[1.0,1.0,1.0,1.0];
    var lightPos = new Vector3(0,5,0.0);
    cam2.transform.setPosition(lightPos.x,lightPos.y,lightPos.z);
    cam2.transform.rotate(-90,0,0);
    cam2.clearMask = ClearMask.onlyDepth;
    //cam2.clearMask = ClearMask.notClear;
    /**@type {RenderTexture} */
    var rt = new RenderTexture("Camera",w,h);
    rt.hasColorBuffer = false;
    cam2.renderTarget = rt;
    cam2.renderMask =RenderMask.layers;
    cam2.addRenderLayer(RenderLayer.default);
    //create scene
    var scene = new Scene();
    scene.clearColor = [0.5,0.5,0.5,1.0];
    createLights(scene,lightPos);
    scene.addCamera(cam2);
    scene.addCamera(cam);
   //scene.entityList = [];
    
   
    var ent1 = createDepthEntity(scene,cam2.renderTarget,asp);
    ent1.transform.setPosition(-3,2.0,0);
    var ent2 = createEntity(scene);
    

    var meshp = MeshUtil.createCircle(3,9);
    var ent3 = createEntity(scene,meshp,[0.7,0.7,0.7,1.0],false);
    ent3.transform.setPosition(0,-2,0);
    scene.addEntity(ent2);
    scene.addEntity(ent3);
    //ent1.transform.rotate(0,0,180);
    ent1.setRenderLayer(cgLayer);
    scene.addEntity(ent1);
    var initPos = new Vector3(cam.transform.pos.x,cam.transform.pos.y,cam.transform.pos.z);
    InteractUtil.registerMovehandler(gl.canvas,cam.transform,[360,45],function(tf){
        var r = Math.sqrt(initPos.x*initPos.x +initPos.y*initPos.y + initPos.z*initPos.z);
        var cita = tf.rot.x*Math.PI/180.0;
        tf.pos.y = -1.0*r*Math.sin(cita);
        var l  = 1.0*r*Math.cos(cita);
        var cita2 = tf.rot.y*Math.PI/180.0;
        tf.pos.x =l*Math.sin(cita2);
        tf.pos.z =l*Math.cos(cita2);
        //cam2.transform.copyFrom(cam.transform);
    });
    scene.gl = gl;
  
    var tf = ent2.transform;
    var m1 = TransformAni(scene,tf,{
            targets: tf.pos,
            x: -2,
            duration: 2000,
            direction: 'alternate',
            loop: 4,
            easing: 'linear',
            autoplay:true,
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



