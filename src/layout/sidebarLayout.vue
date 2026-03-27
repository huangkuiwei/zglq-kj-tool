<!-- // 项目首页  -->
<template>
  <el-container>
    <el-header id="headerPage" style="height:51px; z-index:2000">
      <navbar />
    </el-header>
    <el-container>
      <sidebar class="sidebar-container" page="project"/>
      <div style="position: relative;flex-grow: 1;" :style="{ width: isCollapse?'calc(100vw - 280px)':'calc(100vw - 60px' }">
        <app-main />
      </div>
    </el-container>
  </el-container>
</template>
<script>
import {
  Navbar,
  Sidebar,
  AppMain
} from "./components";
import { mapGetters } from 'vuex'
export default {
  name: "projectSidebarLayout",
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
    },
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
