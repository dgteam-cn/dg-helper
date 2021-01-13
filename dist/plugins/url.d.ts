/**
 * @name URL 解析器
 * @param href string 需要解析的地址
 * @return object: urlObject
 */
export interface urlObject {
    username: string;
    password: string;
    href: string;
    origin: string;
    protocol: string;
    host: string;
    port: string;
    path: string;
    search: string;
    hash: string;
    paths: Array<string>;
    params: object;
}
declare const UrlParse: (href?: string) => urlObject;
export { UrlParse };
