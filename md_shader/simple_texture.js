/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-26 11:24:01
 * @Description: file content
 */

const simple_texture_vs = `
attribute vec4 vertexPos;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUV;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vertexPos;
  vUV = uv;
}
`;

// Fragment shader program
const simple_texture_fs = `
precision mediump float;
uniform sampler2D texture0;
varying vec2 vUV;
void main() {
  vec2 mt = vec2(0.5,0.5);
gl_FragColor =  texture2D(texture0,vUV);
//gl_FragColor =  texture2D(texture0,mt);
//gl_FragColor.r = 0.5;
//gl_FragColor = vec4(0.2,0.5,0.6,1.0);
}
`;