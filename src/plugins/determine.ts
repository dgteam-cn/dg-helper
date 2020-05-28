/**
 *  变量判定
 * @param type 判定类型 [ int, object, array, empty, formdata ]
 * @param sample 判定样本
 * @param strict 是否使用严格模式，如果为 false 可能会降低判定精度
 */

// interface IsOpts {
//     strict?: boolean
// }
const Is = (type: string = "object", sample: any, { strict=true }={}): boolean => {
    switch (type.toLocaleLowerCase()) {
        case 'int':
            if(sample % 1 === 0){
                if(strict && typeof sample !== 'number'){
                    return false // 123 or 123.00 都会返回 true
                }
                return true // 123 or '123' or 123.00 or '123.00' 都会返回 true
            }
            return typeof sample === 'number' && sample % 1 === 0
        case 'object':
            if(sample && typeof sample === 'object'){
                if(strict && Object.prototype.toString.call(sample) !== "[object Object]"){
                    return false // 严格模式下只有 {} 的对象可以返回 true
                }
                return true // [] 等也会返回 true
            }
        case 'array':
            return Array.isArray(sample)
        case 'empty':
            if (sample === null) return true;
            else if (sample === undefined) return true;
            else if (Array.isArray(sample)) return sample.length === 0 ? true : false;
            else if (typeof sample === 'object'){
                for (const key in sample) {
                    if (Object.prototype.hasOwnProperty.call(sample, key)) return false
                }
            }
            return true
        // case 'buffer':
        //     return sample && typeof sample === "object" && Buffer.isBuffer(sample) // Object.prototype.toString.call(sample) === '[object Uint8Array]'
        case 'formdata':
            return sample && typeof sample === 'object' && Object.prototype.toString.call(sample) === "[object FormData]"
        default:
            return false;
    }
}

const IsInt = (sample: any, opt?: object): boolean => Is('int', sample, opt)
const IsEmpty = (sample: any, opt?: object): boolean => Is('empty', sample, opt)
const IsObject = (sample: any, opt?: object): boolean => Is('object', sample, opt)
const IsArray = (sample: any, opt?: object): boolean => Is('array', sample, opt)

export { Is, IsInt, IsEmpty, IsObject, IsArray }