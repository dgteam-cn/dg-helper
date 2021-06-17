const Md5JS = require('js-md5'); // import Md5JS from 'js-md5'
const { Base64: Base64JS } = require('js-base64'); // import {Base64 as Base64JS} from 'js-base64'
const md5 = (str) => {
    if (typeof str === 'number')
        return Md5JS(str.toString());
    return Md5JS(str);
};
const base64 = (str, mode = 'encodeURL') => {
    if (mode === 'encodeURL')
        return Base64JS.encodeURI(str.toString());
    else if (mode === 'encode')
        return Base64JS.encode(str.toString());
    else if (mode === 'decode')
        return Base64JS.decode(str.toString());
    else
        throw Error('mode 格式错误');
};
const base64EncodeURL = (str) => Base64JS.encodeURI(str.toString());
const base64Encode = (str) => Base64JS.encode(str.toString());
const base64Decode = (str) => Base64JS.decode(str.toString());
module.exports = {
    md5, base64, base64Encode, base64EncodeURL, base64Decode
};
