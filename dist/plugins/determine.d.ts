/**
 *  变量判定
 * @param type 判定类型 [ int, object, array, empty, formdata ]
 * @param sample 判定样本
 * @param strict 是否使用严格模式，如果为 false 可能会降低判定精度
 */
declare const is: (type: string, sample: any, { strict }?: {
    strict?: boolean;
}) => boolean;
declare const isInt: (sample: any, opt?: object) => boolean;
declare const isEmpty: (sample: any, opt?: object) => boolean;
declare const isObject: (sample: any, opt?: object) => boolean;
declare const isArray: (sample: any, opt?: object) => boolean;
