<template>
  <div id="user-space">
    <div
      v-if="corpSpaceContainerVisible"
      class="box"
      @mouseleave="mouseLeave"
      @mouseenter="mouseenter"
    >
      <!-- <div style="padding-top: 30px;width:258px;position: fixed;right: 28px;top: 20px;z-index: 1000;" @mouseleave="mouseLeave" @mouseenter="mouseenter"> -->
      <div
        class="corpInfoContainer"
        :style="$isnotInDingTalk() ? 'padding-bottom:0px' : 'padding-bottom:10px'"
      >
        <div style="padding-left: 15px;padding-right: 20px;border-bottom: 1px solid #eeeeee;padding-bottom: 10px;">
          <img
            :src="corpSpaceModel.ddUserAvatar && corpSpaceModel.ddUserAvatar.length > 0 ? avatorUrl + encodeURIComponent(encrypt(corpSpaceModel.ddUserAvatar)) : defaultCorpLogo"
            class="corpAvatar"
          >
          <div class="corpName">
            <div style="margin-bottom: 3px; color: #2a2a2a; font-weight: 500">
              {{ corpSpaceModel.username }}
            </div>
            <div
              v-if="!corpSpaceModel.hasCorp"
              style="cursor: pointer;color: #409eff;"
              @click="handleJoinCompany"
            >
              ＋ 创建 / 加入企业
            </div>
            <div
              v-else
              style="font-size: 12px; font-weight: 400; color: #2a2a2a"
            >
              <span style="display: inline-block;overflow: hidden;max-width: 150px;white-space: nowrap;text-overflow: ellipsis;">{{ corpSpaceModel.corpName }}</span>
              <img
                style="vertical-align: sub"
                :src="companyLogo"
              >
            </div>
          </div>
          <div style="margin-top: 8px;width: 231px;height: 30px;background: #ffffff;border-radius: 4px;border: 1px solid rgba(182, 190, 207, 0.5);font-size: 12px;color: #409eff;line-height: 30px;">
            <div style="float: left">
              <img
                :src="versionLogo"
                style="vertical-align: sub; margin-left: 7px"
              >
              <span style="margin-left: 3px">
                {{ corpSpaceModel.orderIsNull ? "无限制" : corpSpaceModel.isTryOut ? "试用版" : corpSpaceModel.isPersonal ? "个人版" : "企业版" }}
              </span>
            </div>
            <!-- <div v-if="!corpSpaceModel.orderIsNull" class="upLevel" style="width: 64px;height: 28px;background: linear-gradient(252deg, #f5f7fa 0%, #eceff0 100%);border-radius: 15px 4px 4px 15px;float: right;text-align: center;" @click="linkToPayCenter"> 去升级 </div> -->
          </div>
        </div>
        <div style="padding-bottom:15px;border-bottom: 1px solid #eee">
          <div
            class="corpSpaceContainerMargin"
            style="margin-top: 10px"
          >
            <span style="font-size: 12px; color: #2a2a2a">{{ corpSpaceModel.usedSpace }} / {{ corpSpaceModel.bwForPrivatization ? "无限制" : corpSpaceModel.usableSpace }}
            </span>
            <span style="float: right;font-size: 12px;color: #979797;margin-top: 2px;">{{ corpSpaceModel.usedPercent.toFixed(2) }}%</span>
            <!-- <a class="corpSpaceDetailLink" @click="handleDetail">详情</a> -->
          </div>
          <div
            class="corpSpaceContainerMargin"
            style="height: 6px; margin-top: 8px; border-radius: 10px"
            :style="{ background: 'linear-gradient(90deg, #6DD400 ' + corpSpaceModel.usedPercent + '%, #ebeef5 0%)', }"
          />
          <div style="text-align: center; margin-top: 15px">
            <el-link
              v-if="corpSpaceModel.isadministrator"
              type="primary"
              :underline="false"
              style="font-size: 14px"
              @click="handleDetail"
            >
              云存储空间
            </el-link>
            <el-link
              v-else
              type=""
              :underline="false"
              style="font-size: 14px"
            >
              云存储空间
            </el-link>
          </div>
        </div>
        <div
          v-if="$store.state.user.user.corpIdbit"
          style="padding-bottom:15px;border-bottom: 1px solid #eee"
        >
          <div
            class="corpSpaceContainerMargin"
            style="margin-top: 10px"
          >
            <span style="font-size: 12px; color: #2a2a2a">{{ corpSpaceModel.registedUserCount + "人" }} / {{ corpSpaceModel.orderIsNull ? "无限制" : corpSpaceModel.maxOfPeople + "人" }}</span>
            <span style="float: right;font-size: 12px;color: #979797;margin-top: 2px;">{{ corpSpaceModel.orderIsNull ? "无限制" : corpSpaceModel.personPercent.toFixed(2) + "%" }}</span>
            <!-- <a class="corpSpaceDetailLink" @click="handleDetail">详情</a> -->
          </div>
          <div
            class="corpSpaceContainerMargin"
            style="height: 6px; margin-top: 8px; border-radius: 10px"
            :style="{ background: 'linear-gradient(90deg, #6DD400 ' + corpSpaceModel.personPercent + '%, #ebeef5 0%)', }"
          />
          <div style="text-align: center; margin-top: 15px">
            <el-link
              v-if="corpSpaceModel.isadministrator"
              type="primary"
              :underline="false"
              style="font-size: 14px"
              @click="registedUserDetail"
            >
              企业人员
            </el-link>
            <el-link
              v-else
              type="primary"
              :underline="false"
              style="font-size: 14px"
            >
              企业人员
            </el-link>
          </div>
        </div>
        <!-- <div v-if="!$isOwner" class="corpSpaceContainerUl">
          <img :src="timeLogo" />
          <div class="corpInfoContainerInline" style="margin-left: -2px"> 到期时间 </div>
          <span style="float: right;margin-left: 20px;font-size: 12px;color: rgb(151, 151, 151);">{{ corpSpaceModel.orderIsNull && !corpSpaceModel.bwForPrivatization ? noTime : corpSpaceModel.serviceStopTime }}
          </span>
        </div>
        <div v-if="!$isOwner" class="corpSpaceContainerUl" @click="showQrcode">
          <img :src="helpLogo" />
          <div class="corpInfoContainerInline">帮助中心</div>
        </div>
        <div v-if="!$isOwner" class="corpSpaceContainerUl" @click="$showPhoneNumber()">
          <img :src="buyLogo" />
          <div class="corpInfoContainerInline">联系我们</div>
        </div> -->
        <div
          class="corpSpaceContainerUl"
          @click="linkToUserCenter"
        >
          <img :src="editInfoLogo">
          <div
            class="corpInfoContainerInline"
            style="position: relative;"
          >
            <div
              v-if="hasNotDealApply"
              style="position:absolute;width:8px;height:8px;border-radius:50%;background-color:#FF3300;top:8px;right:-10px"
            /> 账号中心
          </div>
        </div>
        <div class="footBtn">
          <!-- <div @click="goHome">返回首页</div> -->
          <div @click="exitLogin">
            退出登录
          </div>
        </div>
      </div>
    </div>
    <opeDialog
      ope-type="editUserInfo"
      :dialog-visible.sync="baseInfoDialogVisible"
    />
  </div>
