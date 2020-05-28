/**
 *  变量判定
 * @param type 判定类型 [ int, object, array, empty, formdata ]
 * @param sample 判定样本
 * @param strict 是否使用严格模式，如果为 false 可能会降低判定精度
 */
declare const Is: (type: string | undefined, sample: any, { strict }?: {
    strict?: boolean | undefined;
}) => boolean;
declare const IsInt: (sample: any, opt?: object | undefined) => boolean;
declare const IsEmpty: (sample: any, opt?: object | undefined) => boolean;
declare const IsObject: (sample: any, opt?: object | undefined) => boolean;
declare const IsArray: (sample: any, opt?: object | undefined) => boolean;
export { Is, IsInt, IsEmpty, IsObject, IsArray };
