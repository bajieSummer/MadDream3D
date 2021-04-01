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
    invariant varying lowp vec4 vColor;
    varying lowp vec3 vPos;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vertexPos;
      gl_PointSize = 40.0; 
      vColor = vertexColor;
      vUV = uv;
      vPos = vertexPos.xyz;
    }
  `;

  // Fragment shader program
  const fsSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    invariant varying lowp vec4 vColor;
    varying lowp vec2 vUV;
    varying lowp vec3 vPos;
    uniform lowp vec2 u_mouse;
    uniform lowp vec2 u_resolution;

    void main() {
      gl_FragColor  = vColor;
    
      //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
       //float asp = u_resolution.x/u_resolution.y;
      //float x = asp*(gl_FragCoord.x/560.0);
      //float y = gl_FragCoord.y/560.0;

      // float r = u_mouse.x/u_resolution.x;
      // float g = u_mouse.y/u_resolution.y;

    }
  `;