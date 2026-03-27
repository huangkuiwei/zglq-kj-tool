<template>
  <div class="navbar">
    <h1 class="bannerTitle">{{projectInfo.projectName}}</h1>
    <el-dropdown class="avatar-container" trigger="click" style="top: 0; z-index: 99">
      <div class="avatar-wrapper">
        <img :src="avatar || defaultAvatar" class="user-avatar" />
        <span class="user-name">{{ user.username }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <!-- <el-dropdown-item @click.native="handleChangePwdClicked">修改密码</el-dropdown-item> -->
        <el-dropdown-item divided>
          <span style="display: block" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
  import defaultAvatar from "@/assets/user.png";
  import {
    mapGetters
  } from "vuex";
  export default {
    name: 'BimModelNavbar',
    computed: {
      ...mapGetters(["avatar", "user"]),
    },
    data() {
      return {
        defaultAvatar: defaultAvatar,
        projectInfo: {
          projectName: ''
        }
      };
    },
    mounted() {
      this.loadProjectInfo()
    },
    methods: {
      async logout() {
        await this.$store.dispatch("LogOut").catch(() => {});
        this.$router.push({
          path: "/login"
        });
      }
    },
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 56px;
    top: 0;
    line-height: 56px;
    border-radius: 0px !important;
    background: #002140;

    .hamburger-container {
      line-height: 58px;
      height: 56px;
      float: left;
      padding: 0 10px;
    }

    .el-menu--horizontal>.el-menu-item {
      float: left;
      height: 56px;
      line-height: 56px;
      margin: 0;
      /*  border-bottom: 0; */
      color: #909399;
      margin: 0 20px;
    }

    .el-menu.el-menu--horizontal {
      border-bottom: 0px;
    }

    .bannerTitle {
      font-size: 20px;
      width: 26%;
      float: left;
      color: #fff;
      text-align: left;
      font-weight: 500 !important;
      margin: 0;
      padding-left: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: #FF3300;
    }

    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;

      .avatar-wrapper {
        cursor: pointer;
        position: relative;

        .user-name {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          vertical-align: middle;
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          border-radius: 50%;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 17px;
          font-size: 16px;
        }
      }
    }

    .el-menu .navcolor {
      color: #909399 !important;
    }

    .el-menu .navcolor:hover {
      color: rgba(255, 255, 255, 1) !important;
      background: none !important;
    }

    .el-menu--horizontal>.el-menu-item.is-active {
      border-bottom: 2px solid #fff !important;
      color: #fff !important;
      background: none !important;
    }
  }

  .popper-class {
    border: 0 !important;
    background: none !important;
  }
</style>
