/**
 * Created by Ocean on 2017/9/23.
 */
let defaultPage = null;
let currentRouter = null;
let preRouter = null;
let nextRouter = null;

export default {
    /**
     * 初始化路由参数存储，基于vuex的store实现
     * @returns 返回vuex的store对象
     */
    initStoreParams() {
      return {
          state: {}
      };
    },

    /**
     * 设置路由参数
     * @param name 页面名称
     * @param params 路由参数
     * @param context vue实例上下文
     */
    setParams(name, params, context) {
        if (!name || name === '' || !params || params === '' || !context) {
            return;
        }
        let ps = context.$store.state['routerParams'];
        ps[name] = params;
    },

    /**
     * 获取默认页面
     * @returns 默认页面名称
     */
    getDefaultPage() {
        return defaultPage;
    },

    /**
     * 设置默认页面
     * @param page
     */
    setDefaultPage(name) {
        defaultPage = name;
    },

    /**
     * 获取当前路由
     * @param context vue上下文
     * @returns 路由对象
     */
    getCurrentRouter(context) {
        if (!context) {
            return null;
        }
        currentRouter = context.$route;
        return currentRouter;
    },

    /**
     * 获取前路由
     * @returns 路由对象
     */
    getPreRouter() {
        return preRouter;
    },

    /**
     * 设置前路由
     */
    setPreRouter(router) {
        preRouter = router;
    },

    /**
     * 获取下一路由
     * @returns 路由对象
     */
    getNextRouter() {
        return nextRouter;
    },

    /**
     * 设置下一路由
     */
    setNextRouter(router) {
        nextRouter = router;
    },

    /**
     * 获取已去除参数部分的路由路径
     */
    getPath(router) {
        if (!router || router === null) {
            return;
        }
        let path = router.path;
        if (this.checkOriginRouter(router)) {
            let paths = router.path.substr(1).split('/');
            let paramsKeys = Object.keys(router.params);
            paramsKeys.forEach((item, i) => {
                paths.pop();
            });
            paths.length === 1 ? path = paths[0] : path = paths.join('/');
        }
        return path;
    },

    /**
     * 根据路由配置中的'name'值检测是否为默认页面
     */
    checkIsMainPage(routerName) {
        let path = routerName;
        let names = routerName.split('/');
        let defaults = defaultPage.split('/');
        if (names.length > 1 && defaults.length > 1) {
            let pages = [];
            names.forEach((it, j) => {
                if (!it.includes(':')) {
                    pages.push(it);
                }
                else {
                    defaults.pop();
                }
            });
            pages.length === 1 ? path = pages[0] : path = pages.join('/');
            defaults.length === 1 ? defaultPage = defaults[0] : defaultPage = defaults.join('/');
        }
        return defaultPage === path;
    },

    /**
     * 判断路由是否为'xxxx/:xx/:xx'的方式
     */
    checkOriginRouter(router) {
        if (!router || router === null) {
            return;
        }
        let params = router.params;
        let paramsKeys = Object.keys(params);
        if (paramsKeys.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

}
