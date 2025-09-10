# @amaoaaaaa/am-ui

Internal Vue 3 component library.

---

## 安装

```bash
npm install @amaoaaaaa/am-ui
```

---

## 引入组件和样式

**注意**：样式需要手动引入。

```ts
// main.ts / main.js
import '@amaoaaaaa/am-ui/style.css';
```

---

## 使用示例

```vue
<template>
    <AmPie3D
        :data="data"
        :option="{ tooltip: { show: false } }"
        val-unit="%"
        class="h-80 w-96"
        :box-size="80"
        :max-height="60"
    />
</template>

<script lang="ts" setup>
import { random } from 'lodash-es';
import { AmPie3D } from '@amaoaaaaa/am-ui';

const n1 = random(0, 100);
const n2 = random(0, 100 - n1);
const n3 = 100 - n1 - n2;

const data = [
    { name: '喷涂线', itemStyle: { color: '#00EAFF' }, value: n1 },
    { name: '点焊一', itemStyle: { color: '#1fb4ff' }, value: n2 },
    { name: '点焊二', itemStyle: { color: '#1AE496' }, value: n3 },
];
</script>
```

---

## 许可

MIT License