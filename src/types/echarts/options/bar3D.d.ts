import { BarSeriesOption } from 'echarts';

export interface Bar3DSeriesOption extends BarSeriesOption {
    type?: 'bar3D';

    barSize?: [number, number];
}
