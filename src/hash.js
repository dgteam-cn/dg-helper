const Md5 = require('../plugins/hash/md5.js')
const Base64 = require('../plugins/hash/base64.js').Base64

module.exports.Md5 = (key) => Md5(key)
module.exports.Base64 = (str, mode='encodeURI') => Base64[mode](str)
module.exports.Base64Encode = (str) => Base64['encode'](str)
module.exports.Base64EncodeURI = (str) => Base64['encodeURI'](str)
module.exports.Base64Decode = (str) => Base64['decode'](str)