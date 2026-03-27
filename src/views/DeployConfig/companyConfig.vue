<template>
  <div class="app-container">
    <el-divider
      direction="horizontal"
      content-position="left"
    >
      企业信息设置
    </el-divider>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      style="width: 500px;margin-top: 20px;"
      label-suffix=":"
      size="small"
      label-width="150px"
    >
      <el-form-item
        prop="CorpName"
        label="企业名称"
      >
        <el-input v-model="form.CorpName" />
      </el-form-item>
      <el-form-item
        prop="CorpCode"
        label="组织机构代码"
      >
        <el-input v-model="form.CorpCode" />
      </el-form-item>
      <el-form-item
        prop="superintend"
        label="管理员姓名"
      >
        <el-input v-model="form.superintend" />
      </el-form-item>
      <el-form-item
        prop="superintendphone"
        label="管理员手机号"
      >
        <el-input v-model="form.superintendphone" />
      </el-form-item>
      <el-form-item
        prop="verifyFiles"
        label="上传授权文件"
      >
        <el-input v-model="form.verifyFiles">
          <el-button
            slot="append"
            icon="el-icon-plus"
            @click="uploadFile"
          />
          <input
            v-show="false"
            ref="authFile"
            type="file"
            name="authFile"
          >
        </el-input>
      </el-form-item>
      <el-button
        type="primary"
        style="width: 350px;margin-left: 150px;"
        @click="save"
      >
        {{ $t('base.button.create') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import postApi from "@/api/document/indexApi.js";
export default {
  data() {
    return {
      form: {
        CorpId: '',
        CorpName: '',
        CorpCode: '',
        superintend: '',
        superintendphone: '',
        verifyFiles: '',
      },
      token:'',
      fileList: [], // 上传文件列表
      uploadUrl: '', // 文件上传的URL地址，需要根据实际情况进行配置
      rules: {
        CorpName: [
          { required: true, message: '请填写企业名称', trigger: 'blur' }
        ],
        CorpCode: [
          { required: true, message: '请填写组织机构代码', trigger: 'blur' }
        ],
        verifyFiles: [
          { required: true, message: '请上传授权文件', trigger: 'blur' }
        ],  
        superintend: [
          { required: true, message: '请填写管理员姓名', trigger: 'blur' }
        ],
        superintendphone: [
          { required: true, message: '请填写管理员手机号', trigger: 'blur' }
        ]
      },
    };
  },
  created() {
    this.token = localStorage.getItem('adminToken') || ''
    this.querCorp()
  },
  methods: {
    async querCorp() {
      let res = await postApi.post('/api/Adminsetup/GetCorptop', null, process.env.VUE_APP_BASE_API, this.token)
      if (res.code == 1) {
        this.form = res.data
      }
    },
    async save(){
      let res = await postApi.post('/api/Adminsetup/CorpAddEdit', this.$objectToFormData(this.form), process.env.VUE_APP_BASE_API, this.token)
      if (res.code == 1) {
        this.$succss(res.msg)
        // this.menuData = res.data
      }
    },
    uploadFile(){
      this.$refs['authFile'].click()
    },
    beforeUpload(file) {
      // 在文件上传之前进行一些处理，例如检查文件类型和大小等。
      // 返回false可以阻止文件上传。
    },
    handleSuccess(response, file, fileList) {
      // 文件上传成功后的处理逻辑，例如将文件信息添加到fileList中。
    },
  },
};
</script>
