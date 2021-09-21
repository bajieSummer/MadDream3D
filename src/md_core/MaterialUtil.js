/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-25 12:48:36
 * @Description: file content
 */

import { Vector3, Vector4, MathUtil } from "./MathUtil";
import { Material } from "./Material";
import { UTypeEnumn } from "./Program";
import { TextureBlend } from "./Texture";

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

        } else {
            //no light
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
            mat.setUniform("texture0", UTypeEnumn.texture, tex0);
            mat.addTexture(tex0);
            shaderOps.useUV = true;

        } else if (!MathUtil.isNone(shaderOps.matColor)) {
            mat.setUniform("matColor", UTypeEnumn.Vec4, shaderOps.matColor);
        }
        if (!MathUtil.isNone(shaderOps.calIBLSpec)) {
            mat.setUniform("roughness", UTypeEnumn.float, shaderOps.roughness);
        }
        if (!MathUtil.isNone(shaderOps.calBrdf)) {
            shaderOps.useUV = true;
        }
        if (!MathUtil.isNone(shaderOps.hdrExposure)) {
            mat.setUniform("hdrExposure", UTypeEnumn.float, shaderOps.hdrExposure);
        }
        if (!MathUtil.isNone(shaderOps.normalMap)) {
            //var urln = shaderOps.normalMap;
            //var texn = new Texture(urln);
            var texn = MaterialUtil.createTextureFromOps(shaderOps.normalMap);
            // texn.wrap_mode = TextureWrap.repeat;
            mat.setUniform("normalMap", UTypeEnumn.texture, texn);
            mat.addTexture(texn);
            shaderOps.useUV = true;

        } else if (!MathUtil.isNone(shaderOps.modelNormalMap)) {
            var urlmn = shaderOps.modelNormalMap;
            var texmn = new Texture(urlmn);
            mat.setUniform("modelNormalMap", UTypeEnumn.texture, texmn);
            mat.addTexture(texmn);
            shaderOps.useUV = true;
        }
        if (!MathUtil.isNone(shaderOps.cubeMap) || !MathUtil.isNone(shaderOps.envMap)) {
            var urlc = shaderOps.cubeMap || shaderOps.envMap;
            var texc = MaterialUtil.createTextureFromOps(urlc, TextureType.cube);
            mat.setUniform("cubeMap", UTypeEnumn.texture, texc);
            //texc.hasMipMap = true;
            mat.addTexture(texc);
        }
        if (!MathUtil.isNone(shaderOps.rectSphereMap)) {
            var urectM = shaderOps.rectSphereMap;
            var rectmp = MaterialUtil.createTextureFromOps(urectM);
            mat.setUniform("rectSphereMap", UTypeEnumn.texture, rectmp);
            mat.addTexture(rectmp);
            shaderOps.useUV = true;
        }

        if (!MathUtil.isNone(shaderOps.reflective)) {
            mat.setUniform("reflective", UTypeEnumn.float, shaderOps.reflective);
        }
        if (!MathUtil.isNone(shaderOps.refractParams)) {
            mat.setUniform("refractParams", UTypeEnumn.Vec2, shaderOps.refractParams);
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
            mat.setUniform("texture1", UTypeEnumn.texture, tex1);
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
            mat.setUniform("texture_brighter", UTypeEnumn.texture, tbr);
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
                mat.setUniform("density", UTypeEnumn.float, fogExp.density);
                mat.setUniform("fogColor", UTypeEnumn.Vec3, fogExp.fogColor);
            } else {
                var start = 1.0;
                var end = 20.0;
                var fogColor = [1.0, 1.0, 1.0];
                if (!MathUtil.isNone(shaderOps.fogLinear)) {
                    start = shaderOps.fogLinear.start;
                    end = shaderOps.fogLinear.end;
                    fogColor = shaderOps.fogLinear.fogColor;
                }
                mat.setUniform("fogLinear", UTypeEnumn.Vec2, [start, end]);
                mat.setUniform("fogColor", UTypeEnumn.Vec3, fogColor);
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
            mat.setUniform("aoMap", UTypeEnumn.texture, trao);
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
                mat.setUniform("roughMap", UTypeEnumn.texture, trh);
                mat.addTexture(trh);
                shaderOps.useUV = true;
            }
            var roughness = 1.0;
            if (!MathUtil.isNone(shaderOps.roughness)) {
                roughness = shaderOps.roughness;
            }
            mat.setUniform("roughness", UTypeEnumn.float, roughness);

            if (!MathUtil.isNone(shaderOps.metalMap)) {
                var tmt = null;
                if (shaderOps.metalMap instanceof (Texture)) {
                    tmt = shaderOps.metalMap;
                } else {
                    var urlmt = shaderOps.metalMap;
                    tmt = new Texture(urlmt);
                }
                mat.setUniform("metalMap", UTypeEnumn.texture, tmt);
                mat.addTexture(tmt);
                shaderOps.useUV = true;
            }
            var metalness = 1.0;
            if (!MathUtil.isNone(shaderOps.metalness)) {
                metalness = shaderOps.metalness;
            }
            mat.setUniform("metalness", UTypeEnumn.float, metalness);
            if (!MathUtil.isNone(shaderOps.irradianceMap)) {
                var irdtex = MaterialUtil.createTextureFromOps(shaderOps.irradianceMap, TextureType.cube);
                mat.setUniform("irradianceMap", UTypeEnumn.texture, irdtex);
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
                mat.setUniform("radianceMap", UTypeEnumn.texture, rdtex);
                mat.addTexture(rdtex);

                if (rdtex.state === LoadState.loaded) {
                    var maxMipCount = rdtex.getMipCount();
                    mat.setUniform("MAX_MIPCOUNT", UTypeEnumn.float, maxMipCount);
                } else {
                    rdtex.onLoadedCalls.push(function (tex) {
                        var maxMipCount = rdtex.getMipCount();
                        mat.setUniform("MAX_MIPCOUNT", UTypeEnumn.float, maxMipCount);
                    });
                }

                if (!MathUtil.isNone(shaderOps.lutMap)) {
                    var lutTex = MaterialUtil.createTextureFromOps(shaderOps.lutMap);
                    mat.setUniform("lutMap", UTypeEnumn.texture, lutTex);
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
            mat.setUniform("heightMap", UTypeEnumn.texture, hmt);
            mat.addTexture(hmt);
            shaderOps.useUV = true;
        }

        if (!MathUtil.isNone(shaderOps.uvTran)) {
            mat.setUniform("uvTran", UTypeEnumn.Vec4, shaderOps.uvTran);
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
        if (type === TextureType.cube) {
            // imts.cubeMapHint = ["POSITIVE_X","NEGATIVE_X","POSITIVE_Y","NEGATIVE_Y","POSITIVE_Z",
            // "NEGATIVE_Z"];
        }
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
            mat.setUniform(key + ".light.diffuse", UTypeEnumn.Vec3,
                [lcolor.x, lcolor.y, lcolor.z]);
            var dir4 = new Vector4(-1.0 * dir.x, -1.0 * dir.y, -1.0 * dir.z, 0.0);
            dir4 = MathUtil.vec4MultiMatrix(dir4, viewM);
            //console.log("lightDirection",dir4);
            mat.setUniform(key + ".direction", UTypeEnumn.Vec3,
                [dir4.x, dir4.y, dir4.z]);
            if (!mat.shaderOption.PBR && !MathUtil.isNone(mat.shaderOption.specular) &&
                !MathUtil.isNone(lightDiff.specular)) {
                var specu = MathUtil.multiplyV3(lightDiff.specular, mat.shaderOption.specular);
                mat.setUniform(key + ".light.specular", UTypeEnumn.Vec3, [specu.x, specu.y, specu.z]);
                mat.setUniform(key + ".light.shininess", UTypeEnumn.float, mat.shaderOption.shininess);
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
            mat.setUniform(key + ".position", UTypeEnumn.Vec3,
                [dir4.x, dir4.y, dir4.z]);
            mat.setUniform(key + ".params", UTypeEnumn.Vec3, [lightDiff.constant, lightDiff.linear, lightDiff.quadratic]);
            var lcolor = MathUtil.multiplyV3(lightDiff.color, mat.shaderOption.diffuse);
            mat.setUniform(key + ".light.diffuse", UTypeEnumn.Vec3,
                [lcolor.x, lcolor.y, lcolor.z]);
            if (!mat.shaderOption.PBR && !MathUtil.isNone(mat.shaderOption.specular) &&
                !MathUtil.isNone(lightDiff.specular)) {
                var specu = MathUtil.multiplyV3(lightDiff.specular, mat.shaderOption.specular);
                mat.setUniform(key + ".light.specular", UTypeEnumn.Vec3, [specu.x, specu.y, specu.z]);
                mat.setUniform(key + ".light.shininess", UTypeEnumn.float, mat.shaderOption.shininess);
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
            mat.setUniform(key, UTypeEnumn.Mat4, value);
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
            mat.setUniform("ambientLight", UTypeEnumn.Vec3,
                [scene.ambientLight.x, scene.ambientLight.y, scene.ambientLight.z]);

            var mInv = entityTrans.getDerivInvTranMatrix();
            var vInv = camera.transform.getDerivTranMatrix();
            var nM = MathUtil.getNormalMatrixArr(mInv, vInv);
            mat.setUniform("normalMatrix", UTypeEnumn.Mat4, nM);

        }

    }

}

export { MaterialUtil }