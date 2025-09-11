<template>
    <!-- 表格组件 -->
    <div
        class="flex flex-col am-table-component"
        :class="['size--' + size, visibleRows ? 'is-set-visible-rows' : '']"
        :style="{ '--visible-rows': visibleRows }"
    >
        <!-- 表头 -->
        <ul :class="['flex-shrink-0 am-table-header']">
            <!-- <li v-if="useSelect" class="head-cell select-cell">选择</li> -->
            <li v-if="showIndex" class="head-cell index-cell" :style="indexColStyle">序号</li>

            <li
                v-for="({ label, prop, style, align, width }, index) in props.cols"
                :key="index"
                :style="mergeCellStyle(style, align, width)"
                class="head-cell"
                :data-prop="prop"
            >
                {{ label }}
            </li>
        </ul>

        <component
            :is="props.autoScroll ? Vue3SeamlessScroll : ElScrollbar"
            ref="tableBodyWrapper"
            :list="props.data"
            :limit-scroll-num="limitScrollNumValue"
            :step="0.3"
            class="overflow-hidden flex-1"
            hover
            wheel
            is-watch
            always
        >
            <div class="am-table-body" :style="{ overflowY: props.autoScroll ? 'hidden' : 'auto' }">
                <!-- 表格行 -->
                <ul
                    v-for="(row, rowIndex) in props.data"
                    :key="rowIndex"
                    :class="[
                        'am-table-row',
                        isFunction(props.rowClass) ? props.rowClass(row) : props.rowClass,
                    ]"
                    @click="emits('rowClick', { row, rowIndex })"
                >
                    <!-- 行插槽 -->
                    <template v-if="$slots.row">
                        <slot name="row" :row="row" :index="rowIndex" />
                    </template>

                    <!-- 默认行 -->
                    <template v-else>
                        <!-- 序号单元格 -->
                        <template v-if="showIndex">
                            <!-- 使用自定义格式化方法 -->
                            <li
                                v-if="indexFormatter"
                                class="row-cell index-cell index-formatted"
                                v-html="indexFormatter(rowIndex, row)"
                            ></li>

                            <!-- 默认样式 -->
                            <li v-else class="row-cell index-cell" :style="indexColStyle">
                                <span>{{ realIndex(rowIndex) }}</span>
                            </li>
                        </template>

                        <!-- 单元格 -->
                        <li
                            v-for="(
                                { prop, style, cellClass, truncate, formatter, align, width },
                                colIndex
                            ) in cols"
                            :key="colIndex"
                            class="row-cell"
                            :style="mergeCellStyle(style, align, width)"
                            :data-prop="prop"
                        >
                            <span
                                v-if="formatter"
                                :class="cellClass"
                                v-html="formatter(row[prop], row)"
                            ></span>

                            <span v-else v-text-ellipsis="truncate || false" :class="cellClass">{{
                                row[prop]
                            }}</span>
                        </li>
                    </template>
                </ul>
            </div>
        </component>
    </div>
</template>

<script lang="ts" setup generic="T">
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';
import { ElScrollbar } from 'element-plus';
import { isFunction, merge } from 'lodash-es';
import { TableProps, TableColumn } from './types';
import { computed, nextTick, StyleValue, useTemplateRef, watch } from 'vue';
import { pxToRem } from '../../../utils';
import { vTextEllipsis } from '@amaoaaaaa/v-text-ellipsis';

const emits = defineEmits<{
    rowClick: [params: { row: T; rowIndex: number }];
}>();

const props = withDefaults(defineProps<TableProps<T>>(), {
    size: 'default',
    rowClass: () => [],
    showIndex: true,
    indexFormatter: undefined,
    visibleRows: undefined,
    limitScrollNum: undefined,
    pagination: undefined,
});

/**
 * 多少行时开始滚动
 */
