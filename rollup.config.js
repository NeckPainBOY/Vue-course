import babel from 'rollup-plugin-babel'
export default {
    input: './src/index.js',  // 入口
    output: {
        file: './dist/vue.js', // 出口
        name: 'Vue',
        format: 'umd', // 打包模块：esm es6模块 commonjs模块 iife自执行函数 umd（commonjs amd）
        sourcemap: true, // 希望可以调试源代码
    },
    plugins: [
        babel({
            exclude: 'node_modules/**', // 排除所有node_modules所有文件
        })
    ]
}