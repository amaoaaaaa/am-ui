<script setup>
import { defineAsyncComponent } from 'vue'
import { ElTag } from 'element-plus'

const Pie3D = defineAsyncComponent(() => import('./components/DemoPie3D.vue'))
</script>




# Pie3D 饼图3D

使用 echarts-gl 绘制的3D饼图

## 示例

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
| select <el-tag size="small" round>0.4.0</el-tag> | `{ index: number \| null }` | 选中/取消某个系列时触发 |

## Exposes

| 名称 | 说明 | 类型 |
|----------|---------|------|
| setSelect <el-tag size="small" round>0.4.0</el-tag> | 设置选中的系列，传 `null` 则取消选中 | (seriesIndex: number \| null) => void |