/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 13:03:20
 * @Description: file content
 */
function SingleBufferParam(
    /**@type {WebGLBuffer}*/id,
    type,perVertexSize)
{
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
class VertexBuffer{
    static createBufferParam( 
        /**@type {WebGLRenderingContext} */gl,
        /**@type {Array}*/Arr,
        vertexCount,
        vType,
        bufType){
            var bufId = gl.createBuffer();
            gl.bindBuffer(bufType,bufId);
            var glArr = null;
            if(vType === gl.FLOAT){
                glArr = new Float32Array(Arr);
                
            }else if(vType === gl.UNSIGNED_SHORT){
               glArr = new Uint16Array(Arr);
            }else{
                console.error("createBufferParam:error:unspported vertex type:",type);
                return null;
            }
            gl.bufferData(bufType,glArr,gl.STATIC_DRAW);
            var vertexNums = Arr.length/vertexCount;
            return new SingleBufferParam(bufId,vType,vertexNums);
        }
    
    static addInfoToVB(/**@type {WebGLRenderingContext} */gl,
        /**@type {VertexBufferInfo}*/vBInfo,
        /**@type {Array}*/Arr,
        /**@type {string}*/key,
        vType,bufType){
            if(Arr instanceof(Array)){
                AttributeType[key] = true;
                vBInfo[key] = VertexBuffer.createBufferParam(gl,
                    Arr,vBInfo.vertexCount,vType,bufType);
                return true;
            }else{
                console.log("addInfoToVB error: infoName="+key," Arr type should be Array not",typeof(Arr));
                return false;
            }

        }

    static addPos(/**@type {WebGLRenderingContext} */gl,
        /**@type {VertexBufferInfo}*/vBInfo,
        /**@type {Array}*/posArr){
            return VertexBuffer.addInfoToVB(gl,vBInfo,
                posArr,"vertexPos",gl.FLOAT,gl.ARRAY_BUFFER);
        }

    static addColor(/**@type {WebGLRenderingContext} */gl,
         /**@type {VertexBufferInfo}*/vBInfo,
         /**@type {Array}*/colorArr){
            return VertexBuffer.addInfoToVB(gl,vBInfo,
                colorArr,"vertexColor",gl.FLOAT,gl.ARRAY_BUFFER);

    }

    static addIndices(/**@type {WebGLRenderingContext} */gl,
        /**@type {VertexBufferInfo}*/vBInfo,
         /**@type {Array}*/indicesArr){
            return VertexBuffer.addInfoToVB(gl,vBInfo,
                indicesArr,"vertexIndices",gl.UNSIGNED_SHORT,gl.ELEMENT_ARRAY_BUFFER);
        }


    static initVertexBuffer(
        /**@type {WebGLRenderingContext} */gl,
        vertexCount,
        primitiveType){
            var vertBuffInfo = new VertexBufferInfo();
            vertBuffInfo.vertexCount = vertexCount;
            if(primitiveType === null){
                vertBuffInfo.primitiveType = gl.TRIANGLE_STRIP;
            }else{
                vertBuffInfo.primitiveType = primitiveType;
            }
            /**@type {VertexBufferInfo}*/
            return vertBuffInfo;
    }
}
