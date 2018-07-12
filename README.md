# vue2-libs

> 针对移动端Vue2项目开发的底层框架，方便通用，定义了一套开发规范。

vue2-libs希望开发人员在实际的项目开发过程中能集中精力到页面的业务逻辑上，不用再过多关心使用vue框架带来的技术问题，包括框架版本管理，
框架升级带来的变化（尤其是重大的变化），框架自身的bug造成的坑，框架中高级技术学习成本高等问题。

vue2-libs提供一套开发规范，使代码总体上变得简洁清晰，降低后期维护成本，而且能有效解决代码因不同人编写而造成的风格不统一和不规范等问题。

vue2-libs基于“配置管理”和“随时可用”的原则，项目中只要提供相应的配置文件，通过调用已规范的接口，即可实现相关逻辑。

vue2-libs目前提供四大模块功能，分别为：路由、存储、后端接口调用和组件调用，这些模块在页面逻辑上都提供了便捷的接口，能满足目前大多数的使用需求。

## Installation
npm install vue2-libs

## Usage

### 快速起步
* 定义三个模块的配置文件：
   * __router.index.js__：
   
    ```
        export default {
            default: 'demo1',
            routes: [
               {name: 'demo1', component: () => import('../pages/demo1.vue')},
               {name: 'demo2', component: () => import('../pages/demo2.vue')},
               {name: 'demo3', component: () => import('../pages/demo3.vue')},
            ]
        }
    ```
   * __store.index.js__：

    ```
        let demo1 = {
            data1: 'demo1Data1',
            data2: 'demo1Data2'
        }
        let demo2 = {
            data1: 'demo2Data1',
            data2: 'demo2Data2'
        }
        export default [
            {namespace: 'demo1', store: demo1},
            {namespace: 'demo2', store: demo2}
        ]
    ```
   * __api.index.js__：

    ```
        let demo1 = {
            getDmo1Data() {
                ......
            }
        }
        let demo2 = {
            getDemo2Data() {
                ......
            }
        }
        export default [
            {namespace: 'demo1', api: demo1},
            {namespace: 'demo2', api: demo2}
        ]
    ```
* 在项目中初始化：

    ```
        import { vueApp } from 'vue2-libs';
        import app from './app.vue';
        import api from './api.index';
        import router from './router.index';
        import store from './store.index';
        new vueApp({
           title: 'vue项目',
           appPage: app,
           modules: {
               route: router,
               store: store,
               api: api
           }
        }).$mount('#app');
    ```
* 在项目中使用：
   * __demo1.vue__:

    ```
        import { pageCore } from 'vue2-libs';
        export default {
            mixins: [pageCore],
            data() {
                return {
                    // 获取存储的数据
                    testData: this.store('demo1').data1;
                }
            },
            methods: {
                goToDemo2() {
                    // 跳转页面
                    this.goPage('demo2', { param1: 'p1', param2: 'p2' })
                },
                getData() {
                    // 后端接口调用
                    this.api('demo1').getDmo1Data();
                }
            }
        }
    ```
   * __demo2.vue__

    ```
        import { pageCore } from 'vue2-libs';
        export default {
            mixins: [pageCore],
            data() {
                return {
                    testData: {}
                }
            },
            methods: {
                goBackToDemo1() {
                    // 回退页面
                    this.goBack();
                }
            },
            mounted() {
                // 获取路由参数
                this.testData = this.routerParams.param1;
                // 存储公共数据
                this.store('demo2').data2 = this.testData;
            }
        }
    ```
       
### 路由
* 配置
    * 配置项格式：
     
    ```
        {
            default: 路由名称, // 默认路由，对应下面的“name”
            routes: [
                { name: 路由名称, title: 页面标题（该属性不设置时，将采用默认标题）, component: () => import(页面文件所在路径), 
                    children: {
                        default: 默认子路由,
                        routes: [
                            { name: 子路由名称, title: 子页面标题, component: () => import(子页面文件所在路径), children: {
                                // 如此类推
                                ....
                            }}
                        ]
                    }
                },
                ......
            ]
        }
    ```
    例如：
    
    ```
        {
            default: 'demo1',
            routes: [
                { name:'demo1', component: () => import('../pages/demo1.vue') },
                { name:'demo2', title: '测试页2', component: () => import('../pages/demo2.vue'), 
                    children: {
                       default: 'child1',
                       routes: [
                            { name: 'child1', title: '子页面1', component: () => import('../pages/child1.vue') },
                            { name: 'child2', title: '子页面2', component: () => import('../pages/child2.vue'), 
                                children: {
                                    default: 'grandChild',
                                    routes: [
                                        { name: 'grandChild', title: '孙子页面', component: () => import('../pages/grandChild.vue')}
                                    ]
                                }
                            }
                       ]
                    }
                }
            ]
        }
    ```
    * *name*的值中可传路由参数，方式为：*页面地址/:参数1/:参数2/...*
    
    ```
        { name:'demo/:id/:name', component: () => import('../pages/demo.vue') }。
    ```
