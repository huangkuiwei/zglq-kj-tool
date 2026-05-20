<template>
  <div id="user-space">
    <div
      v-if="corpSpaceContainerVisible"
      class="box"
      @mouseleave="mouseLeave"
      @mouseenter="mouseenter"
    >
      <div class="corpInfoContainer">
        <!-- <div class="flex ai-center corpMargin"> -->
        <!--   <img -->
        <!--     :src="corpSpaceModel.ddUserAvatar && corpSpaceModel.ddUserAvatar.length > 0 ? avatorUrl + encodeURIComponent(encrypt(corpSpaceModel.ddUserAvatar)) : defaultCorpLogo" -->
        <!--     class="corpAvatar" -->
        <!--   > -->
        <!--   <div> -->
        <!--     <div class="userName"> -->
        <!--       {{ corpSpaceModel.username }} -->
        <!--     </div> -->
        <!--     <div class="corpName"> -->
        <!--       {{ corpSpaceModel.corpName }} -->
        <!--     </div> -->
        <!--   </div> -->
        <!-- </div> -->
        <!-- <div style="width: 100%;height: 1px;background-color: #d5d5d5;margin: 15px 0 5px;" /> -->
        <!-- <div -->
        <!--   class="flex ai-center corpSpaceContainerUl jc-between" -->
        <!--   @click="editPersonalInfo" -->
        <!-- > -->
        <!--   <div class="flex ai-center"> -->
        <!--     <img -->
        <!--       style="width: 20px;" -->
        <!--       src="../../assets/newNavBtn/account.svg" -->
        <!--       alt="" -->
        <!--     > -->
        <!--     <span>{{ $t('userCenter.account') }}</span> -->
        <!--     &lt;!&ndash; <div style="position:absolute;width:8px;height:8px;border-radius:50%;background-color:#FF3300;top:8px;right:-10px" v-if="hasNotDealApply"></div> &ndash;&gt; -->
        <!--   </div> -->
        <!-- </div> -->
        <!-- <div -->
        <!--   v-if="corpSpaceModel.isadministrator" -->
        <!--   class="flex ai-center corpSpaceContainerUl jc-between" -->
        <!--   @click="handleDetail" -->
        <!-- > -->
        <!--   <div class="flex ai-center"> -->
        <!--     <img -->
        <!--       style="width: 20px;" -->
        <!--       src="../../assets/newNavBtn/storage.svg" -->
        <!--       alt="" -->
        <!--     > -->
        <!--     <span>{{ $t('userCenter.storage') }}</span> -->
        <!--   </div> -->
        <!--   <div class="count"> -->
        <!--     {{ corpSpaceModel.usedSpace }} -->
        <!--   </div> -->
        <!-- </div> -->
        <!-- <div -->
        <!--   v-if="corpSpaceModel.isadministrator" -->
        <!--   class="flex ai-center corpSpaceContainerUl jc-between" -->
        <!--   @click="registedUserDetail" -->
        <!-- > -->
        <!--   <div class="flex ai-center"> -->
        <!--     <img -->
        <!--       style="width: 20px;" -->
        <!--       src="../../assets/newNavBtn/member.svg" -->
        <!--       alt="" -->
        <!--     > -->
        <!--     <span>{{ $t('userCenter.corpMember') }}</span> -->
        <!--   </div> -->
        <!--   <div class="count"> -->
        <!--     {{ corpSpaceModel.registedUserCount + $t('userCenter.countName') }} -->
        <!--   </div> -->
        <!-- </div> -->
        <div
          class="flex ai-center corpSpaceContainerUl jc-between"
          @click="exitLogin"
        >
          <div class="flex ai-center">
            <img
              style="width: 20px;"
              src="../../assets/newNavBtn/exit.svg"
              alt=""
            >
            <span>{{ $t('userCenter.exit') }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      append-to-body
      :title="$t('base.button.accountSetting')"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <div>
        <div class="flex ai-center jc-between info-item">
          <div class="flex ai-center">
            <img
              class="corpAvatar"
              :src="userData.avatar"
              alt=""
            >
            <div style="margin-left: 10px;">
              <div class="infoTitle">
                {{ $t('base.button.username') }}
              </div>
              <div style="margin-top: 5px;">
                {{ userData.userName }}
              </div>
            </div>
          </div>
          <el-button
            type="text"
            @click="openEdit('editUserInfo')"
          >
            {{ $t('base.button.edit') }}
          </el-button>
        </div>
        <div class="info-item">
          <div class="infoTitle">
            {{ $t('base.button.password') }}
          </div>
          <div class="flex ai-center jc-between ">
            <span style="color: #999;">{{ $t('base.button.modifyPassword') }}</span>
            <el-button
              type="text"
              @click="openEdit('editPwd')"
            >
              {{ $t('base.button.modify') }}
            </el-button>
          </div>
        </div>
        <div class="info-item">
          <div class="infoTitle">
            {{ $t('base.button.phone') }}
          </div>
          <div class="flex ai-center jc-between ">
            <span>{{ userData.phone }}</span>
            <el-button
              type="text"
              @click="openEdit('editPhone')"
            >
              {{ $t('base.button.replace') }}
            </el-button>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('base.button.close') }}</el-button>
      </span>
    </el-dialog>

    <opeDialog
      :ope-type="baseInfoOpeType"
      :user-model="userData"
      :dialog-visible.sync="baseInfoDialogVisible"
    />
  </div>
