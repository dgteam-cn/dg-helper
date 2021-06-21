const helper = require('../dist/index.js')
const hash = require('../dist/hash.js')
const {debounce, throttle} = require('../dist/lodash.js')

const sleep = function(num) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), num)
    })
}
const test = {
    async run() {
        // eslint-disable-next-line no-console
        console.log('\n', '===== helper testing =====')
        const obj = {map: {}, success: 0, fail: 0, ignore: 0}

        // index.js
        const o1 = {a: 1}
        const o2 = helper.extend(o1)
        o2.a = 2
        const o3 = helper.extend({}, o1)
        o3.a = 3
        obj.map['extend'] = o1.a === o2.a && o1.a !== o3.a
        obj.map['originJSON'] = JSON.stringify(helper.originJSON({a: 1, b: {c: 2}, d: function() {}})) === '{"a":1,"b":{"c":2}}'
        obj.map['trim'] = helper.trim(' a b ') === 'a b' && helper.trim(' a b ', {all: true}) === 'ab'
        obj.map['enum'] =
            helper.enum([{name: 'a', title: 'A'}], 'a') === 'A' &&
            helper.enum([{name: 'a', title: 'A'}], 'b', 'not found') === 'not found' &&
            helper.enum([{name: 'a', title: 'A'}], 'b', {defLabel: 'not found'}) === 'not found' &&
            helper.enum([{key: 'a', value: 'A'}], 'a', {name: 'key', label: 'value'}) === 'A'
        obj.map['snakeCase'] = helper.snakeCase('snakeCase') === 'snake_case' && helper.snakeCase('snake_case') === 'snake_case'
        obj.map['camelCase'] = helper.camelCase('camelCase') === 'camelCase' && helper.camelCase('camel_case') === 'camelCase'

        // plugins/math.ts
        obj.map['big'] = helper.big(0.1).mul(0.2).toNumber() == 0.02
        obj.map['price'] =
            helper.price(0.12345) === '0.12' &&
            helper.price(12345.67) === '12,345.67' &&
            helper.price(12345.67, {format: 'array'})[1] === '67' &&
            helper.price(12345.67, {separate: 2}) === '1,23,45.67' &&
            helper.price(12345.67, {unit: '元'}) === '12,345.67元' &&
            helper.price(12345.67, {unit: '万'}) === '1.23万' &&
            helper.price(12345.67, {unit: '万元'}) === '1.23万元' &&
            helper.price(100, {force: true}) === '100.00'
        obj.map['priceUppercase'] =
            helper.priceUppercase(12345) == '壹万贰仟叁佰肆拾伍元整' &&
            helper.priceUppercase(12345, {suffix: false}) == '壹万贰仟叁佰肆拾伍元'
        obj.map['prefixZero'] =
            helper.prefixZero(100, 3) === '100' &&
            helper.prefixZero(100, 6) === '000100'
        obj.map['uuid'] = typeof helper.uuid() === 'string' && helper.uuid().length > 20
        obj.map['randomNumber'] = helper.randomNumber() > 0
        const randomInt = helper.randomInt(6)
        obj.map['randomInt'] = randomInt.length === 6 && randomInt == Number(randomInt)
        obj.map['randomString'] = helper.randomInt(6, 'all').length === 6
        // console.log(helper.randomNumber(), helper.randomNumber(), helper.randomNumber()))
        // console.log(helper.randomString(12, 'all'), helper.randomString(12, 'alpha'), helper.randomString(12, 'alphaNumeric'))
        // console.log(helper.randomInt(6), helper.randomInt(6), helper.randomInt(6))


        // plugins/cache.ts
        if (helper.cacheInfo().mode) {
            const cacheKey = 'cacheTestKey'
            helper.cache(cacheKey, 123456)
            const flagGet = helper.cache(cacheKey) === helper.cacheGet(cacheKey) && helper.cache(cacheKey) === 123456
            helper.cache(cacheKey, null)
            const flagRemove = helper.cache(cacheKey) === undefined || helper.cache(cacheKey) === null
            obj.map['cache'] = flagGet && flagRemove
            if (!obj.map['cache'] && flagGet && !flagRemove) {
                if (helper.cacheInfo().mode.indexOf('uni') >= 0 && helper.cache(cacheKey) === '') {
                    obj.map['cache'] = true
                }
            }
        } else {
            obj.map['cache'] = null
        }


        // plugins/time.ts
        obj.map['time'] =
            helper.time(1613724298924, 'yyyy-MM-dd hh:mm') === '2021-02-19 16:44' &&
            helper.time(1613724298, 'yyyy-MM-dd hh:mm') === '2021-02-19 16:44' &&
            helper.time(new Date('2021-02-19 16:44:00'), 'yyyy-MM-dd hh:mm') === '2021-02-19 16:44' &&
            helper.time(new Date('2021/02/19 16:44:00'), 'yyyy-MM-dd hh:mm') === '2021-02-19 16:44' &&
            helper.time(1613724298, 'ddMMyyyyssmmhh') === "19022021584416"
        obj.map['timestamp'] = helper.timestamp(new Date('2021/02/19 16:44:58')) === 1613724298


        // plugins/determine.ts
        obj.map['isInt'] = helper.is('int', 1) && !helper.is('int', '1') && !helper.is('int', 1.15) && helper.is('int', '1', {strict: false})
        obj.map['isEmpty'] = helper.isEmpty({}) && !helper.isEmpty({a: 1}) && helper.isEmpty([]) && !helper.isEmpty([1])
        obj.map['isObject'] = helper.isObject({}) && !helper.isObject([])
        obj.map['isArray'] = !helper.isArray({}) && helper.isArray([])


        // Md5 加密和 Base64 加密
        const base64Str = hash.base64('123?a=123')
        const base64StrDecode = hash.base64Decode('MTIzP2E9MTIz')
        const base64URL = 'http://example.com/user/login?token=123456'
        const base64URLEncode = "aHR0cDovL2V4YW1wbGUuY29tL3VzZXIvbG9naW4_dG9rZW49MTIzNDU2"
        obj.map['md5'] = hash.md5(123456) === 'e10adc3949ba59abbe56e057f20f883e'
        obj.map['base64Encode'] = base64Str === 'MTIzP2E9MTIz'
        obj.map['base64EncodeURL'] = hash.base64EncodeURL(base64URL) === base64URLEncode
        obj.map['base64Decode'] = base64StrDecode && base64StrDecode === hash.base64('MTIzP2E9MTIz', 'decode') && hash.base64Decode(base64URLEncode) === base64URL

        // plugins/lodash.ts
        const lodashStatis = {debounce: 0, throttle: 0}
        const debounceFun = debounce(function() {
            lodashStatis.debounce += 1
        }, 200)
        const throttleFun = throttle(function() {
            lodashStatis.throttle += 1
        }, 500)
        debounceFun()
        throttleFun()
        debounceFun()
        throttleFun()
        await sleep(100)
        debounceFun()
        throttleFun()
        await sleep(300)
        obj.map['debounce'] = lodashStatis.debounce === 1
        obj.map['throttle'] = lodashStatis.throttle === 1

        this.console(obj)
    },
    console(obj) {
        // eslint-disable-next-line no-console
        if (console.table) {
            const list = []
            for (const key in obj.map) {
                const result = obj.map[key]
                if (result !== null) {
                    list.push({name: key, result: result ? 'success' : 'fail'})
                    result ? obj.success ++ : obj.fail ++
                } else {
                    list.push({name: key, result: '-'})
                    obj.ignore ++
                }
            }
            const {success, fail, ignore} = obj
            // eslint-disable-next-line no-console
            console.table(list)
            // eslint-disable-next-line no-console
            console.table([{success, fail, ignore}])
        } else {
            for (const key in obj.map) {
                const result = obj.map[key]
                if (result !== null) {
                    // eslint-disable-next-line no-console
                    console.log(`${key}: `, obj.map[key])
                    result ? obj.success ++ : obj.fail ++
                } else {
                    // eslint-disable-next-line no-console
                    console.log(`${key}: `, '-')
                    obj.ignore ++
                }
            }
            // eslint-disable-next-line no-console
            console.log(`===== success: ${obj.success} | fail: ${obj.fail} | ignore: ${obj.ignore} =====`, '\n')
        }
    }
}
module.exports = test
