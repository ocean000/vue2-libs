/**
 * Created by Ocean on 2017/9/18.
 */
import { core, IBroadcast } from 'libs-core';

let broadcastImpl = core.implement(IBroadcast);

/**
 * 实现广播消息接口
 * @param name 消息名称
 * @param params 消息参数
 * @param context vue实例上下文
 */

broadcastImpl.broadcast = (name, params, context = core.getContext()) => {
    if(!context || context === null) {
        return;
    }
    context.$emit(name, params);
};

/**
 * 实现监听消息接口
 * @param name 消息名称
 * @param func 监听方法
 * @param context vue实例上下文
 */
broadcastImpl.listen = (name, func, context = core.getContext()) => {
    if(!context || context === null) {
        return;
    }
    context.$on(name, func);
};

export default broadcastImpl;
