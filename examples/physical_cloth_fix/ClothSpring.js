/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2021-03-25 10:24:34
 * @Description: file content
 */
MinFloat = 0.000000001;
class ClothSpring
{
    constructor(params){
        if (params === undefined) {
            params = {};
         }
         // 100 9.1 8.5
         this.gravity = params.gravity===undefined ?new Mad3D.Vector3(0.0,-10.0,0.0):params.gravity;
         this.mass = params.mass === undefined ?100:params.mass;
         this.kbd = params.kbd === undefined ?8:params.kbd;
         this.dbd = params.dbd === undefined ?5:params.dbd;
         this.kst = params.kst === undefined ?9:params.kst;
         this.dst = params.dst === undefined ?7:params.dst;
         this.ksr = params.ksr === undefined ?9.1:params.ksr;
         this.dsr = params.dsr === undefined ?8.5:params.dsr;
         this.timestep = params.timestep === undefined ?0.01:params.timestep;
         this.updateHandler = null;
         this.isKinematic =false;
         this.restLength = 20.0;
         this.resolveTime = 10;
         this.velocity = params.velocity ===undefined ?[[]]:params.velocity;
         this.cachePos = [];
         this.cacheAcc = [];
         this.lo = 0.01;
        //this.initAcc = params.initAcc;
         
    }
    bindMesh(mesh){
        if(mesh === undefined || mesh === null){
            console.log("mesh =",mesh);
        }
        this.lo = mesh.w/mesh.m;
        var that = this;
        this.init(mesh);
        that.updateHandler = window.setInterval(function() {
            if(!that.isKinematic){
               that.update(0.1,mesh);
            }
            
         },16);
    }
    init(mesh){
        for(var i = 0; i<mesh.m+1; i++){
            for(var j = 0; j<mesh.n+1; j++){
                this.initCacheArr(this.cachePos,i,j);
                this.initCacheArr(this.cacheAcc,i,j);
                this.initCacheArr(this.velocity,i,j);
            }
        }
    }
    update(timestep,mesh){
        this.updateForce(timestep,mesh);
        this.updateVelocity(timestep,mesh);
        this.updateCachePos(timestep,mesh);
        //this.updateCollisionConstraints(timestep,mesh);
        //this.updateProjConstraints(timestep,mesh);
        this.updateFinalPosV(timestep,mesh);
        mesh.updateAllVertexPos(mesh.vertexPos);
    }
    getMeshPos(mesh,i,j){
        var ij = i*(mesh.n+1)+j;
        var pos = {x:mesh.vertexPos[ij*3],
            y:mesh.vertexPos[ij*3+1],
            z:mesh.vertexPos[ij*3+2]};
        return pos;
    }

    setMeshPos(mesh,i,j,pos){
        var ij = i*(mesh.n+1)+j;
        mesh.vertexPos[ij*3] = pos.x;
        mesh.vertexPos[ij*3+1] = pos.y;
        mesh.vertexPos[ij*3+2] = pos.z;
    }
    getDistance(pos1,pos2){
        var dx = pos2.x-pos1.x;
        var dy = pos2.y-pos1.y;
        var dz = pos2.z-pos1.z;
        return Math.sqrt(dx*dx+dy*dy+dz*dz);
    }
    calSprForce(pos,v,mesh,k,d,indices){
        var res = {x:0,y:0,z:0};
        
        for(var i = 0; i < indices.length; i++){
            var ind = indices[i];
            var id =ind[0]; 
            var jd = ind[1];
            if(id<0 || id>mesh.m){
                continue;
            }
            if(jd<0 || jd>mesh.n){
                continue;
            }
            //this.initCacheArr(this.cachePos,id,jd);
            var anchor = this.cachePos[id][jd];
            //this.initCacheArr(this.velocity,id,jd);
            var anchor_v = this.velocity[id][jd];
            var t = this.getDistance(anchor,pos);
            //if(t<=0.001) t = 0.001;
          
            var dlen = t-this.lo;
            if(math.abs(dlen)<0.00001){
                dlen = 0.0;
            }
            if(t<=0.00001) t = 0.00001;
            var tf = dlen/t;
            res.x +=tf*k*(anchor.x - pos.x) + d*(-1.0)*(v.x-anchor_v.x);//*(pos.x-anchor.x)
            res.y +=tf*k*(anchor.y - pos.y)+ d*(-1.0)*(v.y-anchor_v.y);//*(pos.y-anchor.y)
            res.z +=tf*k*(anchor.z - pos.z) + d*(-1.0)*(v.z-anchor_v.z);//*(pos.z-anchor.z)
        }
        //console.log(res);
        return res;
    }
    isFix(i,j){
        if(i ===0){
            return true;
        }
        return false;
    }
    initCacheArr(arr,i,j)
    {
        if(arr === undefined){
            arr = [];
        }
        if(arr[i] === undefined){
            arr[i] = [];
        }
        if(arr[i][j] ===undefined){
            arr[i][j] ={x:0,y:0,z:0};
        }
    }
    updateForce(timestep,mesh){
        for(var i = 0; i<mesh.m+1; i++){
            for(var j = 0; j<mesh.n+1; j++){
                //this.initCacheArr(this.cacheAcc,i,j);
                //this.initCacheArr(this.velocity,i,j);
                if(this.isFix(i,j)) continue;
                var pos = this.getMeshPos(mesh,i,j);
                
                var v = this.velocity[i][j];
                var structF = this.calSprForce(pos,v,mesh,this.kst,this.dst,
                    [[i-1,j],[i+1,j],[i,j-1],[i,j+1]]);
                var vm = this.mass/((mesh.m+1)*(mesh.n+1));
                var fAll = structF;
                //this.initCacheArr(this.cacheAcc,i,j);
                this.cacheAcc[i][j].x = fAll.x/vm + this.gravity.x;
                this.cacheAcc[i][j].y = fAll.y/vm + this.gravity.y;
                this.cacheAcc[i][j].z = fAll.z/vm + this.gravity.z;
            }
        }
        //console.log(this.cacheAcc[0][1]);
        // console.log(this.cacheAcc[1][0]);
        // console.log(this.cacheAcc[1][1]);
    }
   
