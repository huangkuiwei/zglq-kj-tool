<template>
  <el-container>
    <el-header id="headerPage" style="height:51px;z-index:2000;line-height:39px;background-color:white;">
      <div style="float: left; padding-left: 32px">
        <div style="display: flex; float: left;" class="ksjLogo">
          <img v-show="!$isOwner" :src="$headerLogo" style="height: 40px; margin: 5px 0 5px 10px;" />
        </div>
      </div>
    </el-header>
    <el-container style="position:static">
      <el-container style="position: relative;">
        <el-main style="background-color:white;">
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
import { Navbar, Sidebar, AppMain } from "./components";
import { mapGetters } from 'vuex'

// import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "shareSidebarLayout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  computed: {
    ...mapGetters(['isCollapse'])
  },
  methods:{
    handleLefeMenu(){
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
  min-height: calc(100vh - 155px);
  position: relative;
  overflow: hidden;
}
</style>
