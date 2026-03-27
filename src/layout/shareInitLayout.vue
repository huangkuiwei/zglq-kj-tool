<template>
  <el-container style='height:100%;'>
    <el-container>
      <el-main style="background-color:white">
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { AppMain } from "./components";


export default {
  components: {
    AppMain,
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
</style>
