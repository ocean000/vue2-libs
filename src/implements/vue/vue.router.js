/**
 * Created by Ocean on 2017/9/15.
 */
import vue from 'vue';
import vueRouter from 'vue-router';
import routerTool from '../router/router.tool';

vue.use(vueRouter);

let setChildren = (route) => {
    let re = [];
    if(route.hasOwnProperty('children')
        && route.children !== null
        && route.children.hasOwnProperty('routes')
        && route.children.routes !== null) {
        let df = '';
        let dfr = null;
        if(route.children.hasOwnProperty('default')) {
            df = route.children.default;
        }
        route.children.routes.forEach((item, i) => {
            let r = {
                path: item.name.toString().replace('/', ''),
                component: item.component,
                meta: {
                    title: item.title
                },
                children: []
            };
            r.children = setChildren(item);
            if(df !== '' && item.name === df) {
                dfr = r;
            }
            re.push(r);
        });
        if(df !== '' && dfr !== null) {
            re.push({
                path: '',
                component: dfr.component,
                meta: dfr.meta,
                children: dfr.children
            });
        }
    }
    return re;
};

export default class router extends vueRouter {
    constructor(rs, title) {
        if(!rs.routes || rs.routes === null)  {
            throw '路由配置不成功'
        }
        // 设置默认路由
        routerTool.setDefaultPage(rs.default);
        let routes = [];
        rs.routes.forEach((item, i) => {
            if (!item.title || item.title === '') {
                item.title = title;
            }
            let r = {
                path: '/' + item.name,
                component: item.component,
                meta: {
                    title: item.title
                },
                beforeEnter: (to, from, next) => {
                    routerTool.setPreRouter(from);
                    routerTool.setNextRouter(to);
                    next();
                }
            };
            r.children = setChildren(item);
            routes.push(r);
        });
        routes.push({
            path: '*',
            beforeEnter: (to, from, next) => {
                routerTool.setPreRouter(from);
                routerTool.setNextRouter(to);
                next('/' + routerTool.getDefaultPage());
            }
        });
        super({
            // mode: 'history',
            routes
        });
        // 在路由导航之后更新当前页面标题
        this.afterEach(route => {
            // 从路由的元信息中获取 title 属性
            if (route.meta.title) {
                document.title = route.meta.title;

                // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
                if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    const hackIframe = document.createElement('iframe');
                    hackIframe.style.display = 'none';
                    hackIframe.src = '';

                    document.body.appendChild(hackIframe);

                    setTimeout(_ => {
                        document.body.removeChild(hackIframe);
                    }, 300)
                }
            }
        });
    }
}