</template>
<script>
import {
  mapGetters
} from "vuex";
import defaultCorpLogo from "@/assets/robot.svg";
import local from "@/utils/auth";
import helpLogo from "@/assets/corpDetailImg/帮助.png";
import buyLogo from "@/assets/corpDetailImg/购买.png";
import timeLogo from "@/assets/corpDetailImg/时间.png";
import versionLogo from "@/assets/corpDetailImg/版本.svg";
import editInfoLogo from "@/assets/corpDetailImg/修改个人信息.png";
import companyLogo from "@/assets/corpDetailImg/企业.svg";
import commonApi from "@/api/common";
import opeDialog from "@/components/editPersonalInfoCom";
import {
  encrypt
} from '@/utils'
export default {
  components: {
    opeDialog,
  },
  computed: {
    ...mapGetters(["user", "corpSpaceContainerVisible", "hasNotDealApply"]),
  },
  watch: {
    async corpSpaceContainerVisible(val) {
      if (this.corpSpaceContainerVisible) {
        var res = await commonApi.queryCorpSpace();
        if (res.code == 1) {
          this.corpSpaceModel = res.data;
        }
      }
    },
  },
  data() {
    return {
      opacity: 1,
      defaultCorpLogo: defaultCorpLogo,
      helpLogo: helpLogo,
      buyLogo: buyLogo,
      timeLogo: timeLogo,
      versionLogo: versionLogo,
      editInfoLogo: editInfoLogo,
      noTime: "无限制",
      dialogVisible: false,
      dialogTitle: "",
      corpSpaceModel: {
        ddUserAvatar: null,
        username: null,
        corpName: null,
        minOfPeople: null,
        orderIsNull: true,
        isTryOut: null,
        minOfPeople: null,
        maxOfPeople: null,
        isPersonal: null,
        usedSpace: 0,
        usableSpace: 0,
        usedPercent: 0,
        registedUserCount: 0,
        hasCorp: false,
        personPercent: 0,
      },
      baseInfoOpeType: null,
      baseInfoDialogVisible: true,
      avatorUrl: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl=",
      companyLogo: companyLogo,
      encrypt
    };
  },
  mounted() {
    document.onclick = (e) => {
      const userSpace = document.querySelector('#user-space')
      const avatar = document.querySelector('#user-avatar')
      const searchBtn = document.querySelector('#search_btn')
      const search = document.querySelector('.search-box')
      if (search && !search.contains(e.target) && !searchBtn.contains(e.target)) {
        this.$store.state.app.showSearch = false;
      }
      if (userSpace && !userSpace.contains(e.target) && !avatar.contains(e.target)) {
        this.$store.state.app.corpSpaceContainerVisible = false;
      }
    }
  },
  methods: {
    showQrcode() {
      const h = this.$createElement;
      this.$msgbox({
        title: '帮助中心',
        message: h('div', { class: 'flex column ai-center' }, [
          h('img', { attrs: { src: require('../../assets/qrcode-kj.png') }, style: 'width:200px;height:200px' }),
          h('div', { style: 'color: #000;margin-top:20px;font-size:16px' }, '扫码获取帮助')
        ]),
        showCancelButton: false,
        showConfirmButton: false,
        // confirmButtonText: '确定',
      })
    },
    registedUserDetail() {
      local.setCorpRecordTabActived(1)
      this.$router.push('/corpDetail')
    },
    handleDetail() {
      local.setCorpRecordTabActived(0)
      this.$router.push("/corpDetail");
    },
    mouseenter() {
      this.$store.state.app.corpSpaceContainerVisible = true;
    },
    mouseLeave() {
      // this.$store.state.app.corpSpaceContainerVisible = false;
    },
    showHelpCenter() {
      let {
        href
      } = this.$router.resolve({
        path: "/helpCenter"
      });
      window.open("http://bimpc.ksj.com.cn/" + href, "_blank");
    },
    editPersonalInfo(val) {
      this.dialogVisible = true;
      this.dialogTitle = val.target.innerText;
    },
    linkToUserCenter() {
      this.$router.push("/userCenter");
    },
    exitLogin() {
      this.$confirm(this.$t('base.button.areYouExit')).then(async () => {
        // const token = local.getToken();
        // this.signalr.invoke("exitConnnectAsync", token);
        await this.$store.dispatch("LogOut").catch(() => {});
        this.$nextTick(() => {
          this.$router.replace('/login')
        })
      });
    },
    handleJoinCompany() {
      local.setUserCenterMenuActived(2)
      this.$router.push('/userCenter')
    },
    linkToPayCenter() {
      let routeData = this.$router.resolve({
        path: "/payCenter"
      });
      window.open(routeData.href, "_blank");
    },
    goHome() {
      window.open(location.origin)
    }
  },
};
</script>
<style scoped>
.box {
  /* padding-top: 30px; */
  position: fixed;
  width: 258px;
  right: 28px;
  top: 50px;
  z-index: 3000;
}

