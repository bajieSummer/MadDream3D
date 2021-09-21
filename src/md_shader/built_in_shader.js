/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-31 21:00:46
 * @Description: file content
 */

const main_st = `void main(){
`;
const main_ed = "}";

const fhead_precision = `
precision mediump float;
`;

const fhead_commomFunc = `
#define saturate(a) clamp( a, 0.0, 1.0 )
`;

const vhead_common = `
    attribute vec4 vertexPos;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    `;
const vbody_common = `
    vec4 inPos = vec4(vertexPos);
`;

const vbody_simple = `
         gl_Position = projectionMatrix * modelViewMatrix * vec4(inPos.xyz,1.0);
    `;
const fbody_simple = `
        gl_FragColor = vec4(0.3,0.4,0.5,1.0);
  `;

// vertex color
const vhead_vcolor = `
  attribute vec4 vertexColor;
  varying lowp vec4 vColor;
`;
const vbody_vcolor = `
    vColor = vertexColor;
`;
const fhead_vcolor = `
varying lowp vec4 vColor;
`;
const fbody_vcolor = `
    gl_FragColor = vColor;
`;

// material color
const fhead_matColor = `
uniform vec4 matColor;
`;
const fbody_matColor = `
    gl_FragColor = matColor;
`;

// texture
const vhead_uv = `
attribute vec2 uv;
varying vec2 vUV;
`;
const vbody_uv = `
  vUV = uv;
`;
const fhead_uv = `
    varying vec2 vUV;
`;
const fbody_uv = `
    vec2 fUV = vUV;
`;
const fhead_uvTran = `
uniform vec4 uvTran;
`;
const fbody_uvTran = `
fUV.x = fUV.x*uvTran.x+uvTran.y;
fUV.y = fUV.y*uvTran.z+uvTran.w;
`;

const fhead_simple_texture = `
uniform sampler2D texture0;
`;
const fbody_simple_texture = `
    vec4 color_tex0 = texture2D(texture0,fUV);
    gl_FragColor =  color_tex0;
`;

// light
const vhead_light = `
varying vec4 viewPos;
`;
const vbody_light = `
    viewPos = modelViewMatrix * vec4(inPos.xyz,1.0);
    gl_Position = projectionMatrix * viewPos;
   
`;
const vhead_vertexNormal = `
    attribute vec3 vertexNormal;
    uniform mat4 normalMatrix;
    varying vec3 vNormal;
`;
const vbody_vertexNormal = `
    vNormal = normalize((normalMatrix*vec4(vertexNormal,1.0)).xyz);
`;

const fhead_light = `
uniform vec3 ambientLight;
varying vec4 viewPos;

`;

const fhead_vertexNormal = `
    varying vec3 vNormal;
`;
const fhead_blinn_Light_st = `    
struct Light{
  vec3 diffuse;
  vec3 specular;
  float shininess;
};`;
const fhead_lambert_Light_st = `
struct Light{
    vec3 diffuse;
};`;

const fhead_pointLight_st = ` 
struct pointLight{
Light light;
vec3 position;
vec3 params;  //constant,linear,quadratic;
};
uniform pointLight pointL[pointLightCount+1];
`;

const fhead_dLight_st = `
struct dLight{
    vec3 direction;
    Light light;
};
uniform dLight dirL[dirLightCount+1];
`;

const func_calLight_lambert = `
void calLight(inout vec3 lcolor, inout vec3 spec, vec3 eyeDir, vec3 direction, vec3 normal,Light lt){
    lcolor  =lcolor + lt.diffuse*max(dot(normal,-1.0*direction),0.0);
}
`;


const func_calLight_blinn = `
void calLight(inout vec3 lcolor, inout vec3 spec,vec3 eyeDir, vec3 direction,vec3 normal, Light lt){
    lcolor  =lcolor + lt.diffuse*max(dot(normal,-1.0*direction),0.0);
    vec3 refDir = reflect(direction,normal);
    spec = spec + pow(max(dot(eyeDir,refDir),0.0),lt.shininess)*lt.specular;
}`;


const func_calDirLights = `
void calDirLights(inout vec3 lcolor,inout vec3 spec,vec3 eyeDir,vec3 normal){
  for (int i =0;i<dirLightCount;i++){
      calLight(lcolor,spec,eyeDir,dirL[i].direction,normal,dirL[i].light);
  }
}`;
const func_calPointLights = `
void calPointLights(inout vec3 lcolor,inout vec3 spec, vec3 eyeDir,vec3 normal){
    for(int i=0; i<pointLightCount; i++){
      float distance = length(pointL[i].position +eyeDir);
      float intst = pointL[i].params.x + distance*pointL[i].params.y + distance*distance*pointL[i].params.z;
      vec3 direction  = normalize(viewPos.xyz-pointL[i].position);
      calLight(lcolor,spec,eyeDir,direction,normal,pointL[i].light);
      float decay = 1.0/intst;
      lcolor = decay*lcolor;
      spec = decay*spec;
    }
}`;

const fbody_light_st = `
    vec3 lcolor = vec3(0.0);
    vec3 lspec = vec3(0.0);
    vec3 ambient = vec3(0.0);
    vec3 eyeDir = normalize(-1.0*viewPos.xyz);
    `;
