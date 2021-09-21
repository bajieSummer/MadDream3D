/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-15 20:11:22
 * @Description: file content
 */

const simple_vs = `
    attribute vec4 vertexPos;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vertexPos;
    }
  `;

  // Fragment shader program
  const simple_fs = `
  void main() {
    gl_FragColor = vec4(0.3,0.4,0.5,1.0);
  }
  `;