import 'echarts';
import { Geo3D } from './options/geo3D';
import { EChartsOption } from 'echarts';

type EventQuery = string | object;

// 定义事件 echarts
type EvtDef = {
    legendselectchanged: [
        {
            name: string;
            selected: Record<string, boolean>;
            type: 'legendselectchanged';
        },
    ];

    [key: string]: any[];
};

declare module 'echarts' {
    // 完善 EChartOption 的类型
    interface EChartOption {
        /**
         * 三维的地理坐标系组件。组件提供了三维 GeoJSON 的绘制以及相应的坐标系，开发者可以在上面展示三维的散点图、气泡图、柱状图、飞线图。
         */
        geo3D?: Geo3D | Geo3D[];
    }

    interface EChartsType {
        getOption: () => EChartsOption;

        // 拓展 echarts 事件
        on<Ctx, EvtNm extends keyof EvtDef>(
            event: EvtNm,
            handler: (...args: EvtDef[EvtNm]) => void,
            context?: Ctx,
        ): this;
        on<Ctx, EvtNm extends keyof EvtDef>(
            event: EvtNm,
            query: EventQuery,
            handler: (...args: EvtDef[EvtNm]) => void,
            context?: Ctx,
        ): this;
    }
}
