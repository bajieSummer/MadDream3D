/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-28 14:34:32
 * @Description: file content
 */

import { Vector3 } from "./MathUtil";
import { Transform } from "./Transform";

class Light {
    constructor() {
        this.transform = new Transform();
        this.color = new Vector3(1.0, 1.0, 1.0);
        this.specular = new Vector3(1.0, 1.0, 1.0);
        this.shininess = 10.0;
        this.id = Light.createId();
        this.shadowCam = null;
        this.castShadow = false;
        this.shadowBias = 0.00001;
        this.shadowSmoothStep = 0.002;
    }

    static createId() {
        Light.id = Light.id + 1;
        return Light.id;
    }
}
Light.id = 0;

class DirectionLight extends Light {
    constructor() {
        super();
    }
}
class PointLight extends Light {
    constructor() {
        super();
        this.constant = 1.0;
        this.linear = 0.01;
        this.quadratic = 0.0001;
    }
}

export { Light, DirectionLight, PointLight }