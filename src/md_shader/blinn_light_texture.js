/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-26 11:24:01
 * @Description: file content
 */

const blinn_light_vs = `
attribute vec4 vertexPos;
attribute vec3 vertexNormal;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
varying vec2 vUV;
varying vec3 vNormal;
varying vec4 viewPos;

void main() {
  viewPos = modelViewMatrix * vertexPos;
  gl_Position = projectionMatrix * viewPos;
  vNormal = normalize((normalMatrix*vec4(vertexNormal,1.0)).xyz);
  vUV = uv;
  //vNormal = vertexNormal;
}
`;

// Fragment shader program
const blinn_light_fs = `    
precision mediump float;
struct Light{
  vec3 diffuse;
  vec3 specular;
  float shininess;
};
struct pointLight{
  Light light;
  vec3 position;
  vec3 params;  //constant,linear,quadratic;
};
struct dLight{
vec3 direction;
Light light;
};
//#define dirLightCount 1
//#define pointLightCount 0
uniform dLight dirL[dirLightCount+1];
uniform pointLight pointL[pointLightCount+1];
uniform vec3 ambientLight;
uniform sampler2D texture0;
varying vec4 viewPos;
varying lowp vec2 vUV;
varying vec3 vNormal;

void calLight(inout vec3 lcolor, vec3 eyeDir, vec3 direction, Light lt){
    lcolor  =lcolor + lt.diffuse*max(dot(vNormal,-1.0*direction),0.0);
    vec3 refDir = reflect(direction,vNormal);
    lcolor = lcolor + pow(max(dot(eyeDir,refDir),0.0),lt.shininess)*lt.specular;
}
void calDirLights(inout vec3 lcolor,vec3 eyeDir){
  for (int i =0;i<dirLightCount;i++){
      calLight(lcolor,eyeDir,dirL[i].direction,dirL[i].light);
  }
}
void calPointLights(inout vec3 lcolor, vec3 eyeDir){
    for(int i=0; i<pointLightCount; i++){
      float distance = length(pointL[i].position +eyeDir);
      float intst = pointL[i].params.x + distance*pointL[i].params.y + distance*distance*pointL[i].params.z;
      vec3 direction  = normalize(viewPos.xyz-pointL[i].position);
      calLight(lcolor,eyeDir,direction,pointL[i].light);
      lcolor = 1.0/intst*lcolor;
    }
}
void main() {
    vec3 lcolor = vec3(0.0);
    vec3 eyeDir = normalize(-1.0*viewPos.xyz);
    calDirLights(lcolor,eyeDir);
    calPointLights(lcolor,eyeDir);
    lcolor =lcolor+ ambientLight;
    gl_FragColor = texture2D(texture0,vUV);
    gl_FragColor.rgb = gl_FragColor.rgb*lcolor;
    //gl_FragColor.rgb = vec3(1.0);
}
`;