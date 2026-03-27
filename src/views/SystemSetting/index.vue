<template>
  <el-container style="position: static;height: calc(100vh - 51px);">
    <mainSideMenu />
    <el-aside class="isTransition" :width="$store.state.app.isCollapse ? '220px' : '0'">
      <el-menu :default-active="menuDefaultActive" style="height: 100%;padding-top: 15px;background-color: rgb(245, 247, 250);border-right: none;" router>
        <div class="userCenterSidebarTitle">{{ $t('leftNavs.setting') }}</div>
        <el-menu-item v-for="(item, listIndex) in sidebarMenuList" v-if="permi.includes(item.permi)" :key="listIndex" :index="item.key" style="margin: 10px 0px; padding-left: 29px" :class="{ 'is-active': item.title == $route.meta.title }">
          <div style="position: relative">
            <img style="width: 20px;margin-right: 2px;" :src="require(`@/assets/system/${item.key}.svg`)" alt="">
            <span slot="title">{{ $t(item.name) }}</span>
          </div>
        </el-menu-item>
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

export default {
  components: {
  },
  data() {
    return {
      menuDefaultActive: "company",
    };
  },
  computed: {
    permi() {
      return localStorage.getItem('permi') || []
    },
    ...mapGetters(["hasNotDealApply", "user"]),
    sidebarMenuList() {
      let menu = [];
      let p = this.$store.state.permissions.routerMap.find(item => item.path == '/systemSetting');
      let c = [].concat(p.children[0].children)
      menu = c.map(item => {
        return {
          permi: item.meta.permi,
          title: item.meta.title,
          name: item.meta.name,
          key: item.meta.key,
          path: item.path
        }
      })
      return menu
    }
  },
  created() {
    let setuproletype = this.user.setuproletypelist.find(item => item.setuproletype == '1');

    if (this.user.iscorpadmin == false && !setuproletype) {
      this.$router.push('/')
    }

    this.routeHandler()
    this.$root.$on('activeSetting', this.routeHandler)
  },

  destroyed() {
    this.$root.$off('activeSetting', this.routeHandler)
  },

  methods: {
    routeHandler() {
      if (this.sidebarMenuList.length > 0) {
        let current = this.sidebarMenuList.find(item => this.permi.includes(item.permi))

        if (current) {
          this.$router.push(current.path)
        }
      }

    }
  }
};
</script>

<style scoped>
.el-submenu__title {
  display: none;
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
