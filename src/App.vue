<script setup lang="ts">
import HeTable from "@/components/HeTable/index.vue"
const columns = [
  {
    label: "序号",
    prop: "no",
  }, {
    label: "IP",
    prop: "ip",
  },
  {
    label: "MAC",
    prop: "mac",
  },
  {
    label: "端口",
    prop: "port",
  }
]
const tableData = [
  {
    no: 1,
    ip: "127.0.0.1",
    mac: "2a:4f:3c:5d:71:a4",
    port: "88",
  },
  {
    no: 2,
    ip: "127.0.0.2",
    mac: "1f:3e:2c:6d:89:3a",
    port: "89",
  }
]
</script>
<template>
  <HeTable   :showTooltip="false" :hide-summary-list="['no']" :showMultipleColumn="true" :showSummary="true" :loading="false" :maxMultipleNum="1" pagination-position="right" :total="tableData.length" :column-data="columns" :table-data="tableData"></HeTable>
</template>
