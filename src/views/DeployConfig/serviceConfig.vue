<template>
  <div class="app-container">
    <el-divider direction='horizontal' content-position="left">服务配置</el-divider>
    <el-form :model="form" :rules="rules" style="width: 500px;margin-top: 20px;" ref="form" label-suffix=":" size="small" label-width="180px">
      <el-form-item prop="companyName" label="转码服务地址">
        <el-input v-model="form.companyName"></el-input>
      </el-form-item>
      <el-form-item prop="corpCode" label="转码服务地址配置">
        <el-input v-model="form.corpCode"></el-input>
      </el-form-item>
      <el-divider direction='horizontal'></el-divider>
      <el-form-item prop="companyName" label="模型对比服务地址">
        <el-input v-model="form.companyName"></el-input>
      </el-form-item>
      <el-form-item prop="corpCode" label="模型对比服务地址配置">
        <el-input v-model="form.corpCode"></el-input>
      </el-form-item>
      <el-divider direction='horizontal'></el-divider>
      <el-form-item prop="companyName" label="模型导出服务地址">
        <el-input v-model="form.companyName"></el-input>
      </el-form-item>
      <el-form-item prop="corpCode" label="模型导出服务地址配置">
        <el-input v-model="form.corpCode"></el-input>
      </el-form-item>
      <el-divider direction='horizontal'></el-divider>
      <el-button type="primary" style="width: 250px;margin-left: 180px;" @click="">{{ $t('base.button.save') }}</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        companyName: '',
        corpCode: '',
        adminName: '',
        adminPhone: '',
        authFile: '',
      },
      rules: {
        companyName: [
          { required: true, message: '请填写企业名称', trigger: 'blur' }
        ],
        corpCode: [
          { required: true, message: '请填写组织机构代码', trigger: 'blur' }
        ],
        authFile: [
          { required: true, message: '请上传授权文件', trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    uploadFile() {
      this.$refs['authFile'].click()
    },
  },
};
</script>
