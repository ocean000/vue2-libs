/**
 * Created by Ocean on 2017/9/15.
 */
import vue from 'vue';
import vuex from 'vuex';
import storeTool from '../storage/store.tool';
import apiTool from '../apis/api.tool';
import routerTool from '../router/router.tool';
import componentTool from '../component/component.tool';

vue.use(vuex);
let vueStore = vuex.Store;
export default class store extends vueStore {
    constructor(storeConf, apiConf, comConfig) {
        super({
            modules: {
                storage: {
                    modules: createOptions(storeConf, 0)
                },
                api: {
                    modules: createOptions(apiConf, 1)
                },
                com: componentTool.initCom(comConfig),
                routerParams: routerTool.initStoreParams()
            }
        });
    }
}

/**
 * 创建store选项
 * @param conf 配置文件
 * @param type 配置文件类型，0：storage，1：api
 * @returns store选项
 */
let createOptions = (conf, type) => {
    if(!conf || conf === null || conf.length <= 0) {
        return {};
    }
    let re = {};
    conf.forEach((item, i) => {
        let ns = item['namespace'].split('.');
        let value = {};
        switch(type) {
            case 0:
                value = storeTool.createStore(item['store']);
                break;
            case 1:
                value = apiTool.init(item['api']);
                break;
        }
        if(ns.length === 1) {
            re[ns[0]] = value;
        }
        else{
            let first = ns.shift();
            re[first] = {};
            let n = {
                modules: {}
            };
            let child = n['modules'];
            ns.forEach((it, j) => {
                if(j === (ns.length - 1)) {
                    child[it] = value;
                }
                else {
                    child[it] = {
                        modules: {}
                    };
                    child = child[it]['modules'];
                }
            })
            re[first] = n;
        }
    });
    return re;
};
