const helper = require('../dist/index.js')
const hash = require('../dist/hash.js')

const test = {
    run() {
        console.log('\n', '===== helper testing =====')
        const obj = {map: {}, success: 0, fail: 0, ignore: 0}
        const o1 = {a: 1}
        const o2 = helper.extend(o1)
        o2.a = 2
        const o3 = helper.extend({}, o1)
        o3.a = 3
        obj.map['extend'] = o1.a === o2.a && o1.a !== o3.a
        obj.map['origin'] = JSON.stringify(helper.origin({a: 1})) === '{"a":1}'
        obj.map['enum'] = helper.enum([{name: 'a', title: 'A'}], 'a') === 'A'
        obj.map['big'] = helper.big(0.1).mul(0.2).toNumber() == 0.02
        obj.map['price'] = helper.price(0.12345) == 0.12
        obj.map['priceUppercase'] = helper.priceUppercase(12345) == '壹万贰仟叁佰肆拾伍元整'
        obj.map['prefixZero'] = helper.prefixZero(100, 6) === '000100'
        obj.map['uuid'] = typeof helper.uuid() === 'string' && helper.uuid().length > 20

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

        obj.map['time'] = helper.time(1613724298924, 'yyyy-MM-dd hh:ss') === '2021-02-19 16:58'
        obj.map['timestamp'] = helper.timestamp(new Date('2021/02/19 16:58')) === 1613725080
        obj.map['isEmpty'] = helper.isEmpty({}) && !helper.isEmpty({a: 1}) && helper.isEmpty([]) && !helper.isEmpty([1])
        obj.map['isObject'] = helper.isObject({}) && !helper.isObject([])
        obj.map['isArray'] = !helper.isArray({}) && helper.isArray([])
        obj.map['urlParse'] = helper.urlParse('http://www.baidu.com?a=123').host === 'www.baidu.com'


        const base64Str = hash.base64('123?a=123')
        const base64StrDecode = hash.base64Decode('MTIzP2E9MTIz')

        obj.map['md5'] = hash.md5(123456) === 'e10adc3949ba59abbe56e057f20f883e'
        obj.map['base64'] = base64Str === 'MTIzP2E9MTIz'
        obj.map['base64'] = base64StrDecode && base64StrDecode === hash.base64('MTIzP2E9MTIz', 'decode')

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
            console.table(list)
            console.table([{success, fail, ignore}])
        } else {
            for (const key in obj.map) {
                const result = obj.map[key]
                if (result !== null) {
                    console.log(`${key}: `, obj.map[key])
                    result ? obj.success ++ : obj.fail ++
                } else {
                    console.log(`${key}: `, '-')
                    obj.ignore ++
                }
            }
            console.log(`===== success: ${obj.success} | fail: ${obj.fail} | ignore: ${obj.ignore} =====`, '\n')
        }
    }
}
module.exports = test
