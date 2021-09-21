/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-08 18:43:05
 * @Description: file content
 */

import { Vector3, Vector4 } from "./MathUtil";
import { Texture } from "./Texture";

class RenderTexture extends Texture {
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
            var ext2 = gl.getExtension('WEBGL_color_buffer_float');
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

export { RenderTexture }