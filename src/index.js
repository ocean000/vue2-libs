/**
 * Created by Ocean on 2017/10/24.
 */
import 'babel-polyfill';
import pageCore from './pages/page.core.js';

export {
    vue,
    vueApp,
    broadcastImpl as broadcastSer,
    httpHtml as httpSer,
    routerImpl as routerSer,
    storeImpl as storeSer,
    apiTool as apiSer,
    componentTool as componentSer,
    commonTool as commonSer,
    routerTool as routerInfo,
    configTool as configSer,
    device
} from './implements/index';

export {
    pageCore
}

