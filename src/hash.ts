
const Md5JS = require('js-md5') // import Md5JS from 'js-md5'
const {Base64: Base64JS} = require('js-base64') // import {Base64 as Base64JS} from 'js-base64'

/**
 * 把字符串进行 md5 加密，输出加密后的字符串
 * @param {string | number} str - 需要加密的字符串（如果是数字则自动转为字符串）
 * @returns {string}
 */
const md5 = (str: string | number): string => {
    if (typeof str === 'number') return Md5JS(str.toString())
    return Md5JS(str)
}

/**
 * 把字符串进行 base64 加密（或解密），输出加密（或解密）后的字符串
 * @param {string | number} str - 需要加密的字符串（如果是数字则自动转为字符串）
 * @param {string} mode - 加密（或解密）方式
 * @returns {string}
 */
const base64 = (str: string | number, mode: string = 'encodeURL'): string => {
    if (mode === 'encodeURL') return Base64JS.encodeURI(str.toString()) // 使用 URL 安全的 base64 加密
    else if (mode === 'encode') return Base64JS.encode(str.toString()) // 使用普通 base64 加密
    else if (mode === 'decode') return Base64JS.decode(str.toString()) // 使用 base64 解密
    else throw Error('mode 格式错误')
}
const base64EncodeURL = (str: string | number): string => Base64JS.encodeURI(str.toString())
const base64Encode = (str: string | number): string => Base64JS.encode(str.toString())
const base64Decode = (str: string | number): string => Base64JS.decode(str.toString())

module.exports = {
    md5, base64, base64Encode, base64EncodeURL, base64Decode
}