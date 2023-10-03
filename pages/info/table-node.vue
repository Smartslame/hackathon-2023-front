<template>
  <div>
    <el-tabs @input="clickTab" :value="$route.query.tab">
      <el-tab-pane label="Distributed" name="coordinator">
        <table-node-info @updatePage="updatePage" :data="tableNodeInfo" :with-sub-table="true" secondFieldInTableName="type" secondFieldInTableLabel="type">
          <template slot-scope="row">
            <el-button type="primary" @click="undistribute(row)">undistribute</el-button>
          </template>
        </table-node-info>
      </el-tab-pane>
      <el-tab-pane label="Non distributed" name="workers">
        <table-node-info @updatePage="updatePage" :data="tableNodeInfo" secondFieldInTableName="nodeName" secondFieldInTableLabel="host">
          <template slot-scope="row">
            <el-button type="success" @click="distribute(row)">distribute</el-button>
            <el-button type="primary" @click="makeReference(row)">make reference</el-button>
          </template>
        </table-node-info>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
        title="Distribute"
        :visible.sync="distributeDialogVisible"
        width="30%"
        :before-close="handleClose">
      <el-select v-model="fieldName" placeholder="Field name">
        <el-option
            v-for="item in fieldNames"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="distributeTable">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableNodeInfo from "@/components/table-node-info";

export default {
  name: "table-node",
  components: {
    TableNodeInfo
  },
  async fetch({ store, route }) {
    await store.dispatch('TableNodeInfo/fetchTableNodeInfo', { isCoordinator: route.query.tab === "workers", currentPage: Number(route.query.currentPage ?? 1) })
  },
  computed: {
    tableNodeInfo() {
      return this.$store.getters["TableNodeInfo/tableNodeInfo"]
    },
    currentPage() {
      return Number(this.$route.query.currentPage ?? 1)
    },
    isCoordinator() {
      return this.$route.query.tab === "workers";
    },
    fieldNames() {
      return this.$store.getters["TableNodeInfo/pks"];
    },
  },
  methods: {
    async makeReference({ row }) {
      await this.$store.dispatch("TableNodeInfo/makeReference", {value: row.row.tableName});
      await this.$store.dispatch("TableNodeInfo/fetchTableNodeInfo", { isCoordinator: this.isCoordinator, currentPage: this.$route.query.currentPage })
    },
    async undistribute({ row }) {
      await this.$store.dispatch("TableNodeInfo/undistribute", {value: row.row.tableName})
      await this.$store.dispatch("TableNodeInfo/fetchTableNodeInfo", { isCoordinator: this.isCoordinator, currentPage: this.$route.query.currentPage })

    },
    async distributeTable() {
      await this.$store.dispatch("TableNodeInfo/distribute", { tableName: this.tableName, distrColumn: this.fieldName})
      this.distributeDialogVisible = false;
      await this.$store.dispatch("TableNodeInfo/fetchTableNodeInfo", { isCoordinator: this.isCoordinator, currentPage: this.$route.query.currentPage })
    },
    updatePage(page) {
      this.$store.dispatch("TableNodeInfo/fetchTableNodeInfo", { isCoordinator: this.isCoordinator, currentPage: page })
    },
    handleClose() {
      this.distributeDialogVisible = false;
    },
    async clickTab(newValue) {
      if (newValue === this.$route.query.tab) {
        return
      }
      if (newValue === "0") {
        newValue = "coordinator"
      }
      await this.$router.push({query: {tab: newValue, currentPage: this.$route.query.currentPage}})
      await this.$store.dispatch("TableNodeInfo/fetchTableNodeInfo", { isCoordinator: newValue === "workers", currentPage: this.currentPage });
    },
    async distribute({ row }) {
      await this.$store.dispatch("TableNodeInfo/fetchPk", row.row.tableName);
      this.tableName = row.row.tableName
      this.distributeDialogVisible = true
    }
  },
  data() {
    return {
      activeName: "coordinator",
      distributeDialogVisible: false,
      fieldName: "",
      tableName: "",
    }
  },
}
</script>

<style scoped>

</style>
