"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.Time = void 0;
/**
 * @name 把时间转换成 'yyyy-MM-dd hh:mm:ss' 格式
 * @param date [string | int | Date | undefined]
 * @param format 参考 'yyyy-MM-dd hh:mm:ss'
 * @return string
 */
const Time = (time = new Date(), format = "yyyy-MM-dd hh:mm:ss") => {
    if (time === null || time === undefined) {
        time = new Date(0);
    }
    else if (typeof time === 'string') {
        if (~['', '0', '0000-00-00', '0000-00-00 00:00:00', '0000-00-00 00:00'].indexOf(time)) { // 无效时间
            time = new Date(0);
        }
        else if (time[10] === 'T' && time[time.length - 1] === 'Z') { // UTC 时间，可以直接序列化
            time = new Date(time);
        }
        else { // GMT 时间和 DateTime 时间处理方式
            time = new Date(time.replace(/-/g, "/")); // 为了支持 Safari 浏览器
        }
    }
    else if (typeof time === 'number') {
        if (time % 1 === 0 && time < 10000000000) {
            time = new Date(time * 1000); // 如果时间戳单位是秒，则自动转为毫秒
        }
        else {
            time = new Date(time);
        }
    }
    const date = {
        "M+": time.getMonth() + 1,
        "d+": time.getDate(),
        "h+": time.getHours(),
        "m+": time.getMinutes(),
        "s+": time.getSeconds(),
        "q+": Math.floor((time.getMonth() + 3) / 3),
        "S+": time.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};
exports.Time = Time;
/**
 * @name 获取时间戳（单位秒）
 * @param date [number | Date]
 * @return string
 */
const Timestamp = (date) => {
    const time = date ? new Date(date) : new Date();
    return Date.parse(time.toString()) / 1000;
};
exports.Timestamp = Timestamp;
