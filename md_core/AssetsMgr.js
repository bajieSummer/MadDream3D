/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-03-16 11:01:56
 * @Description: file content
 */
var AssetType={
    Texture:"Texture",
    Material:"Material",
    Model:"Model"
};



class AssetsMgr{
    constructor(){
        this.assetsMap = {};
    }
    createAsset(url,type){
        if(type === AssetType.Model){
            var asset = new Asset(url);
        }
    }
    
    static getMgr(){
        if(AssetsMgr.mgr === null){
            AssetsMgr.mgr = new AssetsMgr();
        }
        return AssetsMgr.mgr;
    }
}
AssetsMgr.mgr = null;