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
MinFloat = 0.000000001;
class ClothSpring{
   constructor(params){
      if (params === undefined) {
         params = {};
      }
      this.gravity = params.gravity===undefined ?new Vector3(0.0,-10.0,0.0):params.gravity;
      this.mass = params.mass === undefined ?1:params.mass;
      this.kbd = params.kbd === undefined ?8:params.kbd;
      this.dbd = params.dbd === undefined ?5:params.dbd;
      this.kst = params.kst === undefined ?7:params.kst;
      this.dst = params.dst === undefined ?4:params.dst;
      this.ksr = params.ksr === undefined ?1.0:params.ksr;
      this.dsr = params.dsr === undefined ?2.0:params.dsr;
      this.timestep = params.timestep === undefined ?0.01:params.timestep;
      this.updateHandler = null;
      this.isKinematic =false;
      this.restLength = 20.0;
      this.resolveTime = 10;
      this.velocity = params.velocity ===undefined ?[[]]:params.velocity;

   }
   getGrid(gridCache,indx,indy,mesh){
      if(indx>=mesh.m+1 || indy>=mesh.n+1 ||indx<0 || indy<0){
         return undefined;
      }
      if(gridCache[indx] === undefined){
         gridCache[indx] = [];
      }
      if(gridCache[indx][indy]!==undefined){
         return gridCache[indx][indy];
      }
      //var dimens = 
      
      var pos = this.getPos(mesh,indx,indy);
      
      gridCache[indx][indy] = {pos:pos};
      return gridCache[indx][indy];
   }
   getPos(mesh,i,j){
      var ij = this.indD2ToD1(i,j,mesh.n);
      return {x:mesh.vertexPos[ij*3],y:mesh.vertexPos[ij*3+1],z:mesh.vertexPos[ij*3+2]};
   }
   setPos(mesh,i,j,px,py,pz){
      var ij = this.indD2ToD1(i,j,mesh.n);
      mesh.vertexPos[ij*3] =px; 
      mesh.vertexPos[ij*3+1] =py;
      mesh.vertexPos[ij*3+2] =pz;  
   }
   getVelocity(i,j){
      if(this.velocity[i] === undefined){
         this.velocity[i] = [];
      }
      return this.velocity[i][j];
   }
   calSpF(gridCache,mesh,k,d,inds,grid){
      var sf ={x:0,y:0,z:0};
      for(var arri = 0; arri < inds.length; arri++){
         var i = inds[arri][0];
         var j = inds[arri][1];
         var gridA = this.getGrid(gridCache,i,j,mesh);
         if(gridA ===undefined){
            continue;
         }
         // if(i!==grid.indx&& j!==grid.indy){// dialog // for sheer spring
         //    k = this.ks;
         //    d = this.ds;
         // }
         var anchor = gridA.pos;
         if(gridA.v === undefined){
            gridA.v = {x:0,y:0,z:0};
         }
         sf.y += k*(anchor.y - grid.pos.y) + d*(-1.0)*(grid.v.y-gridA.v.y);
         sf.x += k*(anchor.x - grid.pos.x) + d*(-1.0)*(grid.v.x-gridA.v.x);
         sf.z += k*(anchor.z - grid.pos.z) + d*(-1.0)*(grid.v.z-gridA.v.z);
   
      }
      return sf;

      
         
   }
   updateForce(mesh,gridCache,indx,indy){
        //3*3 grid
    
     var sfx =0; var sfy = 0; var sfz = 0;
     var grid = this.getGrid(gridCache,indx,indy,mesh);
    // var grid ={pos:this.getPos(mesh,indx,indy)};
     grid.v=  this.getVelocity(indx,indy);
     grid.indx = indx; grid.indy = indy;
     if(grid.v === undefined){
        grid.v = {x:0,y:0,z:0};
     }
   //   var inds_st = [[indx-1,indy],[indx,indy-1],[indx+1,indy],[indx,indy+1]];
   //   var inds_sr = [[indx-1,indy-1],[indx+1,indy-1],[indx-1,indy+1],[indx+1,indy+1]];
   //   var inds_bd = [[indx-2,indy],[indx+2,indy],[indx,indy-2],[indx,indy+2]]; 
   var inds_st = [[indx-1,indy],[indx,indy-1]];
   var inds_sr = [[indx-1,indy-1],[indx+1,indy-1]];
   var inds_bd = [[indx-2,indy],[indx+2,indy]]; 
     var fst = this.calSpF(gridCache,mesh,this.kst,this.dst,inds_st,grid);
     sfx += fst.x; sfy +=fst.y; sfz+=fst.z;
   //   var fsr = this.calSpF(gridCache,mesh,this.ksr,this.dsr,inds_sr,grid);
   //   sfx += fsr.x; sfy +=fsr.y; sfz+=fsr.z;
   //   var fbd = this.calSpF(gridCache,mesh,this.kbd,this.dbd,inds_bd,grid);
   //   sfx += fbd.x; sfy +=fbd.y; sfz+=fbd.z;      
      grid.ax = sfx/this.mass + this.gravity.x;
      grid.ay = sfy/this.mass + this.gravity.y;
      grid.az = sfz/this.mass + this.gravity.z;
      
   }
   updatePos1(timestep,mesh,gridCache,indx,indy) {
     //3*3 grid
      if((indy ===0&&indx===0)||(indy===mesh.n&&indx===0)) return;
      var grid = this.getGrid(gridCache,indx,indy,mesh);
      var v=  this.getVelocity(indx,indy);
      
      var vx = v ===undefined?0:v.x; 
      var vy = v ===undefined?0:v.y;
      var vz = v ===undefined?0:v.z;
      vx += grid.ax*timestep;  vy +=grid.ay*timestep; vz += grid.az*timestep;
      this.setVelocity(vx,vy,vz,indx,indy);
      grid.pos.x += vx*timestep;
      grid.pos.y += vy*timestep;
      grid.pos.z += vz*timestep;
      //console.log("updatePos",grid.pos.x,grid.pos.z);
      this.setPos(mesh,indx,indy,grid.pos.x,grid.pos.y,grid.pos.z);
   }
   
