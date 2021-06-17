"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {Time, Timestamp} from './plugins/time'
// import {Is, IsInt, IsEmpty, IsObject, IsArray} from './plugins/determine'
// import {Client as CacheClient, Cache, CacheGet, CacheSet, CacheRemove, CacheClean, CacheInfo} from './plugins/cache'
// import {Big, Price, PriceUppercase, PrefixZero, Uuid} from './plugins/math'
// import {UrlParse} from './plugins/url'
const { time, timestamp } = require('./plugins/time');
const { is, isInt, isEmpty, isObject, isArray } = require('./plugins/determine');
const { client: cacheClient, cache, cacheGet, cacheSet, cacheRemove, cacheClean, cacheInfo } = require('./plugins/cache');
const { big, price, priceUppercase, prefixZero, uuid } = require('./plugins/math');
const { urlParse } = require('./plugins/url');
const pkg = require('../package.json');
const helper = {
    version: pkg.version,
    // // （浅拷贝）继承一个对象
    // Extend(old: any, ...obj: any): object {
    //     return Object.assign(old, ...obj) // 这个方法没有办法深拷贝
    // },
    extend(target = {}, ...args) {
        let i = 0;
        const length = args.length;
        let options;
        let name;
        let src;
        let copy;
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
                }
                else if (isObject(copy)) {
                    target[name] = this.extend(src && isObject(src) ? src : {}, copy);
                }
                else {
                    target[name] = copy;
                }
            }
        }
        return target;
    },
    // （深拷贝）复制一个对象或数组 - 无法拷贝 Function
    origin(sample) {
        try {
            if (sample === undefined || sample === null || Number.isNaN(sample))
                return sample;
            else
                return JSON.parse(JSON.stringify(sample));
        }
        catch (err) {
            console.error('Fun-Origin 错误的对象格式: ', typeof sample, sample);
            return sample;
        }
    },
    // 打印数组
    log(...args) {
        // eslint-disable-next-line no-console
        if (args.length > 0 && typeof console.group !== undefined) {
            // eslint-disable-next-line no-console
            console.group('%cLogs', 'background: #2E495E;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 5px;');
            // eslint-disable-next-line no-console
            args.forEach(item => console.log(item));
            // eslint-disable-next-line no-console
            console.groupEnd();
        }
        else {
            // eslint-disable-next-line no-console
            console.log('\n', ...args, '\n');
        }
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
    enum(list = [], fun = new Function(), options = {}) {
        if (typeof options === 'string') {
            options = { defLabel: options };
        }
        const config = Object.assign({ name: ['name'], label: ['label', 'title'], strict: false, defLabel: '' }, options);
        let { name, label, strict = false, defLabel } = config;
        // 枚举匹配判定函数
        const handel = typeof fun !== 'function' ? (item) => {
            if (typeof name === 'string') {
                name = [name];
            }
            for (const _name of name) {
                if (strict ? item[_name] === fun : item[_name] == fun) {
                    return true;
                }
            }
            return false;
        } : fun;
        for (const item of list) {
            if (handel(item)) {
                if (typeof label === 'string') {
                    label = [label];
                }
                if (Array.isArray(label)) {
                    for (let key of label) {
                        if (item[key] !== undefined) {
                            return item[key];
                        }
                    }
                }
                return item;
            }
        }
        return defLabel;
    },
    // 其他方法
    big, price, priceUppercase, prefixZero, uuid,
    cacheClient, cache, cacheGet, cacheSet, cacheRemove, cacheClean, cacheInfo,
    time, timestamp,
    is, isInt, isEmpty, isObject, isArray,
    urlParse
};
module.exports = helper;
