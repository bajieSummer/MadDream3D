/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 12:39:57
 * @Description: file content
 */
var  DefaultUniformKey={
    projectionMatrix:"projectionMatrix",
    modelViewMatrix:"modelViewMatrix"
};

function UniTypeInfo(loc,
    /** @type {UTypeEnumn} */utype){
   this.loc = loc;
   /** @type {UTypeEnumn} */
   this.utype = utype;
   this.value = null;
}

function ShaderOption(){
    this.vertexColor = null;
    this.texture0 = null;
    this.depthTest = true;
    this.depthWrite = true;
    this.enableCull = true;
    this.cullFace = "BACK";
    this.castShadow = false;
    this.receiveShadow = false;
    this.uniformsToUp ={};
    this.useUV = false;
    this.IBL =false;
}

var AttributeType ={
    vertexPos:true
}

function AttributesInfo(){
    this.vertexPos = -1;
    this.vertexColor =-1;
    this.uv = -1;
    this.vertexNormal = -1;
    this.vertexTangent =-1;
}

var  UTypeEnumn={
    Mat4 : "uniformMatrix4fv",
    Mat3 : "uniformMatrix3fv",
    Vec4 : "uniform4fv",
    Vec3 : "uniform3fv",
    Vec2 : "uniform2fv",
    float: "uniform1f",
    texture: "uniform1i",
    vec2i:"uniform2iv",
    vec3i:"uniform3iv",
    vec4i:"uniform4iv"

};

function UniformsInfo(){
    /** @type {UniTypeInfo} */
    this.projectionMatrix = new UniTypeInfo(null,UTypeEnumn.Mat4);
    this.modelViewMatrix = new UniTypeInfo(null,UTypeEnumn.Mat4);
}

function ProgramInfo(/**@type {WebGLProgram}*/program,
        /**@type {AttributesInfo} */
        attribLocations,
        /**@type {UniformsInfo} */
        uniformLocations,
        /**@type {UniformsInfo} */shaderOps){
    this.program = program;
     /**@type {AttributesInfo} */
    this.attribLocations = attribLocations;
     /**@type {UniformsInfo} */
    this.uniformLocations = uniformLocations;
    /**@type {ShaderOption} */
    this.shaderOption = shaderOps;

}

class Program{
    constructor(/** @type {WebGLRenderingContext}*/ gl,
        vsSource,fsSource,
         /**@type {ShaderOption}*/shaderOps){
        // this.pAttrList=["vertexPos","vertexColor"],
        // this.pUniList={projectionMatrix:UTypeEnumn.Mat4,
        //     modelViewMatrix:UTypeEnumn.Mat4};
        this.gl = gl;
        // this.vsSource = vsSource;
        // this.fsSource = fsSource;
        /**@type {WebGLProgram} */
        this.shaderProgram = Program.initialShaderProgram(gl,vsSource,fsSource);
        /**@type {ProgramInfo} */
        this.programInfo = Program.createProgramInfo(gl,this.shaderProgram,shaderOps);
    }

    updateUniform(key,/** @type {UTypeEnumn}*/type,
        value){
            var uni = this.programInfo.uniformLocations[key];
            if (uni === undefined){
                var loc = this.gl.getUniformLocation(this.shaderProgram,key);
                if(loc !== (-1&&null&&undefined)){
                    this.programInfo.uniformLocations[key] = new UniTypeInfo(loc,type);
                    this.programInfo.uniformLocations[key].value = value;
                    return true;
                }else{
                    console.warn("there is no "+key+"in the complied shader ");
                    return false;
                }   
            }
            uni.value = value;
            return true;
    }

    static loadShader(/** @type {WebGLRenderingContext} */gl,
        type,source){
        const shader = gl.createShader(type);
        gl.shaderSource(shader,source);
        //console.log(source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            var info = gl.getShaderInfoLog(shader);
            alert("shader complier error type = "+type+" info="+info);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    
    static initialShaderProgram(/** @type {WebGLRenderingContext} */gl,
        vsSource,fsSource){
        const vs = Program.loadShader(gl,gl.VERTEX_SHADER,vsSource);
        if(vs ===null){
            console.error("vertex shader got something wrong",vsSource);
        }
        const fs = Program.loadShader(gl,gl.FRAGMENT_SHADER,fsSource);
        if(fs ===null){
            console.error("fragment shader got something wrong",fsSource);
        }
        const shaderProgram = gl.createProgram();
       // console.log("vertexShader::>>",vsSource);
        console.log("fragmentShader::>>",fsSource);
        gl.attachShader(shaderProgram,vs);
        gl.attachShader(shaderProgram,fs);
        gl.linkProgram(shaderProgram);
        if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
            alert("unable to initialize the shader program:"+gl.getProgramInfoLog(shaderProgram));
            // why not delete program ??
            gl.deleteProgram(shaderProgram);
            return null;
        }
        return shaderProgram;
    }
    


    static createProgramInfo(/**@type {WebGLRenderingContext}*/gl,
        shaderProgram,
        /**@type {ShaderOption}*/shaderOps
        ){
        var attributes = new AttributesInfo();
        for(var attr in attributes){
           // if(shaderOps[attr] !==false){
                var loc =gl.getAttribLocation(shaderProgram,attr);
                if(loc!== -1 && loc !== null &&loc!== undefined){
                    attributes[attr] = loc;
                }
                
           //}
        }
        var uniforms = new UniformsInfo();
        for (var uni in uniforms){
            //if(shaderOps[uni] !==false){
                var uloc = gl.getUniformLocation(shaderProgram,uni);
                if(uloc!== -1 && uloc !== null &&uloc!== undefined){
                    uniforms[uni].loc = uloc;
                }
            //}
        }
        var programInfo = new ProgramInfo(shaderProgram,attributes,uniforms,shaderOps);
        return programInfo;
    }
}