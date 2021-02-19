"use strict";
/**
 * localStorage 缓存相关
 * @date 2020-05-25
 * @author 2681137811<donguayx@qq.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInfo = exports.CacheClean = exports.CacheRemove = exports.CacheSet = exports.CacheGet = exports.Cache = exports.Client = void 0;
class Storage {
    // 根据当前环境自动获取缓存对象实例，并生成通用方法 [ get, set, remove, clean, info ]
    // 支持 浏览器、微信小程序、uniapp、html5+
    // 不支持 window、liunx 操作系统级别环境，请使用 mysql mongodb redis 等应用级模块替代
    get Client() {
        if (typeof window === 'object' && window.localStorage) {
            return {
                mode: 'browser', handle: window,
                get: (key) => {
                    try {
                        return JSON.parse(window.localStorage.getItem(key));
                    }
                    catch (err) {
                        return window.localStorage.getItem(key);
                    }
                },
                set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
                remove: (key) => window.localStorage.removeItem(key),
                clean: () => window.localStorage.clear(),
                info: () => ({}) // 不支持则返回空对象
            };
        }
        else if (typeof uni === 'object' && uni.getStorageSync) {
            return {
                mode: 'uniapp', handle: uni,
                get: (key) => uni.getStorageSync(key),
                set: (key, value) => uni.setStorageSync(key, value),
                remove: (key) => uni.removeStorageSync(key),
                clean: () => uni.clearStorageSync(),
                info: () => uni.getStorageInfoSync()
            };
        }
        else if (typeof plus === 'object' && plus.storag) {
            return {
                mode: 'html5+', handle: plus,
                get: (key) => plus.storage.getItem(key),
                set: (key, value) => plus.storage.setItem(key, value),
                remove: (key) => plus.storage.removeItem(key),
                clean: () => plus.storage.clear(),
                info: () => ({}) // 不支持则返回空对象
            };
        }
        else if (typeof wx === 'object' && wx.getStorageSync) {
            return {
                mode: 'wx', handle: wx,
                get: (key) => wx.getStorageSync(key),
                set: (key, value) => wx.setStorageSync(key, value),
                remove: (key) => wx.removeStorageSync(key),
                clean: () => wx.clearStorageSync(),
                info: () => wx.getStorageInfoSync()
            };
        }
        return {
            mode: undefined, handle: undefined,
            get: () => undefined,
            set: () => undefined,
            remove: () => undefined,
            clean: () => undefined,
            info: () => ({}) // 不支持则返回空对象
        };
    }
    /**
     *  语法糖 -> 操作本地 cache
     * @param key 缓存关键字
     * @param value 缓存字段，会根据环境自动使用 JSON.stringify 序列化
     * @param timeout 缓存时间，若为数字格式则以秒为计算单位，字符串格式的末尾需要添加单位 如 '1d'=1天 '1h'=1小时 '1m'=1分钟 '1s'=1秒
     */
    Cache(key, value, timeout) {
        if (key) {
            if (value === undefined && timeout === undefined) {
                return this.CacheGet(key);
            }
            else if (value === null || timeout === 0) {
                return this.CacheRemove(key);
            }
            else {
                return this.CacheSet(key, value, timeout);
            }
        }
    }
    // 获取缓存
    CacheGet(key) {
        if (key === undefined) {
            console.error('cache key can not be blank.');
            return undefined;
        }
        else if (typeof key !== 'string') {
            try {
                key = JSON.stringify(key);
            }
            catch (err) {
                console.error('cache key is contrary to expectation.');
                return undefined;
            }
        }
        const { Client: client } = this;
        const cache = client.get(key);
        const expired = client.get(`${key}_timeout`);
        if (expired && Date.now() > expired) {
            client.remove(key);
            client.remove(`${key}_timeout`);
            return null;
        }
        return cache;
    }
    // 存储缓存
    CacheSet(key, val, timeout) {
        if (key === undefined) {
            console.error('cache key can not be blank.');
            return undefined;
        }
        else if (typeof key !== 'string') {
            try {
                key = JSON.stringify(key);
            }
            catch (err) {
                console.error('cache key is contrary to expectation.');
                return undefined;
            }
        }
        const { Client: client } = this;
        if (timeout) {
            let throughSecond = 0;
            if (typeof timeout === 'number') {
                throughSecond = timeout;
            }
            else if (typeof timeout === 'string') {
                const duration = parseInt(timeout, 10);
                const unit = timeout.charAt(timeout.length - 1);
                if (duration && duration > 0) {
                    if (unit === 'd' || unit === 'day' || unit === 'D') {
                        throughSecond = duration * 60 * 60 * 24;
                    }
                    else if (unit === 'h' || unit === 'hour' || unit === 'H') {
                        throughSecond = duration * 60 * 60;
                    }
                    else if (unit === 'm' || unit === 'minute' || unit === 'M') {
                        throughSecond = duration * 60;
                    }
                    else {
                        throughSecond = duration;
                    }
                }
            }
            if (throughSecond) {
                const expired = throughSecond * 1000 + Date.now();
                client.set(`${key}_timeout`, expired);
            }
        }
        return client.set(key, val);
    }
    CacheRemove(key) {
        if (key === undefined) {
            console.error('cache key can not be blank.');
            return undefined;
        }
        else if (typeof key !== 'string') {
            try {
                key = JSON.stringify(key);
            }
            catch (err) {
                console.error('cache key is contrary to expectation.');
                return undefined;
            }
        }
        return this.Client.remove(key);
    }
    // 清除缓存
    CacheClean() {
        return this.Client.clean();
    }
    // 获取当前缓存信息
    CacheInfo() {
        const { mode, handle, info } = this.Client;
        return Object.assign({ mode, handle }, info());
    }
}
const Store = new Storage();
const Client = Store.Client;
exports.Client = Client;
const Cache = (key, value, timeout) => Store.Cache(key, value, timeout);
exports.Cache = Cache;
const CacheGet = (key) => Store.CacheGet(key);
exports.CacheGet = CacheGet;
const CacheSet = (key, value, timeout) => Store.CacheSet(key, value, timeout);
exports.CacheSet = CacheSet;
const CacheRemove = (key) => Store.CacheRemove(key);
exports.CacheRemove = CacheRemove;
const CacheClean = () => Store.CacheClean();
exports.CacheClean = CacheClean;
const CacheInfo = () => Store.CacheInfo();
exports.CacheInfo = CacheInfo;