const limitScrollNumValue = computed(() => {
    // 优先使用设置的开始滚动行数
    if (props.limitScrollNum) return props.limitScrollNum;

    // 设置了固定显示的行数
    if (props.visibleRows) {
        const visibleRows = parseInt(String(props.visibleRows));

        // 数据行数大于固定显示行数时滚动
        if (props.data.length > visibleRows) {
            return visibleRows + 1;
        } else {
            return 99999;
        }
    } else {
        // 再没有就默认 1 行也滚动
        return 1;
    }
});

const tableBodyWrapper = useTemplateRef<{ Reset?: () => void }>('tableBodyWrapper');

watch(limitScrollNumValue, () => {
    nextTick(() => {
        // 重置 Vue3SeamlessScroll 组件滚动
        tableBodyWrapper.value?.Reset?.();
    });
});

/**
 * 计算表格行的真实序号
 * @param index 遍历的索引（从 0 开始）
 */
function realIndex(index: number) {
    let i = index + 1;

    if (props.pagination) {
        i += (props.pagination.curPage - 1) * props.pagination.pageSize;
    }

    return i;
}

function mergeCellStyle(style: StyleValue, align: TableColumn['align'], width?: number | string) {
    const alignStyle = {
        justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    } as StyleValue;

    const widthStyle: StyleValue =
        width !== undefined
            ? {
                  width: pxToRem(width),
                  flex: 'unset',
              }
            : {};

    // console.log('pxToRem(width)', pxToRem(width));

    return merge(alignStyle, style, widthStyle);
}
</script>

<style lang="scss" scoped>
@mixin bg-fill {
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
}

.am-table-component {
    &.is-set-visible-rows {
        height: calc(var(--head-height) + (var(--row-min-height) * var(--visible-rows)));
    }

    .head-cell,
    .row-cell {
        flex: 1;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        // text-align: center;
        overflow: hidden;
        color: #b7d5ed;
        opacity: 0.95;
        padding: var(--row-cell-padding);
        margin: 0;
    }

    .index-cell {
        width: var(--index-cell-width);
        flex: unset;

        &.row-cell:not(.index-formatted) {
            span {
                min-width: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-image: url('./images/row-index-bg.png');
                @include bg-fill;
                padding: 5px 7px;

                font-weight: bold;
                font-size: var(--body-font-size);
                line-height: 1;
                color: #d1e6f7;
                text-shadow: 0px 3px var(--px) #05162c;
                font-style: italic;
            }
        }
    }

    .am-table-header {
        display: flex;

        .head-cell {
            line-height: var(--head-height);
            color: #7faccf;
            opacity: 0.82;
            font-size: var(--head-font-size);
        }
    }

    .am-table-body {
        overflow-x: hidden;

        .am-table-row {
            display: flex;
            align-items: center;
            background-image: var(--row-background-image);
            @include bg-fill;
            font-size: var(--body-font-size);
            min-height: var(--row-min-height);

            .row-cell {
                padding-top: 0.2em;
                padding-bottom: 0.2em;
            }
        }
    }

    &.size--small {
        --head-height: 32px;
        --head-font-size: 14px;
        --body-font-size: 14px;
        --row-min-height: 32px;
        --row-background-image: url('./images/row-bg1.png');
        --index-cell-width: 54px;
        --row-cell-padding: 0 4px;

        .index-cell {
            &.row-cell:not(.index-formatted) {
                span {
                    min-width: 22px;
                    padding: 2px 6px 5px 3px;
                    text-shadow: 0px 2px var(--px) #05162c;
                }
            }
        }
    }

    &.size--default {
        --head-height: 34px;
        --head-font-size: 16px;
        --body-font-size: 14px;
        --row-min-height: 42px;
        --row-background-image: url('./images/row-bg1.png');
        --index-cell-width: 60px;
        --row-cell-padding: 0 8px;
    }

    &.size--large {
        --head-height: 50px;
        --head-font-size: 16px;
        --body-font-size: 16px;
        --row-min-height: 54px;
        --row-background-image: url('./images/row-bg.png');
        --index-cell-width: 80px;
        --row-cell-padding: 0 12px;
    }
}
</style>
