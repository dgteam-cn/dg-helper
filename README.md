## 0.3.1

修复了一些错误的注释
在 determine 中增加 date、regexp 的判断方法
修复 math => price 方法 separate 字段没有效果的 bug、强化 unit 字段的用途
增加 math => priceUppercase 方法可取消 “整” 作为结尾的配置
增加 math => randomNumber、randomString、randomInt 三个方法
增加 lodash 模块的 debounce, throttle 方法
增加 test 自动测试代码


## 0.3.0
- 把模块完全替换成 node 的 commonjs 规范，并在 node-win node-linux webpack vite uni 平台进行测试
- 把 Extend 默认的 Object.assign 方法换成深拷贝的方法
- 把所有大写方法换成小写
- [重要] 暂时剔除 URL 对象


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