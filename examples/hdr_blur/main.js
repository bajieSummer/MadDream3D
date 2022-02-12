/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
 * @Description: file content
 */
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
   var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   ds.dirLight.color = new Mad3D.Vector3(1.0,1.0,1.0);
   ds.dirLight.specular = new Mad3D.Vector3(1.2,1.2,1.2); 
   var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;

   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas);
    var fh_add = `
        #extension GL_EXT_draw_buffers : require 
        `;
        // // gl_FragData[1] = gl_FragColor;
        //gl_FragData[1] = vec4(0.0,0.0,0.0,1.0);
    var fb_add= `
            if(gl_FragColor.b>1.0|| gl_FragColor.r>1.0 || gl_FragColor.b>1.0){
                gl_FragData[1] = gl_FragColor;
            }else{
                gl_FragData[1] = vec4(0.0,0.0,0.0,1.0);
            }
            `;
    
   var params ={fhead_add:fh_add,fbody_add:fb_add,receiveLight:true};
   var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"ent1",params);
   ds.scene.addEntity(enti1);
   var ui_layer = Mad3D.RenderLayer.default +1;
   ds.camera.renderMask = Mad3D.RenderMask.layers;
   ds.camera.addRenderLayer(ui_layer);

    var meshP = Mad3D.MeshUtil.createBox(5,0.5,10);
   var enti2 = Mad3D.SceneUtil.createEntity(ds.scene,"ent2",
   {fhead_add:fh_add,fbody_add:fb_add,mesh:meshP,receiveLight:true,receiveShadow:false});
    enti2.transform.setPosition(0,-2,-2);
    ds.scene.addEntity(enti2);

    var lcb_mesh = Mad3D.MeshUtil.createBox(0.5,0.5,0.5);
    var lcb = Mad3D.SceneUtil.createEntity(ds.scene,"light_cube",
        {fhead_add:fh_add,fbody_add:fb_add,mesh:lcb_mesh,receiveLight:false,matColor:[1.5,1.5,1.5,1.0]});
    lcb.transform.setPosition(2,2,2);
    ds.scene.addEntity(lcb);

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
    Mad3D.InteractUtil.registerCameraMove(hdr_cam,ds.scene.gl.canvas);
    ds.scene.addCamera(hdr_cam);


    var pmesh = Mad3D.MeshUtil.createPlane(3*w/h,3,0);
    var ent_cl1 = Mad3D.SceneUtil.createEntity(ds.scene,"color_normal",
    {mesh:pmesh,receiveLight:false,color:[1.0,1.0,1.0,1.0],texture0:rt});
    ent_cl1.setRenderLayer(ui_layer);
    ent_cl1.transform.setPosition(3.0,1.0,0);
    ds.scene.addEntity(ent_cl1);
    
   
    //fhead_add:fhead_blur_shader,fbody_add:fbody_blur_shader
    //var tA = CameraUtil.createRTCamera(w,h,10);
    //var tB = CameraUtil.createRTCamera(w,h,11);
    //  layerP main: pass1: col1 -->tA/blur ,pass2: tA-->tB , tB-->tA/blur  pass3:tA +rt-->main
    var ent_cl2 = Mad3D.SceneUtil.createEntity(ds.scene,"color_brighter",
    {lightBlur:true,mesh:pmesh,receiveLight:false,texture0:rt,texture_brighter:col1});
    ent_cl2.setRenderLayer(ui_layer);
    ent_cl2.transform.setPosition(-3.0,1.0,0);
    ds.scene.addEntity(ent_cl2);

    var m2 = Mad3D.MaterialAni(ds.scene,ent_cl2.material,"hdrExposure",
    {
        targets: ent_cl2.material.shaderOption,
        hdrExposure: 3.0,
        duration: 5000,
        direction: 'alternate',
        loop: 4,
        easing: 'linear',
        autoplay:false,
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



