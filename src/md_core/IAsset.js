/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-11-25 11:57:33
 * @Description: file content
 */
class IAsset {
    constructor(id) {
        this.id = IAsset.getId();
    }
    static getId() {
        IAsset.id += 1;
        return IAsset.id;
    }
}
IAsset.id = -1;

export { IAsset };