/**
 * Created by Ocean on 2017/9/4.
 */
import { core, IRouter } from 'libs-core';
import routerTool from './router.tool';

let routerImpl = core.implement(IRouter);

/**
 * 实现跳转页面接口
 * @param url 页面地址
 * @param params 页面参数
 * @param context vue上下文
 */
routerImpl.goPage = (url, params, context = core.getContext()) => {
    if(!context) {
        return;
    }
    if(url.substr(0, 1) === '/') {
        url = url.substr(1);
    }
    context.$router.push('/' + url, () => {
        let nextRouter = routerTool.getNextRouter();
        if(nextRouter && nextRouter !== null && !routerTool.checkOriginRouter(nextRouter)) {
            routerTool.setParams(nextRouter.path, params, context);
        }
    });

    routerTool.isGoPageForward = true;
};

/**
 * 实现回退页面接口
 * @param params 页面参数
 * @param context vue上下文
 */
routerImpl.goBack = (params, context = core.getContext()) => {
    if(!context) {
        return;
    }
    context.$router.go(-1);
};

/**
 * 实现获取路由参数接口
 * @param context vue实例上下文
 */
routerImpl.getParams = (context = core.getContext()) => {
    if(!context) {
        return;
    }
    let router = routerTool.getCurrentRouter(context);
    if(!router || router === null) {
        return;
    }
    if(routerTool.checkOriginRouter(router)) {
        return context.$route.params;
    }
    else {
        let params = context.$store.state['routerParams'];
        let name = router.path;
        if (params.hasOwnProperty(name) || !context) {
            return params[name];
        }
        else {
            return null;
        }
    }
};

/**
 * 跳转页面，覆盖历史记录
 * @param url 页面地址
 * @param context vue上下文
 */
routerImpl.replace = (url, params, context = core.getContext()) => {
    if(!context) {
        return;
    }
    if(url.substr(0, 1) === '/') {
        url = url.substr(1);
    }
    context.$router.replace('/' + url, () => {
        let nextRouter = routerTool.getNextRouter();
        if(nextRouter && nextRouter !== null && !routerTool.checkOriginRouter(nextRouter)) {
            routerTool.setParams(nextRouter.path, params, context);
        }
    });
};

export default routerImpl;
