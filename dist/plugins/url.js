"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlParse = void 0;
// FIXME 需要增加 hashParams 解析
// FIXME url 没有经过 urldecode 反编译，导致中文字符乱码
// FIXME 当 params 中的字段为数组时候，没有能正确解析
const UrlParse = (href = "") => {
    if (typeof href !== "string") {
        throw new Error("Url 'href' need string.");
    }
    try {
        // 基本对象创建
        const obj = {
            username: "", password: "",
            href, origin: "",
            protocol: "", host: "", port: "", path: "", search: "", hash: href.split('#')[1] || "",
            paths: [],
            params: {} // 参数组
        };
        href = href.split('#')[0]; // 去掉 hash 值
        // 提取 protocol
        if (~href.indexOf('://')) {
            obj.protocol = href.split('://')[0];
            href = href.split('://')[1];
        }
        else if (~href.indexOf('//')) {
            href = href.split('//')[1];
        }
        obj.search = href.split('?')[1] || "";
        href = href.split('?')[0]; // 去掉 search 值
        obj.paths = href.split('/'); // 去掉 protocol 值
        obj.host = obj.paths.shift();
        obj.path = obj.paths.join('/');
        // 提取 host 的用户名与密码
        if (~obj.host.indexOf('@')) {
            const authorization = obj.host.split('/')[0];
            obj.host = obj.host.split('@')[1];
            obj.username = authorization.split(':')[0];
            obj.password = authorization.split(':')[1];
        }
        obj.origin = obj.protocol ? `${obj.protocol}://${obj.host}` : obj.host;
        // 提取 host 的端口
        if (~obj.host.indexOf(':')) {
            obj.port = obj.host.split(':')[1];
            obj.host = obj.host.split(':')[0];
        }
        // 提取 search 至 params
        if (obj.search) {
            const params = obj.search.split('&');
            for (const row of params) {
                const [key, value] = row.split('=');
                if (key) {
                    if (~key.indexOf('[]') && key.indexOf('[]') === key.length - 2) {
                        const _key = key.slice(0, key.length - 2);
                        if (!obj.params[_key]) {
                            obj.params[_key] = [value];
                        }
                        else {
                            obj.params[_key].push(value);
                        }
                    }
                    else {
                        obj.params[key] = value;
                    }
                }
            }
        }
        return obj;
    }
    catch (err) {
        throw new Error('url 不合法');
    }
};
exports.UrlParse = UrlParse;
