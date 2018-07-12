/**
 * Created by Ocean on 2017/9/13.
 */

export default {
    /**
     * 是否为ios端
     */
    get ios() {
        let u = navigator.userAgent;
//                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        let isIOS = /iphone|ipad|ipod/.test(u.toLowerCase());
        return isIOS;
    },

    /**
     * 是否为安卓端
     */
    get android() {
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        return isAndroid;
    },

    /**
     * 是否为pc端
     */
    get pc() {
        return !this.ios && !this.android;
    }
}
