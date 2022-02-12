/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 12:58:35
 * @Description: file content
 */
import { UTypeEnumn } from "./Program";
import { Vector3, Vector4 } from "./MathUtil";

import { LoadState } from "./Texture";

export const RenderMask = {
    everything: 0,
    layers: 1,
    nothing: 2
};

export const RenderLayer = {
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
            if (sBufinfo !== (null || undefined) && programInfo.shaderOption[attr] !== false) {
                if (programInfo.attribLocations[attr] === -1 ||
                    programInfo.attribLocations[attr] === null ||
                    sBufinfo === null) {

                } else {
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

            } else {
                //console.error("error binding : there is no"+attr+" in vertex Buffer");
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
            if (utype === UTypeEnumn.Mat3 || utype === UTypeEnumn.Mat4) {
                gl[utype](uniL.loc, false, uniVal);
                //todo problem  some smaller picture may get loaded faster, but texInd????
            } else if (utype === UTypeEnumn.texture) {
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
        if (indices !== (null && undefined) && indices.id !== (null && undefined)) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.id);
            gl.drawElements(buffers.primitiveType, vertexCount * indices.perVertexSize, indices.type, 0);
        } else {
            gl.drawArrays(buffers.primitiveType, 0, vertexCount);
        }

    }
}

export { RenderInfo, Render }