   getDeltPosByGrid(posA,posB,restLen){
      var dx = posB.x - posA.x;
      var dy = posB.y - posA.y;
      var dz = posB.z - posA.z;

      var len = math.sqrt(dx*dx+dy*dy+dz*dz);
      var ndx = dx/len;
      var ndy = dy/len;
      var ndz = dz/len;
      if(len <= MinFloat){
         ndx = 0.0;
         ndy = 0.0;
         ndz = 0.0;
         console.log("waring::len=",len," near zero");
      }
      var dlen = len-restLen;
      var dv = {x:ndx*dlen/2.0,y:ndy*dlen/2.0,z:ndz*dlen/2.0};
      return dv;
   }

   getDeltByGridIndex(curPos,gridCache,indx,indy,mesh){
      var gridNb = this.getGrid(gridCache,indx,indy,mesh);
       var dNb= {x:0,y:0,z:0};
       if(gridNb!==undefined){
         dNb = this.getDeltPosByGrid(curPos,gridNb.pos,this.restLength);
       }
       return dNb;
   }
   updatePos(timestep,mesh,gridCache,indx,indy) {
      //3*3 grid
      
       var grid = this.getGrid(gridCache,indx,indy,mesh);
       var v=  this.getVelocity(indx,indy);
       
       var vx = v ===undefined?0:v.x; 
       var vy = v ===undefined?0:v.y;
       var vz = v ===undefined?0:v.z;
       vx += grid.ax*timestep;  vy +=grid.ay*timestep; vz += grid.az*timestep;
       this.setVelocity(vx,vy,vz,indx,indy);
       var cx = grid.pos.x + vx*timestep;
       var cy = grid.pos.y + vy*timestep;
       var cz = grid.pos.z += vz*timestep;
       var curPos = {x:cx,y:cy,z:cz};
       
      
      //  var dleft = this.getDeltByGridIndex(curPos,gridCache,indx-1,indy,mesh);
      //  var dright = this.getDeltByGridIndex(curPos,gridCache,indx+1,indy,mesh);
      //  var dUp = this.getDeltByGridIndex(curPos,gridCache,indx,indy-1,mesh);
      //  var dDown = this.getDeltByGridIndex(curPos,gridCache,indx,indy+1,mesh);

      //  curPos.x += dleft.x +dright.x +dUp.x +dDown.x;
      //  curPos.y += dleft.y +dright.y +dUp.y +dDown.y;
      //  curPos.z += dleft.z +dright.z +dUp.z +dDown.z;
      
       grid.pos.x = curPos.x;
       grid.pos.y = curPos.y;
       grid.pos.z = curPos.z;


       //console.log("updatePos",grid.pos.x,grid.pos.z);
       //this.setPos(mesh,indx,indy,grid.pos.x,grid.pos.y,grid.pos.z);
    }

