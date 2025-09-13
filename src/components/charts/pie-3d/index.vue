<template>
    <div class="am-pie-3d relative" @mousemove="handleMouseMove">
        <!-- 3D 饼图 -->
        <div ref="chartRef" class="relative z-10 h-full w-full bg-red-500/0"></div>

        <!-- 底座背景 -->
        <img
            :src="baseImg"
            class="base-img absolute left-1/2 transform -translate-x-1/2 z-0 bottom-7 w-9/12"
            alt=""
        />
    </div>
</template>

<script lang="ts" setup>
import { inject, isReactive, toRef } from 'vue';
import 'echarts-gl';
import { cloneDeep, debounce, maxBy, merge, orderBy } from 'lodash-es';
import { EChartsOption, PieSeriesOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { SeriesData, SeriesDataItem } from '../../../types/echarts/shared';
import { useChart } from '../../../composables/useChart';
import { getPageScale, pxToRem } from '../../../utils';
import type { Geo3D } from '../../../types/echarts/options/geo3D';
import { setScaleToEchartsOptions } from '../../../utils/chart';
import { PieDataItemOption } from 'echarts/types/src/chart/pie/PieSeries.js';
import { Dictionary, TextCommonOption } from 'echarts/types/src/util/types.js';
import defaultBaseImg from './images/bhth6.png';
import gsap from 'gsap';
import { AM_CONFIG_KEY } from '../../../utils/inject';

defineOptions({
    name: 'am-pie-3d',
});

// const amConfig = inject(AM_CONFIG_KEY);

// console.log('isReactive', isReactive(amConfig));
// console.log('amConfig', amConfig);

const props = withDefaults(
    defineProps<{
        /**
         * 数据
         */
        data: SeriesData;

        /**
         * 配置项
         */
        option?: EChartsOption & { grid3D?: Geo3D };

        /**
         * grid3D 的大小
         * @default 140
         */
        boxSize?: number;

        /**
         * 饼图数据项的最大高度
         * @default 60
         */
        maxHeight?: number;

        /**
         * 饼图底座图片
         */
        baseImg?: string;

        /**
         * label 的配置项。
         * @description label 是用一个 2d 饼图系列实现的，所以配置项与 2d 饼图一致
         */
        labelSeries?: PieSeriesOption;

        /**
         * 数值格式化函数
         * @param params 参数
         */
        valueFormatter?: (params: { value: number; total: number; seriesIndex: number }) => string;
    }>(),
    {
        boxSize: 140,
        maxHeight: 60,
        option: undefined,
        baseImg: defaultBaseImg,
        labelSeries: undefined,
    }
);

const emit = defineEmits<{
    seriesClick: [{ seriesName: string }];
}>();

let _pieData: SeriesData = [];
let _maxValue = 0;
let _sumValue = 0;

interface PieData extends SeriesDataItem {
    startRatio: number;
    endRatio: number;
    height: number;
}

interface PieStatus {
    selected: boolean;
    hovered: boolean;
    k: number;
}

interface Series extends Omit<PieSeriesOption, 'type'> {
    pieData?: PieData;
    pieStatus?: PieStatus;
    parametricEquation?: any;
    [key: string]: any;
}

/**
 * 每次数据更新时都会保存一个快照，用于恢复状态
 */
let originalSeries: Series[];

// 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
let hoveredIndex: number | null = null;

/**
 * 保存饼图扇形的缩放
 */
let scales: { value: number; tween?: gsap.core.Tween }[] = [];

/**
 * 鼠标是否在饼图上
 */
let isHoveringPie = false;

/**
 * 饼图高亮（放大）效果恢复函数
 */
let resetPieHovering: (() => void) | undefined;

const handleMouseMove = (e: MouseEvent) => {
    const target = e.target as Element | null;
    const cursor = target ? getComputedStyle(target).cursor : 'unknown';

    // XXX 骚操作，用于判断鼠标是否在饼图上
    isHoveringPie = cursor === 'pointer';

    if (!isHoveringPie) resetPieHovering?.();
};

const { chartRef } = useChart({
    option: () => {
        const option: EChartsOption = {
            legend: {
                type: 'scroll',
                data: props.data,
                bottom: 0,
                itemGap: 30,
                itemHeight: 14,
                itemWidth: 14,
                textStyle: {
                    color: '#fff',
                    fontSize: 12,
                },
                pageIconColor: '#ddd',
                pageIconSize: 14,
                pageTextStyle: {
                    color: '#ddd',
                    fontSize: 14,
                },
                selectedMode: false, // ❌ 不允许图例点击
            },
            animation: true,
            // 设置初始动画时长（毫秒）
            // animationDuration: 1000,
            // 设置数据更新动画时长（毫秒）
            // animationDurationUpdate: 3000,
            tooltip: {
                formatter: (params) => {
                    const { seriesName, color, seriesIndex } = params as CallbackDataParams;
                    const val = _pieData[seriesIndex!].value;

                    const value = props.valueFormatter
                        ? props.valueFormatter({
                              value: Number(val as string | number),
                              total: _sumValue,
                              // @ts-expect-error
                              seriesIndex: params.seriesIndex,
                          })
                        : val;

                    return `
                    <div style="display: flex; line-height: 1;">
                        <div style="margin-right: ${pxToRem('20px')}">
                            <span style="display: inline-block; margin-right: ${pxToRem(
                                '5px'
                            )};border-radius: ${pxToRem('10px')}; width: ${pxToRem(
                        '10px'
                    )}; height: ${pxToRem('10px')};background-color: ${color};"></span>
                            <span style="font-size: ${pxToRem('14px')};">${seriesName}</span>
                        </div>

                        <span style="font-weight: bold; font-size: ${pxToRem(
                            '14px'
                        )};">${value}</span>
                    </div>`;
                },
                confine: true,
            },
            xAxis3D: {
                min: -1.5,
                max: 1.5,
            },
            xAxis: { show: false },
            yAxis3D: {
                min: -1.5,
                max: 1.5,
            },
            yAxis: { show: false },
            zAxis3D: {
                min: -1,
                max: 1,
            },
            grid3D: {
                show: false,
                boxHeight: 1,
                boxWidth: props.boxSize, // 调整 boxWidth 大小
                boxDepth: props.boxSize, // 调整 boxDepth 大小
                viewControl: {
                    projection: 'orthographic',
                    distance: 1000, // 调整视角距离
                    alpha: 24, // 绕 x 轴旋转的角度
                    beta: 45, // 旋转角度
                    // rotateSensitivity: [1, 0],
                    rotateSensitivity: 0,
                    zoomSensitivity: 0,
                    center: [0, 10, 0],
                },
                light: {
                    main: {
                        intensity: 0.8, // 主光源强度
                        // shadow: true, // 是否开启阴影
                        alpha: 55, // 主光源的俯仰角
                        beta: 55, // 主光源的方位角
                    },
                    ambient: {
                        intensity: 0.4, // 环境光强度，数值越大越亮
                    },
                    // ambientCubemap: {
                    //     texture: 'xxx.hdr', // 支持加载环境贴图（需要 hdr/ktx 文件）
                    //     exposure: 1,
                    //     diffuseIntensity: 0.5,
                    //     specularIntensity: 1,
                    // },
                },
            } as Geo3D,
        };

        return merge({}, option, props.option);
    },
    dataRef: toRef(() => props.data),
    onInitialized(chart) {
        chart.on('click', 'series', ({ seriesName }) => {
            emit('seriesClick', { seriesName });
        });

        /**
         * 标识是否需要更新图表
         */
        let needUpdate = false;

        /**
         * 渲染循环函数
         */
        const renderLoop = () => {
            // 如果需要更新图表
            if (needUpdate) {
                // BUG 会导致正在显示的 tooltip 消失
                chart.setOption({ series: originalSeries }, false, false);
                needUpdate = false;
            }

            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);

        /**
         * 设置缩放差值
         * @param hoverIndex 要放大的系列索引，-1 表示全部恢复 scale=1
         */
        const setScaleTween = (hoverIndex: number) => {
            scales.forEach((scale, index) => {
                const currSeries = originalSeries[index];

                if (!currSeries.pieStatus || !currSeries.pieData) return;

                const { selected, hovered, k } = currSeries.pieStatus;
                const { startRatio, endRatio, height } = currSeries.pieData;

                const targetScale = index === hoverIndex ? 1.06 : 1;

                // 设置差值
                scale.tween?.kill();
                scale.tween = gsap.to(scale, {
                    value: targetScale,
                    duration: 0.2,
                    onUpdate: () => {
                        currSeries.parametricEquation = getParametricEquation(
                            startRatio,
                            endRatio,
                            selected,
                            hovered,
                            k,
                            height,
                            {
                                scale: scale.value,
                            }
                        );

                        // 标识需要更新，让 renderLoop 函数重新渲染图表
                        needUpdate = true;
                    },
                });
            });
        };

        // 鼠标经过扇形
        chart.on('mouseover', function (params: { seriesIndex: number; seriesName: string }) {
            // 避免重复触发
            if (hoveredIndex === params.seriesIndex) return;
            hoveredIndex = params.seriesIndex;

            // 设置缩放缓动
            setScaleTween(params.seriesIndex);
        });

        resetPieHovering = () => {
            // 重置图表交互状态
            hoveredIndex = null;
            // 重置图表缩放 scale=1
            setScaleTween(-1);
        };
    },
    onDataChange: (newData, chart) => {
        const series = getPie3D(newData, 1);

        // 保存快照
        originalSeries = series;

        const options = setScaleToEchartsOptions(
            {
                series: series,
            },
            [],
            ['pieData']
        );

        chart.setOption(options);
    },
});

/**
 * 生成模拟 3D 饼图的配置项
 * @param pieData 饼图数据
 * @param internalDiameterRatio 内径比，默认：1
 */
function getPie3D(pieData: SeriesData, internalDiameterRatio = 1) {
    let series: Series[] = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    // let legendData = [];
    // let linesSeries = []; // line3D模拟label指示线

    // 重置动画
    scales.forEach(({ tween }) => tween?.kill());
    scales = Array.from({ length: pieData.length }, () => ({ value: 1 }));

    // 深拷贝防止修改原数据
    // 按大小排序，保证最小的数据项可以看到
    pieData = cloneDeep(orderBy(pieData, 'value', 'desc'));
    _pieData = pieData;

    const maxItem = maxBy(pieData, 'value');
    if (!maxItem) return [];
    const maxValue = maxItem.value;
    _maxValue = maxValue;

    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;

        let seriesItem: Series = {
            name: pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false,
            },
            pieData: pieData[i] as PieData,
            pieStatus: {
                selected: false,
                hovered: false,
                k: internalDiameterRatio,
            },
            itemStyle: pieData[i].itemStyle,
            parametricEquation: undefined as undefined | any,

            // 关键是这些动画配置👇
            // animation: true, // 开启动画
            animation: false, // 关闭动画，用 gsap 实现更丝滑
            // animationDuration: 3000, // 出场动画时长
            // animationDurationUpdate: 200, // 更新动画时长
        };

        series.push(seriesItem);
    }

    _sumValue = sumValue;

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let i = 0; i < series.length; i++) {
        const scale = pieData[i].value / maxValue;
        // 计算与最高项的比例，设置高度
        const height = props.maxHeight * scale;

        series[i].pieData!.height = height;

        endValue = startValue + series[i].pieData!.value;
        series[i].pieData!.startRatio = startValue / sumValue;
        // OPTIMIZE 如果饼图数值太小会导致很难看出数据项
        series[i].pieData!.endRatio = endValue / sumValue;
        series[i].parametricEquation = getParametricEquation(
            series[i].pieData!.startRatio,
            series[i].pieData!.endRatio,
            false,
            false,
            maxValue === 0 ? 0 : internalDiameterRatio,
            height
        );

        startValue = endValue;
    }

    // 创建 label 的富文本样式
    const rich: Dictionary<TextCommonOption> = {};
    pieData.forEach((item, i) => {
        rich[i] = {
            fontSize: 14,
            fontWeight: 'bold',
            color: (item.itemStyle?.color || '#fff') as string,
        };
    });

    // 添加用于显示 label 的 2D 饼图
    const labelSeries: PieSeriesOption = {
        name: 'pie2d',
        type: 'pie',
        label: {
            opacity: 1,
            position: 'outside',
            fontSize: 12,
            color: '#FFFFFF',
            lineHeight: 18,
            formatter: (params) => {
                // console.log(params);

                if (params.value === 0) {
                    const item = params.data as PieDataItemOption;

                    // 隐藏线
                    item.labelLine = { show: false };

                    return '';
                }

                const value = props.valueFormatter
                    ? props.valueFormatter({
                          value: Number(params.value as string | number),
                          total: _sumValue,
                          seriesIndex: params.seriesIndex!,
                      })
                    : params.value;

                // 不同 label 显示不同样式
                return `${params.name}\n{${params.dataIndex}|${value}}`;
            },
            rich: rich,
        },
        labelLine: {
            length: 40,
            length2: 16,
            lineStyle: {
                color: '#fff',
            },
        },
        startAngle: -45, // 起始角度，支持范围[0, 360]。
        clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['0', '50%'],
        center: ['50%', '45%'],
        data: pieData,
        itemStyle: {
            opacity: 0,
        },
        silent: true,
    };
    series.push(merge({}, labelSeries, props.labelSeries));

    return series;
}

