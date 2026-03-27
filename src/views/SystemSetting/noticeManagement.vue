<!--  -->

<template>
  <div>
    <el-button type="primary" size="small" @click="addNotice" icon="el-icon-plus">{{ $t('base.button.create') }}</el-button>
    <el-table v-if="show" :data="tableData" class="t-table" height="calc(100vh - 180px)" :header-cell-style="$thStyle" style="width: 100%; margin-top: 20px; font-size: 13px" stripe>
      <el-table-column type="index" :label="$t('base.button.index')" align="center" width="60"></el-table-column>
      <el-table-column prop="title" :label="$t('base.button.noticeTile')" align="center"></el-table-column>
      <el-table-column prop="contenttext" :label="$t('base.button.noticeContent')" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="default" @click="viewDetail(scope.row)">{{ $t('base.button.view') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('base.button.createTime')" align="center"></el-table-column>
      <el-table-column :label="$t('base.button.topUp')" width="180">

        <template slot-scope="scope">
          <el-switch v-model="scope.row.puttop" :active-value="true" :inactive-value="false" @change="editTop(...arguments, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('base.formLabel.operation')" width="180">

        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">{{ $t('base.button.edit') }}</el-button>
          <el-button type="text" style="color: #f56c6c;" @click="deleteRow(scope.row)">{{ $t('base.button.delete') }}</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination :pageTotal="Total" :pageIndex="page" :pageSize="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>

    <!-- 查看 -->
    <el-dialog title="公告详情" :visible.sync="detailVisible" width="800px">
      <el-skeleton v-if="loading" :rows="6" animated />
      <div v-else>
        <div style="text-align: center;font-size: 18px;font-weight: 500;margin-bottom: 15px;">{{ current.title }}</div>
        <div style="text-align: right;font-size: 14px;color: #999;margin-right: 20px;margin-bottom: 20px;">{{ current.createTime }}</div>
        <div class="ql-editor" v-if="!current.isIframe" v-html="current.contenttext"></div>
        <iframe v-else style="width: 100%;height: 450px;" :src="current.contenttext" frameborder="0"></iframe>
      </div>
    </el-dialog>
    <!-- 新增编辑 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="1000px" @close="resetForm">
      <el-skeleton v-if="loading" :rows="6" animated />
      <el-form v-else ref="form" :model="form" :rules="rules" class="editorForm">
        <el-form-item :placeholder="$t('base.button.noticeTile')" prop="title" size="normal">
          <el-input v-model="form.title" :placeholder="$t('base.button.inputNoticeTitle')" size="normal" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('base.button.usingExternalLinks')" size="normal">
          <el-checkbox v-model="form.isIframe"></el-checkbox>
        </el-form-item>

        <template v-if="form.isIframe">
          <el-form-item :label="$t('base.button.externalLinksAddress')" prop="contenttext" size="normal">
            <el-input v-model="form.contenttext" :placeholder="$t('base.button.inputExternalLinksAddress')" size="normal" clearable></el-input>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item class="editor-item" :label="$t('base.button.noticeContent')" prop="contenttext" size="normal">
            <div class="clear"></div>
            <my-editor :content.sync="form.contenttext"></my-editor>
          </el-form-item>
        </template>
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
import i18n from '../../../static/locales'

export default {
  name: "",
  data() {
    return {
      Total: 0,
      page: 1,
      rows: 15,
      show: true,
      dialogVisible: false,
      dialogTitle: i18n.t('base.button.addNotice'),
      loading: false,
      form: {
        title: '',
        contenttext: '',
        puttop: false,
        isIframe: false,
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        contenttext: [{ required: true, message: '请输入内容', trigger: 'change' }]
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
    this.getNoticeList()
  },
  methods: {
    paginationCurrentChange(val) {
      this.page = val;
      this.getNoticeList();
    },
    handleSizeChange(val) {
      this.rows = val;
      this.getNoticeList();
    },
    async getNoticeList() {
      let formdata = new FormData();
      formdata.append('page', this.page)
      formdata.append('rows', this.rows)
      let res = await articleApi.noticeList(formdata)
      if (res.code == 1) {
        this.Total = res.count
        this.tableData = res.data
      }
    },
    addNotice() {
      this.dialogTitle = this.$t('base.button.addNotice')
      this.dialogVisible = true
    },
    async viewDetail(row) {
      this.current = {}
      this.loading = true
      this.detailVisible = true
      let data = {
        IUID: row.iuid
      }
      let res = await articleApi.noticeDetail(this.$objectToFormData(data))
      this.loading = false
      if (res.code == 1) {
        this.current = res.data
        this.current.createTime = this.current.createTime.replace('T',' ').split('.')[0]
      }
    },
    async editTop(e, row) {
      this.show = false
      let formdata = new FormData()
      formdata.append('IUID', row.iuid)
      formdata.append('puttop', e)
      let res = await articleApi.noticeAddOrUpdate(formdata)
      if (res.code == 1) {
        this.show = true
        this.getNoticeList()
        this.$forceUpdate()
        this.$success(res.msg)
      }
    },
    clearContext() {
      this.form.contenttext = ''
    },
    async edit(row) {
      this.loading = true
      this.dialogVisible = true
      this.dialogTitle = this.$t('base.button.editNotice')
      // this.form = JSON.parse(JSON.stringify(row))
      let data = {
        IUID: row.iuid
      }
      let res = await articleApi.noticeDetail(this.$objectToFormData(data))
      this.loading = false
      if (res.code == 1) {
        this.form = res.data
      }
    },
    deleteRow(row) {
      this.$confirm('确定删除本条数据？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        let formdata = new FormData()
        formdata.append('IUID', row.iuid)
        let res = await articleApi.noticeDelete(formdata)
        if (res.code == 1) {
          this.$success(res.msg)
          this.getNoticeList()
        }
      })
    },
    submit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let formdata = new FormData();
          if (this.dialogTitle == this.$t('base.button.editNotice')) {
            formdata.append('IUID', this.form.iuid)
          }
          formdata.append('title', this.form.title)
          formdata.append('contenttext', this.form.contenttext)
          formdata.append('puttop', this.form.puttop)
          formdata.append('isIframe', this.form.isIframe)
          let res = await articleApi.noticeAddOrUpdate(formdata)
          if (res.code == 1) {
            this.dialogVisible = false;
            this.$success(res.msg)
            this.getNoticeList()
          }
        }
      })
    },
    resetForm(formName) {
      this.form = {
        title: '',
        contenttext: '',
        puttop: false,
        isIframe: false,
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.editorForm {
  .editor-item {
    ::v-deep .el-form-item__content {
      line-height: 24px !important;
    }
  }
}
</style>
