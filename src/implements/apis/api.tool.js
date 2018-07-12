/**
 * Created by Ocean on 2017/9/8.
 */
import { core } from 'libs-core';

export default {
    /**
     * 初始化后端接口，基于vuex的store实现
     * @param api 后端接口对象
     * @returns 返回vuex的store对象
     */
    init(api) {
        return {
            state: api
        };
    },

    /**
     * 获取后端接口对象
     * @param namespace 命名空间
     * @param context vue实例上下文
     * @returns 后端接口对象
     */
    getApi(namespace, context = core.getContext()) {
        if(!namespace || namespace === '' || !context) {
            return {};
        }
        return context.$store.state['api'][namespace];
    }
}
