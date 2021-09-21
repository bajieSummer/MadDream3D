/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-12-28 14:23:56
 * @Description: file content
 */

import { Mesh } from "./Mesh";

class GridMesh extends Mesh {
    constructor(params) {
        super();
        this.w = params.w === undefined ? 1 : params.w;
        this.h = params.h === undefined ? 1 : params.h;
        this.m = params.m === undefined ? 2 : params.m;
        this.n = params.n === undefined ? 2 : params.n;
    }
}

export { GridMesh }