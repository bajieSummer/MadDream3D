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
  // water, noise, shape
  const fsSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform sampler2D texture0;
    // uniform sampler2D texture1;
    // uniform sampler2D texture2;
    uniform float utime;

    varying  vec2 vUV;
    uniform  vec2 u_mouse;
    uniform  vec2 u_resolution;

    void main() {


      vec2 point = vec2(u_mouse.x,u_mouse.y); 
      float scale = u_resolution.x/u_resolution.y;
      vec2 offset = point-vec2(vUV.x,vUV.y);
      float dist = length(offset);
      
      vec2 uv =  vUV;
      offset = normalize(offset)*0.12*sin(dist*20.0+dist*dist*100.0 - utime*3.14159*10.0);
      offset =  offset*clamp((1.0-dist*dist*10.0),0.0,1.0);
        offset.y = offset.y;
        if(dist > 0.01){
          uv = uv+offset;
        }
       
      gl_FragColor =  texture2D(texture0,uv);
    }
  `;