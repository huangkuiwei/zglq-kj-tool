<!-- // 顶部：“跨~界”，高度:39px -->
<template>
  <div class="navbar background">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :background-color="$store.getters.darkMode ? '#1e1e20' : 'white'"
      text-color="#409EFF"
      active-text-color="#409EFF"
      :default-active="menuActive"
      @select="menuSelect"
    >
      <div
        style="display: flex; float: left;"
        class="ksjLogo"
      >
        <img
          :src="$headerLogo"
          style="height: 40px; margin: 5px 0 5px 10px;"
        >
      </div>
      <template v-if="homeNavbarVisible && hasCorp">
        <el-button
          type="text"
          size="default"
          class="back-btn"
          icon="el-icon-s-home"
          @click="goBack"
        >
          {{ $t('base.button.back') }}
        </el-button>
      </template>
      <div class="avatar-container">
        <div
          class="options"
          style="margin-right: 10px; margin-top: 3px"
        >
          <el-dropdown
            trigger="click"
            style="margin-right: 20px;"
            @command="changeLanguage"
          >
            <el-button
              style="color: #888;"
              type="text"
              size="default"
            >
              <span>{{ languageName }}</span>
              <i class="el-icon-arrow-down" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zhCn">
                中文
              </el-dropdown-item>
              <el-dropdown-item command="en">
                English
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tooltip
            v-if="!$isSpace"
            style="margin-right: 20px;"
            effect="dark"
            content="学习园地"
            placement="bottom"
          >
            <img
              src="../../assets/newNavBtn/read.svg"
              style="cursor: pointer;width: 18px;height: 18px;"
              @click="navToStudy"
            >
          </el-tooltip>
          <el-tooltip
            v-if="$deployName=='wp'"
            style="margin-right: 20px;"
            effect="dark"
            content="意见反馈"
            placement="bottom"
          >
            <img
              src="../../assets/iconImg/customerService.svg"
              style="cursor: pointer;width: 20px;height: 20px;"
              @click="showCustomerService"
            >
          </el-tooltip>
          <el-tooltip
            v-if="user.isadministrator && $deployName == 'ksj'"
            style="margin-right: 20px;"
            effect="dark"
            content="系统管理"
            placement="bottom"
          >
            <img
              src="../../assets/newNavBtn/setting.svg"
              style="cursor: pointer;width: 20px;height: 20px;"
              @click="navToSetting"
            >
          </el-tooltip>
          <el-tooltip
            v-if="!$isSpace"
            style="margin-right: 20px;"
            effect="dark"
            content="开发者中心"
            placement="bottom"
          >
            <img
              src="../../assets/newNavBtn/code.svg"
              style="cursor: pointer;width: 20px;height: 20px;"
              @click="openApiDoc"
            >
          </el-tooltip>
          <el-tooltip
            v-if="hasCorp"
            style="margin-right: 20px;"
            effect="dark"
            :content="$t('base.button.fileTransfer')"
            placement="bottom"
          >
            <img
              src="../../assets/newNavBtn/inbox.svg"
              style="cursor: pointer;width: 20px;height: 20px;"
              @click="showFileTransferDialog"
            >
          </el-tooltip>
          <!-- <el-tooltip v-if="hasCorp && $sideBarModules.indexOf('团队协作') > -1" style="margin-right: 20px;" effect="dark" content="我的消息" placement="bottom">
            <img src="../../assets/newNavBtn/message.svg" style="cursor: pointer;width: 20px;height: 20px;" @click="showMessageDialog">
          </el-tooltip> -->
          <el-popover
            v-if="hasCorp"
            v-model="showNoticeList"
            placement="bottom"
            :disabled="messageListCount == 0"
            width="300"
            trigger="hover"
          >
            <div
              v-for="item in messageList.usermes.data"
              :key="item.iuid"
              class="msgList flex ai-center jc-between"
            >
              <div>
                <div style="font-size: 14px;color: #555;">
                  <span style="color:#000">{{ item.userName }}</span> 申请加入企业
                </div>
                <div style="font-size: 12px;color: #999;margin-top: 5px;">
                  {{ item.createTime }}
                </div>
              </div>
              <el-button
                type="text"
                size="small"
                @click="showApplyDialog"
              >
                查看人员
              </el-button>
            </div>
            <div
              v-for="item in messageList.checkmes.data"
              :key="item.iuid"
              class="msgList flex ai-center jc-between"
            >
              <div>
                <div style="font-size: 14px;color: #555;">
                  <span style="color:#000">{{ item.creatorName }}</span> 提交的审批
                </div>
                <div style="font-size: 12px;color: #999;margin-top: 5px;">
                  {{ item.createTime }}
                </div>
              </div>
              <el-button
                type="text"
                size="small"
                @click="showApprove(item)"
              >
                点击查看
              </el-button>
            </div>
            <div
              v-for="item in messageList.workflowcheckmes.data"
              :key="item.iuid"
              class="msgList flex ai-center jc-between"
            >
              <div>
                <div style="font-size: 14px;color: #555;">
                  <span style="color:#000">{{ item.creatorName }}</span> 提交的审批
                </div>
                <div style="font-size: 12px;color: #999;margin-top: 5px;">
                  {{ item.createTime }}
                </div>
              </div>
              <el-button
                type="text"
                size="small"
                @click="showApprove(item)"
              >
                点击查看
              </el-button>
            </div>
            <template slot="reference">
              <el-badge
                style="margin-right: 20px;cursor: pointer;margin-top: 7px;"
                :value="messageListCount"
                :max="99"
                :is-dot="false"
                size="mini"
                :hidden="messageListCount == 0"
                type="danger"
              >
                <!-- <i class="el-icon-bell hover" style="cursor: pointer;font-size:20px"></i> -->
                <img
                  src="../../assets/newNavBtn/remind.svg"
                  style="cursor: pointer;width: 18px;height: 18px;"
                >
              </el-badge>
            </template>
          </el-popover>
        </div>
        <div class="avatar-wrapper flex ai-center">
          <img
            id="user-avatar"
            :src="user.avatar ? avatorUrl + encodeURIComponent(encrypt(user.avatar)) : defaultAvatar"
            style="width:40px"
            class="user-avatar"
            @click="avatarClick"
          ><!-- -->
          <!-- <div style="position:absolute;width:8px;height:8px;border-radius:50%;background-color:#FF3300;top:8px;right:0" v-if="hasNotDealApply"></div> -->
          <corpSpace />
        </div>
      </div>
    </el-menu>
    <div
      v-if="showMsgList"
      class="mask"
    >
      <chat-box @close="closeMsgList" />
    </div>
    <person-apply
      :apply-data="applyData"
      :show-apply.sync="showApply"
      @loadCompanyApplyPerson="loadCompanyApplyPerson"
    />
  </div>
