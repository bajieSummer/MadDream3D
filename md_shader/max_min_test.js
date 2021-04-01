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
      //gl_FragColor  = vColor;
     // vec2 mid = vec2(0.0,-5.0);
      float maxd = 10.0;

      float dist = distance(u_mouse,vPos.xy)/maxd;
    float m1 = (dist-vColor.g)/(vColor.r-vColor.g);
     float m2 = (dist-u_resolution.y)/(u_resolution.x-u_resolution.y);
      m1 = max(min(m1,1.0),0.0);
      m2 = max(min(m2,1.0),0.0);
      float alpha =m1*0.5 + m2*0.5;
      gl_FragColor = vec4(1.0,1.0,alpha,1.0);
    }
  `;