//vec3 ambient =ambientLight;
const fbody_light_ambient = `
ambient +=ambientLight*gl_FragColor.rgb;
gl_FragColor.rgb = gl_FragColor.rgb*lcolor+ambient;
`;
const fbody_light_ed = `
    gl_FragColor.rgb = gl_FragColor.rgb+lspec;

`;
const fbody_dirLight = `
    calDirLights(lcolor,lspec,eyeDir,vNormal);
`;
const fbody_pointLight = `
    calPointLights(lcolor,lspec,eyeDir,vNormal);
`;

const fhead_modelNormalMap = `
    uniform mat4 normalMatrix;
    uniform sampler2D modelNormalMap;
`;

const fbody_modelNormalMap = `
    vec4 texn = vec4(texture2D(modelNormalMap,fUV).rgb*2.0-1.0,1.0);
    vec3 vNormal = normalize((normalMatrix*texn).xyz);
`;

// const vhead_normalMap =`
//     attribute vec3 vertexTangent;
//     attribute vec3 vertexNormal;
//     uniform mat4 normalMatrix;
//     uniform sampler2D normalMap;
//     varying vec3 vNormal;

// `;
// const vbody_normalMap=`
//     vec3 BiTan = cross(vertexNormal,vertexTangent);
//     mat3 TBN = mat3(vertexTangent,BiTan,vertexNormal);
//     vec3 texn = texture2D(normalMap,uv).rgb*2.0-1.0;
//     vec4 vn = normalMatrix*vec4(TBN*texn,1.0);
//     vNormal = normalize(vn.xyz);
// `;

// const fhead_normalMap =`
//     varying vec3 vNormal;
// `;

// const fbody_normalMap=`
// `;

const vhead_normalMap = `
    attribute vec3 vertexTangent;
    attribute vec3 vertexNormal;
    varying mat3 TBN;
`;
const vbody_normalMap = `
    vec3 BiTan = cross(vertexNormal,vertexTangent);
    TBN = mat3(vertexTangent,BiTan,vertexNormal);
`;

const fhead_normalMap = `
    uniform mat4 normalMatrix;
    uniform sampler2D normalMap;
    varying mat3 TBN;
`;

const fbody_normalMap = `
    vec3 texn = texture2D(normalMap,fUV).rgb*2.0-1.0;
    vec3 vNormal = normalize((normalMatrix*vec4(TBN*texn,1.0)).xyz);
`;

const vhead_cubeMap = `
    varying vec3 skyPos;
`;
const vbody_cubeMap = `
    skyPos =inPos.xyz;
  `;

const fhead_cubeMap = `
    uniform samplerCube cubeMap;
    varying vec3 skyPos;
`;

const fbody_cubeMap = `
    gl_FragColor = textureCube(cubeMap,normalize(skyPos.xyz));
`;

const fhead_rectSphereMap = `
    uniform sampler2D rectSphereMap;
    varying vec3 skyPos;
    const vec2 invAtan = vec2(0.1591,0.3183);
    vec2 samplerSphericalMap(vec3 dir){
        vec2 uv = vec2(atan(dir.z,dir.x),asin(dir.y));
        uv *= invAtan;
        uv += 0.5;
        return uv;
    }
`;
const fbody_rectSphereMap = `
    vec2 ruv = samplerSphericalMap(normalize(skyPos));
    gl_FragColor = texture2D(rectSphereMap,ruv);
`;



const vhead_envMap = `
uniform samplerCube cubeMap;
uniform mat4 viewMatrix;
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
`;

const fhead_envMap = `

uniform samplerCube cubeMap;
`;

const fbody_envMap_st = `
  vec3 envColor = vec3(0.0);
  float ratio = 0.0;
`;
const fbody_envMap_ed = `
  gl_FragColor.rgb = mix(gl_FragColor.rgb,envColor,ratio);
`;

const vhead_envMap_reflect = `
varying vec3 skyPos;
`;
const vbody_envMap_reflect = `
    skyPos = reflect(normalize(viewPos.xyz),normalize(vNormal));
    skyPos = inverseTransformDirection(skyPos,viewMatrix);
  `;

const fhead_envMap_reflect = `
uniform float reflective;
varying vec3 skyPos;
`;

const fbody_envMap_reflect = `
ratio += reflective;
 envColor += reflective*textureCube(cubeMap,skyPos).xyz;
`;


const vhead_envMap_refract = `
    uniform vec2 refractParams; //strength, refractRatio
    varying vec4 refractR;
  `;

const vbody_envMap_refract = `
    refractR.a = refractParams[0];
    refractR.rgb = refract(normalize(viewPos.xyz),normalize(vNormal),1.0/refractParams[1]);
    refractR.rgb = inverseTransformDirection(refractR.rgb,viewMatrix);
`;

const fhead_envMap_refract = `
varying vec4 refractR;
`;

const fbody_envMap_refract = `
    ratio += refractR.a;
    envColor += refractR.a*textureCube(cubeMap,refractR.xyz).xyz;
`;


const fhead_envMap_normalMap = `
uniform samplerCube cubeMap;
uniform mat4 viewMatrix;
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
`;

