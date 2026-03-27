<!--  -->
<template>
  <div>
    <el-header v-if="$route.path != '/adminLogin'" id="headerPage" style="height: 50px;z-index: 2000;line-height: 50px;background-color: white;border-bottom: 1px solid #dedfe6;">
      <div class="flex ai-center jc-between">
        <div style="display: flex; float: left" class="ksjLogo">
          <img :src="$headerLogo" style="height: 40px; margin: 5px 0 5px 10px" />
        </div>
        <el-button type="primary" size="small" @click="toLogin">进入系统</el-button>
      </div>
    </el-header>
    <div class="flex">
      <el-aside width="300px" v-if="$route.path != '/adminLogin'">
        <el-menu style="height: calc(100vh - 51px);" router class="el-menu-vertical-demo">
          <el-menu-item v-for="item in menuList" :key="item.name" :index="item.path">
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <router-view class="grow"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      menuList: ''
    };
  },
  created() {
    let deployConfigMenu = this.$router.options.routes.filter(item => item.path == '/deployConfig')[0].children
    this.menuList = deployConfigMenu.filter(item => item.hidden != true)
  },
  methods: {
    toLogin() {
      this.$router.push('/login')
    }
  }
}

</script>

