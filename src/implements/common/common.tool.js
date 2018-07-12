/**
 * Created by Ocean on 2017/9/13.
 */

export default {
    /**
     * 从href抓取需要的数据
     * @param paramString 属性名称
     * @returns {*} 属性的值
     */
    localSearchQuery(paramString) {
        let search = window.location.href,
            reg = new RegExp('[?&]' + paramString + '=([^&|^#]+)'),
            result = null;

        search.replace(reg, ($1, $2) => {
            result = decodeURIComponent($2);
        });
        return result;
    },

    /**
     * 把对象转成queryString的字符串
     * @param obj
     * @returns {string}
     */
    paramsToString(obj) {
        let keys = Object.keys(obj);
        let params = [];
        for(let i = 0, len = keys.length; i < len; i++) {
            params.push(keys[i] + '=' + obj[keys[i]]);
        }
        return params.join('&');
    },

    /**
     * 传入毫秒，格式化时间
     * @param second 毫秒数
     * @param fmt 格式，常见：'yyyy-MM-dd hh:mm:ss.S'、'yyyy-M-d h:m:s.S'
     * @returns {*}
     */
    formactDate(second, fmt) {
        if (!second) {
            return '';
        }

        let date = new Date(second), // 后台时间转javascript时间戳
            o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours()%12 === 0 ? 12 : date.getHours()%12, // 小时
                'H+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                S: date.getMilliseconds() // 毫秒
            };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
        }

        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((o[k].toString()).length)));
            }
        }
        return fmt;

    },

    /**
     *  按时间戳或者时间日期，计算增加的月份，按 fmt 格式返回，默认返回时间戳
     * @param timestampOrDate 时间戳或日期时间（如：2016-08-09）
     * @param monthCount 要增加的月份，数值，如：1、2、3，负数为减
     * @param fmt 返回的格式，常见：'yyyy-MM-dd hh:mm:ss.S'、'yyyy-M-d h:m:s.S' ，默认时间戳
     */
    monthCalculate(timestampOrDate, monthCount, fmt) {
        // Step 1: 如果是非时间戳，转化为时间戳
        if (!/^\d+$/.test(timestampOrDate)) {
            // 如果是时间戳
            // 把-转化成 / 避免IOS时间问题
            timestampOrDate = timestampOrDate.replace(/\-/gi, '/');
        }

        // Step 2:  转化为时间对象
        let d = new Date(timestampOrDate),
            returnFmt = ''; // 返回的格式

        // Step 3： 对应的月份相加
        d.setMonth(monthCount < 0 ? d.getMonth() - Math.abs(monthCount) : d.getMonth() + monthCount); // 再加上月份

        // Step 4: 时间格式化
        if (fmt) {
            returnFmt = this.formactDate(d.getTime(), fmt);
        } else {
            returnFmt = d.getTime();
        }

        return returnFmt;
    }
}
