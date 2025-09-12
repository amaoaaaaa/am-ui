import { cloneDeep, difference, isArray, merge } from 'lodash-es';
import { EChartsOption, LegendComponentOption } from 'echarts';
import { XAXisOption, YAXisOption } from 'echarts/types/dist/shared';

export const getPageScale = () => {
    /** 设计稿高度 */
    const DESIGN_HEIGHT = 1080;

    /** 当前的缩放值 */
    const scale = window.innerHeight / DESIGN_HEIGHT;

    return scale;
};

/**
 * 根据页面和设计稿的缩放尺寸，对 ECharts 配置中的一些属性设置缩放（会改变传入的 echartsOptions 对象）
 *
 * @param echartsOptions - ECharts 配置
 * @param includesProps - 更多需要处理的属性，默认包含：
 * - 'width'
 * - 'height'
 * - 'fontSize'
 * - 'lineHeight'
 * - 'textShadowBlur'
 * - 'padding'
 * - 'letterSpacing'
 * - 'wordSpacing'
 * - 'symbolSize'
 * - 'symbolOffset'
 * - 'barWidth'
 * - 'lineWidth'
 * - 'itemWidth'
 * - 'itemHeight'
 * - 'itemGap'
 * - 'top'
 * - 'right'
 * - 'bottom'
 * - 'left'
 * - 'margin'
 * - 'borderWidth'
 * - 'radius'
 * @param excludesProps - 不需要处理的属性，默认：`[]`
 *
 * @returns 处理后的 ECharts 配置
 */
export function setScaleToEchartsOptions(
    echartsOptions: EChartsOption,
    includesProps = [] as string[],
    excludesProps = [] as string[]
) {
    const scale = getPageScale();

    const _includesProps = [
        ...new Set([
            'width',
            'height',
            'fontSize',
            'lineHeight',
            'textShadowBlur',
            'padding',
            'letterSpacing',
            'wordSpacing',
            'symbolSize',
            'symbolOffset',
            'barWidth',
            'lineWidth',
            'itemWidth',
            'itemHeight',
            'itemGap',
            'top',
            'right',
            'bottom',
            'left',
            'margin',
            'borderWidth',
            'radius',
            ...includesProps,
        ]),
    ];
    /** 需要缩放的属性集合 */
    const props = difference(_includesProps, excludesProps);

    /**
     * 递归处理对象属性
     * @param obj
     * @returns
     */
    const setScale = <T extends Record<string, any>>(obj: T) => {
        if (typeof obj === 'object') {
            // 遍历对象属性
            for (const key in obj) {
                // 只处理本身的属性
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

                // 跳过排除的属性
                if (excludesProps.includes(key)) continue;

                // 处理需要设置缩放值的属性
                if (props.includes(key)) {
                    const valueType = typeof obj[key];

                    if (valueType === 'number') {
                        // 值是数字，直接乘以缩放值
                        (obj[key] as number) *= scale;
                    } else if (Array.isArray(obj[key])) {
                        // 值是数组，遍历数组每个元素乘以缩放值
                        (obj[key] as Array<number | string>) = (
                            obj[key] as Array<number | string>
                        ).map((val) => {
                            return typeof val === 'number' ? val * scale : val;
                        });
                    }
                }

                // 处理 tooltip 大小自适应
                if (key === 'tooltip') {
                    obj[key].renderMode = 'html';
                    obj[key].className = 'echarts-tooltip';
                }

                // 递归处理嵌套的对象
                setScale(obj[key]);
            }
        }

        return obj;
    };

    // 全局格式化 EchartsTooltipValue
    // formatEchartsTooltipValue(echartsOptions);

    return setScale(echartsOptions);
}

/**
 * 设置一些默认的选项
 * @param echartsOptions - ECharts 配置
 */
export function setDefaultOption(echartsOptions: EChartsOption) {
    const getDefaultLabel = () => {
        return cloneDeep({
            fontFamily: 'SourceHanSansCN-Regular',
            fontSize: 12,
            color: '#fff',
            opacity: 0.8,
        });
    };

    // const {} = echartsOptions;

    /**
     * 应用默认 label 样式
     * @param axis X轴 或 Y轴
     */
    const applyDefaultLabel = (axis: EChartsOption['xAxis'] | EChartsOption['yAxis']) => {
        if (!axis) return;

        const apply = (item: XAXisOption | YAXisOption) => {
            item.axisLabel = merge(getDefaultLabel(), item.axisLabel);
        };

        isArray(axis) ? axis.forEach(apply) : apply(axis);
    };

    // 确保设置轴线样式
    const ensureAxis = (key: 'xAxis' | 'yAxis') => {
        if (!echartsOptions[key]) {
            echartsOptions[key] = { axisLabel: getDefaultLabel() };
        } else {
            applyDefaultLabel(echartsOptions[key]);
        }
    };
    ensureAxis('xAxis');
    ensureAxis('yAxis');

    if (echartsOptions.legend) {
        echartsOptions.legend = merge(
            {
                top: 'bottom',
                textStyle: {
                    fontFamily: 'SourceHanSansCN-Regular',
                    fontSize: 12,
                    color: '#fff',
                },
            } as LegendComponentOption,
            echartsOptions.legend
        );
    }

    return echartsOptions;
}
