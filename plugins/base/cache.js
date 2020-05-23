/*
    localStorage 缓存相关
    支持 browser 平台，uniapp 平台
*/ 

const cache = {

    // 获取缓存对象实例
    get Client(){
        if(process.client){
            if(typeof window === 'object' && typeof window.localStorage  === 'object'){                
                return {
                    mode: 'browser', handle: 'window', // browser 平台
                    get: (key) => {
                        try {
                            return JSON.parse(window.localStorage.getItem(key))
                        } catch(err) {
                            return window.localStorage.getItem(key)  
                        }
                    },
                    set: (key,value) => window.localStorage.setItem(key,JSON.stringify(value)),
                    remove: (key) => window.localStorage.removeItem(key),
                    clean: () => window.localStorage.clear(),
                    info: () => new Object() // 不支持
                }
            }else if(typeof uni === 'object' && uni.getStorageSync){                
                return {
                    mode: 'uniapp', handle: 'uni', // uniapp 平台
                    get: (key) => uni.getStorageSync(key),
                    set: (key,value) => uni.setStorageSync(key,value),
                    remove: (key) => uni.removeStorageSync(key),
                    clean: () => uni.clearStorageSync(),
                    info: ()=> uni.getStorageInfoSync()
                }
            }else if(typeof plus === 'object' && plus.storag){                
                return {
                    mode: 'html5+',handle: 'plus',  // H5+ 平台
                    get: (key) => plus.storage.getItem(key),
                    set: (key,value) => plus.storage.setItem(key,value),
                    remove: (key) => plus.storage.removeItem(key),
                    clean: () => plus.storage.clear(),
                    info: () => new Object() // 不支持
                }
            }else if(typeof wx === 'object' && wx.getStorageSync){                
                return {
                    mode: 'wx', handle: 'wx', // 微信小程序平台
                    get: (key) => wx.getStorageSync(key),
                    set: (key,value) => wx.setStorageSync(key,value),
                    remove: (key) => wx.removeStorageSync(key),
                    clean: () => wx.clearStorageSync(),
                    info: ()=> wx.getStorageInfoSync()
                }
            }
        }
        if(process.client){
            console.error('localStorage error')
        }        
        return {
            get: (key) => undefined,
            set: (key,value) => undefined,
            remove: (key) => undefined,
            clean: () => undefined
        }
    },

    // 语法糖 -> 操作本地 token
    Token: (token) => {
        if(token === undefined) {
            return this.Cache('token')
        } else if (token === null) {
            return this.Cache('token', null)
        } else if (token) {
            return this.Cache('token', token)
        }
    },

    // 语法糖 -> 操作本地 cache
    Cache: (key,val,timeout) => {
        if(key){
            if(val===undefined && timeout===undefined){
                return this.CacheGet(key)
            }else if(val === null || timeout === 0){
                return this.CacheClean(key)
            }else{
                return this.CacheSet(key,val,timeout)
            }
        }
    },

    // 获取缓存
    CacheGet: (key) => {
        if(key === undefined){
            throw 'cache key can not be blank.'
        }else if(typeof key !== 'string'){
            try {
                key = JSON.stringify(key)
            } catch(err) {
                console.error('cache key is contrary to expectation.')
                return undefined
            }
        }
        let { Client } = this
        let cache = Client.get(key)
        let expired = Client.get(`${key}_timeout`)
        if(expired && Date.now() > expired){
            Client.remove(key)
            Client.remove(`${key}_timeout`)
            return null
        }
        return cache
    },

    // 存储缓存
    CacheSet: (key,val,timeout) => {
        if(key === undefined){
            throw 'cache key can not be blank.'
        }else if(typeof key !== 'string'){
            try {
                key = JSON.stringify(key)
            } catch(err) {
                console.error('cache key is contrary to expectation.')
                return undefined
            }
        }
        let { Client } = this
        if(timeout){
            let throughSecond = 0
            if(typeof timeout === 'number'){
                throughSecond = timeout
            }else if(typeof timeout === 'string'){
                let number = parseInt(timeout)
                let unit = timeout.charAt(timeout.length-1)
                if(number && number > 0){
                    if(unit === 'd' || unit === 'day' || unit === 'D'){
                        throughSecond = number * 60 * 60 * 24
                    }else if(unit === 'h' || unit === 'hour' || unit === 'H'){
                        throughSecond = number * 60 * 60
                    }else if(unit === 'm' || unit === 'minute' || unit === 'M'){
                        throughSecond = number * 60
                    }else{
                        throughSecond = number
                    }
                }
            }
            if(throughSecond){
                let expired = throughSecond * 1000 + Date.now()
                Client.set(`${key}_timeout`,expired)
            }
        }
        return Client.set(key,val)
    },

    // 清除缓存
    CacheClean: () => this.Client.clean(),

    // 获取当前缓存信息
    CacheInfo: () => new Object( { mode: this.Client.mode, handle: this.Client.handle, ...this.Client.info() })
}

module.exports.Client = cache.Client
module.exports.Token = cache.Token
module.exports.Cache = cache.Cache
module.exports.CacheGet = cache.CacheGet
module.exports.CacheSet = cache.CacheSet
module.exports.CacheClean = cache.CacheClean
module.exports.CacheInfo = cache.CacheInfo