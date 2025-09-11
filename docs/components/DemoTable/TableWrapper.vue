<template>
    <div class="relative rounded overflow-hidden">
        <img
            src="https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?w=700"
            class="absolute w-full h-full object-cover"
        />

        <div class="p-5 pb-7 bg-gradient-to-r from-black/70 to-black/40 relative z-10">
            <slot :cols="cols" :data="data"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '../../../src/components/data/table/types';

interface Row {
    date: string;
    name: string;
    address: string;
}

const cols: TableColumn<Row>[] = [
    {
        label: '日期',
        prop: 'date',
        width: 130,
    },
    {
        label: '姓名',
        prop: 'name',
        width: 130,
    },
    {
        label: '地址',
        prop: 'address',
    },
];

const data: Row[] = [
    { date: '2025-09-10', name: '张伟', address: '北京市朝阳区建国路100号' },
    { date: '2025-09-09', name: '李娜', address: '上海市浦东新区世纪大道200号' },
    { date: '2025-09-08', name: '王强', address: '广州市天河区体育西路300号' },
    { date: '2025-09-07', name: '刘芳', address: '深圳市南山区科技园北区400号' },
    { date: '2025-09-06', name: '陈浩', address: '成都市锦江区春熙路500号' },
    { date: '2025-09-05', name: '赵敏', address: '杭州市西湖区文三路600号' },
];
</script>

<style lang="scss" scoped>
::v-deep(.am-table-component) {
    ul {
        margin: 0;
        padding: 0;
    }
}
</style>
