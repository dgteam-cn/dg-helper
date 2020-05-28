declare const _default: {
    Extend(old: any, ...obj: any): object;
    Origin(sample: any): any;
    Log(...args: any[]): void;
    Big: (opt: any) => import("_@types_big.js@4.0.5@@types/big.js").Big;
    Price: (num: string | number, { float, mode, force, separate, format, unit, }?: {
        float?: number | undefined;
        mode?: number | undefined;
        force?: boolean | undefined;
        separate?: number | undefined;
        format?: string | undefined;
        unit?: string | undefined;
    }) => string | number | string[] | undefined;
    PriceUppercase: (price: string | number) => string;
    PrefixZero: (num: string | number, n: number) => string;
    Uuid: (len: number, radix?: number) => string;
    CacheClient: {
        mode: string;
        handle: string;
        get: (key: string) => any;
        set: (key: string, value: any) => any;
        remove: (key: string) => any;
        clean: () => any;
        info: () => Object;
    } | {
        mode: undefined;
        handle: undefined;
        get: (key: string) => undefined;
        set: (key: string, value: any) => undefined;
        remove: (key: string) => undefined;
        clean: () => undefined;
        info: () => object;
    };
    Cache: (key: any, value?: any, timeout?: string | number | undefined) => any;
    CacheGet: (key: any) => any;
    CacheSet: (key: any, value: any, timeout?: string | number | undefined) => any;
    CacheRemove: (key: any) => any;
    CacheClean: (key: any) => any;
    CacheInfo: (key: any) => Object;
    Time: (time?: string | number | Date | undefined, format?: string) => string;
    Timestamp: (date?: number | Date | undefined) => number;
    Is: (type: string | undefined, sample: any, { strict }?: {
        strict?: boolean | undefined;
    }) => boolean;
    IsInt: (sample: any, opt?: object | undefined) => boolean;
    IsEmpty: (sample: any, opt?: object | undefined) => boolean;
    IsObject: (sample: any, opt?: object | undefined) => boolean;
    IsArray: (sample: any, opt?: object | undefined) => boolean;
};
export = _default;
