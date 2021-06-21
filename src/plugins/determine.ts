function objectToString(o) {
    return Object.prototype.toString.call(o)
}
/**
 * 变量判定
 * 可参考 core-util-is [github: https://github.com/isaacs/core-util-is]
 * @param {string} type - 判定类型 [int, object, array, empty, formdata] (不区分大小写)
 * @param {any} sample - 需要判定的对象样本
 * @param {boolean} opt.strict - 是否使用严格模式，如果为 false 可能会降低判定精度
 * @return {boolean} 判定结果
 */
const is = (type: string = "object", sample: any, {strict = true} = {}): boolean => {
    switch (type.toLocaleLowerCase()) {
        case 'int': {
            if (sample % 1 === 0) {
                if (strict && typeof sample !== 'number') {
                    return false // 123 or 123.00 都会返回 true
                }
                return true // 123 or '123' or 123.00 or '123.00' 都会返回 true
            }
            return typeof sample === 'number' && sample % 1 === 0
        }
        case 'object': {
            if (sample && typeof sample === 'object') {
                if (strict && objectToString(sample) !== "[object Object]") {
                    return false // 严格模式下只有 {} 的对象可以返回 true
                }
                return true // 非严格模式，[] 等也会返回 true
            }
            return false
        }
        case 'array': {
            if (Array.isArray) return Array.isArray(sample)
            return objectToString(sample) === '[object Array]'
        }
        case 'empty': {
            if (sample === null || sample === undefined) return true
            else if (Array.isArray(sample)) return sample.length === 0
            else if (typeof sample === 'object') {
                for (const key in sample) {
                    if (Object.prototype.hasOwnProperty.call(sample, key)) return false
                }
            }
            return true
        }
        case 'date': {
            return objectToString(sample) === '[object Date]'
        }
        case 'regexp': {
            return objectToString(sample) === '[object RegExp]'
        }
        case 'formdata': {
            return sample && typeof sample === 'object' && objectToString.call(sample) === "[object FormData]"
        }
        case 'promise': {
            return sample && typeof sample.then === 'function'
        }
        case 'NaN': {
            return Number.isNaN(sample)
        }
        default:
            return false
    }
}

const isInt = (sample: any, opt?: object): boolean => is('int', sample, opt)
const isEmpty = (sample: any, opt?: object): boolean => is('empty', sample, opt)
const isObject = (sample: any, opt?: object): boolean => is('object', sample, opt)
const isArray = (sample: any, opt?: object): boolean => is('array', sample, opt)

module.exports = {is, isInt, isEmpty, isObject, isArray}