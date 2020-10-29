/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-08 18:04:07
 * @LastEditTime: 2020-10-28 11:31:15
 * @Description: file content
 */
class Asset{
    constructor(url){
        this.url = url;
        this.id = Asset.getId();
    }
    static getId(){
        Asset.id +=1;
        return Asset.id;
    }
}
Asset.id = -1;