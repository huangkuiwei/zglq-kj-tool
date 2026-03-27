<template>
  <div v-if="!item.hidden" class="menu-wrapper" style="margin:10px 0;">
    <template v-if="item.path === '/commonBuildLibrary'">
      <el-submenu index="/commonBuildLibrary">
        <app-link :to="resolvePath(item.path)" slot="title">
          <div style="padding-left:8px;line-height: 38px;height: 38px;">
            <img :src="$route.path == item.path ? require(`@/assets/resourceIcon/${item.meta.icon}-act.svg`) : require(`@/assets/resourceIcon/${item.meta.icon}.svg`)" style="margin-right:8px;width:20px;">
            <span :style="{ color: $route.path === '/commonBuildLibrary' ? '#409EFF' : '#303133' }">{{ $t(item.meta.name) }}</span>
          </div>
        </app-link>
        <!-- <el-menu-item v-for="child in item.children" :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" class="nest-menu" /> -->
        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path" @click="itemClick(child)" class="nest-menu">
          <span v-if="child.meta" style="margin-left: 17px;">{{ child.meta.title }}</span>
        </el-menu-item>
      </el-submenu>
    </template>

    <!-- 只有一个子级时，不显示父级，只显示子级 -->
    <template v-else-if="item.path != '/commonBuildLibrary' && hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item style="height:38px;line-height:38px;padding-left:29px" :index="resolvePath(onlyOneChild.path)" class="menuItemHoverClass" :class="{ 'submenu-title-noDropdown': !isNest }">
          <div @contextmenu.prevent="openMenu()">
            <template v-if="item.component.name == 'projectSidebarLayout'">
              <img :src="$route.path == item.path ? require(`@/assets/projectIcon/${item.meta.icon}-act.svg`) : require(`@/assets/projectIcon/${item.meta.icon}.svg`)" style="margin-right:8px;width:20px">
            </template>
            <template v-if="item.component.name == 'knowledgeBaseLayout'">
              <img :src="$route.path == item.path ? require(`@/assets/resourceIcon/${item.meta.icon}-act.svg`) : require(`@/assets/resourceIcon/${item.meta.icon}.svg`)" style="margin-right:8px;width:20px">
            </template>
            <span slot="title">{{ $t(item.meta.name) }}</span>
          </div>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item :meta="item.meta" />
      </template>
      <sidebar-item v-for="child in item.children" :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>
<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarItem',
  components: {
    Item,
    AppLink
  },
  props: {
    page: {
      type: String,
      default: ''
    },
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    // this. = null/
    return {
      onlyOneChild: null
    }
  },
  computed: {
    ...mapGetters(['currentRoute'])
  },
  methods: {
    openMenu() {
      return false
    },
    itemClick(e) {
      if (this.$route.path != '/commonBuildLibrary') {
        this.$router.push('/commonBuildLibrary')
        setTimeout(() => {
          this.$store.commit('LIB_TYPE_CHANGE', e)
        }, 200);
      }
      else {
        this.$store.commit('LIB_TYPE_CHANGE', e)
      }
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = {
          ...parent,
          path: '',
          noShowingChildren: true
        }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(path) {
      return isExternal(path)
    },
    /**
     * 点击菜单时刷新页面
     */
    load(path) {
      if (this.isExternalLink(path)) {
        return
      }
      if (!process.env.RELOAD_ON_CLICK_MENU) {
        this.$router.push({
          path
        })
        return
      }
      if (this.$router.mode !== 'history') {
        // VUE-ROUTER 默认路由方式是通过 url 的哈希值来判断路由的变化的
        // 因此在这种情况下改变 location.href 是不会触发页面刷新的，所以需要手动刷新
        const index = location.href.indexOf('#')
        const currentPath = location.href.substr(index + 1)
        location.href = location.href.replace(currentPath, path)
        // fix: 从 QQ 等软件跳转过来的链接，会被添加一些参数导致路由无法正常解析
        if (!location.search) {
          location.reload()
        }
      } else {
        location.href = `${path}?${+new Date()}`
      }
    },
  },
}
</script>
<style>
.el-menu-item:hover {
  outline: 0 !important;
  background-color: #e4e9f0 !important;
}
.el-menu-item, .el-submenu__title{
  height: 38px;
  line-height: 38px;
}

.menu-wrapper .el-submenu__title {
  display: block;
}
</style>