const fhead_envMap_normal_reflect = `
uniform float reflective;
`;

const fbody_envMap_normal_reflect = `
vec3 skyPos = reflect(normalize(viewPos.xyz),normalize(vNormal));
skyPos = inverseTransformDirection(skyPos,viewMatrix);
ratio += reflective;
 envColor += reflective*textureCube(cubeMap,skyPos).xyz;
`;
const fhead_envMap_normal_refract = `
uniform vec2 refractParams; // refractRatio,strength
`;
const fbody_envMap_normal_refract = `
refractR.a = refractParams[0];
refractR.rgb = refract(normalize(viewPos.xyz),normalize(vNormal),1.0/refractParams[1]);
refractR.rgb = inverseTransformDirection(refractR.rgb,viewMatrix);
ratio += refractR.a;
 envColor += refractR.a*textureCube(cubeMap,refractR.xyz).xyz;
`;
//// https://en.wikipedia.org/wiki/Relative_luminance
//luminanceParams max,min,average  three.js
//http://www.cis.rit.edu/people/faculty/ferwerda/publications/sig02_paper.pdf
const fhead_toneMap_luminance = `
    uniform float hdrExposure; 
    float linearToRelativeLuminance( const in vec3 color ) {
        vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
        return dot( weights, color.rgb );
    }

    vec3 toneMapping( vec3 vColor,vec4 luminaceParams){
        // Get the calculated average luminance 
        float maxLuminance = luminaceParams[0];
        float minLuminance = luminaceParams[1];
        float fLumAvg = luminaceParams[2];
        float middleGrey = luminaceParams[3];
		// Calculate the luminance of the current pixel
		float fLumPixel = linearToRelativeLuminance( vColor );
		// Apply the modified operator (Eq. 4) 
		float fLumScaled = (fLumPixel * middleGrey) / max( minLuminance, fLumAvg );
	    float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (maxLuminance * maxLuminance)))) / (1.0 + fLumScaled);
		return fLumCompressed * vColor;
    }
`;
// gl_FragColor.rgb = vec3(1.0)- exp(-1.0*hdrExposure*gl_FragColor.rgb);
const fbody_toneMap_luminance = `
vec4 luminaceParams = vec4(5.0,0.01,0.5,0.6);
luminaceParams.w = hdrExposure;
 gl_FragColor.rgb = toneMapping(gl_FragColor.rgb,luminaceParams);

  
`;

const fhead_toneMap = `
uniform float hdrExposure; 

vec3 LinearToneMapping( vec3 color ) {
	return hdrExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= hdrExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
vec3 Uncharted2ToneMapping( vec3 color, float toneMappingWhitePoint ) {
	color *= hdrExposure;
	return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= hdrExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	color *= hdrExposure;
	return saturate( ( color * ( 2.51 * color + 0.03 ) ) / ( color * ( 2.43 * color + 0.59 ) + 0.14 ) );
}
vec3 toneMapping( vec3 color ) { return LinearToneMapping( color ); }
`;
////gl_FragColor.rgb = vec3(1.0)- exp(-1.0*hdrExposure*gl_FragColor.rgb);

const fbody_toneMap = `
    gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);
  
`;
//gl_FragColor.rgb = gl_FragColor.rgb/(gl_FragColor.rgb+vec3(1.0));
const fbody_gammaCorrection = `
//gl_FragColor.rgb = gl_FragColor.rgb/(vec3(1.0)+gl_FragColor.rgb);
    gl_FragColor.rgb = pow(gl_FragColor.rgb,vec3(0.4545));
  //  gl_FragColor.a = 1.0;
`;
// #define lightShadowCount 1
const vhead_receiveShadow = `
    uniform mat4 lightPVM[lightShadowCount];
    varying vec4 lightSpacePos[lightShadowCount];
`;

const vbody_receiveShadow = `
    for(int jr=0; jr<lightShadowCount; jr++){
        lightSpacePos[jr] = lightPVM[jr]*inPos;
    }
`;
//#define lightShadowCount 1
const fhead_receiveShadow = `
uniform vec2 biasStep[lightShadowCount];
precision mediump float;
uniform sampler2D depthMap[lightShadowCount];
varying vec4 lightSpacePos[lightShadowCount];
float calShadow(vec4 pos, vec2 bias_step, sampler2D depth_map){
    float shadow = 0.0;
    vec3 projSd = pos.xyz/pos.w;
    projSd = projSd*0.5 +0.5;

   
    for(int i = -1; i<=1;i++){
        for(int j=-1; j<=1; j++){
            vec2 uv = projSd.xy+vec2(i,j)*bias_step.y;
            if(projSd.z-bias_step.x>texture2D(depth_map,uv).r){
                shadow += 0.8;
            } 
        }
    }
    if (projSd.z>1.0 || projSd.z<0.00)
        shadow = 0.0;

    
    
    return shadow/9.0;
}

float calAllShadow(){
    float shadow = 0.0;
    for(int jr=0; jr<lightShadowCount; jr++){
        shadow += calShadow(lightSpacePos[jr],biasStep[jr],depthMap[jr]);
    }
    return shadow/float(lightShadowCount);
  }
`;

