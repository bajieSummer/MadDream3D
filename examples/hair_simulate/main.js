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
      this.gravity = params.gravity===undefined ?10:params.gravity;
      this.mass = params.mass === undefined ?10:params.mass;
      this.positionY = params.positionY === undefined ?100:params.positionY;
      this.velocityY = params.velocityY === undefined ?0:params.velocityY;
      this.timestep = params.timestep === undefined ?0.02:params.timestep;
      this.updateHandler = null;
   }
   update(timestep){
      var fy = this.gravity * this.mass;
      var a = fy/mass;
      this.velocityY = this.velocityY + a*timestep;
      this.positionY = positionY + this.velocityY*timestep;
   }
   run(){
      var that = this;
      that.updateHandler = window.setInterval(function() {
         that.update(that.timestep);
      },this.timestep);
   }
   dispose(){
      window.clearInterval(this.updateHandler);
   }
};

function initScene(){
   //default scene
    window.ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.camera.transforms.setPosition(0,0,-100);
    console.log("n=",ds.camera.near,"f=",ds.camera.far,"fov=",ds.camera.fov);

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){ 
   });

   var pMesh  = MeshUtil.createBox(10,0.0,10);
   var enti = SceneUtil.createEntity(ds.scene,"ground",{mesh:pMesh,
      receiveLight:true,receiveShadow:false,matColor:[0.3,0.3,0.5,1.0]
   });
   enti.transform.setPosition(0,-1.5,0);
  ds.scene.addEntity(enti);
  
   

   return ds.scene;
}

 function main(){
    var scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



