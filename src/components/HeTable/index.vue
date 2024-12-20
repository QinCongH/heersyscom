<script setup lang="ts">
// /*1. 渲染headerV 2. 渲染数据（一级，二级，多级表头）V 3. 操作按钮处理V
//4. 多选处理V 5.自定义列处理V 6. 自适应宽度处理 7.表头筛选处理  8。分页 类型*/
defineOptions({

  name: "HeTable"

})
import {
  reactive,
  ref,
  computed,
  onMounted,
  onBeforeUpdate,
} from "vue";
import HeaderTable from "./HeaderTable/index.vue";
import Operate from "./Operate/index.vue";
import {deepClone} from "./utils/index";
import type {TableColumnCtx, ElTable} from "element-plus";
import {ElMessage} from "element-plus";
import {Props, propsData} from "./props"

const props = withDefaults(defineProps<Props>(), propsData);
const emit = defineEmits([
  "editHandClick",
  "delHandClick",
  "addHandClick",
  "handleSelectionChange",
  "getSummaries",
  "sortChange",
  "select",
  //分页
  "update:pageNum",
  "update:pageSize",
  "handleRowClick",
  "handleCurrentChange", //分页
  "tableCurrentChange", //表格单选
  "rowContextmenu"
]);

//---操作事件
function delHandClick($index: number) {
  console.log("del");
  emit("delHandClick", $index);
}

function editHandClick($index: number) {
  console.log("edit");
  emit("editHandClick", $index);
}

function addHandClick($index: number) {
  console.log("add");
  emit("addHandClick", $index);
}

//---多选事件
function select(selection: any) {
  if (Boolean(props.maxMultipleNum)) {
    if (selection.length > props.maxMultipleNum) {
      console.log("selection", selection);
      let del_row = selection.shift();
      tableRef.value.toggleRowSelection(del_row, false);
      ElMessage({
        type: "warning",
        message: `最多支持选择${props.maxMultipleNum}个！`
      });
    }
  }
  let idList = selection.map((item: { id: number }) => item.id);
  idList = idList.filter((item: { id: number }) => item != undefined);
  emit("select", {
    rowList: selection,
    idList: idList
  });
}

function selectAll(selections) {
  if (Boolean(props.maxMultipleNum)) {
    if (selections.length > props.maxMultipleNum) {
      ElMessage({
        type: "warning",
        message: `最多支持选择${props.maxMultipleNum}个！`
      });
      selections.length = props.maxMultipleNum;
    }
  }
  let idList = selections.map((item: { id: number }) => item.id);
  idList = idList.filter((item: { id: number }) => item != undefined);
  emit("select", {
    rowList: selections,
    idList: idList
  });
}

//---合计
interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const {columns, data} = param;
  const sums: string[] = [];
  let getMyData = [];
  if (props.hideSummaryList?.length) {
    columns.forEach(column => {
      if (!props.hideSummaryList.includes(column.property)) {
        getMyData.push(column);
      } else {
        getMyData.push({});
      }
    });
  } else {
    getMyData = deepClone(columns);
  }
  getMyData.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "本页合计";
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    if (!values.every(value => Number.isNaN(value))) {
      let num = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);
      sums[index] = `${Math.round(num * 100) / 100}`;
    } else {
      sums[index] = "";
    }
  });

  return sums;
};

// const getSummaries = (param: SummaryMethodProps) => {
//   const { columns } = param;
//   const sums: string[] = [];
//   sums[0] = '合计';
//   // 给每一项配置合计
//   columns.forEach((column, index: number) => {
//     console.log(column);
//     if (index === 0) {
//       sums[index] = '合计';
//       return;
//     }
//     console.log('summaryList', props.summaryList, index);
//     if (Boolean(props.summaryList[index])) {
//       sums[index] = props.summaryList[index];
//     } else {
//       sums[index] = '';
//     }
//   });
//   return sums;
// };
//---排序
function sortChange({
                      column,
                      prop,
                      order
                    }: {
  column: any;
  prop: string;
  order: string;
}) {
  emit("sortChange", {
    column,
    prop,
    order
  });
}

// ---分页
// const currentPageSize = computed(() => {
//   return props.pageSize;
// });
function handleCurrentChange(currentPage: number) {
  emit("update:pageNum", currentPage);
  emit("handleCurrentChange", currentPage);
}

function handleSizeChange(pageSize: number) {
  emit("update:pageSize", pageSize);
  emit("handleCurrentChange", props.pageNum);
}

const pageSizes = computed(() => {
  let arr = [];
  if (props.total <= 10) {
    arr = [1, 5, 10];
  } else if (props.total <= 20) {
    arr = [5, 10, 20];
  } else if (props.total <= 50) {
    arr = [10, 20, 30, 40, 50];
  } else if (props.total <= 100) {
    arr = [5, 10, 20, 50, 100];
  } else {
    arr = [10, 50, 100, 150, 200];
  }
  return arr;
});

