<!--  -->
<template>
    <el-dialog append-to-body title="新人员申请" :visible.sync="showApply" width="800px" @close="close" top="10vh">
        <el-table :header-cell-style="$thStyle" :data="applyData" stripe>
            <el-table-column type="index" :label="$t('base.button.index')" width="80" />
            <el-table-column prop="phone" :label="$t('base.label.phone')" />
            <el-table-column prop="userName" :label="$t('base.label.name')" />
            <el-table-column label="申请时间">
                <template slot-scope="scope">
                    {{ $dayjs(scope.row.createTime, "YYYY-MM-DD HH:mm:ss") }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('base.formLabel.operation')">
                <template slot-scope="scope">
                    <template v-if="scope.row.operateStatus == 2">
                        <el-link type="danger" style="margin-right: 10px" @click="handleRejectApply(scope.row)">拒绝</el-link>
                        <el-link type="primary" @click="handleApproveApply(scope.row)">通过</el-link>
                    </template>
                    <el-tag type="success" size="small" v-if="scope.row.operateStatus == 1">已通过</el-tag>
                    <el-tag type="danger" size="small" v-if="scope.row.operateStatus == 0">已拒绝</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer">
            <el-button @click="showApply = false">{{ $t('base.button.close') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import postApi from "@/api/document/indexApi.js";
export default {
    name: "personApply",
    props: {
        showApply: {
            type: Boolean,
            default: false
        },
        applyData: {
            type: Array,
            default: false

        },
        loadCompanyApplyPerson: {
            type: Function
        }
    },
    methods: {
        close(){
            this.$emit('update:showApply',false)
        },
        handleRejectApply(row) {
            this.$confirm("确认要拒绝此申请吗?").then(async () => {
                var res = await postApi.post("/api/WebCompanyApply/RejectApply", {
                    UserApplyHistoryId: row.iuid,
                });
                if (res.code === 1) {
                    this.$emit('loadCompanyApplyPerson');
                }
            });
        },
        async handleApproveApply(row) {
            this.$confirm("确认要同意此申请吗?").then(async () => {
                var res = await postApi.post("/api/WebCompanyApply/AccessApply", {
                    UserApplyHistoryId: row.iuid,
                });
                if (res.code === 1) {
                    this.$emit('loadCompanyApplyPerson');
                }
            });
        },
    }

}

</script>
<style></style>
