import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import alias from '@rollup/plugin-alias';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            rollupTypes: false, // ❌ 先关掉，避免 bug
            include: ['src'],
            copyDtsFiles: true, // ✅ 确保 .d.ts 文件被复制
        }),
    ],
    resolve: {
        // alias: [
        //     // ✅ 正确：使用 __dirname + resolve 构造项目内的绝对路径
        //     { find: '@', replacement: resolve(__dirname, 'src') },
        // ],
    },
    build: {
        sourcemap: true,
        lib: {
            entry: './src/index.ts',
            formats: ['es'],
            fileName: 'am-ui',
        },
        rollupOptions: {
            plugins: [
                // alias({
                //     entries: [
                //         { find: '@', replacement: resolve(__dirname, 'src') }, // 必须用绝对路径
                //     ],
                // }),
            ],
            // 这些依赖不会打包进 dist
            external: [
                'vue',
                'echarts',
                'echarts-gl',
                '@vueuse/core',
                'gsap',
                'lodash-es',
                'tailwindcss',
            ],
        },
    },
});
