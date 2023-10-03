<template>
  <div>
    <div class="cluster-table-buttons">
      <el-button type="success" @click="addNode">Add node</el-button>
      <div class="rebalance-data-outer">
        <el-button type="primary" @click="rebalance">Rebalance</el-button>
        <div class="rebalance-status" v-show="rebalanceStatus !== 'finished'">{{ rebalanceStatus }}</div>
      </div>
    </div>
    <div class="cluster-table-outer">
      <el-table
          :data="clusterInfo"
          class="cluster-table"
          tooltip-effect="dark"
          :row-class-name="tableRowClassName">
        <el-table-column
            prop="nodeName"
            label="Host">
        </el-table-column>
        <el-table-column
            prop="nodePort"
            label="Port">
        </el-table-column>
        <el-table-column
            prop="active"
            label="Status">
          <template slot-scope="scope">
            <div v-if=scope.row.active>online</div>
            <div v-else>offline</div>
          </template>
        </el-table-column>
        <el-table-column
            prop="coordinator"
            label="Type">
          <template slot-scope="scope">
            <div v-if=scope.row.coordinator class="coordinator-type">coordinator</div>
            <div v-else>worker</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        title="Create node"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <div class="add-node-dialog">
        <div class="dialog-add-node-button">
          <div>Host node:</div>
          <input v-model="host"/>
        </div>
        <div class="dialog-add-node-button">
          <div>Port node:</div>
          <input v-model="port">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="createNewNode">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: "cluster",
  async fetch({ store }) {
    await store.dispatch('ClusterInfo/fetchClusterInfo')
  },
  computed: {
    clusterInfo() {
      return this.$store.getters["ClusterInfo/clusterInfo"]
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.active) {
        return 'success-row';
      }

      return 'failed-row';
    },
    addNode() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    createNewNode() {
      this.$store.dispatch("ClusterInfo/addNode", { nodeName: this.host, nodePort: this.port })
      this.dialogVisible = false
    },
    async rebalance() {
      await this.$store.dispatch("ClusterInfo/rebalance")
      this.rebalanceStatus = await this.$store.dispatch("ClusterInfo/getRebalanceStatus")
      while (this.rebalanceStatus !== "finished") {
        await timeout(5000)
        this.rebalanceStatus = await this.$store.dispatch("ClusterInfo/getRebalanceStatus")
      }
    }
  },
  data() {
    return {
      host: "",
      port: "",
      dialogVisible: false,
      rebalanceStatus: "finished"
    }
  }
}
</script>

<style>
  .cluster-table-outer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cluster-table {
    display: flex;
    flex-direction: column;
    width: 50%;
  }

  .coordinator-type {
    font-weight: bold;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .failed-row {
    background: #ffb3b3;
  }

  .cluster-table-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 2em;
  }

  .dialog-add-node-button {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 2em;
    width: 50%;
  }

  .add-node-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .rebalance-status {
    margin-left: 2em;
    margin-bottom: auto;
    margin-top: auto;
  }

  .rebalance-data-outer {
    display: flex;
    flex-direction: row;
    margin-left: 2em;
  }
</style>