    updateVelocity(timestep,mesh){
        for(var i = 0; i<mesh.m+1; i++){
            for(var j = 0; j<mesh.n+1; j++){
                //if(this.isFix(i,j)) continue;
                //this.initCacheArr(this.velocity,i,j);
                this.velocity[i][j].x += timestep*this.cacheAcc[i][j].x;
                this.velocity[i][j].y += timestep*this.cacheAcc[i][j].y;
                this.velocity[i][j].z += timestep*this.cacheAcc[i][j].z; 
            }
        }
        console.log("v=",this.velocity[1][0]);
    }
    updateCachePos(timestep,mesh){
        for(var i = 0; i<mesh.m+1; i++){
            for(var j = 0; j<mesh.n+1; j++){
               //if(this.isFix(i,j)) continue;
                var pos = this.getMeshPos(mesh,i,j);
                //this.initCacheArr(this.cachePos,i,j);
                var pPos ={};
                pPos.x= pos.x + this.velocity[i][j].x*timestep;
                pPos.y = pos.y + this.velocity[i][j].y*timestep;
                pPos.z = pos.z + this.velocity[i][j].z*timestep;
                this.cachePos[i][j].x = pPos.x;
                this.cachePos[i][j].y = pPos.y;
                this.cachePos[i][j].z = pPos.z;
            }
        }
        //console.log("pos=",this.getMeshPos(mesh,1,0));
        //console.log("cachep=",this.cachePos[1][0]);

    }
    updateCollisionConstraints(timestep,mesh){
        
    }
    calPDD(pos,i,j,rlen){
        var mpos = this.cachePos[i][j];
        if(mpos===undefined){
            return{x:0,y:0,z:0};
        }
        var dpos ={x:mpos.x-pos.x,y:mpos.y-pos.y,z:mpos.z-pos.z};
        var dlen = math.sqrt(dpos.x*dpos.x + dpos.y*dpos.y + dpos.z*dpos.z);
        var dv = {x:0,y:0,z:0};
        if(dlen > MinFloat){
            dv.x = dpos.x*(dlen-rlen)*0.5/dlen;
            dv.y = dpos.y*(dlen-rlen)*0.5/dlen;
            dv.z = dpos.z*(dlen-rlen)*0.5/dlen;
        }
        
        return dv;
    }
    updateProjConstraints(timestep,mesh){
        for(var i = 0; i <mesh.m+1; i++){
            for(var j = 0; j < mesh.n+1; j++){
                if(this.isFix()) continue;
                var pos = this.cachePos[i][j];
                var dleft = this.calPDD(pos,i-1,j);
                var dright = this.calPDD(pos,i+1,j);
                var dup = this.calPDD(pos,i,j+1);
                var ddwon = this.calPDD(pos,i,j-1);
                pos.x += dleft.x+dright.x +dup.x +ddwon.x;
                pos.y += dleft.y+dright.y +dup.y +ddwon.y;
                pos.z += dleft.z+dright.z +dup.z +ddwon.z;
            }
        }
    }
    updateFinalPosV(timestep,mesh){
        for(var i = 0; i<mesh.m+1; i++){
            for(var j = 0; j<mesh.n+1; j++){
                //if(this.isFix(i,j)) continue;
                var pos = this.getMeshPos(mesh,i,j);
                var curPos = this.cachePos[i][j];
                this.velocity[i][j].x = (curPos.x -pos.x)/timestep;
                this.velocity[i][j].y = (curPos.y -pos.y)/timestep;
                this.velocity[i][j].z = (curPos.z -pos.z)/timestep;
                this.setMeshPos(mesh,i,j,curPos);
            }
        }
        console.log("v=",this.velocity[1][0]);
    }

    setKinematic(kinematic)
    {
        this.isKinematic = kinematic;
    }    



    


}
