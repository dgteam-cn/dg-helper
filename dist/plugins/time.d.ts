/**
 * @name 把时间转换成 'yyyy-MM-dd hh:mm:ss' 格式
 * @param date [string | int | Date | undefined]
 * @param format 参考 'yyyy-MM-dd hh:mm:ss'
 * @return string
 */
declare const Time: (time?: number | string | Date | undefined, format?: string) => string;
/**
 * @name 获取时间戳（单位秒）
 * @param date [number | Date]
 * @return string
 */
declare const Timestamp: (date?: number | string | Date) => number;
export { Time, Timestamp };
