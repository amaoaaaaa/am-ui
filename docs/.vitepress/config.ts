import { defineConfig } from 'vitepress';
import pkg from '../../package.json';

export default defineConfig({
    title: 'AM UI',
    description: 'Vue 3 组件库',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '组件', link: '/pie-3d' },
            { text: `v${pkg.version}`, link: 'https://www.npmjs.com/package/@amaoaaaaa/am-ui' },
        ],
        socialLinks: [{ icon: 'github', link: 'https://github.com/amaoaaaaa/am-ui' }],
        sidebar: [
            {
                text: '配置组件',
                items: [{ text: 'Config Provider 全局配置', link: '/config-provider' }],
            },
            {
                text: 'Chart 图表组件',
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
