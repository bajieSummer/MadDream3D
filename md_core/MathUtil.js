/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 12:34:02
 * @Description: file content
 */
function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
  return "Chrome";
 }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
 }
 var MDBrowser = myBrowser();

var MADDREAM  = window.MADDREAM||{};
/**@class
 * namespace for maddream
 * short version of MADDREAM
 */
var MDDM = MADDREAM;
var Epsilon = 0.0000000001;
function Vector4(x,y,z,w){
    
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    Vector4.prototype.copyFrom = function(vec4){
        
        this.x = vec4.x;
        this.y = vec4.y;
        this.z = vec4.z;
        this.w = vec4.w;
    }
}

function Vector3(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    Vector3.prototype.copyFrom = function(vec3){
        this.x = vec3.x;
        this.y = vec3.y;
        this.z = vec3.z;
    };
    Vector3.prototype.dot = function(vec3){
        return this.x*vec3.x + this.y*vec3.y +this.z*vec3.z;
    };
    Vector3.prototype.sub = function(vec3){
        return new Vector3(this.x-vec3.x, this.y-vec3.y, this.z-vec3.z);
    };
    Vector3.prototype.cross = function(right){
        var returnValue = new Vector3();
        returnValue.x = this.y * right.z - this.z * right.y;
        returnValue.y = this.z * right.x - this.x * right.z;
        returnValue.z = this.x * right.y - this.y * right.x;
        return returnValue;
    };
    Vector3.prototype.length = function(){
        return Math.sqrt(this.x*this.x + this.y*this.y +this.z*this.z);
    }
    Vector3.prototype.normalize = function(){
        var len = this.length();
        this.x = this.x/len;
        this.y = this.y/len;
        this.z = this.z/len;
    }
}

class MathUtil{
    static transposeArr(arr){
        return [arr[0],arr[4],arr[8],arr[12],
                arr[1], arr[5],arr[9],arr[13],
                arr[2], arr[6],arr[10],arr[14],
                arr[3],arr[7],arr[11],arr[15]];
    }


    static rotX(cita){
        var ra = cita*math.pi/180.0;
        var cosrc = math.cos(ra);
        var sinrc = math.sin(ra);
        var mat = math.matrix(
            [[1.0,  0,  0,    0],
             [0, cosrc,-sinrc,0],
             [0, sinrc,cosrc, 0],
             [0, 0,    0,     1]]);
        return mat;
    }

    static rotY(cita){
        var ra = cita*math.pi/180.0;
        var cosrc = math.cos(ra);
        var sinrc = math.sin(ra);
        var mat = math.matrix(
            [[cosrc,  0,  sinrc,   0],
             [0,      1,  0,       0],
             [-sinrc,  0, cosrc,   0],
             [0,       0,    0,    1]]);
        return mat;
    }

    static rotZ(cita){
        var ra = cita*math.pi/180.0;
        var cosrc = math.cos(ra);
        var sinrc = math.sin(ra);
        var mat = math.matrix(
            [[cosrc,  -sinrc,  0,  0],
             [sinrc,   cosrc,  0,   0],
             [0,       0,    1.0,  0],
             [0,       0,    0,     1]]);
        return mat;
    }

    static scale(x,y,z){
        var mat = math.matrix(
            [[x,  0,  0,  0],
             [0,  y,  0,  0],
             [0,  0,  z,  0],
             [0,  0,  0,  1]]);
        return mat;
    }
    static translate(x,y,z){
        var mat = math.matrix(
            [[1.0,  0,  0,  x],
             [0,  1.0,  0,  y],
             [0,  0,  1.0,  z],
             [0,  0,  0,  1]]);
        return mat;
    }

    static isPowerOf2(value){
        return (value & (value-1)) === 0;
    }

    static getLength(vec3,y,z){
        if(vec3 instanceof(Vector3)){
            return math.sqrt(vec3.x*vec3.x+vec3.y*vec3.y+vec3.z*vec3.z);
        }else if(typeof(vec3) == "number"){
            return math.sqrt(vec3*vec3+y*y+z*z);
        }else if(vec3 instanceof(Vector4)){
            return math.sqrt(vec3.x*vec3.x+vec3.y*vec3.y+vec3.z*vec3.z +vec3.w*vec3.w);
        }
    }

