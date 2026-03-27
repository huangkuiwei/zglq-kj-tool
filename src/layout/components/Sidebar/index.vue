<!-- // 首页左边菜单及“项目空间”列面板 -->
<template>
  <el-container>
    <mainSideMenu />
    <el-aside class="isTransition" :width="isCollapse ? '220px' : '0'" style="height: 100%;overflow-x: hidden;">
      <el-scrollbar wrap-class="scrollbar-wrapper custom-scrollbar" style="height: calc(100vh - 103px); background-color: #f5f7fa;overflow-x: hidden;">
        <div v-if="page == 'project'" @click="myDocumentKind = -1">
          <div class="sidebarTitle">{{ $t('projects.menu.space') }}</div>
          <el-menu class="project-menu" :show-timeout="200" :default-active="this.$route.path" style="background-color: #F5F7FA">
            <sidebar-item v-for="route in projectRouteMap" :key="route.path" :item="route" :base-path="route.path" :style="!$isnotInDingTalk() && (route.path == '/companyManagement' || route.path == '/personalManagement') ? 'display:none' : 'display:block'" />
          </el-menu>
        </div>
        <div v-if="page == 'resource'" @click="myDocumentKind = -1">
          <div class="sidebarTitle">{{ $t('leftNavs.resource') }}</div>
          <el-menu :show-timeout="200" :default-active="this.$route.path" style="background-color: #F5F7FA">
            <sidebar-item v-for="route in knowledgeBaseLayoutRouteMap" :key="route.path" :item="route" :base-path="route.path" :style="!$isnotInDingTalk() && (route.path == '/companyManagement' || route.path == '/personalManagement') ? 'display:none' : 'display:block'" />
          </el-menu>
        </div>
        <!-- <el-row style="border: 1px solid rgb(220, 223, 230); position: absolute; bottom: 60px; width: 100%;  height:0px"></el-row> -->

      </el-scrollbar>
      <div class="asideLogo flex ai-center jc-center" v-if="$sideBarLogo">
          <img :src="$sideBarLogo" />
        </div>
    </el-aside>

    <el-container v-if="myDocumentKind == 0">
      <myCollection class="myCollection" style="width: 100%" />
    </el-container>
    <el-container v-if="myDocumentKind == 1">
      <myShare class="myShare" style="width: 100%" />
    </el-container>
  </el-container>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import SidebarItem from './SidebarItem'
import documentApi from '@/api/document/indexApi.js'
import myCollection from '@/views/project/Document/myCollection/index.vue'
import myShare from '@/views/project/Document/myShare/index.vue'
import i18n from '../../../../static/locales'

