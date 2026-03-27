<template>
  <div :style="{ height: clientHeight + 'px' }" style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
    <div style="text-align: center">
      <img :src="loginErrorImg" style="width: 50%" />
      <div v-if="personError" style="color: #909399; font-size: 15px; padding-left: 50px">
        <span>您购买的版本已达到使用人数上限({{ peopleMax }}/{{ peopleMax }}人)，您可通过以下方式解决：</span>
        <br />
        <span>1.联系公司钉钉管理员进行版本升级。</span><br />
        <span>2.在通讯录中创建新的组织购买个人版或其他版本</span><br /><br />
        <span>如有疑问，请联系供应商：</span>
        <span>北京跨世纪软件技术公司（4006505128）</span>
      </div>
      <div v-else>
        <span style="color: #909399; font-size: 15px">
          {{ loginErrorText }}
        </span>
        <div v-if="!isPrivation" style="text-align:center;margin-top:15px">
          <el-button size="small" style="width: 130px" v-if="!hadJoinCompany" @click="handleJoinCompany" type="primary">加入企业</el-button>
          <!-- <el-button size="small" style="width: 130px; margin-left: 30px" v-if="!hadJoinCompany" @click="handleCreateCompany" type="primary">创建企业</el-button> -->
          <el-button size="small" style="width: 130px; margin-left: 30px" @click="showPhone" type="primary">联系我们</el-button>
          <el-button size="small" style="width: 130px; margin-left: 30px" @click="logOut" type="primary">返回登录</el-button>
          <!-- <el-button size="small" style="width: 150px; margin-left: 30px" @click="handleLinkToPayCenter" type="primary">去续费</el-button> -->
        </div>
      </div>
    </div>
    <opeDialog :opeType="baseInfoOpeType" :dialogVisible.sync="baseInfoDialogVisible" />
    <companyDialogCom :dialogVisible.sync="companyDialogVisible"></companyDialogCom>

  </div>
</template>
<script>
import loginErrorImg from "@/assets/errorImg/shareError.png";
import {
  mapGetters
} from "vuex";
import postApi from "@/api/document/indexApi.js";
import opeDialog from "@/components/editPersonalInfoCom";
import companyDialogCom from "@/views/superAdmin/dialog/companyDialog";
import loadPermittedRouterMap from '@/router/permissions'

import {
  resetRouter
} from "@/router";
import local from '@/utils/auth'
export default {
  components: {
    companyDialogCom,
    opeDialog
  },
  computed: {
    ...mapGetters(["clientHeight"]),
  },
  watch: {
    $route: {
      handler() {
        this.loginErrorText = this.$route.query.errorTxt;
        this.personError = this.$route.query.personError;
        this.peopleMax = this.$route.query.peopleMax;
        this.isExpire = this.$route.query.isExpire;
      },
      immediate: true,
    },
  },
  data() {
    return {
      companyDialogVisible:false,
      baseInfoOpeType: null,
      baseInfoDialogVisible: false,
      isExpire: false,
      loginErrorText: null,
      loginErrorImg: loginErrorImg,
      personError: false,
      peopleMax: 0,
      hadJoinCompany: false,
      isPrivation: false
    };
  },
  created() {
    this.signalr.off("accessApply");
    this.signalr.on("accessApply", async (res) => {
      this.$success(res.msg);
      this.$store.state.user.user.systemIsPersonal = false;
      this.$store.state.user.user.corpIdbit = true;
      await loadPermittedRouterMap()
      local.setUser(this.$store.state.user.user);
      this.$router.push('/');
    });
  },
  async mounted() {
    if (this.$route.query.isExpire) {
      var res = await postApi.get("/api/WebAccount/BaseInfo");
      if (res.code == 1) {
        this.isPrivation = res.data.isPrivation
        if (res.data.corpCode) {
          this.hadJoinCompany = false;
        } else {
          this.hadJoinCompany = false;
        }
      }
    }
  },
  methods: {
    async logOut() {
      await this.$store.dispatch("LogOut").catch(() => {});
      await this.$store.dispatch("setPermissionsUnLoaded");
      this.$router.replace({
        path: "/login"
      });
    },
    handleCreateCompany() {
      this.companyDialogVisible = true;
    },
    handleJoinCompany() {
      this.baseInfoOpeType = "joinCompany";
      this.baseInfoDialogVisible = true;
    },
    showPhone() {
      this.$showPhoneNumber()
    },
    handleLinkToPayCenter() {
      this.$router.push('/payCenter')
    }
  },
};
</script>
