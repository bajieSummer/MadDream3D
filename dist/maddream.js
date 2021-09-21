var Mad = (function (exports) {
    'use strict';

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-19 17:03:43
     * @Description: file content
     */

    function TransformAni(/**@type {Scene} */scene,
        /**@type {Transform} */trans,
        aniParams) {
        var update = aniParams.update;
        aniParams.update = function (anime) {
            trans.requireUpdate();
            scene.requireUpdate();
            update(anime);
        };
        return anime(aniParams);
    }
    function ValueAni(aniParams) {
        var update = aniParams.update;
        aniParams.update = function (anime) {
            update(anime);
        };
        return anime(aniParams);
    }

    function MaterialAni(/**@type {Scene} */scene,
        /**@type {Material} */mat,
        uniKey,
        aniParams) {
        var update = aniParams.update;
        aniParams.update = function (anime) {

            var t = aniParams.targets[uniKey];
            if (typeof (t) === "number") {
                mat.setUniform(uniKey, UTypeEnumn.float, t);
            }
            mat.uDirty = true;
            scene.requireUpdate();
            update(anime);
        };
        return anime(aniParams);
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-11-25 11:57:33
     * @Description: file content
     */
    class IAsset {
        constructor(id) {
            this.id = IAsset.getId();
        }
        static getId() {
            IAsset.id += 1;
            return IAsset.id;
        }
    }
    IAsset.id = -1;

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-08 18:04:07
     * @LastEditTime: 2020-11-25 11:55:56
     * @Description: file content
     */

    class Asset extends IAsset {
        constructor(url) {
            super(id);
            this.url = url;
        }

    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-03-16 11:01:56
     * @Description: file content
     */



    class AssetsManager$1 {
        constructor() {
            this.assetsMap = new Map();
            this.parsersMap = new Map();
        }
        // createAsset(url,type){
        //     if(type === AssetType.Model){
        //         var asset = new Asset(url);

        //     }
        // }

        registerParser(extension, classFunc) {
            if (this.parsersMap[extension] !== undefined) {
                console.warn("the parser for", extension, "already existed");
                return false;
            }
            this.parsersMap.set(extension, classFunc);
        }

        unregisterPaser(extension) {
            this.parsersMap.set(extension, undefined);
        }

        getParser(url) {
            var m = url.split(".");
            return this.parsersMap.get(m[m.length - 1]);
        }

        load(url, params, callback) {
            var m = new MacroAsset();
            m.load(url, params, callback);
            this.assetsMap.set(m.id, m);
        }


        static getManager() {
            if (AssetsManager$1.manager === null) {
                AssetsManager$1.manager = new AssetsManager$1();
            }
            return AssetsManager$1.manager;
        }
    }
    AssetsManager$1.manager = null;

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-17 12:34:02
     * @Description: file content
     */
    function myBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        }    if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }}
    myBrowser();
    var Epsilon$1 = 0.0000000001;
    function Vector4(x, y, z, w) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        Vector4.prototype.copyFrom = function (vec4) {

            this.x = vec4.x;
            this.y = vec4.y;
            this.z = vec4.z;
            this.w = vec4.w;
        };
    }

    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        Vector3.prototype.copyFrom = function (vec3) {
            this.x = vec3.x;
            this.y = vec3.y;
            this.z = vec3.z;
        };
        Vector3.prototype.dot = function (vec3) {
            return this.x * vec3.x + this.y * vec3.y + this.z * vec3.z;
        };
        Vector3.prototype.sub = function (vec3) {
            return new Vector3(this.x - vec3.x, this.y - vec3.y, this.z - vec3.z);
        };
        Vector3.prototype.cross = function (right) {
            var returnValue = new Vector3();
            returnValue.x = this.y * right.z - this.z * right.y;
            returnValue.y = this.z * right.x - this.x * right.z;
            returnValue.z = this.x * right.y - this.y * right.x;
            return returnValue;
        };
        Vector3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.normalize = function () {
            var len = this.length();
            this.x = this.x / len;
            this.y = this.y / len;
            this.z = this.z / len;
        };
    }

    class MathUtil {
        static transposeArr(arr) {
            return [arr[0], arr[4], arr[8], arr[12],
            arr[1], arr[5], arr[9], arr[13],
            arr[2], arr[6], arr[10], arr[14],
            arr[3], arr[7], arr[11], arr[15]];
        }


        static rotX(cita) {
            var ra = cita * math.pi / 180.0;
            var cosrc = math.cos(ra);
            var sinrc = math.sin(ra);
            var mat = math.matrix(
                [[1.0, 0, 0, 0],
                [0, cosrc, -sinrc, 0],
                [0, sinrc, cosrc, 0],
                [0, 0, 0, 1]]);
            return mat;
        }

        static rotY(cita) {
            var ra = cita * math.pi / 180.0;
            var cosrc = math.cos(ra);
            var sinrc = math.sin(ra);
            var mat = math.matrix(
                [[cosrc, 0, sinrc, 0],
                [0, 1, 0, 0],
                [-sinrc, 0, cosrc, 0],
                [0, 0, 0, 1]]);
            return mat;
        }

        static rotZ(cita) {
            var ra = cita * math.pi / 180.0;
            var cosrc = math.cos(ra);
            var sinrc = math.sin(ra);
            var mat = math.matrix(
                [[cosrc, -sinrc, 0, 0],
                [sinrc, cosrc, 0, 0],
                [0, 0, 1.0, 0],
                [0, 0, 0, 1]]);
            return mat;
        }

        static scale(x, y, z) {
            var mat = math.matrix(
                [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]]);
            return mat;
        }
        static translate(x, y, z) {
            var mat = math.matrix(
                [[1.0, 0, 0, x],
                [0, 1.0, 0, y],
                [0, 0, 1.0, z],
                [0, 0, 0, 1]]);
            return mat;
        }

        static isPowerOf2(value) {
            return (value & (value - 1)) === 0;
        }

        static getLength(vec3, y, z) {
            if (vec3 instanceof (Vector3)) {
                return math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z);
            } else if (typeof (vec3) == "number") {
                return math.sqrt(vec3 * vec3 + y * y + z * z);
            } else if (vec3 instanceof (Vector4)) {
                return math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z + vec3.w * vec3.w);
            }
        }

        static normalize(vec3) {
            var len = this.getLength(vec3);
            if (len < Epsilon$1) {
                console.warn("warning: two small");
            }
            return new Vector3(vec3.x / len, vec3.y / len, vec3.z / len);
        }
        static multiplyV3(vec1, vec2) {
            if (vec1 instanceof (Vector3) && vec2 instanceof (Vector3)) {
                return new Vector3(vec1.x * vec2.x, vec1.y * vec2.y, vec1.z * vec2.z);
            } {
                console.error("multiplyV3, parameter not Vector3");
                return null;
            }

        }
        static V3MultiNum(vec3, num) {
            if (vec3 instanceof (Vector3) && typeof (num) === "number") {
                return new Vector3(vec3.x * num, vec3.y * num, vec3.z * num);
            } {
                console.error("V3MutilNum, unidentified parameters", vec3, num);
                return null;
            }

        }
        static V3ADDV3(args) {
            var res = new Vector3(0, 0, 0);
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] instanceof Vector3) {
                    res.x += arguments[i].x;
                    res.y += arguments[i].y;
                    res.z += arguments[i].z;
                } else {
                    console.error("V3ADDV3, unsupported parameters", V1, V2);
                    return null;
                }
            }
            return res;
        }
        static V3SubV3(V1, V2) {
            if (V1 instanceof Vector3 && V2 instanceof Vector3) {
                return new Vector3(V1.x - V2.x, V1.y - V2.y, V1.z - V2.z);
            }
            console.error("V3SubV3, unsupported parameters", V1, V2);
            return null;

        }
        static multiplyMat(mat1, mat2) {
            return math.multiply(mat1, mat2);
        }

        static vec3ToArr(vec3) {
            return new Float32Array([vec3.x, vec3.y, vec3.z]);
        }

        static mat2Arr(matrix) {
            return new Float32Array(
                math.flatten(
                    math.transpose(matrix)._data));
        }

        static vec3MultiMat4(vec3, mat, w) {
            if (w == undefined) {
                w = 1.0;
            }
            var p = math.matrix([[vec3.x], [vec3.y], [vec3.z], [w]]);
            var rep = math.flatten(math.multiply(mat, p));
            return new Vector4(rep._data[0], rep._data[1], rep._data[2], rep._data[3]);

        }
        static vec4MultiMatrix(vec4, mat) {
            var p = math.matrix([[vec4.x], [vec4.y], [vec4.z], [vec4.w]]);
            var rep = math.flatten(math.multiply(mat, p));
            return new Vector4(rep._data[0], rep._data[1], rep._data[2], rep._data[3]);
        }

        static getNormalMatrixArr(/**@type{Matrix} */modelInv,
            /**@type{Matrix} */viewInv) {
            // normalMatrix = vM.inv.T = (M.inv*V.Inv).T
            return MathUtil.mat2Arr(
                math.transpose(math.multiply(modelInv, viewInv)));

        }

        static isNone(a) {
            if (a === null || a === undefined) {
                return true;
            }
        }

        static bucketSortDict(arr, elementFunc, max, min) {
            var buckets = [];
            var ndict = {};
            var size = max - min + 1;
            for (var i = 0; i < size; i++) {
                buckets[i] = 0;
            }
            for (var j = 0; j < arr.length; j++) {
                var m = arr[j];
                var elemval = elementFunc(m);
                if (elemval > max) {
                    console.error("the value excede the maxmum");
                    return null;
                }
                if (buckets[elemval] !== 0) {
                    buckets[elemval].push(m);
                } else {
                    buckets[elemval] = [m];
                }
            }
            for (var k = 0; k < size; k++) {
                if (buckets[k] !== 0) {
                    ndict[k] = buckets[k];
                }
            }
            return ndict;

        }

        static bucketSort(arr, elementFunc, max, min) {
            var buckets = [];
            var newArr = [];
            var size = max - min + 1;
            for (var i = 0; i < size; i++) {
                buckets[i] = 0;
            }
            for (var j = 0; j < arr.length; j++) {
                var m = arr[j];
                var elemval = elementFunc(m);
                if (elemval > max) {
                    console.error("the value excede the maxmum");
                    return null;
                }
                if (buckets[elemval] !== 0) {
                    buckets[elemval].push(m);
                } else {
                    buckets[elemval] = [m];
                }
            }
            for (var k = 0; k < size; k++) {
                if (buckets[k] !== 0) {
                    for (var t = 0; t < buckets[k].length; t++) {
                        newArr.push(buckets[k][t]);
                    }
                }
            }
            return newArr;
        }


    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-17 19:55:59
     * @Description: file content
     */

    const RotationOrder = {
        "xyz": 0,
        "zyx": 1
    };

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
     var ndy = dy / len;        var citard = Math.asin(-1.0 * ndy);
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

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-17 12:39:57
     * @Description: file content
     */
    const DefaultUniformKey = {
        projectionMatrix: "projectionMatrix",
        modelViewMatrix: "modelViewMatrix"
    };

    function UniTypeInfo(loc,
        /** @type {UTypeEnumn} */utype) {
        this.loc = loc;
        /** @type {UTypeEnumn} */
        this.utype = utype;
        this.value = null;
    }

    function ShaderOption() {
        this.vertexColor = null;
        this.texture0 = null;
        this.depthTest = true;
        this.depthWrite = true;
        this.enableCull = true;
        this.cullFace = "BACK";
        this.castShadow = false;
        this.receiveShadow = false;
        this.uniformsToUp = {};
        this.useUV = false;
        this.IBL = false;
    }

    var AttributeType = {
        vertexPos: true,
        types: {}
    };

    function AttributesInfo() {
        this.vertexPos = -1;
        this.vertexColor = -1;
        this.uv = -1;
        this.vertexNormal = -1;
        this.vertexTangent = -1;
    }

    const UTypeEnumn$1 = {
        Mat4: "uniformMatrix4fv",
        Mat3: "uniformMatrix3fv",
        Vec4: "uniform4fv",
        Vec3: "uniform3fv",
        Vec2: "uniform2fv",
        float: "uniform1f",
        texture: "uniform1i",
        vec2i: "uniform2iv",
        vec3i: "uniform3iv",
        vec4i: "uniform4iv"

    };

    function UniformsInfo() {
        /** @type {UniTypeInfo} */
        this.projectionMatrix = new UniTypeInfo(null, UTypeEnumn$1.Mat4);
        this.modelViewMatrix = new UniTypeInfo(null, UTypeEnumn$1.Mat4);
    }

    function ProgramInfo(/**@type {WebGLProgram}*/program,
        /**@type {AttributesInfo} */
        attribLocations,
        /**@type {UniformsInfo} */
        uniformLocations,
            /**@type {UniformsInfo} */shaderOps) {
        this.program = program;
        /**@type {AttributesInfo} */
        this.attribLocations = attribLocations;
        /**@type {UniformsInfo} */
        this.uniformLocations = uniformLocations;
        /**@type {ShaderOption} */
        this.shaderOption = shaderOps;

    }

    class Program {
        constructor(/** @type {WebGLRenderingContext}*/ gl,
            vsSource, fsSource,
             /**@type {ShaderOption}*/shaderOps) {
            // this.pAttrList=["vertexPos","vertexColor"],
            // this.pUniList={projectionMatrix:UTypeEnumn.Mat4,
            //     modelViewMatrix:UTypeEnumn.Mat4};
            this.gl = gl;
            // this.vsSource = vsSource;
            // this.fsSource = fsSource;
            /**@type {WebGLProgram} */
            this.shaderProgram = Program.initialShaderProgram(gl, vsSource, fsSource);
            /**@type {ProgramInfo} */
            this.programInfo = Program.createProgramInfo(gl, this.shaderProgram, shaderOps);
        }

        updateUniform(key,/** @type {UTypeEnumn}*/type,
            value) {
            var uni = this.programInfo.uniformLocations[key];
            if (uni === undefined) {
                var loc = this.gl.getUniformLocation(this.shaderProgram, key);
                if (loc !== (null )) {
                    this.programInfo.uniformLocations[key] = new UniTypeInfo(loc, type);
                    this.programInfo.uniformLocations[key].value = value;
                    return true;
                } else {
                    console.warn("there is no " + key + "in the complied shader ");
                    return false;
                }
            }
            uni.value = value;
            return true;
        }

        static loadShader(/** @type {WebGLRenderingContext} */gl,
            type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            //console.log(source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var info = gl.getShaderInfoLog(shader);
                alert("shader complier error type = " + type + " info=" + info);
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        static initialShaderProgram(/** @type {WebGLRenderingContext} */gl,
            vsSource, fsSource) {
            const vs = Program.loadShader(gl, gl.VERTEX_SHADER, vsSource);
            if (vs === null) {
                console.error("vertex shader got something wrong", vsSource);
            }
            const fs = Program.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
            if (fs === null) {
                console.error("fragment shader got something wrong", fsSource);
            }
            const shaderProgram = gl.createProgram();
            // console.log("vertexShader::>>",vsSource);
            //console.log("fragmentShader::>>",fsSource);
            gl.attachShader(shaderProgram, vs);
            gl.attachShader(shaderProgram, fs);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert("unable to initialize the shader program:" + gl.getProgramInfoLog(shaderProgram));
                // why not delete program ??
                gl.deleteProgram(shaderProgram);
                return null;
            }
            return shaderProgram;
        }



        static createProgramInfo(/**@type {WebGLRenderingContext}*/gl,
            shaderProgram,
            /**@type {ShaderOption}*/shaderOps
        ) {
            var attributes = new AttributesInfo();
            for (var attr in attributes) {
                // if(shaderOps[attr] !==false){
                var loc = gl.getAttribLocation(shaderProgram, attr);
                if (loc !== -1 && loc !== null && loc !== undefined) {
                    attributes[attr] = loc;
                }

                //}
            }
            var uniforms = new UniformsInfo();
            for (var uni in uniforms) {
                //if(shaderOps[uni] !==false){
                var uloc = gl.getUniformLocation(shaderProgram, uni);
                if (uloc !== -1 && uloc !== null && uloc !== undefined) {
                    uniforms[uni].loc = uloc;
                }
                //}
            }
            var programInfo = new ProgramInfo(shaderProgram, attributes, uniforms, shaderOps);
            return programInfo;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-17 12:58:35
     * @Description: file content
     */

    const RenderMask = {
        everything: 0,
        layers: 1,
        nothing: 2
    };

    const RenderLayer = {
        Background: 10,
        default: 30,
        transparent: 60
    };
    function RenderInfo(/** @type {WebGLRenderingContext} */gl,
        projM, mvM,
        programInfo,
        /** @type {VertexBufferInfo} */vertexBuffer) {
        this.gl = gl;
        this.projectionMatrix = projM;
        this.modelViewMatrix = mvM;
        /**@type {ProgramInfo} */
        this.programInfo = programInfo;
        this.vertexBuffer = vertexBuffer;
    }
    class Render {
        static draw_bindAttributes(/**@type {RenderInfo}*/renderInfo) {
            var gl = renderInfo.gl;
            var bufferInfo = renderInfo.vertexBuffer;
            var programInfo = renderInfo.programInfo;

            for (var attr in programInfo.attribLocations) {
                /**@type {SingleBufferParam}*/
                var sBufinfo = bufferInfo[attr];
                if (sBufinfo !== (undefined) && programInfo.shaderOption[attr] !== false) {
                    if (programInfo.attribLocations[attr] === -1 ||
                        programInfo.attribLocations[attr] === null ||
                        sBufinfo === null) ; else {
                        const numComponents = sBufinfo.perVertexSize; // per iteration for x,y
                        const type = sBufinfo.type;
                        const normalize = sBufinfo.normalize;
                        const stride = sBufinfo.stride;
                        const offset = sBufinfo.voffset;
                        gl.bindBuffer(gl.ARRAY_BUFFER, sBufinfo.id);
                        gl.vertexAttribPointer(
                            programInfo.attribLocations[attr],
                            numComponents,
                            type,
                            normalize,
                            stride,
                            offset);
                        gl.enableVertexAttribArray(
                            programInfo.attribLocations[attr]);
                    }

                }
            }
        }


        static draw_bindUniforms(/**@type {RenderInfo}*/renderInfo) {
            var gl = renderInfo.gl;
            /**@type {ProgramInfo} */
            var programInfo = renderInfo.programInfo;
            gl.useProgram(programInfo.program);
            var texInd = 0;
            //set the shader uniforms:
            for (var uni in programInfo.uniformLocations) {
                /** @type {UniTypeInfo} */
                var uniL = programInfo.uniformLocations[uni];
                if (uniL.value instanceof (Vector3)) {
                    uniL.value = [uniL.value.x, uniL.value.y, uniL.value.z];
                } else if (uniL.value instanceof (Vector4)) {
                    uniL.value = [uniL.value.x, uniL.value.y, uniL.value.z, uniL.value.w];
                }
                var uniVal = uniL.value;
                //console.log(uni, uniL.value);
                var utype = uniL.utype;
                // if(MathUtil.isNone(gl[utype])){
                //     console.error("utype is null",uni,utype);
                // }
                // console.log(uni,uniL.loc);
                if (utype === UTypeEnumn$1.Mat3 || utype === UTypeEnumn$1.Mat4) {
                    gl[utype](uniL.loc, false, uniVal);
                    //todo problem  some smaller picture may get loaded faster, but texInd????
                } else if (utype === UTypeEnumn$1.texture) {
                    if (uniVal.state === LoadState.loaded) {
                        gl.activeTexture(gl["TEXTURE" + texInd]);
                        gl.bindTexture(gl[uniVal.type], uniVal.glTexture);
                        //gl[utype]
                        gl.uniform1i(uniL.loc, texInd);
                        texInd = texInd + 1;
                    } else {
                        return false;
                    }


                } else {
                    gl[utype](uniL.loc, uniVal);
                }

            }
            return true;
        }

        static drawRender(/**@type {RenderInfo}*/renderInfo) {
            var gl = renderInfo.gl;
            var buffers = renderInfo.vertexBuffer;

            // tell gpu attributes of vertex shader
            Render.draw_bindAttributes(renderInfo);
            // tell gpu which shaderProgram to use bind uniforms
            var isbu = Render.draw_bindUniforms(renderInfo);
            if (!isbu) {
                return;
            }
            // draw primitives :
            const vertexCount = buffers.vertexCount;
            var indices = buffers.vertexIndices;
            if (indices !== (null ) && indices.id !== (null )) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.id);
                gl.drawElements(buffers.primitiveType, vertexCount * indices.perVertexSize, indices.type, 0);
            } else {
                gl.drawArrays(buffers.primitiveType, 0, vertexCount);
            }

        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-18 23:30:25
     * @Description: file content
     */

    class Entity {
        constructor(name) {
            /**@type {Transform} */
            this.transform = new Transform();
            this.name = name;
            this.id = Entity.createId();
            /** @type {Mesh} */
            this.mesh = null;
            /**@type {Material} */
            this.material = null;
            //this.depthMaterial = null;
            this.renderLayer = RenderLayer.default;
        }
        copy(name) {
            if (name === null) {
                name = this.name + "copy";
            }
            var nent = new Entity(name);
            nent.mesh = this.mesh;
            nent.material = this.material;
            nent.transform.copyFrom(this.transform);
            //nent.depthMaterial = this.depthMaterial;
            return nent;
        }
        static createId() {
            Entity.id = Entity.id + 1;
            return Entity.id;
        }

        setRenderLayer(layer) {
            this.renderLayer = layer;
        }

        getRenderLayer() {
            return this.renderLayer;
        }

        // getActiveMaterial(/**@type {Camera}*/camera){
        //     if(!MathUtil.isNone(camera.renderTarget) &&
        //         !camera.renderTarget.hasColorBuffer &&
        //          !MathUtil.isNone(this.depthMaterial)){
        //             return this.depthMaterial;
        //          }else{
        //              return this.material;
        //          }
        // }


    }
    Entity.id = 0;

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-17 12:31:25
     * @Description: file content
     */

    const ClearMask = {
        default: 0,
        notClear: 1,
        onlyDepth: 2
    };
    const CameraType = {
        default: 0,
        depth: 1,
        bloom_col2: 2

    };

    class Camera {
        constructor() {
            this.transform = new Transform();
            this.transform.rotOrder = RotationOrder.zyx;
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
            this.clearColor = [0.2, 0.3, 0.4, 1.0];
            this.clearMask = ClearMask.default;
            this.isOrthogonal = false;
            this.id = Camera.createId();
            this.type = CameraType.default;
            this.enable = true;
            this.beforeDrawFunc = null;
            this.afterDrawFunc = null;
            this.drawMips = false;

            this.isGeneral = false;
            this.left = -10.0;
            this.right = 10.0;
            this.top = -10.0;
            this.bottom = 10.0;

        }
        static createId() {
            Entity.id = Entity.id + 1;
            return Entity.id;
        }
        setFov(fov) {
            this.fov = fov;
            this.dirty = true;
        }
        setNear(near) {
            this.near = near;
            this.dirty = true;
        }
        setFar(far) {
            this.far = far;
            this.dirty = true;
        }
        setAsp(asp) {
            this.asp = asp;
            this.dirty = true;
        }
        getNear() {
            return this.near;
        }
        getFar() {
            return this.far;
        }

        __updatePersp() {
            if (this.dirty) {
                //a = fov/2
                //ia =1/tan(a)
                // 1/asp*tan(a) 0,        0,       0, 
                // 0,           1/tan(a), 0,       0,
                // 0,           0,        f+n/f-n, fn/(n-f)  
                // 0,           0,        1        0
                // why last row 1 -->-1 z=-n 
                // why change f+n/f-n -->f+n/n-f????  z from (n,f) to (1,-1)
                var a = this.fov * Math.PI / (2.0 * 180.0);
                var ia = 1 / Math.tan(a);
                var n = this.near; var f = this.far;
                this.projectionMat = math.matrix(
                    [[ia / this.asp, 0, 0, 0],
                    [0, ia, 0, 0],
                    [0, 0, (f + n) / (n - f), 2 * f * n / (n - f)],
                    [0, 0, -1, 0]]);
                this.glProjArray = new Float32Array(
                    math.flatten(
                        math.transpose(this.projectionMat)._data
                    ));
                this.dirty = false;
            }
        }
        __updateOrth() {
            if (this.dirty) {
                // h = this.near *tan(this.fov/2.0)
                // a = h*asp
                // x = -a x' = -1, x = a x' = 1   x' = x/a;
                // y =-h y' =-1 , y= h y' = 1   y' = y/h;
                // z = f z' = 1,  z=n, z' =-1,  z' = 2*(z-n)/(f-n)-1
                // [1/a,0,0,0] [0,1/h,0,0] [0,0,2/(f-n),-2*n/(f-n)-1] [0,0,0,1]
                var h = this.near * Math.tan(this.fov * Math.PI * 0.5 / 180.0);
                var a = h * this.asp;
                var f = -1.0 * this.far;
                var n = -1.0 * this.near;
                this.projectionMat = math.matrix([[1 / a, 0, 0, 0], [0, 1 / h, 0, 0],
                [0, 0, 2 / (f - n), (-n - f) / (f - n)], [0, 0, 0, 1]]);
                this.glProjArray = new Float32Array(
                    math.flatten(
                        math.transpose(this.projectionMat)._data
                    ));
                this.dirty = false;
            }
        }
        switchProjection(isOrthogonal) {
            this.isOrthogonal = isOrthogonal;
            this.dirty = true;
        }

        setFrustrum(left, right, top, bottom) {
            this.left = left;
            this.right = right;
            this.top = top;
            this.bottom = bottom;
            this.isGeneral = true;
            this.dirty = true;
        }
        __updateGeneral() {
            // 2n/(right-left), 0, right+left/(right-left), 0
            // 0, 2near/(top-bottom), top+bottom/(top-bottom), 0
            // 0, 0,  f+n/f-n, 2fn/f-n
            // 0, 0, -1, 0 
            var n = this.near; var f = this.far;
            var right = this.right; var left = this.left;
            var top = this.top; var bottom = this.bottom;

            this.projectionMat = math.matrix(
                [[2 * n / (right - left), 0, (right + left) / (right - left), 0],
                [0, 2 * n / (top - bottom), (top + bottom) / (top - bottom), 0],
                [0, 0, (f + n) / (n - f), 2 * f * n / (n - f)],
                [0, 0, -1, 0]]);
            this.glProjArray = new Float32Array(
                math.flatten(
                    math.transpose(this.projectionMat)._data
                ));
            this.dirty = false;


        }
        update() {
            if (this.isGeneral) {
                this.__updateGeneral();
                return;
            }
            if (this.isOrthogonal) {
                this.__updateOrth();
            } {
                this.__updatePersp();
            }
        }
        getProjectionMatrix() {
            this.update();
            return this.projectionMat;
        }
        getViewMatrix() {
            this.update();
            return this.transform.getDerivInvTranMatrix();
        }
        getGLProj() {
            this.update();
            return this.glProjArray;
        }
        // getGLView(){
        //     this.update();
        //     return this.transform.getInvGLTrans();
        // }

        addRenderLayer(layer) {
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

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-13 19:53:44
     * @Description: file content
     */

    class CameraUtil {
        static createDefaultCamera(asp) {
            if (asp === undefined) {
                asp = 1.77;
            }
            var cam = CameraUtil.createCamera(45, 0.1, 100, asp);
            /**@type {Transform} */
            var transform = cam.transform;
            transform.setPosition(0, 0, 8);
            cam.name = "default_camera";
            return cam;
        }

        static createCamera(fov, near, far, asp) {
            var cam = new Camera();
            cam.setFov(fov);
            cam.setFar(far);
            cam.setNear(near);
            cam.setAsp(asp);
            return cam;
        }

        static createRTCamera(rt_w, rt_h, type, layers) {
            var cam = CameraUtil.createDefaultCamera(rt_w / rt_h);
            var rt = new RenderTexture("Camera", rt_w, rt_h);
            cam.renderTarget = rt;
            cam.type = type;
            cam.renderMask = RenderMask.layers;
            for (var i in layers) {
                var ly = layers[i];
                cam.addRenderLayer(ly);
            }
            return cam;
        }


        static createShadowCamera(rt_w, rt_h, isOrtho, lightPos) {
            if (isOrtho === undefined) {
                isOrtho = true;
            }
            var w = rt_w;
            var h = rt_h;
            var asp = w / h;
            var camDepth = 30;
            var fov = 60.0;
            var near = 0.1;
            var far = 100.0;
            if (isOrtho) {
                fov = 170.0;
                near = 0.5;
                far = 100.0;
            }
            var cam = CameraUtil.createCamera(fov, near, far, asp);
            var rt = new RenderTexture("Camera", w, h);
            rt.hasColorBuffer = false;
            cam.renderTarget = rt;
            cam.switchProjection(isOrtho);
            cam.clearMask = ClearMask.onlyDepth;
            cam.name = "shadow_camera";
            cam.depth = camDepth;
            cam.type = CameraType.depth;
            cam.renderMask = RenderMask.layers;
            cam.addRenderLayer(RenderLayer.default);
            cam.transform.setPosition(lightPos.x, lightPos.y, lightPos.z);
            // console.log("sum Simulator>>Debug1:rot> pos>",cam.transform.rot,cam.transform.pos);

            cam.transform.lookAt(0, 0, 0);
            //console.log("sum Simulator>>Debug: rot> pos>",cam.transform.rot,cam.transform.pos);
            return cam;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-02 11:13:23
     * @Description: file content
     */
    const Layout = { Default: 0, UseOwn: 1 };

    class CanvasUtil {
        static initCanvas(canvasId, layout) {
            // init Canvas
            var canvas = document.getElementById(canvasId);
            if (layout === undefined || layout === Layout.Default) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            //canvas.addEventListener("touchmove",responseToMouse,false);
            /** @type {WebGLRenderingContext} */
            var gl = canvas.getContext("webgl", {});
            if (gl === null) {
                gl = canvas.getContext("experimental-webgl");
            }
            if (gl === null) {
                alert("Unable to initialize the webgl context");
            }
            /** @type {WebGLRenderingContext} */
            return gl;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-17 13:03:20
     * @Description: file content
     */

    function SingleBufferParam(
        /**@type {WebGLBuffer}*/id,
        type, perVertexSize) {
        /**@type {WebGLBuffer} */
        this.id = id;
        /**@type {mode} */
        this.type = type;
        this.perVertexSize = perVertexSize; // per iteration for x,y
        this.normalize = false;
        this.stride = 0;
        this.voffset = 0;
    }

    class VertexBufferInfo {
        constructor() {
            /**@type {SingleBufferParam} */
            this.vertexPos = null;
            /**@type {SingleBufferParam} */
            this.vertexColor = null;
            /**@type {SingleBufferParam} */
            this.vertexIndices = null;
            this.vertexCount = -1;
            this.primitiveType = null;
        }
    }
    class VertexBuffer {
        static createBufferParam(
            /**@type {WebGLRenderingContext} */gl,
            /**@type {Array}*/Arr,
            vertexCount,
            vType,
            bufType) {
            var bufId = gl.createBuffer();
            gl.bindBuffer(bufType, bufId);
            var glArr = null;
            if (vType === gl.FLOAT) {
                glArr = new Float32Array(Arr);

            } else if (vType === gl.UNSIGNED_SHORT) {
                glArr = new Uint16Array(Arr);
            } else {
                console.error("createBufferParam:error:unspported vertex type:", type);
                return null;
            }
            gl.bufferData(bufType, glArr, gl.STATIC_DRAW);
            var vertexNums = Arr.length / vertexCount;
            return new SingleBufferParam(bufId, vType, vertexNums);
        }

        static addInfoToVB(/**@type {WebGLRenderingContext} */gl,
            /**@type {VertexBufferInfo}*/vBInfo,
            /**@type {Array}*/Arr,
            /**@type {string}*/key,
            vType, bufType) {
            if (Arr instanceof (Array)) {
                AttributeType.types[key] = true;
                vBInfo[key] = VertexBuffer.createBufferParam(gl,
                    Arr, vBInfo.vertexCount, vType, bufType);
                return true;
            } else {
                console.log("addInfoToVB error: infoName=" + key, " Arr type should be Array not", typeof (Arr));
                return false;
            }

        }

        static addPos(/**@type {WebGLRenderingContext} */gl,
            /**@type {VertexBufferInfo}*/vBInfo,
            /**@type {Array}*/posArr) {
            return VertexBuffer.addInfoToVB(gl, vBInfo,
                posArr, "vertexPos", gl.FLOAT, gl.ARRAY_BUFFER);
        }

        static addColor(/**@type {WebGLRenderingContext} */gl,
             /**@type {VertexBufferInfo}*/vBInfo,
             /**@type {Array}*/colorArr) {
            return VertexBuffer.addInfoToVB(gl, vBInfo,
                colorArr, "vertexColor", gl.FLOAT, gl.ARRAY_BUFFER);

        }

        static addIndices(/**@type {WebGLRenderingContext} */gl,
            /**@type {VertexBufferInfo}*/vBInfo,
             /**@type {Array}*/indicesArr) {
            return VertexBuffer.addInfoToVB(gl, vBInfo,
                indicesArr, "vertexIndices", gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);
        }


        static initVertexBuffer(
            /**@type {WebGLRenderingContext} */gl,
            vertexCount,
            primitiveType) {
            var vertBuffInfo = new VertexBufferInfo();
            vertBuffInfo.vertexCount = vertexCount;
            if (primitiveType === null) {
                vertBuffInfo.primitiveType = gl.TRIANGLE_STRIP;
            } else {
                vertBuffInfo.primitiveType = primitiveType;
            }
            /**@type {VertexBufferInfo}*/
            return vertBuffInfo;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-18 23:46:31
     * @Description: file content
     */

    const PrimitiveType$1 = {
        TriangularStrip: 0,
        Point: 1,
        LineStrip: 2,
        LineLoop: 3,
        Triangular: 4,
        TriangularFan: 5,
        Line: 6,
    };
    class Mesh$1 {
        constructor() {
            this.vertexPos = null;
            this.vertexColor = null;
            this.vertexIndices = null;
            this.vertexNormal = null;
            this.vertexTangent = null;
            this.uv = null;
            this.vertexCount = 0;
            this.primitiveType = PrimitiveType$1.TriangularStrip;
            /**@type {VertexBufferInfo} */
            this.vertexBufferInfo = null;
            this.dirty = true;
            this.stateDirty = true;
            this.posDirty = false;
        }
        setPrimitiveType(/**@type {PrimitiveType} */ type) {
            this.primitiveType = type;
            this.stateDirty = true;
        }
        updateStates(/**@type {WebGLRenderingContext} */ gl) {
            if (this.stateDirty) {
                //update states:
                var glPrimitive = Mesh$1.switchToGLPrimType(gl, this.primitiveType);
                this.vertexBufferInfo.primitiveType = glPrimitive;
                this.stateDirty = false;
            }
        }
        updateVertexPosByIndex(i, pos) {
            this.vertexPos[i] = pos;
            this.posDirty = true;
        }
        updateAllVertexPos(pos) {
            this.vertexPos = pos;
            this.vertexCount = pos.length / 3;
            this.posDirty = true;
        }
        update(/**@type {WebGLRenderingContext} */ gl) {
            if (this.posDirty) {
                var bid = this.vertexBufferInfo.vertexPos.id;
                gl.bindBuffer(gl.ARRAY_BUFFER, bid);
                // console.log(gl.getError());
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    new Float32Array(this.vertexPos),
                    gl.STATIC_DRAW
                );
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                //console.log(gl.getError());
                this.posDirty = false;
            }
            if (this.dirty) {
                delete this.vertexBufferInfo;
                this.vertexBufferInfo = VertexBuffer.initVertexBuffer(
                    gl,
                    this.vertexCount
                );
                AttributeType.types = {};
                if (this.vertexPos !== null) {
                    VertexBuffer.addPos(gl, this.vertexBufferInfo, this.vertexPos);
                }
                if (this.vertexColor !== null) {
                    VertexBuffer.addColor(gl, this.vertexBufferInfo, this.vertexColor);
                }
                if (this.uv !== null) {
                    VertexBuffer.addInfoToVB(
                        gl,
                        this.vertexBufferInfo,
                        this.uv,
                        "uv",
                        gl.FLOAT,
                        gl.ARRAY_BUFFER
                    );
                }
                if (this.vertexNormal !== null) {
                    VertexBuffer.addInfoToVB(
                        gl,
                        this.vertexBufferInfo,
                        this.vertexNormal,
                        "vertexNormal",
                        gl.FLOAT,
                        gl.ARRAY_BUFFER
                    );
                }
                if (this.vertexIndices !== null) {
                    VertexBuffer.addIndices(gl, this.vertexBufferInfo, this.vertexIndices);
                }
                if (this.vertexTangent !== null) {
                    VertexBuffer.addInfoToVB(
                        gl,
                        this.vertexBufferInfo,
                        this.vertexTangent,
                        "vertexTangent",
                        gl.FLOAT,
                        gl.ARRAY_BUFFER
                    );
                }

                this.updateStates(gl);
                this.dirty = false;
            }
        }

        getVertexBufferInfo(/**@type {WebGLRenderingContext} */ gl) {
            this.update(gl);
            this.updateStates(gl);
            return this.vertexBufferInfo;
        }

        static switchToGLPrimType(/**@type {WebGLRenderingContext}*/ gl, pType) {
            var gType = gl.TRIANGLE_STRIP;
            switch (pType) {
                case PrimitiveType$1.TriangularStrip:
                    break;
                case PrimitiveType$1.LineStrip:
                    gType = gl.LINE_STRIP;
                    break;
                case PrimitiveType$1.LineLoop:
                    gType = gl.LINE_LOOP;
                    break;
                case PrimitiveType$1.Triangular:
                    gType = gl.TRIANGLES;
                    break;
                case PrimitiveType$1.TriangularFan:
                    gType = gl.TRIANGLE_FAN;
                    break;
                case PrimitiveType$1.Point:
                    gType = gl.POINTS;
                    break;
                case PrimitiveType$1.Line:
                    gType = gl.LINES;
            }
            return gType;
        }

        static createFromArray(vertexNums, posArr, colorArr = null) {
            var mesh = new Mesh$1();
            mesh.vertexCount = vertexNums;
            mesh.vertexPos = posArr;
            mesh.vertexColor = colorArr;
            return mesh;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-12-28 14:23:56
     * @Description: file content
     */

    class GridMesh$1 extends Mesh$1 {
        constructor(params) {
            super();
            this.w = params.w === undefined ? 1 : params.w;
            this.h = params.h === undefined ? 1 : params.h;
            this.m = params.m === undefined ? 2 : params.m;
            this.n = params.n === undefined ? 2 : params.n;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-20 17:47:05
     * @Description: file content
     */

    const PlaneMode = {
        "xy": 0,
        "xz": 1
    };

    class MeshUtil {
        static createMDWelcomeMesh() {
            // get vertexBuffers
            var posArr = [
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, -1.0, 0.0,
                -1.5, -1.2, 0.0,
            ];

            var colorArr = [
                1.0, 1.0, 1.0, 1.0,
                0.5, 0.5, 0.6, 1.0,
                0.7, 0.7, 0.7, 1.0,
                1.0, 1.0, 0.3, 1.0,
                0.1, 0.1, 0.2, 1.0,
            ];
            /**@type {Mesh} */
            var mesh = Mesh.createFromArray(5, posArr, colorArr);
            mesh.setPrimitiveType(PrimitiveType.TriangularStrip);
            return mesh;
        }

        static createCameraPlane(
            /**@type {Camera} */cam,
            color) {
            var a = Math.PI * cam.fov / 360.0;
            // console.log(cam.fov,a);
            var height = 2.0 * Math.tan(a) * cam.near;
            var width = height * cam.asp;
            var z = -cam.near;
            //+cam.transform.pos.z
            // console.log("createCameraPlane:::",width,height,z);
            return MeshUtil.createColorPlane(width, height, color, z);
        }



        static createPlane(width, height, zValue, hasTangent, planeMode) {

            var a = 0.5;
            var b = 0.5;
            var c = 0.0;
            if (typeof (width) === "number") {
                a = width / 2.0;
            }
            if (typeof (height) === "number") {
                b = height / 2.0;
            }
            if (typeof (zValue) === "number") {
                c = zValue;
            }

            var posArr = null;
            var vtn = [0.0, 0.0, 1.0];
            if (planeMode === PlaneMode.xz) {
                posArr = [
                    -a, c, b,
                    a, c, b,
                    a, c, -b,
                    -a, c, -b,
                ];
                vtn = [0.0, 1.0, 0.0];

            } else {
                var posArr = [
                    // Front face
                    -a, -b, c,
                    a, -b, c,
                    a, b, c,
                    -a, b, c,
                ];
            }
            var uvArr = [
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0

            ];
            var vertexNormal = [
                // Front
                vtn[0], vtn[1], vtn[2],
                vtn[0], vtn[1], vtn[2],
                vtn[0], vtn[1], vtn[2],
                vtn[0], vtn[1], vtn[2],
            ];
            /**@type {Mesh} */
            var mesh = Mesh.createFromArray(4, posArr, null);
            mesh.setPrimitiveType(PrimitiveType.TriangularFan);
            mesh.uv = uvArr;
            mesh.vertexNormal = vertexNormal;
            /**@type {Mesh} */

            if (hasTangent) {
                var vertexTangent = [
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                ];
                mesh.vertexTangent = vertexTangent;
            }

            return mesh;
        }

        static _pushLineIndices(inds, lx1, ly1, lx2, ly2, m, n) {
            if (lx1 >= m || lx2 >= m || ly1 >= n || ly2 >= n) {
                return;
            }
            console.log(lx1 * m + ly1, lx2 * m + ly2);
            inds.push(lx1 * m + ly1, lx2 * m + ly2);
        }

        static createGridMesh(m, n, width, height, z, hasTangent, isLine = false) {
            var a = 1.0;
            var b = 1.0;
            var c = 0.0;
            m = m === undefined ? 2 : m;
            n = n === undefined ? 2 : n;
            if (typeof (width) === "number") {
                a = width;
            }
            if (typeof (height) === "number") {
                b = height;
            }
            if (typeof (z) === "number") {
                c = z;
            }
            var r_sp = b / m;
            var c_sp = a / n;
            var left = -a / 2.0; var top = -b / 2.0; //x,z
            console.log("space", r_sp, c_sp, m, n);
            var posArr = [];
            var uvArr = [];
            var vertexNormal = [];
            var vertexTangent = [];
            var vtn = [0.0, 0.0, 1.0];
            for (var i = 0; i <= m; i++) {
                var db = top + r_sp * i;
                for (var j = 0; j <= n; j++) {
                    var da = left + c_sp * j;
                    posArr.push(da, c, db);
                    console.log("posx,posz", da, db);
                    uvArr.push(r_sp * i / a, c_sp * j / b);
                    vertexNormal.push(vtn[0], vtn[1], vtn[2]);
                    if (hasTangent) {
                        vertexTangent.push(1.0, 0.0, 0.0);
                    }
                }
            }
            var indices = [];
            var tm = m + 1;
            if (isLine) {
                for (var id = 0; id < m + 1; id++) {
                    for (var jd = 0; jd < n + 1; jd++) {
                        //id0: i,j  id1 i,j+1
                        //id0: i,j  id2 i+1,j+1
                        //id0: i,j  id3 i,j+1 
                        MeshUtil._pushLineIndices(indices, id, jd, id, jd + 1, m + 1, n + 1);
                        MeshUtil._pushLineIndices(indices, id, jd, id + 1, jd + 1, m + 1, n + 1);
                        MeshUtil._pushLineIndices(indices, id, jd, id + 1, jd, m + 1, n + 1);
                    }
                }
            } else {
                for (var id = 0; id < m; id++) {
                    for (var jd = 0; jd < n; jd++) {

                        // id0: i,j,  id1: i+1,j+1 id2: i,j+1, 
                        // id3: i,j,  id4:i+1,j   id5:i+1,j+1
                        indices.push(id * tm + jd, (id + 1) * tm + jd + 1, id * tm + jd + 1);
                        indices.push(id * tm + jd, (id + 1) * tm + jd, (id + 1) * tm + jd + 1);

                    }
                }
            }


            console.log("indices", indices);

            /**@type {Mesh} */
            var mesh = new GridMesh({ w: width, h: height, m: m, n: n });
            mesh.vertexCount = (m + 1) * (n + 1);
            mesh.vertexIndices = indices;
            mesh.vertexPos = posArr;
            //mesh.vertexColor = colorArr;
            if (isLine) {
                console.log("isline>>>>>");
                mesh.setPrimitiveType(PrimitiveType.Line);
            } else {
                console.log("triangel>>>>>");
                mesh.setPrimitiveType(PrimitiveType.Triangular);
            }

            mesh.uv = uvArr;
            mesh.vertexNormal = vertexNormal;
            /**@type {Mesh} */

            if (hasTangent) {
                mesh.vertexTangent = vertexTangent;
            }

            return mesh;
        }

        static createColorPolygon(colors, indices, posArr) {
            // var uvArr =[
            //     0.0,0.0,
            //     1.0,0.0,
            //     1.0,1.0,
            //     0.0,1.0

            // ];

            var mesh = Mesh.createFromArray(posArr.length / 3, posArr, null);
            mesh.setPrimitiveType(PrimitiveType.Triangular);
            mesh.vertexColor = colors;
            //mesh.uv = uvArr;
            mesh.vertexIndices = indices;
            return mesh;
        }

        static createColorPlane(width, height, color, zValue) {
            var plane = MeshUtil.createPlane(width, height, zValue);
            if (color === undefined) {
                color = [0.5, 0.6, 0.8, 1.0];
            }
            var vc = plane.vertexCount;
            var colorArr = null;
            if (color.length == vc * 4.0) {
                colorArr = color;
            } else {
                colorArr = [];
                for (var i = 0; i < vc; i++) {
                    Array.prototype.push.apply(colorArr, color);
                }
            }
            plane.vertexColor = colorArr;
            return plane;
        }

        static createBox(width, height, thick, hasTangent, anchor) {
            var a = 0.5;
            var b = 0.5;
            var c = 0.5;
            if ("number" === typeof (width)) {
                a = width / 2.0;
            }
            if ("number" === typeof (height)) {
                b = height / 2.0;
            }
            if ("number" === typeof (thick)) {
                c = thick / 2.0;
            }


            var posArr = [
                // Front face
                -a, -b, c,
                a, -b, c,
                a, b, c,
                -a, b, c,

                // Back face
                -a, -b, -c,
                -a, b, -c,
                a, b, -c,
                a, -b, -c,

                // Top face
                -a, b, -c,
                -a, b, c,
                a, b, c,
                a, b, -c,

                // Bottom face
                -a, -b, -c,
                a, -b, -c,
                a, -b, c,
                -a, -b, c,

                // Right face
                a, -b, -c,
                a, b, -c,
                a, b, c,
                a, -b, c,

                // Left face
                -a, -b, -c,
                -a, -b, c,
                -a, b, c,
                -a, b, -c,


            ];
            if (anchor !== undefined) {
                var dx = width * anchor[0];
                var dy = height * anchor[1];
                var dz = thick * anchor[2];
                for (var i = 0; i < 24; i++) {
                    posArr[i * 3] -= dx;
                    posArr[i * 3 + 1] -= dy;
                    posArr[i * 3 + 2] -= dz;
                }
            }

            var uv = [
                // Front face
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                // back face
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                //top
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                //bottom
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                //right
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                //left
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0

            ];

            var vertexNormal = [
                // Front
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                // Back
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

                // Top
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                // Bottom
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,

                // Right
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                // Left
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0
            ];



            var indinces = [
                0, 1, 2, 0, 2, 3,    // front
                4, 5, 6, 4, 6, 7,    // back
                8, 9, 10, 8, 10, 11,   // top
                12, 13, 14, 12, 14, 15,   // bottom
                16, 17, 18, 16, 18, 19,   // right
                20, 21, 22, 20, 22, 23,   // left
            ];

            /**@type {Mesh} */
            var mesh = Mesh.createFromArray(24, posArr, null);
            mesh.vertexIndices = indinces;
            mesh.uv = uv;
            mesh.vertexNormal = vertexNormal;
            mesh.setPrimitiveType(PrimitiveType.Triangular);
            if (hasTangent) {
                var tns = [
                    // Front
                    1.0, 0.0, 0.0,
                    // Back
                    -1.0, 0.0, 0.0,
                    // Top
                    1.0, 0.0, 0.0,
                    // Bottom
                    1.0, 0.0, 0.0,
                    // Right
                    0.0, 0.0, -1.0,
                    // Left
                    0.0, 0.0, 1.0,
                ];
                mesh.vertexTangent = [];
                for (var i in tns) {
                    for (var j = 0; j < 4; j++) {
                        mesh.vertexTangent.push(tns[i]);
                    }
                }
            }
            return mesh;
        }

        static createColorBox(width, height, thick,
            /** @type {Array}
             * 6*4 Array,color:[r,g,b,a]
             * [front, back, top, bottom, right, left]
             */
            faceColors) {
            var mesh = MeshUtil.createBox(width, height, thick);
            var fcs = null;
            if (faceColors instanceof (Array)) {
                fcs = faceColors;
            } else {
                fcs = [
                    [0.8, 0.8, 0.8, 1.0],    // Front face: white
                    [0.7, 0.4, 0.4, 1.0],    // Back face: red
                    [0.55, 0.70, 0.35, 1.0],    // Top face: green
                    [0.3, 0.3, 0.7, 1.0],    // Bottom face: blue
                    [0.7, 0.7, 0.3, 1.0],    // Right face: yellow
                    [0.7, 0.35, 0.65, 1.0],    // Left face: purple
                ];
            }
            var colorArr = [];
            for (var i in fcs) {
                var fc = fcs[i];
                // every 4 vertexs decide a face
                for (var j = 0; j < 4; j++) {
                    Array.prototype.push.apply(colorArr, fc);
                }
            }
            mesh.vertexColor = colorArr;
            return mesh;


        }
        static createSphereIndices(i, j, columns, indices) {
            if (i > 0) {
                if (j === 0) {
                    // last row (i-1)*columns+j  (i-1)*columns+j+1
                    var fp1 = (i - 1) * columns + j;
                    var fp2 = i * columns + j;
                    var fp3 = fp1 + 1;
                    indices.push(fp1, fp2, fp3);
                } else if (j === columns - 1) {
                    //p1/p2 (i)*columns+j-1  (i)*columns+j+1
                    var ep1 = (i) * columns + j - 1;
                    var ep2 = i * columns + j;
                    var ep3 = (i - 1) * columns + j;
                    indices.push(ep1, ep2, ep3);
                } else {
                    var mp1 = i * columns + j - 1;
                    var mp2 = i * columns + j;
                    var mp3 = (i - 1) * columns + j;
                    var mp4 = (i - 1) * columns + j + 1;
                    //1,2,3 2,4,3
                    indices.push(mp1, mp2, mp3);
                    indices.push(mp3, mp2, mp4);
                }
            }

        }

        static createSphere(radius, rows, columns, hasTangent) {
            if (radius === undefined) {
                radius = 1;
            }

            if (rows === undefined) {
                rows = 20;
            }
            if (columns === undefined) {
                columns = 20;
            }

            var uv = [];
            var vertexNormal = [];
            var posArr = [];
            var indices = [];
            var vT = [];
            // console.log("rows>>>>>columns>>>",rows,columns);
            for (var i = 0; i < rows; i++) {
                // map lon from 0-1 to 0 to PI
                var lat = i / (rows - 1);
                // map from 0-1 to -PI to PI
                //lat =(lat*2.0-1)*Math.PI;
                lat = lat * Math.PI;
                for (var j = 0; j < columns; j++) {
                    var lon = j / (columns - 1);
                    // map from 0-1 to PI to -PI
                    lon = (1.0 - lon * 2.0) * Math.PI;
                    var y = Math.cos(lat);
                    var x = Math.sin(lat) * Math.cos(lon);
                    var z = Math.sin(lat) * Math.sin(lon);
                    posArr.push(x * radius, y * radius, z * radius);
                    vertexNormal.push(x, y, z);
                    uv.push(j / (columns - 1.0), 1.0 - i / (rows - 1.0));
                    if (hasTangent) {
                        var vtz = Math.cos(lon);
                        var vtx = Math.sin(lon);
                        vT.push(vtx, 0, vtz);
                    }
                    MeshUtil.createSphereIndices(i, j, columns, indices);
                }
            }
            //console.log(uv.length);
            /**@type {Mesh} */
            var mesh = Mesh.createFromArray(rows * columns, posArr, null);
            mesh.uv = uv;
            mesh.vertexNormal = vertexNormal;
            mesh.vertexIndices = indices;
            if (hasTangent) {
                mesh.vertexTangent = vT;
            }
            mesh.setPrimitiveType(PrimitiveType.Triangular);
            return mesh;
        }

        static createDoughnuts(iradius, oradius, rows, columns) {
            if (iradius === undefined) {
                iradius = 0.7;
            }
            if (oradius === undefined) {
                oradius = 1;
            }
            if (rows === undefined) {
                rows = 20;
            }
            if (columns === undefined) {
                columns = 20;
            }
            var uv = [];
            var vertexNormal = [];
            var posArr = [];
            var indices = [];

            var pradius = (oradius - iradius) / 2.0;
            for (var i = 0; i < rows; i++) {

                var lat = i / (rows - 1); // piple angle 
                lat = lat * 2.0 * Math.PI;
                for (var j = 0; j < columns; j++) {
                    var lon = j / (columns - 1);
                    lon = lon * 2.0 * Math.PI; // 
                    var y = Math.sin(lat) * pradius;
                    var l = Math.cos(lat) * pradius + pradius + iradius;

                    var x = l * Math.cos(lon);
                    var z = l * Math.sin(lon);
                    posArr.push(x, y, z);
                    var pcx = (iradius + pradius) * Math.cos(lon);
                    var pcy = 0.0;
                    var pcz = (iradius + pradius) * Math.sin(lon);
                    // console.log("now>>>>>");
                    // console.log(i,j,lat,lon);

                    // console.log("point center",pcx,pcy,pcz);
                    // console.log("vertex",x,y,z);
                    var nx = x - pcx; var ny = y - pcy; var nz = z - pcz;
                    var nl = MathUtil.getLength(nx, ny, nz);
                    vertexNormal.push(nx / nl, ny / nl, nz / nl);
                    uv.push(j / (columns - 1), i / (rows - 1));
                    MeshUtil.createSphereIndices(i, j, columns, indices);
                }
                // 0 1 2 3...columns-1
                // columns ..........2columns -1
                // ri*columns + 0 ri*columns + 1 ..... ri*columns + columns-1


            }
            //console.log(indices);
            /**@type {Mesh} */
            var mesh = Mesh.createFromArray(rows * columns, posArr, null);
            mesh.uv = uv;
            mesh.vertexNormal = vertexNormal;
            mesh.vertexIndices = indices;
            mesh.setPrimitiveType(PrimitiveType.Triangular);
            return mesh;
        }

        static createCircle(r, nums) {
            if (r === undefined) {
                r = 1.0;
            }
            if (nums === undefined) {
                nums = 30;
            }
            var posArr = [];
            var vertexNormal = [];
            var uv = [];
            posArr.push(0, 0, 0);
            uv.push(0.5, 0.5);
            vertexNormal.push(0, 1, 0);
            var vertexIndices = [];
            for (var i = 0; i < nums; i++) {
                // map from 0-1, to 0,360
                var t = i / nums * Math.PI * 2.0;
                // x,z plane
                //var z = -1.0*Math.cos(t);
                //var x = Math.sin(t);
                var x = Math.sin(t);
                var z = Math.cos(t);
                var y = 0.0;
                posArr.push(r * x, y, r * z);
                vertexNormal.push(0, 1, 0);
                var u = x * 0.5 + 0.5;
                var v = z * 0.5 + 0.5;
                uv.push(u, v);
                if (i > 0) {
                    //vertexIndices.push(0,i+1,i);
                    vertexIndices.push(0, i, i + 1);
                }
            }
            vertexIndices.push(0, nums, 1);
            var mesh = Mesh.createFromArray(nums + 1, posArr, null);
            mesh.uv = uv;
            mesh.vertexNormal = vertexNormal;
            mesh.vertexIndices = vertexIndices;
            mesh.setPrimitiveType(PrimitiveType.Triangular);
            return mesh;
        }

        static createTaper(height, radius, nums) {
            var posArr = [];
            var uv = [];
            var vertexNormal = [];
            //var vertexIndices = [];

            for (var i = 0; i < nums; i++) {
                var lat = i / (nums);
                // map lat from 0,1 to 0,2PI
                lat = lat * Math.PI * 2.0;
                // point h
                posArr.push(0, height, 0);
                uv.push(0.5, 0.5);
                // point 1
                var z1 = Math.cos(lat);
                var x1 = Math.sin(lat);
                posArr.push(radius * x1, 0, radius * z1);
                var v1 = 0.5 * z1 + 0.5;
                var u1 = 0.5 * x1 + 0.5;
                uv.push(u1, v1);
                // point 2
                var k = i + 1;
                if (i == nums - 1) {
                    k = 0;
                }
                var lat2 = k / (nums);
                lat2 = lat2 * Math.PI * 2.0;
                var z2 = Math.cos(lat2);
                var x2 = Math.sin(lat2);
                posArr.push(radius * x2, 0, radius * z2);
                var v2 = 0.5 * z2 + 0.5;
                var u2 = 0.5 * x2 + 0.5;
                uv.push(u2, v2);
                // vertex normal    dh = (x,y,z)- h(0,height,0), (x,y-height,z)
                // dr = (x,y,z) - (0,y,0)   (x,0,z) 
                //vn = dr- dot(dr,norm(dh))*norm(dh)
                var xh = 0.5 * (x2 - x1) + x1; var zh = 0.5 * (z2 - z1) + z1;
                var yh = 0.0;
                var dr = new Vector3(xh, 0, zh);
                var dh = new Vector3(xh, yh - height, zh);
                var ndh = MathUtil.normalize(dh);
                var lh = xh * ndh.x + zh * ndh.z;
                var nx = dr.x - ndh.x * lh; var ny = dr.y - ndh.y * lh;
                var nz = dr.z - ndh.z * lh;
                for (var h = 0; h < 3; h++) {
                    vertexNormal.push(nx, ny, nz);
                }

                // bottom triangluar
                posArr.push(radius * x2, 0, radius * z2);
                posArr.push(radius * x1, 0, radius * z1);
                posArr.push(0, 0, 0);
                uv.push(u2, v2);
                uv.push(u1, v1);
                uv.push(0.5, 0.5);
                for (var t = 0; t < 3; t++) {
                    vertexNormal.push(0, -1, 0);
                }




            }
            console.log(posArr);
            var mesh = Mesh.createFromArray(nums * 6, posArr, null);
            mesh.uv = uv;
            mesh.vertexNormal = vertexNormal;
            mesh.setPrimitiveType(PrimitiveType.Triangular);
            return mesh;

        }


        static createTaper_origin(height, radius, rows, columns) {
            var posArr = [];
            var uv = [];
            var vertexNormal = [];
            var vertexIndices = [];
            for (var i = 0; i < rows; i++) {
                var v = i / (rows - 1.0);
                for (var j = 0; j < columns; j++) {
                    var u = j / (columns - 1.0);
                    // map to 0 - 2*Pi 
                    var lon = 2 * u * Math.PI;
                    var y = (1.0 - v) * height;
                    var r = radius * y / height;
                    var z = r * Math.cos(lon);
                    var x = r * Math.sin(lon);
                    posArr.push(x, y, z);
                    uv.push(u, v);
                    // vertex normal    dh = (x,y,z)- h(0,height,0),
                    // dr = (x,y,z) - (0,y,0)   (x,0,z) 
                    //vn = dr- dot(dr,norm(dh))*norm(dh)
                    var dr = new Vector3(x, 0, z);
                    var ndh = MathUtil.normalize(x, y - height, z);
                    var lh = x * ndh.x + z * ndh.z;
                    var nx = dr.x - ndh.x * lh; var ny = dr.y - ndh.y * lh;
                    var nz = dr.z - ndh.z * lh;
                    vertexNormal.push(nx, ny, nz);
                    MeshUtil.createSphereIndices(i, j, columns, vertexIndices);
                }
                console.log(posArr);
                var mesh = Mesh.createFromArray(rows * columns, posArr, null);
                mesh.uv = uv;
                mesh.vertexNormal = vertexNormal;
                mesh.vertexIndices = vertexIndices;
                mesh.setPrimitiveType(PrimitiveType.Triangular);
                return mesh;

            }
        }

        static createLine(posArr, colorArr) {

            var count = posArr.length / 3;
            /**@type {Mesh} */
            var mesh = Mesh.createFromArray(count, posArr, colorArr);
            mesh.setPrimitiveType(PrimitiveType.LineStrip);
            /**@type {Mesh} */
            return mesh;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-28 14:34:32
     * @Description: file content
     */

    class Light {
        constructor() {
            this.transform = new Transform();
            this.color = new Vector3(1.0, 1.0, 1.0);
            this.specular = new Vector3(1.0, 1.0, 1.0);
            this.shininess = 10.0;
            this.id = Light.createId();
            this.shadowCam = null;
            this.castShadow = false;
            this.shadowBias = 0.00001;
            this.shadowSmoothStep = 0.002;
        }

        static createId() {
            Light.id = Light.id + 1;
            return Light.id;
        }
    }
    Light.id = 0;

    class DirectionLight extends Light {
        constructor() {
            super();
        }
    }
    class PointLight extends Light {
        constructor() {
            super();
            this.constant = 1.0;
            this.linear = 0.01;
            this.quadratic = 0.0001;
        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-15 19:36:00
     * @Description: file content
     */

    class LightUtil {
        static createShadowLight(w, h, lp, castShadow, isPoint) {
            // directionLight
            var dlt = null;
            //pointLight
            if (isPoint) {
                dlt = new PointLight();
                dlt.transform.setPosition(lp.x, lp.y, lp.z);
                dlt.constant = 0.95;
                dlt.linear = 0.07;
                dlt.quadratic = 0.001;

            } else {
                isPoint = false;
                dlt = new DirectionLight();
                dlt.transform.setPosition(lp.x, lp.y, lp.z);
            }
            if (castShadow) {
                var sh_cam = CameraUtil.createShadowCamera(w, h, !isPoint, lp);
                dlt.castShadow = true;
                dlt.shadowCam = sh_cam;
                var smooth_st = 1.0 / w * 2.5;
                dlt.shadowBias = 0.00001;
                dlt.shadowSmoothStep = smooth_st;
            }
            return dlt;

        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-18 16:17:02
     * @Description: file content
     */

    class SubPass {
        constructor(/**@type */mat, camera) {
            this.material = mat;
            this.targetType = CameraType.default;
            this.targetCam = null;
            this.setTarget(camera);

        }
        setTarget(camera) {
            if (MathUtil.isNone(camera)) {
                this.targetType = CameraType.default;
            } else if (camera instanceof Camera) {
                this.targetCam = camera;
                this.targetType = camera.type;
            } else {
                this.targetType = camera;
            }
        }
        getActive(/**@type {Camera} */cam, drawCall) {
            var that = this;
            if (this.targetCam !== null) {
                drawCall(that.material, that.targetCam);
            } else {
                drawCall(that.material, cam);
            }
        }
    }

    class Pass {
        //for hdr_fist
        //active Material
        //current target A, 

        //for bloom
        //pass1, draw color1 to A, target:A
        //pass2, loop:5 subP1:draww A to B, target:B, subP2:drawB to A
        //pass3, draw color1, A to currentCam

        // for depth
        //pass1, special target:
        constructor(/**@type {Material} */mat, camera) {

            this.subList = [new SubPass(mat, camera)];
            this.loop = 1;
        }

        getActive(/**@type {Camera} */cam, drawCall) {
            for (var i = 0; i < this.loop; i++) {
                for (var k in this.subList) {
                    var subP = this.subList[k];
                    subP.getActive(cam, drawCall);
                }


            }
        }
    }

    class PassLayer {
        setTarget(camera) {
            if (MathUtil.isNone(camera)) {
                this.targetType = CameraType.default;
            } else if (camera instanceof Camera) {
                this.targetCam = camera;
                this.targetType = camera.type;
            } else {
                this.targetType = camera;
            }
        }
        constructor(/**@type {Material} */mat, camera) {
            this.passList = [new Pass(mat, camera)];
            this.targetType = CameraType.default;
            this.targetCam = null;
            this.setTarget(camera);
        }

        add(mat, camera, passIndex) {
            var lenp = this.passList.length;
            if (passIndex > lenp) {
                console.error("out of index range,length=", lenp, "index=", passIndex);
                return false;
            }
            if (passIndex == lenp) {
                this.passList.push(new Pass(mat, camera));
            } else {
                var pass = this.passList[passIndex];
                pass.subList.push(new SubPass(mat, camera));
            }

        }

        getActive(/**@type {Camera} */cam, drawCall) {
            for (var i in this.passList) {
                var pass = this.passList[i];
                pass.getActive(cam, drawCall);
            }
        }

    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-19 14:07:05
     * @Description: file content
     */


    function MatUni(/**@type {string}*/key,
        /**@type {UTypeEnumn}*/type,
        value) {
        this.key = key;
        this.type = type;
        this.value = value;
        this.dirty = true;
    }

    class TextureManager$1 {
        constructor() {
            // this.texMap ={};  // key texId, value: tex
            this.texMatMap = {}; // key texId, value :material
        }
        onTexLoaded(tex) {
            if (tex.state === LoadState.loaded) {
                var matList = this.texMatMap[tex.getId()];
                if (!MathUtil.isNone(matList)) {
                    for (var i = 0; i < matList.length; i++) {
                        matList[i].onTexLoaded(tex);
                    }
                    ("TextureManager tex finished loaded url = " + tex.url);
                }
                tex.onLoaded(tex);
            }
        }
        static getManager() {
            if (TextureManager$1.manager === null) {
                TextureManager$1.manager = new TextureManager$1();
            }
            return TextureManager$1.manager;
        }
    }
    TextureManager$1.manager = null;

    class Material {
        constructor() {
            /**@type {ShaderOption} */
            this.shaderOption = new ShaderOption();
            this.id = Material.createId();
            this.fsource = null;
            this.vsource = null;
            /**@type {Program} */
            this.program = null;
            this.dirty = true;
            this.matUniList = {};
            this.uDirty = true;
            this.loadedCallBack = null;
            /**@type {Array}*
             * element @type {Texture}
             */
            this.texList = [];
            this.texLoadedCount = 0;

            this.passLayers = [new PassLayer(this, CameraType.default)];
            this.texPrepared = false;
        }
        updateUnis(/**@type {WebGLRenderingContext} */gl) {
            if (this.uDirty) {
                for (var key in this.matUniList) {
                    var uni = this.matUniList[key];
                    if (uni.dirty) {
                        this.program.updateUniform(uni.key, uni.type, uni.value);
                        this.matUniList[key].dirty = false;
                    }
                }
                this.uDirty = false;
            }
        }

        setUniform(/**@type {string} */ key,
            /**@type {UTypeEnumn} */type,
            value) {
            if (key in this.matUniList) {
                this.matUniList[key].type = type;
                this.matUniList[key].value = value;
                this.matUniList[key].dirty = true;
            } else {
                this.matUniList[key] = new MatUni(key, type, value);
            }
            this.uDirty = true;
        }

        update(/**@type {WebGLRenderingContext} */gl) {
            if (this.dirty) {
                // material may share program so ??? todo
                this.dirty = false;
                delete this.program;
                this.program = new Program(gl, this.vsource, this.fsource, this.shaderOption);
                this.loadTexs(gl);
            }
            if (this.uDirty) {
                this.updateUnis(gl);
            }
        }

        onTexLoaded(tex) {
            this.texLoadedCount += 1;
            if (this.texLoadedCount === this.texList.length) {
                if (this.loadedCallBack !== null) {
                    this.loadedCallBack(this.texList);
                    console.log("material finished loading");
                }
                this.texPrepared = true;
            }

        }

        loadTexs(/**@type {WebGLRenderingContext} */gl) {
            for (var i in this.texList) {
                /**@type {Texture} */
                var tex = this.texList[i];
                //tex.bindDefaultColor(gl,1.0,1.0,1.0,1.0);
                if (tex.state === LoadState.init) {
                    tex.loadTexture(gl, function (
                        /** @type {Texture} */tex) {
                        // that.uDirty = true;
                        TextureManager$1.getManager().onTexLoaded(tex);
                    });
                }
            }
        }

        addTexture(tex) {
            var manager = TextureManager$1.getManager();
            var id = tex.getId();
            if (manager.texMatMap[id] === undefined) {
                manager.texMatMap[id] = [];
            }
            manager.texMatMap[id].push(this);
            this.texList.push(tex);
        }

        getProgramInfo(/**@type {WebGLRenderingContext} */gl) {
            this.update(gl);
            return this.program.programInfo;
        }
        static createId() {
            Material.id = Material.id + 1;
            return Material.id;
        }

        setLightShadowParams(light, t) {
            var dkey = "depthMap[" + t + "]";
            this.setUniform(dkey, UTypeEnumn$1.texture,
                light.shadowCam.renderTarget);
            this.addTexture(light.shadowCam.renderTarget);
            var pkey = "biasStep[" + t + "]";
            this.setUniform(pkey, UTypeEnumn$1.Vec2, [light.shadowBias, light.shadowSmoothStep]);

        }

        //{ layerPass1:{Pass1:{subPass1,subPass2}, Pass2:{subPass1} },
        //  layerPass2:{pass1;{subPass1}} }


        getActive(/**@type {Camera} */cam, drawCall) {
            var size = this.passLayers.length;
            if (size === 1) {
                this.passLayers[0].getActive(cam, drawCall);
                return;
            } else {
                for (var i in this.passLayers) {
                    var layer = this.passLayers[i];
                    if (layer.targetType === cam.type) {
                        if (!MathUtil.isNone(layer.targetCam)) {
                            layer.getActive(layer.targetCam, drawCall);
                        } else {
                            layer.getActive(cam, drawCall);
                        }
                        return;
                    }

                }
            }
            this.passLayers[0].getActive(cam, drawCall);

        }



        addPassLayer(mat,/**@type {Camera} */cam) {
            this.passLayers.push(new PassLayer(mat, cam));
        }
    }
    Material.id = 0;

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-09 21:04:12
     * @Description: file content
     */

    var LoadState$1 = {
        init: 0,
        loading: 1,
        loaded: 2
    };
    var TextureElemType$1 = {
        default: "UNSIGNED_BYTE",
        float: "FLOAT",
        halfFloat: "HALFFLOAT"
    };

    var TextureType$1 = {
        default: "TEXTURE_2D",
        cube: "TEXTURE_CUBE_MAP"
    };
    var TextureFormat = {
        default: "RGBA",
        RGB: "RGB"
    };

    var TextureWrap$1 = {
        default: "CLAMP_TO_EDGE",
        clamp_to_border: "CLAMP_TO_BORDER",
        repeat: "REPEAT"
    };

    var TextureUrl = {
        camera: "Camera",
        null: "null"
    };

    const TextureBlend = {
        Add: 1,
        multi: 2
    };

    class ImgLoader {
        constructor(url) {
            this.url = url;
            this.type = TextureType$1.default;
            this.elType = TextureElemType$1.default;
            this.format = TextureFormat.default;
        }
        load(callback) {
            var that = this;
            if (this.url.indexOf(".hdr") >= 0) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", this.url, true);
                xhr.responseType = "arraybuffer";
                xhr.crossOrigin = "anonymous";
                that.elType = TextureElemType$1.float;
                that.format = TextureFormat.RGB;
                xhr.onload = function (evt) {
                    var buff = xhr.response;
                    if (buff) {

                        var img = new RGBEParser(that.elType).parse(buff);
                        that.width = img.width;
                        that.height = img.height;
                        if (callback) {
                            callback(that, img.data);
                        }
                    }
                };
                xhr.send();
            } else {
                var image = new Image();

                image.crossOrigin = "anonymous";

                image.onload = function (ev) {
                    that.width = image.width;
                    that.height = image.height;
                    if (callback) {
                        callback(that, image);
                    }
                };
                image.src = this.url;
            }

        }
    }
    class Texture$1 {
        constructor(url, width, height, type) {
            this.url = url;
            /**@type {WebGLTexture} */
            this.glTexture = null;
            this.state = LoadState$1.init;
            this.cubeMapHint = null;
            this.width = width;
            this.height = height;
            this.elType = TextureElemType$1.default;
            this.format = TextureFormat.default;
            this.hasMipMap = true;
            this.wrap_mode = TextureWrap$1.default;
            if (MathUtil.isNone(type)) {
                this.type = "TEXTURE_2D";
            } else {
                this.type = type;
            }
            if (MathUtil.isNone(width)) {
                this.width = 1;
            }
            if (MathUtil.isNone(height)) {
                this.height = 1;
            }
            this.id = Texture$1.createId();
            console.log("constructor:texture >>>id=", this.id, "url=", this.url);
            this.onLoadedCalls = [];
            this.mipCount = -1;
        }
        getId() {
            return this.id;
        }
        getMipCount() {
            if (this.width === 1 && this.height === 1) {
                console.error("Texture: not initialized ,url=", this.url);
                return -1;
            }

            if (this.mipCount === -1) {
                var minw = this.width < this.height ? this.width : this.height;
                this.mipCount = Math.log(minw) * Math.LOG2E;
            }
            return this.mipCount;
        }
        static createId() {
            Texture$1.id = Texture$1.id + 1;
            return Texture$1.id;
        }
        onLoaded() {
            for (var i in this.onLoadedCalls) {
                this.onLoadedCalls[i](this);
            }
        }

        bindDefaultColor(/**@type {WebGLRenderingContext} */gl, r, g, b, a) {
            if (this.type !== "TEXTURE_2D") {
                return;
            }
            if (this.glTexture === null) {
                this.glTexture = gl.createTexture();
            }
            var defaultPxs = new Uint8Array([r * 255, g * 255, b * 255, a * 255]);
            Texture$1.uploadTextureData(gl, this, defaultPxs, false, false, 1, 1);
        }
        static uploadTextureData(/**@type {WebGLRenderingContext} */gl,
            /**@type {Texture} */
            tex, data, isFlip, hasMipMap, fixw, fixh) {

            var level = 0;
            var format = gl.RGBA;
            if (!MathUtil.isNone(tex.format)) {
                format = gl[tex.format];
            }
            var internalFormat = format;
            var width = tex.width;
            var height = tex.height;
            if (!MathUtil.isNone(fixw)) {
                width = fixw;
            }
            if (!MathUtil.isNone(fixh)) {
                height = fixh;
            }
            var eltype = gl[tex.elType];
            var type = gl[tex.type];
            // if(tex.elType === TextureElemType.float){
            //     internalFormat = gl.RGB16F;
            // }

            console.log("upload Tex,", tex.elType);
            gl.bindTexture(type, tex.glTexture);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !isFlip);
            // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
            if (tex.elType === TextureElemType$1.float) {
                var ext = gl.getExtension('OES_texture_float');
                console.log("support >> OES_texture_float", ext);
                var ext2 = gl.getExtension('OES_texture_float_linear');
                console.log("support >> OES_texture_float_linear", ext2);
                tex.wrap_mode = TextureWrap$1.default;
            }
            //console.log("should flip",isFlip);
            // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,isFlip);
            if (type === gl.TEXTURE_CUBE_MAP) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                for (var j = 0; j < 6; j++) {
                    // var ke = "TEXTURE_CUBE_MAP_"+tex.cubeMapHint[j];
                    //  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,isFlip);
                    if (data === null) {
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + j, level, internalFormat, width, height, 0, format, eltype, null);
                    } else {
                        if (data[j] instanceof Image) {
                            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + j, level, internalFormat, format, eltype, data[j]);
                        } else {
                            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + j, level, internalFormat, width, height, 0, format, eltype, data[j]);
                        }
                    }


                }
            } else if (data instanceof Image) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isFlip);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, eltype, data);
            } else {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isFlip);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, 0, format, eltype, data);
            }
            gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl[tex.wrap_mode]);
            gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl[tex.wrap_mode]);


            gl.LINEAR;
            var hasET = true;
            if (tex.elType === TextureElemType$1.float) {
                var et1 = gl.getExtension('OES_texture_float');
                var et2 = gl.getExtension('OES_texture_float_linear');
                if (et1 === undefined || et2 === undefined) {
                    hasET = false;
                    alert("not supported");
                }
            }
            //gl.getExtension('EXT_shader_texture_lod');
            //gl.getExtension('OES_standard_derivatives');
            // gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,filter);
            //gl.texParameteri(type,gl.TEXTURE_MAG_FILTER,filter);
            var isP2 = MathUtil.isPowerOf2(tex.width) && MathUtil.isPowerOf2(tex.height);
            if (hasMipMap && tex.hasMipMap) {
                if (isP2) {
                    // gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR);
                    //gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
                    if (tex.elType === TextureElemType$1.float) {
                        if (hasET) {
                            // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            //console.log("errorstate1",gl.getError());
                            gl.generateMipmap(type);

                            if (MDBrowser === "Chrome") { //todo
                                gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                                console.log("Texture>>>>chrome>> use mipmap filter", tex.id);
                            } else {
                                gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                // gl.texParameteri(type,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
                                // console.log("Texture>>>>not chrome >> liner",tex.id);
                            }


                        }
                    } else {
                        gl.generateMipmap(type);
                        gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                        console.log("Texture>>>>>not chrome >> 3333", tex.id);

                    }


                }
            }
            if (!isP2) {
                gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            }
            gl.bindTexture(type, null);

        }

        static loadCubeTexture(/**@type {WebGLRenderingContext} */gl,
            /**@type {Texture} */
            tex, loadCallback) {
            if (tex.glTexture === null) {
                tex.glTexture = gl.createTexture();
            }
            tex.state = LoadState$1.loading;
            var loaded = 0;
            var imgs = {};
            for (var i = 0; i < 6; i++) {
                var ui = tex.url[i];
                var imgL = new ImgLoader(ui);
                imgL.index = i;
                imgL.load(function (loader, data) {
                    loaded += 1;
                    imgs[loader.index] = data;
                    if (loaded === 6) {
                        tex.width = loader.width; tex.height = loader.height;
                        tex.format = loader.format;
                        tex.elType = loader.elType;
                        Texture$1.uploadTextureData(gl, tex, imgs, true, true);
                        tex.state = LoadState$1.loaded;
                        loadCallback(tex);

                    }

                });

            }

        }

        static loadNullTexture(/**@type {WebGLRenderingContext} */gl,
            /**@type {Texture} */
            tex, loadCallback) {
            if (tex.glTexture === null) {
                tex.glTexture = gl.createTexture();
            }
            tex.state = LoadState$1.loading;
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            Texture$1.uploadTextureData(gl, tex, null, false, true);
            // tex.loadCallback = loadCallback;
        }

        loadTexture(/**@type {WebGLRenderingContext} */gl,
            loadCallback) {
            var tex = this;
            if (tex.url === TextureUrl.camera || MathUtil.isNone(tex.url)) {
                Texture$1.loadNullTexture(gl, tex, loadCallback);

                return;
            }
            if (tex.url instanceof (Array)) {
                Texture$1.loadCubeTexture(gl, tex, loadCallback);
                return;
            }
            if (tex.glTexture === null) {
                tex.glTexture = gl.createTexture();
            }
            tex.state = LoadState$1.loading;
            var that = this;

            var imgL = new ImgLoader(tex.url);
            imgL.load(function (loader, img) {
                that.width = loader.width; that.height = loader.height;
                that.format = loader.format; that.type = loader.type;
                that.elType = loader.elType;
                Texture$1.uploadTextureData(gl, that, img, true, true);
                that.state = LoadState$1.loaded;
                loadCallback(tex);


            });

        }
    }
    Texture$1.id = 0;

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-31 21:00:46
     * @Description: file content
     */

    const main_st = `void main(){
`;
    const main_ed = "}";

    const fhead_precision = `
precision mediump float;
`;

    const fhead_commomFunc = `
#define saturate(a) clamp( a, 0.0, 1.0 )
`;

    const vhead_common = `
    attribute vec4 vertexPos;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    `;
    const vbody_common = `
    vec4 inPos = vec4(vertexPos);
`;

    const vbody_simple = `
         gl_Position = projectionMatrix * modelViewMatrix * vec4(inPos.xyz,1.0);
    `;
    const fbody_simple = `
        gl_FragColor = vec4(0.3,0.4,0.5,1.0);
  `;

    // vertex color
    const vhead_vcolor = `
  attribute vec4 vertexColor;
  varying lowp vec4 vColor;
`;
    const vbody_vcolor = `
    vColor = vertexColor;
`;
    const fhead_vcolor = `
varying lowp vec4 vColor;
`;
    const fbody_vcolor = `
    gl_FragColor = vColor;
`;

    // material color
    const fhead_matColor = `
uniform vec4 matColor;
`;
    const fbody_matColor = `
    gl_FragColor = matColor;
`;

    // texture
    const vhead_uv = `
attribute vec2 uv;
varying vec2 vUV;
`;
    const vbody_uv = `
  vUV = uv;
`;
    const fhead_uv = `
    varying vec2 vUV;
`;
    const fbody_uv = `
    vec2 fUV = vUV;
`;
    const fhead_uvTran = `
uniform vec4 uvTran;
`;
    const fbody_uvTran = `
fUV.x = fUV.x*uvTran.x+uvTran.y;
fUV.y = fUV.y*uvTran.z+uvTran.w;
`;

    const fhead_simple_texture = `
uniform sampler2D texture0;
`;
    const fbody_simple_texture = `
    vec4 color_tex0 = texture2D(texture0,fUV);
    gl_FragColor =  color_tex0;
`;

    // light
    const vhead_light = `
varying vec4 viewPos;
`;
    const vbody_light = `
    viewPos = modelViewMatrix * vec4(inPos.xyz,1.0);
    gl_Position = projectionMatrix * viewPos;
   
`;
    const vhead_vertexNormal = `
    attribute vec3 vertexNormal;
    uniform mat4 normalMatrix;
    varying vec3 vNormal;
`;
    const vbody_vertexNormal = `
    vNormal = normalize((normalMatrix*vec4(vertexNormal,1.0)).xyz);
`;

    const fhead_light = `
uniform vec3 ambientLight;
varying vec4 viewPos;

`;

    const fhead_vertexNormal = `
    varying vec3 vNormal;
`;
    const fhead_blinn_Light_st = `    
struct Light{
  vec3 diffuse;
  vec3 specular;
  float shininess;
};`;
    const fhead_lambert_Light_st = `
struct Light{
    vec3 diffuse;
};`;

    const fhead_pointLight_st = ` 
struct pointLight{
Light light;
vec3 position;
vec3 params;  //constant,linear,quadratic;
};
uniform pointLight pointL[pointLightCount+1];
`;

    const fhead_dLight_st = `
struct dLight{
    vec3 direction;
    Light light;
};
uniform dLight dirL[dirLightCount+1];
`;

    const func_calLight_lambert = `
void calLight(inout vec3 lcolor, inout vec3 spec, vec3 eyeDir, vec3 direction, vec3 normal,Light lt){
    lcolor  =lcolor + lt.diffuse*max(dot(normal,-1.0*direction),0.0);
}
`;


    const func_calLight_blinn = `
void calLight(inout vec3 lcolor, inout vec3 spec,vec3 eyeDir, vec3 direction,vec3 normal, Light lt){
    lcolor  =lcolor + lt.diffuse*max(dot(normal,-1.0*direction),0.0);
    vec3 refDir = reflect(direction,normal);
    spec = spec + pow(max(dot(eyeDir,refDir),0.0),lt.shininess)*lt.specular;
}`;


    const func_calDirLights = `
void calDirLights(inout vec3 lcolor,inout vec3 spec,vec3 eyeDir,vec3 normal){
  for (int i =0;i<dirLightCount;i++){
      calLight(lcolor,spec,eyeDir,dirL[i].direction,normal,dirL[i].light);
  }
}`;
    const func_calPointLights = `
void calPointLights(inout vec3 lcolor,inout vec3 spec, vec3 eyeDir,vec3 normal){
    for(int i=0; i<pointLightCount; i++){
      float distance = length(pointL[i].position +eyeDir);
      float intst = pointL[i].params.x + distance*pointL[i].params.y + distance*distance*pointL[i].params.z;
      vec3 direction  = normalize(viewPos.xyz-pointL[i].position);
      calLight(lcolor,spec,eyeDir,direction,normal,pointL[i].light);
      float decay = 1.0/intst;
      lcolor = decay*lcolor;
      spec = decay*spec;
    }
}`;

    const fbody_light_st = `
    vec3 lcolor = vec3(0.0);
    vec3 lspec = vec3(0.0);
    vec3 ambient = vec3(0.0);
    vec3 eyeDir = normalize(-1.0*viewPos.xyz);
    `;
    //vec3 ambient =ambientLight;
    const fbody_light_ambient = `
ambient +=ambientLight*gl_FragColor.rgb;
gl_FragColor.rgb = gl_FragColor.rgb*lcolor+ambient;
`;
    const fbody_light_ed = `
    gl_FragColor.rgb = gl_FragColor.rgb+lspec;

`;
    const fbody_dirLight = `
    calDirLights(lcolor,lspec,eyeDir,vNormal);
`;
    const fbody_pointLight = `
    calPointLights(lcolor,lspec,eyeDir,vNormal);
`;

    const fhead_modelNormalMap = `
    uniform mat4 normalMatrix;
    uniform sampler2D modelNormalMap;
`;

    const fbody_modelNormalMap = `
    vec4 texn = vec4(texture2D(modelNormalMap,fUV).rgb*2.0-1.0,1.0);
    vec3 vNormal = normalize((normalMatrix*texn).xyz);
`;

    // const vhead_normalMap =`
    //     attribute vec3 vertexTangent;
    //     attribute vec3 vertexNormal;
    //     uniform mat4 normalMatrix;
    //     uniform sampler2D normalMap;
    //     varying vec3 vNormal;

    // `;
    // const vbody_normalMap=`
    //     vec3 BiTan = cross(vertexNormal,vertexTangent);
    //     mat3 TBN = mat3(vertexTangent,BiTan,vertexNormal);
    //     vec3 texn = texture2D(normalMap,uv).rgb*2.0-1.0;
    //     vec4 vn = normalMatrix*vec4(TBN*texn,1.0);
    //     vNormal = normalize(vn.xyz);
    // `;

    // const fhead_normalMap =`
    //     varying vec3 vNormal;
    // `;

    // const fbody_normalMap=`
    // `;

    const vhead_normalMap = `
    attribute vec3 vertexTangent;
    attribute vec3 vertexNormal;
    varying mat3 TBN;
`;
    const vbody_normalMap = `
    vec3 BiTan = cross(vertexNormal,vertexTangent);
    TBN = mat3(vertexTangent,BiTan,vertexNormal);
`;

    const fhead_normalMap = `
    uniform mat4 normalMatrix;
    uniform sampler2D normalMap;
    varying mat3 TBN;
`;

    const fbody_normalMap = `
    vec3 texn = texture2D(normalMap,fUV).rgb*2.0-1.0;
    vec3 vNormal = normalize((normalMatrix*vec4(TBN*texn,1.0)).xyz);
`;

    const vhead_cubeMap = `
    varying vec3 skyPos;
`;
    const vbody_cubeMap = `
    skyPos =inPos.xyz;
  `;

    const fhead_cubeMap = `
    uniform samplerCube cubeMap;
    varying vec3 skyPos;
`;

    const fbody_cubeMap = `
    gl_FragColor = textureCube(cubeMap,normalize(skyPos.xyz));
`;

    const fhead_rectSphereMap = `
    uniform sampler2D rectSphereMap;
    varying vec3 skyPos;
    const vec2 invAtan = vec2(0.1591,0.3183);
    vec2 samplerSphericalMap(vec3 dir){
        vec2 uv = vec2(atan(dir.z,dir.x),asin(dir.y));
        uv *= invAtan;
        uv += 0.5;
        return uv;
    }
`;
    const fbody_rectSphereMap = `
    vec2 ruv = samplerSphericalMap(normalize(skyPos));
    gl_FragColor = texture2D(rectSphereMap,ruv);
`;



    const vhead_envMap = `
uniform samplerCube cubeMap;
uniform mat4 viewMatrix;
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
`;

    const fhead_envMap = `

uniform samplerCube cubeMap;
`;

    const fbody_envMap_st = `
  vec3 envColor = vec3(0.0);
  float ratio = 0.0;
`;
    const fbody_envMap_ed = `
  gl_FragColor.rgb = mix(gl_FragColor.rgb,envColor,ratio);
`;

    const vhead_envMap_reflect = `
varying vec3 skyPos;
`;
    const vbody_envMap_reflect = `
    skyPos = reflect(normalize(viewPos.xyz),normalize(vNormal));
    skyPos = inverseTransformDirection(skyPos,viewMatrix);
  `;

    const fhead_envMap_reflect = `
uniform float reflective;
varying vec3 skyPos;
`;

    const fbody_envMap_reflect = `
ratio += reflective;
 envColor += reflective*textureCube(cubeMap,skyPos).xyz;
`;


    const vhead_envMap_refract = `
    uniform vec2 refractParams; //strength, refractRatio
    varying vec4 refractR;
  `;

    const vbody_envMap_refract = `
    refractR.a = refractParams[0];
    refractR.rgb = refract(normalize(viewPos.xyz),normalize(vNormal),1.0/refractParams[1]);
    refractR.rgb = inverseTransformDirection(refractR.rgb,viewMatrix);
`;

    const fhead_envMap_refract = `
varying vec4 refractR;
`;

    const fbody_envMap_refract = `
    ratio += refractR.a;
    envColor += refractR.a*textureCube(cubeMap,refractR.xyz).xyz;
`;


    const fhead_envMap_normalMap = `
uniform samplerCube cubeMap;
uniform mat4 viewMatrix;
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
`;

    const fhead_envMap_normal_reflect = `
uniform float reflective;
`;

    const fbody_envMap_normal_reflect = `
vec3 skyPos = reflect(normalize(viewPos.xyz),normalize(vNormal));
skyPos = inverseTransformDirection(skyPos,viewMatrix);
ratio += reflective;
 envColor += reflective*textureCube(cubeMap,skyPos).xyz;
`;
    const fhead_envMap_normal_refract = `
uniform vec2 refractParams; // refractRatio,strength
`;
    const fbody_envMap_normal_refract = `
refractR.a = refractParams[0];
refractR.rgb = refract(normalize(viewPos.xyz),normalize(vNormal),1.0/refractParams[1]);
refractR.rgb = inverseTransformDirection(refractR.rgb,viewMatrix);
ratio += refractR.a;
 envColor += refractR.a*textureCube(cubeMap,refractR.xyz).xyz;
`;

    const fhead_toneMap = `
uniform float hdrExposure; 

vec3 LinearToneMapping( vec3 color ) {
	return hdrExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= hdrExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color, float toneMappingWhitePoint ) {
	color *= hdrExposure;
	return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= hdrExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	color *= hdrExposure;
	return saturate( ( color * ( 2.51 * color + 0.03 ) ) / ( color * ( 2.43 * color + 0.59 ) + 0.14 ) );
}
vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }
`;
    ////gl_FragColor.rgb = vec3(1.0)- exp(-1.0*hdrExposure*gl_FragColor.rgb);

    const fbody_toneMap = `
    gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);
  
`;
    //gl_FragColor.rgb = gl_FragColor.rgb/(gl_FragColor.rgb+vec3(1.0));
    const fbody_gammaCorrection = `
//gl_FragColor.rgb = gl_FragColor.rgb/(vec3(1.0)+gl_FragColor.rgb);
    gl_FragColor.rgb = pow(gl_FragColor.rgb,vec3(0.4545));
  //  gl_FragColor.a = 1.0;
`;
    // #define lightShadowCount 1
    const vhead_receiveShadow = `
    uniform mat4 lightPVM[lightShadowCount];
    varying vec4 lightSpacePos[lightShadowCount];
`;

    const vbody_receiveShadow = `
    for(int jr=0; jr<lightShadowCount; jr++){
        lightSpacePos[jr] = lightPVM[jr]*inPos;
    }
`;
    //#define lightShadowCount 1
    const fhead_receiveShadow = `
uniform vec2 biasStep[lightShadowCount];
precision mediump float;
uniform sampler2D depthMap[lightShadowCount];
varying vec4 lightSpacePos[lightShadowCount];
float calShadow(vec4 pos, vec2 bias_step, sampler2D depth_map){
    float shadow = 0.0;
    vec3 projSd = pos.xyz/pos.w;
    projSd = projSd*0.5 +0.5;

   
    for(int i = -1; i<=1;i++){
        for(int j=-1; j<=1; j++){
            vec2 uv = projSd.xy+vec2(i,j)*bias_step.y;
            if(projSd.z-bias_step.x>texture2D(depth_map,uv).r){
                shadow += 0.8;
            } 
        }
    }
    if (projSd.z>1.0 || projSd.z<0.00)
        shadow = 0.0;

    
    
    return shadow/9.0;
}

float calAllShadow(){
    float shadow = 0.0;
    for(int jr=0; jr<lightShadowCount; jr++){
        shadow += calShadow(lightSpacePos[jr],biasStep[jr],depthMap[jr]);
    }
    return shadow/float(lightShadowCount);
  }
`;

    const fbody_Light_receiveShadow = `
float shadow = calAllShadow();
lcolor = (1.0-shadow)*lcolor;
lspec = (1.0-shadow)*lspec;
`;

    const fbody_NoLight_receiveShadow = `
float shadow = calAllShadow();
gl_FragColor.rgb = (1.0-shadow)*gl_FragColor.rgb;

`;

    var fhead_lightBlur = `
uniform sampler2D  texture_brighter;
`;
    var fbody__lightBlur = `
    float step = 6.0/1000.0;
    vec3 result = vec3(0.0);
    for(int i =-2; i<=2;i++){
        for(int j=-2; j<=2;j++){
            result +=texture2D(texture_brighter,fUV + vec2(i,j)*step).rgb;
        }
    }
    gl_FragColor.rgb = result/25.0+gl_FragColor.rgb;
`;


    var fbody_vgs_blur = `
vec4 weight = vec4(0.1945946, 0.1216216, 0.054054, 0.016216);
float step = 3.0/1000.0;

vec3 result = texture2D(texture0,fUV).rgb*0.227027;
for(int i =1; i<5;i++){
    result +=texture2D(texture0,fUV + vec2(0,i)*step).rgb*weight[i-1];
    result +=texture2D(texture0,fUV + vec2(0,-i)*step).rgb*weight[i-1];
}
gl_FragColor.rgb = result;
`;

    var fbody_hgs_blur = `
vec4 weight = vec4(0.1945946, 0.1216216, 0.054054, 0.016216);
float step = 3.0/1000.0;
vec3 result = texture2D(texture0,fUV).rgb*0.227027;
for(int i =1; i<5;i++){
    result +=texture2D(texture0,fUV + vec2(i,0)*step).rgb*weight[i-1];
    result +=texture2D(texture0,fUV + vec2(-i,0)*step).rgb*weight[i-1];
}
gl_FragColor.rgb = result;
`;

    var fhead_texture1 = `
uniform sampler2D texture1;
`;
    var fbody_texture1 = `
    vec4 color_tex1 = texture2D(texture1,fUV);
`;
    var fbody_texBlendAdd = `
    gl_FragColor.rgb = gl_FragColor.rgb +color_tex1.rgb;  
`;

    // var vbody_fog =`
    // float start = 0.2;
    // float end = 5.0;
    // float fogFactor/ = (length(viewPos.xyz)-start)*(end-start);

    // `;

    var fhead_fog_linear = `
uniform vec2 fogLinear;
uniform vec3 fogColor;
`;

    var fbody_fog_linear = `
float start = fogLinear[0];
float end = fogLinear[1];
float z = gl_FragCoord.z/gl_FragCoord.w;
float fogFactor = (z-start)/(end-start);
fogFactor = clamp(fogFactor,0.0,1.0);
gl_FragColor.rgb = mix(gl_FragColor.rgb,fogColor,fogFactor);
`;

    var fhead_fog_exp = `
uniform float density;
uniform vec3 fogColor;
`;
    //float density = 0.09;
    var fbody_fog_exp = `
const float LOG2 = 1.44265;
float z = gl_FragCoord.z/gl_FragCoord.w;
float fogFactor = exp2(-density*density*z*z*LOG2);
fogFactor = clamp(fogFactor,0.0,1.0);
gl_FragColor.rgb = mix(fogColor,gl_FragColor.rgb,fogFactor);
`;
    //#define  roughness 0.02
    //#define metalness 0.7
    var fhead_PBR = `
#define PI 3.14159
uniform float roughness;
uniform float metalness;
float rough = 1.0;
float metal = 1.0;
float ao = 1.0;
vec3 F0 = vec3(0.02, 0.02, 0.02);
//uniform vec3 F0;
struct Light{
    vec3 diffuse;
};

float distributionGGX(float nh,float a){
    float a2 = a*a;
    float f = (nh * a2 - nh) * nh + 1.0;
    float denom = PI*f*f;
    return a2/denom;
}
float calDirK(){
    float a2 = (rough+1.0);
    a2 =a2*a2;
    return a2/8.0;
}
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
float geometrySub(float nv, float k){
    return nv/(nv*(1.0-k)+k);
}

float geometryGGX(float NoV,float NoL,float rough){
    float ggx2 = GeometrySchlickGGX(NoV, roughness);
    float ggx1 = GeometrySchlickGGX(NoL, roughness);
    return ggx1 * ggx2;
}

vec3 fresnelReflect(vec3 f0,float VoH){
    return f0 + (vec3(1.0) - f0) * pow(1.0 - VoH, 5.0);
}
void calLight(inout vec3 lcolor, inout vec3 spec, vec3 wo, vec3 dir, vec3 n,Light lt){
    vec3 wi = -1.0*vec3(dir);
     vec3 h = normalize(wi+wo);
     float nv = abs(dot(n,wo))+1e-5;
     float nl = clamp(dot(n,wi),0.0,1.0);
     //float vh = clamp(dot(h,wo),0.0,1.0);
     float lh = clamp(dot(h,wi),0.0,1.0);
     float nh =clamp(dot(h,n),0.0,1.0);
     float roughFix = rough*rough;
    vec3 F = fresnelReflect(F0,lh);
    float D = distributionGGX(nh,roughFix);
    float G = geometryGGX(nv,nl,roughFix);
    vec3 kd = vec3(1.0) - F;
     kd *=1.0 - metal; 
     vec3 Fr = (D*G)*F;
     vec3 Fd = kd/PI;
    lcolor += Fd*nl*lt.diffuse;
    spec += D*G*F*nl*lt.diffuse;
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
`;

    var fbody_PBR_roughU = `
    rough *= roughness;
    rough = clamp(rough,0.0,1.0);
    metal = clamp(metal,0.0,1.0);
`;
    var fbody_PBR_metalU = `
    metal *= metalness;
`;
    // to pow fix
    // gl_FragColor.r= pow(gl_FragColor.r, 2.2);
    // gl_FragColor.g= pow(gl_FragColor.g, 2.2);
    // gl_FragColor.b= pow(gl_FragColor.b, 2.2);
    var fbody_PBR = `

gl_FragColor.r= pow(gl_FragColor.r, 2.2);
gl_FragColor.g= pow(gl_FragColor.g, 2.2);
gl_FragColor.b= pow(gl_FragColor.b, 2.2);
    F0 = mix(F0,gl_FragColor.rgb,metal);
    //gl_FragColor = LinearTosRGB(gl_FragColor);

    
`;

    var fhead_roughMap = `
    uniform sampler2D roughMap;
`;

    var fbody_roughMap = `
    rough *= min(texture2D(roughMap,fUV).x,1.0);
`;

    var fhead_metalMap = `
    uniform sampler2D metalMap;
`;

    var fbody_metalMap = `
   
    metal *= texture2D(metalMap,fUV).x;
`;

    var fbody_PBR_envMap = `
    //ratio =0.02;
`;

    var fhead_IBL_irad_func = `
vec3 fresnelSchlickRoughness(vec3 f0,float cosTheta, float rfs)
{
    return f0 + (max(vec3(1.0 - rfs), f0) - f0) * pow(1.0 - cosTheta, 5.0);
}   
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

vec3 getIBLIradianceColor(const samplerCube iradMap, float mip,vec3 kS,vec3 wN){
    #ifdef DF_TEX_LOD
    vec3 iblDiffuse = textureCube(iradMap,wN,mip).rgb;
    #else
    vec3 iblDiffuse = textureCube(iradMap,wN,mip).rgb;
    #endif
   
    vec3 kD = 1.0 - kS;
    kD *=1.0 - metal; 
    return kD * iblDiffuse;
}
#ifdef DF_RADSPMAP
const vec2 invAtan = vec2(0.1591,0.3183);
vec4 sampleSPMap(const sampler2D spMap,vec3 dir,float mip){
    vec2 uv = vec2(atan(dir.z,dir.x),asin(dir.y));
    uv *= invAtan;
    uv += 0.5;
    #ifdef DF_TEX_LOD
    return texture2DLodEXT(spMap,uv,mip);
    #else
    return texture2D(spMap,uv,mip);
    #endif

    
}
vec4 sampleSPMap2(const sampler2D spMap,vec3 dir,float mip){
    vec2 uv = vec2(atan(dir.z,dir.x),asin(dir.y));
    uv *= invAtan;
    uv += 0.5; 
    return texture2D(spMap,uv,mip);

    
}
vec3 getIBLIradianceColorBySP(const sampler2D iradMap, float mip,vec3 kS,vec3 wN){

    vec3 iblDiffuse = sampleSPMap(iradMap,wN,mip).rgb;
    vec3 kD = 1.0 - kS;
    kD *=1.0 - metal; 
    return kD * iblDiffuse;
}
#endif

`;

    var fhead_IBL_spec_func = `

float getSpecularMIPLevel( const in float roughness, float maxMIPLevelScalar ) {
    float sigma = PI * roughness * roughness / ( 1.0 + roughness );
    float desiredMIPLevel = maxMIPLevelScalar + log2( sigma );
    return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
}
vec2 integrateSpecularBRDF( const in float dotNV, const in float roughness ) {
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	return vec2( -1.04, 1.04 ) * a004 + r.zw;
}
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}

float getSpecRough(vec3 normal,float rf){
    #ifdef DF_DERIVATIVES
    vec3 dxy = max( abs( dFdx( normal ) ), abs( dFdy( normal ) ) );
    float geometryRoughness = max(max( dxy.x, dxy.y ), dxy.z );
    #else
    float geometryRoughness =0.0;
    #endif
    float specRough = max(rf, 0.0525 );
    specRough += geometryRoughness;
    specRough = min( specRough, 1.0 );
    return specRough;
}
#ifdef DF_RADSPMAP
vec3 getIBLSpecColorBySP(const sampler2D radMap, float specRough, vec3 R, float nv, vec3 kS,vec2 dfg){
    
    #ifdef DF_LINEARMIP
        float specMip = specRough*MAX_MIPCOUNT;
    #else
        float specMip = getSpecularMIPLevel(specRough,MAX_MIPCOUNT-1.0);
    #endif
  
    vec3 iblSpecular =  sampleSPMap(radMap,R,specMip).rgb;
   
    
    return (kS*dfg.x+dfg.y)*iblSpecular;
}
#endif
vec3 getIBLSpecColor(const samplerCube radMap, float specRough, vec3 R, float nv, vec3 kS,vec2 dfg){
    //float mipF = fract(specMip);
    //float mipInt = floor(specMip);
    //vec3 color0 = textureCube(radMap,R,mipInt).rgb;
    //vec3 color1 = textureCube(radMap,R,mipInt+1.0).rgb;
    //vec3 iblSpecular = mix(color0,color1,mipF);
    //vec2 dfg = texture2D(lutMap,vec2(nv,rough)).xy;
    #ifdef DF_LINEARMIP
        float specMip = specRough*MAX_MIPCOUNT;
    #else
        float specMip = getSpecularMIPLevel(specRough,MAX_MIPCOUNT-1.0);
    #endif
    #ifdef DF_TEX_LOD
        vec3 iblSpecular =  textureCubeLodEXT(radMap,R,specMip).rgb;
    #else
        vec3 iblSpecular =  textureCube(radMap,R,specMip).rgb;
    #endif
    return (kS*dfg.x+dfg.y)*iblSpecular;
}
`;
    var fhead_IBL = `
uniform mat4 viewMatrix;
uniform float MAX_MIPCOUNT;
#extension GL_EXT_shader_texture_lod : enable
#extension GL_OES_standard_derivatives : enable
`+ fhead_IBL_irad_func + fhead_IBL_spec_func;

    var fbody_IBL = `
vec3 wN = inverseTransformDirection(vNormal,viewMatrix);
float nv = clamp(dot(vNormal, eyeDir),0.0,1.0);
vec3 kS = fresnelSchlickRoughness(F0,nv,rough);
#ifdef DF_IRRADIANCEMAP
vec3 iradColor = getIBLIradianceColor(irradianceMap,0.0,kS,wN);
#else
#ifdef DF_RADSPMAP
vec3 iradColor = getIBLIradianceColorBySP(radianceMap,MAX_MIPCOUNT+1.0,kS,wN);
#else
vec3 iradColor = getIBLIradianceColor(radianceMap,MAX_MIPCOUNT+1.0,kS,wN);
#endif
#endif

ambient += iradColor*gl_FragColor.rgb*ao;
`;

    var fhead_IBL_iradiance = `
uniform samplerCube irradianceMap;
`;

    var fbody_IBL_iradiance = `


`;

    var fhead_IBL_specular = `
#ifdef DF_RADSPMAP
uniform sampler2D radianceMap;
#else
uniform samplerCube radianceMap;
#endif
#ifdef DF_LUTMAP
uniform sampler2D  lutMap;
#endif
`;

    var fbody_IBL_specular = `
vec3 R = reflect(-1.0*eyeDir, vNormal);
R =  inverseTransformDirection(R,viewMatrix);
#ifdef DF_LINEARMIP
    float specRough =rough;
#else
    float specRough = getSpecRough(vNormal,rough);
#endif

#ifdef DF_LUTMAP
    vec2 dfg = texture2D(lutMap,vec2(nv,rough)).xy;
#else
    vec2 dfg = integrateSpecularBRDF(nv,rough);
#endif
#ifdef DF_RADSPMAP
vec3 iblSpecular  = getIBLSpecColorBySP(radianceMap,specRough,R,nv,kS,dfg);
#else
vec3 iblSpecular  = getIBLSpecColor(radianceMap,specRough,R,nv,kS,dfg);
#endif
float spAo = computeSpecularOcclusion(nv,ao,specRough);
iblSpecular *= spAo;
ambient +=iblSpecular;
`;


    var fhead_aoMap = `
uniform sampler2D aoMap;
`;
    var fbody_aoMap = `
ao = texture2D(aoMap,fUV).r;

`;

    var vhead_heightMap = `
uniform mat4 modelViewInv;
//varying vec3 tanCamPos;
//varying vec3 tanfragPos;
varying vec3 tanViewDir;
uniform sampler2D heightMap;
mat3 transposeDiv(mat3 mat){
    return mat3(mat[0][0],mat[0][1],mat[0][2],
        mat[1][0],mat[1][1],mat[1][2],
        mat[2][0],mat[2][1],mat[2][2]);
}

`;
    // TBN = mat3(vertexTangent,BiTan,vertexNormal);
    var vbody_heightMap = `
 
  //mat3 tan = mat3(vertexTangent,cross(vertexNormal,vertexTangent),vertexNormal);
  //tan = transposeDiv(tan);
  float height = texture2D(heightMap,vUV).r*2.0-1.0;
  inPos.xyz += vertexNormal*height*0.02; 
  //vec3 tanCamPos = tan*(modelViewInv*vec4(0.0,0.0,0.0,1.0)).xyz;
  //vec3 tanfragPos = tan*inPos.xyz;
  //tanViewDir = tanCamPos -tanfragPos;
`;
    //uniform vec3 modelCameraPos;
    //varying vec4 modelFragPos;
    var fhead_heightMap = `
uniform sampler2D heightMap;
const float bumpScale = 1.0;
 //varying vec3 tanCamPos;
 //varying vec3 tanfragPos;
 varying vec3 tanViewDir;
`;
    //

    //vec3 viewDirT = normalize(modelCameraPos - modelFragPos.xyz);
    var fbody_heightMap = `
float eps = 0.0000001;
vec3 viewDirT = normalize(tanViewDir);

//fUV+=vec2(viewDirT.x/(viewDirT.z+eps),viewDirT.y/(viewDirT.z+eps))*height*0.005;
`;

    const fhead_calRadiance = `
const float samplerDelta = 0.1;
	const float PI = 3.14159;
	void calIrradiance(inout vec3 irradiance,vec3 N){
		float samples = 0.0;
		vec3 up = vec3(0,1,0);
		vec3 right = cross(up,N);
		up = cross(N,right);
		for(float cita = 0.0; cita<PI*2.0; cita+=samplerDelta){
			for(float phi = 0.0; phi<PI*0.5; phi+=samplerDelta){
				float sinphi = sin(phi);
				float cosphi = cos(phi);
				float coscita =cos(cita);
				float sincita = sin(cita);
				vec3 sampDir = vec3(sinphi*coscita,sinphi*sincita,cosphi);
				//to world space
				vec3 wDir=sampDir.x*right+sampDir.y*up+sampDir.z*N;
                irradiance +=textureCube(cubeMap,wDir).rgb*sinphi*cosphi;
                samples+=1.0;
			}
        }
        irradiance =irradiance*(PI/samples);
	}
`;

    const fbody_calRadiance = `
vec3 irradiance = vec3(0.0);
	vec3 nm = normalize(skyPos.xyz);
	calIrradiance(irradiance,nm);
	gl_FragColor.rgb = irradiance;
`;


    const fhead_calIBLFunc = `
const float PI = 3.14159;
float VanDerCorpus(int n, int base)
{
    float invBase = 1.0 / float(base);
    float denom   = 1.0;
    float result  = 0.0;

    for(int i = 0; i < 32; ++i)
    {
        if(n > 0)
        {
            denom   = mod(float(n), 2.0);
            result += denom * invBase;
            invBase = invBase / 2.0;
            n       = int(float(n) / 2.0);
        }
    }

    return result;
}
vec2 Hammersley(int i, int N)
{
    return vec2(float(i)/float(N), VanDerCorpus(i, 2));
}

vec3 ImportanceSampleGGX(vec2 Xi, vec3 N, float roughness)
{
    float a = roughness*roughness;
	
    float phi = 2.0 * PI * Xi.x;
    float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a*a - 1.0) * Xi.y));
    float sinTheta = sqrt(1.0 - cosTheta*cosTheta);
	
    // from spherical coordinates to cartesian coordinates
    vec3 H;
    H.x = cos(phi) * sinTheta;
    H.y = sin(phi) * sinTheta;
    H.z = cosTheta;
	
    // from tangent-space vector to world-space sample vector
    vec3 up        = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent   = normalize(cross(up, N));
    vec3 bitangent = cross(N, tangent);
	
    vec3 sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
    return normalize(sampleVec);
} 
float geometryGGX(float NoV,float NoL,float a){
    float a2 = a * a;
    float GGXL = NoV * sqrt((-NoL * a2 + NoL) * NoL + a2);
    float GGXV = NoL * sqrt((-NoV * a2 + NoV) * NoV + a2);
    return 0.5 / (GGXV + GGXL);
}
float distributionGGX(float nh,float rough){
    float a = rough*rough;
    float a2 = a*a;
    float f = (nh * a2 - nh) * nh + 1.0;
    float denom = PI*f*f;
    return a2/denom;
}
float GeometrySchlickGGX(float NdotV, float roughness)
{
    // note that we use a different k for IBL
    float a = roughness;
    float k = (a * a) / 2.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
float GeometrySmith(float NdotV, float NdotL, float roughness)
{
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}
`;
    const fhead_calbrdfMap = `

vec2 IntegrateBRDF(float NdotV, float roughness)
{
    vec3 V;
    V.x = sqrt(1.0 - NdotV*NdotV);
    V.y = 0.0;
    V.z = NdotV;

    float A = 0.0;
    float B = 0.0; 

    vec3 N = vec3(0.0, 0.0, 1.0);
    
    const int SAMPLE_COUNT = 1024;
    for(int i = 0; i < SAMPLE_COUNT; ++i)
    {
        // generates a sample vector that's biased towards the
        // preferred alignment direction (importance sampling).
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 H = ImportanceSampleGGX(Xi, N, roughness);
        vec3 L = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(L.z, 0.0);
        float NdotH = max(H.z, 0.0);
        float VdotH = max(dot(V, H), 0.0);
       
        if(NdotL > 0.0)
        {
            float NdotV  = max(dot(N,V),0.0);
            float G = GeometrySmith(NdotV,NdotL,roughness);
            float G_Vis = (G * VdotH) / (NdotH * NdotV);
            float Fc = pow(1.0 - VdotH, 5.0);

            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }
    A /= float(SAMPLE_COUNT);
    B /= float(SAMPLE_COUNT);
    return vec2(A, B);
}

vec2 IntegrateBRDF2(float NdotV, float roughness)
{
    vec3 V;
    V.x = sqrt(1.0 - NdotV*NdotV);
    V.y = 0.0;
    V.z = NdotV;

    float A = 0.0;
    float B = 0.0;

    vec3 N = vec3(0.0, 0.0, 1.0);

    const int SAMPLE_COUNT = 1024;
    for(int i = 0; i < SAMPLE_COUNT; ++i)
    {
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 H  = ImportanceSampleGGX(Xi, N, roughness);
        vec3 L  = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(L.z, 0.0);
        float NdotH = max(H.z, 0.0);
        float VdotH = max(dot(V, H), 0.0);
        float NdotV = max(dot(N,V),0.0);

        if(NdotL > 0.0)
        {
            float G = geometryGGX(NdotV, NdotL, roughness);
            float G_Vis = (G * VdotH) / (NdotH * NdotV);
            float Fc = pow(1.0 - VdotH, 5.0);

            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }
    A /= float(SAMPLE_COUNT);
    B /= float(SAMPLE_COUNT);
    return vec2(A, B);
}

`;
    const fbody_calBRDFMap = `
vec2 integratedBRDF = IntegrateBRDF(fUV.x, fUV.y);
gl_FragColor.rg = integratedBRDF;
gl_FragColor.b = 0.0;
`;



    const fhead_calIBLSpec = `
uniform float roughness;
`;

    const fbody_calIBLSpec = `
vec3 N = normalize(skyPos.xyz);
    
    // make the simplyfying assumption that V equals R equals the normal 
    vec3 R = N;
    vec3 V = R;
    vec3 prefilteredColor = vec3(0.0);
    float totalWeight = 0.0;
    const int SAMPLE_COUNT = 1024;
    for(int i = 0; i < SAMPLE_COUNT; ++i)
    {
        // generates a sample vector that's biased towards the preferred alignment direction (importance sampling).
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 H = ImportanceSampleGGX(Xi, N, roughness);
        vec3 L  = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(dot(N, L), 0.0);
        if(NdotL > 0.0)
        {
            // sample from the environment's mip level based on roughness/pdf
            float NdotH = max(dot(N, H), 0.0);
            float HdotV = max(dot(H, V), 0.0);
            float D   = distributionGGX(NdotH, roughness);
            float pdf = D * NdotH / (4.0 * HdotV) + 0.0001; 

            float resolution = 512.0; // resolution of source cubemap (per face)
            float saTexel  = 4.0 * PI / (6.0 * resolution * resolution);
            float saSample = 1.0 / (float(SAMPLE_COUNT) * pdf + 0.0001);

            float mipLevel = roughness == 0.0 ? 0.0 : 0.5 * log2(saSample / saTexel); 
            
            prefilteredColor += textureCube(cubeMap, L, mipLevel).rgb * NdotL;
            totalWeight      += NdotL;
        }
    }

    prefilteredColor = prefilteredColor / totalWeight;
    gl_FragColor = vec4(prefilteredColor.rgb, 1.0);
`;

    class MaterialUtil {
        static createFromShader(vsource, fsource) {
            var mat = new Material();
            mat.fsource = fsource;
            mat.vsource = vsource;
            /**@type {Material} */
            return mat;
        }


        static getDefineStr(key, value) {
            return "\n #define " + key + " " + value + "\n";
        }


        static createShaderHead(/**@type {ShaderOption}*/ shaderOps) {
            var vsource = vhead_common;
            var fsource = fhead_precision;
            fsource += fhead_commomFunc;


            if (shaderOps.useUV) {
                vsource += vhead_uv;
                fsource += fhead_uv;
            }
            if (!MathUtil.isNone(shaderOps.uvTran)) {
                fsource += fhead_uvTran;
            }
            if (!MathUtil.isNone(shaderOps.normalMap)) {
                vsource += vhead_normalMap;
                fsource += fhead_normalMap;
            } else if (!MathUtil.isNone(shaderOps.modelNormalMap)) {
                //use normalMap for normals

                fsource += fhead_modelNormalMap;
            }
            else {
                // use vertex_normal for normals
                vsource += vhead_vertexNormal;
                fsource += fhead_vertexNormal;
            }
            if (!MathUtil.isNone(shaderOps.texture0)) {

                fsource += fhead_simple_texture;
            } else if (!MathUtil.isNone(shaderOps.vertexColor)) {
                vsource += vhead_vcolor;
                fsource += fhead_vcolor;
            } else if (!MathUtil.isNone(shaderOps.cubeMap)) {
                vsource += vhead_cubeMap;
                fsource += fhead_cubeMap;
            } else if (!MathUtil.isNone(shaderOps.rectSphereMap)) {
                vsource += vhead_cubeMap;
                fsource += fhead_rectSphereMap;
            } else if (!MathUtil.isNone(shaderOps.matColor)) {
                fsource += fhead_matColor;
            }
            if (!MathUtil.isNone(shaderOps.texture1)) {
                fsource += fhead_texture1;
            }
            if (!MathUtil.isNone(shaderOps.heightMap)) {
                vsource += vhead_heightMap;
                fsource += fhead_heightMap;
            }
            if (!MathUtil.isNone(shaderOps.hdrExposure)) {
                fsource += fhead_toneMap;
            }
            if (!MathUtil.isNone(shaderOps.lightBlur)) {
                fsource += fhead_lightBlur;
            }

            if (shaderOps.calRadiance) {
                fsource += fhead_calRadiance;
            }
            if (shaderOps.calBrdf) {
                fsource += fhead_calIBLFunc;
                fsource += fhead_calbrdfMap;
            }
            if (shaderOps.calIBLSpec) {
                fsource += fhead_calIBLFunc;
                fsource += fhead_calIBLSpec;
            }

            //adding light affect
            if (!MathUtil.isNone(shaderOps.diffuse)) {
                //light
                vsource += vhead_light;
                fsource += fhead_light;

                if (!MathUtil.isNone(shaderOps.envMap)) {
                    if (!MathUtil.isNone(shaderOps.normalMap)) {
                        fsource += fhead_envMap_normalMap;
                        if (!MathUtil.isNone(shaderOps.reflective)) {
                            fsource += fhead_envMap_normal_reflect;
                        }
                        if (!MathUtil.isNone(shaderOps.refractParams)) {
                            fsource += fhead_envMap_normal_refract;
                        }
                    } else {
                        vsource += vhead_envMap;
                        fsource += fhead_envMap;
                        if (!MathUtil.isNone(shaderOps.reflective)) {
                            vsource += vhead_envMap_reflect;
                            fsource += fhead_envMap_reflect;
                        }
                        if (!MathUtil.isNone(shaderOps.refractParams)) {
                            vsource += vhead_envMap_refract;
                            fsource += fhead_envMap_refract;
                        }
                    }
                }
                if (!MathUtil.isNone(shaderOps.aoMap)) {

                    fsource += fhead_aoMap;
                }

                if (shaderOps.PBR) {
                    fsource += fhead_PBR;
                    if (!MathUtil.isNone(shaderOps.roughMap)) {
                        fsource += fhead_roughMap;
                    }
                    if (!MathUtil.isNone(shaderOps.metalMap)) {
                        fsource += fhead_metalMap;
                    }
                    if (shaderOps.IBL) {
                        fsource += fhead_IBL;
                    }
                    if (!MathUtil.isNone(shaderOps.irradianceMap)) {
                        fsource += fhead_IBL_iradiance;
                    }
                    if (!MathUtil.isNone(shaderOps.radianceMap)) {
                        fsource += fhead_IBL_specular;
                    }

                } else if (!MathUtil.isNone(shaderOps.specular)) {
                    //blinn
                    fsource += fhead_blinn_Light_st;
                    fsource += func_calLight_blinn;
                } else {
                    //lambert
                    fsource += fhead_lambert_Light_st;
                    fsource += func_calLight_lambert;
                }
                if (!MathUtil.isNone(shaderOps.dirLightCount)) {
                    var dirC = shaderOps.dirLightCount;
                    if (dirC > 0) {
                        fsource += MaterialUtil.getDefineStr("dirLightCount", dirC);
                        fsource += fhead_dLight_st;
                        fsource += func_calDirLights;
                    }


                }
                if (!MathUtil.isNone(shaderOps.pointLightCount)) {
                    var pointC = shaderOps.pointLightCount;
                    if (pointC > 0) {
                        fsource += MaterialUtil.getDefineStr("pointLightCount", pointC);
                        fsource += fhead_pointLight_st;
                        fsource += func_calPointLights;
                    }

                }

            }

            if (shaderOps.receiveShadow) {
                var lsc = MaterialUtil.getDefineStr("lightShadowCount", shaderOps.lightShadowCount);
                fsource += lsc;
                vsource += lsc;
                vsource += vhead_receiveShadow;
                fsource += fhead_receiveShadow;
            }
            if (shaderOps.enableFog) {
                if (!MathUtil.isNone(shaderOps.fogExp)) {
                    fsource += fhead_fog_exp;
                } else {
                    fsource += fhead_fog_linear;
                }
            }
            if (!MathUtil.isNone(shaderOps.fhead_add)) {
                fsource += shaderOps.fhead_add;
            }
            if (!MathUtil.isNone(shaderOps.vhead_add)) {
                vsource += shaderOps.vhead_add;
            }

            return [vsource, fsource];
        }


        static createShaderBody(/**@type {ShaderOption}*/ shaderOps) {
            var vsource = main_st;
            vsource += vbody_common;
            var fsource = main_st;

            if (shaderOps.useUV) {
                vsource += vbody_uv;
                fsource += fbody_uv;
            }
            if (!MathUtil.isNone(shaderOps.uvTran)) {
                fsource += fbody_uvTran;
            }
            if (!MathUtil.isNone(shaderOps.heightMap)) {

                vsource += vbody_heightMap;
                fsource += fbody_heightMap;
            }
            if (!MathUtil.isNone(shaderOps.normalMap)) {

                vsource += vbody_normalMap;
                fsource += fbody_normalMap;
            } else if (!MathUtil.isNone(shaderOps.modelNormalMap)) {

                fsource += fbody_modelNormalMap;
            } else {
                vsource += vbody_vertexNormal;
            }

            if (!MathUtil.isNone(shaderOps.texture0)) {

                fsource += fbody_simple_texture;
            } else if (!MathUtil.isNone(shaderOps.cubeMap)) {
                vsource += vbody_cubeMap;
                fsource += fbody_cubeMap;
            } else if (!MathUtil.isNone(shaderOps.rectSphereMap)) {
                vsource += vbody_cubeMap;
                fsource += fbody_rectSphereMap;
            }
            else if (!MathUtil.isNone(shaderOps.matColor)) {
                fsource += fbody_matColor;
            } else if (!MathUtil.isNone(shaderOps.vertexColor)) {
                vsource += vbody_vcolor;
                fsource += fbody_vcolor;
            }
            else {
                fsource += fbody_simple;
            }

            if (!MathUtil.isNone(shaderOps.texture1)) {
                fsource += fbody_texture1;
            }

            if (shaderOps.vgsBlur) {
                fsource += fbody_vgs_blur;
            }
            if (shaderOps.hgsBlur) {
                fsource += fbody_hgs_blur;
            }
            if (shaderOps.lightBlur) {
                fsource += fbody__lightBlur;
            }
            if (shaderOps.texBlend === TextureBlend.Add) {
                fsource += fbody_texBlendAdd;
            }

            if (shaderOps.calRadiance) {
                fsource += fbody_calRadiance;
            }
            if (shaderOps.calBrdf) {

                fsource += fbody_calBRDFMap;
            }
            if (shaderOps.calIBLSpec) {
                fsource += fbody_calIBLSpec;
            }



            // adding light affect
            if (!MathUtil.isNone(shaderOps.diffuse)) {
                //light


                vsource += vbody_light;
                fsource += fbody_light_st;
                if (shaderOps.PBR) {
                    if (!MathUtil.isNone(shaderOps.roughMap)) {

                        fsource += fbody_roughMap;
                    }
                    fsource += fbody_PBR_roughU;

                    if (!MathUtil.isNone(shaderOps.metalMap)) {

                        fsource += fbody_metalMap;
                    }
                    fsource += fbody_PBR_metalU;
                    if (!MathUtil.isNone(shaderOps.aoMap)) {

                        fsource += fbody_aoMap;
                    }

                    fsource += fbody_PBR;
                    if (shaderOps.IBL) {
                        fsource += fbody_IBL;
                    }
                    if (!MathUtil.isNone(shaderOps.irradianceMap)) {
                        fsource += fbody_IBL_iradiance;
                    }
                    if (!MathUtil.isNone(shaderOps.radianceMap)) {

                        fsource += fbody_IBL_specular;
                    }
                }
                if (!MathUtil.isNone(shaderOps.dirLightCount)) {
                    if (shaderOps.dirLightCount > 0) {
                        fsource += fbody_dirLight;
                    }

                }
                if (!MathUtil.isNone(shaderOps.pointLightCount)) {
                    if (shaderOps.pointLightCount) {
                        fsource += fbody_pointLight;
                    }

                }
                if (shaderOps.receiveShadow) {

                    vsource += vbody_receiveShadow;
                    fsource += fbody_Light_receiveShadow;
                }

                fsource += fbody_light_ambient;
                // if(!MathUtil.isNone(shaderOps.envMap)){
                //     vsource +=vbody_envMap;
                //     fsource +=fbody_envMap_color;
                //     fsource +=fbody_envMap_multi;
                // }
                if (!MathUtil.isNone(shaderOps.envMap)) {
                    fsource += fbody_envMap_st;
                    if (!MathUtil.isNone(shaderOps.normalMap)) {
                        if (!MathUtil.isNone(shaderOps.reflective)) {
                            fsource += fbody_envMap_normal_reflect;
                        }
                        if (!MathUtil.isNone(shaderOps.refractParams)) {
                            fsource += fbody_envMap_normal_refract;
                        }
                    } else {
                        if (!MathUtil.isNone(shaderOps.reflective)) {
                            vsource += vbody_envMap_reflect;
                            fsource += fbody_envMap_reflect;
                        }
                        if (!MathUtil.isNone(shaderOps.refractParams)) {
                            vsource += vbody_envMap_refract;
                            fsource += fbody_envMap_refract;
                        }
                    }
                    if (shaderOps.PBR) {
                        fsource += fbody_PBR_envMap;
                    }
                    fsource += fbody_envMap_ed;
                }
                fsource += fbody_light_ed;


            } else {
                vsource += vbody_simple;
                if (shaderOps.receiveShadow) {

                    vsource += vbody_receiveShadow;
                    fsource += fbody_NoLight_receiveShadow;
                }
            }

            if (shaderOps.enableFog) {
                if (!MathUtil.isNone(shaderOps.fogExp)) {
                    fsource += fbody_fog_exp;
                } else {
                    fsource += fbody_fog_linear;
                }
            }
            if (!MathUtil.isNone(shaderOps.hdrExposure)) {
                fsource += fbody_toneMap;
                // fsource +=fbody_gammaCorrection;
            }
            if (shaderOps.gammaCorrect) {
                fsource += fbody_gammaCorrection;
            }

            if (!MathUtil.isNone(shaderOps.fbody_add)) {
                fsource += shaderOps.fbody_add;
            }
            if (!MathUtil.isNone(shaderOps.vbody_add)) {
                vsource += shaderOps.vbody_add;
            }

            vsource += main_ed;
            fsource += main_ed;
            return [vsource, fsource];
        }

        static createFromShaderOption(
            /**@type {ShaderOption}*/ shaderOps,
            scene) {
            var mat = new Material();
            mat.shaderOption = shaderOps;
            var fdefineStr = "";

            if (!MathUtil.isNone(shaderOps.texture0)) {
                // var tex0 = null;
                // if(shaderOps.texture0 instanceof(Texture)){
                //     tex0 = shaderOps.texture0;
                // }else{
                //     var url = shaderOps.texture0;
                //     tex0 = new Texture(url);
                // }
                var tex0 = MaterialUtil.createTextureFromOps(shaderOps.texture0);
                mat.setUniform("texture0", UTypeEnumn$1.texture, tex0);
                mat.addTexture(tex0);
                shaderOps.useUV = true;

            } else if (!MathUtil.isNone(shaderOps.matColor)) {
                mat.setUniform("matColor", UTypeEnumn$1.Vec4, shaderOps.matColor);
            }
            if (!MathUtil.isNone(shaderOps.calIBLSpec)) {
                mat.setUniform("roughness", UTypeEnumn$1.float, shaderOps.roughness);
            }
            if (!MathUtil.isNone(shaderOps.calBrdf)) {
                shaderOps.useUV = true;
            }
            if (!MathUtil.isNone(shaderOps.hdrExposure)) {
                mat.setUniform("hdrExposure", UTypeEnumn$1.float, shaderOps.hdrExposure);
            }
            if (!MathUtil.isNone(shaderOps.normalMap)) {
                //var urln = shaderOps.normalMap;
                //var texn = new Texture(urln);
                var texn = MaterialUtil.createTextureFromOps(shaderOps.normalMap);
                // texn.wrap_mode = TextureWrap.repeat;
                mat.setUniform("normalMap", UTypeEnumn$1.texture, texn);
                mat.addTexture(texn);
                shaderOps.useUV = true;

            } else if (!MathUtil.isNone(shaderOps.modelNormalMap)) {
                var urlmn = shaderOps.modelNormalMap;
                var texmn = new Texture(urlmn);
                mat.setUniform("modelNormalMap", UTypeEnumn$1.texture, texmn);
                mat.addTexture(texmn);
                shaderOps.useUV = true;
            }
            if (!MathUtil.isNone(shaderOps.cubeMap) || !MathUtil.isNone(shaderOps.envMap)) {
                var urlc = shaderOps.cubeMap || shaderOps.envMap;
                var texc = MaterialUtil.createTextureFromOps(urlc, TextureType.cube);
                mat.setUniform("cubeMap", UTypeEnumn$1.texture, texc);
                //texc.hasMipMap = true;
                mat.addTexture(texc);
            }
            if (!MathUtil.isNone(shaderOps.rectSphereMap)) {
                var urectM = shaderOps.rectSphereMap;
                var rectmp = MaterialUtil.createTextureFromOps(urectM);
                mat.setUniform("rectSphereMap", UTypeEnumn$1.texture, rectmp);
                mat.addTexture(rectmp);
                shaderOps.useUV = true;
            }

            if (!MathUtil.isNone(shaderOps.reflective)) {
                mat.setUniform("reflective", UTypeEnumn$1.float, shaderOps.reflective);
            }
            if (!MathUtil.isNone(shaderOps.refractParams)) {
                mat.setUniform("refractParams", UTypeEnumn$1.Vec2, shaderOps.refractParams);
            }

            if (!MathUtil.isNone(shaderOps.texture1)) {
                var tex1 = null;
                if (shaderOps.texture1 instanceof (Texture)) {
                    tex1 = shaderOps.texture1;
                } else {
                    var url1 = shaderOps.texture1;
                    tex1 = new Texture(url1);
                }
                shaderOps.useUV = true;
                mat.setUniform("texture1", UTypeEnumn$1.texture, tex1);
                mat.addTexture(tex1);
            }

            if (!MathUtil.isNone(mat.shaderOption.texture_brighter)) {
                var tbr = null;
                if (shaderOps.texture_brighter instanceof (Texture)) {
                    tbr = shaderOps.texture_brighter;
                } else {
                    var urlt = shaderOps.texture_brighter;
                    tbr = new Texture(urlt);
                }
                mat.setUniform("texture_brighter", UTypeEnumn$1.texture, tbr);
                mat.addTexture(tbr);
                shaderOps.useUV = true;
            }


            if (mat.shaderOption.receiveShadow) {
                var t = 0;
                for (var i = 0; i < scene.dirLights.length; i++) {
                    var dl = scene.dirLights[i];
                    if (dl.castShadow) {
                        mat.setLightShadowParams(dl, t);
                        t = t + 1;
                    }
                }
                for (var j = 0; j < scene.pointLights.length; j++) {
                    var pl = scene.pointLights[j];
                    if (pl.castShadow) {
                        mat.setLightShadowParams(pl, t);
                        t = t + 1;
                    }
                }
                if (t === 0) {
                    t = 1;
                }
                mat.shaderOption.lightShadowCount = t;
            }

            if (shaderOps.enableFog) {
                if (!MathUtil.isNone(shaderOps.fogExp)) {
                    //fogExp.density = 0.09;
                    var fogExp = shaderOps.fogExp;
                    if (fogExp.density === undefined) fogExp.density = 0.09;
                    if (fogExp.fogColor === undefined) fogExp.fogColor = [1.0, 1.0, 1.0];
                    mat.setUniform("density", UTypeEnumn$1.float, fogExp.density);
                    mat.setUniform("fogColor", UTypeEnumn$1.Vec3, fogExp.fogColor);
                } else {
                    var start = 1.0;
                    var end = 20.0;
                    var fogColor = [1.0, 1.0, 1.0];
                    if (!MathUtil.isNone(shaderOps.fogLinear)) {
                        start = shaderOps.fogLinear.start;
                        end = shaderOps.fogLinear.end;
                        fogColor = shaderOps.fogLinear.fogColor;
                    }
                    mat.setUniform("fogLinear", UTypeEnumn$1.Vec2, [start, end]);
                    mat.setUniform("fogColor", UTypeEnumn$1.Vec3, fogColor);
                }
            }
            if (!MathUtil.isNone(shaderOps.aoMap)) {
                var trao = null;
                if (shaderOps.aoMap instanceof (Texture)) {
                    trao = shaderOps.aoMap;
                } else {
                    var urltrao = shaderOps.aoMap;
                    trao = new Texture(urltrao);
                }
                mat.setUniform("aoMap", UTypeEnumn$1.texture, trao);
                mat.addTexture(trao);
                shaderOps.useUV = true;
            }


            if (shaderOps.PBR) {
                if (!MathUtil.isNone(shaderOps.roughMap)) {
                    var trh = null;
                    if (shaderOps.roughMap instanceof (Texture)) {
                        trh = shaderOps.roughMap;
                    } else {
                        var urlrh = shaderOps.roughMap;
                        trh = new Texture(urlrh);
                    }
                    mat.setUniform("roughMap", UTypeEnumn$1.texture, trh);
                    mat.addTexture(trh);
                    shaderOps.useUV = true;
                }
                var roughness = 1.0;
                if (!MathUtil.isNone(shaderOps.roughness)) {
                    roughness = shaderOps.roughness;
                }
                mat.setUniform("roughness", UTypeEnumn$1.float, roughness);

                if (!MathUtil.isNone(shaderOps.metalMap)) {
                    var tmt = null;
                    if (shaderOps.metalMap instanceof (Texture)) {
                        tmt = shaderOps.metalMap;
                    } else {
                        var urlmt = shaderOps.metalMap;
                        tmt = new Texture(urlmt);
                    }
                    mat.setUniform("metalMap", UTypeEnumn$1.texture, tmt);
                    mat.addTexture(tmt);
                    shaderOps.useUV = true;
                }
                var metalness = 1.0;
                if (!MathUtil.isNone(shaderOps.metalness)) {
                    metalness = shaderOps.metalness;
                }
                mat.setUniform("metalness", UTypeEnumn$1.float, metalness);
                if (!MathUtil.isNone(shaderOps.irradianceMap)) {
                    var irdtex = MaterialUtil.createTextureFromOps(shaderOps.irradianceMap, TextureType.cube);
                    mat.setUniform("irradianceMap", UTypeEnumn$1.texture, irdtex);
                    mat.addTexture(irdtex);
                    shaderOps.IBL = true;
                    fdefineStr += "#define DF_IRRADIANCEMAP\n";
                }
                if (shaderOps.linearMip) {
                    fdefineStr += "#define DF_LINEARMIP\n";
                }
                if (!MathUtil.isNone(shaderOps.radianceMap)) {
                    var rdtex = MaterialUtil.createTextureFromOps(shaderOps.radianceMap);
                    if (rdtex.type === TextureType.default) {
                        fdefineStr += "#define DF_RADSPMAP\n";
                    }
                    mat.setUniform("radianceMap", UTypeEnumn$1.texture, rdtex);
                    mat.addTexture(rdtex);

                    if (rdtex.state === LoadState.loaded) {
                        var maxMipCount = rdtex.getMipCount();
                        mat.setUniform("MAX_MIPCOUNT", UTypeEnumn$1.float, maxMipCount);
                    } else {
                        rdtex.onLoadedCalls.push(function (tex) {
                            var maxMipCount = rdtex.getMipCount();
                            mat.setUniform("MAX_MIPCOUNT", UTypeEnumn$1.float, maxMipCount);
                        });
                    }

                    if (!MathUtil.isNone(shaderOps.lutMap)) {
                        var lutTex = MaterialUtil.createTextureFromOps(shaderOps.lutMap);
                        mat.setUniform("lutMap", UTypeEnumn$1.texture, lutTex);
                        mat.addTexture(lutTex);
                        fdefineStr += "#define DF_LUTMAP\n";
                    }
                    fdefineStr += "#define DF_RADIANCEMAP\n";
                    shaderOps.useUV = true;
                    shaderOps.IBL = true;
                    var ext_lod = scene.gl.getExtension('EXT_shader_texture_lod');

                    var ext_deriv = scene.gl.getExtension('OES_standard_derivatives');
                    if (!MathUtil.isNone(ext_lod)) {
                        fdefineStr += "#define DF_TEX_LOD\n";
                        //alert("lod+",ext_lod);
                    }
                    if (!MathUtil.isNone(ext_deriv)) {
                        fdefineStr += "#define DF_DERIVATIVES\n";
                    }
                }


            }
            if (!MathUtil.isNone(shaderOps.heightMap)) {
                //shaderOps.uniformsToUp.modelCameraPos = true;
                shaderOps.uniformsToUp.modelViewInv = true;
                var hmt = null;
                if (shaderOps.heightMap instanceof (Texture)) {
                    hmt = shaderOps.heightMap;
                } else {
                    var urhmt = shaderOps.heightMap;
                    hmt = new Texture(urhmt);
                }
                // hmt.wrap_mode = TextureWrap.repeat;
                mat.setUniform("heightMap", UTypeEnumn$1.texture, hmt);
                mat.addTexture(hmt);
                shaderOps.useUV = true;
            }

            if (!MathUtil.isNone(shaderOps.uvTran)) {
                mat.setUniform("uvTran", UTypeEnumn$1.Vec4, shaderOps.uvTran);
            }
            var heads = MaterialUtil.createShaderHead(shaderOps);
            var bodys = MaterialUtil.createShaderBody(shaderOps);
            mat.vsource = heads[0] + bodys[0];
            mat.fsource = MaterialUtil.filterShader(fdefineStr + heads[1] + bodys[1]);
            // console.log("vertexShader",mat.vsource);
            // console.log("fragmentShader",mat.fsource);
            return mat;

        }
        static createTextureFromOps(tex, type, elType) {
            // if(type === undefined){
            //     type = TextureType.default;
            // }
            // if(elType === undefined){
            //     elType = TextureElemType.default;
            // }
            var imts = null;
            if (tex instanceof (Texture)) {
                imts = tex;

            } else {
                var urimts = tex;
                if (urimts instanceof Array) {
                    type = TextureType.cube;
                } else {
                    type = TextureType.default;
                }
                imts = new Texture(urimts);
                imts.type = type;
                //imts.type = type;
            }
            // imts.type = type;
            // imts.elType = elType;
            if (type === TextureType.cube) ;
            return imts;
        }

        static filterShader(source) {
            var res = source;
            if (source.indexOf("gl_FragData") !== -1) {
                res = source.replace(new RegExp("gl_FragColor", 'g'), "gl_FragData[0]");
            }
            return res;
        }


        static updateDirLightInfo(/**@type {WebGLRenderingContext} */ gl,
            viewM, dirLights, mat) {
            //var viewM =  camera.getViewMatrix();

            for (var i in dirLights) {
                var key = "dirL[" + i + "]";
                var lightDiff = dirLights[i];
                var dir = lightDiff.transform.pos;

                dir = MathUtil.normalize(dir);
                var lcolor = MathUtil.multiplyV3(lightDiff.color, mat.shaderOption.diffuse);
                mat.setUniform(key + ".light.diffuse", UTypeEnumn$1.Vec3,
                    [lcolor.x, lcolor.y, lcolor.z]);
                var dir4 = new Vector4(-1.0 * dir.x, -1.0 * dir.y, -1.0 * dir.z, 0.0);
                dir4 = MathUtil.vec4MultiMatrix(dir4, viewM);
                //console.log("lightDirection",dir4);
                mat.setUniform(key + ".direction", UTypeEnumn$1.Vec3,
                    [dir4.x, dir4.y, dir4.z]);
                if (!mat.shaderOption.PBR && !MathUtil.isNone(mat.shaderOption.specular) &&
                    !MathUtil.isNone(lightDiff.specular)) {
                    var specu = MathUtil.multiplyV3(lightDiff.specular, mat.shaderOption.specular);
                    mat.setUniform(key + ".light.specular", UTypeEnumn$1.Vec3, [specu.x, specu.y, specu.z]);
                    mat.setUniform(key + ".light.shininess", UTypeEnumn$1.float, mat.shaderOption.shininess);
                }
            }

        }

        static updatePointLightInfo(/**@type {WebGLRenderingContext} */ gl,
            viewM, pointLights, mat) {
            for (var i in pointLights) {
                var key = "pointL[" + i + "]";
                var lightDiff = pointLights[i];
                var dir = lightDiff.transform.pos;
                var dir4 = new Vector4(dir.x, dir.y, dir.z, 1.0);
                dir4 = MathUtil.vec4MultiMatrix(dir4, viewM);
                mat.setUniform(key + ".position", UTypeEnumn$1.Vec3,
                    [dir4.x, dir4.y, dir4.z]);
                mat.setUniform(key + ".params", UTypeEnumn$1.Vec3, [lightDiff.constant, lightDiff.linear, lightDiff.quadratic]);
                var lcolor = MathUtil.multiplyV3(lightDiff.color, mat.shaderOption.diffuse);
                mat.setUniform(key + ".light.diffuse", UTypeEnumn$1.Vec3,
                    [lcolor.x, lcolor.y, lcolor.z]);
                if (!mat.shaderOption.PBR && !MathUtil.isNone(mat.shaderOption.specular) &&
                    !MathUtil.isNone(lightDiff.specular)) {
                    var specu = MathUtil.multiplyV3(lightDiff.specular, mat.shaderOption.specular);
                    mat.setUniform(key + ".light.specular", UTypeEnumn$1.Vec3, [specu.x, specu.y, specu.z]);
                    mat.setUniform(key + ".light.shininess", UTypeEnumn$1.float, mat.shaderOption.shininess);
                }

            }

        }
        static __updateSingleShadow(/**@type {WebGLRenderingContext} */ gl,
            /**@type {Material} */ mat,
            /**@type {Transform} */entityTransform,
            /**@type {Light} */ light, i
        ) {
            if (light.castShadow && mat.shaderOption.receiveShadow) {
                var key = "lightPVM[" + i + "]";
                var camera = light.shadowCam;
                var projM = camera.getProjectionMatrix();

                camera.transform.setPosition(light.transform.pos.x,
                    light.transform.pos.y, light.transform.pos.z);
                camera.transform.lookAt(0, 0, 0);
                // update light position direction
                var viewM = camera.getViewMatrix();
                var modelM = entityTransform.getDerivTranMatrix();
                var mvp = MathUtil.multiplyMat(projM, MathUtil.multiplyMat(viewM, modelM));
                var value = MathUtil.mat2Arr(mvp);
                mat.setUniform(key, UTypeEnumn$1.Mat4, value);
            }
        }

        static updateShadowInfo(/**@type {WebGLRenderingContext} */ gl,
             /**@type {Material} */ mat,
            /**@type {Transform} */entityTransform,
            /**@type {Scene}*/ scene) {
            if (mat.shaderOption.receiveShadow) {
                var t = 0;
                for (var j = 0; j < scene.dirLights.length; j++) {
                    var dl = scene.dirLights[j];
                    if (dl.castShadow) {
                        MaterialUtil.__updateSingleShadow(gl, mat, entityTransform, dl, t);
                        t += 1;
                    }
                }
                for (var i = 0; i < scene.pointLights.length; i++) {
                    var pl = scene.pointLights[i];
                    if (pl.castShadow) {
                        MaterialUtil.__updateSingleShadow(gl, mat, entityTransform, pl, t);
                        t += 1;
                    }

                }
            }

        }

        static updateLightMatInfo(/**@type {WebGLRenderingContext} */ gl,
            /**@type {Camera} */camera,
            /**@type {Material} */ mat,
            /**@type {Transform} */entityTrans,
            /**@type {Scene}*/ scene) {
            // normal = mv.inv.tran = (m*view).inv.tran = (view.inv*m.inv).tran
            // normal = m.inv.tran * view.inv.tran
            if (MathUtil.isNone(mat)) {
                return;
            }
            MaterialUtil.updateShadowInfo(gl, mat, entityTrans, scene);
            if (!MathUtil.isNone(mat.shaderOption.diffuse)) {
                var viewM = camera.getViewMatrix();
                MaterialUtil.updateDirLightInfo(gl, viewM, scene.dirLights, mat);
                MaterialUtil.updatePointLightInfo(gl, viewM, scene.pointLights, mat);
                //console.log("dir==",dir);
                mat.setUniform("ambientLight", UTypeEnumn$1.Vec3,
                    [scene.ambientLight.x, scene.ambientLight.y, scene.ambientLight.z]);

                var mInv = entityTrans.getDerivInvTranMatrix();
                var vInv = camera.transform.getDerivTranMatrix();
                var nM = MathUtil.getNormalMatrixArr(mInv, vInv);
                mat.setUniform("normalMatrix", UTypeEnumn$1.Mat4, nM);

            }

        }

    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-01-19 17:31:28
     * @Description: file content
     */

    var FrameState = {
        BeforeDraw: 0,
        AfterDraw: 1
    };
    class Scene {
        constructor() {
            this.cameraList = [];
            //this.camera = null;
            this._dirty = true;
            this._activeDraw = false;
            this.entityList = [];
            this.clearColor = [0.3, 0.2, 0.2, 1.0];
            /**@type {WebGLRenderingContext} */
            this.gl = null;
            this.ambientLight = new Vector3(0.0, 0.0, 0.0);
            this.dirLights = [];
            this.pointLights = [];
            this.onBeforeDrawFrame = [];
            this.onAfterDrawFrame = [];
            this._befDrawRunQueue = [];
            this._aftDrawRunQueue = [];
        }
        // func will be called on every frame
        registerFrameCalls(func, frameState) {
            if (typeof func !== "function") {
                console.error("wrong parameters: not a function,", func);
            }
            if (frameState === FrameState.AfterDraw) {
                this.onAfterDrawFrame.push(func);
            } else {
                this.onBeforeDrawFrame.push(func);
            }
        }

        // func will be called on next frame once
        postFrameRunnable(func, frameState) {
            if (typeof func !== "function") {
                console.error("wrong parameters: not a function,", func);
            }
            if (frameState === FrameState.AfterDraw) {
                this._aftDrawRunQueue.push(func);
            } else {
                this._befDrawRunQueue.push(func);
            }
        }

        update(/**@type {WebGLRenderingContext} */ gl) {
            if (this._dirty) ;
        }
        requireUpdate() {
            this._dirty = true;
        }
        initRenderState(
            /** @type {WebGLRenderingContext} */gl,
            r, g, b, a) {
            // set Canvas state
            gl.clearColor(r, g, b, a);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }


        sortCameras() {
            // this.cameraList = MathUtil.bucketSort(this.cameraList,function(cam){return cam.depth;},100,0);
            return MathUtil.bucketSortDict(this.cameraList, function (cam) { return cam.depth; }, 100, 0);
        }
        sortEntities() {
            //this.entityList =  MathUtil.bucketSort(this.entityList,function(enti){return enti.renderLayer;},100,0);
            return MathUtil.bucketSortDict(this.entityList, function (enti) { return enti.renderLayer; }, 100, 0);
        }

        addCamera(cam) {
            this.cameraList.push(cam);
        }

        addEntity(enti) {
            if (enti instanceof (Entity)) {
                if (this.entityList === null) {
                    this.entityList = [];
                }
                this.entityList.push(enti);
            }
        }

        clearCamera(/**@type {WebGLRenderingContext} */gl,
        /**@type {Camera}*/cam) {
            var sus = true;
            // if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE){
            if (cam.clearMask === ClearMask.default) {
                this.initRenderState(gl, cam.clearColor[0], cam.clearColor[1],
                    cam.clearColor[2], cam.clearColor[3]);
            } else if (cam.clearMask === ClearMask.onlyDepth) {
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
        /**@type {Camera}*/cam) {
            var sus = true;
            if (cam.renderTarget !== null) {
                if (cam.renderTarget.state === LoadState.init) {
                    cam.renderTarget.loadTexture(gl, null);
                }
                if (cam.renderTarget.state !== LoadState.init) {
                    if (cam.renderTarget instanceof (RenderTexture)) {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, cam.renderTarget.frameBufferId);
                        // gl.viewport(0,0,cam.renderTarget.width,cam.renderTarget.height);
                        if (cam.renderTarget.hasColorBuffer) {
                            gl.bindRenderbuffer(gl.RENDERBUFFER, cam.renderTarget.depthRBuffer);
                        } else {
                            gl.enable(gl.CULL_FACE);
                            gl.cullFace(gl.BACK);
                        }
                        cam.renderTarget.updateFBODate(gl, cam);
                    }
                } else {
                    sus = false;
                }
            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            }
            return sus;

        }
        unbindCamera(/**@type {WebGLRenderingContext} */gl,
        /**@type {Camera}*/cam) {

        }

        drawRenderLayer(/**@type {WebGLRenderingContext} */gl, cam, entiArr) {
            var that = this;
            for (var i = 0; i < entiArr.length; i++) {
                var entity = entiArr[i];
                // var mat = entity.getActiveMaterial(cam);
                // var camera = cam;
                entity.material.getActive(cam, function (mat, camera) {
                    if (cam.id !== camera.id) {
                        that.unbindCamera(gl, cam);
                        that.bindCamera(gl, camera);
                        that.clearCamera(gl, camera);
                    }
                    MaterialUtil.updateLightMatInfo(gl, camera, mat, entity.transform, that);
                    Scene.drawEntity(gl, camera, entity, mat);
                    if (cam.id !== camera.id) {
                        that.unbindCamera(gl, camera);
                        that.bindCamera(gl, cam);
                    }
                });



            }

        }
        drawCamera(/**@type {WebGLRenderingContext} */gl,
            cam, entitiesD) {
            if (cam.beforeDrawFunc !== null) {
                cam.beforeDrawFunc(entitiesD);
            }
            this.bindCamera(gl, cam);
            this.clearCamera(gl, cam);
            if (cam.renderMask === RenderMask.everything) {
                for (var ek in entitiesD) {
                    var entiArr = entitiesD[ek]; //ek layer
                    this.drawRenderLayer(gl, cam, entiArr);
                }
            } else if (cam.renderMask === RenderMask.layers) {
                for (var cl in cam.renderLayers) {
                    var clayer = cam.renderLayers[cl];
                    var entiArr_cl = entitiesD[clayer]; //ek layer
                    if (!MathUtil.isNone(entiArr_cl)) {
                        this.drawRenderLayer(gl, cam, entiArr_cl);
                    }
                }
            }
            this.unbindCamera(gl, cam);
            if (cam.afterDrawFunc !== null) {
                cam.afterDrawFunc(gl, entitiesD);
            }
        }

        drawOneFrame(/**@type {WebGLRenderingContext} */gl) {
            if (gl === null) {
                console.error("couldn't draw WebglRenderingContext is null");
                return;
            }
            this.update(gl);
            var camsD = this.sortCameras();
            var entitiesD = this.sortEntities();
            for (var ck in camsD) {
                var camArr = camsD[ck]; // depth ck
                for (var j = 0; j < camArr.length; j++) {
                    /**@type {Camera} */
                    var cam = camArr[j];
                    if (cam.enable) {

                        if (!MathUtil.isNone(cam.renderTarget) &&
                            cam.renderTarget.type === TextureType.cube) {
                            // console.log('draw Camera>>,name',cam.name);
                            if (cam.drawMips) {
                                for (var m = 0; m < cam.renderTarget.getMipCount(); m++) {
                                    cam.renderTarget.currentMip = m;
                                    for (var t = 0; t < 6; t++) {
                                        this.drawCamera(gl, cam, entitiesD);
                                    }
                                }
                            } else {
                                for (var t1 = 0; t1 < 6; t1++) {
                                    // cam.renderTarget.calRotateFace(cam);
                                    this.drawCamera(gl, cam, entitiesD);
                                }
                            }

                        } else {
                            this.drawCamera(gl, cam, entitiesD);
                        }
                    }



                }
            }

        }


        enableActiveDraw(enable) {
            this._activeDraw = enable;
        }

        draw(/**@type {WebGLRenderingContext} */gl) {
            if (gl === undefined) {
                gl = this.gl;
            }
            for (var fi in this.onBeforeDrawFrame) {
                this.onBeforeDrawFrame[fi]();
            }
            while (this._befDrawRunQueue.length > 0) {
                this._befDrawRunQueue.shift()();
            }

            // continues to draw without break;
            if (!this._activeDraw) {
                this.drawOneFrame(gl);
            } else {
                // continues draw need activeDraw, requireUpdate();
                if (this._dirty) {
                    this.drawOneFrame(gl);
                    this._dirty = false;
                }
            }
            for (var ci in this.onAfterDrawFrame) {
                this.onAfterDrawFrame[ci]();
            }
            while (this._aftDrawRunQueue.length > 0) {
                this._aftDrawRunQueue.shift()();
            }
            var that = this;
            window.requestAnimationFrame(function (timeStamp) {
                that.draw(gl);
            });
        }

        addLight(light) {
            if (light instanceof DirectionLight) {
                if (MathUtil.isNone(this.dirLights)) {
                    this.dirLights = [];
                }
                this.dirLights.push(light);
            }
            if (light instanceof PointLight) {
                if (MathUtil.isNone(this.pointLights)) {
                    this.pointLights = [];
                }
                this.pointLights.push(light);
            }
        }


        static drawEntity(/**@type {WebGLRenderingContext} */ gl,
            /**@type {Camera} */camera,
            /**@type {Entity} */entity,
            /**@type {Material} */mat) {
            // var mat = entity.getActiveMaterial(camera);
            if (entity.mesh !== null && mat !== null) {
                var projM = camera.getGLProj();
                var viewM = camera.getViewMatrix();
                if (entity.transform.followCameraPos) {
                    entity.transform.setPosition(camera.transform.pos.x,
                        camera.transform.pos.y,
                        camera.transform.pos.z);
                }
                var dt = mat.shaderOption.depthTest;
                var dw = mat.shaderOption.depthWrite;
                if (dt !== gl.getParameter(gl.DEPTH_TEST)) {
                    if (dt) {
                        gl.enable(gl.DEPTH_TEST);
                    } else {
                        gl.disable(gl.DEPTH_TEST);
                    }
                }
                if (dw !== gl.getParameter(gl.DEPTH_WRITEMASK)) {
                    if (dw) {
                        gl.depthMask(true);
                    } else {
                        gl.depthMask(false);
                    }
                }

                var ecf = mat.shaderOption.enableCull;
                if (ecf !== gl.getParameter(gl.CULL_FACE)) {
                    if (ecf) {
                        gl.enable(gl.CULL_FACE);
                    } else {
                        gl.disable(gl.CULL_FACE);
                    }
                }
                var cf = gl[mat.shaderOption.cullFace];
                if (cf !== gl.getParameter(gl.CULL_FACE_MODE)) {
                    gl.cullFace(cf);
                }

                // if(!MathUtil.isNone(camera.renderTarget)&&!
                //  camera.renderTarget.hasColorBuffer){

                // }

                var eM = entity.transform.getDerivTranMatrix();
                var mvM = Transform.getMVGLArr(viewM, eM);
                mat.setUniform(
                    DefaultUniformKey.projectionMatrix,
                    UTypeEnumn$1.Mat4, projM);
                mat.setUniform(
                    DefaultUniformKey.modelViewMatrix,
                    UTypeEnumn$1.Mat4, mvM);
                if (mat.shaderOption.uniformsToUp.modelCameraPos) {
                    var eMI = entity.transform.getDerivInvTranMatrix();
                    var cPos = camera.transform.pos;
                    var mcpos = MathUtil.vec3MultiMat4(cPos, eMI);
                    mat.setUniform(
                        "modelCameraPos",
                        UTypeEnumn$1.Vec3, [mcpos.x, mcpos.y, mcpos.z]);

                }
                if (mat.shaderOption.uniformsToUp.modelViewInv) {
                    var mI = entity.transform.getDerivInvTranMatrix();
                    var viewI = camera.transform.getDerivTranMatrix();
                    var mvI = MathUtil.mat2Arr(math.multiply(mI, viewI));
                    mat.setUniform(
                        "modelViewInv",
                        UTypeEnumn$1.Mat4, mvI);

                }
                if (!MathUtil.isNone(mat.shaderOption.envMap) ||
                    mat.shaderOption.IBL) {
                    var viewArr = Transform.mat2Arr(viewM);
                    mat.setUniform("viewMatrix", UTypeEnumn$1.Mat4, viewArr);
                }

                var vertexBuffer = entity.mesh.getVertexBufferInfo(gl);
                var programInfo = mat.getProgramInfo(gl);
                var info = new RenderInfo(gl,
                    projM, mvM, programInfo, vertexBuffer);
                Render.drawRender(info);
            }
        }

        calculateShadowLights() {
            var t = 0;
            for (var i = 0; i < this.dirLights.length; i++) {
                var dl = this.dirLights[i];
                if (dl.castShadow) {
                    t = t + 1;
                }
            }
            for (var j = 0; j < this.pointLights.length; j++) {
                var pl = this.pointLights[j];
                if (pl.castShadow) {
                    t = t + 1;
                }
            }
            return t;
        }
        getPointLightsCount() {
            return this.pointLights.length;
        }
        getDirectionalLightsCount() {
            return this.dirLights.length;
        }


    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-15 19:41:01
     * @Description: file content
     */

    class SceneUtil {

        static createSkyBox(scene, params) {
            if (params === undefined) {
                params = {};
            }
            if (params.skyBoxPath === undefined) {
                params.skyBoxPath = "../pics/cube/bridge/";
            }
            if (params.extension === undefined) {
                params.extension = ".jpg";
            }
            params.depthTest = true;
            params.depthWrite = true;
            params.receiveLight = false;
            params.receiveShadow = false;
            params.cullFace = "FRONT";

            var mesh = MeshUtil.createBox(90, 90, 90);
            //var mesh = MeshUtil.createSphere(50,20,20);
            var pf = params.skyBoxPath;
            var et = params.extension;
            params.cubeMap = [pf + "posx" + et, pf + "negx" + et, pf + "posy" + et,
            pf + "negy" + et, pf + "posz" + et, pf + "negz" + et
            ];
            params.matColor = null;
            //var material = MaterialUtil.createFromShaderOption(shaderOps,scene);
            var material = SceneUtil.createMaterial(scene, params);
            var entity = new Entity("skybox");
            entity.mesh = mesh;
            entity.material = material;
            entity.transform.followCameraPos = true;
            return entity;

        }
        static createBloomMaterial(scene, mat) {
            var fh_add = `
        #extension GL_EXT_draw_buffers : require 
        `;
            // // gl_FragData[1] = gl_FragColor;
            //gl_FragData[1] = vec4(0.0,0.0,0.0,1.0);
            var fb_add = `
            float grey = gl_FragColor.r*0.299 + gl_FragColor.g*0.587 + gl_FragColor.b*0.114;
            if(grey>0.85){
                gl_FragData[1] = gl_FragColor;
            }else{
                gl_FragData[1] = vec4(0.0,0.0,0.0,1.0);
                
            }
            `;
            var shaderOps = SceneUtil.copyShaderOps(mat.shaderOption);
            shaderOps.fhead_add = fh_add;
            shaderOps.fbody_add = fb_add;
            var bmat = MaterialUtil.createFromShaderOption(shaderOps, scene);
            bmat.name = "bloom_draw2Mat";
            return bmat;
        }

        static copyShaderOps(shaderOps) {
            var nsh = new ShaderOption();
            for (var k in shaderOps) {
                nsh[k] = shaderOps[k];
            }
            return nsh;
        }

        static createMaterial(/** @type {Scene}*/ scene, params) {
            if (params === undefined) {
                params = {};
            }
            var shaderOps = new ShaderOption();
            for (var k in params) {
                shaderOps[k] = params[k];
            }
            if (shaderOps.matColor === undefined) ;
            if (shaderOps.receiveLight === undefined) {
                shaderOps.receiveLight = true;
            }
            if (shaderOps.receiveShadow === undefined) {
                shaderOps.receiveShadow = false;
            }


            if (shaderOps.receiveLight) {
                if (shaderOps.diffuse === undefined) {
                    shaderOps.diffuse = new Vector3(1.0, 1.0, 1.0);
                }
                if (shaderOps.specular === undefined) {
                    shaderOps.specular = new Vector3(1.0, 1.0, 1.0);

                }
                if (shaderOps.shininess === undefined) {
                    shaderOps.shininess = 10.0;
                }


                var dirCount = 0; var pointCount = 0;
                if (!MathUtil.isNone(scene.dirLights)) {
                    dirCount = scene.getDirectionalLightsCount();
                }
                if (!MathUtil.isNone(scene.pointLights)) {
                    pointCount = scene.getPointLightsCount();
                }
                shaderOps.dirLightCount = dirCount;
                shaderOps.pointLightCount = pointCount;
                shaderOps.castShadow = true;
            }
            /**@type {Material} */
            var material = MaterialUtil.createFromShaderOption(shaderOps, scene);
            if (params.receiveShadow) {
                var dshaderOps = new ShaderOption();
                // dshaderOps.matColor = [1.0,1.0,1.0,1.0];
                var dmat = MaterialUtil.createFromShaderOption(dshaderOps, scene);
                dmat.name = "depthMaterial";
                material.addPassLayer(dmat, CameraType.depth);
            }
            if (scene.hdr_bloom) {
                var bloomMat = SceneUtil.createBloomMaterial(scene, material);
                material.addPassLayer(bloomMat, CameraType.bloom_col2);
            }
            return material;

        }

        static createEntity(/** @type {Scene}*/ scene,
            name,
            /**
             * params:
             * {mesh:sphere,
             * color:[0.3,0.5,1.0,1.0],
             * receiveLight:true,
             * receiveShadow:false,
             * texture:null} 
             **/params) {
            //var mesh = MeshUtil.createPlane(2,2,0);
            //mesh,color,isL,receiveShadow,tex
            if (params === undefined) {
                params = {};
            }
            if (params.mesh === undefined) {
                params.mesh = MeshUtil.createSphere(1, 20, 20);
            }
            var material = null;
            if (params.material !== undefined) {
                /**@type {Material} */
                material = params.material;
            } else {
                material = this.createMaterial(scene, params);
            }
            if (name === undefined) {
                name = "entity_default";
            }
            var entity = new Entity(name);
            entity.mesh = params.mesh;
            entity.material = material;
            return entity;
        }

        static createDefaultScene(canvasId, sceneParams) {
            if (sceneParams === undefined) {
                sceneParams = {};
            }
            if (sceneParams.hasLight === undefined) {
                sceneParams.hasLight = true;
            }
            if (sceneParams.castShadow === undefined) {
                sceneParams.castShadow = true;
            }
            if (sceneParams.hasSkyBox === undefined) {
                sceneParams.hasSkyBox = false;
            }

            // sceneParams.skyBoxPath
            var gl = CanvasUtil.initCanvas(canvasId, sceneParams.canvasLayout);

            //gl.canvas.width = gl.canvas.clientWidth*1.0;
            //gl.canvas.height = gl.canvas.clientHeight*1.0;
            var w = gl.canvas.width;
            var h = gl.canvas.height;
            console.log("SceneUtil w==", w, "h==", h);
            gl.viewport(0, 0, w, h);
            var scene = new Scene();
            scene.gl = gl;

            var camera = CameraUtil.createDefaultCamera(w / h);
            camera.name = "main_camera";
            scene.addCamera(camera);

            var lt = null;
            if (sceneParams.hasLight) {
                var lightPos = null;
                if (sceneParams.lightPos === undefined) {
                    lightPos = new Vector3(5, 5, 5);
                } else {
                    lightPos = sceneParams.lightPos;
                }
                var isPoint = true;
                if (sceneParams.isPoint !== undefined) {
                    isPoint = sceneParams.isPoint;
                }
                lt = LightUtil.createShadowLight(w, h, lightPos, sceneParams.castShadow, isPoint);
                scene.addLight(lt);
                if (sceneParams.castShadow) {
                    scene.addCamera(lt.shadowCam);
                }
                scene.ambientLight = new Vector3(0.3, 0.3, 0.3);
            }
            var skybox = null;
            if (sceneParams.hasSkyBox) {
                skybox = SceneUtil.createSkyBox(scene, { skyBoxPath: sceneParams.skyBoxPath });
                scene.addEntity(skybox);
            }

            return {
                scene: scene, camera: camera, skybox: skybox,
                dirLight: lt, ambientLight: scene.ambientLight
            };

        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-12-13 11:30:29
     * @Description: file content
     */

    class IBLUtil {


       static createCubeCamera(w, h, layer, type) {
          if (type === undefined) {
             type = TextureType.cube;
          }
          var rt = new RenderTexture("Camera", w, h, type);
          if (MDBrowser === "Chrome" || MDBrowser === "Safari") { //todo Texture filter mipmapLINEAR_MIPMAP_NEAREST
             console.log("open float map");
             rt.elType = TextureElemType.float;
          }
          //Browser Campatiblity
          //rt.elType =TextureElemType.float;

          rt.hasMipMap = false;
          var cam = CameraUtil.createDefaultCamera(w / h);
          var n = 0.1;
          cam.setFov(90);
          cam.setNear(n);
          cam.clearColor = [1.0, 0.0, 0.0, 1.0];
          cam.transform.setPosition(0, 0, 0);
          cam.renderTarget = rt;
          cam.renderMask = RenderMask.layers;
          cam.addRenderLayer(layer);
          return cam;
       }


       static createRenderSphere(params, entiParams) {
          var scene = params.scene;
          var envCam = params.envCam;
          var layer = params.layer;
          var pos = params.pos;
          var namePrefix = params.namePrefix;
          var reqCam = params.reqCam;
          if (namePrefix === undefined) {
             namePrefix = "dft";
          }
          if (pos === undefined) {
             pos = new Vector3(0, 0, 0);
          }
          if (layer === undefined || scene === undefined || envCam === undefined) {
             console.log("we need information of layer, scene, envCam");
             return;
          }


          var spName = namePrefix + "entity";
          var sp = SceneUtil.createEntity(scene, spName, entiParams);
          envCam.name = namePrefix + "Cam";
          envCam.renderTarget.name = namePrefix + "Tex";
          sp.material.name = namePrefix + "Mat";
          sp.finishShot = false;
          sp.setRenderLayer(layer);

          sp.transform.setPosition(pos.x, pos.y, pos.z);
          envCam.transform.setPosition(pos.x, pos.y, pos.z);
          var state = { loaded: false, startShot: false };
          // var noTex = false;
          if (sp.material.texList.length === 0) {
             noTex = true;
          }
          //   sp.material.loadedCallBack = function(e){
          //       state.loaded = true;
          //       console.log("material prepared>>>",sp.material.name);
          //   };
          envCam.afterDrawFunc = function (context, entities) {
             var isLoaded = sp.material.texList.length === 0 || sp.material.texPrepared;
             if (isLoaded && envCam.renderTarget.type === TextureType.cube) {
                if (envCam.renderTarget.currentFace === 0) {
                   state.startShot = true;
                   console.log("start take shot >>>", envCam.name);
                }
                var otherReq = true;
                if (reqCam !== undefined) {
                   otherReq = reqCam.finishShot;
                }
                if (otherReq && state.startShot &&
                   envCam.renderTarget.currentFace === 5) {
                   envCam.enable = false;

                   envCam.finishShot = true;
                   envCam.renderTarget.generateMipMap(context);
                   console.log("close camera>>>", envCam.name);
                   if (!MathUtil.isNone(envCam.next)) {
                      envCam.next.enable = true;

                      console.log("open camera>>>", envCam.next.name);
                   }
                   // wait for next
                   state.startShot = false;

                }

             }
             if (isLoaded && envCam.renderTarget.type === TextureType.default) {
                var otherReq2d = true;
                if (reqCam !== undefined) {
                   otherReq2d = reqCam.finishShot;
                }
                if (otherReq2d && state.startShot) {
                   envCam.enable = false;
                   envCam.finishShot = true;

                   console.log("close camera>>>", envCam.name);
                   if (!MathUtil.isNone(envCam.next)) {
                      envCam.next.enable = true;
                      console.log("open camera>>>", envCam.next.name);
                   }
                }
                if (otherReq2d) {
                   state.startShot = true;
                }
             }
          };
          return sp;

       }

       static createRadianceCamera(envMat, smesh, w, h, envLayer, scene) {
          var cubeCam = IBLUtil.createCubeCamera(w, h, envLayer);
          cubeCam.renderTarget.hasMipMap = true;
          scene.addCamera(cubeCam);
          var envSphere = IBLUtil.createRenderSphere(
             { scene: scene, envCam: cubeCam, layer: envLayer, namePrefix: "cube_rad" },
             { mesh: smesh, material: envMat });
          scene.addEntity(envSphere);
          cubeCam.envSphere = envSphere;
          return cubeCam;
       }

    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-02 11:08:31
     * @Description: file content
     */

    class InteractUtil {
        static registerMovehandler(canvas, transform, ranges, moveCallback) {
            var wid = canvas.clientWidth;
            var het = canvas.clientHeight;
            if (ranges === undefined) {
                ranges = [360, 180];
            }
            var res = { sx: -1, sy: -1, px: -1, py: -1, width: wid, height: het, range: ranges, state: -1 };
            canvas.addEventListener("touchmove", function (evt) {
                InteractUtil.responseToTouchRot(evt, transform, 1, res, moveCallback);
            }, false);
            canvas.addEventListener("touchstart", function (evt) {
                InteractUtil.responseToTouchRot(evt, transform, 0, res);
            }, false);
            canvas.addEventListener("touchend", function (evt) {
                InteractUtil.responseToTouchRot(evt, transform, 2, res);
            }, false);

            canvas.addEventListener("mousemove", function (evt) {
                InteractUtil.responseToMouseRot(evt, transform, 1, res, moveCallback);
            }, false);
            canvas.addEventListener("mousedown", function (evt) {
                InteractUtil.responseToMouseRot(evt, transform, 0, res);
            }, false);
            canvas.addEventListener("mouseup", function (evt) {
                InteractUtil.responseToMouseRot(evt, transform, 2, res);
            }, false);
        }

        static responseToMouseRot(
            /**@type {TouchEvent} */ev,
            /**@type {Transform} */tf,
            type, res, moveCallback) {
            switch (type) {
                case 0:// touch start
                    {
                        res.state = 0;
                        res.sx = ev.clientX;
                        res.sy = ev.clientY;
                        res.px = ev.clientX;
                        res.py = ev.clientY;
                    }
                    break;
                case 1: // touch move
                    {
                        if (res.state === 0) {
                            var deltx = (ev.clientX - res.px) / res.width;
                            var delty = (ev.clientY - res.py) / res.height;
                            var ax = deltx * res.range[0];
                            var ay = delty * res.range[1];
                            //console.log(ax);
                            tf.rotate(ay, ax, 0);
                            // 
                            if (moveCallback !== undefined && moveCallback !== null) {
                                moveCallback(tf);
                            }
                            //console.log
                            res.px = ev.clientX;
                            res.py = ev.clientY;
                        }

                    }
                    break;
                case 2:
                    {
                        res.state = 2;
                    }
                    break;
            }

        }

        static responseToTouchRot(
            /**@type {TouchEvent} */ev,
            /**@type {Transform} */tf,
            type, res, moveCallback) {
            var tc = ev.touches[0];

            switch (type) {
                case 0:// touch start
                    {
                        res.sx = tc.clientX;
                        res.sy = tc.clientY;
                        res.px = tc.clientX;
                        res.py = tc.clientY;
                    }
                    break;
                case 1: // touch move
                    {
                        var deltx = (tc.clientX - res.px) / res.width;
                        var delty = (tc.clientY - res.py) / res.height;
                        var ax = deltx * res.range[0];
                        var ay = delty * res.range[1];
                        //console.log(ax);
                        tf.rotate(ay, ax, 0);
                        // 
                        if (moveCallback !== undefined && moveCallback !== null) {
                            moveCallback(tf);
                        }
                        //console.log
                        res.px = tc.clientX;
                        res.py = tc.clientY;
                    }
                    break;
            }

        }

        static registerCameraMove(/**@type {Camera}*/ cam, canvas, moveCallback) {
            cam.transform.rotOrder = RotationOrder.zyx;
            var initPos = new Vector3(cam.transform.pos.x, cam.transform.pos.y, cam.transform.pos.z);
            InteractUtil.registerMovehandler(canvas, cam.transform, [360, 45], function (tf) {
                var r = Math.sqrt(initPos.x * initPos.x + initPos.y * initPos.y + initPos.z * initPos.z);
                var cita = tf.rot.x * Math.PI / 180.0;
                tf.pos.y = -1.0 * r * Math.sin(cita);
                var l = 1.0 * r * Math.cos(cita);
                var cita2 = tf.rot.y * Math.PI / 180.0;
                tf.pos.x = l * Math.sin(cita2);
                tf.pos.z = l * Math.cos(cita2);
                if (!MathUtil.isNone(moveCallback)) {
                    moveCallback(cam.transform);
                }
            });

        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-11-25 11:58:08
     * @Description: file content
     */

    class MacroAsset$1 extends IAsset {
        constructor() {
            super();
            this.urls = [];
            //this.assetsList =[];
            this.loadCount = 0;
            this.res = null;
        }
        loadByHttp(url, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status === 0) {
                        var text = rawFile.responseText;
                        callback(text);
                    }
                }
            };
            rawFile.open("GET", url, true);
            rawFile.send();
        }

        load(url, params, callback) {
            if (url instanceof (Array)) {
                this.urls = url;
            } else {
                this.urls[0] = url;
            }
            this.count = this.urls.length;
            // if (params === undefined) params = new Map();
            params.asset = this;
            var that = this;
            var fload = function (text) {

                //begain to parse
                var parse = new (AssetsManager.getManager().getParser(that.urls[i]));
                var ms = parse.parse(text, params);
                if (that.res === null) {
                    that.res = ms;
                } else {
                    that.res.push.apply(that.res, ms);
                }
                that.count--;
                if (callback !== null && that.count === 0) {
                    callback(that.res);
                }

            };

            for (var i in this.urls) {
                this.loadByHttp(this.urls[i], fload);
            }
        }


    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-08 18:43:05
     * @Description: file content
     */

    class RenderTexture$1 extends Texture$1 {
        constructor(url, width, height, type) {
            super(url, width, height, type);
            this.depthRBuffer = null;
            this.hasColorBuffer = true;
            this.frameBufferId = null;
            this.assitColorBuffers = null;
            this.currentFace = -1;
            this.currentMip = 0;
        }

        loadTexture(/**@type {WebGLRenderingContext} */gl,
            loadCallback) {

            if (!this.hasColorBuffer) {
                var ext = gl.getExtension("WEBGL_depth_texture");
                console.log(ext);
                super.format = "DEPTH_COMPONENT";
                //rbf_format = gl.DEPTH_COMPONENT;
                super.elType = "UNSIGNED_SHORT";
                this.hasMipMap = false;
            } else {
                this.depthRBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);

            }
            //gl.bindRenderbuffer(gl.RENDERBUFFER,0);
            this.frameBufferId = gl.createFramebuffer();
            if (this.elType === TextureElemType.float) {
                gl.getExtension('WEBGL_color_buffer_float');
            }
            this.wrap_mode = TextureWrap.default;
            super.loadTexture(gl, loadCallback);
            this.loadAssitColorBuffers(gl);

        }

        loadAssitColorBuffers(/**@type {WebGLRenderingContext} */gl) {
            if (this.assitColorBuffers !== null) {
                for (var i = 0; i < this.assitColorBuffers.length; i++) {
                    this.assitColorBuffers[i].loadTexture(gl, null);
                }
            }
        }
        uploadColorBuffers(/**@type {WebGLRenderingContext} */gl) {
            var texTarget = gl.TEXTURE_2D;
            if (this.type === TextureType.cube) {
                texTarget = gl.TEXTURE_CUBE_MAP_POSITIVE_X + this.currentFace;
            }

            if (this.assitColorBuffers !== null) {
                var ext = gl.getExtension("WEBGL_draw_buffers");
                gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL, texTarget,
                    this.glTexture, this.currentMip);
                var color_attatchs = [ext.COLOR_ATTACHMENT0_WEBGL];
                for (var i = 0; i < this.assitColorBuffers.length; i++) {
                    var ctex = this.assitColorBuffers[i];
                    var t = i + 1;
                    var colorKey = ext["COLOR_ATTACHMENT" + t + "_WEBGL"];
                    color_attatchs.push(colorKey);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, colorKey, texTarget,
                        ctex.glTexture, this.currentMip);
                    this.onFrameLoaded(ctex);
                }
                ext.drawBuffersWEBGL(color_attatchs);
            } else {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texTarget,
                    this.glTexture, this.currentMip);

            }
        }

        generateMipMap(/**@type {WebGLRenderingContext} */gl) {
            if (this.hasMipMap) {
                var type = gl[this.type];
                gl.bindTexture(type, this.glTexture);
                gl.generateMipmap(type);
                gl.bindTexture(type, null);
                console.log("produce mipmap");
            }
        }
        onFrameLoaded(tex) {
            if (tex.state === LoadState.loading) {
                if (tex.type === TextureType.cube) {
                    if (tex.currentFace === 5) {
                        tex.state = LoadState.loaded;
                        TextureManager.getManager().onTexLoaded(tex);
                    }

                } else {
                    tex.state = LoadState.loaded;
                    TextureManager.getManager().onTexLoaded(tex);
                }

            }
        }

        calRotateFace(/**@type {Camera} */ cam) {
            if (this.currentFace === 5) {
                this.currentFace = -1;
            }
            this.currentFace += 1;
            var rot = new Vector3(0, 0, 0);
            cam.transform.resetRotate(0, 0, 0);
            //default look at negZ
            switch (this.currentFace) {
                case 0: //pox
                    rot.y = 90.0;
                    rot.x = 180.0;
                    break;
                case 1: //nex
                    //rot.y = 180.0;
                    rot.y = -90;
                    rot.x = 180.0;
                    break;
                case 2: //poy
                    //rot.y = 90.0;
                    //rot.x = 90;
                    //rot.y = 180;
                    rot.x = 90;
                    break;
                case 3: //negy
                    //rot.x = -180.0;
                    //rot.y = 180;
                    rot.x = -90;
                    break;
                case 4:// posz
                    //rot.x = 90;
                    //rot.y = 180;
                    rot.z = 180;
                    rot.y = -180.0;
                    break;
                case 5:
                    rot.z = 180;
                    break;
            }
            cam.transform.rotate(rot.x, rot.y, rot.z);
            // cam.transform.rotate(180,-90,0.0);
        }

        updateFBODate(/**@type {WebGLRenderingContext} */gl, cam) {
            if (this.type === TextureType.cube) {
                this.calRotateFace(cam);
            }
            if (this.hasColorBuffer) {
                this.uploadColorBuffers(gl);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT,
                    gl.RENDERBUFFER, this.depthRBuffer);
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            } else {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D,
                    this.glTexture, 0);
            }
            this.onFrameLoaded(this);

        }
    }

    /*
     * @Author: Sophie
     * @email: bajie615@126.com
     * @Date: 2020-02-18 17:17:07
     * @Description: file content
     */
    class ShaderLayer {
        constructor() {
            this.passList = [];
        }

    }

    exports.Asset = Asset;
    exports.AssetsManager = AssetsManager$1;
    exports.AttributeType = AttributeType;
    exports.Camera = Camera;
    exports.CameraType = CameraType;
    exports.CameraUtil = CameraUtil;
    exports.CanvasUtil = CanvasUtil;
    exports.ClearMask = ClearMask;
    exports.DefaultUniformKey = DefaultUniformKey;
    exports.DirectionLight = DirectionLight;
    exports.Entity = Entity;
    exports.GridMesh = GridMesh$1;
    exports.IAsset = IAsset;
    exports.IBLUtil = IBLUtil;
    exports.ImgLoader = ImgLoader;
    exports.InteractUtil = InteractUtil;
    exports.Light = Light;
    exports.LightUtil = LightUtil;
    exports.MacroAsset = MacroAsset$1;
    exports.Material = Material;
    exports.MaterialAni = MaterialAni;
    exports.MaterialUtil = MaterialUtil;
    exports.MathUtil = MathUtil;
    exports.Mesh = Mesh$1;
    exports.MeshUtil = MeshUtil;
    exports.Pass = Pass;
    exports.PassLayer = PassLayer;
    exports.PointLight = PointLight;
    exports.PrimitiveType = PrimitiveType$1;
    exports.Program = Program;
    exports.ProgramInfo = ProgramInfo;
    exports.Render = Render;
    exports.RenderInfo = RenderInfo;
    exports.RenderLayer = RenderLayer;
    exports.RenderMask = RenderMask;
    exports.RenderTexture = RenderTexture$1;
    exports.RotationOrder = RotationOrder;
    exports.Scene = Scene;
    exports.SceneUtil = SceneUtil;
    exports.ShaderLayer = ShaderLayer;
    exports.ShaderOption = ShaderOption;
    exports.SubPass = SubPass;
    exports.Texture = Texture$1;
    exports.TextureBlend = TextureBlend;
    exports.TextureManager = TextureManager$1;
    exports.Transform = Transform;
    exports.TransformAni = TransformAni;
    exports.UTypeEnumn = UTypeEnumn$1;
    exports.ValueAni = ValueAni;
    exports.Vector3 = Vector3;
    exports.Vector4 = Vector4;
    exports.VertexBuffer = VertexBuffer;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
