export interface enumOptions {
    name?: string | Array<string>;
    label?: string | Array<string>;
    strict?: boolean;
    defLabel?: string;
}
declare const _default: {
    version: any;
    Extend(target?: any, ...args: any): object;
    Origin(sample: any): any;
    Log(...args: any[]): void;
    /**
     * @name 数组枚举
     * @param {array}           list 待枚举数组
     * @param {any}             fun - 若传入 function 则使用方法判定 row 与 item 是否匹配
     *                                若传入其他值则使用 list 中的 key[name] 值进行比较
     * @param {object|string}   options - 若传入 string 则将此值设为 options.defLabel
     * @param {string}          options.name - 枚举名 - 待枚举数组交叉对比的 key
     * @param {string}          options.label - 枚举名 - 待枚举数组匹配后返回的值
     * @param {string}          options.strict - 严格检查（本属性未实装）
     * @param {string}          options.defLabel - 所有成员均未命中时的返回值
     * @description row： 枚举对象   | name：枚举名    label: 枚举值
     *              item：数据源对象 | key: 待枚举名   value: 待枚举值
     * @return {string}
     */
    Enum(list?: Array<any>, fun?: any, options?: enumOptions | string): any;
    Big: (opt: any) => import("big.js").Big;
    Price: (num: string | number, { float, mode, force, separate, format, unit }?: import("./plugins/math").priceOptions) => string | number | string[];
    PriceUppercase: (price: string | number) => string;
    PrefixZero: (num: string | number, n: number) => string;
    Uuid: (len: number, radix?: number) => string;
    CacheClient: {
        mode: string;
        handle: any;
        get: (key: string) => any;
        set: (key: string, value: any) => any;
        remove: (key: string) => any;
        clean: () => any;
        info: () => {};
    };
    Cache: (key: any, value?: any, timeout?: string | number) => any;
    CacheGet: (key: any) => any;
    CacheSet: (key: any, value: any, timeout?: string | number) => any;
    CacheRemove: (key: any) => any;
    CacheClean: () => any;
    CacheInfo: () => {
        mode: string;
        handle: any;
    };
    Time: (time?: string | number | Date, format?: string) => string;
    Timestamp: (date?: string | number | Date) => number;
    Is: (type: string, sample: any, { strict }?: {
        strict?: boolean;
    }) => boolean;
    IsInt: (sample: any, opt?: object) => boolean;
    IsEmpty: (sample: any, opt?: object) => boolean;
    IsObject: (sample: any, opt?: object) => boolean;
    IsArray: (sample: any, opt?: object) => boolean;
    UrlParse: (href?: string) => import("./plugins/url").urlObject;
};
export default _default;
