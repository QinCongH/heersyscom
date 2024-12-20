interface Props {
    tableConfig?: any;
    columnData?: any;
    tableData?: any;
    showOperate?: boolean;
    operateType?: number;
    operateList?: any;
    operateWidth?: string;
    showMultiple?: boolean;
    loading?: boolean;
    showSummary?: boolean;
    maxMultipleNum?: number;
    hideSummaryList?: Array<string>;
    summaryList?: any;
    pageNum?: number;
    pageSize?: number;
    total?: number;
    showPagination?: boolean;
    showMultipleColumn?: boolean; //是否显示多列
    rowClassRowConditions?: Function; //自动显示行class的条件
    rowClassName?: string;
    rowSelectCondition?: Function;
    objectSpanMethod?: Function;
    stripe?: boolean; // 是否显示斑马线
    showTooltip?: boolean; // 是否显示斑马线
    paginationPosition?: string
}

const props: Props = {
    //===配置表头
    columnData: [],
    //====表格数据
    tableData: [],
    //====表格配置
    tableConfig: [],
    //====最右侧操作
    showOperate: false,
    operateType: 0, //操作样式类型
    operateList: ["edit", "del"],
    operateWidth: "auto",
    //====是否多选
    showMultiple: true,
    maxMultipleNum: undefined,
    //====loading
    loading: false,
    //表尾合计
    showSummary: false,
    hideSummaryList: () => [], //不显示合计的字段
    summaryList: [], //合计列数据
    //分页
    pageNum: 1,
    pageSize: 10,
    total: 0,
    showPagination: true,
    //多列
    showMultipleColumn: false,
    //     分页位置
    paginationPosition: 'right',
    // 表行显示样式
    rowClassRowConditions: row => false,
    rowClassName: "",
    // 多选-选择是否禁用条件
    rowSelectCondition: row => true,
    // 合并单元格规则
    objectSpanMethod: data => {
    },
    stripe: true,
    showTooltip: true,

}
export {props as propsData, Props}
