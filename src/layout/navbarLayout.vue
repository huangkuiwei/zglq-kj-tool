<template>
  <el-container style='height:100%;'>
    <el-header id="headerPage" style="height:51px;z-index:1500">
      <navbar />
    </el-header>
    <el-container>
      <el-main>
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Navbar, AppMain } from "./components";
export default {
  name: "navbarLayout",
  components: {
    Navbar,
    AppMain,
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/newstyle.scss";
</style>