const fbody_Light_receiveShadow = `
float shadow = calAllShadow();
lcolor = (1.0-shadow)*lcolor;
lspec = (1.0-shadow)*lspec;
`;

const fbody_NoLight_receiveShadow = `
float shadow = calAllShadow();
gl_FragColor.rgb = (1.0-shadow)*gl_FragColor.rgb;

`;

var fhead_lightBlur = `
uniform sampler2D  texture_brighter;
`;

var fbody__lightBlur2 = `
    float w0 = 0.227027;
    vec4 weight = vec4(0.1945946, 0.1216216, 0.054054, 0.016216)*2.0;
    float step = 5.0/1000.0;
    vec3 result = texture2D(texture_brighter,fUV).rgb*step;
    for(int i =1; i<5;i++){
        result = result*0.1;
        result +=texture2D(texture_brighter,fUV + vec2(i,0)*step).rgb*weight[i-1];
        result +=texture2D(texture_brighter,fUV + vec2(-i,0)*step).rgb*weight[i-1];
    }
    gl_FragColor.rgb = result+gl_FragColor.rgb;
    `;
var fbody__lightBlur = `
    float step = 6.0/1000.0;
    vec3 result = vec3(0.0);
    for(int i =-2; i<=2;i++){
        for(int j=-2; j<=2;j++){
            result +=texture2D(texture_brighter,fUV + vec2(i,j)*step).rgb;
        }
    }
    gl_FragColor.rgb = result/25.0+gl_FragColor.rgb;
`;


var fbody_vgs_blur = `
vec4 weight = vec4(0.1945946, 0.1216216, 0.054054, 0.016216);
float step = 3.0/1000.0;

vec3 result = texture2D(texture0,fUV).rgb*0.227027;
for(int i =1; i<5;i++){
    result +=texture2D(texture0,fUV + vec2(0,i)*step).rgb*weight[i-1];
    result +=texture2D(texture0,fUV + vec2(0,-i)*step).rgb*weight[i-1];
}
gl_FragColor.rgb = result;
`;

var fbody_hgs_blur = `
vec4 weight = vec4(0.1945946, 0.1216216, 0.054054, 0.016216);
float step = 3.0/1000.0;
vec3 result = texture2D(texture0,fUV).rgb*0.227027;
for(int i =1; i<5;i++){
    result +=texture2D(texture0,fUV + vec2(i,0)*step).rgb*weight[i-1];
    result +=texture2D(texture0,fUV + vec2(-i,0)*step).rgb*weight[i-1];
}
gl_FragColor.rgb = result;
`;

var fhead_texture1 = `
uniform sampler2D texture1;
`
var fbody_texture1 = `
    vec4 color_tex1 = texture2D(texture1,fUV);
`;
var fbody_texBlendAdd = `
    gl_FragColor.rgb = gl_FragColor.rgb +color_tex1.rgb;  
`;

var fhead_bloomd2 = `
#extension GL_EXT_draw_buffers : require 
`;
var fbody_bloomd2 = `
float grey = gl_FragColor.r*0.299 + gl_FragColor.g*0.587 + gl_FragColor.b*0.114;
            if(grey>0.9){
                gl_FragData[1] = gl_FragColor;
            }else{
                gl_FragData[1] = vec4(0.0,0.0,0.0,1.0);
                
            }
`;

// var vbody_fog =`
// float start = 0.2;
// float end = 5.0;
// float fogFactor/ = (length(viewPos.xyz)-start)*(end-start);

// `;

var fhead_fog_linear = `
uniform vec2 fogLinear;
uniform vec3 fogColor;
`;

var fbody_fog_linear = `
float start = fogLinear[0];
float end = fogLinear[1];
float z = gl_FragCoord.z/gl_FragCoord.w;
float fogFactor = (z-start)/(end-start);
fogFactor = clamp(fogFactor,0.0,1.0);
gl_FragColor.rgb = mix(gl_FragColor.rgb,fogColor,fogFactor);
`;

