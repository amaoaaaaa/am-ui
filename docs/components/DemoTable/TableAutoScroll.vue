<template>
    <TableWrapper>
        <template #default="{ cols, data }">
            <AmTable :cols="cols" :data="data" :visible-rows="4" auto-scroll />
        </template>
    </TableWrapper>
</template>

<script lang="ts" setup>
import TableWrapper from './TableWrapper.vue';
import AmTable from '../../../src/components/data/table/index.vue';
</script>

<style lang="scss" scoped></style>
