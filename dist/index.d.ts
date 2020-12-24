declare const _default: {
    Extend(old: any, ...obj: any): object;
    Origin(sample: any): any;
    Log(...args: any[]): void;
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
};
export default _default;
