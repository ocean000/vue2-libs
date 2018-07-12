/**
 * Created by Ocean on 2017/10/24.
 */

import {apiTool, componentTool, storeImpl, routerImpl} from '../implements/index';

export default {
    computed: {
        // 页面路由参数
        routerParams() {
            return routerImpl.getParams();
        }
    },
    methods: {
        /**
         * 跳转页面
         * @param url 地址
         * @param params 参数
         */
        goPage(url, params) {
            routerImpl.goPage(url, params);
        },

        /**
         * 回退页面
         * @param params 参数
         */
        goBack(params) {
            routerImpl.goBack(params);
        },

        /**
         * 获取存储的数据
         * @param namespace 命名空间
         * @returns 数据对象
         */
        store(namespace) {
            if (!namespace || namespace === '') {
                return {};
            }
            return storeImpl.getData(namespace);
        },

        /**
         * 获取后端接口对象
         * @param namespace 命名空间
         * @returns 接口对象
         */
        api(namespace) {
            if (!namespace || namespace === '') {
                return {};
            }
            return apiTool.getApi(namespace);
        },

        /**
         * 获取组件实例
         * @param name 组件名称
         * @returns 组件实例
         */
        com(name) {
            if (!name || name === '') {
                return {};
            }
            return componentTool.getCom(name);
        }
    }
}
