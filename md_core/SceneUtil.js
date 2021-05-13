/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-15 19:41:01
 * @Description: file content
 */
class SceneUtil{

    static createSkyBox(scene,params){
        if(params === undefined){
            params = {};
        }
        if(params.skyBoxPath === undefined){
            params.skyBoxPath = "../pics/cube/bridge/";
        }
        if(params.extension === undefined){
            params.extension = ".jpg";
        }
        params.depthTest = true;
        params.depthWrite = true;
        params.receiveLight = false;
        params.receiveShadow = false;
        params.cullFace = "FRONT";
       
        var mesh = MeshUtil.createBox(90,90,90);
       //var mesh = MeshUtil.createSphere(50,20,20);
        var pf = params.skyBoxPath;
        var et = params.extension;
        params.cubeMap =[  pf+"posx"+et,pf+"negx"+et,pf+"posy"+et,
                            pf+"negy"+et,pf+"posz"+et,pf+"negz"+et
                            ];
        params.matColor = null;
        //var material = MaterialUtil.createFromShaderOption(shaderOps,scene);
        var material = SceneUtil.createMaterial(scene,params);
        var entity = new Entity("skybox");
        entity.mesh = mesh;
        entity.material = material;
        entity.transform.followCameraPos = true;
        return entity;

    }
    static createBloomMaterial(scene,mat){
        var fh_add = `
        #extension GL_EXT_draw_buffers : require 
        `;
        // // gl_FragData[1] = gl_FragColor;
        //gl_FragData[1] = vec4(0.0,0.0,0.0,1.0);
    var fb_add= `
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
        var bmat =  MaterialUtil.createFromShaderOption(shaderOps,scene);
        bmat.name = "bloom_draw2Mat";
        return bmat;
    }

    static copyShaderOps(shaderOps){
        var nsh = new ShaderOption();
        for(var k in shaderOps){
            nsh[k] = shaderOps[k];
        }
        return nsh;
    }

    static createMaterial(/** @type {Scene}*/ scene,params){
        if(params ===undefined){
            params = {};
        }
        var shaderOps = new ShaderOption();
        for(var k in params){
            shaderOps[k] = params[k];
        }
        if(shaderOps.matColor === undefined){
           // shaderOps.matColor = [0.3,0.5,1.0,1.0];
        }
        if(shaderOps.receiveLight === undefined){
            shaderOps.receiveLight = true;
        }
        if(shaderOps.receiveShadow === undefined){
            shaderOps.receiveShadow = false;
        }
        
        
       if(shaderOps.receiveLight){
            if(shaderOps.diffuse === undefined){
                shaderOps.diffuse = new Vector3(1.0,1.0,1.0);
            }
            if(shaderOps.specular === undefined){
                shaderOps.specular = new Vector3(1.0,1.0,1.0);
               
            }
            if(shaderOps.shininess === undefined){
                shaderOps.shininess = 10.0;
            }
           
           
           var dirCount = 0; var pointCount = 0;
           if(!MathUtil.isNone(scene.dirLights)){
               dirCount = scene.getDirectionalLightsCount();
           }
           if(!MathUtil.isNone(scene.pointLights)){
               pointCount = scene.getPointLightsCount();
           }
           shaderOps.dirLightCount = dirCount;
           shaderOps.pointLightCount =pointCount; 
           shaderOps.castShadow = true;
       }
        /**@type {Material} */
        var material = MaterialUtil.createFromShaderOption(shaderOps,scene);
        if(params.receiveShadow){
           var dshaderOps = new ShaderOption();
          // dshaderOps.matColor = [1.0,1.0,1.0,1.0];
           var dmat = MaterialUtil.createFromShaderOption(dshaderOps,scene);
           dmat.name = "depthMaterial";
           material.addPassLayer(dmat,CameraType.depth);
        }
        if(scene.hdr_bloom){
            var bloomMat = SceneUtil.createBloomMaterial(scene,material);
            material.addPassLayer(bloomMat,CameraType.bloom_col2);
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
         **/params){
        //var mesh = MeshUtil.createPlane(2,2,0);
        //mesh,color,isL,receiveShadow,tex
        if(params ===undefined){
            params = {};
        }
        if(params.mesh === undefined){
            params.mesh = MeshUtil.createSphere(1,20,20);
        }
        var material = null;
        if(params.material !==undefined){
            /**@type {Material} */
            material = params.material;
        }else{
            material =this.createMaterial(scene,params);
        }
        if(name === undefined){
            name = "entity_default";
        }
         var entity = new Entity(name);
         entity.mesh = params.mesh;
         entity.material = material;
         return entity;   
     }

    static createDefaultScene(canvasId,sceneParams){
        if(sceneParams === undefined){
            sceneParams ={};
        }
        if(sceneParams.hasLight ===undefined){
            sceneParams.hasLight = true;
        }
        if(sceneParams.castShadow === undefined){
            sceneParams.castShadow = true;
        }
        if(sceneParams.hasSkyBox === undefined){
            sceneParams.hasSkyBox = false;
        }

       // sceneParams.skyBoxPath
        var gl = CanvasUtil.initCanvas(canvasId,sceneParams.canvasLayout);
        
        //gl.canvas.width = gl.canvas.clientWidth*1.0;
        //gl.canvas.height = gl.canvas.clientHeight*1.0;
        var w = gl.canvas.width;
        var h = gl.canvas.height;
        console.log("SceneUtil w==",w,"h==",h);
        gl.viewport(0,0,w,h);
        var scene = new Scene();
        scene.gl = gl;

        var camera = CameraUtil.createDefaultCamera(w/h);
        camera.name="main_camera";
        scene.addCamera(camera);
     
        var lt = null;
        if(sceneParams.hasLight){
            var lightPos = null;
            if(sceneParams.lightPos === undefined){
                lightPos = new Vector3(5,5,5);
            }else{
                lightPos = sceneParams.lightPos;
            }
            var isPoint = true;
            if(sceneParams.isPoint !== undefined){
                isPoint = sceneParams.isPoint;
            }
            lt = LightUtil.createShadowLight(w,h,lightPos,sceneParams.castShadow,isPoint);
            scene.addLight(lt);
            if(sceneParams.castShadow){
                scene.addCamera(lt.shadowCam);
            }
            scene.ambientLight = new Vector3(0.3,0.3,0.3);
        }
        var skybox = null;
        if(sceneParams.hasSkyBox){
            skybox = SceneUtil.createSkyBox(scene,{skyBoxPath:sceneParams.skyBoxPath});
            scene.addEntity(skybox);
        }
       
        return {scene:scene,camera:camera,skybox:skybox,
            dirLight:lt,ambientLight:scene.ambientLight};

    }
}