// NEXT 0.3.0
- 把模块完全替换成 node 的 commonjs 规范，并在 node-win node-linux webpack vite uni 平台进行测试
- 把 Extend 默认的 Object.assign 方法换成深拷贝的方法
- 把所有大写方法换成小写

=================================

## 0.2.5
1.增加 base/Enum 方法
2.增加 url/UrlParse 方法
3.Time 方法支持 nodejs 默认的 UTC 时间格式


## 0.2.4
1.typescript 环境变更，去掉 webpack 层，导出 es6 模块
2.[BUG] 修复 math/Price 数值为复数时，separate 字段分割错误
3.time/Timestamp 支持传入字符串

## 0.2.2
1.[BUG] 修复 time/Time 在苹果平台 Safari 浏览器下的异常问题