var fhead_fog_exp = `
uniform float density;
uniform vec3 fogColor;
`;
//float density = 0.09;
var fbody_fog_exp = `
const float LOG2 = 1.44265;
float z = gl_FragCoord.z/gl_FragCoord.w;
float fogFactor = exp2(-density*density*z*z*LOG2);
fogFactor = clamp(fogFactor,0.0,1.0);
gl_FragColor.rgb = mix(fogColor,gl_FragColor.rgb,fogFactor);
`;
//#define  roughness 0.02
//#define metalness 0.7
var fhead_PBR = `
#define PI 3.14159
uniform float roughness;
uniform float metalness;
float rough = 1.0;
float metal = 1.0;
float ao = 1.0;
vec3 F0 = vec3(0.02, 0.02, 0.02);
//uniform vec3 F0;
struct Light{
    vec3 diffuse;
};

float distributionGGX(float nh,float a){
    float a2 = a*a;
    float f = (nh * a2 - nh) * nh + 1.0;
    float denom = PI*f*f;
    return a2/denom;
}
float calDirK(){
    float a2 = (rough+1.0);
    a2 =a2*a2;
    return a2/8.0;
}
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
float geometrySub(float nv, float k){
    return nv/(nv*(1.0-k)+k);
}

float geometryGGX(float NoV,float NoL,float rough){
    float ggx2 = GeometrySchlickGGX(NoV, roughness);
    float ggx1 = GeometrySchlickGGX(NoL, roughness);
    return ggx1 * ggx2;
}

vec3 fresnelReflect(vec3 f0,float VoH){
    return f0 + (vec3(1.0) - f0) * pow(1.0 - VoH, 5.0);
}
void calLight(inout vec3 lcolor, inout vec3 spec, vec3 wo, vec3 dir, vec3 n,Light lt){
    vec3 wi = -1.0*vec3(dir);
     vec3 h = normalize(wi+wo);
     float nv = abs(dot(n,wo))+1e-5;
     float nl = clamp(dot(n,wi),0.0,1.0);
     //float vh = clamp(dot(h,wo),0.0,1.0);
     float lh = clamp(dot(h,wi),0.0,1.0);
     float nh =clamp(dot(h,n),0.0,1.0);
     float roughFix = rough*rough;
    vec3 F = fresnelReflect(F0,lh);
    float D = distributionGGX(nh,roughFix);
    float G = geometryGGX(nv,nl,roughFix);
    vec3 kd = vec3(1.0) - F;
     kd *=1.0 - metal; 
     vec3 Fr = (D*G)*F;
     vec3 Fd = kd/PI;
    lcolor += Fd*nl*lt.diffuse;
    spec += D*G*F*nl*lt.diffuse;
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
`;

var fbody_PBR_roughU = `
    rough *= roughness;
    rough = clamp(rough,0.0,1.0);
    metal = clamp(metal,0.0,1.0);
`;
var fbody_PBR_metalU = `
    metal *= metalness;
`;
// to pow fix
// gl_FragColor.r= pow(gl_FragColor.r, 2.2);
// gl_FragColor.g= pow(gl_FragColor.g, 2.2);
// gl_FragColor.b= pow(gl_FragColor.b, 2.2);
var fbody_PBR = `

gl_FragColor.r= pow(gl_FragColor.r, 2.2);
gl_FragColor.g= pow(gl_FragColor.g, 2.2);
gl_FragColor.b= pow(gl_FragColor.b, 2.2);
    F0 = mix(F0,gl_FragColor.rgb,metal);
    //gl_FragColor = LinearTosRGB(gl_FragColor);

    
`;

var fhead_roughMap = `
    uniform sampler2D roughMap;
`;

var fbody_roughMap = `
    rough *= min(texture2D(roughMap,fUV).x,1.0);
`;

var fhead_metalMap = `
    uniform sampler2D metalMap;
`;

var fbody_metalMap = `
   
    metal *= texture2D(metalMap,fUV).x;
`;

var fbody_PBR_envMap = `
    //ratio =0.02;
`;

var fhead_IBL_irad_func = `
vec3 fresnelSchlickRoughness(vec3 f0,float cosTheta, float rfs)
{
    return f0 + (max(vec3(1.0 - rfs), f0) - f0) * pow(1.0 - cosTheta, 5.0);
}   
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

vec3 getIBLIradianceColor(const samplerCube iradMap, float mip,vec3 kS,vec3 wN){
    #ifdef DF_TEX_LOD
    vec3 iblDiffuse = textureCube(iradMap,wN,mip).rgb;
    #else
    vec3 iblDiffuse = textureCube(iradMap,wN,mip).rgb;
    #endif
   
    vec3 kD = 1.0 - kS;
    kD *=1.0 - metal; 
    return kD * iblDiffuse;
}
#ifdef DF_RADSPMAP
const vec2 invAtan = vec2(0.1591,0.3183);
vec4 sampleSPMap(const sampler2D spMap,vec3 dir,float mip){
    vec2 uv = vec2(atan(dir.z,dir.x),asin(dir.y));
    uv *= invAtan;
    uv += 0.5;
    #ifdef DF_TEX_LOD
    return texture2DLodEXT(spMap,uv,mip);
    #else
    return texture2D(spMap,uv,mip);
    #endif

    
}
vec4 sampleSPMap2(const sampler2D spMap,vec3 dir,float mip){
    vec2 uv = vec2(atan(dir.z,dir.x),asin(dir.y));
    uv *= invAtan;
    uv += 0.5; 
    return texture2D(spMap,uv,mip);

    
}
vec3 getIBLIradianceColorBySP(const sampler2D iradMap, float mip,vec3 kS,vec3 wN){

    vec3 iblDiffuse = sampleSPMap(iradMap,wN,mip).rgb;
    vec3 kD = 1.0 - kS;
    kD *=1.0 - metal; 
    return kD * iblDiffuse;
}
#endif

`;

