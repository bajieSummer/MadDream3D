/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-19 14:07:05
 * @Description: file content
 */

import { ShaderOption, UTypeEnumn, Program } from "./Program";
import { MathUtil } from "./MathUtil";
import { PassLayer } from "./Pass";
import { CameraType } from "./Camera";
import { LoadState } from "./Texture";


function MatUni(/**@type {string}*/key,
    /**@type {UTypeEnumn}*/type,
    value) {
    this.key = key;
    this.type = type;
    this.value = value;
    this.dirty = true;
}

class TextureManager {
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
        if (TextureManager.manager === null) {
            TextureManager.manager = new TextureManager();
        }
        return TextureManager.manager;
    }
}
TextureManager.manager = null;

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
        var that = this;
        for (var i in this.texList) {
            /**@type {Texture} */
            var tex = this.texList[i];
            //tex.bindDefaultColor(gl,1.0,1.0,1.0,1.0);
            if (tex.state === LoadState.init) {
                tex.loadTexture(gl, function (
                    /** @type {Texture} */tex) {
                    // that.uDirty = true;
                    TextureManager.getManager().onTexLoaded(tex);
                });
            }
        }
    }

    addTexture(tex) {
        var manager = TextureManager.getManager();
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
        this.setUniform(dkey, UTypeEnumn.texture,
            light.shadowCam.renderTarget);
        this.addTexture(light.shadowCam.renderTarget);
        var pkey = "biasStep[" + t + "]";
        this.setUniform(pkey, UTypeEnumn.Vec2, [light.shadowBias, light.shadowSmoothStep]);

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

export { TextureManager, Material }