* 调用
   * 可直接调用底层服务
    
    ```
        import { routerSer } from 'vue2-libs';
        // 跳转页面
        routerSer.goPage('demo', { param1: 'a', param2: 'b' }});
        // 当配置项为 { name: 'demo/:id/:name', component: () => import('../pages/demo.vue') } 时
        // routerSer.goPage('demo/a/b');
        // 回退页面
        routerSer.goBack();
        // 获取路由参数
        routerSer.getParams();
    ```
   * 调用页面已封装好的简单方式
   
    ```
        import { pageCore } from 'vue2-libs';
        export default {
            mixins: [pageCore]
        }
        // 跳转页面
        this.goPage(url, params);
        // 当配置项为 { name: 'demo/:id/:name', component: () => import('../pages/demo.vue') } 时
        // this.goPage('demo/a/b');
        // 回退页面
        this.goBack();
        // 获取路由参数
        this.routerParams;
    ```
    
### 数据存储
* 配置
   * 配置项格式
   
    ```
        [
            {namespace: 命名空间, store: 模块对象 },
            ......
        ]
    ```
    例如：

    ```
        [
             { namespace: 'demo1', store: demo1 },
             { namespace: 'demo2', store: demo2 }
        ]
    ```
   * 模块对象为普通对象属性声明，定义用于存储数据的属性即可。
   * 命名空间可带有多个子命名空间
   
    ```
        { namespace: 'demo.child', store: demo }，
        { namespace: 'demo.child.grandchild', store: test }。
    ```
        
* 调用：
   * 可直接调用底层服务
    
    ```
        import { storeSer } from 'vue2-libs';
        // 获取
        storeSer.getData(namespace);
        如：let data = storeSer.getData('demo').data;
        // 设置
        storeSer.setData(namespace, value);
        如：storeSer.setData('demo', data);
    ```
   * 调用页面已封装好的简单方式：*this.store(命名空间).命名空间对应模块中的属性*
   
    ```
        import { pageCore } from 'vue2-libs';
        export default {
             mixins: [pageCore]
        }
        // 获取
        this.store(namespace);
        如：let data = this.store('demo').data;
        // 设置
        this.store(namespace) = value;
        如：this.store('demo.child').childData = ['a', 'b', 'c'];
    ```
    
### 后端接口调用
* 配置：
   * 配置项格式

    ```
        [
            { namespace: 命名空间, api: 对应模块 },
            ......
        ]
    ```
    例如：
    
    ```
        [
            { namespace: 'demo1', api: demo1 },
            { namespace: 'demo2', api: demo2 }
        ]
    ```
   * 命名空间可带有多个子命名空间
   
    ```
        { namespace: 'demo.child', api: demo }，
        { namespace: 'demo.child.grandchild', api: test }。
    ```
* 调用：
   * 可直接调用底层服务
   
    ```
        import { apiSer } from 'vue2-libs';
        // 获取某个后端接口
        apiSer.getApi(namespace).后端调用逻辑的方法();
        如：apiSer.getApi('demo').getData();
    ```
   * 调用页面已封装好的简单方式：*this.api(命名空间).后端调用逻辑的方法()*
   
    ```
        import { pageCore } from 'vue2-libs';
        export default {
            mixins: [pageCore]
        }
        // 获取数据类的逻辑
        this.api(namespace).后端调用逻辑的方法();
        如：
        this.api('demo').getData().then((data) => {
             ......
        })，
        this.api('demo').submitForm({ a: 'aa', b: 'bb'}).then((re) => {
            // 提交成功
            if(re) {
                ......
            }
        })
    ```
    
