const big = require('big.js');
/**
 * 科学计算 big.js 库
 * 官方文档参考：http://mikemcl.github.io/big.js/
 *  常用： 加-add()  减-sub()  乘-mul()  除-div
 *  科学： 模-mod() 绝对值-abs() N次方-pow(n) 平方根-sqrt()
 *      保留小数-round(位数，模式)：
 *          0 = 向下取整
 *          1 = 四舍五入
 *          2 = 四舍六入，五则看单双
 *          3 = 向上取整
 *  返回结果： 返回数值-toNumber()  返回字符串-toString()  返回浮点型字符串，不足小数自动补0-toFixed(位数)
 *  例: Big(5).div(3).round(2,1).toNumber() // 5 除 3 四舍五入保留两位小数，返回数字类型结果
 * @constructor
 */
const Big = (opt) => new big(opt);
/**
 * 将数字转换为可以显示的格式（价格模式）
 * @param {number|string} num - 需要格式化的数字
 * @param {number} [opt.float = 2] - 保留几位小数，默认 2 位
 * @param {number} [opt.mode = 0] - 小数（尾数）取整方式，见下方 floatdir 对象具体解释，默认向下取整
 * @param {boolean} [opt.force] - 若为真，小数不足 float 字段位数时，将会强制补 0
 * @param {number|boolean} [opt.separate = 3] - 每间隔多少位数加入逗号 例如：10000000 一千万 输出为 10,000,000，若填 0 或 false 将取消逗号分隔符
 * @param {string} [opt.format = 'string'] - 输出格式：string = 输出字符串; array = 输出数组（按分隔符）;
 * @param {string} [opt.unit] - 输出单位: 个 十 百 千 万，或 万元 百万元等...
 * @return {string | string[]}
 */
const price = (num, { float = 2, mode = 0, force = false, separate = 3, format = 'string', unit = '' } = {}) => {
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
                if (unit && unit.indexOf(item) === 0) {
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
                if (count === separate && ints.length) {
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
/**
 * 将数字价格转换为中文大写价格
 * @param {number|string} price - 价格
 * @param {boolean} [opt.suffix = true] - 计算结果是否以 “整” 结尾
 * @return {string}
 */
const priceUppercase = (price, { suffix = true } = {}) => {
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
        const result = head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
        return suffix ? result : result.replace(/整/g, '');
    }
    else {
        return "";
    }
};
/**
 * 强制浮点位数（前缀），不足的强制补 0
 * @param {number|string} num - 数值
 * @return {string}
 * @example prefixZero(100, 6) 则返回 000100
 */
const prefixZero = (num, n) => {
    if (typeof num === 'number')
        num = num.toString();
    while (n && num.length < n)
        num = '0' + num;
    return num;
};
/**
 * 随机生成一段 uuid 字符串
 * @param {number} len - 长度
 * @param {number} radix - 字符串范围：10 = [0-9]; 36 = [0-9,A-Z]; 62 = [0-9,A-Z,a-z];
 * @return {string}
 */
const uuid = (len, radix = 10) => {
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
/**
 * 获取一个随机的整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number}
 */
const randomNumber = (min = 1, max = 100) => {
    if (min > max)
        [min, max] = [max, min]; // 如果最小值大于最大值，两个变量进行互换
    return parseInt(Math.random() * (max - min + 1) + min + '', 10);
};
/**
 * 获取一串随机的字符串
 * @param {number} n - 需要的长度
 * @param {string|array} opt - 配置，如果传入数组，则在指定数组中随机获取结果
 * @returns {string}
 */
const randomString = (n, opt) => {
    const box = {
        number: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        capital_letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        lower_case_letter: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'm', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        special_symbols: ['~', '!', '@', '#', '$', '%', '^', '&', '*']
    };
    const pool = Array.isArray(opt) ? Array.from(opt) : [];
    if (typeof opt === 'string') {
        switch (opt) {
            case 'num':
            case 'number': {
                pool.push(...box.number);
                break;
            }
            case 'alpha':
            case 'letter': {
                pool.push(...box.capital_letter, ...box.lower_case_letter);
                break;
            }
            case 'letterNumber':
            case 'alphaNumeric': {
                pool.push(...box.number, ...box.capital_letter, ...box.lower_case_letter);
                break;
            }
            case 'complex':
            case 'all': {
                pool.push(...box.number, ...box.capital_letter, ...box.lower_case_letter, ...box.special_symbols);
                break;
            }
        }
    }
    else {
        pool.push(...box.number);
    }
    let res = "";
    for (let i = 0; i < n; i++) {
        const id = Math.ceil(Math.random() * pool.length);
        res += pool[id - 1];
    }
    return res;
};
/**
 * 获取一串随机的整数字符串
 * @param {number} n - 需要的长度
 * @returns {string}
 */
const randomInt = (n = 6) => randomString(n, 'number');
module.exports = {
    big: Big, price, priceUppercase, prefixZero,
    uuid, randomNumber, randomString, randomInt
};
export {};
