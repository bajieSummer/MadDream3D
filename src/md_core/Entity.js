/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-18 23:30:25
 * @Description: file content
 */
import { Transform } from "./Transform";
import { RenderLayer } from "./Render";

class Entity {
    constructor(name) {
        /**@type {Transform} */
        this.transform = new Transform();
        this.name = name;
        this.id = Entity.createId();
        /** @type {Mesh} */
        this.mesh = null;
        /**@type {Material} */
        this.material = null;
        //this.depthMaterial = null;
        this.renderLayer = RenderLayer.default;
    }
    copy(name) {
        if (name === null) {
            name = this.name + "copy";
        }
        var nent = new Entity(name);
        nent.mesh = this.mesh;
        nent.material = this.material;
        nent.transform.copyFrom(this.transform);
        //nent.depthMaterial = this.depthMaterial;
        return nent;
    }
    static createId() {
        Entity.id = Entity.id + 1;
        return Entity.id;
    }

    setRenderLayer(layer) {
        this.renderLayer = layer;
    }

    getRenderLayer() {
        return this.renderLayer;
    }

    // getActiveMaterial(/**@type {Camera}*/camera){
    //     if(!MathUtil.isNone(camera.renderTarget) &&
    //         !camera.renderTarget.hasColorBuffer &&
    //          !MathUtil.isNone(this.depthMaterial)){
    //             return this.depthMaterial;
    //          }else{
    //              return this.material;
    //          }
    // }


}
Entity.id = 0;

export { Entity };