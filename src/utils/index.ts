import { getGlobalConfig } from './config-store';

/**
 * 将像素值转换为rem单位
 *
 * @param px - 需要转换的像素值，可以是字符串或数字类型
 *
 * @example
 * pxToRem('44.22px')
 * pxToRem(53.22)
 *
 * @returns 转换后的rem值字符串
 */
export function pxToRem(px: string | number) {
    if (px === undefined) return undefined;

    // 获取根元素的字体大小作为基准
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // 计算相对于根字体大小的比例值
    const size = (typeof px === 'number' ? px : parseFloat(px)) / rootFontSize;

    return size + 'rem';
}

/**
 * 获取页面缩放比例
 *
 * @returns 返回当前页面相对于设计稿高度的缩放比例
 */
export const getPageScale = () => {
    const config = getGlobalConfig();

    // 禁用页面缩放
    if (!config.enablePageScale) return 1;

    /** 当前的缩放值 */
    const scale = window.innerHeight / config.designHeight!;

    return scale;
};