### 组件使用
组件的使用也像上面模块一样都是配置式的，用法类似。
vue2-libs建议页面上能不出现标签型的组件就不要出现，通过只调用组件api就能完成与页面的交互，降低标签型组件带来的页面复杂度和维护成本。

* 配置：
    * 配置项格式
    
    ```
        [
            { name: 组件名, com: 组件实例 },
            ......
        ]
    ```
   例如：
   
    ```
        [
            { name: 'toast', com: new toast() },
            { name: 'alert', com: new alert() }
        ]
    ```
* 初始化
在*vueApp*初始化时，设置参数*component*

    ```
        import component from './component.index'
        new vueApp({
              title: 'vue项目',
              appPage: app,
              modules: {
                 route: router,
                 store: store,
                 api: api,
                 component: component // 配置组件
              }
        });
    ```
* 调用：
    * 可直接调用底层服务
    
    ```
        import { componentSer } from 'vue2-libs';
        // 获取某个组件
        componentSer.getCom(组件名称“name”).组件api();
        如：componentSer.getCom('toast').show();
    ```
    * 调用页面已封装好的简单方式：*this.com(组件名).组件方法*
    
    ```
        import { pageCore } from 'vue2-libs';
        export default {
          mixins: [pageCore]
        }
        // 获取某个组件
        this.com(组件名称“name”).组件api();
        如：this.com('toast').show();
    ```
    
### 项目环境配置
当项目要根据不同环境读取不同内容时，可使用项目环境配置，例如后端接口在不同环境的调用不同地址，某些变量在不同环境使用不同值等。

* 项目自定义配置需要在*vueApp*初始化时给出，对应的参数为*environments*

    ```
        import devConfig from 'dev.config.js';
        import prodConfig from 'prod.config.js';
        new vueApp({
           title: 'vue项目',
           appPage: app,
           modules: {
              route: router,
              store: store,
              api: api
           },
           environments: {
              // 开发环境
              dev: {
                run: true, // 当前环境是否为开发环境，true为是
                config: devConfig // 开发环境对应的配置文件，里面包含该环境中需读取的项
              },
              // 生产环境
              prod: {
                run: false, // 值为false，当前环境部不是生产环境
                config: devConfig // 生成环境对应的配置文件，里面包含该环境中需读取的项
              }
           }
        })
    ```
* vue2-libs定义了以下环境类型，且环境类型目前不支持添加新的类型，配置时至少要指定一种环境

    ```
        dev: 开发环境
        
        prod：生产环境
        
        test: 测试环境
    ```

* 环境配置项格式

    ```
        {
           run: [boolean], // 是否为当前环境， 值为true和false
           config: [object]  // 改环境对应的配置文件，里面包含该环境中需读取的项
        }
    ```
* 配置文件约定都带“.config.js”后缀。
* 配置文件读取，对象*configSer*提供了操作配置的相关方法，详情请参考下方API
    * __dev.config.js__

    ```
        export default {
           url: 'http://xxxxxx/xxxx'
        }
    ```
    * __demo.vue__
    
    ```
        import { configSer } from 'vue2-libs';
        let url = configSer.getConfig('url');
    ```


## API
> vueApp
> -----------------------------------------------------
> 项目Vue构造器

* __选项__

  ```
    {
        title,  // 项目默认标题
        appPage,  // app页面
        modules: {
            route,  // 路由配置
            store,  // 存储配置
            api,    // 后端接口配置
            component // 组件配置
        },
        environments: {
            base,  // 各环境公共的自定义配置，不会因环境不同而不同
            dev: {
                run,  // 是否运行在开发环境
                config  // 开发环境自定义配置
            },
            prod: {
                run,  // 是否运行在生产环境
                config  // 生产环境自定义配置
            },
            test: {
                run,  // 是否运行在测试环境
                config  // 测试环境自定义配置
            }
        }
    }
  ```

> httpSer
> -----------------------------------------------------
> 服务器请求服务，封装了请求方式相关的方法

* __get(url, data): promise__

    <p>以<i>get</i>的方式请求服务器</p>

    * 参数
        <p><i>url [string]: 请求地址</i></p>
        <p><i>data [object]: 参数</i></p>
    * 返回
        <p><i>promise对象</i></p>
    * 示例
    
    ```
        httpSer.get('http://xxxx/xxxxx', { param1: 'p1', param2: 'p2' }).then((response) => {
            ......
        });
    ```
