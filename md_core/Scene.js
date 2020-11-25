/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-19 17:31:28
 * @Description: file content
 */

/**@type {Scene}
 * for entity manager
 */
var FrameState = {
    BeforeDraw:0,
    AfterDraw:1
};
class Scene {
    constructor(){
        this.cameraList = [];
        //this.camera = null;
        this._dirty = true;
        this._activeDraw = false;
        this.entityList = [];
        this.clearColor = [0.3,0.2,0.2,1.0];
        /**@type {WebGLRenderingContext} */ 
        this.gl = null;
        this.ambientLight = new Vector3(0.0,0.0,0.0);
        this.dirLights = [];
        this.pointLights =[];
        this.onBeforeDrawFrame = [];
        this.onAfterDrawFrame = [];
        this._befDrawRunQueue = [];
        this._aftDrawRunQueue = [];
    }
    // func will be called on every frame
    registerFrameCalls(func,frameState){
        if(typeof func !== "function"){
            console.error("wrong parameters: not a function,",func);
        }
        if(frameState ===FrameState.AfterDraw){
            this.onAfterDrawFrame.push(func);
        }else{
            this.onBeforeDrawFrame.push(func);
        }
    }

    // func will be called on next frame once
    postFrameRunnable(func,frameState){
        if(typeof func !== "function"){
            console.error("wrong parameters: not a function,",func);
        }
        if(frameState ===FrameState.AfterDraw){
            this._aftDrawRunQueue.push(func);
        }else{
            this._befDrawRunQueue.push(func);
        }
    }

    update(/**@type {WebGLRenderingContext} */ gl){
        if(this._dirty){
           //todo
        }
    }
    requireUpdate(){
        this._dirty = true;
    }
    initRenderState(
        /** @type {WebGLRenderingContext} */gl,
       r,g,b,a){
         // set Canvas state
         gl.clearColor(r,g,b,a); 
         gl.clearDepth(1.0);
         gl.enable(gl.DEPTH_TEST);
         gl.depthFunc(gl.LEQUAL); 
         gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   }


   sortCameras(){
       // this.cameraList = MathUtil.bucketSort(this.cameraList,function(cam){return cam.depth;},100,0);
       return MathUtil.bucketSortDict(this.cameraList,function(cam){return cam.depth;},100,0);
   }
   sortEntities(){
       //this.entityList =  MathUtil.bucketSort(this.entityList,function(enti){return enti.renderLayer;},100,0);
       return MathUtil.bucketSortDict(this.entityList,function(enti){return enti.renderLayer;},100,0);
   }

   addCamera(cam){
        this.cameraList.push(cam);
   }

   addEntity(enti){
       if(enti instanceof (Entity)){
           if(this.entityList === null){
               this.entityList = [];
           }
           this.entityList.push(enti);
       }
   }

   clearCamera(/**@type {WebGLRenderingContext} */gl,
    /**@type {Camera}*/cam){
        var sus = true;
       // if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE){
        if(cam.clearMask === ClearMask.default){
            this.initRenderState(gl,cam.clearColor[0],cam.clearColor[1],
                cam.clearColor[2],cam.clearColor[3]);
        }else if(cam.clearMask === ClearMask.onlyDepth){
            gl.clearDepth(1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT);
        }
        //}else{
         //   sus =false;
          //  console.warn("not complete,cam name=",cam.name);
        //} 
        return sus;
    }

   bindCamera(/**@type {WebGLRenderingContext} */gl,
    /**@type {Camera}*/cam){
    var sus = true;
    if( cam.renderTarget!==null ){
        if(cam.renderTarget.state ===LoadState.init){
            cam.renderTarget.loadTexture(gl,null);
        }
        if(cam.renderTarget.state !== LoadState.init){
            if(cam.renderTarget instanceof(RenderTexture)){
                gl.bindFramebuffer(gl.FRAMEBUFFER,cam.renderTarget.frameBufferId);
               // gl.viewport(0,0,cam.renderTarget.width,cam.renderTarget.height);
                if(cam.renderTarget.hasColorBuffer){
                    gl.bindRenderbuffer(gl.RENDERBUFFER,cam.renderTarget.depthRBuffer);
                }else{
                    gl.enable(gl.CULL_FACE);
                    gl.cullFace(gl.BACK);
                }
                cam.renderTarget.updateFBODate(gl,cam);
            }                   
        }else{
            sus = false;
        }
    }else{
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.bindRenderbuffer(gl.RENDERBUFFER,null);
    }
    return sus;

   }
   unbindCamera(/**@type {WebGLRenderingContext} */gl,
    /**@type {Camera}*/cam){

    }

