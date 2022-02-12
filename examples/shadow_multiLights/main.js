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
    transform.setPosition(0,0,8);
    //transform.rotate(-90,0,0);
    return cam;
}

function createLight(scene,lp,castShadow,isPoint){
    // directionLight
    var dlt = null;
    //pointLight
    if(isPoint){
        dlt = new Mad3D.PointLight();
        dlt.transform.setPosition(lp.x,lp.y,lp.z);
        dlt.constant = 0.95;
        dlt.linear = 0.07;
        dlt.quadratic = 0.001;
        
    }else{
        isPoint = false;
        dlt = new Mad3D.DirectionLight();
        dlt.transform.setPosition(lp.x,lp.y,lp.z);
    }
    var w = scene.gl.canvas.width;
    var h = scene.gl.canvas.height;
    
   // scene.dirLights.push(dlt);
    if(castShadow){
        var sh_cam= Mad3D.CameraUtil.createShadowCamera(w,h,!isPoint,lp);
        scene.addCamera(sh_cam);
        dlt.castShadow = true;
        dlt.shadowCam = sh_cam;
        var smooth_st = 1.0/w*2.5;
        dlt.shadowBias = 0.00001;
        dlt.shadowSmoothStep = smooth_st;
    }
    scene.addLight(dlt);
    return dlt;

}
function createDepthMaterial(scene){
    var shaderOps = new Mad3D.ShaderOption();
    shaderOps.matColor = [1.0,1.0,1.0,1.0];
    return Mad3D.MaterialUtil.createFromShaderOption(shaderOps,scene);
}

function createEntity(scene,mesh,color,isL,receiveShadow,tex){
    //var mesh = MeshUtil.createPlane(2,2,0);
    if(mesh === undefined){
        mesh = Mad3D.MeshUtil.createSphere(1,20,20);
    }
    var shaderOps = new Mad3D.ShaderOption();
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
        shaderOps.diffuse = new Mad3D.Vector3(0.5,0.5,0.5);
       shaderOps.specular = new Mad3D.Vector3(0.8,0.8,0.8);
      shaderOps.shininess = 10.0;
      var dirCount = 0; var pointCount = 0;
      if(!Mad3D.MathUtil.isNone(scene.dirLights)){
        dirCount = scene.dirLights.length;
      }
      if(!Mad3D.MathUtil.isNone(scene.pointLights)){
        pointCount = scene.pointLights.length;
      }
      shaderOps.dirLightCount = dirCount;
      shaderOps.pointLightCount =pointCount; 
      shaderOps.castShadow = true;
 
    }
     /**@type {Material} */
     var material = Mad3D.MaterialUtil.createFromShaderOption(shaderOps,scene);
     
     var entity = new Mad3D.Entity("t2");
     entity.mesh = mesh;
     entity.material = material;
     if(receiveShadow){
        // entity.depthMaterial = createDepthMaterial(scene);
        // entity.depthMaterial.name = "depthMaterial";
         var depthMat = createDepthMaterial(scene);
         depthMat.name = "depthMaterial";
         entity.material.addPassLayer(depthMat,Mad3D.CameraType.depth);
     }
     entity.transform.setPosition(1.5,0,0);
     //entity.transform.scale(1.0,1.0,0.5);
     
     return entity;
     
 }

function createDepthEntity(scene,tex,ratio){
    var mesh = Mad3D.MeshUtil.createPlane(2*ratio,2,0);
    var shaderOps = new Mad3D.ShaderOption();
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
    var material = Mad3D.MaterialUtil.createFromShaderOption(shaderOps,scene);
    var entity = new Mad3D.Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    entity.transform.setPosition(-1.5,0.5,0);
    var cgLayer = Mad3D.RenderLayer.default+1;
    entity.setRenderLayer(cgLayer);
    return entity;
}

function initScene(){
    //step1 init canvas
    /**@type {WebGLRenderingContext} */
    var gl = Mad3D.CanvasUtil.initCanvas("sipc");
    gl.canvas.width = gl.canvas.clientWidth*2.0;
    gl.canvas.height = gl.canvas.clientHeight*2.0;
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    var w = gl.canvas.width;
    var h = gl.canvas.height;
    var asp  = w/h;
    console.log(asp);

    var ext = gl.getExtension('WEBGL_draw_buffers');
    
    //step2 create scene
    var scene = new Mad3D.Scene();
    scene.gl = gl;
    scene.clearColor = [0.5,0.5,0.5,1.0];

    //step3 create main_camera
    var cam = Mad3D.CameraUtil.createDefaultCamera(asp);
    scene.addCamera(cam);

    // step4 create ambient light
    scene.ambientLight = new Mad3D.Vector3(0.3,0.3,0.3);

    //step5 create diretional Light and show its depth map
    var lightPos_d = new Mad3D.Vector3(0,5,0);
    var dl = createLight(scene,lightPos_d,true,false);
    var ent1 = createDepthEntity(scene,dl.shadowCam.renderTarget,asp);
    ent1.transform.setPosition(-3,2.0,0);
    scene.addEntity(ent1);

     //step6 create point Light and show its depth map
    var lightPos_p = new Mad3D.Vector3(5,5,0);
    var  pl = createLight(scene,lightPos_p,true,true);
    var ent1_2 = createDepthEntity(scene,pl.shadowCam.renderTarget,asp);
    ent1_2.transform.setPosition(3,2.0,0);
    scene.addEntity(ent1_2);

    //step7 create entity2: sphere
    var ent2 = createEntity(scene); ent2.name="sphere";
    ent2.transform.setPosition(5,1.0,0);
    scene.addEntity(ent2);

    //step8 create entity3: floor plane
    var meshp = Mad3D.MeshUtil.createCircle(3,9); 
    //var meshp = MeshUtil.createBox(5,0.2,5);
    var ent3 = createEntity(scene,meshp,[0.2,0.7,0.7,1.0],true,true);
    ent3.name = "floor"; 
    ent3.transform.setPosition(0,-2.2,0);
    scene.addEntity(ent3);
    
    var meshp2 = Mad3D.MeshUtil.createDoughnuts(0.8,1.5,50,50);
    var ent4 = createEntity(scene,meshp2,[0.2,0.7,0.7,1.0],true,true);
    ent4.name = "floor2"; 
    ent4.transform.setPosition(0.0,-0.5,0);
    //ent4.transform.rotate(-90,0,0);
    scene.addEntity(ent4);

    //step9 register main camera move handler
    Mad3D.InteractUtil.registerCameraMove(cam,gl.canvas);
    
    //step10 add animation for entity2
    var tf = ent2.transform;
    var m1 = Mad3D.TransformAni(scene,tf,{
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