var fhead_IBL_spec_func = `

float getSpecularMIPLevel( const in float roughness, float maxMIPLevelScalar ) {
    float sigma = PI * roughness * roughness / ( 1.0 + roughness );
    float desiredMIPLevel = maxMIPLevelScalar + log2( sigma );
    return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
}
vec2 integrateSpecularBRDF( const in float dotNV, const in float roughness ) {
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	return vec2( -1.04, 1.04 ) * a004 + r.zw;
}
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}

float getSpecRough(vec3 normal,float rf){
    #ifdef DF_DERIVATIVES
    vec3 dxy = max( abs( dFdx( normal ) ), abs( dFdy( normal ) ) );
    float geometryRoughness = max(max( dxy.x, dxy.y ), dxy.z );
    #else
    float geometryRoughness =0.0;
    #endif
    float specRough = max(rf, 0.0525 );
    specRough += geometryRoughness;
    specRough = min( specRough, 1.0 );
    return specRough;
}
#ifdef DF_RADSPMAP
vec3 getIBLSpecColorBySP(const sampler2D radMap, float specRough, vec3 R, float nv, vec3 kS,vec2 dfg){
    
    #ifdef DF_LINEARMIP
        float specMip = specRough*MAX_MIPCOUNT;
    #else
        float specMip = getSpecularMIPLevel(specRough,MAX_MIPCOUNT-1.0);
    #endif
  
    vec3 iblSpecular =  sampleSPMap(radMap,R,specMip).rgb;
   
    
    return (kS*dfg.x+dfg.y)*iblSpecular;
}
#endif
vec3 getIBLSpecColor(const samplerCube radMap, float specRough, vec3 R, float nv, vec3 kS,vec2 dfg){
    //float mipF = fract(specMip);
    //float mipInt = floor(specMip);
    //vec3 color0 = textureCube(radMap,R,mipInt).rgb;
    //vec3 color1 = textureCube(radMap,R,mipInt+1.0).rgb;
    //vec3 iblSpecular = mix(color0,color1,mipF);
    //vec2 dfg = texture2D(lutMap,vec2(nv,rough)).xy;
    #ifdef DF_LINEARMIP
        float specMip = specRough*MAX_MIPCOUNT;
    #else
        float specMip = getSpecularMIPLevel(specRough,MAX_MIPCOUNT-1.0);
    #endif
    #ifdef DF_TEX_LOD
        vec3 iblSpecular =  textureCubeLodEXT(radMap,R,specMip).rgb;
    #else
        vec3 iblSpecular =  textureCube(radMap,R,specMip).rgb;
    #endif
    return (kS*dfg.x+dfg.y)*iblSpecular;
}
`
var fhead_IBL = `
uniform mat4 viewMatrix;
uniform float MAX_MIPCOUNT;
#extension GL_EXT_shader_texture_lod : enable
#extension GL_OES_standard_derivatives : enable
`+ fhead_IBL_irad_func + fhead_IBL_spec_func;

var fbody_IBL = `
vec3 wN = inverseTransformDirection(vNormal,viewMatrix);
float nv = clamp(dot(vNormal, eyeDir),0.0,1.0);
vec3 kS = fresnelSchlickRoughness(F0,nv,rough);
#ifdef DF_IRRADIANCEMAP
vec3 iradColor = getIBLIradianceColor(irradianceMap,0.0,kS,wN);
#else
#ifdef DF_RADSPMAP
vec3 iradColor = getIBLIradianceColorBySP(radianceMap,MAX_MIPCOUNT+1.0,kS,wN);
#else
vec3 iradColor = getIBLIradianceColor(radianceMap,MAX_MIPCOUNT+1.0,kS,wN);
#endif
#endif

ambient += iradColor*gl_FragColor.rgb*ao;
`;

var fhead_IBL_iradiance = `
uniform samplerCube irradianceMap;
`;

var fbody_IBL_iradiance = `


`;

var fhead_IBL_specular = `
#ifdef DF_RADSPMAP
uniform sampler2D radianceMap;
#else
uniform samplerCube radianceMap;
#endif
#ifdef DF_LUTMAP
uniform sampler2D  lutMap;
#endif
`;

var fbody_IBL_specular = `
vec3 R = reflect(-1.0*eyeDir, vNormal);
R =  inverseTransformDirection(R,viewMatrix);
#ifdef DF_LINEARMIP
    float specRough =rough;
#else
    float specRough = getSpecRough(vNormal,rough);
#endif

#ifdef DF_LUTMAP
    vec2 dfg = texture2D(lutMap,vec2(nv,rough)).xy;
#else
    vec2 dfg = integrateSpecularBRDF(nv,rough);
#endif
#ifdef DF_RADSPMAP
vec3 iblSpecular  = getIBLSpecColorBySP(radianceMap,specRough,R,nv,kS,dfg);
#else
vec3 iblSpecular  = getIBLSpecColor(radianceMap,specRough,R,nv,kS,dfg);
#endif
float spAo = computeSpecularOcclusion(nv,ao,specRough);
iblSpecular *= spAo;
ambient +=iblSpecular;
`;


var fhead_aoMap = `
uniform sampler2D aoMap;
`;
var fbody_aoMap = `
ao = texture2D(aoMap,fUV).r;

`;