    drawRenderLayer(/**@type {WebGLRenderingContext} */gl,cam,entiArr){
        var that = this;
        for(var i=0; i<entiArr.length; i++){
            var entity = entiArr[i];
           // var mat = entity.getActiveMaterial(cam);
           // var camera = cam;
             entity.material.getActive(cam,function(mat,camera){
                if(cam.id!==camera.id){
                    that.unbindCamera(gl,cam);
                    that.bindCamera(gl,camera);
                    that.clearCamera(gl,camera);
                }
                MaterialUtil.updateLightMatInfo(gl,camera,mat,entity.transform,that);
                Scene.drawEntity(gl,camera,entity,mat);
                if(cam.id!==camera.id){
                    that.unbindCamera(gl,camera);
                    that.bindCamera(gl,cam);
                }
             });

            
           
        }
      
    }
    drawCamera(/**@type {WebGLRenderingContext} */gl,
        cam,entitiesD){
            if(cam.beforeDrawFunc !== null){
                cam.beforeDrawFunc(entitiesD);
            }
            this.bindCamera(gl,cam);
            this.clearCamera(gl,cam);
            if(cam.renderMask === RenderMask.everything){
                for(var ek in entitiesD){
                    var entiArr = entitiesD[ek]; //ek layer
                    this.drawRenderLayer(gl,cam,entiArr);
                }
            }else if(cam.renderMask === RenderMask.layers){
                for(var cl in cam.renderLayers){
                    var clayer = cam.renderLayers[cl];
                    var entiArr_cl = entitiesD[clayer]; //ek layer
                    if(!MathUtil.isNone(entiArr_cl)){
                        this.drawRenderLayer(gl,cam,entiArr_cl);
                    }
                }
            }
            this.unbindCamera(gl,cam);
            if(cam.afterDrawFunc !==null){
                cam.afterDrawFunc(gl,entitiesD);
            }
        }

    drawOneFrame(/**@type {WebGLRenderingContext} */gl){
        if (gl === null){
            console.error("couldn't draw WebglRenderingContext is null");
            return;
        }
        this.update(gl);
        var camsD = this.sortCameras();
        var entitiesD = this.sortEntities();
        for(var ck in camsD){
            var camArr = camsD[ck]; // depth ck
            for(var j=0; j<camArr.length; j++){
                /**@type {Camera} */
                var cam = camArr[j];
                if(cam.enable){
                    
                    if(!MathUtil.isNone(cam.renderTarget) &&
                        cam.renderTarget.type === TextureType.cube){
                           // console.log('draw Camera>>,name',cam.name);
                           if(cam.drawMips){
                               for(var m=0; m<cam.renderTarget.getMipCount();m++){
                                   cam.renderTarget.currentMip = m;
                                    for(var t = 0; t<6; t++){
                                        this.drawCamera(gl,cam,entitiesD); 
                                    }
                               }
                           }else{
                                for(var t1 = 0; t1<6; t1++){
                                // cam.renderTarget.calRotateFace(cam);
                                    this.drawCamera(gl,cam,entitiesD); 
                                }
                           }
                        
                    }else{
                        this.drawCamera(gl,cam,entitiesD);
                    }
                }
                
                
              
            }
        }
        
    }
    

    enableActiveDraw(enable){
        this._activeDraw = enable;
    }

    draw(/**@type {WebGLRenderingContext} */gl){
        if(gl=== undefined){
            gl = this.gl;
        }
        for(var fi in this.onBeforeDrawFrame){
            this.onBeforeDrawFrame[fi]();
        }
        while(this._befDrawRunQueue.length>0){
            this._befDrawRunQueue.shift()();
        }

        // continues to draw without break;
        if(!this._activeDraw){
            this.drawOneFrame(gl);
        }else{
            // continues draw need activeDraw, requireUpdate();
            if(this._dirty){
                this.drawOneFrame(gl);
                this._dirty = false;
            }
        }
        for(var ci in this.onAfterDrawFrame){
            this.onAfterDrawFrame[ci]();
        }
        while(this._aftDrawRunQueue.length>0){
            this._aftDrawRunQueue.shift()();
        }
        var that = this;
        window.requestAnimationFrame(function(timeStamp){
            that.draw(gl);
        });
    }

