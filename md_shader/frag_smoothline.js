/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-15 20:11:22
 * @Description: file content
 */

const vsSource = `
    attribute vec4 vertexPos;
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
  const fsSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    const float line_width = 2.0; 
    vec4 line_color = vec4(1.0,0.4,0.0,1.0);
    vec4 back_color = vec4(0.0,0.0,0.0,1.0);
    varying lowp vec2 vUV;
    uniform lowp vec2 u_mouse;
    uniform lowp vec2 u_resolution;

    float interplot(float start,float end, float x){
      //smoothfunction
      //return smoothstep(start,end,x);
       float lx = x/(end-start) +start;
       // linear
       //return lx;
       float T = end-start;
       return 0.4*sin(3.14159*2.0/T*lx)+0.5;
    }

    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      float delt = line_width*0.01;
      float asp = u_resolution.x/u_resolution.y;
      float x = gl_FragCoord.x/u_resolution.x;
      float y = gl_FragCoord.y/u_resolution.y;
      float ly = interplot(0.0,1.0,x);
      if(abs(y-ly)<delt){
          gl_FragColor = line_color;
      }else{
          gl_FragColor = back_color;
      }
      // if(abs(x-asp)<0.1){
      //   gl_FragColor = vec4(0.2,0.3,0.4,1.0);
      // }
      
    }
  `;