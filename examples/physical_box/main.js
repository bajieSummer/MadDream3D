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


class PhysicalPartice{
   constructor(params){
      if (params === undefined) {
         params = {};
      }
      this.gravity = params.gravity===undefined ?new Mad3D.Vector3(0.0,-10.0,0.0):params.gravity;
      this.mass = params.mass === undefined ?30:params.mass;
      this.k = params.k === undefined ?7:params.k;
      this.anchor = params.anchor === undefined ?new Mad3D.Vector3(0.0,40,0.0):params.anchor;
      this.damp = params.damp === undefined ?5:params.damp;
      console.log("anchor=",this.anchor);
    
      // this.positionY = params.positionY === undefined ?100:params.positionY;
      this.velocity = params.velocity === undefined ?new Mad3D.Vector3(0.0,0.0,0.0):params.velocity;
      this.timestep = params.timestep === undefined ?0.28:params.timestep;
      this.updateHandler = null;
      this.isKinematic =false;
   }
   update(timestep,transform){
      var pos = transform.pos;
      var sfy = this.k*(this.anchor.y - pos.y) + this.damp*(-1.0)*this.velocity.y;
      var sfx = this.k*(this.anchor.x - pos.x) + this.damp*(-1.0)*this.velocity.x;
      var sfz = this.k*(this.anchor.z - pos.z) + this.damp*(-1.0)*this.velocity.z;
   
      // var fy = df+sf + this.gravity * this.mass;
      var ax = sfx/this.mass + this.gravity.x;
      var ay = sfy/this.mass + this.gravity.y;
      var az = sfz/this.mass + this.gravity.z;
      
      this.velocity.x += ax*timestep;
      this.velocity.y += ay*timestep;
      this.velocity.z += az*timestep;
      
      // pos.x  += this.velocity.x*timestep;
      // pos.y  += this.velocity.y*timestep;
      // pos.z  += this.velocity.z*timestep;
      transform.setPosition(pos.x+this.velocity.x*timestep,
                           pos.y+this.velocity.y*timestep,
                           pos.z+this.velocity.z*timestep);

   }
   bind(transform){
      var that = this;
      that.updateHandler = window.setInterval(function() {
         if(!that.isKinematic){
            that.update(that.timestep,transform);
           
         }
         
      },16.6);
   }
   dispose(){
      window.clearInterval(this.updateHandler);
   }
   setKinematic(isK){
      this.isKinematic = isK;
   }
   setVelocityY(v){
      this.velocity.y = v;
   }
   setVelocityX(v){
      this.velocity.x = v;
   }
   setVelocityZ(v){
      this.velocity.z = v;
   }
}

function initScene(){
   //default scene
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
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
   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){ 
   });
   var particleM = Mad3D.MeshUtil.createBox(10,10,10);

   var anchor = Mad3D.SceneUtil.createEntity(ds.scene,"anchor",
   {mesh:particleM,receiveLight:false,receiveShadow:false,matColor:[1.0,1.0,0.0,1.0]});
   ds.resetPos = new Mad3D.Vector3(20,81,0);
   anchor.transform.setPosition(0,0,0);
   ds.scene.addEntity(anchor);
   

   var particle = Mad3D.SceneUtil.createEntity(ds.scene,"box",{mesh:particleM,
      receiveLight:true,receiveShadow:false,matColor:[0.2,1.0,0.2,1.0]});
   
   particle.transform.setPosition(ds.resetPos.x,ds.resetPos.y,ds.resetPos.z);
   ds.scene.addEntity(particle);
   particle.rigid = new PhysicalPartice({anchor:anchor.transform.pos});
   particle.rigid.bind(particle.transform);
   particle.rigid.setKinematic(true);

   
   

var pMesh  = Mad3D.MeshUtil.createBox(1000,0.0,1000);

   var enti = Mad3D.SceneUtil.createEntity(ds.scene,"ground",{mesh:pMesh,
      receiveLight:false,receiveShadow:false,matColor:[0.9,0.3,0.5,1.0]
   });
  
   enti.transform.setPosition(0,0,0);
   ds.scene.addEntity(enti);
   ds.particle = particle;
   return ds;
}
function startWork(ds){
   ds.particle.rigid.setKinematic(false);
   ds.particle.rigid.setVelocityY(0.0);
}
function reset(ds){
   ds.particle.transform.setPosition(ds.resetPos.x,ds.resetPos.y,ds.resetPos.z);
   ds.particle.rigid.setKinematic(true);
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