</template>
<script>
//import defaultAvatar from "@/assets/user.png";
import defaultAvatar from "@/assets/robot.svg";
import postApi from "@/api/document/indexApi.js";
import corpSpace from "@/components/Space/simpleCorpSpace.vue"
// import corpSpace from "@/components/Space/CorpSpace.vue"
import chatBox from "@/components/chatBox"
import personApply from "@/components/Dialog/personApply.vue"
import {
  mapGetters
} from "vuex";
import Hamburger from "@/components/Hamburger";

import {
  encrypt
} from '@/utils'
export default {
  components: {
    Hamburger,
    corpSpace,
    chatBox,
    personApply
  },
  computed: {
    ...mapGetters(["sidebar", "user", "projectList", "routerMap", "fileDataClone", "uploaderVisible", "downLoadFileDataClone", "hasNotDealApply", 'messageList', 'messageListCount']),
    in_progress_number() {
      var number = this.upload_in_progress_number + this.downLoad_in_progress_number;
      return number;
    },
    hasCorp() {
      return this.$store.state.user.user.corpIdbit
    }
  },
  directives: {
    drag: function (el) {
      let dragBox = el;
      dragBox.onmousedown = (e) => {
        let disX = e.clientX - dragBox.offsetLeft;
        let disY = e.clientY - dragBox.offsetTop;
        let left, top;
        document.onmousemove = (e) => {
          dragBox.style.removeProperty("bottom");
          dragBox.style.removeProperty("right");
          left = e.clientX - disX;
          top = e.clientY - disY;
          dragBox.style.left = left + "px";
          dragBox.style.top = top + "px";
        };
        document.onmouseup = (e) => {
          if (left > 0 || top > 0) {
            document.getElementById("dragbtn").setAttribute("data-flag", true);
          } else {
            document.getElementById("dragbtn").setAttribute("data-flag", false);
          }
          if (left < -15) {
            dragBox.style.left = "-15px";
          }
          //获取当前屏幕宽度
          if (left > document.body.clientWidth - 15) {
            dragBox.style.removeProperty("left");
            dragBox.style.right = "-15px";
          }
          if (top < -15) {
            dragBox.style.top = "-15px";
          }
          if (top > document.body.clientHeight - 15) {
            dragBox.style.removeProperty("top");
            dragBox.style.bottom = "-15px";
          }
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    },
  },
  watch: {
    fileDataClone() {
      var _self = this;
      _self.upload_in_progress_number = 0;
      this.fileDataClone.forEach((element) => {
        if (element.progress >= 0 && element.progress < 100 && !element.errorMsg) {
          _self.upload_in_progress_number = _self.upload_in_progress_number + 1;
        }
      });
    },
    downLoadFileDataClone() {
      var _self = this;
      _self.downLoad_in_progress_number = 0;
      this.downLoadFileDataClone.forEach((element) => {
        if (element.progress >= 0 && element.progress < 100 && !element.errorMsg) {
          _self.downLoad_in_progress_number = _self.downLoad_in_progress_number + 1;
        }
      });
    },
    $route: {
      handler(val, oldval) {
        if (this.$route.meta.homeLink) {
          this.homeNavbarVisible = true
        } else {
          this.homeNavbarVisible = false
          this.setActiveMenu(val);
        }
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      languageName: '中文',
      darkMode: false,
      showNoticeList: false,
      showMsgList: false,
      showApply: false,
      applyData: [],
      activeIndex: "/lately",
      defaultAvatar: defaultAvatar,
      menuActive: null,
      projectManageVisible: false,
      upload_in_progress_number: 0, //上传，下载总数量
      downLoad_in_progress_number: 0,
      dropDownVisible: false,
      homeNavbarVisible: false,
      avatorUrl: process.env.VUE_APP_BASE_API + '/api/home/GetimgFile?fileUrl=',
      encrypt
    };
  },
  created() {
    this.languageName = (this.$i18n.locale == 'en' ? 'English' : '中文')
  },
  mounted() {
    this.setActiveMenu(this.$route);
  },
  methods: {
    changeLanguage(locale) {
      // location.reload()
      this.languageName = locale == 'en' ? 'English' : '中文'
      localStorage.setItem('language', locale)
      this.$i18n.locale = locale;

      this.$root.$emit('changeLanguage');
    },

    closeMsgList() {
      this.showMsgList = false
    },
    navToStudy() {
      let url = this.$router.resolve('/classonline')
      window.open(url.href)
    },
    navToSetting() {
      this.$router.push('/adminSystem')
    },
    changeMode(e) {
      this.$store.commit('SET_DARK_MODE', e)
    },
    openApiDoc() {
      window.open('https://developer.bimwindows.cn')
    },
    showApplyDialog() {
      this.showApply = true;
      this.loadCompanyApplyPerson()
    },
    // 获取申请人员
    async loadCompanyApplyPerson() {
      var res = await postApi.get("/api/WebAccount/CheckCompanyApplyPerson");
      if (res.code === 1) {
        this.applyData = res.data;
      }
    },
    showCustomerService(){
      this.$alert('联系人 张泽 18735370912')
    },
    showApprove(item) {
      this.showNoticeList = false;
      this.$store.commit("SET_ACTIVE_TAB", 'teamwork');

      if (item.module === 'share' || item.module === 'download') {
        this.$router.push({
          path: '/teamwork',
        })
      } else {
        this.$router.push({
          path: '/teamwork',
          query: {
            workflowId: item.id
          }
        })
      }
    },

    linkToHome() {
      window.open('http://www.bimwindows.cn')
    },
    async goBack() {
      this.$store.commit("SET_ACTIVE_TAB", 'desktop');
      this.$router.replace('/')
    },
    menuSelect(index, indexPath) {
      if (index == "/all" && this.$store.state.app.projectLeftMenuActive) {
        this.$router.push("/" + this.$store.state.app.projectLeftMenuActive);
      } else {
        this.$router.push(index);
      }
    },
    avatarClick() {
      this.$store.state.app.corpSpaceContainerVisible = !this.$store.state.app.corpSpaceContainerVisible;
    },
    avatarLeave() {
      // this.$store.state.app.corpSpaceContainerVisible = false;
    },
    setActiveMenu(val) {
      var componentsName = val.matched[0].components.default.name;
      var path = val.path;
      if (componentsName == "documentSidebarLayout") {
        this.menuActive = "/myDocument";
      } else if (componentsName == "projectSidebarLayout" || path == "/projectFile/" || path == "/projectFile") {
        this.menuActive = '/all';
      } else if (path == "/board") {
        this.menuActive = "/board";
      } else if (componentsName == "systemManagementSidebarLayout" || path == "/alladmin") {
        this.menuActive = "/alladmin";
      } else if (componentsName == "knowledgeBaseLayout") {
        this.menuActive = "/myKnowledgeBase";
      } else if (path.indexOf("corpSpaceDetail") > -1) {
        this.menuActive = "";
      } else {
        this.menuActive = "/bji";
      }
    },
    dropDownVisibleChange(visible) {
      this.dropDownVisible = visible;
    },
    showMessageDialog() {
      this.showMsgList = true
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    showFileTransferDialog() {
      /*let isDrag = document.getElementById("dragbtn").getAttribute("data-flag");
      if (isDrag == "true") {
        return;
      }*/
      if (this.$store.state.app.uploaderVisible === "show") {
        this.$store.commit('SETUPLOADER_VISIBLE', 'clear')
      } else if (this.$store.state.app.uploaderVisible === "clear") {
        this.$store.commit('SETUPLOADER_VISIBLE', 'show')
      }
    },
    async logout() {
      await this.$store.dispatch("LogOut").catch(() => {});
      await this.$store.dispatch("setPermissionsUnLoaded");
      this.$router.push({
        path: "/login"
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.msgList {
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;

  &:nth-last-child(2) {
    border-bottom: 0
  }
}

.hover:hover {
  color: #409eff;
}

.back-btn {
  cursor: pointer;
  height: 50px;
  float: left;
  margin-left: 50px;
  color: #409eff;
}

.ksjLogo {
  cursor: pointer;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.topBoardIcon {
  background: url("../../assets/顶部-看板.svg") no-repeat;
  height: 20px;
  width: 18px;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
}

.topDocumentIcon {
  background: url("../../assets/顶部-图档.svg") no-repeat;
  height: 20px;
  width: 18px;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
}

.topProjectIcon {
  background: url("../../assets/顶部-项目.svg") no-repeat;
  height: 20px;
  width: 18px;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
}

.topBRouteIcon {
  background: url("../../assets/顶部-B迹.svg") no-repeat;
  height: 20px;
  width: 18px;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
}

.navbar {
  height: 51px;
  top: 0;
  overflow: hidden;
  border-bottom: 1px solid #dcdfe6;
  line-height: 39px;
  border-radius: 0px !important;
  background: white;

  .hamburger-container {
    line-height: 58px;
    height: 39px;
    float: left;
    padding: 0 10px;
  }

  .el-menu--horizontal>.el-menu-item {
    float: left;
    height: 39px;
    margin: 0;
    /*  border-bottom: 0; */
    color: #909399;
    //margin: 0 20px;
    margin-right: 20px;
  }

  // .el-menu.el-menu--horizontal {
  //   border-bottom: 0px;
  // }
  .bannerTitle {
    font-size: 20px;
    width: 26%;
    float: left;
    color: #409eff;
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
    display: flex;
    align-items: center;
    height: 50px;
    position: absolute;
    right: 10px;

    ::v-deep .el-badge__content {
      &.is-fixed {
        top: 8px;
      }
    }

    .options {
      display: flex;
      align-items: center;
      margin-right: 20px;

      >img {
        margin-right: 20px;
        cursor: pointer;
      }
    }

    .avatar-wrapper {
      // cursor: pointer;
      position: relative;
      margin-right: 15px;
      border-radius: 50%;
      // box-shadow: 0px 0px 2px #999;

      &:hover {
        box-shadow: 0px 0px 2px #999;
      }

      .user-name {
        color: #409eff;
        display: inline-block;
        height: 38px;
        line-height: 38px;
        font-size: 16px;
        vertical-align: middle;
      }

      .user-avatar {
        width: 38px;
        height: 38px;
        //margin-right: 8px;
        border-radius: 50%;
        vertical-align: middle;
      }

      .user-avatar:hover {
        cursor: pointer;
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
    color: #909399;
  }

  .el-menu-item:hover {
    color: #409eff !important;
    background: none !important;
  }

  .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: none !important;
    border-top: 3px solid #409eff;
    border-right: 1px solid #f2f6fc;
    border-left: 1px solid #f2f6fc;
    color: #409eff !important;
    background: none !important;
    line-height: 54px;
    // padding-left: 28px;
    // padding-right: 26px;
    padding-left: 1.8%;
    padding-right: 1.8%;
  }

  .el-menu--horizontal>.el-menu-item {
    border-bottom: none;
  }
}

.popper-class {
  border: 0 !important;
  background: none !important;
  width: 320px;
}

.el-menu-item {
  // padding-left: 29px;
  // padding-right: 27px;
  padding-left: 1.8%;
  padding-right: 1.8%;
}


</style>
