/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 19:55:59
 * @Description: file content
 */

import { Vector3, MathUtil } from "./MathUtil";

export const RotationOrder = {
    "xyz": 0,
    "zyx": 1
}

class Transform {

    constructor() {
        this.pos = new Vector3(0, 0, 0);
        this.rot = new Vector3(0, 0, 0);
        this.scal = new Vector3(1, 1, 1);

        this.transformMatrix = math.identity(4, 4);
        this.invTransformMatrix = math.identity(4, 4);
        this.derivTranMatrix = math.identity(4, 4);
        this.derivInvTranMatrix = math.identity(4, 4);

        // this.glArray = Transform.mat2Arr(this.transformMatrix);
        // this.invGLArray= Transform.mat2Arr(this.invTransformMatrix);
        this.derivGLArray = Transform.mat2Arr(this.derivTranMatrix);
        this.derivInvGLArray = Transform.mat2Arr(this.derivInvTranMatrix);

        this.rotOrder = RotationOrder.xyz;
        this.parent = null;
        this.children = [];
        this.dirty();
        this.id = Transform.getId();
    }

    static getId() {
        Transform.id += 1;
        return Transform.id;
    }

    dirty() {
        this.isDirty = true;
        for (var i in this.children) {
            this.children[i].dirty();
        }
    }

    setParent(trans) {
        if (this.parent === null || this.parent.id !== tran.id) {
            if (this.parent !== null) {
                // detach old parent and old child
                for (var i in this.parent.children) {
                    if (this.parent.children[i].id === this.id) {
                        this.parent.children.splice(i, 1);
                    }
                }
            }
            this.parent = trans;
            trans.children.push(this);
            this.dirty();
        }

    }

    detachParent() {
        for (var i in this.parent.children) {
            if (this.parent.children[i].id === this.id) {
                this.parent.children.splice(i, 1);
            }
        }
        this.dirty();
    }

    getParent() {
        return this.parent;
    }

    getChildByIndex(ind) {
        return this.children[ind];
    }

    getChilrdren() {
        return this.children;
    }


    getCopy() {
        var trans = new Transform();
        trans.copyFrom(this);
        return trans;
        // trans.pos.x = this.pos.x; trans.pos.y = this.pos.y; trans.pos.z = this.pos.z;
        // trans.rot.x = this.rot.x; trans.rot.y = this.rot.y; trans.rot.z = this.rot.z;
        // trans.scal.x = this.scal.x; trans.scal.y = this.scal.y; trans.scal.z = this.scal.z;
    }
    copyFrom(
        /**@type {Transform} */
        trans) {
        this.pos.copyFrom(trans.pos);
        this.rot.copyFrom(trans.rot);
        this.scal.copyFrom(trans.scal);
        this.transformMatrix = math.clone(trans.transformMatrix);
        this.invTransformMatrix = math.clone(trans.invTransformMatrix);
        this.derivTranMatrix = math.clone(trans.derivTranMatrix);
        this.derivInvTranMatrix = math.clone(trans.derivInvTranMatrix);

        this.derivGLArray = math.clone(trans.derivGLArray);
        this.derivInvGLArray = math.clone(trans.derivInvGLArray);
        //this.glArray = Transform.mat2Arr(this.transformMatrix);
        //this.invGLArray= Transform.mat2Arr(this.invTransformMatrix);
        this.dirty();
    }

    translate(x, y, z) {
        this.pos.x = this.pos.x + x;
        this.pos.y = this.pos.y + y;
        this.pos.z = this.pos.z + z;
        this.dirty();
    }

    setPosition(x, y, z) {
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
        this.dirty();
    }

    scale(x, y, z) {
        this.scal.x = this.scal.x * x;
        this.scal.y = this.scal.y * y;
        this.scal.z = this.scal.z * z;
        this.dirty();

    }

    resetScale(x, y, z) {
        this.scal.x = x;
        this.scal.y = y;
        this.scal.z = z;
        this.dirty();
    }

    rotate(x, y, z) {
        this.rot.x = this.rot.x + x;
        this.rot.y = this.rot.y + y;
        this.rot.z = this.rot.z + z;
        this.dirty();
    }

    lookAt2(x, y, z) {
        //(0,0,-1)
        //var rotMat = this.getRotationMatrix();
        var dx = this.pos.x - x; var dy = this.pos.y - y; var dz = this.pos.z - z;
        var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        var citax = 0;
        var citay = 0;
        if (len < Epsilon) {
            return;
        }
        var ndx = dx / len; var ndy = dy / len; var ndz = dz / len;
        citax = -1.0 * Math.asin(ndy) * 180.0 / Math.PI;
        var r = Math.sqrt(ndx * ndx + ndz * ndz);
        if (r < Epsilon) {
            citay = 0.0;
        } else {
            citay = Math.asin(ndx / r) * 180.0 / Math.PI;
        }

        this.rot.x = citax;
        this.rot.y = citay;

        //console.log("Transform>>> lookAt>>>>>>",r);
        //console.log(citax,citay);
        this.dirty();
    }

