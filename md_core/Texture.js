/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-09 21:04:12
 * @Description: file content
 */

var LoadState ={
    init :0,
    loading : 1,
    loaded : 2
};
var TextureElemType ={
    default:"UNSIGNED_BYTE",
    float:"FLOAT",
    halfFloat:"HALFFLOAT"
};

var TextureType = {
    default:"TEXTURE_2D",
    cube:"TEXTURE_CUBE_MAP"
};
var TextureFormat ={
    default:"RGBA",
    RGB:"RGB"
};

var TextureWrap ={
    default:"CLAMP_TO_EDGE",
    clamp_to_border:"CLAMP_TO_BORDER",
    repeat:"REPEAT"
};

var TextureUrl ={
    camera:"Camera",
    null:"null"
};

var TextureBlend ={
    Add:1,
    multi:2
};

class ImgLoader{
    constructor(url){
        this.url = url;
        this.type = TextureType.default;
        this.elType = TextureElemType.default;
        this.format = TextureFormat.default;
    }
    load(callback){
        var that = this;
        if(this.url.indexOf(".hdr")>=0){
            var xhr = new XMLHttpRequest();
            xhr.open("GET",this.url,true);
            xhr.responseType ="arraybuffer";
            xhr.crossOrigin = "anonymous";
            that.elType = TextureElemType.float;
            that.format = TextureFormat.RGB;
            xhr.onload = function(evt){
                var buff = xhr.response;
                if(buff){
                   
                    var img =  new RGBEParser(that.elType).parse(buff);
                    that.width =img.width;
                    that.height = img.height;
                    if(callback){
                        callback(that,img.data);
                    }
                }
            };
            xhr.send();
        }else{
            var image = new Image();
           
            image.crossOrigin = "anonymous";
           
            image.onload = function(ev){
                that.width =image.width;
                that.height = image.height;
                if(callback){
                    callback(that,image);
                }
            };
            image.src = this.url;
        }
        
    }
}
class Texture{
    constructor(url,width,height,type){
        this.url = url;
        /**@type {WebGLTexture} */
        this.glTexture =  null;
        this.state = LoadState.init;
        this.cubeMapHint = null;
        this.width = width;
        this.height = height;
        this.elType = TextureElemType.default;
        this.format = TextureFormat.default;
        this.hasMipMap = true;
        this.wrap_mode = TextureWrap.default;
        if(MathUtil.isNone(type)){
            this.type = "TEXTURE_2D";
        }else{
            this.type = type;
        }
        if(MathUtil.isNone(width)){
            this.width = 1;
        }
        if(MathUtil.isNone(height)){
            this.height = 1;
        }
        this.id = Texture.createId();
        console.log("constructor:texture >>>id=",this.id, "url=",this.url);
        this.onLoadedCalls = [];
        this.mipCount = -1;
    }
    getId(){
        return this.id;
    }
    getMipCount(){
        if(this.width ===1 && this.height ===1){
            console.error("Texture: not initialized ,url=",this.url);
            return -1;
        }
        
        if(this.mipCount === -1){
            var minw = this.width<this.height?this.width:this.height;
            this.mipCount =  Math.log(minw)*Math.LOG2E;
        }
        return this.mipCount;
    } 
    static createId(){
        Texture.id =  Texture.id +1;
        return Texture.id;
    }
    onLoaded(){
        for(var i in  this.onLoadedCalls){
            this.onLoadedCalls[i](this);
        }
    }
    
