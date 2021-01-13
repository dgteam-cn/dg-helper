
/**
 * @name URL 解析器
 * @param href string 需要解析的地址
 * @return object: urlObject
 */
export interface urlObject {
    username: string, password: string, // 用户名与密码
    href: string, origin: string, // 原始路径
    protocol: string, host: string, port: string, path: string, search: string, hash: string,
    paths: Array<string>,
    params: object // 参数组
}
const UrlParse = (href: string = ""): urlObject => {
    if (typeof href !== "string") {
        throw new Error("Url 'href' need string.")
    }
    try {
        // 基本对象创建
        const obj: urlObject = {
            username: "", password: "", // 用户名与密码
            href, origin: "", // 原始路径
            protocol: "", host: "", port: "", path: "", search: "", hash: href.split('#')[1] || "",
            paths: [],
            params: {} // 参数组
        }
        href = href.split('#')[0] // 去掉 hash 值

        // 提取 protocol
        if (~href.indexOf('://')) {
            obj.protocol = href.split('://')[0]
            href = href.split('://')[1]
        } else if (~href.indexOf('//')) {
            href = href.split('//')[1]
        }

        obj.search = href.split('?')[1] || ""
        href = href.split('?')[0] // 去掉 search 值
        obj.paths = href.split('/') // 去掉 protocol 值

        obj.host = obj.paths.shift()
        obj.path = obj.paths.join('/')

        // 提取 host 的用户名与密码
        if (~obj.host.indexOf('@')) {
            const authorization: string = obj.host.split('/')[0]
            obj.host = obj.host.split('@')[1]
            obj.username = authorization.split(':')[0]
            obj.password = authorization.split(':')[1]
        }
        obj.origin = obj.protocol ? `${obj.protocol}://${obj.host}` : obj.host
        // 提取 host 的端口
        if (~obj.host.indexOf(':')) {
            obj.port = obj.host.split(':')[1]
            obj.host = obj.host.split(':')[0]
        }

        // 提取 search 至 params
        if (obj.search) {
            const params = obj.search.split('&')
            for (const row of params) {
                const [key, value] = row.split('=')
                if (key) {
                    if (~key.indexOf('[]') && key.indexOf('[]') === key.length - 2) {
                        const _key = key.slice(0, key.length - 2)
                        if (!obj.params[_key]) {
                            obj.params[_key] = [value]
                        } else {
                            obj.params[_key].push(value)
                        }
                    } else {
                        obj.params[key] = value
                    }
                }
            }
        }
        return obj
    } catch (err) {
        throw new Error('url 不合法')
    }
}

export {UrlParse}