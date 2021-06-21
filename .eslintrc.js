module.exports = {
<<<<<<< HEAD

    // "extends": "eslint-config-egg/typescript",
    // "parserOptions": {
    //   "project": "./tsconfig.json"
    // },
=======
>>>>>>> 0.3
    extends: [
        "@dgteam/eslint-config-team"
    ],
    env: {
        browser: true,
        node: true,
        es6: true
    },
<<<<<<< HEAD
    // 指定语言版本为和模块类型
=======
>>>>>>> 0.3
    parserOptions: {
        ecmaVersion: 6,
<<<<<<< HEAD
        sourceType: "module" // script: node 环境   module: browser 环境
        //     // ecmaFeatures: {
        //     //     globalReturn: false, // 允许在全局作用域下使用 return 语句
        //     //     impliedStrict: false, // 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
        //     //     jsx: false, // 启用 JSX
        //     //     experimentalObjectRestSpread: false ,// 启用实验性的 object rest/spread properties 支持
        //     // }
=======
        sourceType: "module"
>>>>>>> 0.3
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint']
}