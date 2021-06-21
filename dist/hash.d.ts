declare const Md5JS: any;
declare const Base64JS: any;
/**
 * 把字符串进行 md5 加密，输出加密后的字符串
 * @param {string | number} str - 需要加密的字符串（如果是数字则自动转为字符串）
 * @returns {string}
 */
declare const md5: (str: string | number) => string;
/**
 * 把字符串进行 base64 加密（或解密），输出加密（或解密）后的字符串
 * @param {string | number} str - 需要加密的字符串（如果是数字则自动转为字符串）
 * @param {string} mode - 加密（或解密）方式
 * @returns {string}
 */
declare const base64: (str: string | number, mode?: string) => string;
declare const base64EncodeURL: (str: string | number) => string;
declare const base64Encode: (str: string | number) => string;
declare const base64Decode: (str: string | number) => string;
