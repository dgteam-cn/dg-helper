
/**
 * 把时间转换成 'yyyy-MM-dd hh:mm:ss' 格式
 * 支持传入 UTC时间、GMT时间、Date 对象、Unix时间戳格式
 * 如果传入的格式为时间戳，还能自动判断单位是秒还是毫秒
 * @param {string|int|Date|undefined} date - 时间对象，不传则默认当前系统时间
 * @param {string} format 输出时间格式，默认 'yyyy-MM-dd hh:mm:ss'
 * @return {string}
 */
const time = (time: number | string | Date | undefined = new Date(), format: string = "yyyy-MM-dd hh:mm:ss"): string => {
    if (time === null || time === undefined) {
        time = new Date(0)
    } else if (typeof time === 'string') {
        if (~['', '0', '0000-00-00', '0000-00-00 00:00:00', '0000-00-00 00:00'].indexOf(time)) { // 无效时间
            time = new Date(0)
        } else if (time[10] === 'T' && time[time.length - 1] === 'Z') { // UTC 时间，可以直接序列化
            time = new Date(time)
        } else { // GMT 时间和 DateTime 时间处理方式
            time = new Date(time.replace(/-/g, "/")) // 为了支持 Safari 浏览器
        }
    } else if (typeof time === 'number') {
        if (time % 1 === 0 && time < 10000000000) {
            time = new Date(time * 1000) // 如果时间戳单位是秒，则自动转为毫秒
        } else {
            time = new Date(time)
        }
    }
    const date: any = {
        "M+": time.getMonth() + 1,
        "d+": time.getDate(),
        "h+": time.getHours(),
        "m+": time.getMinutes(),
        "s+": time.getSeconds(),
        "q+": Math.floor((time.getMonth() + 3) / 3),
        "S+": time.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length))
        }
    }
    return format
}

/**
 * 获取时间戳（单位秒）
 * @param {string|number|Date} date - 时间，使用 Date 进行解析
 * @return {string}
 */
const timestamp = (date?: number | string | Date): number => {
    if (typeof date === 'string') {
        date = date.replace(/-/g, "/") // 为了支持 Safari 浏览器
    }
    const time: Date = date ? new Date(date) : new Date()
    return Date.parse(time.toString()) / 1000
}

module.exports = {
    time, timestamp
}