    addLight(light){
        if(light instanceof DirectionLight){
            if( MathUtil.isNone(this.dirLights) ){
                this.dirLights  = [];
            }
            this.dirLights.push(light);
        }
        if(light instanceof PointLight){
            if(MathUtil.isNone(this.pointLights)){
                this.pointLights = [];
            }
            this.pointLights.push(light);
        }
    }
 

    static drawEntity(/**@type {WebGLRenderingContext} */ gl,
        /**@type {Camera} */camera,
        /**@type {Entity} */entity,
        /**@type {Material} */mat){
           // var mat = entity.getActiveMaterial(camera);
            if(entity.mesh!== null && mat!==null){
                var projM = camera.getGLProj();
                var viewM =  camera.getViewMatrix();
                if(entity.transform.followCameraPos){
                    entity.transform.setPosition(camera.transform.pos.x,
                        camera.transform.pos.y,
                        camera.transform.pos.z);
                }
                var dt = mat.shaderOption.depthTest;
                var dw = mat.shaderOption.depthWrite;
                if(dt !== gl.getParameter(gl.DEPTH_TEST)){
                    if(dt ){
                        gl.enable(gl.DEPTH_TEST);
                    }else {
                        gl.disable(gl.DEPTH_TEST);
                    }
                }
                if(dw !== gl.getParameter(gl.DEPTH_WRITEMASK)){
                    if(dw){
                        gl.depthMask(true);
                    }else{
                        gl.depthMask(false);
                    }
                }
                
                var ecf = mat.shaderOption.enableCull;
                if(ecf !== gl.getParameter(gl.CULL_FACE)){
                     if(ecf){
                         gl.enable(gl.CULL_FACE);
                     }else{
                         gl.disable(gl.CULL_FACE);
                     }
                }
                var cf = gl[mat.shaderOption.cullFace];
                if(cf !== gl.getParameter(gl.CULL_FACE_MODE)){
                     gl.cullFace(cf);
                }

                // if(!MathUtil.isNone(camera.renderTarget)&&!
                //  camera.renderTarget.hasColorBuffer){
                    
                // }
                
                var eM = entity.transform.getDerivTranMatrix();
                var mvM = Transform.getMVGLArr(viewM,eM);
                mat.setUniform(
                    DefaultUniformKey.projectionMatrix,
                    UTypeEnumn.Mat4,projM);
                mat.setUniform(
                    DefaultUniformKey.modelViewMatrix,
                    UTypeEnumn.Mat4,mvM);
                if(mat.shaderOption.uniformsToUp.modelCameraPos){
                    var eMI = entity.transform.getDerivInvTranMatrix();
                    var cPos = camera.transform.pos;
                    var mcpos = MathUtil.vec3MultiMat4(cPos,eMI);
                    mat.setUniform(
                        "modelCameraPos",
                        UTypeEnumn.Vec3,[mcpos.x,mcpos.y,mcpos.z]);

                }
                if(mat.shaderOption.uniformsToUp.modelViewInv){
                    var mI = entity.transform.getDerivInvTranMatrix();
                    var viewI = camera.transform.getDerivTranMatrix();
                    var mvI =MathUtil.mat2Arr(math.multiply(mI,viewI));
                    mat.setUniform(
                        "modelViewInv",
                        UTypeEnumn.Mat4,mvI);

                }
                if(!MathUtil.isNone(mat.shaderOption.envMap)||
                mat.shaderOption.IBL ){
                    var viewArr = Transform.mat2Arr(viewM);
                    mat.setUniform("viewMatrix",UTypeEnumn.Mat4,viewArr);
                }   

                var vertexBuffer = entity.mesh.getVertexBufferInfo(gl);
                var programInfo = mat.getProgramInfo(gl);
                var info = new RenderInfo(gl,
                    projM,mvM,programInfo,vertexBuffer);
                Render.drawRender(info);
            }
        }

    calculateShadowLights(){
        var t = 0;
        for(var i=0; i<this.dirLights.length;i++){
            var dl = this.dirLights[i];
            if(dl.castShadow){
                t =t+1;
            }
        }
        for(var j=0;j<this.pointLights.length;j++){
            var pl = this.pointLights[j];
            if(pl.castShadow){
                t=t+1;
            }
        }
        return t;
    }
    getPointLightsCount(){
        return this.pointLights.length;
    }
    getDirectionalLightsCount(){
        return this.dirLights.length;
    }
    
    
}