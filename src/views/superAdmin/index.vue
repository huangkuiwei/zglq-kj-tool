<template>
  <el-container style="position: static;height: calc(100vh - 51px);">
    <!-- <mainSideMenu /> -->
    <el-aside class="isTransition" :width="$store.state.app.isCollapse ? '220px' : '0'">
      <el-menu :default-active="menuDefaultActive" class="leftMenu" router>
        <div class="userCenterSidebarTitle">{{ $t('leftNavs.platform') }}</div>
        <template v-for="(item, listIndex) in sidebarMenuList">
          <el-menu-item v-if="!item.hasChild" :index="item.path" style="margin: 10px 0px; padding-left: 29px"
            :class="{ 'is-active': item.title == $route.meta.title }">
            <div style="position: relative">
              <img style="width: 20px;margin-right: 2px;" :src="require(`@/assets/system/${item.key}.svg`)" alt="">
              <span slot="title">{{ $t(item.name) }}</span>
            </div>
          </el-menu-item>
          <el-submenu v-else="item.hasChild" :index="item.path">
            <template slot="title">
              <div style="position: relative;padding-left: 9px;" @click="$router.push('/privateResource')">
                <img style="width: 20px;margin-right: 2px;" :src="require(`@/assets/system/${item.key}.svg`)" alt="">
                <span slot="title">{{ $t(item.name) }}</span>
              </div>
            </template>
            <el-menu-item v-for="(menuItem, subIndex) in resourceTypeList"
              :index="'/privateResource?iuid=' + menuItem.path" :key="menuItem.path">
              {{ menuItem.meta.title }}
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <el-main style="overflow-y: hidden; background: #fff">
      <div class="app-container" style="font-size: 14px">
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import documentApi from "@/api/document/indexApi.js";

export default {
  components: {
  },
  data() {
    return {
      resourceTypeList: [],
      menuDefaultActive: "company",
    };
  },
  computed: {
    ...mapGetters(["hasNotDealApply", "user", "queryPrivateResourceTree"]),
    sidebarMenuList() {
      let menu = [];
      let p = this.$store.state.permissions.routerMap.find(item => item.path == '/adminSystem');
      let c = [].concat(p.children[0].children)
      menu = c.map(item => {
        return {
          title: item.meta.title,
          name: item.meta.name,
          key: item.meta.key,
          path: item.path,
          hasChild: item.path == '/privateResource'
        }
      })
      console.log(menu);
      return menu
    }
  },

  watch: {
    'queryPrivateResourceTree'(val) {
      if (val == 'refresh') {
        this.queryResourceTreeData()
      }
    },
  },
  created() {
    if (this.user.isadministrator == false) {
      this.$router.push('/')
    }
    else {
      this.queryResourceTreeData()
    }
  },
  methods: {
    async queryResourceTreeData() {
      var res = await documentApi.get("/api/publiclibrarynew/GetpubliclibraryData", {});
      this.$store.state.app.queryPrivateResourceTree = 'finish'

      if (res.code == 1) {
        this.resourceTypeList = res.data[0].child.map(item => {
          return {
            data: item,
            meta: { title: item.itemText, icon: '' },
            path: item.iuid
          }
        })
      }
    },
  }
};
</script>

<style scoped>
.isTransition :deep() .el-submenu__title {
  display: block;
}

.leftMenu {
  height: 100vh;
  overflow-y: auto;
  padding-top: 15px;
  background-color: rgb(245, 247, 250);
  border-right: none;
}

.userCenterSidebarTitle {
  height: 30px;
  line-height: 30px;
  padding-left: 35px;
  font-size: 18px;
  color: #333333;
  font-weight: bold;
}
</style>

<style scoped lang="scss">
  .app-container {
    height: calc(100vh - 51px)
  }

  .el-menu-item {
    padding-left: 29px;
    height: 38px;
    line-height: 38px;
  }

  .is-active {
    background-color: #ecf5ff;
  }
</style>
