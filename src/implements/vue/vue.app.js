/**
 * Created by Ocean on 2017/9/18.
 */
import vue from 'vue';
import { core } from 'libs-core';
import configTool from '../configs/config.tool';
import router from './vue.router';
import store from './vue.store';

class vueApp extends vue {
    /**
     * vue构造函数
     * @param options：
     * {
            title,
            appPage,
            modules: {
                route,
                store,
                api,
                component
            },
            environments: {
                    base,
                    dev: {
                        run,
                        config
                    },
                    prod: {
                        run,
                        config
                    },
                    test: {
                        run,
                        config
                    }
            }
        }
     */
    constructor(options) {
        // 检测配置是否有效
        checkVueOptions(options);

        // 初始化全局配置
        if(options.hasOwnProperty('environments') && options.environments !== null && options.environments !== {}) {
            initConfig(options.environments);
        }

        super({
            router: new router(options.modules.route, options.title),
            store: new store(options.modules.store, options.modules.api, options.modules.component),
            render: h => h(options.appPage)
        });

        core.setContext(this);
    }
}

let checkVueOptions = (options) => {
    if(!options.hasOwnProperty('appPage')) {
        throw '缺少app页面配置'
    }
    if(!options.hasOwnProperty('modules')) {
        throw '缺少全局模块配置'
    }
    if(!options.modules.hasOwnProperty('route')) {
        throw '缺少路由模块配置'
    }
    if(!options.modules.hasOwnProperty('store')) {
        throw '缺少存储模块配置'
    }
    if(!options.modules.hasOwnProperty('api')) {
        throw '缺少后端接口模块配置'
    }
    if(!options.hasOwnProperty('environments') || options.environments === null || options.environments === {}) {
       //  throw '缺少环境定义配置'
    }
    else {
        let env = options.environments;
        if(!env.hasOwnProperty('dev') && !env.hasOwnProperty('prod') && !env.hasOwnProperty('test')) {
            throw '项目至少要包含一个环境定义，环境定义有：\n' + 'dev------开发环境\n' + 'prod------生产环境\n' + 'test------测试环境'
        }
        if(env.hasOwnProperty('dev')) {
            if(!env.dev.hasOwnProperty('run') || env.dev.run === null) {
                throw '没有关于dev环境的执行定义';
            }
            if(!env.dev.hasOwnProperty('config') || env.dev.config === null) {
                throw '没有关于dev环境的配置';
            }
        }
        if(env.hasOwnProperty('prod')) {
            if(!env.prod.hasOwnProperty('run') || env.prod.run === null) {
                throw '没有关于prod环境的执行定义';
            }
            if(!env.prod.hasOwnProperty('config') || env.prod.config === null) {
                throw '没有关于prod环境的配置';
            }
        }
        if(env.hasOwnProperty('test')) {
            if(!env.test.hasOwnProperty('run') || env.test.run === null) {
                throw '没有关于test环境的执行定义';
            }
            if(!env.test.hasOwnProperty('config') || env.test.config === null) {
                throw '没有关于test环境的配置';
            }
        }
    }
}

let initConfig = (env) => {
    let config = null;
    let baseConfig = env.hasOwnProperty('base') ? env.base : null;
    if(env.hasOwnProperty('dev') && env.dev.run) {
        config = mergeBaseConfig(env.dev.config, baseConfig);
    }
    else if(env.hasOwnProperty('prod') && env.prod.run) {
        config = mergeBaseConfig(env.prod.config, baseConfig);
    }
    else if(env.hasOwnProperty('test') && env.test.run) {
        config = mergeBaseConfig(env.test.config, baseConfig);
    }
    if (config === null) {
        throw '初始化环境配置失败';
    }
    configTool.init(config);
}

let mergeBaseConfig = (config, baseConfig) => {
    if (!config) {
        config = null;
    }
    if (baseConfig && baseConfig !== null) {
        return config !== null ? Object.assign({}, config, baseConfig) : null;
    }
    else {
        return config;
    }
}

let checkConfig = () => {
    /*if (!baseConfig || baseConfig === null) {
        throw '找不到配置文件base.config.js';
    }
    if (!devConfig || devConfig === null) {
        throw '找不到配置文件dev.config.js';
    }
    if (!prodConfig || prodConfig === null) {
        throw '找不到配置文件prod.config.js';
    }*/
}

export {
    vue,
    vueApp
}



