<template>
  <div>
    <div class="menu-outer-class">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/info/table-node">Table node info</el-menu-item>
        <el-menu-item index="/info/cluster-nodes">Cluster nodes info</el-menu-item>
      </el-menu>
    </div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  name: "default",
  data() {
    return {
    };
  },
  computed: {
    activeIndex() {
      return this.$route.path
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key);
    }
  }
}
</script>

<style scoped>
  .menu-outer-class {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 2em;
  }
</style>
