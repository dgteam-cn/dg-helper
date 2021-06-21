declare function objectToString(o: any): any;
/**
 * 变量判定
 * 可参考 core-util-is [github: https://github.com/isaacs/core-util-is]
 * @param {string} type - 判定类型 [int, object, array, empty, formdata] (不区分大小写)
 * @param {any} sample - 需要判定的对象样本
 * @param {boolean} opt.strict - 是否使用严格模式，如果为 false 可能会降低判定精度
 * @return {boolean} 判定结果
 */
declare const is: (type: string, sample: any, { strict }?: {
    strict?: boolean;
}) => boolean;
declare const isInt: (sample: any, opt?: object) => boolean;
declare const isEmpty: (sample: any, opt?: object) => boolean;
declare const isObject: (sample: any, opt?: object) => boolean;
declare const isArray: (sample: any, opt?: object) => boolean;
