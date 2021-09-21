/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-15 20:11:22
 * @Description: file content
 */

const vcolor_vs = `
    attribute vec4 vertexPos;
    attribute vec4 vertexColor;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    varying lowp vec4 vColor;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vertexPos;
      vColor = vertexColor;
    }
  `;

  // Fragment shader program
  const vcolor_fs = `
  varying lowp vec4 vColor;
  void main() {
    gl_FragColor = vColor;
  }
  `;