export default {
  name: 'sidebar',
  components: {
    myShare, myCollection,
    SidebarItem,
  },
  watch: {
    'queryResourceTree'(val) {
      if (val == 'refresh') {
        this.queryResourceTreeData()
      }
    },
  },
  computed: {
    ...mapGetters(['sidebar', 'routerMap', 'clientHeight', 'isCollapse', 'user', 'queryResourceTree']),
    activeTab: {
      get() {
        return this.$store.getters.activeTab
      },
      set() { }
    },
    routes() {
      return this.$router.options.routes
    },
    /* isCollapse () {
       return !this.sidebar.opened
     }*/
  },
  props: {
    page: {
      type: String,
      default: ''
    },
    isDocument: {
      type: Boolean,
      default: false
    },
    isSystemManagement: {
      type: Boolean,
      default: false
    },
    isADD: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectRouteMap: [],
      systemManagementRouteMap: [],
      knowledgeBaseLayoutRouteMap: [],
      // activeTab: ''
      myDocumentKind: -1,
      currentIuid: null,
    }
  },
  mounted() {
    this.initMenu()
  },

  methods: {
    handleSelect(index) {
      this.myDocumentKind = index
    },

    async initMenu() {
      this.routerMap.forEach(data => {
        let item = JSON.parse(JSON.stringify(data))
        if (item.component && item.component && item.component.name == "projectSidebarLayout") {
          this.projectRouteMap.push(item)
        } else if (item.component && item.component.name == "systemManagementSidebarLayout") {
          this.systemManagementRouteMap.push(item)
        } else if (item.component && item.component.name == "knowledgeBaseLayout") {
          if (this.user.iscorpadmin == true) {
            this.knowledgeBaseLayoutRouteMap.push(item)
          } else if (this.user.iscorpadmin == false && item.path != '/approve') {
            this.knowledgeBaseLayoutRouteMap.push(item)
          }
        }
      });

      //查询公共构件库下拉数据
      if (this.page == 'resource') {
        this.queryResourceTreeData()
      }

      if (this.knowledgeBaseLayoutRouteMap.find(item => item.path.includes(this.$route.path))) {
        this.$store.commit('SET_ACTIVE_TAB', 'resource')
      }
      if (this.projectRouteMap.find(item => item.path.includes(this.$route.path))) {
        this.$store.commit('SET_ACTIVE_TAB', 'projects')
      }
    },
    async queryResourceTreeData() {
      var res = await documentApi.get("/api/publiclibrary/GetpubliclibraryData", {});
      this.$store.state.app.queryResourceTree = 'finish'
      if (res.code == 1) {
        this.knowledgeBaseLayoutRouteMap[0].children = res.data[0].child.map(item => {
          return {
            data: item,
            meta: { title: item.itemText, icon: '' },
            path: item.iuid
          }
        })
      }
    },
    handleLefeMenu() {
      this.$store.dispatch("setLeftCollapse");
    },
    activeItem(item) {
      if (item == this.$store.state.app.activeTab) return true;
      return false;
    },
  }
}
</script>
<style lang="scss">
.sidebarTitle {
  margin-top: 15px;
  height: 30px;
  line-height: 30px;
  padding-left: 35px;
  font-size: 18px;
  color: #333333;
  font-weight: bold;
}

.myShareBox1 {
  font-size: 14px;
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgb(220, 223, 230);

  .el-menu {
    background: transparent !important;
  }
}


.menu-tabs {
  user-select: none;

  .el-tabs__nav-wrap {
    &:after {
      display: none;
    }
  }

  .el-tabs__nav-scroll {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .el-tabs__nav {
      width: 100%;
      display: flex;
      align-items: center;

      .el-tabs__item {
        width: 100%;
        height: 60px;
        padding-top: 10px;
        padding-left: 35px;
        text-align: left;
        background: #F5F7FA;
        font-family: 'Microsoft YaHei';
        letter-spacing: .1em;
        font-size: 15px;
        border-bottom: 1px solid #d6dae3;
        font-weight: 400;

        &.is-active {
          color: black;
          background: #f5f7fa;
          //border-top: 2px solid #409EFF;
        }
      }

      .el-tabs__active-bar {
        display: none;
      }
    }
  }

  .el-menu {
    background-color: #f5f7fa !important;
  }

  .menu-wrapper {
    background: #f5f7fa;
    margin: 0;
  }
}

.myCollection, .myShare {
  position: fixed;
  bottom: 0;
  top: 52px;
  left: 280px;
  right: 0;
  width: auto !important;
  height: auto !important;
  z-index: 999;
}

.custom-scrollbar {
  .el-scrollbar__view {
    height: 98%;

    > div {
      height: 100%;
      display: flex;
      flex-direction: column;

      > .sidebarTitle {
        flex-shrink: 0;
      }

      .project-menu {
        &.el-menu {
          flex-grow: 1;
          display: flex;
          flex-direction: column;

          > .menu-wrapper {
            &:nth-child(5) {
              flex-grow: 1;
            }

            &:nth-child(6) {
              border-top: 1px solid #cccccc;
              margin: 0 !important;
            }

            &:nth-child(7), &:nth-child(8) {
              margin: 0 !important;
            }
          }
        }
      }
    }
  }
}
</style>
