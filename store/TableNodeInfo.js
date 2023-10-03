export const state = () => ({
    tableNodeInfo: [],
    pks: []
})

export const getters = {
    tableNodeInfo: state => state.tableNodeInfo || [],
    pks: state => state.pks || []
}

export const actions = {
    async fetchTableNodeInfo(ctx, { isCoordinator, currentPage }) {
        if (isCoordinator) {
            await this.$axios.$get("/api/info/table-node-coordinator?page=" + currentPage).then((r) => {
                ctx.commit('setTableNodeInfo', r)
            }).catch(err => {
                console.error(err)
            })
        } else {
            await this.$axios.$get("/api/info/table-node-citus?page=" + currentPage).then((r) => {
                ctx.commit('setTableNodeInfo', r)
            }).catch(err => {
                console.error(err)
            })
        }
    },
    async fetchPk(ctx, tableName) {
        await this.$axios.$get("/api/cmd/pk?tableName=" + tableName).then(r => {
            ctx.commit("setPks", r);
        }).catch(err => {
            console.error(err);
        })
    },
    async distribute(ctx, data) {
        await this.$axios.$post("/api/cmd/distribute", data);
    },
    async makeReference(ctx, tableName) {
        await this.$axios.$post("/api/cmd/make-reference", tableName);
    },
    async undistribute(ctx, tableName) {
        await this.$axios.$post("/api/cmd/undistribute", tableName);
    }
}

export const mutations = {
    setTableNodeInfo(state, tableNodeInfo) {
        state.tableNodeInfo = tableNodeInfo;
    },
    setPks(state, pks) {
        state.pks = pks;
    }
}
