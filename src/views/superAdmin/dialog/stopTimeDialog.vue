<!-- 到期时间 -->
<template>
    <el-dialog v-dialogDrag title="修改到期时间" width="400px" :visible.sync="dialogVisible"
        @close="$emit('update:timeDialogVisible', false)">
        <el-form ref="addPersonForm" :model="addfrom" :rules="rules" label-width="80px" label-position="left">
            <el-form-item label="到期时间" label-width="80px" prop="serviceStopTime">
                <el-date-picker type="datetime" v-model="addfrom.serviceStopTime" format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="options" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="timeSure" size="small">{{ $t('base.button.confirm') }}</el-button>
            <el-button @click="$emit('update:timeDialogVisible', false)" size="small">{{ $t('base.button.cancel') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import postApi from "@/api/document/indexApi.js";

export default {
    name: "stopTimeDialog",
    props: {
        timeDialogVisible: {
            type: Boolean,
            default: false
        },
        rowData: {
            type: Object,
        },
        queryData: {
            type: Function,
        }
    },
    data() {
        return {
            addfrom: {
                serviceStopTime: ''
            },
            options: {
                disabledDate: null
            },
            rules: {
                serviceStopTime: [
                    { required: true, message: '请选择到期时间', trigger: 'blur' }
                ]
            },
            dialogVisible: false
        }
    },
    watch: {
        'timeDialogVisible'(val) {
            if (!val) {
                this.$refs['addPersonForm'].clearValidate()
            }
            this.dialogVisible = val;
        },
        'rowData.serviceStopTime'() {
            this.addfrom.serviceStopTime = JSON.parse(JSON.stringify(this.rowData.serviceStopTime))
        },
        'rowData.createTime'() {
            this.options.disabledDate = (time) => {
                return time.getTime() < new Date(this.rowData.createTime).getTime()
            }
        }

    },
    methods: {
        async timeSure() {
            this.$refs['addPersonForm'].validate(async valid => {
                if (valid) {
                    var forData = new FormData()
                    forData.append('OrderId', this.rowData.orderId)
                    forData.append('ServiceStopTime', this.addfrom.serviceStopTime)
                    var res = await postApi.post("/api/WebAccount/GetCorpuserDataEdit", forData);
                    if (res.code === 1) {
                        this.$success(res.msg);
                        this.$emit('update:timeDialogVisible', false)
                        this.$emit('queryData')
                    }
                }
            })
        },
    }
}

</script>
<style></style>
