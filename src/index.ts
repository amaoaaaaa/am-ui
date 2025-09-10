import type { App } from 'vue';
import './index.css';

// 单个组件导入
import AmPie3D from './components/charts/pie-3d/index.vue';

// 组件集合
const components = [AmPie3D];

// 全局安装
const install = (app: App) => {
    components.forEach((c) => {
        app.component(c.name || (c as any).__name, c);
    });
};

export const AmUI = { install };
export { AmPie3D };
