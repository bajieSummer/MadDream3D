/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-03-09 12:45:07
 * @Description: file content
 */
#define DF_RADIANCEMAP
#define DF_TEX_LOD
#define DF_DERIVATIVES

precision mediump float;

#define saturate(a) clamp( a, 0.0, 1.0 )

    varying vec2 vUV;

    uniform mat4 normalMatrix;
    uniform sampler2D normalMap;
    varying mat3 TBN;

uniform sampler2D texture0;

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

uniform vec3 ambientLight;
varying vec4 viewPos;


uniform sampler2D aoMap;

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

    uniform sampler2D roughMap;

    uniform sampler2D metalMap;

uniform mat4 viewMatrix;
const int MAX_REF_LOD = 9;
#extension GL_EXT_shader_texture_lod : enable
#extension GL_OES_standard_derivatives : enable

vec3 fresnelSchlickRoughness(vec3 f0,float cosTheta, float rfs)
{
    return f0 + (max(vec3(1.0 - rfs), f0) - f0) * pow(1.0 - cosTheta, 5.0);
}   
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

vec3 getIBLIradianceColor(const samplerCube iradMap, float mip,vec3 kS,vec3 wN){
    #ifdef DF_TEX_LOD
    vec3 iblDiffuse = textureCubeLodEXT(iradMap,wN,mip).rgb;
    #else
    vec3 iblDiffuse = textureCube(iradMap,wN,mip).rgb;
    #endif
   
    vec3 kD = 1.0 - kS;
    kD *=1.0 - metal; 
    return kD * iblDiffuse;
}


float getSpecularMIPLevel( const in float roughness, const in int maxMIPLevel ) {
    float maxMIPLevelScalar = float( maxMIPLevel );
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

vec3 getIBLSpecColor(const samplerCube radMap, float specRough, vec3 R, float nv, vec3 kS,vec2 dfg){
    //float mipF = fract(specMip);
    //float mipInt = floor(specMip);
    //vec3 color0 = textureCube(radMap,R,mipInt).rgb;
    //vec3 color1 = textureCube(radMap,R,mipInt+1.0).rgb;
    //vec3 iblSpecular = mix(color0,color1,mipF);
    //vec2 dfg = texture2D(lutMap,vec2(nv,rough)).xy;
    
    float specMip = getSpecularMIPLevel(specRough,MAX_REF_LOD);
    #ifdef DF_TEX_LOD
        vec3 iblSpecular =  textureCubeLodEXT(radMap,R,specMip).rgb;
    #else
        vec3 iblSpecular =  textureCube(radMap,R,specMip).rgb;
    #endif
    return (kS*dfg.x+dfg.y)*iblSpecular;
}

uniform samplerCube radianceMap;
#ifdef DF_LUTMAP
uniform sampler2D  lutMap;
#endif

 #define pointLightCount 1
 
struct pointLight{
Light light;
vec3 position;
vec3 params;  //constant,linear,quadratic;
};
uniform pointLight pointL[pointLightCount+1];

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
}void main(){

    vec2 fUV = vUV;

    vec3 texn = texture2D(normalMap,fUV).rgb*2.0-1.0;
    vec3 vNormal = normalize((normalMatrix*vec4(TBN*texn,1.0)).xyz);

    gl_FragColor =  texture2D(texture0,fUV);

    vec3 lcolor = vec3(0.0);
    vec3 lspec = vec3(0.0);
    vec3 ambient = vec3(0.0);
    vec3 eyeDir = normalize(-1.0*viewPos.xyz);
    
    rough *= min(texture2D(roughMap,fUV).x,1.0);

    rough *= roughness;
    rough = clamp(rough,0.0,1.0);
    metal = clamp(metal,0.0,1.0);

   
    metal *= texture2D(metalMap,fUV).x;

    metal *= metalness;

ao = texture2D(aoMap,fUV).r;



gl_FragColor.r= pow(gl_FragColor.r, 2.2);
gl_FragColor.g= pow(gl_FragColor.g, 2.2);
gl_FragColor.b= pow(gl_FragColor.b, 2.2);
    F0 = mix(F0,gl_FragColor.rgb,metal);
    //gl_FragColor = LinearTosRGB(gl_FragColor);

    

vec3 wN = inverseTransformDirection(vNormal,viewMatrix);
float nv = clamp(dot(vNormal, eyeDir),0.0,1.0);
vec3 kS = fresnelSchlickRoughness(F0,nv,rough);
#ifdef DF_IRRADIANCEMAP
vec3 iradColor = getIBLIradianceColor(irradianceMap,0.0,kS,wN);
#else
vec3 iradColor = getIBLIradianceColor(radianceMap,float(MAX_REF_LOD),kS,wN);
#endif

ambient += iradColor*gl_FragColor.rgb*ao;

vec3 R = reflect(-1.0*eyeDir, vNormal);
R =  inverseTransformDirection(R,viewMatrix);
float specRough = getSpecRough(vNormal,rough);
#ifdef DF_LUTMAP
    vec2 dfg = texture2D(lutMap,vec2(nv,rough)).xy;
#else
    vec2 dfg = integrateSpecularBRDF(nv,rough);
#endif
vec3 iblSpecular  = getIBLSpecColor(radianceMap,specRough,R,nv,kS,dfg);
float spAo = computeSpecularOcclusion(nv,ao,specRough);
iblSpecular *= spAo;
ambient +=iblSpecular;

    calPointLights(lcolor,lspec,eyeDir,vNormal);

ambient +=ambientLight*gl_FragColor.rgb;
gl_FragColor.rgb = gl_FragColor.rgb*lcolor+ambient;

    gl_FragColor.rgb = gl_FragColor.rgb+lspec;


    gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);
  

//gl_FragColor.rgb = gl_FragColor.rgb/(vec3(1.0)+gl_FragColor.rgb);
    gl_FragColor.rgb = pow(gl_FragColor.rgb,vec3(0.4545));
  //  gl_FragColor.a = 1.0;
}