/**
 * 根据起始比例、选中状态、悬停状态等参数，生成用于绘制三维扇形图的参数方程。
 *
 * @param startRatio 扇形起始角度占整个圆的比例（0 到 1）
 * @param endRatio 扇形结束角度占整个圆的比例（0 到 1）
 * @param isSelected 是否被选中，影响偏移效果
 * @param isHovered 是否处于悬停状态，影响缩放效果
 * @param k 扇形内外径比例系数，控制曲面厚度（默认为 1/3）
 * @param height 扇形在 Z 轴方向的高度
 * @param options 配置项
 * @returns 返回一个包含参数方程的对象，包括 u、v 的范围与步长以及 x、y、z 坐标的计算函数
 */
function getParametricEquation(
    startRatio: number,
    endRatio: number,
    isSelected: boolean,
    isHovered: boolean,
    k: number,
    height: number,
    options?: {
        /** 手动设置缩放比例 */
        scale?: number;
    }
) {
    height = height * getPageScale();

    // 计算中间比例和对应的弧度值
    let midRatio = (startRatio + endRatio) / 2;

    let startRadian = startRatio * Math.PI * 2;
    let endRadian = endRatio * Math.PI * 2;
    let midRadian = midRatio * Math.PI * 2;

    // 如果只有一个完整的扇形，则取消选中效果
    if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
    }

    // 设置默认的内外径比例系数 k
    k = typeof k !== 'undefined' ? k : 1 / 3;

    // 根据是否选中计算 X 和 Y 方向的偏移量
    let offsetX = isSelected ? Math.cos(midRadian) * 0 : 0;
    let offsetY = isSelected ? Math.sin(midRadian) * 0 : 0;
    let offsetZ = isSelected ? 5 : 0;

    // 根据是否悬停设置放大比例
    let hoverRate = options?.scale ?? (isHovered ? 1.05 : 1);

    // 返回参数方程对象，包含 u、v 参数范围及 x、y、z 坐标计算方法
    return {
        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32,
        },

        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
        },

        x: function (u: number, v: number) {
            if (u < startRadian) {
                return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        y: function (u: number, v: number) {
            if (u < startRadian) {
                return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        z: function (u: number, v: number) {
            if (u < -Math.PI * 0.5) {
                return offsetZ + Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
                return offsetZ + Math.sin(u);
            }
            return offsetZ + (Math.sin(v) > 0 ? 1 * height : -1);
        },
    };
}
</script>

<style lang="scss" scoped></style>
