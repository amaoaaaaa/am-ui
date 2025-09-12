import { reactive } from 'vue';

/**
 * 组件库全局配置
 */
export interface AmConfig {
    /**
     * 是否启用页面缩放。
     *
     * @description 开启时支持自动缩放的组件会根据页面比设计稿的缩放比例进行缩放
     * @default true
     */
    enablePageScale?: boolean;

    /**
     * 设计稿高度
     * @default 1080
     */
    designHeight?: number;
}

export const globalConfig = reactive<AmConfig>({
    enablePageScale: true,
    designHeight: 1080,
});

export function setGlobalConfig(config: Partial<AmConfig>) {
    Object.assign(globalConfig, config);
}

export function getGlobalConfig(): AmConfig {
    return globalConfig;
}
