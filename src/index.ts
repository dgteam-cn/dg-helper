// import {UrlParse} from './plugins/url'
const {time, timestamp} = require('./plugins/time')
const {is, isInt, isEmpty, isObject, isArray} = require('./plugins/determine')
const {client: cacheClient, cache, cacheGet, cacheSet, cacheRemove, cacheClean, cacheInfo} = require('./plugins/cache')
const {big, price, priceUppercase, prefixZero, uuid, randomNumber, randomString, randomInt} = require('./plugins/math')
const pkg: any = require('../package.json')

export interface enumOptions {
    name?: string | Array<string>,
    label?: string | Array<string>,
    strict?: boolean,
    defLabel?: string
}

/**
 * @date 2021-06-21
 * @author 2681137811<donguayx@qq.com>
 */
module.exports = {

    // 版本号
    version: pkg.version,

    /**
     * 拷贝一个对象（深拷贝）
     * @param {object} target - 原始对象
     * @param {object[]} args - 需要基础的对象，传入无效值回会忽略继承；
     * @returns {object} 新的对象
     * 使用 Object.assign 方法无法进行办法深拷贝，对象深度超过 1 层将会失效
     */
    extend(target: any = {}, ...args: any): object {
        let i = 0;
        const length = args.length;
        let options, name, src, copy;
        if (!target) {
            target = isArray(args[0]) ? [] : {};
        }
        for (; i < length; i++) {
            options = args[i];
            if (!options) {
                continue;
            }
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (src && src === copy) {
                    continue;
                }
                if (isArray(copy)) {
                    target[name] = this.extend([], copy);
                } else if (isObject(copy)) {
                    target[name] = this.extend(src && isObject(src) ? src : {}, copy);
                } else {
                    target[name] = copy;
                }
            }
        }
        return target
    },

    /**
     * 复制一个 json 对象（深拷贝），无法复制 function 类型字段
     * @param {object} sample - 需要复制对象
     * @returns {object} 新的对象
     */
    originJSON(sample: any): any {
        try {
            if (sample === undefined || sample === null || Number.isNaN(sample)) return sample
            else return JSON.parse(JSON.stringify(sample))
        } catch (err) {
            console.error('Fun-Origin 错误的对象格式: ', typeof sample, sample)
            return sample
        }
    },
    origin(sample: any): any { // 注意此命名以后可能会废弃，请使用 originJSON
        return this.originJSON(sample)
    },

    /**
     * 复制一个 json 对象（深拷贝），无法复制 function 类型字段
     * @param {string[]} sample - 需要复制对象
     * @returns {object} 新的对象
     */
    log(...args: any[]): void {
        // eslint-disable-next-line no-console
        if (args.length > 0 && typeof console.group !== undefined) {
            // eslint-disable-next-line no-console
            console.group('%cLogs', 'background: #2E495E;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 5px;')
            // eslint-disable-next-line no-console
            args.forEach(item => console.log(item))
            // eslint-disable-next-line no-console
            console.groupEnd()
        } else {
            // eslint-disable-next-line no-console
            console.log('\n', ...args, '\n')
        }
    },

    /**
     * 去除文字左右两边空格
     * @param {string} str - 需要处理的字符串
     * @returns {string} 新的字符串
     */
    trim(str: string, {all = false} = {}): string {
        if (all) return str.replace(/\s/g, "")
        return str.replace(/(^\s*)|(\s*$)/g, "")
    },

    /**
     * @name 数组枚举
     * @param {array}           list 待枚举数组
     * @param {any}             fun - 若传入 function 则使用方法判定 row 与 item 是否匹配
     *                                若传入其他值则使用 list 中的 key[name] 值进行比较
     * @param {object|string}   options - 若传入 string 则将此值设为 options.defLabel
     * @param {string}          options.name - 枚举名 - 待枚举数组交叉对比的 key
     * @param {string}          options.label - 枚举名 - 待枚举数组匹配后返回的值
     * @param {string}          options.strict - 严格检查（本属性未实装）
     * @param {string}          options.defLabel - 所有成员均未命中时的返回值
     * @description row： 枚举对象   | name：枚举名    label: 枚举值
     *              item：数据源对象 | key: 待枚举名   value: 待枚举值
     * @return {string}
     */
    enum(list: Array<any> = [], fun: any = new Function(), options: enumOptions | string  = {}): any {
        if (typeof options === 'string') {
            options = {defLabel: options}
        }
        const config: enumOptions = Object.assign({name: ['name'], label: ['label', 'title'], strict: false, defLabel: ''}, options)
        let {name, label, strict = false, defLabel} = config
        // 枚举匹配判定函数
        const handel = typeof fun !== 'function' ? (item): boolean => {
            if (typeof name === 'string') {
                name = [name]
            }
            for (const _name of name) {
                if (strict ? item[_name] === fun : item[_name] == fun) {
                    return true
                }
            }
            return false
        } : fun
        for (const item of list) {
            if (handel(item)) {
                if (typeof label === 'string') {
                    label = [label]
                }
                if (Array.isArray(label)) {
                    for (let key of label) {
                        if (item[key] !== undefined) {
                            return item[key]
                        }
                    }
                }
                return item
            }
        }
        return defLabel
    },

    /**
     * 驼峰字符串转为转蛇形字符串
     * @param {string} str - 需要处理的字符串
     * @param {string} [separator = '_'] - 分隔符
     * @returns {string} 新的字符串
     */
    snakeCase(str: string, separator: string = '_'): string {
        return str.replace(/([^A-Z])([A-Z])/g, function($0, $1, $2) {
            return $1 + separator + $2.toLowerCase()
        })
    },

    /**
     * 蛇形字符串转驼峰字符串
     * @param {string} str - 需要处理的字符串
     * @param {string} [separator = '_'] - 分隔符
     * @returns {string} 新的字符串
     */
    camelCase(str: string, separator: string = '_'): string {
        return str.replace(RegExp(`${separator}(\\w)`, 'g'), function ($0, $1) {
            return $1.toUpperCase()
        })
    },

    /**
     * 通过字符串的路径去递归深层的查找对象属性
     * 如果匹配不到则返回 undefined
     * 例如 deepObjectMatch({a: {b: {c: 5}}}, 'a.b.c') // 结果为 5
     * 2021-08-30 日新增此方法
     * @param {Object} tunnel - 需要检查的对象
     * @param {String | Array[String]} paths - 检查的路径
     * @returns {any}
     */
    deepObjectMatch(tunnel: any, paths: any): any {
        if (typeof paths === 'string') paths = paths.split('.')
        if (paths.length > 0) {
            const key = paths.shift()
            if (typeof tunnel === 'object' && Object.prototype.hasOwnProperty.call(tunnel, key)) {
                return paths.length > 0 ? this.deepObjectMatch(tunnel[key], paths) : tunnel[key]
            }
        }
        return undefined
    },

    // 其他方法
    big, price, priceUppercase, prefixZero, uuid, randomNumber, randomString, randomInt,
    cacheClient, cache, cacheGet, cacheSet, cacheRemove, cacheClean, cacheInfo,
    time, timestamp,
    is, isInt, isEmpty, isObject, isArray
}