/**
 * localStorage 缓存相关
 * @date 2020-05-25
 * @author 2681137811<donguayx@qq.com>
 */
declare const uni: any;
declare const plus: any;
declare const wx: any;
declare class Storager {
    get client(): {
        mode: string;
        handle: any;
        get: (key: string) => any;
        set: (key: string, value: any) => any;
        remove: (key: string) => any;
        clean: () => any;
        info: () => object;
    };
    /**
     *  语法糖 -> 操作本地 cache
     * @param key 缓存关键字
     * @param value 缓存字段，会根据环境自动使用 JSON.stringify 序列化
     * @param timeout 缓存时间，若为数字格式则以秒为计算单位，字符串格式的末尾需要添加单位 如 '1d'=1天 '1h'=1小时 '1m'=1分钟 '1s'=1秒
     */
    cache(key: any, value?: any, timeout?: number | string): any;
    cacheGet(key: any): any;
    cacheSet(key: any, val: any, timeout?: string | number): any;
    cacheRemove(key: any): any;
    cacheClean(): any;
    cacheInfo(): {
        mode: string;
        handle: any;
    };
}
declare const Store: Storager;
declare const client: {
    mode: string;
    handle: any;
    get: (key: string) => any;
    set: (key: string, value: any) => any;
    remove: (key: string) => any;
    clean: () => any;
    info: () => object;
};
declare const cache: (key: any, value?: any, timeout?: number | string) => any;
declare const cacheGet: (key: any) => any;
declare const cacheSet: (key: any, value: any, timeout?: string | number) => any;
declare const cacheRemove: (key: any) => any;
declare const cacheClean: () => any;
declare const cacheInfo: () => {
    mode: string;
    handle: any;
};
