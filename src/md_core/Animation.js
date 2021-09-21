/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-19 17:03:43
 * @Description: file content
 */

function TransformAni(/**@type {Scene} */scene,
    /**@type {Transform} */trans,
    aniParams) {
    var update = aniParams.update;
    aniParams.update = function (anime) {
        trans.requireUpdate();
        scene.requireUpdate();
        update(anime);
    };
    return anime(aniParams);
}
function ValueAni(aniParams) {
    var update = aniParams.update;
    aniParams.update = function (anime) {
        update(anime);
    };
    return anime(aniParams);
}

function MaterialAni(/**@type {Scene} */scene,
    /**@type {Material} */mat,
    uniKey,
    aniParams) {
    var update = aniParams.update;
    aniParams.update = function (anime) {

        var t = aniParams.targets[uniKey];
        if (typeof (t) === "number") {
            mat.setUniform(uniKey, UTypeEnumn.float, t);
        }
        mat.uDirty = true;
        scene.requireUpdate();
        update(anime);
    };
    return anime(aniParams);
}

export { TransformAni, ValueAni, MaterialAni }