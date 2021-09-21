/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-15 20:11:22
 * @Description: file content
 */

const vsSource = `
    attribute vec4 vertexPos;
    attribute vec4 vertexColor;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying lowp vec2 vUV;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vertexPos;
      vUV = uv;
    }
  `;

  // Fragment shader program
  // fire, noise, shape
  const fsSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform sampler2D texture0;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform float utime;

    varying lowp vec2 vUV;
    uniform lowp vec2 u_mouse;

    void main() {
        vec3 uvScale = vec3(1.0,2.0,3.0);
        vec3 uvSpeed = vec3(1.3,2.1,2.3);
        vec2 ntx1 = vUV*uvScale.x;
        ntx1.y = ntx1.y+utime*uvSpeed.x;
        vec2 ntx2 = vUV*uvScale.y;
        ntx2.y = ntx2.y+utime*uvSpeed.y;
        vec2 ntx3 = vUV*uvScale.z;
        ntx3.y = ntx3.y+utime*uvSpeed.z;

vec2 noise1 = texture2D(texture1,ntx1).xy;
vec2 noise2 = texture2D(texture1,ntx2).xy;     
vec2 noise3= texture2D(texture1,ntx3).xy;
vec2 distort1=vec2(0.1,0.2); 
vec2 distort2=vec2(0.1,0.3);
vec2 distort3=vec2(0.1,0.1);
noise1 = (noise1 - vec2(0.5)) * 2.0*distort1;
noise2 = (noise2 - vec2(0.5)) * 2.0*distort2;
noise3 = (noise3 - vec2(0.5)) * 2.0*distort3;
vec2  finalNoise = noise1 + noise2 + noise3;
float perturb = (1.0 - vUV.y) * 0.7 + 0.4;
vec2 fuv = finalNoise*perturb+vUV;
      gl_FragColor = texture2D(texture0,fuv);
      gl_FragColor.a =texture2D(texture2,fuv).b;
    }
  `;