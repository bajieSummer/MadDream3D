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
    console.log("canvas width="+w+"canvas height="+h);
    ds.camera.clearColor = [1.0,1.0,1.0,1.0];
    //light
    var lt = ds.dirLight;
    lt.color = new Mad3D.Vector3(0.5,0.8,0.8);
    lt.specular = new Mad3D.Vector3(1.0,1.0,1.0);

    var fbody_fog2=`
    float n = 0.1;
    float f = 100.0;
float start = 0.15;
float end = 0.4;
vec4 fogColor = vec4(1.0);
float z = gl_FragCoord.z;
z =  (2.0 * n) / (f + n - z*(f-n));
float fogFactor = (z-start)/(end-start);
fogFactor = clamp(fogFactor,0.0,1.0);
gl_FragColor = mix(gl_FragColor,fogColor,fogFactor);
`;
var fbody_fog=`
float start = 1.0;
float end = 25.0;
vec4 fogColor = vec4(1.0);
float z = gl_FragCoord.z/gl_FragCoord.w;
float fogFactor = (z-start)/(end-start);
fogFactor = clamp(fogFactor,0.0,1.0);
gl_FragColor = mix(gl_FragColor,fogColor,fogFactor);
`;

var fbody_fog_exp=`
float density = 0.09;
const float LOG2 = 1.44265;
vec4 fogColor = vec4(1.0);
float z = gl_FragCoord.z/gl_FragCoord.w;
float fogFactor = exp2(-density*density*z*z*LOG2);
fogFactor = clamp(fogFactor,0.0,1.0);
gl_FragColor = mix(fogColor,gl_FragColor,fogFactor);
`;

    //skybox
    var skybox = Mad3D.SceneUtil.createSkyBox(ds.scene);
    //ds.scene.addEntity(skybox);        
     
    //small sphere
   var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"sphere",
   {matColor:[1.0,0.5,0.6,1.0],receiveLight:true,receiveShadow:false,enableFog:true,fogExp:{density:0.09}});
   ds.scene.addEntity(enti1);

   //floor
    var meshP = Mad3D.MeshUtil.createBox(100,0.5,100);
   var enti2 = Mad3D.SceneUtil.createEntity(ds.scene,"floor",
   {matColor:[0.1,0.5,0.6,1.0],mesh:meshP,receiveLight:true,receiveShadow:true,enableFog:true,fogExp:{density:0.09}});
    enti2.transform.setPosition(0,-2,-2);
    ds.scene.addEntity(enti2);

    //light cube
    var lcb_mesh = Mad3D.MeshUtil.createBox(0.5,0.5,0.5);
    var lcb = Mad3D.SceneUtil.createEntity(ds.scene,"light_cube",
    {mesh:lcb_mesh,receiveLight:false,matColor:[0.6,1.2,1.2,1.0],receiveShadow:false});
    lcb.transform.setPosition(2,2,2);
    ds.scene.addEntity(lcb);


    //interaction
   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
var tf = enti1.transform;
var m1 = Mad3D.TransformAni(ds.scene,tf,{
        targets: tf.pos,
        z: -20,
        duration: 5000,
        direction: 'alternate',
        loop: -1,
        easing: 'linear',
        autoplay:true,
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



