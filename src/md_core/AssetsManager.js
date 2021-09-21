/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-03-16 11:01:56
 * @Description: file content
 */
const AssetType = {
    Texture: "Texture",
    Material: "Material",
    Model: "Model"
};



class AssetsManager {
    constructor() {
        this.assetsMap = new Map();
        this.parsersMap = new Map();
    }
    // createAsset(url,type){
    //     if(type === AssetType.Model){
    //         var asset = new Asset(url);

    //     }
    // }

    registerParser(extension, classFunc) {
        if (this.parsersMap[extension] !== undefined) {
            console.warn("the parser for", extension, "already existed");
            return false;
        }
        this.parsersMap.set(extension, classFunc);
    }

    unregisterPaser(extension) {
        this.parsersMap.set(extension, undefined);
    }

    getParser(url) {
        var m = url.split(".");
        return this.parsersMap.get(m[m.length - 1]);
    }

    load(url, params, callback) {
        var m = new MacroAsset();
        m.load(url, params, callback);
        this.assetsMap.set(m.id, m);
    }


    static getManager() {
        if (AssetsManager.manager === null) {
            AssetsManager.manager = new AssetsManager();
        }
        return AssetsManager.manager;
    }
}
AssetsManager.manager = null;

export { AssetsManager }