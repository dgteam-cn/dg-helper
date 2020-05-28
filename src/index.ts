import { Time, Timestamp } from './plugins/time'
import { Is, IsInt, IsEmpty, IsObject, IsArray } from './plugins/determine'
import { Client as CacheClient, Cache, CacheGet, CacheSet, CacheRemove, CacheClean, CacheInfo } from './plugins/cache'
import { Big, Price, PriceUppercase, PrefixZero, Uuid } from './plugins/math'


// console.log('CacheClient',CacheClient)
// console.log('Time',Time(),UnTimestamp(),Timestamp())
// console.log('IsEmpty',IsEmpty({}))
// console.log('IsInt',IsInt({}))
export = {

    // 继承一个对象
    Extend(old: any, ...obj: any): object {
        return Object.assign(old,...obj)
    },

    // 拷贝一个对象或数组
    Origin(sample: any): any {
        try{
            if(sample === undefined || sample === null || Number.isNaN(sample)) return sample
            else return JSON.parse(JSON.stringify(sample))
        }catch(err){
            console.error('Fun-Origin 错误的对象格式: ',typeof sample,sample)
            return sample
        }
    },

    // 打印数组
    Log(...args: any[]): void {
        if (args.length > 0 && typeof console.group !== undefined) {
            console.group ('%cLogs', 'background: #2E495E;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 5px;')
            args.forEach(item => console.log(item))
            console.groupEnd()
        }else{
            console.log('\n',...args,'\n')
        }
    },

    Big, Price, PriceUppercase, PrefixZero, Uuid,
    CacheClient, Cache, CacheGet, CacheSet, CacheRemove, CacheClean, CacheInfo,
    Time, Timestamp,
    Is, IsInt, IsEmpty, IsObject, IsArray
}