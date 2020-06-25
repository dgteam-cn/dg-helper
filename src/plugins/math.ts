// const Big = require('big.js')
// const Big = require('big.js')
import big from 'big.js'

// 常用： 加-add()  减-sub()  乘-mul()  除-div
// 科学： 模-mod() 绝对值-abs() N次方-pow(n) 平方根-sqrt()
// 保留小数-round(位数，模式)：
//      0 = 向下取整
//      1 = 四舍五入
//      2 = 四舍六入，五则看单双
//      3 = 向上取整
// 返回结果： 返回数值-toNumber()  返回字符串-toString()  返回浮点型字符串，不足小数自动补0-toFixed(位数)
// 例: Big(5).div(3).round(2,1).toNumber() // 5 除 3 四舍五入保留两位小数，返回数字类型结果
big.prototype.toNumber = function(){
    return Number(this)
}
const Big = (opt: any) => new big(opt)

// BUG ==> 字符为负数时 separate 字段分割错误
// 将数字转换为可以显示的格式
const Price = (num: string | number, {
    float = 2, // 保留几位小数
    mode = 0, // 小数（尾数）取整方式，见下方 floatdir 对象具体解释
    force = false, // 若为真，小数不足 float 字段位数时，将会强制补 0
    separate = 3, // 每间隔多少位数加入逗号 例如：10000000 一千万 输出为 10,000,000，若填 0 或 false 将取消逗号分隔符
    format = 'string', // string - 返回字符串  array - 返回数组
    unit = '', // 输出单位，可传入 个 十 百 千 万
} = {}) => {
    try {
        if (!num && num !== 0) return '';
        if (typeof mode === 'string') {
            const floatdir = {
                down: 0, // 向下取整
                half_up: 1, // 按4舍5入取整
                half_even: 2, // 按5舍6入取整
                up: 3, // 向上取整
            }
            mode = floatdir[mode] ? floatdir[mode] : 0
        }
        if (num === '0') {
            num = 0
        }
        if (unit) {
            let divisor = 1
            const units = ['个', '十', '百', '千', '万', '十万', '百万', '千万', '亿']
            units.forEach((item, index) => {
                if (unit === item) {
                    divisor = Math.pow(10, index)
                }
            })
            num = Big(num).div(divisor).toString()
        }
        const origin = Big(num).round(float, mode).toString() + ''
        let ints: any[] = origin.split('.')[0].split('').reverse()
        const floats = origin.split('.')[1] ? origin.split('.')[1].split('') : []
        if (separate) {
            if (typeof separate !== 'number') {
                separate = 3
            }
            const intr: any[] = []
            let count = 0
            while (ints.length) {
                count++
                intr.push(ints.shift())
                if (count === 3 && ints.length) {
                    intr.push(',')
                    count = 0
                }
            }
            ints = intr.reverse()
        } else {
            ints = ints.reverse()
        }
        if (float && force) {
            while (floats.length < float) {
                floats.push('0')
            }
        }
        if (format === 'string') {
            let price = floats.length ? `${ints.join('')}.${floats.join('')}` : ints.join('')
            if (unit) {
                price = price + unit
            }
            return price
        }
        if (format === 'array') {
            const price = [ints.join(''), floats.join('')]
            if (unit) {
                price.push(unit)
            }
            return price
        }
    } catch (err) {
        console.log('Price : error num')
        return num
    }
}

const PriceUppercase = (price: number | string): string => {
    const fraction = ['角', '分']
    const digit = [ '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖' ]
    const unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟'] ]
    const IsNum = Number(price)
    if(typeof price === 'string'){
        price = Number(price)
    }
    if (!isNaN(IsNum)) {
        const head = price < 0 ? '欠' : ''
        price = Math.abs(price)
        let s = ''
        for (let i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(price * 100/10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
        }
        s = s || '整'
        price = Math.floor(price)
        for (let i = 0; i < unit[0].length && price > 0; i++) {
            let p = ''
            for (let j = 0; j < unit[1].length && price > 0; j++) {
                p = digit[price % 10] + unit[1][j] + p;
                price = Math.floor(price / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
    } else {
        return ""
    }
}

// 前置补 0
const PrefixZero = (num: number | string, n: number): string => {
    if(typeof num === 'number') num = num.toString()
    while(n && num.length < n)
        num = '0' + num
    return num
}

// 不传 len 则生成一个 uuid 否则生成一个指定长度的随机字符串
const Uuid = (len: number, radix = 10 ): string => {
    const chars: string[] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid: string[] = []
    let i;
    radix = radix || chars.length // radix = 10 || radix = 36 || radix = 62
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
        let r: number;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('')
}
export { Big, Price, PriceUppercase, PrefixZero, Uuid }