.upLevel:hover {
  cursor: pointer;
}

.corpInfoContainerInline {
  display: inline-block;
}

.corpSpaceDetailLink {
  text-decoration: none;
  color: #409eff;
  font-size: 12px;
  float: right;
}

.corpSpaceContainerMargin {
  margin-right: 15px;
  margin-left: 20px;
}

.corpSpaceDetailLink:hover {
  color: blue;
}

.corpInfoContainer {
  background-color: white;
  box-shadow: 0 0 10px #ccc;
  z-index: 1000;
  /* padding: 20px 15px 10px 20px; */
  padding: 20px 0 10px 0;
  line-height: normal;
  border-radius: 7px;
}

.corpAvatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 5px;
  vertical-align: top;
}

.corpName {
  color: #2a2a2a;
  font-size: 14px;
  display: inline-block;
}

.corpSpaceContainerUl {
  height: 34px;
  width: 100%;
  line-height: 34px;
  font-size: 14px;
  font-weight: 400;
  color: #2a2a2a;
  padding-left: 20px;
  padding-right: 15px;
}

.corpSpaceContainerUl:hover {
  cursor: pointer;
  background-color: #ebeef5;
}

.corpSpaceContainerUl img {
  height: 18px;
  width: 18px;
  vertical-align: sub;
  margin-right: 10px;
}

.footBtn {
  text-align: right;
  font-size: 12px;
  padding-right: 15px;
  background: #f9f9f9;
  height: 32px;
  line-height: 32px;
  justify-content: space-around;
  color: #2a2a2a;
}

.footBtn>div {
  cursor: pointer;
  display: inline-block;
  margin-left: 20px;
}
</style>
