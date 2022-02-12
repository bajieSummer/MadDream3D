/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2021-03-25 20:56:23
 * @Description: file content
 */
/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2021-03-25 20:56:23
 * @Description: file content
 */
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