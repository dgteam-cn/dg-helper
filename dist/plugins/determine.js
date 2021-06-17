/**
 *  变量判定
 * @param type 判定类型 [ int, object, array, empty, formdata ]
 * @param sample 判定样本
 * @param strict 是否使用严格模式，如果为 false 可能会降低判定精度
 */
const is = (type = "object", sample, { strict = true } = {}) => {
    switch (type.toLocaleLowerCase()) {
        case 'int': {
            if (sample % 1 === 0) {
                if (strict && typeof sample !== 'number') {
                    return false; // 123 or 123.00 都会返回 true
                }
                return true; // 123 or '123' or 123.00 or '123.00' 都会返回 true
            }
            return typeof sample === 'number' && sample % 1 === 0;
        }
        case 'object': {
            if (sample && typeof sample === 'object') {
                if (strict && Object.prototype.toString.call(sample) !== "[object Object]") {
                    return false; // 严格模式下只有 {} 的对象可以返回 true
                }
                return true; // [] 等也会返回 true
            }
            return false;
        }
        case 'array': {
            return Array.isArray(sample);
        }
        case 'empty': {
            if (sample === null)
                return true;
            else if (sample === undefined)
                return true;
            else if (Array.isArray(sample))
                return sample.length === 0;
            else if (typeof sample === 'object') {
                for (const key in sample) {
                    if (Object.prototype.hasOwnProperty.call(sample, key))
                        return false;
                }
            }
            return true;
        }
        case 'formdata': {
            return sample && typeof sample === 'object' && Object.prototype.toString.call(sample) === "[object FormData]";
        }
        default:
            return false;
    }
};
const isInt = (sample, opt) => is('int', sample, opt);
const isEmpty = (sample, opt) => is('empty', sample, opt);
const isObject = (sample, opt) => is('object', sample, opt);
const isArray = (sample, opt) => is('array', sample, opt);
module.exports = { is, isInt, isEmpty, isObject, isArray };