    lookAt(x, y, z) {
        // for rotation order z,y,x
        //(0,0,-1)
        //var rotMat = this.getRotationMatrix();
        var dx = this.pos.x - x; var dy = this.pos.y - y; var dz = this.pos.z - z;
        var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        var citax = 0;
        var citay = 0;
        if (len < Epsilon) {
            return;
        }
        var ndx = dx / len; var ndy = dy / len; var ndz = dz / len;
        var citard = Math.asin(-1.0 * ndy);
        citax = citard * 180.0 / Math.PI;
        var r = len * Math.cos(citard);// Math.sqrt(ndx*ndx +ndz*ndz);

        if (Math.abs(r) < Epsilon) {
            citay = 0.0;
        } else {
            citay = Math.atan(dx / dz) * 180.0 / Math.PI;
            //var citay2 = Math.acos(dz/r)*180.0/Math.PI;
            if (dx >= 0 && dz >= 0) {
                // first scope 0-90
                citay = Math.asin(dx / r) * 180.0 / Math.PI;
            } else if (dx >= 0 && dz <= 0) {
                //second 90-180
                citay = Math.acos(dz / r) * 180.0 / Math.PI;
            } else if (dx <= 0 && dz <= 0) {
                //third scope 180-270
                citay = Math.asin(dx / r) * 180.0 / Math.PI + 360.0;
            } else if (dx <= 0 && dz >= 0) {
                //fourth scope 270-360
                citay = Math.asin(dx / r) * 180.0 / Math.PI + 360.0;
            }

        }


        this.rot.x = citax;
        this.rot.y = citay;

        //console.log("Transform>>> lookAt>>>>>>",r);
        //console.log("sum look At",citax,citay);
        this.dirty();
    }

    resetRotate(x, y, z) {
        this.rot.x = x;
        this.rot.y = y;
        this.rot.z = z;
        this.dirty();
    }

    resetAll() {
        this.pos.x = this.pos.y = this.pos.z = 0;// [0,0,0];
        this.rot.x = this.rot.y = this.rot.z = 0;//= [0,0,0];
        this.scal.x = this.scal.y = this.scal = 1.0;// = [1,1,1];
        this.dirty();
    }

    requireUpdate() {
        this.dirty();
    }

    getRotationMatrix() {
        var rotMat = null;
        var rxMat = MathUtil.rotX(this.rot.x);
        var ryMat = MathUtil.rotY(this.rot.y);
        var rzMat = MathUtil.rotZ(this.rot.z);
        if (this.rotOrder === RotationOrder.zyx) {
            rotMat = math.multiply(rzMat, ryMat);
            rotMat = math.multiply(rotMat, rxMat);
        } else {
            rotMat = math.multiply(rxMat, ryMat);
            rotMat = math.multiply(rotMat, rzMat);
        }
        return rotMat;
    }

    update() {
        // scale first then rotate  finally translate
        // TRS *p M = T*Rz*Ry*Rx*S
        // M_inv = S_inv*Rx.T*Ry.T*Rz.T*T_inv
        if (this.isDirty) {
            var tMat = MathUtil.translate(this.pos.x,
                this.pos.y, this.pos.z);
            var rotMat = this.getRotationMatrix();
            //var irotMat = math.multiply(math.transpose(rxMat),math.transpose(ryMat));
            //irotMat = math.multiply(irotMat,math.transpose(rzMat));
            var sMat = MathUtil.scale(this.scal.x,
                this.scal.y, this.scal.z);
            //
            this.transformMatrix = math.multiply(tMat, rotMat);
            this.transformMatrix = math.multiply(this.transformMatrix,
                sMat);
            var itMat = MathUtil.translate(-1.0 * this.pos.x,
                -1.0 * this.pos.y, -1.0 * this.pos.z);
            var isMat = MathUtil.scale(1.0 / this.scal.x,
                1.0 / this.scal.y, 1.0 / this.scal.z);
            this.invTransformMatrix = math.multiply(isMat,
                math.transpose(rotMat));
            this.invTransformMatrix = math.multiply(this.invTransformMatrix,
                itMat);
            this.calDerivMatrix();
            // this.glArray = Transform.mat2Arr(this.transformMatrix);
            // this.invGLArray = Transform.mat2Arr(this.invTransformMatrix);
            this.derivGLArray = Transform.mat2Arr(this.derivTranMatrix);
            this.derivInvGLArray = Transform.mat2Arr(this.derivInvTranMatrix);
            this.isDirty = false;
        }
    }

    getTransMatrix() {
        this.update();
        return this.transformMatrix;

    }
    getInvTransMatrix() {
        this.update();
        return this.invTransformMatrix;
    }

    getDerivTranMatrix() {
        this.update();
        return this.derivTranMatrix;
    }

    getDerivInvTranMatrix() {
        this.update();
        return this.derivInvTranMatrix;
    }

    calDerivMatrix() {
        if (this.parent !== null) {
            var paDeri = this.parent.getDerivTranMatrix();
            var paInvDeri = this.parent.getDerivInvTranMatrix();
            this.derivTranMatrix = math.multiply(paDeri, this.transformMatrix);
            this.derivInvTranMatrix = math.multiply(this.invTransformMatrix, paInvDeri);
        } else {
            this.derivInvTranMatrix = math.clone(this.invTransformMatrix);
            this.derivTranMatrix = math.clone(this.transformMatrix);
        }

    }



    // getGLTrans(){
    //     this.update();
    //     return this.glArray;
    // }

    // getInvGLTrans(){
    //     this.update();
    //     return this.invGLArray;
    // }

    static getMVMatrix(viewM, modelM) {
        return math.multiply(viewM, modelM);
    }

    static mat2Arr(matrix) {
        return new Float32Array(
            math.flatten(
                math.transpose(matrix)._data));
    }

    static getMVGLArr(viewM, modelM) {
        var mvMatrix = Transform.getMVMatrix(viewM, modelM);
        return Transform.mat2Arr(mvMatrix);
    }

}
Transform.id = 0;

export { Transform }