const Big = require('big.js')
Big.prototype.toNumber = function(){
    return Number(this)
}

const math = {
    
    Big: (opt) => new Big(opt), // 浮点计算： 加-add  减-sub  乘-mul  除-div  四舍五入-round(位数，模式)

    // 数字填充 0 后转为指定位数字符串
    PrefixZero: (num, n) => {
        return (Array(n).join(0) + num).slice(-n)
    },
    // 将数字转换为可以显示的格式
    Price: (num, {
        float = 2, // 保留几位小数
        mode = 0, // 小数（尾数）取整方式，见下方 floatdir 对象具体解释
        force = false, // 若为真，小数不足 float 字段位数时，将会强制补 0
        separate = 3, // 每间隔多少位数加入逗号 例如：10000000 一千万 输出为 10,000,000，若填 0 或 false 将取消逗号分隔符
        format = 'string', // string - 返回字符串  array - 返回数组
        unit = '', // 输出单位，可传入 个 十 百 千 万
    } = {}) => {
        try {
            if (!num && num != 0) return '';
            if (typeof mode === 'string') {
                let floatdir = {
                    down: 0, // 向下取整
                    half_up: 1, // 按4舍5入取整
                    half_even: 2, // 按5舍6入取整
                    up: 3, // 向上取整
                }
                mode = floatdir[mode] ? floatdir[mode] : 0
            }
            if (num == 0) {
                num = 0
            }
            if (unit) {
                let divisor = 1
                let units = ['个', '十', '百', '千', '万', '十万', '百万', '千万', '亿']
                units.forEach((item, index) => {
                    if (unit === item) {
                        divisor = Math.pow(10, index)
                    }
                })
                num = this.Big(num).div(divisor).toNumber()
            }
            let origin = this.Big(num).round(float, mode).toNumber() + ''
            let ints = origin.split('.')[0].split('').reverse()
            let floats = origin.split('.')[1] ? origin.split('.')[1].split('') : []
            if (separate) {
                if (typeof separate !== 'number') {
                    separate = 3
                }
                let intr = []
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
                let price = [ints.join(''), floats.join('')]
                if (unit) {
                    price.push(unit)
                }
                return price
            }
        } catch (err) {
            console.log('Price : error num')
            return num
        }
    },

    // 不传 len 则生成一个 uuid 否则生成一个指定长度的随机字符串
    Uuid: (len, radix = 10, opt = {}) => {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
        var uuid = [], i;
        radix = radix || chars.length // radix = 10 || radix = 36 || radix = 62
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
}

module.exports.Big = math.Big
module.exports.PrefixZero = math.PrefixZero
module.exports.Price = math.Price
module.exports.Uuid = math.Uuid