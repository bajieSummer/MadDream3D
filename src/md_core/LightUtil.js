/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-15 19:36:00
 * @Description: file content
 */

import { CameraUtil } from "./CameraUtil";
import { PointLight, DirectionLight } from "./Light";

class LightUtil {
    static createShadowLight(w, h, lp, castShadow, isPoint) {
        // directionLight
        var dlt = null;
        //pointLight
        if (isPoint) {
            dlt = new PointLight();
            dlt.transform.setPosition(lp.x, lp.y, lp.z);
            dlt.constant = 0.95;
            dlt.linear = 0.07;
            dlt.quadratic = 0.001;

        } else {
            isPoint = false;
            dlt = new DirectionLight();
            dlt.transform.setPosition(lp.x, lp.y, lp.z);
        }
        if (castShadow) {
            var sh_cam = CameraUtil.createShadowCamera(w, h, !isPoint, lp);
            dlt.castShadow = true;
            dlt.shadowCam = sh_cam;
            var smooth_st = 1.0 / w * 2.5;
            dlt.shadowBias = 0.00001;
            dlt.shadowSmoothStep = smooth_st;
        }
        return dlt;

    }
}

export { LightUtil }