/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
 * @Description: file content
 */

function initScene(){
   //default scene
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:true});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    
    //main camera
    var ui_layer = Mad3D.RenderLayer.default +10;
    ds.camera.renderMask = Mad3D.RenderMask.layers;
    ds.camera.addRenderLayer(ui_layer);
    
    //light
    var lt = ds.dirLight;
    lt.color = new Mad3D.Vector3(0.5,0.8,0.8);
    lt.specular = new Mad3D.Vector3(1.0,1.0,1.0);

    // hdr camera 2color buffers
    var rt = new Mad3D.RenderTexture(Mad3D.TextureUrl.camera,w,h);
    rt.elType = Mad3D.TextureElemType.float;
    rt.assitColorBuffers = [];
    var col1 = new Mad3D.Texture(Mad3D.TextureUrl.camera,w,h);
    col1.elType = Mad3D.TextureElemType.float;
    rt.assitColorBuffers.push(col1);
    /**@type {Camera} */
    var hdr_cam = Mad3D.CameraUtil.createCamera(45,0.1,100,w/h);
    hdr_cam.transform.setPosition(0,0,8);
    hdr_cam.renderTarget = rt;
    hdr_cam.name="hdr_cam";
    hdr_cam.renderMask =Mad3D.RenderMask.layers;
    hdr_cam.clearColor = [0.0,0.0,0.0,1.0];
    hdr_cam.addRenderLayer(Mad3D.RenderLayer.default);
    hdr_cam.type = Mad3D.CameraType.bloom_col2;
    ds.scene.addCamera(hdr_cam);
    ds.scene.hdr_bloom = true;

    //skybox
    var skybox = Mad3D.SceneUtil.createSkyBox(ds.scene);
    ds.scene.addEntity(skybox);        
     
    //small sphere
   var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"sphere",
   {receiveLight:true,receiveShadow:false});
   ds.scene.addEntity(enti1);

   //floor
    var meshP = Mad3D.MeshUtil.createBox(5,0.5,10);
   var enti2 = Mad3D.SceneUtil.createEntity(ds.scene,"floor",
   {mesh:meshP,receiveLight:true,receiveShadow:true});
    enti2.transform.setPosition(0,-2,-2);
    ds.scene.addEntity(enti2);

    //light cube
    var lcb_mesh = Mad3D.MeshUtil.createBox(0.5,0.5,0.5);
    var lcb = Mad3D.SceneUtil.createEntity(ds.scene,"light_cube",
    {mesh:lcb_mesh,receiveLight:false,matColor:[0.6,1.2,1.2,1.0],receiveShadow:false});
    lcb.transform.setPosition(2,2,2);
    ds.scene.addEntity(lcb);

    

    //blur camera
    var tA = Mad3D.CameraUtil.createRTCamera(w,h,10,[ui_layer]);
    tA.name ="tA";
    tA.clearColor = [0.0,0.0,0.0,1.0];
    var tB = Mad3D.CameraUtil.createRTCamera(w,h,11 [ui_layer]);
    tB.clearColor = [0.0,0.0,0.0,1.0];
    tB.name="tB";
    
    //blur material
    var matA=Mad3D.SceneUtil.createMaterial(ds.scene,{vgsBlur:true,receiveLight:false,
        texture0:tA.renderTarget});  
    var matB = Mad3D.SceneUtil.createMaterial(ds.scene,{hgsBlur:true,receiveLight:false,
        texture0:tB.renderTarget});
    //final blend material
    var matC = Mad3D.SceneUtil.createMaterial(ds.scene,
        {receiveLight:false,texture0:tB.renderTarget,texture1:rt,
            hdrExposure:0.01,texBlend:Mad3D.TextureBlend.Add});
    
    //screen plane
    var pmesh = Mad3D.MeshUtil.createCameraPlane(ds.camera);
    var ent_cl2 = Mad3D.SceneUtil.createEntity(ds.scene,"screen_plane",
    {mesh:pmesh,vgsBlur:true,receiveLight:false,texture0:col1,hdrExposure:1.0});
    ent_cl2.setRenderLayer(ui_layer);
    ds.scene.addEntity(ent_cl2);
    
    //blur light passes
    var passlayer = ent_cl2.material.passLayers[0];
    var pass0 = passlayer.passList[0];
    pass0.subList[0].setTarget(tA);  //first pass0 --> col1-->tA  blur1
        
    var pass1 = new Mad3D.Pass(matA,tB); // second pass1:: sub0 tA -->tB
    pass1.loop = 5;
    passlayer.passList.push(pass1);
    pass1.subList.push(new Mad3D.SubPass(matB,tA)); //second pass1:sub1 tB -->tA
    
    var pass2 = new Mad3D.Pass(matC,Mad3D.CameraType.default); //third pass2:
    passlayer.passList.push(pass2);
    
    // follow main camera 
    var trans = ds.camera.transform;
    hdr_cam.transform.copyFrom(trans);
    tA.transform.copyFrom(trans);
    tB.transform.copyFrom(trans);
    ent_cl2.transform.rotOrder = Mad3D.RotationOrder.zyx;
    ent_cl2.transform.copyFrom(trans);

    //interaction
    Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
        hdr_cam.transform.copyFrom(trans);
        tA.transform.copyFrom(trans);
        tB.transform.copyFrom(trans);
        ent_cl2.transform.copyFrom(trans);
        //entsd.transform.copyFrom(trans);
   });
    var m2 = Mad3D.MaterialAni(ds.scene,matC,"hdrExposure",
    {
        targets: matC.shaderOption,
        hdrExposure: 5.0,
        duration: 5000,
        direction: 'alternate',
        loop: 10,
        easing: 'linear',
        autoplay:true,
        update: function(anim) {
        }
    });
var tf = enti1.transform;
var m1 = Mad3D.TransformAni(ds.scene,tf,{
        targets: tf.pos,
        y: 5,
        duration: 2000,
        direction: 'alternate',
        loop: 4,
        easing: 'linear',
        autoplay:false,
        update: function(anim) {
        }
});

   return ds.scene;
}

 function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



