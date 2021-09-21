/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-18 16:17:02
 * @Description: file content
 */

import { MathUtil } from "./MathUtil";
import { Camera, CameraType } from "./Camera";

class SubPass {
    constructor(/**@type */mat, camera) {
        this.material = mat;
        this.targetType = CameraType.default;
        this.targetCam = null;
        this.setTarget(camera);

    }
    setTarget(camera) {
        if (MathUtil.isNone(camera)) {
            this.targetType = CameraType.default;
        } else if (camera instanceof Camera) {
            this.targetCam = camera;
            this.targetType = camera.type;
        } else {
            this.targetType = camera;
        }
    }
    getActive(/**@type {Camera} */cam, drawCall) {
        var that = this;
        if (this.targetCam !== null) {
            drawCall(that.material, that.targetCam);
        } else {
            drawCall(that.material, cam);
        }
    }
}

class Pass {
    //for hdr_fist
    //active Material
    //current target A, 

    //for bloom
    //pass1, draw color1 to A, target:A
    //pass2, loop:5 subP1:draww A to B, target:B, subP2:drawB to A
    //pass3, draw color1, A to currentCam

    // for depth
    //pass1, special target:
    constructor(/**@type {Material} */mat, camera) {

        this.subList = [new SubPass(mat, camera)];
        this.loop = 1;
    }

    getActive(/**@type {Camera} */cam, drawCall) {
        for (var i = 0; i < this.loop; i++) {
            for (var k in this.subList) {
                var subP = this.subList[k];
                subP.getActive(cam, drawCall);
            }


        }
    }
}

class PassLayer {
    setTarget(camera) {
        if (MathUtil.isNone(camera)) {
            this.targetType = CameraType.default;
        } else if (camera instanceof Camera) {
            this.targetCam = camera;
            this.targetType = camera.type;
        } else {
            this.targetType = camera;
        }
    }
    constructor(/**@type {Material} */mat, camera) {
        this.passList = [new Pass(mat, camera)];
        this.targetType = CameraType.default;
        this.targetCam = null;
        this.setTarget(camera);
    }

    add(mat, camera, passIndex) {
        var lenp = this.passList.length;
        if (passIndex > lenp) {
            console.error("out of index range,length=", lenp, "index=", passIndex);
            return false;
        }
        if (passIndex == lenp) {
            this.passList.push(new Pass(mat, camera));
        } else {
            var pass = this.passList[passIndex];
            pass.subList.push(new SubPass(mat, camera));
        }

    }

    getActive(/**@type {Camera} */cam, drawCall) {
        for (var i in this.passList) {
            var pass = this.passList[i];
            pass.getActive(cam, drawCall);
        }
    }

}

// material.getActive(cam,drawCall)

export { SubPass, Pass, PassLayer }