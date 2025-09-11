import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'AM UI',
    description: 'Vue 3 组件库',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '组件', link: '/pie-3d' },
        ],
        sidebar: [
            {
                text: 'Chart 图表',
                items: [{ text: 'Pie3D 饼图3D', link: '/pie-3d' }],
            },
            {
                text: 'Data 数据展示',
                items: [{ text: 'Table 表格', link: '/table' }],
            },
        ],
        outline: {
            level: 'deep',
            label: '本页目录',
        },
    },
    base: '/am-ui/',
});
