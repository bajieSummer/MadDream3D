/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-18 23:46:31
 * @Description: file content
 */
var PrimitiveType = {
    TriangularStrip:0,
    Point:1,
    LineStrip:2,
    LineLoop:3,
    Triangular:4,
    TriangularFan:5

};
class Mesh{
    constructor(
        ){
        this.vertexPos = null;
        this.vertexColor = null;
        this.vertexIndices = null;
        this.vertexNormal = null;
        this.vertexTangent = null;
        this.uv = null;
        this.vertexCount = 0;
        this.primitiveType = PrimitiveType.TriangularStrip;
        /**@type {VertexBufferInfo} */
        this.vertexBufferInfo = null;
        this.dirty = true;
        this.stateDirty = true;
        this.posDirty = false;
    }
    setPrimitiveType(/**@type {PrimitiveType} */type){
        this.primitiveType = type;
        this.stateDirty = true;
    }
    updateStates(/**@type {WebGLRenderingContext} */gl){
        if(this.stateDirty){
            //update states:
            var glPrimitive = Mesh.switchToGLPrimType(gl,this.primitiveType);
            this.vertexBufferInfo.primitiveType = glPrimitive;
            this.stateDirty = false;
        }
    }
    updateVertexPosByIndex(i,pos){
        this.vertexPos[i] = pos;
        this.posDirty = true;
    }
    updateAllVertexPos(pos){
        this.vertexPos = pos;
        this.vertexCount = pos.length/3;
        this.posDirty = true;
    }
    update(/**@type {WebGLRenderingContext} */gl){
        if(this.posDirty){
            var bid = this.vertexBufferInfo.vertexPos.id;
            gl.bindBuffer(gl.ARRAY_BUFFER,bid);
           // console.log(gl.getError());
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexPos),gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,null);
            //console.log(gl.getError());
            this.posDirty = false;
        }
        if(this.dirty){
            delete this.vertexBufferInfo;
            this.vertexBufferInfo = VertexBuffer.initVertexBuffer(
                gl,this.vertexCount);
            AttributeType = {};
            if(this.vertexPos !== null){
                VertexBuffer.addPos(gl,this.vertexBufferInfo,
                    this.vertexPos);
            }
            if(this.vertexColor !== null){
                VertexBuffer.addColor(gl,this.vertexBufferInfo,
                    this.vertexColor);
            }
            if(this.uv !== null){
                VertexBuffer.addInfoToVB(gl,this.vertexBufferInfo,
                    this.uv,"uv",gl.FLOAT,gl.ARRAY_BUFFER);
        
            }
            if(this.vertexNormal!== null){
                VertexBuffer.addInfoToVB(gl,this.vertexBufferInfo,this.vertexNormal,"vertexNormal",
                gl.FLOAT,gl.ARRAY_BUFFER);
                
            }
            if(this.vertexIndices !== null){
                VertexBuffer.addIndices(gl,this.vertexBufferInfo,
                    this.vertexIndices);
            }
            if(this.vertexTangent !== null){
                VertexBuffer.addInfoToVB(gl,this.vertexBufferInfo,this.vertexTangent,"vertexTangent",
                gl.FLOAT,gl.ARRAY_BUFFER);
            }
 
            this.updateStates(gl);
            this.dirty = false;
        }
    }

    getVertexBufferInfo(/**@type {WebGLRenderingContext} */gl){
        this.update(gl);
        this.updateStates(gl);
        return this.vertexBufferInfo;
    }

    static switchToGLPrimType(
        /**@type {WebGLRenderingContext}*/ gl,
        pType){
        var gType = gl.TRIANGLE_STRIP;
        switch(pType){
            case PrimitiveType.TriangularStrip:
                break;
            case PrimitiveType.LineStrip:
                gType = gl.LINE_STRIP;
                break;
            case PrimitiveType.LineLoop:
                gType = gl.LINE_LOOP;
                break;
            case PrimitiveType.Triangular:
                gType = gl.TRIANGLES;
                break;
            case PrimitiveType.TriangularFan:
                gType = gl.TRIANGLE_FAN;
                break;
            case PrimitiveType.Point:
                gType = gl.POINTS;
                break;
        }
        return gType;
    }

    static createFromArray(vertexNums,posArr,
        colorArr=null){
        var mesh = new Mesh();
        mesh.vertexCount = vertexNums;
        mesh.vertexPos = posArr;
        mesh.vertexColor = colorArr;
        return mesh;
    }



}