var vhead_heightMap = `
uniform mat4 modelViewInv;
//varying vec3 tanCamPos;
//varying vec3 tanfragPos;
varying vec3 tanViewDir;
uniform sampler2D heightMap;
mat3 transposeDiv(mat3 mat){
    return mat3(mat[0][0],mat[0][1],mat[0][2],
        mat[1][0],mat[1][1],mat[1][2],
        mat[2][0],mat[2][1],mat[2][2]);
}

`;
// TBN = mat3(vertexTangent,BiTan,vertexNormal);
var vbody_heightMap = `
 
  //mat3 tan = mat3(vertexTangent,cross(vertexNormal,vertexTangent),vertexNormal);
  //tan = transposeDiv(tan);
  float height = texture2D(heightMap,vUV).r*2.0-1.0;
  inPos.xyz += vertexNormal*height*0.02; 
  //vec3 tanCamPos = tan*(modelViewInv*vec4(0.0,0.0,0.0,1.0)).xyz;
  //vec3 tanfragPos = tan*inPos.xyz;
  //tanViewDir = tanCamPos -tanfragPos;
`;
//uniform vec3 modelCameraPos;
//varying vec4 modelFragPos;
var fhead_heightMap = `
uniform sampler2D heightMap;
const float bumpScale = 1.0;
 //varying vec3 tanCamPos;
 //varying vec3 tanfragPos;
 varying vec3 tanViewDir;
`;
//

//vec3 viewDirT = normalize(modelCameraPos - modelFragPos.xyz);
var fbody_heightMap = `
float eps = 0.0000001;
vec3 viewDirT = normalize(tanViewDir);

//fUV+=vec2(viewDirT.x/(viewDirT.z+eps),viewDirT.y/(viewDirT.z+eps))*height*0.005;
`;

const fhead_calRadiance = `
const float samplerDelta = 0.1;
	const float PI = 3.14159;
	void calIrradiance(inout vec3 irradiance,vec3 N){
		float samples = 0.0;
		vec3 up = vec3(0,1,0);
		vec3 right = cross(up,N);
		up = cross(N,right);
		for(float cita = 0.0; cita<PI*2.0; cita+=samplerDelta){
			for(float phi = 0.0; phi<PI*0.5; phi+=samplerDelta){
				float sinphi = sin(phi);
				float cosphi = cos(phi);
				float coscita =cos(cita);
				float sincita = sin(cita);
				vec3 sampDir = vec3(sinphi*coscita,sinphi*sincita,cosphi);
				//to world space
				vec3 wDir=sampDir.x*right+sampDir.y*up+sampDir.z*N;
                irradiance +=textureCube(cubeMap,wDir).rgb*sinphi*cosphi;
                samples+=1.0;
			}
        }
        irradiance =irradiance*(PI/samples);
	}
`;

const fbody_calRadiance = `
vec3 irradiance = vec3(0.0);
	vec3 nm = normalize(skyPos.xyz);
	calIrradiance(irradiance,nm);
	gl_FragColor.rgb = irradiance;
`;


const fhead_calIBLFunc = `
const float PI = 3.14159;
float VanDerCorpus(int n, int base)
{
    float invBase = 1.0 / float(base);
    float denom   = 1.0;
    float result  = 0.0;

    for(int i = 0; i < 32; ++i)
    {
        if(n > 0)
        {
            denom   = mod(float(n), 2.0);
            result += denom * invBase;
            invBase = invBase / 2.0;
            n       = int(float(n) / 2.0);
        }
    }

    return result;
}
vec2 Hammersley(int i, int N)
{
    return vec2(float(i)/float(N), VanDerCorpus(i, 2));
}

vec3 ImportanceSampleGGX(vec2 Xi, vec3 N, float roughness)
{
    float a = roughness*roughness;
	
    float phi = 2.0 * PI * Xi.x;
    float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a*a - 1.0) * Xi.y));
    float sinTheta = sqrt(1.0 - cosTheta*cosTheta);
	
    // from spherical coordinates to cartesian coordinates
    vec3 H;
    H.x = cos(phi) * sinTheta;
    H.y = sin(phi) * sinTheta;
    H.z = cosTheta;
	
    // from tangent-space vector to world-space sample vector
    vec3 up        = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent   = normalize(cross(up, N));
    vec3 bitangent = cross(N, tangent);
	
    vec3 sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
    return normalize(sampleVec);
} 
float geometryGGX(float NoV,float NoL,float a){
    float a2 = a * a;
    float GGXL = NoV * sqrt((-NoL * a2 + NoL) * NoL + a2);
    float GGXV = NoL * sqrt((-NoV * a2 + NoV) * NoV + a2);
    return 0.5 / (GGXV + GGXL);
}
float distributionGGX(float nh,float rough){
    float a = rough*rough;
    float a2 = a*a;
    float f = (nh * a2 - nh) * nh + 1.0;
    float denom = PI*f*f;
    return a2/denom;
}
float GeometrySchlickGGX(float NdotV, float roughness)
{
    // note that we use a different k for IBL
    float a = roughness;
    float k = (a * a) / 2.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
float GeometrySmith(float NdotV, float NdotL, float roughness)
{
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}
`;
const fhead_calbrdfMap = `

vec2 IntegrateBRDF(float NdotV, float roughness)
{
    vec3 V;
    V.x = sqrt(1.0 - NdotV*NdotV);
    V.y = 0.0;
    V.z = NdotV;

    float A = 0.0;
    float B = 0.0; 

    vec3 N = vec3(0.0, 0.0, 1.0);
    
    const int SAMPLE_COUNT = 1024;
    for(int i = 0; i < SAMPLE_COUNT; ++i)
    {
        // generates a sample vector that's biased towards the
        // preferred alignment direction (importance sampling).
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 H = ImportanceSampleGGX(Xi, N, roughness);
        vec3 L = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(L.z, 0.0);
        float NdotH = max(H.z, 0.0);
        float VdotH = max(dot(V, H), 0.0);
       
        if(NdotL > 0.0)
        {
            float NdotV  = max(dot(N,V),0.0);
            float G = GeometrySmith(NdotV,NdotL,roughness);
            float G_Vis = (G * VdotH) / (NdotH * NdotV);
            float Fc = pow(1.0 - VdotH, 5.0);

            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }
    A /= float(SAMPLE_COUNT);
    B /= float(SAMPLE_COUNT);
    return vec2(A, B);
}

vec2 IntegrateBRDF2(float NdotV, float roughness)
{
    vec3 V;
    V.x = sqrt(1.0 - NdotV*NdotV);
    V.y = 0.0;
    V.z = NdotV;

    float A = 0.0;
    float B = 0.0;

    vec3 N = vec3(0.0, 0.0, 1.0);

    const int SAMPLE_COUNT = 1024;
    for(int i = 0; i < SAMPLE_COUNT; ++i)
    {
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 H  = ImportanceSampleGGX(Xi, N, roughness);
        vec3 L  = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(L.z, 0.0);
        float NdotH = max(H.z, 0.0);
        float VdotH = max(dot(V, H), 0.0);
        float NdotV = max(dot(N,V),0.0);

        if(NdotL > 0.0)
        {
            float G = geometryGGX(NdotV, NdotL, roughness);
            float G_Vis = (G * VdotH) / (NdotH * NdotV);
            float Fc = pow(1.0 - VdotH, 5.0);

            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }
    A /= float(SAMPLE_COUNT);
    B /= float(SAMPLE_COUNT);
    return vec2(A, B);
}

`;
const fbody_calBRDFMap = `
vec2 integratedBRDF = IntegrateBRDF(fUV.x, fUV.y);
gl_FragColor.rg = integratedBRDF;
gl_FragColor.b = 0.0;
`;



