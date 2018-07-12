/**
 * Created by Ocean on 2017/10/23.
 */
import { core } from 'libs-core';

export default {
    /**
     * 初始化组件，基于vuex的store实现
     * @param com 组件列表
     * @returns 返回vuex的store对象
     */
    initCom(comList) {
        if(!comList || comList.length <= 0 || comList === null) {
            return {};
        }
        let obj = {};
        comList.forEach((item, i) => {
           obj[item.name] = item.com;
        });
        return {
            state: obj
        };
    },

    /**
     * 获取组件实例
     * @param name 组件名称
     * @param context vue上下文
     * @return 组件实例
     */
    getCom(name, context = core.getContext()) {
        if(!name || name === '' || !context) {
            return {};
        }
        return context.$store.state['com'][name];
    }
}
