/**
 * Created by Ocean on 2017/9/4.
 */
import { core, IStorage } from 'libs-core';

let storageImpl = core.implement(IStorage);

/**
 * 实现存储getData接口
 * @param key state的键
 * @param context vue实例上下文
 * @returns 返回vuex的state值
 */
storageImpl.getData = (key, context = core.getContext()) => {
    if(!key || key === '' || !context) {
        return {};
    }
    let ns = key.split('.');
    let state = context.$store.state['storage'][ns.shift()];
    ns.forEach((item, i) => {
        state = state[item];
    });
    return state;
};

/**
 * 实现存储setData接口
 * @param key state的键
 * @param value vuex的state值
 * @param context vue实例上下文
 */
storageImpl.setData = (key, value, context = core.getContext()) => {
    if(!key || key === '' || !context) {
        return {};
    }
    let ns = key.split('.');
    let state = context.$store.state['storage'][ns.shift()];
    ns.forEach((item, i) => {
        state = state[item];
    });
    state = value;
};

export default storageImpl;