* __postFormUrlEncoded(url, data): promise__

    <p>以<i>post</i>与类型为<i>x-www-form-urlencoded</i>的方式请求服务器</p>

    * 参数
        <p><i>url [string]: 请求地址</i></p>
        <p><i>data [object]: 参数</i></p>
    * 返回
        <p><i>promise对象</i></p>
    * 示例

    ```
        httpSer.postFormUrlEncoded('http://xxxx/xxxxx', { param1: 'p1', param2: 'p2' }).then((response) => {
            ......
        });
    ```
* __postJson(url, data): promise__

    <p>以<i>post</i>与类型为<i>json</i>的方式请求服务器</p>

    * 参数
        <p><i>url [string]: 请求地址</i></p>
        <p><i>data [object]: 参数</i></p>
    * 返回
        <p><i>promise对象</i></p>
    * 示例

    ```
        httpSer.postJson('http://xxxx/xxxxx', { param1: 'p1', param2: 'p2' }).then((response) => {
            ......
        });
    ```
* __postRawJson(url, data): promise__

    <p>以<i>post</i>与类型为<i>json</i>形式的<i>raw</i>的方式请求服务器</p>

    * 参数
        <p><i>url [string]: 请求地址</i></p>
        <p><i>data [object]: 参数</i></p>
    * 返回
        <p><i>promise对象</i></p>
    * 示例

    ```
        httpSer.postRawJson('http://xxxx/xxxxx', { param1: 'p1', param2: 'p2' }).then((response) => {
            ......
        });
    ```
* __jsonp(url, data): promise__

    <p>以<i>jsonp</i>的方式请求服务器</p>

    * 参数
        <p><i>url [string]: 请求地址</i></p>
        <p><i>data [object]: 参数</i></p>
    * 返回
        <p><i>promise对象</i></p>
    * 示例

    ```
        httpSer.jsonp('http://xxxx/xxxxx', { param1: 'p1', param2: 'p2' }).then((response) => {
            ......
        });
    ```

> routerSer
> -----------------------------------------------------
> 路由服务，封装了操作路由相关的方法

* __goPage(url, params)__

    <p>跳转页面，提供了两种跳转方式</p>

    * 参数
        <p><i>url [string]: 路由地址，对应配置中的name值</i></p>
        <p><i>params [object]: 路由参数，当url为“地址/:参数1/:参数2/...”的形式时，该值会被忽略</i></p>
    * 示例

    ```
        routerSer.goPage('demo1', { param1: 'p1', param2: 'p2' });
        // 当路由配置为：{name: 'demo1/:param1/:param2'}时
        routerSer.goPage('demo1/p1/p2');
    ```
* __replace(url, params)__

    <p>跳转页面，提供了两种跳转方式，覆盖上个页面历史纪录</p>

    * 参数
        <p><i>url [string]: 路由地址，对应配置中的name值</i></p>
        <p><i>params [object]: 路由参数，当url为“地址/:参数1/:参数2/...”的形式时，该值会被忽略</i></p>
    * 示例

    ```
        routerSer.replace('demo1', { param1: 'p1', param2: 'p2' });
        // 当路由配置为：{name: 'demo1/:param1/:param2'}时
        routerSer.replace('demo1/p1/p2');
    ```
* __goBack(params)__

    <p>回退页面，回退时可以携带参数</p>

    * 参数
        <p><i>params [object]: 路由参数</i></p>
    * 示例

    ```
        routerSer.goBack();
        routerSer.goBack({ param1: 'p1', param2: 'p2' });
    ```
* __getParams(): object__

    <p>获取路由参数</p>

    * 返回
        <p><i>路由参数对象</i></p>
    * 示例

    ```
        let params = routerSer.getParams();
    ```

> routerInfo
> -----------------------------------------------------
> 路由信息服务，封装了获取和设置路由信息相关的方法

* __setParams(name, params)__

    <p>设置路由参数</p>

    * 参数
        <p><i>url [string]: 路由地址，对应配置中的name值</i></p>
        <p><i>params [object]: 路由参数</i></p>
    * 示例

    ```
        routerInfo.setParams('demo1', { param1: 'p1', param2: 'p2' });
    ```
