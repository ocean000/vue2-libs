/**
 * Created by Ocean on 2017/9/7.
 */
import { core, IHttp } from 'libs-core';
import ajax from './ajax';
import qs from 'qs';
import jp from 'jsonp';

let httpImpl = core.implement(IHttp);

/**
 * 实现get请求接口
 * @param url 请求地址
 * @param data 请求参数
 * @param context 上下文
 * @returns 返回Promise对象
 */
httpImpl.get = (url, data, context = core.getContext()) => {
    return ajax.get(url, {
        params: data
    });
};

/**
 * 实现post请求接口
 * @param url 请求地址
 * @param type 请求的参数方式，如：formData, raw, x-www-form-urlencoded, json
 * @param data 请求参数
 * @param context 上下文
 * @returns {Promise} 返回Promise对象
 */
httpImpl.post = (url, type, data, context= core.getContext()) => {

};

/**
 * post请求, 参数方式为FormData
 * @param url 请求地址
 * @param data 请求参数
 * @param context 上下文
 * @returns {Promise} 返回Promise对象
 */
httpImpl.postFormData = (url, data, context = core.getContext()) => {
    return ajax.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 实现post请求接口, 参数方式为x-www-form-urlencoded
 * @param url 请求地址
 * @param data 请求参数
 * @param context 上下文
 * @returns 返回Promise对象
 */
httpImpl.postFormUrlEncoded = (url, data, context = core.getContext()) => {
    return ajax.post(url, qs.stringify(data), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    });
};

/**
 * 实现post请求接口, 参数方式为json
 * @param url 请求地址
 * @param data 请求参数
 * @param context 上下文
 * @returns 返回Promise对象
 */
httpImpl.postJson = (url, data, context = core.getContext()) => {
    return ajax.post(url, data, {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
};

/**
 * 实现post请求接口, 参数方式为json形式的raw
 * @param url 请求地址
 * @param data 请求参数
 * @param context 上下文
 * @returns 返回Promise对象
 */
httpImpl.postRawJson = (url, data, headers, context = core.getContext()) => {
    let head = Object.assign({
        'Content-Type': 'application/json;charset=utf-8'
    }, headers);
    return ajax.post(url, JSON.stringify(data), {
        headers: head
    });
};

/**
 * 以jsonp方式请求
 * @param url 请求地址
 * @param data 请求参数
 * @param context 上下文
 * @returns {Promise} 返回Promise对象
 */
httpImpl.jsonp = (url, data, context = core.getContext()) => {
    return new Promise((resolve, reject) => {
        if(!url.includes('?')) {
            url = url + '?';
        }
        else if(url.substr(-1) !== '&') {
            url = url + '&';
        }
        jp(url + qs.stringify(data), (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(data);
            }
        });
    });
};

export default httpImpl;