//-----选择列
interface ColumnDataType {
  initShow: boolean;
  prop: string;
  label: string;
}

const pageData = reactive<{
  columnList: Array<ColumnDataType>;
  showColumnList: Array<ColumnDataType>;
}>({
  columnList: [],
  showColumnList: []
});
// const { columnList } = toRefs(pageData);
const checkAll = ref(false);
const tableRef = ref<InstanceType<typeof ElTable>>();

//列过滤
function filterTableList() {
  pageData.showColumnList = pageData.columnList.filter(
      (item: { initShow: boolean }) => item.initShow
  );
  // console.log('pageData.showColumnList ', pageData.showColumnList)
  initColumnList();
}

//初始化列
function initColumnList() {
  pageData.columnList = props.columnData.map((item: ColumnDataType) => {
    return {
      ...item,
      initShow:
          !(item.hasOwnProperty("initShow") && item.initShow === false)
    };
  });
}

//初始化
onMounted(() => {
  if (props.columnData.length) {
    // 所有列表
    initColumnList();
    // 显示列表
    filterTableList();
  }
  if (
      pageData.columnList.every((item: ColumnDataType) => {
        return item.initShow;
      })
  ) {
    checkAll.value = true;
  } else {
    checkAll.value = false;
  }
  filterTableList(); //过滤
});

function handleCheckAllChange() {
  //点击全选
  if (checkAll.value) {
    //true
    pageData.columnList = pageData.columnList.map((item: any) => {
      return {
        ...item,
        initShow: true
      };
    });
  } else {
    pageData.columnList = pageData.columnList.map((item: any) => {
      return {
        ...item,
        initShow: false
      };
    });
  }
  pageData.showColumnList = pageData.columnList.filter(
      (item: { initShow: boolean }) => item.initShow
  );
}

const handleRowClick = (row: any) => {
  pageData.showColumnList = pageData.columnList.filter(
      (item: { initShow: boolean }) => item.initShow
  );
  if (
      pageData.columnList.some((item: any) => {
        return item.initShow === false;
      })
  ) {
    checkAll.value = false;
  } else {
    checkAll.value = true;
  }
  emit("handleRowClick", {...row});
};
defineExpose({
  tableRef
});
// 更新之前钩子
onBeforeUpdate(() => {
  if (props.columnData.length) {
    // 所有列表
    initColumnList();
    // 显示列表
    filterTableList();
  }
  if (
      pageData.columnList.every((item: ColumnDataType) => {
        return item.initShow;
      })
  ) {
    checkAll.value = true;
  } else {
    checkAll.value = false;
  }
  filterTableList(); //过滤
});

//单选
function tableCurrentChange(row: any) {
  console.log(row);
  emit("tableCurrentChange", row);
}

/**
 * @desc 给单行设置颜色
 */
function changRowStyle({row}) {
  if (props.rowClassRowConditions(row)) {
    return props.rowClassName;
  }
}

/** 是否禁用
 * @desc 多选
 * @param row
 */
function selectEnable(row) {
  return props.rowSelectCondition(row);
}

// 处理合并行的数据
const getSpanArr = (data, spanKey) => {
  let spanArr = [];
  let pos = "";
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      spanArr.push(1);
      pos = 0;
    } else {
      // 判断当前元素与上一个元素是否相同
      if (data[i][spanKey] === data[i - 1][spanKey]) {
        spanArr[pos] += 1;
        spanArr.push(0);
      } else {
        spanArr.push(1);
        pos = i;
      }
    }
  }
  return spanArr;
};
/**
 * @desc 合并表格列单元格
 */
const objectSpanMethodHandle = ({
                                  row,
                                  column,
                                  rowIndex,
                                  columnIndex // 第几列
                                }) => {
  return props.objectSpanMethod({
    row,
    column,
    rowIndex,
    columnIndex // 第几列
  });
};

/**
 * @desc 右键点击行事件
 */
function rowContextmenu(row, column, event) {
  // console.info(row);
  console.info(event);
  event.preventDefault();
  emit("rowContextmenu", {
    row,
    column,
    data: {
      clientX: event.clientX,
      clientY: event.clientY
    }
  });
}
</script>