</template>
<script>
import postApi from "@/api/document/indexApi.js";
import {
  mapGetters
} from "vuex";
import defaultCorpLogo from "@/assets/robot.svg";
import local from "@/utils/auth";
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
    corpSpaceContainerVisible(val) {
      if (this.corpSpaceContainerVisible) {
        this.queryData()
      }
    },
    baseInfoDialogVisible(val) {
      if (!this.baseInfoDialogVisible) {
        this.editPersonalInfo()
      }
    },
  },
  data() {
    return {
      opacity: 1,
      userData: '',
      defaultCorpLogo,
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
      baseInfoDialogVisible: false,
      avatorUrl: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl=",
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
    async queryData() {
      var res = await commonApi.queryCorpSpace();
      if (res.code == 1) {
        this.corpSpaceModel = res.data;
        this.$forceUpdate()
      }
    },
    openEdit(type) {
      this.baseInfoOpeType = type
      this.baseInfoDialogVisible = true
    },
    hideSpace() {
      this.$store.state.app.corpSpaceContainerVisible = false;
    },
    registedUserDetail() {
      local.setCorpRecordTabActived(1)
      this.$router.push('/corpDetail')
      this.hideSpace()
    },
    handleDetail() {
      local.setCorpRecordTabActived(0)
      this.$router.push("/corpDetail");
      this.hideSpace()
    },
    mouseenter() {
      this.$store.state.app.corpSpaceContainerVisible = true;
    },
    mouseLeave() {
    },
    async editPersonalInfo(val) {
      let res = await postApi.get('/api/WebAccount/BaseInfo')
      if (res.code == 1) {
        this.userData = res.data
        this.userData.avatar = res.data.ddUserAvatar ? this.avatorUrl + encodeURIComponent(encrypt(res.data.ddUserAvatar)) : this.defaultCorpLogo
        this.dialogVisible = true;
        this.hideSpace()
      }
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
      this.hideSpace()
    },
  },
};
</script>
<style scoped>
.info-item {
  padding: 20px 0;
  border-bottom: 1px solid #bbbbbb44;
}

.infoTitle {
  font-weight: bold;
}

.box {
  /* padding-top: 30px; */
  position: fixed;
  width: 258px;
  right: 28px;
  top: 50px;
  z-index: 3000;
}


.corpMargin {
  margin-right: 20px;
  margin-left: 15px;
}


.corpInfoContainer {
  background-color: white;
  box-shadow: 0 0 10px #ccc;
  z-index: 1000;
  /* padding: 20px 15px 10px 20px; */
  //padding: 20px 0 10px 0;
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

.userName {
  color: #111;
  font-size: 14px;
  font-weight: bold;
}

.corpName {
  color: #2a2a2a;
  font-size: 13px;
  overflow: hidden;
  max-width: 170px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.count {
  font-size: 12px;
  color: #999;
}

.corpSpaceContainerUl {
  height: 44px;
  width: 100%;
  line-height: 44px;
  font-size: 14px;
  font-weight: 400;
  color: #2a2a2a;
  padding-left: 20px;
  padding-right: 15px;
}

.corpSpaceContainerUl img {
  margin-right: 8px;
}

.corpSpaceContainerUl:hover {
  cursor: pointer;
  background-color: #ebeef5;
}
</style>
