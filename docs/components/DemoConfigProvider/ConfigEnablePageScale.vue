<template>
    <div class="p-5 rounded bg-am-dark flex justify-center relative">
        <el-switch
            v-model="enablePageScale"
            active-text="启用"
            inactive-text="关闭"
            inline-prompt
            class="absolute left-7 top-5"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="handleChange"
        ></el-switch>

        <ConfigProvider :config="{ enablePageScale: enablePageScale }">
            <Pie3D
                v-if="chartVisible"
                :data="data"
                :box-size="90"
                :max-height="40"
                class="h-80 w-[400px]"
            />
        </ConfigProvider>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import ConfigProvider from '../../../src/components/ConfigProvider.vue';
import Pie3D from '../../../src/components/charts/pie-3d/index.vue';
import { SeriesData } from '../../../src/types/echarts/shared';
import { ElSwitch } from 'element-plus';

const enablePageScale = ref(true);
const chartVisible = ref(true);
const handleChange = () => {
    chartVisible.value = false;

    nextTick(() => {
        chartVisible.value = true;
    });
};

const data: SeriesData = [
    { value: 394, name: '爱奇艺', itemStyle: { color: '#00BE06' } },
    { value: 268, name: '腾讯视频', itemStyle: { color: '#38e2f7' } },
    { value: 180, name: '芒果TV', itemStyle: { color: '#FF6A00' } },
];
</script>

<style lang="scss" scoped></style>
