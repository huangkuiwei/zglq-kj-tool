<!--  -->
<template>
    <el-dialog v-dialogDrag title="人员" :close-on-click-modal="false" :modal="true" width="600px" :visible.sync="visible" :before-close="handleClose">
        <el-button type="primary" @click="addItem" size="small" style="margin-bottom: 20px;">{{$t('base.button.create')}}</el-button>
        <el-form ref="addPersonForm" :model="addfrom" label-width="80px">
            <div v-for="(item, index) in  addfrom.fromPerAdd" :key="index" style="display: flex;">
                <el-form-item :label="$t('base.label.phone')" label-width="80px" :rules="{ required: true, message: $t('base.button.inputPhoneNumber'), trigger: 'blur' }" :prop="'fromPerAdd.' + index + '.phone'">
                    <el-input v-model="item.phone" size="small"></el-input>
                </el-form-item>
                <el-form-item :label="$t('base.label.name')" style="margin-left: 15px;" label-width="50px" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }" :prop="'fromPerAdd.' + index + '.userName'">
                    <el-input v-model="item.userName" size="small"></el-input>
                </el-form-item>
                <el-form-item label-width="50px">
                    <el-button @click="() => { addfrom.fromPerAdd.splice(index, 1) }" size="small">{{ $t('base.button.delete') }}</el-button>
                </el-form-item>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" size="small">{{ $t('base.button.confirm') }}</el-button>
            <el-button @click="handleClose" size="small">{{ $t('base.button.cancel') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import postApi from "@/api/document/indexApi.js";

export default {
    name: "companyPersonAdd",
    props: ['visible', 'loadPerson', 'corpId'],
    data() {
        return {
            addfrom: {
                fromPerAdd: []
            },
        };
    },
    watch:{
        visible(val){
            this.addfrom.fromPerAdd = []
            this.addfrom.fromPerAdd.push({ phone: '', userName: '', enterpriseCode: this.corpId })
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:visible', false)
        },
        addItem() {
            this.addfrom.fromPerAdd.push({ phone: '', userName: '', enterpriseCode: this.corpId })
        },
        sure() {
            this.$refs['addPersonForm'].validate(async (valid) => {
                if (valid) {
                    var res = await postApi.post("/api/WebAccount/CorpUsersAdd", this.addfrom.fromPerAdd);
                    if (res.code === 1) {
                        this.$success(res.msg);
                        this.handleClose()
                        this.$emit('loadPerson')
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
    }
}

</script>
<style></style>
