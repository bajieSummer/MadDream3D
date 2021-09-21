/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-11-25 11:58:08
 * @Description: file content
 */

import { IAsset } from "./IAsset";

class MacroAsset extends IAsset {
    constructor() {
        super();
        this.urls = [];
        //this.assetsList =[];
        this.loadCount = 0;
        this.res = null;
    }
    loadByHttp(url, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    var text = rawFile.responseText;
                    callback(text);
                }
            }
        };
        rawFile.open("GET", url, true);
        rawFile.send();
    }

    load(url, params, callback) {
        if (url instanceof (Array)) {
            this.urls = url;
        } else {
            this.urls[0] = url;
        }
        this.count = this.urls.length;
        // if (params === undefined) params = new Map();
        params.asset = this;
        var that = this;
        var fload = function (text) {

            //begain to parse
            var parse = new (AssetsManager.getManager().getParser(that.urls[i]));
            var ms = parse.parse(text, params);
            if (that.res === null) {
                that.res = ms;
            } else {
                that.res.push.apply(that.res, ms);
            }
            that.count--;
            if (callback !== null && that.count === 0) {
                callback(that.res);
            }

        };

        for (var i in this.urls) {
            this.loadByHttp(this.urls[i], fload);
        }
    }


}

export { MacroAsset }