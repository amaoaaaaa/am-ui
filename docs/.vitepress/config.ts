import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'am-ui 组件库',
    description: 'Vue 3 组件库文档',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '组件', link: '/pie-3d' },
        ],
        sidebar: [
            {
                text: '图表',
                items: [{ text: 'Pie3D 饼图3D', link: '/pie-3d' }],
            },
        ],
    },
});
