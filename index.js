
const Big = require('big.js')
Big.prototype.toNumber = function(){
    return Number(this)
}

const { Time, Timestamp, UnTimestamp } = require('./plugins/time.js')

module.exports = {

    Big(opt){
        // 浮点计算： 加-add  减-sub  乘-mul  除-div  四舍五入-round(位数，模式)
        return new Big(opt)
    },

	Extend(old,...obj){
        return Object.assign(old,...obj)
    },

    Origin(obj){
        try{
            return JSON.parse(JSON.stringify(obj))
        }catch(err){
            console.err('Fun-Origin 错误的对象格式',obj)
            return obj
        }
    },

    Time, Timestamp, UnTimestamp,

    // 数字填充 0 后转为指定位数字符串
    PrefixZero(num, n) {
        return (Array(n).join(0) + num).slice(-n)
    },

	// Is(type = "object", sample) {
	// 	if (typeof type !== 'string') {
	// 		sample = type
	// 	}
	// 	switch (type) {
	// 		case 'int':
	// 			return typeof sample === 'number' && sample % 1 === 0;
	// 			break;
	// 		case 'stringint':
	// 			return parseInt(sample) == sample
	// 			break;
	// 		case 'object':
	// 			return (sample && typeof sample === 'object' && !isArray(sample));
	// 			break;
	// 		case 'array':
	// 			return Array.isArray(sample);
	// 			break;
	// 		case 'empty':
	// 			if (sample == null) return true;
	// 			if (sample.length > 0) return false;
	// 			if (sample.length === 0) return true;
	// 			for (var key in sample) {
	// 				if (Object.prototype.hasOwnProperty.call(sample, key)) return false;
	// 			}
	// 			return true;
	// 		case 'login':
	// 			if (this.Token()) {
	// 				try {
	// 					return !!this.$store.state['base'].Block.user.id
	// 				} catch (err) {}
	// 			}
	// 			return false
	// 		default:
	// 			return false;
	// 	}
	// },
	// IsEmpty(sample) {
	// 	return this.Is('empty', sample)
	// },
	// IsArray(sample) {
	// 	return this.Is('array', sample)
	// },
	
    // // 缓存
    // Cache(key,val,time){
    //     if(key){
    //         if(val===undefined && time===undefined){
    //             return this.CacheGet(key)
    //         }else if(val === null || time === 0){
    //             return this.CacheClean(key)
    //         }else{
    //             return this.CacheSet(key,val,time)
    //         }
    //     }
    // },
    // CacheGet(key){
    //     if(window.localStorage){
    //         try{
    //             return JSON.parse(window.localStorage[key]);  
    //         }catch(err){
    //             return window.localStorage[key];  
    //         }
    //         var cache = window.localStorage.getItem(key)
    //         var timestamp = window.localStorage.getItem(`${key}_timestamp`)
    //         if(!timestamp || timestamp < Date.now()){
    //             try{
    //                 return JSON.parse(cache)
    //             }catch(err){
    //                 return cache
    //             }
    //         }else{
    //             this.CacheClean(key)
    //             return undefined
    //         }
    //     }else{
    //         return null
    //     }
    // },
    // CacheSet(key,val,time){
    //     if(window.localStorage){
    //         if(time && time > 0){
    //             var timestamp = Date.now() + time * 1000
    //             window.localStorage.setItem(`${key}_timestamp`, timestamp)
    //         }            
    //         return window.localStorage.setItem(key,JSON.stringify(val))
    //     }else{
    //         return null
    //     }
    // },
    // CacheClean(key){
    //     if(window.localStorage){
    //         window.localStorage.removeItem(key)
    //         window.localStorage.removeItem(`${key}_timestamp`)
    //         return undefined
    //     }
    // },
    // CacheCleanAll(key){
    //     if(window.localStorage){
    //         window.localStorage.clean()
    //         return undefined
    //     }
    // },


    // // 将数字转换为可以显示的格式
    // Price(num, {
    //     float = 2, // 保留几位小数
    //     mode = 0,
    //     force = false, // 若为真，小数不足时强制补 0
    //     separate = 3, // 每间隔多少位数加入逗号 例如：10000000 一千万 输出为 10,000,000
    //     format = 'string', // string - 返回字符串  array - 返回数组
    //     unit = '', // 单位，可传入个十百千万
    // } = {}) {
    //     try {
    //         if (!num && num != 0) {
    //             return ''
    //         }
    //         if (typeof mode === 'string') {
    //             let floatdir = {
    //                 down: 0,
    //                 half_up: 1,
    //                 half_even: 2,
    //                 up: 3,
    //             }
    //             mode = floatdir[mode] ? floatdir[mode] : 0
    //         }
    //         if (num == 0) {
    //             num = 0
    //         }
    //         if (unit) {
    //             let divisor = 1
    //             let units = ['个', '十', '百', '千', '万', '十万', '百万', '千万', '亿']
    //             units.forEach((item, index) => {
    //                 if (unit === item) {
    //                     divisor = Math.pow(10, index)
    //                 }
    //             })
    //             num = this.Big(num).div(divisor).toNumber()
    //         }
    //         let origin = this.Big(num).round(float, mode).toNumber() + ''
    //         let ints = origin.split('.')[0].split('').reverse()
    //         let floats = origin.split('.')[1] ? origin.split('.')[1].split('') : []
    //         if (separate) {
    //             if (typeof separate !== 'number') {
    //                 separate = 3
    //             }
    //             let intr = []
    //             let count = 0
    //             while (ints.length) {
    //                 count++
    //                 intr.push(ints.shift())
    //                 if (count === 3 && ints.length) {
    //                     intr.push(',')
    //                     count = 0
    //                 }
    //             }
    //             ints = intr.reverse()
    //         } else {
    //             ints = ints.reverse()
    //         }
    //         if (float && force) {
    //             while (floats.length < float) {
    //                 floats.push('0')
    //             }
    //         }
    //         if (format === 'string') {
    //             let price = floats.length ? `${ints.join('')}.${floats.join('')}` : ints.join('')
    //             if (unit) {
    //                 price = price + unit
    //             }
    //             return price
    //         }
    //         if (format === 'array') {
    //             let price = [ints.join(''), floats.join('')]
    //             if (unit) {
    //                 price.push(unit)
    //             }
    //             return price
    //         }
    //     } catch (err) {
    //         console.log('Price : error num')
    //         return num
    //     }
    // },

    // // 生成一个随机字符串
    // Uuid(len, radix = 10, opt = {}) {
    //     var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    //     var uuid = [],
    //         i;
    //     radix = radix || chars.length;
    //     if (len) {
    //         for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    //     } else {
    //         var r;
    //         uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    //         uuid[14] = '4';
    //         for (i = 0; i < 36; i++) {
    //             if (!uuid[i]) {
    //                 r = 0 | Math.random() * 16;
    //                 uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    //             }
    //         }
    //     }
    //     return uuid.join('');
    // },
}