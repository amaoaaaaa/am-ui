<template>
    <div class="p-5 rounded bg-am-dark">
        <Pie3D
            class="h-80 w-[400px]"
            :box-size="90"
            :max-height="40"
            :data="data"
            :option="{ tooltip: { show: false } }"
            :value-formatter="({ value, total }) => `${((value / total) * 100).toFixed(2)}%`"
        />
    </div>
</template>

<script lang="ts" setup>
import Pie3D from '../../src/components/charts/pie-3d/index.vue';

const data = [
    {
        name: '喷涂线',
        itemStyle: {
            color: '#00EAFF',
        },
        value: 104,
    },
    {
        name: '点焊一',
        itemStyle: {
            color: '#1fb4ff',
        },
        value: 68,
    },
    {
        name: '点焊二',
        itemStyle: {
            color: '#1AE496',
        },
        value: 24,
    },
];
</script>

<style lang="scss" scoped></style>
