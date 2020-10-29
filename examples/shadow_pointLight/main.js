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

function createLights(scene,lp,shadowCamera,isPoint){
    // directionLight
    var dlt = null;
    

    //pointLight
    if(isPoint){
        dlt = new PointLight();
        dlt.transform.setPosition(lp.x,lp.y,lp.z);
        dlt.constant = 0.95;
        dlt.linear = 0.07;
        dlt.quadratic = 0.001;
        
    }else{
        dlt = new DirectionLight();
        dlt.transform.setPosition(-1.0*lp.x,-1.0*lp.y,-1.0*lp.z);
    }
    
   // scene.dirLights.push(dlt);
    scene.addLight(dlt);
    scene.ambientLight = new Vector3(0.3,0.3,0.3);
    if(shadowCamera instanceof Camera){
        dlt.castShadow = true;
        dlt.shadowCam = shadowCamera;
        var w = shadowCamera.renderTarget.width;
        var smooth_st = 1.0/w*2.5;
        dlt.shadowBias = 0.00001;
        dlt.shadowSmoothStep = smooth_st;
    }
    return dlt;

}
function createDepthMaterial(scene){
    var shaderOps = new ShaderOption();
    shaderOps.matColor = [1.0,1.0,1.0,1.0];
    return MaterialUtil.createFromShaderOption(shaderOps,scene);
}

function createEntity(scene,mesh,color,isL,receiveShadow,tex){
    //var mesh = MeshUtil.createPlane(2,2,0);
    if(mesh === undefined){
        mesh = MeshUtil.createSphere(1,100,100);
    }
    var shaderOps = new ShaderOption();
     var r= Math.random();
     shaderOps.matColor = [0.3,0.5,1.0,1.0];
     if(color !== undefined && color instanceof Array){
        shaderOps.matColor = color;
     }
     if(tex!==undefined){
        shaderOps.texture0 = tex;
     }
     
    if(receiveShadow){
        shaderOps.receiveShadow = receiveShadow;
    }
    if(isL ===false){

    }else{
        shaderOps.diffuse = new Vector3(1.0,1.0,1.0);
       shaderOps.specular = new Vector3(2.0,2.0,2.0);
      shaderOps.shininess = 5.0;
      var dirCount = 0; var pointCount = 0;
      if(!MathUtil.isNone(scene.dirLights)){
        dirCount = scene.dirLights.length;
      }
      if(!MathUtil.isNone(scene.pointLights)){
        pointCount = scene.pointLights.length;
      }
      shaderOps.dirLightCount = dirCount;
      shaderOps.pointLightCount =pointCount; 
      shaderOps.castShadow = true;
 
    }
     /**@type {Material} */
     var material = MaterialUtil.createFromShaderOption(shaderOps,scene);
     
     var entity = new Entity("t2");
     entity.mesh = mesh;
     entity.material = material;
     if(receiveShadow){
        // entity.depthMaterial = createDepthMaterial(scene);
        // entity.depthMaterial.name = "depthMaterial";
        var depthMat = createDepthMaterial(scene);
        depthMat.name = "depthMaterial";
        entity.material.addPassLayer(depthMat,CameraType.depth);
     }
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
    var cgLayer = RenderLayer.default+1;
    entity.setRenderLayer(cgLayer);
    return entity;
}

function initScene(){
    //step1 init canvas
    /**@type {WebGLRenderingContext} */
    var gl = CanvasUtil.initCanvas("sipc");
    gl.canvas.width = gl.canvas.clientWidth*2.0;
    gl.canvas.height = gl.canvas.clientHeight*2.0;
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    var w = gl.canvas.width;
    var h = gl.canvas.height;
    var asp  = w/h;
    console.log(asp);

    //step2 create scene
    var scene = new Scene();
    scene.gl = gl;
    scene.clearColor = [0.5,0.5,0.5,1.0];

    //step3 create main_camera
    var cam = CameraUtil.createDefaultCamera(asp);
    scene.addCamera(cam);

    var lightPos = new Vector3(0,10,0);
    //step4 create shadow Camera
    var sh_cam = CameraUtil.createShadowCamera(w,h,false,lightPos);
     sh_cam.setFov(55);
     sh_cam.setFar(100);
     sh_cam.setNear(0.1);
    scene.addCamera(sh_cam);
 

    //step5 create Lights
    createLights(scene,lightPos,sh_cam,true);
    var skb = SceneUtil.createSkyBox(scene);
    scene.addEntity(skb);
   // step6 create entity1: depth_plane
    var ent1 = createDepthEntity(scene,sh_cam.renderTarget,asp);
    ent1.transform.setPosition(-3,2.0,0);
    scene.addEntity(ent1);

    //step7 create entity2: sphere
    var ent2 = createEntity(scene); ent2.name="sphere";
    ent2.transform.setPosition(5,2.0,0);
    scene.addEntity(ent2);

    //step8 create entity3: floor plane
    var meshp = MeshUtil.createCircle(3,9); 
    //var meshp = MeshUtil.createBox(5,0.2,5);
    var ent3 = createEntity(scene,meshp,[0.2,0.7,0.7,1.0],true,true);
    ent3.name = "floor"; 
    ent3.transform.setPosition(0,-2.2,0);
    scene.addEntity(ent3);
    
    var meshp2 = MeshUtil.createDoughnuts(0.8,1.5,50,50);
    var ent4 = createEntity(scene,meshp2,[0.2,0.7,0.7,1.0],true,true);
    ent4.name = "floor2"; 
    ent4.transform.setPosition(0,-0.5,0);
    //ent4.transform.rotate(-90,0,0);
    scene.addEntity(ent4);

    //step9 register main camera move handler
    InteractUtil.registerCameraMove(cam,gl.canvas);
    
    //step10 add animation for entity2
    var tf = ent2.transform;
    var m1 = TransformAni(scene,tf,{
            targets: tf.pos,
            x: -5,
            duration: 10000,
            direction: 'alternate',
            loop: 10,
            easing: 'linear',
            autoplay:true,
            update: function(anim) {
            }
    });
    return scene;
}

 function main(){
    scene = initScene();
   // scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



