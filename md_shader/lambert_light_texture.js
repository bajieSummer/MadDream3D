/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-26 11:24:01
 * @Description: file content
 */

const light_vs = `
attribute vec4 vertexPos;
attribute vec3 vertexNormal;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
varying vec2 vUV;
varying vec3 vNormal;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vertexPos;
  vNormal = normalize((normalMatrix*vec4(vertexNormal,1.0)).xyz);
  vUV = uv;
  //vNormal = vertexNormal;
}
`;

// Fragment shader program
const light_fs = `    
precision mediump float;
struct Light{
  vec3 diffuse;
  vec3 specular;
  float shininess;
};
struct dLight{
    vec3 direction;
    Light light;
};
uniform dLight dirL[dirLightCount];
uniform vec3 ambientLight;
uniform sampler2D texture0;

varying lowp vec2 vUV;
varying vec3 vNormal;

void main() {
    vec3 diffl = vec3(0.0);
    for (int i =0;i<dirLightCount ;i++){
      diffl  =diffl + dirL[i].light.diffuse*max(dot(vNormal,-1.0*dirL[i].direction),0.0);
    }
     diffl =diffl+ ambientLight;
    gl_FragColor = texture2D(texture0,vUV);
    gl_FragColor.rgb = gl_FragColor.rgb*diffl;

}
`;