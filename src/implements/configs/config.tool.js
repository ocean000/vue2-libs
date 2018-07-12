/**
 * Created by Ocean on 2017/9/12.
 */

let configDir = '/src/configs/';

let configObj = {};
let defaultNamespace = 'config-default-namespace';

export default {
    /**
     * 初始化配置
     * @param config 配置对象
     * @param namespace 命名空间
     */
    init(config, namespace = defaultNamespace) {
        configObj[namespace] = config;
    },

    /**
     * 获取某配置项的值
     * @param key 配置选项的键值
     * @param namespace 命名空间
     * @returns 配置值
     */
    getConfig(key, namespace = defaultNamespace) {
        let nsObj = configObj[namespace];
        if(!nsObj || nsObj === null) {
            if(namespace === defaultNamespace) {
                throw '环境配置不存在'
            }
            else {
                throw '命名空间为' + namespace + '的配置不存在';
            }
        }
        let obj = nsObj[key];
        if(!obj || obj === null) {
            if(namespace === defaultNamespace) {
                throw '配置' + key + '不存在';
            }
            else {
                throw '命名空间' + namespace + '中的配置' + key + '不存在';
            }
        }
        return configObj[namespace][key];
    },

    /**
     * 获取配置文件所在目录
     */
    getConfigDir(){
        return configDir;
    },

    /**
     * 设置配置文件所在目录
     * @param dir 目录路径
     */
    setConfigDir(dir) {
        configDir = dir;
    },

    /**
     * 获取配置文件
     * @param fileName 文件名
     */
    getConfigFile(fileName) {
        /*if(!path || path === null || !fs || fs === null) {
            return null;
        }
        let file = path.resolve(path.join(configDir, fileName));
        if(!fs.existsSync(file)) {
            return null;
        }
        fs.readFile(file, (err, data) => {
            if (err) {
                throw err;
            }
            console.log(data);
        });*/
    }
}

