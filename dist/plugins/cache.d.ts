/**
 * localStorage 缓存相关
 * @date 2020-05-25
 * @author 2681137811<donguayx@qq.com>
 */
declare const Client: {
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
declare const Cache: (key: any, value?: any, timeout?: string | number | undefined) => any;
declare const CacheGet: (key: any) => any;
declare const CacheSet: (key: any, value: any, timeout?: string | number | undefined) => any;
declare const CacheRemove: (key: any) => any;
declare const CacheClean: (key: any) => any;
declare const CacheInfo: (key: any) => Object;
export { Client, Cache, CacheGet, CacheSet, CacheRemove, CacheClean, CacheInfo };
