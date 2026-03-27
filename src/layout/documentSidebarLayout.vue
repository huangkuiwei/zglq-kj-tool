<template>
  <el-container>
    <el-header id="headerPage" style="height:51px;z-index:2000">
      <navbar />
    </el-header>
    <el-container>
      <el-aside  :class="{ collapse: !$store.state.app.isCollapse }" width="280px" style="background-color: white;overflow: visible;">
        <sidebar class="sidebar-container" />
      </el-aside>
      <el-container style="position: relative;">
       <!-- <div class="leftaside" @click="handleLefeMenu">
          <i :class="{'iconfont icon-tubiaojiyaoxiangzuo':isCollapse, 'iconfont icon-tubiaojiyaoxiangyou':!isCollapse}"></i>
        </div> -->
        <el-main>
          <app-main />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
  <!--   <div :class="classObj" class="app-wrapper">
  <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />-->
  <!--  <div class="main-container">
      <sidebar class="sidebar-container" />
      <breadcrumb />
      <app-main />
  </div>-->
  <!--  </div> -->
</template>
<script>
  import {
    Navbar,
    Sidebar,
    AppMain
  } from "./components";
  import {
    mapGetters
  } from 'vuex'
  // import ResizeMixin from "./mixin/ResizeHandler";
  export default {
    name: "documentSidebarLayout", //"documentSidebarLayout",  // by YGP
    components: {
      Navbar,
      Sidebar,
      AppMain,
    },
    computed: {
      ...mapGetters(['isCollapse'])
    },
    methods: {
      handleLefeMenu() {
        this.$store.dispatch('setLeftCollapse');
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  @import "src/styles/newstyle.scss";

  /* .el-container .el-main {
    background: #F2F6FC;
    padding: 0px;
} */
  .app-main[data-v-6beed8bc] {
    height: 100%;
    min-height: calc(100vh - 155px);
    position: relative;
    overflow: hidden;
  }
</style>
