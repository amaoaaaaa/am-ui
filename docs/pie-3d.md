# Pie3D

饼图3D

## 示例

<script setup>
import { defineAsyncComponent } from 'vue'
const Pie3D = defineAsyncComponent(() => import('./components/DemoPie3D.vue'))
</script>

<ClientOnly>
    <Pie3D />
</ClientOnly>

## Props

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| data | `SeriesData` | — | 数据 |
| option | `EChartsOption & { grid3D?: Geo3D }` | undefined | 配置项 |
| boxSize | number | 140 | grid3D 的大小 |
| maxHeight | number | 60 | 饼图数据项的最大高度 |
| baseImg | string | `defaultBaseImg` | 饼图底座图片 |
| labelSeries | `PieSeriesOption` | undefined | label 的配置项。label 是用一个 2d 饼图系列实现的，所以配置项与 2d 饼图一致 |
| valueFormatter | `valueFormatter?: (params: { value: number; total: number; seriesIndex: number }) => string` | undefined | 数值格式化函数 |

## Events

| 事件名称 | 参数 | 描述 |
|----------|---------|------|
| seriesClick | `{ seriesName: string }` | 点击某个系列时触发 |
