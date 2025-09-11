import { HTMLAttributes } from 'vue';

export type TableColumn<T = any> = {
    [K in keyof T]: {
        /**
         * 列名
         */
        label: string;

        /**
         * 绑定字段
         */
        prop: K;

        style?: HTMLAttributes['style'];

        cellClass?: string;

        /**
         * 是否开启文字溢出省略。默认：false
         */
        truncate?: boolean;

        /**
         * 内容对齐方式。默认：center
         */
        align?: 'left' | 'center' | 'right';

        /**
         * 列宽
         */
        width?: number | string;

        /**
         * 自定义格式化
         * @param val 当前单元格的值
         * @param row 当前行的值
         */
        formatter?: (val: T[K], row: T) => string | number | undefined;
    };
}[keyof T];

export interface TableProps<T = any> {
    /**
     * 列配置
     */
    cols: TableColumn<T>[];

    /**
     * 表格数据
     */
    data: T[];

    size?: 'small' | 'default' | 'large';

    /**
     * 是否使用序号列
     * @default true
     */
    showIndex?: boolean;

    /**
     * 表格行的 class
     */
    rowClass?: string | string[] | ((row: T) => string | string[]);

    /**
     * 序号格式化方法
     */
    indexFormatter?: (index: number, row: T) => any;

    /**
     * 是否开启自动滚动
     * @default false
     */
    autoScroll?: boolean;

    /**
     * 开启自动滚动时（useAutoScroll = true），至少有多少行才开始滚动
     */
    limitScrollNum?: number;

    /**
     * 固定显示行数，即使数据不足，也保持高度
     */
    visibleRows?: number | string;

    /**
     * 分页数据，传入该值用于显示真实的 rowindex
     */
    pagination?: {
        pageSize: number;
        curPage: number;
    };

    /**
     * 索引列样式
     */
    indexColStyle?: HTMLAttributes['style'];
}
