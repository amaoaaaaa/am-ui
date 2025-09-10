<template>
    <Pie3D
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
import Pie3D from '../../src/components/charts/pie-3d/index.vue';

const n1 = random(0, 100);
const n2 = random(0, 100 - n1);
const n3 = 100 - n1 - n2;

const data = [
    { name: '喷涂线', itemStyle: { color: '#00EAFF' }, value: n1 },
    { name: '点焊一', itemStyle: { color: '#1fb4ff' }, value: n2 },
    { name: '点焊二', itemStyle: { color: '#1AE496' }, value: n3 },
];
</script>

<style lang="scss" scoped></style>
