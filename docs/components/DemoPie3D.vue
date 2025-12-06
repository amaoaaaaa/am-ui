<template>
    <div class="p-5 rounded bg-am-dark flex justify-center">
        <ConfigProvider :config="{ enablePageScale: false }">
            <Pie3D
                class="h-80 w-[400px]"
                :box-size="90"
                :max-height="40"
                :data="data"
                :option="{ tooltip: { show: false } }"
                :value-formatter="({ value, total }) => `${((value / total) * 100).toFixed(2)}%`"
            />
        </ConfigProvider>
    </div>
</template>

<script lang="ts" setup>
import ConfigProvider from '../../src/components/ConfigProvider.vue';
import Pie3D from '../../src/components/charts/pie-3d/index.vue';

const data = [
    {
        name: '喷涂线',
        itemStyle: {
            color: '#00EAFF',
        },
        value: 51,
    },
    {
        name: '点焊一',
        itemStyle: {
            color: '#1fb4ff',
        },
        value: 39,
    },
    {
        name: '点焊二',
        itemStyle: {
            color: '#1AE496',
        },
        value: 20,
    },
];
</script>

<style lang="scss" scoped></style>
