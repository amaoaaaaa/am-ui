import DefaultTheme from 'vitepress/theme';
import { Theme } from 'vitepress/dist/client/index.js';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import '../../../src/index.scss';

export default {
    ...DefaultTheme,
} as Theme;