* __getDefaultPage(): string__

    <p>获取已配置的默认路由</p>

    * 返回
        <p><i>路由配置中的默认页面值，即default的值</i></p>
    * 示例

    ```
        let default = routerInfo.getDefaultPage();
    ```
* __setDefaultPage(name)__

    <p>指定某个已配置的路由为默认路由</p>

    * 参数
        <p><i>name [string]: 路由地址，对应配置中的name值</i></p>
    * 示例

    ```
        routerInfo.setDefaultPage('demo1');
    ```
* __getCurrentRouter(): object__

    <p>获取vue的当前路由对象</p>

    * 返回
        <p><i>vue当前路由对象</i></p>
    * 示例

    ```
        let router = routerInfo.getCurrentRouter();
    ```
* __getPreRouter(): object__

    <p>获取vue的前一个路由对象</p>

    * 返回
        <p><i>vue前一个路由对象</i></p>
    * 示例

    ```
        let router = routerInfo.getPreRouter();
    ```
* __setPreRouter(router)__

    <p>设置vue的前一个路由对象</p>

    * 参数
        <p><i>router [object]: vue路由对象</i></p>
    * 示例

    ```
        routerInfo.setPreRouter(router);
    ```
* __getNextRouter(): object__

    <p>获取vue的下一个路由对象</p>

    * 返回
        <p><i>vue下一个路由对象</i></p>
    * 示例

    ```
        let router = routerInfo.getNextRouter();
    ```
* __setNextRouter(router)__

    <p>设置vue的下一个路由对象</p>

    * 参数
        <p><i>router [object]: vue路由对象</i></p>
    * 示例

    ```
        routerInfo.setNextRouter(router);
    ```

> apiSer
> -----------------------------------------------------
> 后端接口获取服务，获取已配置好的后端接口

* __getApi(namespace)：object__

    <p>设置路由参数</p>

    * 参数
        <p><i>namespace [string]: 命名空间，对应配置中的namespace值</i></p>
    * 返回
        <p><i>后端接口对象</i></p>
    * 示例

    ```
        apiSer.getApi('demo1').getData().then((data) => {
            ......
        });
    ```

> componentSer
> -----------------------------------------------------
> 组件获取服务，获取已配置好的组件实例

* __getCom(name): object__

    <p>获取组件实例</p>

    * 参数
        <p><i>name [string]: 组件名称，对应配置中的name值</i></p>
    * 返回
        <p><i>组件实例</i></p>
    * 示例

    ```
        componentSer.getCom('toast').show();
    ```

> configSer
> -----------------------------------------------------
> 配置操作服务，设置和获取配置

* __init(config, namespace)__

    <p>初始化自定义的配置</p>

    * 参数
        <p><i>config [object]: 配置对象</i></p>
        <p><i>namespace [string]: 命名空间</i></p>
    * 示例

    ```
        let config = {
            test1: 'xxxx1',
            test2: 'xxxx2'
        }
        configSer.init(config, 'custom');
    ```
* __getConfig(key, namespace): object__

    <p>获取对应命名空间中的配置对象</p>

    * 参数
        <p><i>key [string]: 配置项的属性名</i></p>
        <p><i>namespace [string]: 命名空间，忽略改值时，默认获取vueApp初始化时的环境配置</i></p>
    * 返回
        <p><i>配置对象</i></p>
    * 示例

    ```
        configSer.getConfig('url');
        configSer.getConfig('test1', 'custom');
    ```

> commonSer
> -----------------------------------------------------
> 页面通用工具服务，封装页面常用的工具方法

* __localSearchQuery(paramString): string__

    <p>从href抓取需要的数据</p>

    * 参数
        <p><i>paramString [string]: query中属性名称</i></p>
    * 返回
        <p><i>query中属性的值</i></p>
    * 示例

    ```
        // href: http://xxxx/xxxx?code=xxxxx
        let code = commonSer.localSearchQuery('code');
    ```
* __paramsToString(obj): string__

    <p>把对象转成queryString的字符串</p>

    * 参数
        <p><i>obj [object]: 要转换的对象</i></p>
    * 返回
        <p><i>query字符串</i></p>
    * 示例

    ```
        // 结果：query = 'code=111&name=222';
        let query = commonSer.paramsToString({
            code: '111',
            name: '222'
        });
    ```