    static normalize(vec3){
        var len = this.getLength(vec3);
        if(len<Epsilon){
            console.warn("warning: two small");
        }
        return new Vector3(vec3.x/len,vec3.y/len,vec3.z/len);
    }
    static multiplyV3(vec1,vec2){
        if(vec1 instanceof(Vector3) && vec2 instanceof(Vector3)){
            return new Vector3(vec1.x*vec2.x,vec1.y*vec2.y,vec1.z*vec2.z);
        }{
            console.error("multiplyV3, parameter not Vector3");
            return null;
        }
        
    }
    static V3MultiNum(vec3,num){
        if(vec3 instanceof(Vector3) && typeof(num)==="number"){
            return new Vector3(vec3.x*num,vec3.y*num,vec3.z*num);
        }{
            console.error("V3MutilNum, unidentified parameters",vec3,num);
            return null;
        }
        
    }
    static V3ADDV3(args){
        var res = new Vector3(0,0,0);
        for(var i = 0; i < arguments.length; i++){
            if(arguments[i] instanceof Vector3){
                res.x +=arguments[i].x;
                res.y +=arguments[i].y;
                res.z +=arguments[i].z;
            }else{
                console.error("V3ADDV3, unsupported parameters",V1,V2);
                return null;
            }
        }
        return res;
    }
    static V3SubV3(V1,V2){
        if(V1 instanceof Vector3 && V2 instanceof Vector3){
            return new Vector3(V1.x-V2.x,V1.y-V2.y,V1.z-V2.z);
        }
        console.error("V3SubV3, unsupported parameters",V1,V2);
        return null;

    }
    static multiplyMat(mat1,mat2){
        return math.multiply(mat1,mat2);
    }

    static vec3ToArr(vec3){
        return new Float32Array([vec3.x,vec3.y,vec3.z]);
    }

    static mat2Arr(matrix){
        return new Float32Array(
             math.flatten(
                 math.transpose(matrix)._data));
     }

    static vec3MultiMat4(vec3,mat,w){
        if(w==undefined){
            w =1.0;
        }
        var p = math.matrix([[vec3.x],[vec3.y],[vec3.z],[w]]);
        var rep  = math.flatten(math.multiply(mat,p));
        return new Vector4(rep._data[0],rep._data[1],rep._data[2],rep._data[3]);
        
    } 
    static vec4MultiMatrix(vec4,mat){
         var p = math.matrix([[vec4.x],[vec4.y],[vec4.z],[vec4.w]]);
         var rep  = math.flatten(math.multiply(mat,p));
         return new Vector4(rep._data[0],rep._data[1],rep._data[2],rep._data[3]);
    }

    static getNormalMatrixArr(/**@type{Matrix} */modelInv,
        /**@type{Matrix} */viewInv){
            // normalMatrix = vM.inv.T = (M.inv*V.Inv).T
            return MathUtil.mat2Arr(
                math.transpose(math.multiply(modelInv,viewInv)));
        
    }

    static isNone(a){
        if(a===null || a===undefined){
            return true;
        }
    }

    static bucketSortDict(arr,elementFunc,max,min){
        var buckets = [];
        var ndict = {};
        var size = max -min +1;
        for (var i=0; i<size; i++){
            buckets[i] = 0;
        }
        for(var j=0; j<arr.length; j++){
            var m = arr[j];
            var elemval = elementFunc(m);
            if(elemval >max){
                console.error("the value excede the maxmum");
                return null;
            }
            if( buckets[elemval] !==0){
                buckets[elemval].push(m);
            }else{
                buckets[elemval] = [m];
            }
        }
        for(var k =0; k<size;k++){
            if(buckets[k]!==0){
                ndict[k] = buckets[k];
            }
        }
        return ndict;
        
    }

    static bucketSort(arr,elementFunc,max,min){
        var buckets = [];
        var newArr = [];
        var size = max -min +1;
        for (var i=0; i<size; i++){
            buckets[i] = 0;
        }
        for(var j=0; j<arr.length; j++){
            var m = arr[j];
            var elemval = elementFunc(m);
            if(elemval >max){
                console.error("the value excede the maxmum");
                return null;
            }
            if( buckets[elemval] !==0){
                buckets[elemval].push(m);
            }else{
                buckets[elemval] = [m];
            }
        }
        for(var k =0; k<size;k++){
            if(buckets[k]!==0){
                for(var t=0; t<buckets[k].length; t++){
                    newArr.push(buckets[k][t]);
                }
            }
        }
        return newArr;
    }

    
}