const fhead_calIBLSpec = `
uniform float roughness;
`;

const fbody_calIBLSpec = `
vec3 N = normalize(skyPos.xyz);
    
    // make the simplyfying assumption that V equals R equals the normal 
    vec3 R = N;
    vec3 V = R;
    vec3 prefilteredColor = vec3(0.0);
    float totalWeight = 0.0;
    const int SAMPLE_COUNT = 1024;
    for(int i = 0; i < SAMPLE_COUNT; ++i)
    {
        // generates a sample vector that's biased towards the preferred alignment direction (importance sampling).
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        vec3 H = ImportanceSampleGGX(Xi, N, roughness);
        vec3 L  = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(dot(N, L), 0.0);
        if(NdotL > 0.0)
        {
            // sample from the environment's mip level based on roughness/pdf
            float NdotH = max(dot(N, H), 0.0);
            float HdotV = max(dot(H, V), 0.0);
            float D   = distributionGGX(NdotH, roughness);
            float pdf = D * NdotH / (4.0 * HdotV) + 0.0001; 

            float resolution = 512.0; // resolution of source cubemap (per face)
            float saTexel  = 4.0 * PI / (6.0 * resolution * resolution);
            float saSample = 1.0 / (float(SAMPLE_COUNT) * pdf + 0.0001);

            float mipLevel = roughness == 0.0 ? 0.0 : 0.5 * log2(saSample / saTexel); 
            
            prefilteredColor += textureCube(cubeMap, L, mipLevel).rgb * NdotL;
            totalWeight      += NdotL;
        }
    }

    prefilteredColor = prefilteredColor / totalWeight;
    gl_FragColor = vec4(prefilteredColor.rgb, 1.0);
`;


// matColor, lcolor, envColor
// gl_FragColor = matColor;
// gl_FragColor = matColor*(1-ratio) + ratio*envColor;

//gl_FragColor = gl_FragColor*lcolor;

// envColor *lColor;


// const fbody_envMap_mix = `
// lcolor = mix(lcolor,envColor,reflective);
// `;
// const fbody_envMap_multi = `r
// lcolor = mix(lcolor.xyz,envColor*lcolor,reflective);
// `;
// const fbody_envMap_add =`
// lcolor += envColor*reflective;
// `;

// const fbody_envMap_mix_frag = `
// gl_FragColor.xyz = mix(gl_FragColor.xyz,envColor,reflective);
// `;
// const fbody_envMap_multi_frag = `
// gl_FragColor.xyz = mix(gl_FragColor.xyz,envColor*gl_FragColor.xyz,reflective);
// `;
// const fbody_envMap_add_frag =`
// gl_FragColor.xyz += envColor*reflective;
// `;



 //uniform mat4 modelMatrix;
 //uniform vec3 cameraPos;
 //vec3 world_normal = inverseTransformDirection(vNormal,viewMatrix);
//skyPos =reflect(normalize(((modelMatrix*vertexPos).xyz-cameraPos)), normalize(world_normal));



