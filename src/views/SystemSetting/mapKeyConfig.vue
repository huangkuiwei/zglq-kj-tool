<template>
  <div>
    <!-- <h4>开源地图配置</h4> -->
    <el-form :model="form" style="width: 700px;margin-top: 20px;" ref="form" label-suffix=":" size="small" label-width="150px">
      <el-form-item v-for="item in form.data" v-if="item.code=='BingKey'" :key="item.code" :label="item.name">
        <div class="flex">
          <el-input v-model="item.keyText"></el-input>
          <!-- <el-link class="help" type="primary" :underline="false">申请方式</el-link> -->
        </div>
        <!-- <a href="https://cnbingmap-new.azurewebsites.net/home"> 申请地址：必应地图开放平台</a> -->
      </el-form-item>

      <el-button type="primary" style="width: 100px;margin-left: 150px;" @click="">{{ $t('base.button.save') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import postApi from '@/api/document/indexApi'
export default {
  name: 'mapConfig',
  data() {
    return {
      form: {
        data: []
      },
      fileList: [], // 上传文件列表
      uploadUrl: '', // 文件上传的URL地址，需要根据实际情况进行配置
    };
  },
  mounted() {
    // this.uploadUrl = this.$api.uploadUrl;
    this.loadData()
  },
  methods: {
    async loadData() {
      let res = await postApi.post('/api/Adminsetup/GetBaseMapkeyData')
      if (res.code == 1) {
        this.form.data = res.data
      }
    },
    uploadFile() {
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
<style scoped>
.help {
  flex-shrink: 0;
  margin-left: 20px;
}
</style>
