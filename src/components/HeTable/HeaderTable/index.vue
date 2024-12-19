<script setup lang="ts">
// /*1. 渲染header 2. 渲染数据（一级，二级，多级表头） 3. 操作按钮处理 4. 多选处理 5.自定义列处理 6. 自适应宽度处理 7.表头筛选处理 8.增加行和删除行处理 9.增加列和删除列处理  类型*/
defineOptions({
  inheritAttrs: true,
  customOptions: {
    name: "HeaderTable"
  }
});
interface Props {
  isChildren?: boolean;
  columnData: any;
}
const props = withDefaults(defineProps<Props>(), {
  isChildren: false,
  columnData: []
});
</script>
<template>
  <el-table-column
    v-for="(item, index) in columnData"
    v-bind="item"
    :key="index"
    align="center"
    resizable
  >
    <!--自定义表头  通过propHeader传递 -->
    <template #header>
      <slot name="propHeader" :data="item">
        {{ item.label }}
      </slot>
    </template>
    <template #default="{ row, column, $index }">
      <!-- 动态表列 -->
      <slot name="propDefault" :data="{ row, column, $index, prop: item.prop }">
        {{ row[item.prop] }}
      </slot>

      <template v-if="item.children && item.children?.length">
        <el-table-column
          v-for="(child, childIndex) in item.children"
          v-bind="child"
          :key="childIndex"
        >
          <template #header>
            <slot name="propHeader" :data="child">
              {{ child.label }}
            </slot>
          </template>
          <template #default="{ row, column, $index }">
            <slot
              name="propDefault"
              :data="{
                row,
                column,
                $index,
                prop: child.prop,
                value: row[child.prop]
              }"
            >
              {{ row[child.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </template>
  </el-table-column>
  <!-- 多选 -->
</template>

<style scoped></style>
