<script setup>
import { defineAsyncComponent } from 'vue'

const TableBaseUse = defineAsyncComponent(() => import('./components/DemoTable/TableBaseUse.vue'))

const TableVisibleRowsLimit = defineAsyncComponent(() => import('./components/DemoTable/TableVisibleRowsLimit.vue'))

const TableAutoScroll = defineAsyncComponent(() => import('./components/DemoTable/TableAutoScroll.vue'))
</script>

# Table 表格

带自动滚动的表格

## 示例

### 基础用法

只需要传 `cols` 和 `data` 属性

<ClientOnly>
    <TableBaseUse />
</ClientOnly>

### 限制显示行数

通过 `visible-rows` 属性控制显示行数

<ClientOnly>
    <TableVisibleRowsLimit />
</ClientOnly>

### 自动滚动

通过 `visible-rows` 限制行数，并设置 `auto-scroll` 为 true

<ClientOnly>
    <TableAutoScroll />
</ClientOnly>

## Props

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cols | `TableColumn<T>[]` | — | 列配置 |
| data | `T[]` | — | 表格数据 |
| size | 'small' \| 'default' \| 'large' | — | 表格尺寸 |
| showIndex | boolean | true | 是否使用序号列 |
| rowClass | string \| string[] \| ((row: T) => string \| string[]) | — | 表格行的 class |
| indexFormatter | (index: number, row: T) => any | — | 序号格式化方法 |
| autoScroll | boolean | false | 是否开启自动滚动 |
| limitScrollNum | number | — | 开启自动滚动时，至少有多少行才开始滚动 |
| visibleRows | number \| string | — | 固定显示行数，即使数据不足，也保持高度 |
| pagination | `{ pageSize: number; curPage: number }` | — | 分页数据，传入该值用于显示真实的 rowIndex |
| indexColStyle | `HTMLAttributes['style']` | — | 索引列样式 |

## Events

| 事件名称 | 参数 | 描述 |
|----------|---------|------|
| rowClick | `{ row: T; rowIndex: number }` | 行点击事件 |


## CSS 变量

| 变量名 | 描述 |
|--------|------|
| --head-height | 表头高度 |
| --head-font-size | 表头字体大小 |
| --body-font-size | 表格主体字体大小 |
| --row-min-height | 表格行最小高度 |
| --row-background-image | 行背景图片 |
| --index-cell-width | 索引列宽度 |
| --row-cell-padding | 单元格内边距 |