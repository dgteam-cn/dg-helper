// const cutout = function(str: string, mark) {
//     const length = str.length
//     const index = str.indexOf(mark)
//     if (str === mark) return ['', '']
//     // console.log('\n', index, !!str, !!mark, index >= 0, index + mark.length <= length)
//     return str && mark && index >= 0 && index + mark.length <= length ?
//         [str.slice(0, index), str.slice(index + mark.length)] :
//         [str, '']
// }
// // console.log("cutout('=', '=')", cutout('=', '='))
// // console.log("cutout('a=', '=')", cutout('a=', '='))
// // console.log("cutout('=a', '=')", cutout('=a', '='))
// // console.log("cutout('abc=abc', '=')", cutout('abc=abc', '='))
// // console.log("cutout('abc=abc', 'bc=ab')", cutout('abc=abc', 'bc=ab'))
// /**
//  * 把 queryPath 对象转换成 JSON 或数组
// */
// const queryParse = function(path, {uri = true, output = 'object', sep = '&', eq = '='} = {}) {
//     if (path[0] == '?') path = path.slice(1)
//     const query = {}
//     const queryArray = []
//     const paths = path.split(sep) // sep "&"
//     for (const item of paths) {
//         if (item) {
//             let [key, value] = cutout(item, eq) // eq "="
//             if (uri) {
//                 try {
//                     key = decodeURI(key)
//                 } catch (err) {}
//                 try {
//                     value = decodeURI(value)
//                 } catch (err) {}
//             }
//             if (output === 'object') {
//                 if (query[key] === undefined) {
//                     query[key] = value
//                 } else if (Array.isArray(query[key])) {
//                     query[key].push(value)
//                 } else {
//                     query[key] = [query[key], value]
//                 }
//             } else {
//                 queryArray.push({key, value})
//             }
//         }
//     }
//     return output === 'object' ? query : queryArray
// }
// /**
//  * 把 JSON 或数组转换成为 queryPath
// */
// const queryStringify = function(obj = {}, {uri = true, ignore = [undefined]} = {}) {
//     const paths = []
//     const valueToString = obj => {
//         const spit = str => uri ? encodeURI(decodeURI(str)) : str
//         try {
//             if (typeof obj === 'string') return spit(obj)
//             if (typeof obj === 'number' || typeof obj === 'boolean') return spit(obj.toString())
//             if (obj === null) return 'null'
//             if (Array.isArray(obj) ||Object.prototype.toString.call(obj) === '[object Object]') return spit(JSON.stringify(obj))
//             return ''
//         } catch (err) {
//             return ''
//         }
//     }
//     const formatItem = (key, value) => {
//         const isValid = value => {
//             if (ignore) {
//                 return Array.isArray(ignore) ?
//                     !~ignore.indexOf(value) :
//                     ignore !== value
//             }
//             return true
//         }
//         if (isValid(value)) {
//             if (uri) key = encodeURI(decodeURI(key))
//             if (Array.isArray(value)) {
//                 const part = []
//                 for (const row of value) {
//                     part.push(`${key}=${valueToString(row)}`)
//                 }
//                 return part.join('&')
//             } else {
//                 return `${key}=${valueToString(value)}`
//             }
//         }
//         return ''
//     }
//     if (Array.isArray(obj)) {
//         for (let {key, value} of obj) {
//             const row = formatItem(key, value)
//             if (row) paths.push(row)
//         }
//     } else {
//         for (let key in obj) {
//             const row = formatItem(key, obj[key])
//             if (row) paths.push(row)
//         }
//     }
//     return paths.join('&')
// }
// // 【已修复】 出现 {{}} 等符号会出现解析错误：目前使用关键点进行解析，减少错误发生可能性
// // 【已修复】 需要增加 hashParams 解析
// // 【已修复】 url 没有经过 encodeURI / decodeURI 反编译，导致中文字符乱码
// // FIXME 中文域名没有经过 Punycode 编码，导致访问异常
// // protocol://username:password@host:port/path?query#hash?hashParams
// // protocol - host - path - query - hash
// //    │        │      │       │      └─ 第一个 # 之后的都会解析成为 hash
// //    │        │      │       └─ 第一个 ? 到第一个 # 之间的会解析成 query
// //    │        │      └─ host 判断之后的第一个 / 到第一个 ? 或第一个 # 为止
// //    │        └─ :// 到第一个 / 之间都会被解析成 host ， 注意 host 中至少需要有一个 .
// //    └─ :// 之前的都会被解析成 protocol
// const parse = function(href = "", {uri = true, sep, eq} = {}) {
//     if (typeof href !== "string") throw new Error("Url 'href' need string.")
//     try {
//         if (uri) {
//             href = encodeURI(decodeURI(href)) // 转码可以
//         }
//         // 基本对象创建
//         const obj = {
//             username: "", password: "", // 用户名与密码
//             href, origin: "", // 原始路径
//             protocol: "", host: "", port: "", path: "", search: "", hash: "",
//             paths: [],
//             params: {}, // 参数组 （查询）
//             variables: [] // 参数组 （路由）
//         }
//         // 提取 hash 值
//         if (~href.indexOf('#')) {
//             const [residue, hash] = cutout(href, '#')
//             obj.hash = hash
//             href = residue
//         }
//         // 提取 search 值
//         if (~href.indexOf('?')) {
//             const [residue, search] = cutout(href, '?')
//             obj.search = search
//             href = residue
//             // 提取 search 至 params
//             obj.params = queryParse(obj.search, {sep, eq, uri})
//             // obj.paramsArray = queryParse(obj.search, {output: 'array', sep, eq, uri})
//         }
//         // 提取 protoco
//         if (~href.indexOf('://')) {
//             const [protocol, residue] = cutout(href, '://')
//             obj.protocol = protocol // href.split('://')[0] // 转为小写 .toLowerCase()
//             href = residue // href.split('://')[1]
//         }
//         // 提取 query
//         // obj.search = cutout(href, '?')[1] || "" // href.split('?')[1] || ""
//         // href = cutout(href, '?')[0] // href.split('?')[0] // 去掉 search 值
//         obj.paths = href.split('/')
//         if (~obj.paths[0].indexOf('.')) {
//             obj.host = obj.paths.shift()
//             // 提取 host 的用户名与密码
//             if (~obj.host.indexOf('@')) {
//                 const authorization = cutout(obj.host, '/')[0] // obj.host.split('/')[0]
//                 obj.host = cutout(obj.host, '@')[1] // obj.host.split('@')[1]
//                 obj.username = cutout(authorization, ':')[0] // authorization.split(':')[0]
//                 obj.password = cutout(authorization, ':')[1] // authorization.split(':')[1]
//             }
//             // 提取 host 的端口
//             if (~obj.host.indexOf(':')) {
//                 obj.port = cutout(obj.host, ':')[1] // obj.host.split(':')[1]
//                 obj.host = cutout(obj.host, ':')[0] // obj.host.split(':')[0]
//             }
//         }
//         obj.path = obj.paths.join('/')
//         if (obj.paths.length > 0) {
//             // 提取 path variables
//             for (const path of obj.paths) {
//                 if (typeof path === 'string' && path[0] === ':' && path.length > 1) {
//                     const _path = uri ? decodeURI(path.slice(1)) : path.slice(1)
//                     if (!~obj.variables.indexOf(_path)) obj.variables.push(_path)
//                 }
//             }
//         }
//         obj.origin =  `${obj.protocol ? `${obj.protocol}://` : ''}${obj.host ? `${obj.host}` : ''}${obj.port ? `:${obj.port}` : ''}`
//         return obj
//     } catch (err) {
//         console.error(err)
//         throw new Error('url 不合法')
//     }
// }
// const stringify = function(obj = {}) {
//     const {protocol, username, password, host, port, path, search, hash} = obj
//     let url = ''
//     if (protocol) url += `${protocol}://`
//     if (host) url += `${username || password ? `${username}${password ? `:${password}` : ''}@` : ''}${host}${port ? `:${port}`: ''}`
//     if (path) url += `${host ? '/' : ''}${path}`
//     if (search) url += `?${search}`
//     if (hash) url += `#${hash}`
//     return url
// }
// /**
//  * @class URL
//  * @param {string}  url              - 网址
//  * @param {boolean} options.uri      - 是否需要转义
//  * @param {boolean} options.punycode - 中文域名是否需要 punycode 编码（本项暂未实装）
//  * @param {boolean} options.sep      - querystring 变量 row 分隔符
//  * @param {boolean} options.eq       - querystring 变量 key value 分隔符
// */
// const URL = function(url, {uri = true, punycode = false, sep = '&', eq = '='} = {}) {
//     this.options = {uri, punycode, sep, eq}
//     const obj = URL.parse(url, {uri, punycode, sep, eq})
//     for (const key in obj) {
//         this[key] = obj[key]
//     }
// }
// URL.parse = parse           // 静态方法，解析 url:string 为 URL:object 对象
// URL.stringify = stringify   // 静态方法，把 URL:object 对象转换为 url:string
// URL.prototype.stringify = function() {
//     return stringify(this, this.options)
// }
// // 存储对象
// URL.prototype.set = function(key, value) {
//     if (~['username', 'password', 'protocol', 'host', 'path', 'search', 'hash'].indexOf(key)) {
//         this[key] = value
//         if (this.search) {
//             this.params = queryParse(this.search, this.options)
//         }
//         this.href = stringify(this, this.options)
//     } else if (key === 'params') {
//         this.search = queryStringify(value, this.options)
//         this.href = stringify(this, this.options)
//     }
//     return this.href
// }
// URL.prototype.getParamsArray = function() {
//     const {sep, eq, uri} = this.options
//     return this.search ? queryParse(this.search, {output: 'array', sep, eq, uri}) : []
// }
// URL.query = function() {}
// URL.query.parse = queryParse
// URL.query.stringify = queryStringify
// // let url = 'http://www.baidu.com/account/user/:id?a=1&a=2&c=中国';
// // let aaa = App.URLParse(url);
// // console.log(aaa, aaa.stringify() === url);
// // console.log('\n\n', url, '\n', aaa.stringify());
// export default URL
