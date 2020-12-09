/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
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
var Dimensions = {unit:0.9,peru:0.5};
var STP = {mass:0.02,ks:20,kd:0.2,l0:0.12,isFixed:false};

var SpPhyics = function(pos,v,isFixed,mass,ks,kd,l0){
   if(pos===undefined || v ===undefined){
      console.error("pos or v is undefined");
      return;
   }
   this.pos = pos; this.v = v; 
   this.mass = mass===undefined?STP.mass:mass;
   this.ks = ks===undefined?STP.ks:ks;
   this.kd = kd===undefined?STP.kd:kd;
   this.l0 = l0===undefined?STP.l0:l0;
   this.isFixed =isFixed ===undefined?STP.isFixed:isFixed;
};
// x = 0.12 m   1.2*0.1 =0.12

function draw2Physics(pos,phPos){
   var unit =Dimensions.unit;
   var peru = Dimensions.peru;
   var resPos = phPos;
   if(resPos === undefined) {
      resPos = new Vector3();
   }
   resPos.x = pos.x/unit*peru; 
   resPos.y = pos.y/unit*peru; 
   resPos.z = pos.z/unit*peru;
   return resPos;
}
function physics2Draw(pos,dPos){
   var unit =Dimensions.unit;
   var peru = Dimensions.peru;
   var resPos = dPos;
   if(resPos === undefined) {
      resPos = new Vector3();
   }
   resPos.x = pos.x/peru*unit; 
   resPos.y = pos.y/peru*unit; 
   resPos.z = pos.z/peru*unit;
   return resPos;
}

function createSpring(pos,scene,unit){
   var baseUrl = "../pics/MD3d_hello.png";      
   var smesh = MeshUtil.createBox(unit*0.1,unit*0.1,unit*0.1);
   var mat = SceneUtil.createMaterial(scene,{receiveLight:false,receiveShadow:false,
      texture0:baseUrl});
   var enti =SceneUtil.createEntity(scene,"box",
      {mesh:smesh,material:mat
      });
   enti.transform.setPosition(pos.x,pos.y,pos.z);
   // 1 unit for 0.05m 
   enti.physics = new SpPhyics(draw2Physics(pos),0.0,true);
   var entiArr = [enti];
   
   for(var i = 1; i<10; i++){
      var ct = enti.copy("box"+i);
      var d = enti.physics.l0*1.1/Dimensions.peru*unit;
      ct.transform.translate(0,(-d)*i,0);
      var phPos = draw2Physics(ct.transform.pos);
     // console.log("i=",i," phPos=",phPos," pos=",ct.transform.pos);
      ct.physics = new SpPhyics(phPos,0.0,false);
      entiArr.push(ct);
   }
   return entiArr;
}

function updateForces(i,entiArr){
   //F =up(fp+fd)+ m*g + down(fp+fd)
   var phy = entiArr[i].physics;
   if(phy.isFixed) return null;
   var phy0 =i>0?entiArr[i-1].physics:null;
   var phy1 =(i+1)<entiArr.length?entiArr[i+1].physics:null;
   var g = 9.8;
   //(entiArr.length-i)
   var G = -1.0*phy.mass*g;
   
   var F_air =-0.5*1.0*1.293*0.001*phy.v*Math.abs(phy.v);
   //for up:
   var upFp = 0.0; var upFd = 0.0;
   if(phy0!==null){
      var Xu = phy0.pos.y-phy.pos.y;
      var lenXu = Math.abs(Xu);
      upFp =phy0.ks*Xu/lenXu*(lenXu-phy0.l0);
      
      upFd =phy0.kd*(phy0.v-phy.v)*Xu/lenXu;
   }
   var dnFp = 0.0; var dnFd = 0.0;
   if(phy1!==null){
      var Xdn = phy.pos.y-phy1.pos.y;
      var lenXdn = Math.abs(Xdn);
      dnFp =-1.0*phy.ks*Xdn/lenXdn*(lenXdn-phy.l0);
      dnFd =-1.0*phy.kd*(phy.v-phy1.v)*Xdn/lenXdn;
   }
  // console.log("i=",i," upFp =",upFp, " upFd=",upFd, " dnFp=",dnFp," dnFd=",dnFd," F_air=",F_air);
 
   return upFp+upFd +dnFp+dnFd+G+F_air;
}

function updatePosV(dt,F,i,entiArr){
   var phy = entiArr[i].physics;
   if(phy.isFixed) return;
   
   var a = F/phy.mass;
   phy.v += a*dt;
   phy.pos.y +=phy.v*dt;
   console.log("i=",i," f=",F," a=",a," v=",phy.v," y =",phy.pos.y);
}

function updateSpring(dt,spring){
   var F = [];
   for(var i=(spring.length-1); i>0; i--){
      F[i] = updateForces(i,spring);
   } 
   for(var j=(spring.length-1); j>0; j--){
      updatePosV(dt,F[j],j,spring);
      var dp = physics2Draw(spring[j].physics.pos);
      spring[j].transform.setPosition(dp.x,dp.y,dp.z);
   }
}


function initScene(){
   //default scene
    var ds = SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    var spr = createSpring({x:0,y:2,z:0},ds.scene,Dimensions.unit);

    for(var i in spr){
       ds.scene.addEntity(spr[i]);
    }
    
    var count =1;
    var t2 = window.setInterval(function() {
      // if(count>100) window.clearInterval(t2);
       count ++;
      updateSpring(0.005,spr);
      },5);
      var lasttime = null;
    ds.scene.registerFrameCalls(function(){
      // if(count>50) return;
      // count ++;
      // if(lasttime === null){
      //    lasttime = new Date().getTime();
      // }else{
      //    var cur = new Date().getTime();
      //    var delt = (cur-lasttime)/1000;
      //    if(delt>=0.00001){
      //       updateSpring(delt,spr);
      //       lasttime = cur;
      //    }

      // }
      // for(var j=(spr.length-1); j>=0; j--){
      //    var dp = physics2Draw(spr[j].physics.pos);
      //    spr[i].transform.setPosition(dp.x,dp.y,dp.z);
      // }  

    },FrameState.BeforeDraw);
   //  ds.scene.ambientLight = new Vector3(0.02,0.02,0.02);
   //  //light
   //  var lt = ds.dirLight;
   //  lt.color = new Vector3(1.0,1.0,1.0);
   //  lt.specular = new Vector3(1.0,1.0,1.0);

  
  

    //interaction
   InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){ 
   });

   return ds.scene;
}

 function main(){
    var scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}

window.onload = main;