<template>
  <!-- 选择列 -->
  <div v-if="showMultipleColumn" class="chose-column">
    <el-dropdown trigger="click" :hide-on-click="false">
      <el-button>选择列</el-button>
      <template #dropdown>
        <el-dropdown-menu class="dropdown">
          <el-dropdown-item>
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
            >全选
            </el-checkbox
            >
          </el-dropdown-item>
          <el-dropdown-item
              v-for="(item, index) in pageData.columnList"
              :key="index"
          >
            <el-checkbox
                v-model="item.initShow"
                @change="handleRowClick({ ...item, index })"
            >{{ item.label }}
            </el-checkbox
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div class="base-table virtual">
    <el-table

        v-bind="{ ...tableConfig }"
        ref="tableRef"
        v-loading="loading"
        :span-method="objectSpanMethodHandle"
        :row-class-name="changRowStyle"
        :header-cell-style="{ background: 'rgb(253 253 254)' }"
        :showSummary="showSummary"
        :show-overflow-tooltip="showTooltip"
        sum-text="合计"
        :border="true"
        lazy
        :data="tableData"
        :stripe="stripe"
        style="width: 100%"
        :summary-method="getSummaries"
        @current-change="tableCurrentChange"
        @select="select"
        @select-all="selectAll"
        @row-click="handleRowClick"
        @sort-change="sortChange"
        @row-contextmenu="rowContextmenu"
    >
      <!-- 多选 -->
      <el-table-column
          v-if="showMultiple"
          :selectable="selectEnable"
          type="selection"
          width="55"
      />
      <HeaderTable :columnData="pageData.showColumnList">
        <!-- 操作 -->
        <!-- 动态表头 插槽名称：prop字段+'Header'  最多支持二级-->
        <template #propHeader="data">
          <slot :name="`${data.data?.prop}Header`" :data="data.data">
            {{ data.data.label }}
          </slot>
        </template>
        <!-- 动态表列 插槽名称：prop字段+'Default' 最多支持二级-->
        <template #propDefault="obj">
          <slot :name="`${obj.data.prop}Default`" :data="obj.data">
            {{ obj.data.row[obj.data.prop] }}
          </slot>
        </template>
      </HeaderTable>
      <Operate
          v-if="showOperate"
          :loading="loading"
          :operateWidth="operateWidth"
          :operateType="operateType"
          :operateList="operateList"
          fixed="right"
          @addHandClick="addHandClick"
          @delHandClick="delHandClick"
          @editHandClick="editHandClick"
      >
        <!-- 添加更多操作 -->
        <template #more="{ data }">
          <!-- {{ data }} -->
          <slot name="moreOperate" :data="{ $index: data }"/>
        </template>
      </Operate>
    </el-table>

  </div>
  <div v-show="showPagination" :style="{
    alignItems: 'center',
    justifyContent:new Map([
        ['left','flex-start'],
        ['center','center'],
        ['right','flex-end'],
    ]).get(paginationPosition)
  }" class="pagination">
    <!-- hide-on-single-page 只有一页时隐藏 -->
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :hide-on-single-page="false"
        :small="false"
        :disabled="loading"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.pagination {
  width: 100%;
  display: flex;
  margin-top: 30px;
}

.chose-column {
  display: flex;
  justify-content: end;
  margin-bottom: 15px;
  /* //max-height: 300px; */
  /* overflow-y: scroll; */
}

.dropdown {
  max-height: 300px;
  overflow: auto;
}

:v-deep(.el-table__body-wrapper) {
  max-height: 57vh !important;
  overflow-y: scroll !important;

  &::-webkit-scrollbar {
    width: 0px;
  }
}
</style>
<style>
.base-table.virtual .el-table__body-wrapper {
  max-height: calc(100vh - 350px) !important;
  overflow-y: scroll !important;

  &::-webkit-scrollbar {
    width: 0px;
  }
}
</style>
<!--

  使用
      <Demo
      :showMultiple="false"
      :showOperate="true"
      :operateType="0"
      :tableData="[
        {
          vvv: 1,
          fff: 1,
          ddd: 12,
        },
      ]"
      :columnData="[
        {
          prop: 'vvv',
          label: 'a',
          children: [
            {
              prop: 'fff',
              label: 'aa',
            },
          ],
        },
        {
          prop: 'ddd',
          label: 'b',
        },
      ]"
    >
     <! 动态表头 prop+"Header"
      <template #aHeader="{ data }"> {{ data.prop }} </template>
       动态表列 prop+"Default"
      <template #fffDefault="{ data }"> {{ data.value }} </template>
    </Demo>

    Tip:
    1. 合并单元格使用：
    // 处理合并行的数据
      const getSpanArr = (data, spanKey) => {
        let spanArr = [];
        let pos = "";
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            spanArr.push(1);
            pos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i][spanKey] === data[i - 1][spanKey]) {
              spanArr[pos] += 1;
              spanArr.push(0);
            } else {
              spanArr.push(1);
              pos = i;
            }
          }
        }
        return spanArr;
      }
      const objectSpanMethodHandle = ({
              row,
              column,
              rowIndex,
              columnIndex, // 第几列
            }: SpanMethodProps) => {
              return props.objectSpanMethod({
              row,
              column,
              rowIndex,
              columnIndex, // 第几列
            })
              // if (columnIndex === 0||columnIndex === 1||columnIndex === 2) {
              //   let spanArr = getSpanArr(props.tableData, "ip");
              //   const _row = spanArr[rowIndex];
              //   const _col = _row > 0 ? 1 : 0;
              //   return {
              //     rowspan: _row,
              //     colspan: _col,
              //   };
              // }
            }


 -->
