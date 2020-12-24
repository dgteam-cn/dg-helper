/**
 * localStorage 缓存相关
 * @date 2020-05-25
 * @author 2681137811<donguayx@qq.com>
 */
declare const Client: {
    mode: string;
    handle: any;
    get: (key: string) => any;
    set: (key: string, value: any) => any;
    remove: (key: string) => any;
    clean: () => any;
    info: () => {};
};
declare const Cache: (key: any, value?: any, timeout?: number | string) => any;
declare const CacheGet: (key: any) => any;
declare const CacheSet: (key: any, value: any, timeout?: string | number) => any;
declare const CacheRemove: (key: any) => any;
declare const CacheClean: () => any;
declare const CacheInfo: () => {
    mode: string;
    handle: any;
};
export { Client, Cache, CacheGet, CacheSet, CacheRemove, CacheClean, CacheInfo };