    bindDefaultColor(/**@type {WebGLRenderingContext} */gl,r,g,b,a){
        if(this.type !== "TEXTURE_2D"){
            return;
        }
        if(this.glTexture === null){
            this.glTexture = gl.createTexture();
        }
        var defaultPxs = new Uint8Array([r*255,g*255,b*255,a*255]);
        Texture.uploadTextureData(gl,this,defaultPxs,false,false,1,1);
        }
    static uploadTextureData(/**@type {WebGLRenderingContext} */gl,
        /**@type {Texture} */
        tex,data,isFlip,hasMipMap,fixw,fixh){
        
            var level = 0;
            var format = gl.RGBA;
            
            if(!MathUtil.isNone(tex.format)){
                format = gl[tex.format];
            }
            var width = tex.width;
            var height = tex.height;
            if(!MathUtil.isNone(fixw)){
                width = fixw;
            }
            if(!MathUtil.isNone(fixh)){
                height = fixh;
            }
            var eltype = gl[tex.elType];
            var type = gl[tex.type];
            
            console.log("upload Tex,",tex.elType);
            gl.bindTexture(type,tex.glTexture);
          //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !isFlip);
           // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
            if(tex.elType === TextureElemType.float){
                var ext = gl.getExtension('OES_texture_float');
                tex.wrap_mode =TextureWrap.default;
            }
            //console.log("should flip",isFlip);
           // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,isFlip);
            if(type === gl.TEXTURE_CUBE_MAP){
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
               // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                for (var j=0; j<6;j++){
                   // var ke = "TEXTURE_CUBE_MAP_"+tex.cubeMapHint[j];
                  //  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,isFlip);
                    if(data === null){
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+j,level,format,width,height,0,format,eltype,null);
                    }else{
                        if(data[j] instanceof Image){
                            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+j,level,format,format,eltype,data[j]); 
                        }else{
                            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+j,level,format,width,height,0,format,eltype,data[j]); 
                        }
                    }
                    
                      
                }
            }else if(data instanceof Image){
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,isFlip);
                gl.texImage2D(gl.TEXTURE_2D,level,format,format,eltype,data);
            }else{
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,isFlip);
                gl.texImage2D(gl.TEXTURE_2D,level,format,width,height,0,format,eltype,data); 
            }
            gl.texParameteri(type,gl.TEXTURE_WRAP_S,gl[tex.wrap_mode]);
            gl.texParameteri(type,gl.TEXTURE_WRAP_T,gl[tex.wrap_mode]);
           

            var filter = gl.LINEAR;
            var hasET = true;
            if(tex.elType=== TextureElemType.float){
                var et1= gl.getExtension('OES_texture_float');
                var et2 = gl.getExtension('OES_texture_float_linear');
                if(et1===undefined || et2===undefined){
                    hasET = false;
                    filter = gl.NEAREST;
                }
            }
            //gl.getExtension('EXT_shader_texture_lod');
            //gl.getExtension('OES_standard_derivatives');
            gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,filter);
            gl.texParameteri(type,gl.TEXTURE_MAG_FILTER,filter);
            
            if(hasMipMap && tex.hasMipMap){
                if(MathUtil.isPowerOf2(tex.width) && MathUtil.isPowerOf2(tex.height)){
                   // gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR);
                    //gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
                    if(tex.elType ===TextureElemType.float){
                        if(hasET){
                           // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.generateMipmap(type);
                            gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
                            console.log("gererate mipmap",tex.name); 
                        }
                    }else{
                        gl.generateMipmap(type);
                        gl.texParameteri(type,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
                        console.log("gererate mipmap",tex.name); 
                    }
                     
                   
                }
            }
            gl.bindTexture(type,null);
           
        }

    static loadCubeTexture(/**@type {WebGLRenderingContext} */gl,
        /**@type {Texture} */
        tex,loadCallback){
            if(tex.glTexture === null){
                tex.glTexture = gl.createTexture();
            }
            tex.state = LoadState.loading;
            var loaded =0;
            var imgs = {};
            for(var i =0; i<6;i++){
                var ui = tex.url[i];
                var imgL = new ImgLoader(ui);
                imgL.index = i;
                imgL.load(function(loader,data){
                    loaded+=1;
                    imgs[loader.index] = data;
                    if(loaded === 6){
                        tex.width = loader.width; tex.height = loader.height;
                        tex.format = loader.format; 
                        tex.elType = loader.elType;
                        Texture.uploadTextureData(gl,tex,imgs,true,true);
                        tex.state = LoadState.loaded;
                        loadCallback(tex);
                      
                    }
                    
                });
                
            } 

        }
    
    static loadNullTexture(/**@type {WebGLRenderingContext} */gl,
        /**@type {Texture} */
        tex,loadCallback){
            if(tex.glTexture === null){
                tex.glTexture = gl.createTexture();
            }
            tex.state = LoadState.loading;  
           // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            Texture.uploadTextureData(gl,tex,null,false,true);
           // tex.loadCallback = loadCallback;
        }
    
    loadTexture(/**@type {WebGLRenderingContext} */gl,
      loadCallback){
        var tex = this;
        if(tex.url ===TextureUrl.camera || MathUtil.isNone(tex.url)){
            Texture.loadNullTexture(gl,tex,loadCallback);
           
            return;
        }
        if(tex.url instanceof(Array)){
            Texture.loadCubeTexture(gl,tex,loadCallback);
            return;
        }
        if(tex.glTexture === null){
            tex.glTexture = gl.createTexture();
        }
        tex.state = LoadState.loading;
        var that = this;

        var imgL = new ImgLoader(tex.url);
        imgL.load(function(loader,img){
            that.width = loader.width; that.height = loader.height;
            that.format = loader.format; that.type = loader.type;
            that.elType = loader.elType;
            Texture.uploadTextureData(gl,that,img,true,true);
            that.state = LoadState.loaded;
            loadCallback(tex);
            

        });
       
    }
}
Texture.id = 0;