"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uuid = exports.PrefixZero = exports.PriceUppercase = exports.Price = exports.Big = void 0;
const big_js_1 = __importDefault(require("big.js"));
/**
 * @name 科学计算
 * @description 常用： 加-add()  减-sub()  乘-mul()  除-div
 *              科学： 模-mod() 绝对值-abs() N次方-pow(n) 平方根-sqrt()
 *              保留小数-round(位数，模式)：
 *                  0 = 向下取整
 *                  1 = 四舍五入
 *                  2 = 四舍六入，五则看单双
 *                  3 = 向上取整
 *              返回结果： 返回数值-toNumber()  返回字符串-toString()  返回浮点型字符串，不足小数自动补0-toFixed(位数)
 *              例: Big(5).div(3).round(2,1).toNumber() // 5 除 3 四舍五入保留两位小数，返回数字类型结果
 */
big_js_1.default.prototype.toNumber = function () {
    return Number(this);
};
const Big = (opt) => new big_js_1.default(opt);
exports.Big = Big;
const Price = (num, { float = 2, mode = 0, force = false, separate = 3, format = 'string', unit = '' } = {}) => {
    try {
        if (!num && num !== 0)
            return '';
        if (typeof mode === 'string') {
            const floatdir = {
                down: 0,
                half_up: 1,
                half_even: 2,
                up: 3 // 向上取整
            };
            mode = floatdir[mode] ? floatdir[mode] : 0;
        }
        if (num === '0') {
            num = 0;
        }
        // 记录正复方向并取绝对值
        const isPositive = Number(num) >= 0;
        num = Math.abs(Number(num));
        if (unit) {
            let divisor = 1;
            const units = ['个', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
            units.forEach((item, index) => {
                if (unit === item) {
                    divisor = Math.pow(10, index);
                }
            });
            num = Big(num).div(divisor).toString();
        }
        const origin = Big(num).round(float, mode).toString() + '';
        let ints = origin.split('.')[0].split('').reverse();
        const floats = origin.split('.')[1] ? origin.split('.')[1].split('') : [];
        if (separate) {
            if (typeof separate !== 'number') {
                separate = 3;
            }
            const intr = [];
            let count = 0;
            while (ints.length) {
                count++;
                intr.push(ints.shift());
                if (count === 3 && ints.length) {
                    intr.push(',');
                    count = 0;
                }
            }
            ints = intr.reverse();
        }
        else {
            ints = ints.reverse();
        }
        if (float && force) {
            while (floats.length < float) {
                floats.push('0');
            }
        }
        if (format === 'string') {
            let price = floats.length ? `${ints.join('')}.${floats.join('')}` : ints.join('');
            if (unit)
                price = price + unit; // 判断否时需要增加单位
            if (!isPositive)
                price = '-' + price; // 判断是正数还是负数
            return price;
        }
        if (format === 'array') {
            const price = [ints.join(''), floats.join('')];
            if (unit)
                price.push(unit); // 判断否时需要增加单位
            if (!isPositive)
                price[0] = '-' + price[0]; // 判断是正数还是负数
            return price;
        }
    }
    catch (err) {
        console.error('Price : error num');
        return num;
    }
};
exports.Price = Price;
/**
 * @name 将数字价格转换为中文大写价格
 * @param price [number | string] 价格
 * @return string
 */
const PriceUppercase = (price) => {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    const IsNum = Number(price);
    if (typeof price === 'string') {
        price = Number(price);
    }
    if (!isNaN(IsNum)) {
        const head = price < 0 ? '欠' : '';
        price = Math.abs(price);
        let s = '';
        for (let i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(price * 100 / 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        price = Math.floor(price);
        for (let i = 0; i < unit[0].length && price > 0; i++) {
            let p = '';
            for (let j = 0; j < unit[1].length && price > 0; j++) {
                p = digit[price % 10] + unit[1][j] + p;
                price = Math.floor(price / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }
    else {
        return "";
    }
};
exports.PriceUppercase = PriceUppercase;
/**
 * @name 强制浮点位数，不足的强制补 0
 * @param num [number | string] 数值
 * @return string
 */
const PrefixZero = (num, n) => {
    if (typeof num === 'number')
        num = num.toString();
    while (n && num.length < n)
        num = '0' + num;
    return num;
};
exports.PrefixZero = PrefixZero;
/**
 * @name 随机生成一段字符串
 * @param len [number] 长度
 * @return string
 */
const Uuid = (len, radix = 10) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];
    let i;
    radix = radix || chars.length; // radix = 10 || radix = 36 || radix = 62
    if (len) {
        for (i = 0; i < len; i++)
            uuid[i] = chars[0 | Math.random() * radix];
    }
    else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
            }
        }
    }
    return uuid.join('');
};
exports.Uuid = Uuid;