* __formactDate(second, fmt): string__

    <p>传入毫秒，格式化时间</p>

    * 参数
        <p><i>second [number]: 毫秒数</i></p>
        <p><i>fmt [string]: 格式，常见：'yyyy-MM-dd hh:mm:ss.S'、'yyyy-M-d h:m:s.S'</i></p>
    * 返回
        <p><i>时间值</i></p>
    * 示例

    ```
        commonSer.formactDate(1435656787, 'yyyy-MM-dd hh:mm:ss');
    ```
* __monthCalculate(timestampOrDate, monthCount, fmt): number | string__

    <p>按时间戳或者时间日期，计算增加的月份，按 fmt 格式返回，默认返回时间戳</p>

    * 参数
        <p><i>timestampOrDate [string]: 时间戳或日期时间（如：2016-08-09）</i></p>
        <p><i>monthCount [number]: 要增加的月份，数值，如：1、2、3，负数为减</i></p>
        <p><i>fmt [string]: 返回的格式，常见：'yyyy-MM-dd hh:mm:ss.S'、'yyyy-M-d h:m:s.S' ，默认时间戳</i></p>
    * 返回
        <p><i>时间值：默认时间戳[number]或格式化后的日期[string]</i></p>
    * 示例

    ```
        commonSer.monthCalculate('1435656787', 2);
        commonSer.monthCalculate('2016-08-09', 3, 'yyyy-MM-dd hh:mm:ss');
    ```

> broadcastSer
> -----------------------------------------------------
> 消息广播服务，可以用于逻辑解耦

* __broadcast(name, params)__

    <p>广播消息</p>

    * 参数
        <p><i>name [string]: 消息名称</i></p>
        <p><i>params [object]: 消息参数</i></p>
    * 示例

    ```
        broadcastSer.broadcast('submitClick', {id: 'btn'})
    ```
* __listen(name, func)__

    <p>监听消息</p>

    * 参数
        <p><i>name [string]: 消息名称</i></p>
        <p><i>func [function]: 监听方法, 参数为广播时传递的参数</i></p>
    * 示例

    ```
        broadcastSer.listen('submitClick', (id) => {

        })
    ```

> device
> -----------------------------------------------------
> 设备环境

* __ios__：是否为ios端

* __android__：是否为android端

* __pc__：是否为pc端

> pageCore
> -----------------------------------------------------
> 简单页面父类

* __routerParams: object__

    <p>路由参数</p>

    * 示例

    ```
        let params = this.routerParams;
    ```
* __goPage(url, params)__

    <p>跳转页面，提供了两种跳转方式</p>

    * 参数
        <p><i>url [string]: 路由地址，对应配置中的name值</i></p>
        <p><i>params [object]: 路由参数，当url为“地址/:参数1/:参数2/...”的形式时，该值会被忽略</i></p>
    * 示例

    ```
        this.goPage('demo1', { param1: 'p1', param2: 'p2' });
        // 当路由配置为：{name: 'demo1/:param1/:param2'}时
        this.goPage('demo1/p1/p2');
    ```
* __goBack(params)__

    <p>回退页面，回退时可以携带参数</p>

    * 参数
        <p><i>params [object]: 路由参数</i></p>
    * 示例

    ```
        this.goBack();
        this.goBack({ param1: 'p1', param2: 'p2' });
    ```
* __store(namespace): object__

    <p>获取存储的数据</p>

    * 参数
        <p><i>namespace [string]: 命名空间</i></p>
    * 返回
        <p><i>数据对象</i></p>
    * 示例

    ```
        let data = this.store('demo').test;
    ```
* __api(namespace): object__

    <p>获取后端接口对象</p>

    * 参数
        <p><i>namespace [string]: 命名空间</i></p>
    * 返回
        <p><i>接口对象</i></p>
    * 示例

    ```
        this.api('demo').getData().then(() => {
        
        });
    ```
* __com(name): object__

    <p>获取组件实例</p>

    * 参数
        <p><i>name [string]: 组件名称</i></p>
    * 返回
        <p><i>组件实例</i></p>
    * 示例

    ```
        this.com('toast').show();
    ```
> vue
> -----------------------------------------------------
> 官方vue对象


