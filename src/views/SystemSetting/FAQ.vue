<!--  -->
<template>
    <div>
        <div style="margin: 0 0 15px 0;">
            <el-button type="primary" size="small" @click="addFAQ" icon="el-icon-plus">{{$t('base.button.create')}}</el-button>
            <!-- <el-button type="danger" size="small" @click="deleteRows" icon="el-icon-delete">{{ $t('base.button.delete') }}</el-button> -->
        </div>
        <el-table :data="tableData" class="t-table" height="calc(100vh - 180px)" :header-cell-style="$thStyle" style="width: 100%; margin-top: 20px; font-size: 13px" stripe @selection-change="handleSelectionChange">
            <el-table-column type="index" align="center" :label="$t('base.button.index')" width="60"></el-table-column>
            <el-table-column prop="title" label="常见问题" align="center"></el-table-column>
            <el-table-column prop="contenttext" label="问题解答" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="default" @click="viewDetail(scope.row)">{{ $t('base.button.view') }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('base.button.createTime')" align="center"></el-table-column>
            <!-- <el-table-column :label="$t('base.button.topUp')" width="180">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.puttop" :active-value="true" :inactive-value="false" @change="editTop(...arguments, scope.row)"></el-switch>
                </template>
            </el-table-column> -->
            <el-table-column :label="$t('base.formLabel.operation')" width="180">
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row)">{{ $t('base.button.edit') }}</el-button>
                    <el-button type="text" style="color: #f56c6c;" @click="deleteRow(scope.row)">{{ $t('base.button.delete') }}</el-button>
                </template>
            </el-table-column>

        </el-table>
        <pagination :pageTotal="Total" :pageIndex="page" :pageSize="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>

        <!-- 查看 -->
        <el-dialog title="问题详情" :visible.sync="detailVisible" width="800px">
            <div style="text-align: center;font-size: 18px;font-weight: 500;margin-bottom: 15px;">{{ current.title }}</div>
            <div style="text-align: right;font-size: 14px;color: #999;margin-right: 20px;margin-bottom: 20px;">{{ current.createTime }}</div>
            <div class="ql-editor" v-html="current.contenttext"></div>
        </el-dialog>

        <!-- 新增编辑 -->
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" width="1000px" @close="resetForm">
            <el-form ref="form" :model="form" :rules="rules" class="editorForm">
                <el-form-item label="常见问题" prop="title" size="normal">
                    <el-input v-model="form.title" placeholder="请输入常见问题" size="normal" clearable></el-input>
                </el-form-item>
                <el-form-item label="问题解答" prop="contenttext" size="normal">
                    <div class="clear"></div>
                    <my-editor :content.sync="form.contenttext"></my-editor>
                </el-form-item>

            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="dialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
                <el-button size="mini" type="primary" @click="submit">{{ $t('base.button.submit') }}</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import myEditor from '@/components/editor'
import articleApi from '@/api/article'
// quill富文本
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import pagination from "@/components/pagination/index";

export default {
    name: "",
    data() {
        return {
            Total: 0,
            page: 1,
            rows: 15,
            dialogVisible: false,
            dialogTitle: '新增常见问题',
            form: {
                title: '',
                contenttext: '',
                puttop: false
            },
            rules: {
                title: [{ required: true, message: '请输入问题', trigger: 'blur' }],
                contenttext: [{ required: true, message: '请输入解答', trigger: 'change' }]
            },
            tableData: [],
            detailVisible: false,
            current: {}
        };
    },
    components: {
        myEditor,
        pagination
    },
    created() {
        this.getFAQList()
    },
    watch:{
        dialogVisible(val) {
            if (!val) {
                this.form = {
                    title: '',
                    contenttext: '',
                    puttop: false
                }
            }
        }
    },
    methods: {
        paginationCurrentChange(val) {
            this.page = val;
            this.getFAQList();
        },
        handleSizeChange(val) {
            this.rows = val;
            this.getFAQList();
        },
        async getFAQList() {
            let formdata = new FormData();
            formdata.append('page', this.page)
            formdata.append('rows', this.rows)
            let res = await articleApi.FAQList(formdata)
            if (res.code == 1) {
                this.Total = res.count
                this.tableData = res.data
            }
        },
        addFAQ() {
            this.dialogTitle = '新增问题'
            this.dialogVisible = true
        },
        viewDetail(row) {
            this.current = row;
            this.$nextTick(r => {
                this.detailVisible = true
            })
        },
        handleSelectionChange() { },
        async editTop(e, row) {
            let formdata = new FormData()
            formdata.append('IUID', row.iuid)
            formdata.append('puttop', e)
            let res = await articleApi.FAQAddOrUpdate(formdata)
            if (res.code == 1) {
                // this.getFAQList()
                this.$success(res.msg)
            }
        },
        edit(row) {
            this.dialogTitle = '修改问题'
            this.form = JSON.parse(JSON.stringify(row))
            this.dialogVisible = true
        },
        deleteRow(row) {
            this.$confirm('确定删除本条数据？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                let formdata = new FormData()
                formdata.append('IUID', row.iuid)
                let res = await articleApi.FAQDelete(formdata)
                if (res.code == 1) {
                    this.$success(res.msg)
                    this.getFAQList()
                }
            })
        },
        deleteRows() { },
        submit() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    let formdata = new FormData();
                    if (this.dialogTitle == '修改问题') {
                        formdata.append('IUID', this.form.iuid)
                    }
                    formdata.append('title', this.form.title)
                    formdata.append('contenttext', this.form.contenttext)
                    formdata.append('puttop', this.form.puttop)
                    let res = await articleApi.FAQAddOrUpdate(formdata)
                    if (res.code == 1) {
                        this.dialogVisible = false;
                        this.$success(res.msg)
                        this.getFAQList()
                    }
                }
            })
        },
        resetForm() {
            this.form = {}
            this.$refs.form.resetFields();
        }
    }
}

</script>
<style lang="scss" scoped>
.editorForm {
    ::v-deep .el-form-item__content {
        line-height: 24px !important;
    }
}
</style>
