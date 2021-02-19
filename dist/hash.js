"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_md5_1 = __importDefault(require("js-md5"));
const js_base64_1 = require("js-base64");
const Md5 = (str) => js_md5_1.default(str);
const Base64 = (str, mode = 'encodeURL') => {
    if (mode === 'encodeURL')
        return js_base64_1.Base64.encodeURI(str.toString());
    else if (mode === 'encode')
        return js_base64_1.Base64.encode(str.toString());
    else if (mode === 'decode')
        return js_base64_1.Base64.encode(str.toString());
    else
        throw Error('mode 格式错误');
};
const Base64EncodeURL = (str) => js_base64_1.Base64.encodeURI(str.toString());
const Base64Encode = (str) => js_base64_1.Base64.encode(str.toString());
const Base64Decode = (str) => js_base64_1.Base64.decode(str.toString());
exports.default = {
    Md5, Base64, Base64Encode, Base64EncodeURL, Base64Decode
};