    updatePosAndV(timestep,mesh,gridCache,indx,indy){
      var grid = this.getGrid(gridCache,indx,indy,mesh);
      var pos = this.getPos(mesh,indx,indy);
      var vx = -(pos.x-grid.pos.x)/timestep;
      var vy = -(pos.y-grid.pos.y)/timestep;
      var vz = -(pos.z-grid.pos.z)/timestep;
      this.setVelocity(vx,vy,vz,indx,indy);
      this.setPos(mesh,indx,indy,grid.pos.x,grid.pos.y,grid.pos.z);
    }
    updateConstraints(timestep,mesh,gridCache,indx,indy){
             
      var grid = this.getGrid(gridCache,indx,indy,mesh);
      var curPos = grid.pos;
      var dleft = this.getDeltByGridIndex(curPos,gridCache,indx-1,indy,mesh);
      var dright = this.getDeltByGridIndex(curPos,gridCache,indx+1,indy,mesh);
      var dUp = this.getDeltByGridIndex(curPos,gridCache,indx,indy-1,mesh);
      var dDown = this.getDeltByGridIndex(curPos,gridCache,indx,indy+1,mesh);

      grid.pos.x += dleft.x +dright.x +dUp.x +dDown.x;
      grid.pos.y += dleft.y +dright.y +dUp.y +dDown.y;
      grid.pos.z += dleft.z +dright.z +dUp.z +dDown.z;
    }

   update(timestep,mesh){
      var gridCache = [];
      for(var k = 0; k < 30; k++){

      
         for(var i = 0; i < mesh.m+1; i++){
            for(var j = 0; j<mesh.n+1; j++){
               this.updateForce(mesh,gridCache,i,j);
            }
         }
         for(var id = 0; id < mesh.m+1; id++){
            for(var jd = 0; jd<mesh.n+1; jd++){
               if((id ===0&&jd===0)||(id===mesh.n&&jd===0)) continue;
               this.updatePos(timestep,mesh,gridCache,id,jd);
            }
         }
         for(var ic = 0; ic <this.resolveTime; ic++){
            for(var idc=0; idc<mesh.m+1; idc++){
               for(var jdc=0; jdc<mesh.n+1; jdc++){
                  if((idc ===0&&jdc===0)||(idc===mesh.n&&jdc===0)) continue;
                  this.updateConstraints(timestep,mesh,gridCache,idc,jdc);
               }
            }
         }
         for(var iv = 0; iv<mesh.m+1; iv++){
            for(var jv =0; jv<mesh.n+1; jv++){
               if((iv ===0&&jv===0)||(iv===mesh.n&&jv===0)) continue;
               this.updatePosAndV(timestep,mesh,gridCache,iv,jv);
            }
         }
   }

   }
   bind(mesh){
      // constructor velocity
      var that = this;
      // this.ks = this.ks/mesh.m;
      // this.kb = this.kb/mesh.m;
      // this.ds = this.ds/mesh.m;
      // this.db = this.db/mesh.m;
      //this.mass = this.mass/(mesh.m*3.0);
      that.updateHandler = window.setInterval(function() {
         if(!that.isKinematic){
            that.update(that.timestep,mesh);
            mesh.updateAllVertexPos(mesh.vertexPos);
         }
         
      },16.6);
   }
   dispose(){
      window.clearInterval(this.updateHandler);
   }
   setKinematic(isK){
      this.isKinematic = isK;
   }
   indD1ToD2(ind,n){
      var indi = Math.floor(ind/(n+1));
      var indj = ind%n;
      return [indi,indj];
   }
   indD2ToD1(indx,indy,n){
      return indx*(n+1)+indy;
   }
   setVelocity(vx,vy,vz,indi,indj){
      if(this.velocity[indi]===undefined){
         this.velocity[indi] = [];
      }
      if(this.velocity[indi][indj] === undefined){
         this.velocity[indi][indj] = new Vector3(0,0,0);
      }
      this.velocity[indi][indj].x = vx; 
      this.velocity[indi][indj].y = vy;
      this.velocity[indi][indj].z = vz;
   }
 
}


class PhysicalPartice{
   constructor(params){
      if (params === undefined) {
         params = {};
      }
      this.gravity = params.gravity===undefined ?new Vector3(0.0,-10.0,0.0):params.gravity;
      this.mass = params.mass === undefined ?30:params.mass;
      this.k = params.k === undefined ?7:params.k;
      this.anchor = params.anchor === undefined ?new Vector3(0.0,40,0.0):params.anchor;
      this.damp = params.damp === undefined ?5:params.damp;
      console.log("anchor=",this.anchor);
    
      // this.positionY = params.positionY === undefined ?100:params.positionY;
      this.velocity = params.velocity === undefined ?new Vector3(0.0,0.0,0.0):params.velocity;
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

   
   

  // var pMesh  = MeshUtil.createBox(1000,0.0,1000);
  var pMesh  = MeshUtil.createGridMesh(5,5,100,100,0,false,true);
 // pMesh.setPrimitiveType(PrimitiveType.Line);
  
   var enti = SceneUtil.createEntity(ds.scene,"ground",{mesh:pMesh,
      receiveLight:false,receiveShadow:false,matColor:[0.9,0.3,0.5,1.0],
      enableCull:false
   });
   var cloth = new ClothSpring();
   cloth.bind(pMesh);
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



