
const { Time, Timestamp, UnTimestamp } = require('../plugins/base/time.js')
const { Cache, CacheClean, CacheInfo, Token } = require('../plugins/base/cache.js')
const { Is, IsInt, IsEmpty, IsObject, IsArray }  = require('../plugins/base/determine.js')
const { Big, PrefixZero, Price, Uuid }  = require('../plugins/base/math.js')

module.exports = {
	Extend: (old,...obj) => Object.assign(old,...obj),
    Origin: (obj) => {
        try{
            return JSON.parse(JSON.stringify(obj))
        }catch(err){
            console.err('Fun-Origin 错误的对象格式',obj)
            return obj
        }
    },
    // 数组转对象
    ArrayToObject: (arr, key) => {
        let obj = {}
        if (Array.isArray(arr) && arr.length) {
            arr.forEach((item, index) => {
                obj[item[key] ? item[key] : index] = this.Origin(item)
            })
        }
        return obj
    },

    Log: (...log) => {
        const logs = [ ...log ]
        if (logs.length > 0 && console.group) {
            console.group ('%cLogs', 'background: #2E495E;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 5px;')
            logs.forEach(item => console.log(item))
            console.groupEnd()
        }else{
            console.log('\n',...log,'\n')
        }        
    },

    Big,PrefixZero, Price, Uuid, // 数学相关
    Cache, CacheClean, CacheInfo, Token, // 缓存相关
    Time, Timestamp, UnTimestamp, // 时间相关
    Is, IsInt, IsEmpty, IsObject, IsArray, // 判定相关
}