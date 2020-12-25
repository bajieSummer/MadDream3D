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
    window.ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    var Dimensions = {unit:0.9,peru:0.5,g:new Vector3(0.0,-9.8,0.0)};
    var STP = {mass:0.02,ks:20,kd:0.2,l0:0.12,isFixed:false};
    var spr1 = new SlopeSpring({Dimensions:Dimensions,STP:STP});
    ds.linePos = [];
    var spr = spr1.createSprJoint({x:0,y:2,z:0},{perJoint:function(spring,ind,pos){
      ds.linePos.push(pos.x,pos.y,pos.z);
    }});
    var callbacks ={};
    callbacks.perJoint = function(spring,j,dp){
      ds.linePos[j*3] = dp.x;ds.linePos[j*3+1] = dp.y;
      ds.linePos[j*3+2] = dp.z;
    };
    callbacks.afterUpdate = function(spring){
      ds.lineMesh.updateAllVertexPos(ds.linePos);
    };

    spr1.run(callbacks,0.01);
   
  var slt_ind = document.getElementById("slt_inds");
  var slt_axis = document.getElementById("slt_axis");
  var rg_power = document.getElementById("rg_power");
  document.getElementById("btn_hit").addEventListener("click",function(e){
      console.log(slt_ind.value);
      var id = parseInt(slt_ind.value);
      var axis = slt_axis.value.split(",");
      var anp = parseInt(axis[1]);
      var power = parseFloat(rg_power.value);
      var de = 1.0*0.0014*power*anp/spr[id].mass;
      var dv =null; 
      if(axis[0] ==="z"){
         dv = new Vector3(0,0,de);
      }else{
         dv = new Vector3(de,0,0);
      }
      spr[id].v =  MathUtil.V3ADDV3(spr[id].v,dv);
  });

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){ 
   });

   var pMesh  = MeshUtil.createBox(10,0.2,10);
   var enti = SceneUtil.createEntity(ds.scene,"ground",{mesh:pMesh,
      receiveLight:true,receiveShadow:false,matColor:[0.3,0.3,0.5,1.0]
   });
   enti.transform.setPosition(0,-1.5,0);
  ds.scene.addEntity(enti);
  
   // ds.linePos = [0, 2, 0, 0.1188, 1.7624, 0.04752000000000001, 0.2376, 1.5248, 0.09504000000000001, 0.3564, 1.2872, 0.14256, 0.4752, 1.0495999999999999, 0.19008000000000003, 0.594, 0.812, 
   //             0.2376, 0.7128, 0.5744, 0.28512, 0.8316, 0.3368, 0.33264000000000005, 0.9504, 0.09919999999999995, 0.38016000000000005, 1.0692, -0.13839999999999986, 0.42768];
   
  ds.lineMesh = MeshUtil.createLine(ds.linePos,null);
   var linenti = SceneUtil.createEntity(ds.scene,"line",{mesh:ds.lineMesh,
      receiveLight:false,receiveShadow:false,matColor:[0.7,0.9,0.4,1.0]
   });
   ds.scene.addEntity(linenti);

   return ds.scene;
}

 function main(){
    var scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



