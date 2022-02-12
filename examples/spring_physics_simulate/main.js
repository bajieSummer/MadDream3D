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
var Dimensions = {unit:0.9,peru:0.5,g:new Mad3D.Vector3(0.0,-9.8,0.0)};
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
      resPos = new Mad3D.Vector3();
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
      resPos = new Mad3D.Vector3();
   }
   resPos.x = pos.x/peru*unit; 
   resPos.y = pos.y/peru*unit; 
   resPos.z = pos.z/peru*unit;
   return resPos;
}

function createSpring(pos,scene,unit){
   var baseUrl = "../pics/MD3d_hello.png";      
   var smesh = Mad3D.MeshUtil.createBox(unit*0.1,unit*0.1,unit*0.1);
   var mat = Mad3D.SceneUtil.createMaterial(scene,{receiveLight:false,receiveShadow:false,
      texture0:baseUrl});
   var enti =Mad3D.SceneUtil.createEntity(scene,"box",
      {mesh:smesh,material:mat
      });
   enti.transform.setPosition(pos.x,pos.y,pos.z);
   // 1 unit for 0.05m 
   enti.physics = new SpPhyics(draw2Physics(pos),new Mad3D.Vector3(0.0,0.0,0.0),true);
   var entiArr = [enti];
   
   for(var i = 1; i<10; i++){
      var ct = enti.copy("box"+i);
      var d = enti.physics.l0*1.1/Dimensions.peru*unit;
      ct.transform.translate(i*d*0.5,(-d)*i,i*d*0.2);
      var phPos = draw2Physics(ct.transform.pos);
     // console.log("i=",i," phPos=",phPos," pos=",ct.transform.pos);
      ct.physics = new SpPhyics(phPos,new Mad3D.Vector3(0.0,0.0,0.0),false);
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
   //(entiArr.length-i)
  // var G = -1.0*phy.mass*g;
  var G = Mad3D.MathUtil.V3MultiNum(Dimensions.g,phy.mass);
   
   var F_air =Mad3D.MathUtil.V3MultiNum(phy.v,-0.5*1.0*1.293*0.01*Mad3D.MathUtil.getLength(phy.v));
   //for up:
   var upFp = new Mad3D.Vector3(0.0,0.0,0.0); var upFd = new Mad3D.Vector3(0.0,0.0,0.0);
   if(phy0!==null){
      var Xu = Mad3D.MathUtil.V3SubV3(phy0.pos,phy.pos);
      var lenXu = Mad3D.MathUtil.getLength(Xu);
      upFp =Mad3D.MathUtil.V3MultiNum(Xu,phy0.ks/lenXu*(lenXu-phy0.l0));
      
     // upFd =phy0.kd*(phy0.v-phy.v)*Xu/lenXu;
     upFd  = Mad3D.MathUtil.multiplyV3(Xu,Mad3D.MathUtil.V3SubV3(phy0.v,phy.v));
     upFd = Mad3D.MathUtil.V3MultiNum(upFd,phy0.kd/lenXu);
   }
   var dnFp = new Mad3D.Vector3(0.0,0.0,0.0); var dnFd = new Mad3D.Vector3(0.0,0.0,0.0);
   if(phy1!==null){
      var Xdn = Mad3D.MathUtil.V3SubV3(phy.pos,phy1.pos);
      var lenXdn = Mad3D.MathUtil.getLength(Xdn);
      //dnFp =-1.0*phy.ks*Xdn/lenXdn*(lenXdn-phy.l0);
      //dnFd =-1.0*phy.kd*(phy.v-phy1.v)*Xdn/lenXdn;
      dnFp = Mad3D.MathUtil.V3MultiNum(Xdn,-1.0*phy.ks/lenXdn*(lenXdn-phy.l0));
      dnFd = Mad3D.MathUtil.multiplyV3(Xdn,Mad3D.MathUtil.V3SubV3(phy.v,phy1.v));
      dnFd = Mad3D.MathUtil.V3MultiNum(dnFd,-1.0*phy.kd/lenXdn);

   }
  // console.log("i=",i," upFp =",upFp, " upFd=",upFd, " dnFp=",dnFp," dnFd=",dnFd," F_air=",F_air);
   //upFd,,dnFd
   return Mad3D.MathUtil.V3ADDV3(upFp,upFd,dnFp,dnFd,G,F_air);
}

function updatePosV(dt,F,i,entiArr){
   var phy = entiArr[i].physics;
   if(phy.isFixed) return;
   
   var a = Mad3D.MathUtil.V3MultiNum(F,1.0/phy.mass);
   // phy.v += a*dt;
   //phy.pos.y +=phy.v*dt; 
   phy.v = Mad3D.MathUtil.V3ADDV3(phy.v,Mad3D.MathUtil.V3MultiNum(a,dt));
   phy.pos = Mad3D.MathUtil.V3ADDV3(phy.pos,Mad3D.MathUtil.V3MultiNum(phy.v,dt));
  // console.log("i=",i," f=",F," a=",a," v=",phy.v," y =",phy.pos);
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
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false});
   
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    var spr = createSpring({x:0,y:2,z:0},ds.scene,Dimensions.unit);

    for(var i in spr){
       ds.scene.addEntity(spr[i]);
    }
    
    var count =1;
    var t2 = window.setInterval(function() {
      // if(count>100) window.clearInterval(t2);
       count ++;
      updateSpring(0.01,spr);
      },10);
      var lasttime = null;
    ds.scene.registerFrameCalls(function(){

    },Mad3D.FrameState.BeforeDraw);
   //  ds.scene.ambientLight = new Vector3(0.02,0.02,0.02);
   //  //light
   //  var lt = ds.dirLight;
   //  lt.color = new Vector3(1.0,1.0,1.0);
   //  lt.specular = new Vector3(1.0,1.0,1.0);

  var slt_ind = document.getElementById("slt_inds");
  var slt_axis = document.getElementById("slt_axis");
  var rg_power = document.getElementById("rg_power");
  document.getElementById("btn_hit").addEventListener("click",function(e){
      //console.log(slt_ind.value);
      var id = parseInt(slt_ind.value);
      var axis = slt_axis.value.split(",");
      var anp = parseInt(axis[1]);
      var power = parseFloat(rg_power.value);
      var de = 1.0*0.0014*power*anp/spr[id].physics.mass;
      var dv =null; 
      if(axis[0] ==="z"){
         dv = new Mad3D.Vector3(0,0,de);
      }else{
         dv = new Mad3D.Vector3(de,0,0);
      }
      spr[id].physics.v =  Mad3D.MathUtil.V3ADDV3(spr[id].physics.v,dv);
  });

    //interaction
   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){ 
   });

   var pMesh  = Mad3D.MeshUtil.createBox(10,0.2,10);
   var enti = Mad3D.SceneUtil.createEntity(ds.scene,"ground",{mesh:pMesh,
      receiveLight:true,receiveShadow:false,matColor:[0.3,0.4,0.4,1.0]
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



