// declare let global: any;
// declare const window: any;
declare const uni: any;
declare const plus: any;
declare const wx: any;

/**
 * 缓存构造器
 * 支持常用浏览器、uniapp、uniapp html5+、微信小程序环境
 * 不支持 node 后端环境，后端请使用 mysql mongodb redis 等数据库替代
 * @class
 * @date 2020-05-25
 * @author 2681137811<donguayx@qq.com>
 */
class Storager {

    get client() {
        if (typeof window === 'object' && window.localStorage) {
            return {
                mode: 'browser', handle: window, // browser 平台
                get: (key: string) => {
                    try {
                        return JSON.parse(window.localStorage.getItem(key))
                    } catch (err) {
                        return window.localStorage.getItem(key)
                    }
                },
                set: (key: string, value: any) => window.localStorage.setItem(key, JSON.stringify(value)),
                remove: (key: string) => window.localStorage.removeItem(key),
                clean: () => window.localStorage.clear(),
                info: () => ({}) // 不支持则返回空对象
            }
        } else if (typeof uni === 'object' && uni.getStorageSync) {
            return {
                mode: 'uniapp', handle: uni, // uniapp 平台
                get: (key: string) => uni.getStorageSync(key),
                set: (key: string, value: any) => uni.setStorageSync(key, value),
                remove: (key: string) => uni.removeStorageSync(key),
                clean: () => uni.clearStorageSync(),
                info: (): object => uni.getStorageInfoSync()
            }
        } else if (typeof plus === 'object' && plus.storag) {
            return {
                mode: 'html5+', handle: plus,  // H5+ 平台
                get: (key: string) => plus.storage.getItem(key),
                set: (key: string, value: any) => plus.storage.setItem(key, value),
                remove: (key: string) => plus.storage.removeItem(key),
                clean: () => plus.storage.clear(),
                info: (): object => ({}) // 不支持则返回空对象
            }
        } else if (typeof wx === 'object' && wx.getStorageSync) {
            return {
                mode: 'wx', handle: wx, // 微信小程序平台
                get: (key: string) => wx.getStorageSync(key),
                set: (key: string, value: any) => wx.setStorageSync(key, value),
                remove: (key: string) => wx.removeStorageSync(key),
                clean: () => wx.clearStorageSync(),
                info: (): object => wx.getStorageInfoSync()
            }
        }
        return {
            mode: undefined, handle: undefined, // 不支持的环境
            get: () => undefined,
            set: () => undefined,
            remove: () => undefined,
            clean: () => undefined,
            info: (): object => ({}) // 不支持则返回空对象
        }
    }

    /**
     *  语法糖 -> 操作本地 cache
     * @param key 缓存关键字
     * @param value 缓存字段，会根据环境自动使用 JSON.stringify 序列化
     * @param timeout 缓存时间，若为数字格式则以秒为计算单位，字符串格式的末尾需要添加单位 如 '1d'=1天 '1h'=1小时 '1m'=1分钟 '1s'=1秒
     */
    cache(key: any, value?: any, timeout?: number | string) {
        if (key) {
            if (value === undefined && timeout === undefined) {
                return this.cacheGet(key)
            } else if (value === null || timeout === 0) {
                return this.cacheRemove(key)
            } else {
                return this.cacheSet(key, value, timeout)
            }
        }
    }

    // 获取缓存
    cacheGet(key: any) {
        if (key === undefined) {
            console.error('cache key can not be blank.')
            return undefined
        } else if (typeof key !== 'string') {
            try {
                key = JSON.stringify(key)
            } catch (err) {
                console.error('cache key is contrary to expectation.')
                return undefined
            }
        }
        const {client} = this
        const cache: any = client.get(key)
        const expired: number | undefined | null = client.get(`${key}_timeout`)
        if (expired && Date.now() > expired) {
            client.remove(key)
            client.remove(`${key}_timeout`)
            return null
        }
        return cache
    }

    // 存储缓存
    cacheSet(key: any, val: any, timeout?: string | number) {
        if (key === undefined) {
            console.error('cache key can not be blank.')
            return undefined
        } else if (typeof key !== 'string') {
            try {
                key = JSON.stringify(key)
            } catch (err) {
                console.error('cache key is contrary to expectation.')
                return undefined
            }
        }
        const {client} = this
        if (timeout) {
            let throughSecond = 0
            if (typeof timeout === 'number') {
                throughSecond = timeout
            } else if (typeof timeout === 'string') {
                const duration: number = parseInt(timeout, 10)
                const unit: string = timeout.charAt(timeout.length-1)
                if (duration && duration > 0) {
                    if (unit === 'd' || unit === 'day' || unit === 'D') {
                        throughSecond = duration * 60 * 60 * 24
                    } else if (unit === 'h' || unit === 'hour' || unit === 'H') {
                        throughSecond = duration * 60 * 60
                    } else if (unit === 'm' || unit === 'minute' || unit === 'M') {
                        throughSecond = duration * 60
                    } else {
                        throughSecond = duration
                    }
                }
            }
            if (throughSecond) {
                const expired: number = throughSecond * 1000 + Date.now()
                client.set(`${key}_timeout`, expired)
            }
        }
        return client.set(key, val)
    }

    cacheRemove(key: any) {
        if (key === undefined) {
            console.error('cache key can not be blank.')
            return undefined
        } else if (typeof key !== 'string') {
            try {
                key = JSON.stringify(key)
            } catch (err) {
                console.error('cache key is contrary to expectation.')
                return undefined
            }
        }
        return this.client.remove(key)
    }

    // 清除缓存
    cacheClean() {
        return this.client.clean()
    }

    // 获取当前缓存信息
    cacheInfo() {
        const {mode, handle, info} = this.client
        return {mode, handle, ...info()}
    }
}
const Store = new Storager()
const client = Store.client
const cache = (key: any, value?: any, timeout?: number | string) => Store.cache(key, value, timeout)
const cacheGet = (key: any) => Store.cacheGet(key)
const cacheSet = (key: any, value: any, timeout?: string | number) => Store.cacheSet(key, value, timeout)
const cacheRemove = (key: any) => Store.cacheRemove(key)
const cacheClean = () => Store.cacheClean()
const cacheInfo = () => Store.cacheInfo()

module.exports = {
    client, cache,
    cacheGet, cacheSet, cacheRemove,
    cacheClean, cacheInfo
}