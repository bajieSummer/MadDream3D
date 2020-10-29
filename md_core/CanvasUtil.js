/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-02 11:13:23
 * @Description: file content
 */
class CanvasUtil{
    static initCanvas(canvasId){
        // init Canvas
        var canvas = document.getElementById(canvasId);
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        //canvas.addEventListener("touchmove",responseToMouse,false);
        /** @type {WebGLRenderingContext} */
        var gl = canvas.getContext("webgl");
        if (gl === null){
            gl = canvas.getContext("experimental-webgl");
        }
        if (gl === null){
            alert("Unable to initialize the webgl context");
        }
        /** @type {WebGLRenderingContext} */
        return  gl;    
    }
}
