import { ItemStyleOption } from 'echarts/types/src/util/types.js';

export type ChartDataItem = {
    name: string;
    value: number;
};

export type ChartData = ChartDataItem[];

export type SeriesDataItem = ChartDataItem & { itemStyle?: ItemStyleOption };
export type SeriesData = SeriesDataItem[];
