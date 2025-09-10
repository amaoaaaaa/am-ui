import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            rollupTypes: false, // ❌ 先关掉，避免 bug
            include: ['src'],
            copyDtsFiles: true, // ✅ 确保 .d.ts 文件被复制
        }),

        // 打包分析插件
        visualizer({ open: true }),
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: './src/index.ts',
            formats: ['es'],
            fileName: 'am-ui',
        },
        rollupOptions: {
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
