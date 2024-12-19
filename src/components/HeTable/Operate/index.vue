<script setup lang="ts">
// /*1. 渲染header 2. 渲染数据（一级，二级，多级表头） 3. 操作按钮处理 4. 多选处理 5.自定义列处理 6. 自适应宽度处理 7.表头筛选处理 8.增加行和删除行处理 9.增加列和删除列处理  类型*/
import { useAttrs } from "vue";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
const attrs: any = useAttrs();
console.log("attrs", attrs);
</script>
<template>
  <el-table-column
    label="操作"
    :width="attrs.operateWidth || 'auto'"
    align="center"
  >
    <template #default="{ $index }">
      <div class="operate" v-if="attrs.operateType === 0">
        <div
          v-show="attrs.operateList.includes('add')"
          class="add"
          @click="attrs.onAddHandClick($index)"
        >
          <el-button
            :disabled="attrs.loading || false"
            type="info"
            :icon="Plus"
            circle
          ></el-button>
        </div>
        <div class="edit" v-show="attrs.operateList.includes('edit')">
          <el-button
            type="primary"
            @click="attrs.onEditHandClick($index)"
            :icon="Edit"
            circle
            :disabled="attrs.loading || false"
          ></el-button>
        </div>
        <div class="del" v-show="attrs.operateList.includes('del')">
          <el-button
            @click="attrs.onDelHandClick($index)"
            type="danger"
            circle
            :icon="Delete"
            :disabled="attrs.loading || false"
          ></el-button>
        </div>
        <slot name="more" :data="$index"></slot>
      </div>
      <div class="operate" v-else-if="attrs.operateType === 1">
        <div
          class="add"
          v-show="attrs.operateList.includes('add')"
          @click="attrs.onAddHandClick()"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </div>
        <div
          class="edit"
          v-show="attrs.operateList.includes('edit')"
          @click="attrs.onEditHandClick($index)"
        >
          <el-icon>
            <Edit />
          </el-icon>
        </div>
        <div
          class="del"
          v-show="attrs.operateList.includes('del')"
          @click="attrs.onDelHandClick($index)"
        >
          <el-icon>
            <Delete />
          </el-icon>
        </div>
        <slot name="more" :data="$index"></slot>
      </div>
      <div class="operate" v-else-if="attrs.operateType === 2">
        <el-dropdown>
          <el-icon>
            <MoreFilled />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-show="attrs.operateList.includes('add')"
                @click="attrs.onAddHandClick()"
                >新增</el-dropdown-item
              >
              <el-dropdown-item
                v-show="attrs.operateList.includes('edit')"
                @click="attrs.onEditHandClick($index)"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item
                v-show="attrs.operateList.includes('del')"
                @click="attrs.onDelHandClick($index)"
                >删除
              </el-dropdown-item>
              <slot name="more" :data="$index"></slot>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </el-table-column>
</template>

<style scoped>
.operate {
  display: flex;
  cursor: pointer;
  justify-content: center;
}

.operate > div {
  padding: 0px 5px;
}
</style>
