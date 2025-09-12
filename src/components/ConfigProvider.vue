<template>
    <slot />
</template>

<script lang="ts" setup>
import { provide, watch } from 'vue';
import { AM_CONFIG_KEY } from '../utils/inject';
import { AmConfig, globalConfig, setGlobalConfig } from '../utils/config-store';

const props = defineProps<{
    config?: AmConfig;
}>();

watch(
    () => props.config,
    (config) => {
        setGlobalConfig(config || {});
    },
    { immediate: true }
);

provide(AM_CONFIG_KEY, globalConfig);
</script>

<style lang="scss" scoped></style>
