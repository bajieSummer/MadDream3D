/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 12:31:25
 * @Description: file content
 */
var ClearMask = {
    default:0,
    notClear:1,
    onlyDepth:2
};
var CameraType ={
    default:0,
    depth:1,
    bloom_col2:2

};

class Camera{   
    constructor() {
        this.transform = new Transform(); 
        this.transform.rotOrder =RotationOrder.zyx;
        this.projectionMat = null;
        this.glProjArray = null;
        this.fov = 45;
        this.near = 0.1;
        this.far = 100;
        this.asp = 1.7;
        this.dirty = true;
        this.renderMask = RenderMask.everything;
        this.renderLayers = [];
        this.renderTarget = null;
        this.depth = 50;
        this.clearColor = [0.2,0.3,0.4,1.0];
        this.clearMask = ClearMask.default;
        this.isOrthogonal = false;
        this.id = Camera.createId();
        this.type = CameraType.default;
        this.enable =true;
        this.beforeDrawFunc = null;
        this.afterDrawFunc = null;
        this.drawMips = false;

        
    }
    static createId(){
        Entity.id = Entity.id +1;
        return Entity.id;
    }
    setFov(fov){
        this.fov = fov;
        this.dirty = true;
    }
    setNear(near){
        this.near = near;
        this.dirty = true;
    }
    setFar(far){
        this.far = far;
        this.dirty = true;
    }
    setAsp(asp){
        this.asp = asp;
        this.dirty = true;
    }
    getNear(){
        return this.near;
    }
    getFar(){
        return this.far;
    }

    __updatePersp(){
        if(this.dirty){
            //a = fov/2
            //ia =1/tan(a)
            // 1/asp*tan(a) 0,        0,       0, 
            // 0,           1/tan(a), 0,       0,
            // 0,           0,        f+n/f-n, fn/(n-f)  
            // 0,           0,        1        0
            // why last row 1 -->-1 z=-n 
            // why change f+n/f-n -->f+n/n-f????  z from (n,f) to (1,-1)
            var a = this.fov*Math.PI/(2.0*180.0);
            var ia = 1/Math.tan(a);
            var n = this.near; var f = this.far;
            this.projectionMat = math.matrix(
                [[ia/this.asp,0,0,0], 
                 [0,ia,0,0], 
                [0,0,(f+n)/(n-f),2*f*n/(n-f)],
                [0,0,-1,0]]);
            this.glProjArray = new Float32Array(
                math.flatten(
                    math.transpose(this.projectionMat)._data
                ));
            this.dirty = false;
        }
    }
    __updateOrth(){
        if(this.dirty){
            // h = this.near *tan(this.fov/2.0)
            // a = h*asp
            // x = -a x' = -1, x = a x' = 1   x' = x/a;
             // y =-h y' =-1 , y= h y' = 1   y' = y/h;
             // z = f z' = 1,  z=n, z' =-1,  z' = 2*(z-n)/(f-n)-1
            // [1/a,0,0,0] [0,1/h,0,0] [0,0,2/(f-n),-2*n/(f-n)-1] [0,0,0,1]
            var h = this.near*Math.tan(this.fov*Math.PI*0.5/180.0);
            var a = h*this.asp;
            var f = -1.0*this.far;
            var n = -1.0*this.near;
            this.projectionMat = math.matrix([[1/a,0,0,0],[0,1/h,0,0],
                                            [0,0,2/(f-n),(-n-f)/(f-n)],[0,0,0,1]]);
            this.glProjArray = new Float32Array(
                math.flatten(
                    math.transpose(this.projectionMat)._data
                ));
            this.dirty = false;
        }
    }
    switchProjection(isOrthogonal){
        this.isOrthogonal = isOrthogonal;
        this.dirty = true;
    }
    
    update(){
       if(this.isOrthogonal){
            this.__updateOrth();
       }else{
            this.__updatePersp();
       }
    }
    getProjectionMatrix(){
        this.update();
        return this.projectionMat;
    }
    getViewMatrix(){
        this.update();
        return this.transform.getDerivInvTranMatrix();
    }
    getGLProj(){
        this.update();
        return this.glProjArray;
    }
    // getGLView(){
    //     this.update();
    //     return this.transform.getInvGLTrans();
    // }

    addRenderLayer(layer){
        this.renderLayers.push(layer);
    }
    // static getProjectionMat(/** degree*/fov,n,f,asp){
    //     //a = fov/2
    //     //ia =1/tan(a)
    //     // 1/asp*tan(a) 0,        0,       0, 
    //     // 0,           1/tan(a), 0,       0,
    //     // 0,           0,        f+n/f-n, fn/(n-f)  
    //     // 0,           0,        1        0
    //     // why last row 1 -->-1 z=-n 
    //     // why change f+n/f-n -->f+n/n-f????  z from (n,f) to (1,-1)
    //     var a = fov*Math.PI/(2.0*180.0);
    //     var ia = 1/Math.tan(a);
    //     var p = [ia/asp,0,0,0, 
    //         0,ia,0,0, 
    //         0,0,(f+n)/(n-f),2*f*n/(n-f),
    //         0,0,-1,0];
    //     // transpose for webgl useing column major
    //     return new Float32Array(MathUtil.transposeArr(p));
    // }

    // static getModelViewMat(x,y,z){
    //     // simple one 
    //     // up y, left x, forward z
    //     // cameraPosition ()
    //     // cameraM = posM*rotMat,
    //     // viewMat = (posM*rotMat).I = rotMat.T*posM.I
    //     var mv = [1,0,0,-x,
    //               0,1,0,-y,
    //               0,0,1,-z,
    //               0,0,0,1];
    //     // transpose for webgl useing column major
    //     return new Float32Array(MathUtil.transposeArr(mv));
    // }
}
Camera.id = 0;