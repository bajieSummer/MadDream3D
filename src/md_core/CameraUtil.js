/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-13 19:53:44
 * @Description: file content
 */

import { ClearMask, Camera, CameraType } from "./Camera";
import { RenderLayer, RenderMask } from "./Render";
import { RenderTexture } from "./RenderTexture";

class CameraUtil {
    static createDefaultCamera(asp) {
        if (asp === undefined) {
            asp = 1.77;
        }
        var cam = CameraUtil.createCamera(45, 0.1, 100, asp);
        /**@type {Transform} */
        var transform = cam.transform;
        transform.setPosition(0, 0, 8);
        cam.name = "default_camera";
        return cam;
    }

    static createCamera(fov, near, far, asp) {
        var cam = new Camera();
        cam.setFov(fov);
        cam.setFar(far);
        cam.setNear(near);
        cam.setAsp(asp);
        return cam;
    }

    static createRTCamera(rt_w, rt_h, type, layers) {
        var cam = CameraUtil.createDefaultCamera(rt_w / rt_h);
        var rt = new RenderTexture("Camera", rt_w, rt_h);
        cam.renderTarget = rt;
        cam.type = type;
        cam.renderMask = RenderMask.layers;
        for (var i in layers) {
            var ly = layers[i];
            cam.addRenderLayer(ly);
        }
        return cam;
    }


    static createShadowCamera(rt_w, rt_h, isOrtho, lightPos) {
        if (isOrtho === undefined) {
            isOrtho = true;
        }
        var w = rt_w;
        var h = rt_h;
        var asp = w / h;
        var camDepth = 30;
        var fov = 60.0;
        var near = 0.1;
        var far = 100.0;
        if (isOrtho) {
            fov = 170.0;
            near = 0.5;
            far = 100.0;
        }
        var cam = CameraUtil.createCamera(fov, near, far, asp);
        var rt = new RenderTexture("Camera", w, h);
        rt.hasColorBuffer = false;
        cam.renderTarget = rt;
        cam.switchProjection(isOrtho);
        cam.clearMask = ClearMask.onlyDepth;
        cam.name = "shadow_camera";
        cam.depth = camDepth;
        cam.type = CameraType.depth;
        cam.renderMask = RenderMask.layers;
        cam.addRenderLayer(RenderLayer.default);
        cam.transform.setPosition(lightPos.x, lightPos.y, lightPos.z);
        // console.log("sum Simulator>>Debug1:rot> pos>",cam.transform.rot,cam.transform.pos);

        cam.transform.lookAt(0, 0, 0);
        //console.log("sum Simulator>>Debug: rot> pos>",cam.transform.rot,cam.transform.pos);
        return cam;
    }
}

export { CameraUtil }