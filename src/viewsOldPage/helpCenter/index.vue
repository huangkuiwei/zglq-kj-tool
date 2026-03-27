<template>
  <el-container class="helpCenter">
    <el-container :style="{ height: clientHeight + 'px' }">
      <el-header id="headerPage" style="height: 50px;z-index: 2000;line-height: 50px;background-color: white;border-bottom: 1px solid #dedfe6;">
        <div style="display: flex; float: left" class="ksjLogo">
          <img v-show="!$isOwner" :src="$headerLogo" style="height: 40px; margin: 5px 0 5px 10px" />
        </div>
      </el-header>
      <el-container style="padding-top:60px">
        <el-aside width="300px">
          <el-menu :default-active="menuDefaultActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect">
            <el-submenu index="1">
              <template slot="title">
                <span>软件概述</span>
              </template>
              <el-submenu index="1-4">
                <template slot="title">快速入门</template>
                <el-menu-item index="1-4-1">下载并注册钉钉</el-menu-item>
                <el-menu-item index="1-4-2">开通应用</el-menu-item>
                <el-menu-item index="1-4-3">发票开具</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <span slot="title">Web端功能</span>
            </el-menu-item>
            <el-menu-item index="3">
              <span slot="title">手机端功能</span>
            </el-menu-item>
            <el-menu-item index="4">
              <span slot="title">其他说明</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <p>
            BIMWindows简称BW，是一款基于BIM的模型轻量化展示、管理平台，能
            帮助您方便快捷地管理BIM模型及项目图纸、文档等文件，能够充分调用项目
            BIM模型的信息价值。
          </p>
          <p>
            BW支持移动APP端和电脑PC端，能够让您随时随地管理项目BIM模型及
            图纸等文件，能实现DWG、Bentley、Revit、Catia、IFC、Navisworks、OBJ、FBX、
            DXF等二维图纸和三维模型的秒速转换和便捷浏览。
          </p>
          <p>
            BW支持文件版本管理、权限管理、加密分享，确保项目文件的一致性、安
            全性，提高项目系统同办公效率，减少不必要的错误和返工。
          </p>
          <p> BW二维图纸查看支持文字无损显示，无需单独配置字体文件，提供测量、
            标注、视图标注及保存等审图工具，帮您高效地进行问题沟通与记录。
          </p>
          <p> BW三维模型浏览提供模型属性查询、尺寸测量、体积统计、模型切割、模
            型隔离与隐藏、模型漫游、视图保存、问题标注等工具，并支持卫星地图、地形
            模型、三维实景模型等地理环境加载，充分利用了BIM技术的可视化、参数化、
            仿真性等特点，大大提高了BIM模型的价值利用率。
          </p>
          <p> BW同时支持Word、Excel、PPT、PDF常见文档文件的查看，及MP4、WMV、
            AVI、MKV、MOV等多种视频及图片格式文件播放、查看，提高项目人员工作效
            率。</p>
        </el-main>
      </el-container>
    </el-container>
    <!-- <el-container style="padding-top:66px">
      <div>111</div>
    </el-container> -->
  </el-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tabPosition: 'left',
      menuDefaultActive: null
    }
  },
  computed: {
    ...mapGetters(["clientHeight"]),
  },
  methods: {
    handleSelect(key) {
      this.menuDefaultActive = key
      console.log(key)
    },
    handleOpen() {

    },
    handleClose() {

    }
  }
}
</script>
<style scoped>
#headerPage {
  position: fixed;
  width: 100%;
  /* height: 66px; */
  padding: 0;
  top: 0;
  line-height: 64px;
  z-index: 100;
  box-shadow: 0 0 8px 0 rgb(0 0 0 / 10%);
  background-color: #fff;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.helpCenter ::v-deep .el-aside {
  background: linear-gradient(-90deg,
      rgba(0, 0, 0, 0.01),
      transparent) !important;
}

.helpCenter ::v-deep .el-container .el-main {
  background: #fff;
}
</style>
