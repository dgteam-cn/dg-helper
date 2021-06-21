module.exports = {
    extends: [
        "@dgteam/eslint-config-team"
    ],
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module"
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint']
}