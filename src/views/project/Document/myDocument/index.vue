<template>
  <el-container style='height:100%;background-color: #fff'>
    <file-list></file-list>
  </el-container>
</template>

<script>
import fileList from '../../project/file/'

export default {
  components: { fileList },
  async mounted() {
    console.log(this.$route);
    // this.$router.push({ path: '/projectFile', query: { projectName: '文档资料' } })
  }
}
</script>
