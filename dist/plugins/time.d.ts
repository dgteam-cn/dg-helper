/**
 * 把时间转换成 'yyyy-MM-dd hh:mm:ss' 格式
 * 支持传入 UTC时间、GMT时间、Date 对象、Unix时间戳格式
 * 如果传入的格式为时间戳，还能自动判断单位是秒还是毫秒
 * @param {string|int|Date|undefined} date - 时间对象，不传则默认当前系统时间
 * @param {string} format 输出时间格式，默认 'yyyy-MM-dd hh:mm:ss'
 * @return {string}
 */
declare const time: (time?: number | string | Date | undefined, format?: string) => string;
/**
 * 获取时间戳（单位秒）
 * @param {string|number|Date} date - 时间，使用 Date 进行解析
 * @return {string}
 */
declare const timestamp: (date?: number | string | Date) => number;
