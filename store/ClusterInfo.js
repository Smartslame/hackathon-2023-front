export const state = () => ({
    clusterInfo: []
})

export const getters = {
    clusterInfo: state => state.clusterInfo || []
}

export const actions = {
    async fetchClusterInfo(ctx) {
        this.$axios.$get("/api/info/cluster").then((r) => {
            console.log("res: ", r)
            ctx.commit('setClusterInfo', r)
        }).catch(err => {
            console.error("ERROR: ", err)
        })
    },
    async addNode({dispatch, route}, node) {
        await this.$axios.$post("/api/cmd/add/node", { node: node.nodeName, port: node.nodePort }).then((r) => {
            dispatch("fetchClusterInfo")
        }).catch(err => {
            console.error("ERROR: ", err)
        })
    },
    async rebalance(ctx) {
        await this.$axios.$post("/api/cmd/rebalance").catch(err => {
            console.error("ERROR: ", err)
        })
    },
    async getRebalanceStatus(ctx) {
        return await this.$axios.$get("/api/cmd/rebalance/status")
    }
}

export const mutations = {
    setClusterInfo(state, clusterInfo) {
        state.clusterInfo = clusterInfo;
    }
}
