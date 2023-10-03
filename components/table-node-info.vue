<template>
  <div>
    <el-table
        :data="data"
        style="width: 100%">
      <el-table-column type="expand" v-if="withSubTable">
        <template slot-scope="props">
          <div class="sub-table-outer">
            <el-table :data="props.row.details">
              <el-table-column prop="node" label="node"></el-table-column>
              <el-table-column prop="port" label="port"></el-table-column>
              <el-table-column prop="size" label="size"></el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="tableName"
          label="tableName"
          width="180">
      </el-table-column>
      <el-table-column
          :prop="secondFieldInTableName"
          :label="secondFieldInTableLabel"
          width="180">
      </el-table-column>
      <el-table-column
          prop="prettySize"
          label="size">
      </el-table-column>
      <el-table-column>
        <template slot-scope="row">
          <slot :row="row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        :current-page="currentPage"
        @current-change="updateCurrent"
        layout="prev, pager, next">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "table-node-info",
  props: {
    data: { type: Array },
    withSubTable: { type: Boolean, default: false },
    secondFieldInTableName: { type: String },
    secondFieldInTableLabel: { type: String }
  },
  computed: {
    currentPage() {
      return Number(this.$route.query.currentPage ?? 1)
    }
  },
  methods: {
    updateCurrent(currentPage) {
      this.$router.push({query: {currentPage: currentPage, tab: this.$route.query.tab}})
      this.$emit('updatePage', currentPage)
    }
  }
}
</script>

<style scoped>
  .sub-table-outer {
    margin: auto;
    width: 50%;
  }
</style>
