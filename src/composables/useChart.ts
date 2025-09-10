import * as echarts from 'echarts';
import { debounce, isFunction } from 'lodash-es';
import { ComputedRef, onUnmounted, Ref, ref, watch } from 'vue';
import { setDefaultOption, setScaleToEchartsOptions } from '../utils/chart';
import { useResizeObserver } from '@vueuse/core';

export type ChartInstance = Omit<echarts.EChartsType, 'setOption'> & {
    setOption: {
        <Opt extends echarts.EChartsOption>(
            option: Opt,
            notMerge?: boolean,
            lazyUpdate?: boolean
        ): void;
        <Opt extends echarts.EChartsOption>(option: Opt, opts?: echarts.SetOptionOpts): void;
    };
};

/**
 * 使用 ECharts 图表通用组合式 API
 * @description
 * 注意：执行 `useChart()` 后必须解构出 `chartRef`，图表才能正确初始化
 */
export const useChart = <T extends Ref | ComputedRef>(params: {
    /**
     * ECharts 图表配置项
     */
    option: echarts.EChartsOption | (() => echarts.EChartsOption);

    // /**
    //  * ECharts 图表数据系列
    //  * @description 内部会监听该数据变化，自动更新图表
    //  */
    // series?: Ref<echarts.EChartsOption['series']> | ComputedRef<echarts.EChartsOption['series']>;

    /**
     * ECharts 图表数据
     * @description 内部会监听该数据变化，自动调用 updateChart
     */
    dataRef?: T;

    /**
     * 初始化之后的回调
     * @param chartInstance 图表实例对象
     */
    onInitialized?: (chartInstance: ChartInstance) => any;

    /**
     * 图表数据更新的回调
     * @param newData 新的数据
     * @param chartInstance 图表实例对象
     */
    onDataChange?: (
        newData: T extends Ref | ComputedRef ? T['value'] : T,
        chartInstance: ChartInstance
    ) => void;
}) => {
    /**
     * 渲染图标的 dom
     */
    const chartRef = ref<HTMLDivElement>();

    /**
     * 图表实例
     */
    const chartInstance = {
        // 这里不能直接用 `let chartInstance`，那样会导致 `const {chartInstance} = useChart(...)` 解构出来的 chartInstance 是 undefined
        // 也不能直接 `const chartInstance = ref<echarts.EChartsType>()`，那样会导致 ECharts tooltip 失效
        value: undefined as ChartInstance | undefined,
    };

    function initChart() {
        chartInstance.value = echarts.init(chartRef.value);

        const options = setScaleToEchartsOptions(
            setDefaultOption(isFunction(params.option) ? params.option() : params.option)
        );

        chartInstance.value.setOption<echarts.EChartsOption>(options);

        // 执行初始化之后的回调
        params.onInitialized?.(chartInstance.value);
    }

    const resizeChart = debounce(() => {
        chartInstance.value?.resize();
        // console.log('resizeChart');
    }, 20);

    const init = () => {
        initChart();

        if (params.dataRef && params.onDataChange) {
            watch(
                () => params.dataRef,
                (newData) => {
                    params.onDataChange!(newData?.value, chartInstance.value!);
                },
                { immediate: true, deep: true }
            );
        }
    };

    // 监听 chartRef 大小变化后 init/resizeChart
    useResizeObserver(chartRef, () => {
        chartInstance.value ? resizeChart() : init();
    });

    onUnmounted(() => {
        chartInstance.value?.dispose();
    });

    return { chartRef, chartInstance };
};
