/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-11-03 21:04:12
 * @Description: file content
 */
// step1: create boxes first as parent 
// step2: init physics {mass(0.1),v,ks(50),kd(0.02-0.05),l0(0.12),pos,isFixed}
// step3: register frame loop
// step4: update forces for each boxes 
// F = m*g-up(fp-fd) +down(fp-fd)
// a = f/m  v+= a*dt  x +=v*dt

// step5: update v, pos
//// 1 unit for 0.05m 
// 0.2 (draw) -->1unit


function initScene(){
   //default scene
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
   // ds.camera.transform.setPosition(0,0,-100);
  
   //  var cz =ds.camera.transform.pos.z;
   //var py = Math.tan(ds.camera.fov*0.5*Math.PI/180.0)*cz;
   ds.camera.setNear(10);
   ds.camera.setFar(1000);
   var cz = 200/Math.tan(ds.camera.fov*0.5*Math.PI/180.0);
   ds.camera.transform.setPosition(0,0,cz);
   console.log(ds.camera.transform.pos,ds.camera.transform.rot);
   console.log("n=",ds.camera.near,"f=",ds.camera.far,"fov=",ds.camera.fov,"asp=",ds.camera.asp);

   // interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){ 
   });
   var particleM = MeshUtil.createBox(10,10,10);

   var anchor = SceneUtil.createEntity(ds.scene,"anchor",
   {mesh:particleM,receiveLight:false,receiveShadow:false,matColor:[1.0,1.0,0.0,1.0]});
   ds.resetPos = new Vector3(50,0,50);
   anchor.transform.setPosition(-50,0,50);
   ds.scene.addEntity(anchor);
   

   var particle = SceneUtil.createEntity(ds.scene,"box",{mesh:particleM,
      receiveLight:true,receiveShadow:false,matColor:[0.2,1.0,0.2,1.0]});
   
   particle.transform.setPosition(ds.resetPos.x,ds.resetPos.y,ds.resetPos.z);
   ds.scene.addEntity(particle);
   particle.rigid = new PhysicalPartice({anchor:anchor.transform.pos});
   particle.rigid.bind(particle.transform);
   particle.rigid.setKinematic(true);

   var pmesh = MeshUtil.createBox(500,1,500);
   var plane = SceneUtil.createEntity(ds.scene,"plane",
   {mesh:pmesh,receiveLight:false,receiveShadow:false,matColor:[0.3,0.2,0.2,1.0]});
   plane.transform.setPosition(0,-100,0);
   ds.scene.addEntity(plane);
  // var pMesh  = MeshUtil.createBox(1000,0.0,1000);
  var pMesh  = MeshUtil.createGridMesh(5,5,50,50,0,false,false);
 // pMesh.setPrimitiveType(PrimitiveType.Line);
  
   var enti = SceneUtil.createEntity(ds.scene,"ground",{mesh:pMesh,
      receiveLight:false,receiveShadow:false,matColor:[0.9,0.3,0.5,1.0],
      enableCull:false
   });
   var cloth = new ClothSpring();
   cloth.bindMesh(pMesh);
  cloth.setKinematic(true);
   ds.cloth = cloth;
   enti.transform.setPosition(0,0,0);
   ds.scene.addEntity(enti);
   ds.particle = particle;
   return ds;
}
function startWork(ds){
   ds.particle.rigid.setKinematic(false);
   ds.particle.rigid.setVelocityY(0.0);
   ds.cloth.setKinematic(false);
}
function reset(ds){
   ds.particle.transform.setPosition(ds.resetPos.x,ds.resetPos.y,ds.resetPos.z);
   ds.particle.rigid.setKinematic(true);
   ds.cloth.setKinematic(true);
}

function UI(ds){
  // var rg_pr = document.getElementById("range");
   document.getElementById("btn_hit").addEventListener("click",function(evt){
         startWork(ds);
      
   });
   document.getElementById("btn_reset").addEventListener("click",function(evt){
     
         reset(ds);
   });
}

 function main(){
    var ds = initScene();
    //scene.enableActiveDraw(true);
   UI(ds);
    ds.scene.draw();
}

window.onload = main;



