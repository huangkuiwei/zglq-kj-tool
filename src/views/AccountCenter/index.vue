<template>
  <el-container style="position: static;height: calc(100vh - 51px);">
    <el-aside width="180px" style="width: 220px">
      <el-menu :default-active="menuDefaultActive" style="height: 100%;padding-top: 15px;background-color: rgb(245, 247, 250);border-right: none;" @select="handleSelect">
        <div class="userCenterSidebarTitle">账号中心</div>
        <el-menu-item v-for="(item, listIndex) in sidebarMenuList" :key="listIndex" :index="item.key" style="margin: 5px 0px; padding-left: 29px">
          <div style="position: relative">
            <i class="el-icon-document"></i>
            <span slot="title">{{ item.value }}</span>
            <div style="position: absolute;width: 8px;height: 8px;border-radius: 50%;background-color: #FF3300;right: 75px;top: 10px;" v-if="hasNotDealApply && item.key === 'companyInfo'"></div>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="overflow-y: hidden; background: #fff">
      <div class="app-container" style="font-size: 14px">
        <div class="userCenterBreadcrumb">
          <span style="color: #999999">账号中心</span> > <span>{{ menuDefaultActiveText }}</span>
        </div>
        <div class="userCenterPageContent">
          <!--基本信息-->
          <template v-if="menuDefaultActive == 'baseInfo'">
            <div class="user-container">
              <div class="userCenterBaseContentContainer">
                <div class="userCenterBaseContent flex ai-center">
                  <div class="userCenterBaseContentImg">
                    <img :src="userModel.ddUserAvatar
                      ? projectCreatorAvatorUrl + encodeURIComponent(encrypt(userModel.ddUserAvatar))
                      : defaultAvatar
                      " />
                    <div class="userCenterAvatarEdit">
                      <div style="opacity: 0; height: 90px"></div>
                      <div class="userCenterAvatarEditBtn" @click="editPersonalInfo">
                        <span style="color: white">修改</span>
                      </div>
                    </div>
                  </div>
                  <div class="userCenterUserInfo flex ai-center jc-between">
                    <div>
                      <div class="userCenterUserInfoItem">
                        <div class="userCenterUserInfoItemTitle">姓名:</div>
                        <span style="width: 100px;display: inline-block;">{{ userModel.userName }}</span>
                        <el-link :underline="false" class="userCenterUserInfoItemEdit" @click="editPersonalInfo">修改
                        </el-link>
                      </div>
                      <div class="userCenterUserInfoItem">
                        <div class="userCenterUserInfoItemTitle">手机号码:</div>
                        <span style="width: 100px;display: inline-block;">{{ userModel.phone }}</span>
                        <el-link :underline="false" class="userCenterUserInfoItemEdit" @click="editPhone">修改</el-link>
                      </div>
                    </div>
                    <div>
                      <div class="userCenterUserInfoItem">
                        <div class="userCenterUserInfoItemTitle">账号ID:</div>
                        <span>{{ userModel.userID }}</span>
                      </div>
                      <div class="userCenterUserInfoItem">
                        <div class="userCenterUserInfoItemTitle">登录账号:</div>
                        <span>{{ userModel.phone }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="userCenterUserInfoItem" v-if="hadJoinCompany">
                        <div class="userCenterUserInfoItemTitle">关联企业:</div>
                        <span>{{ userModel.corpName }}</span>
                        <!-- <el-link :underline="false" class="userCenterUserInfoItemEdit">修改</el-link> -->
                      </div>
                      <div class="userCenterUserInfoItem" v-if="hadJoinCompany">
                        <div class="userCenterUserInfoItemTitle">组织机构代码:</div>
                        <span>{{ userModel.corpCode }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!--安全设置-->
          <template v-if="menuDefaultActive == 'safeInfo'">
            <div class="user-container">
              <div class="userCenterBaseContent" style="height: 301px; padding: 0 50px 0 50px">
                <div class="safetySettingItem" style="border-bottom: 1px solid #d8d8d8">
                  <i class="el-icon-circle-check" style="font-size: 38px;color: #49df66;float: left;margin-top: 16px;"></i>
                  <div class="safetySettingItemTextContainer">
                    <div class="safetySettingItemTextTop">登录密码</div>
                    <div class="safetySettingItemTextBottom"> 安全性高的密码可以使账号更安全，建议您定期更换密码，设置一个包含字母、符号或数字中至少两项且长度超过6位的密码 </div>
                  </div>
                  <div style="float: right; margin-top: 45px">
                    <el-button type="primary" @click="editPwd" size="small" style="width: 85px">修改</el-button>
                  </div>
                </div>
                <div class="safetySettingItem">
                  <i class="el-icon-circle-check" style="font-size: 38px;color: #49df66;float: left;margin-top: 16px;"></i>
                  <div class="safetySettingItemTextContainer">
                    <div class="safetySettingItemTextTop">手机绑定</div>
                    <div class="safetySettingItemTextBottom"> 您已绑定了手机 <span style="color: #006fff">{{ userPhoneNumber }}</span>，您的手机为安全手机，可以找回密码和登录！ </div>
                  </div>
                  <div style="float: right; margin-top: 45px">
                    <el-button type="primary" @click="editPhone" size="small" style="width: 85px">修改</el-button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!--企业信息-->
          <template v-if="menuDefaultActive == 'companyInfo'">
            <el-row class="table">
              <el-table v-if="!hadJoinCompany" :data="companyApplyData" class="t-table" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" stripe>
                <el-table-column prop="XXXXX" width="20"> </el-table-column>
                <el-table-column prop="corpName" label="企业名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="corpCode" label="组织机构代码" width="250" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="applyStatus" label="审核状态" width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.applyStatus == 3">审核中</el-tag>
                    <el-tag size="small" v-if="scope.row.applyStatus == 0" type="danger">已拒绝</el-tag>
                    <el-tag size="small" v-if="scope.row.applyStatus == 2" type="danger">已撤回</el-tag>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" :label="$t('base.formLabel.operation')" align="center" width="220">
                  <template slot-scope="scope">
                    <el-link :underline="false" v-if="scope.row.applyStatus == 3" type="danger" @click="backApply(scope.row)">撤回申请</el-link>
                    <el-link :underline="false" v-if="scope.row.applyStatus == 0 || scope.row.applyStatus == 2" @click="reSubmit(scope.row)" type="primary">重新提交</el-link>
                    <el-link :underline="false" style="margin-left: 18px" v-if="scope.row.applyStatus == 3 || scope.row.applyStatus == 0" @click="checkAdmin(scope.row)" type="primary">查看管理员</el-link>
                    <el-link :underline="false" style="margin-left: 18px" v-if="scope.row.applyStatus == 0 || scope.row.applyStatus == 2" @click="removeApply(scope.row)" type="danger">刪除</el-link>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="showBtn" style="height: 50px; line-height: 150px; text-align: center">
                <el-button size="small" style="width: 150px" @click="handleJoinCompany" type="primary">加入企业</el-button>
                <el-button size="small" style="width: 150px; margin-left: 30px" @click="handleCreateCompany" type="primary">创建企业</el-button>
              </div>
              <el-table v-if="hadJoinCompany" :data="companyData" class="t-table" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" stripe>
                <el-table-column prop="XXXXX" width="20"> </el-table-column>
                <el-table-column prop="corpName" label="企业名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="corpCode" align="center" label="组织机构代码" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" align="center" label="注册时间" width="150"></el-table-column>
                <el-table-column prop="usableSpace" label="全部容量" width="100">
                  <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="handleLinkToSpaceDetail">{{ scope.row.privation ? "无限制" : scope.row.usableSpace }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="usedSpace" label="已用容量" width="100">
                  <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="handleLinkToSpaceDetail">{{ scope.row.usedSpace }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="projectCount" label="项目数量" align="center" width="100">
                  <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="handleLinkToSpaceDetail">{{ scope.row.projectCount }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" :label="$t('base.formLabel.operation')" align="center" width="200">
                  <template slot-scope="scope">
                    <el-link :underline="false" icon="el-icon-circle-close" type="danger" @click="handleExitCompany(scope.row)">退出企业</el-link>
                    <el-link :underline="false" style="margin-left: 18px; position: relative" type="primary" @click="handleCheckCustom(scope.row)" v-if="userModel.isAdmin">
                      <div style="position: absolute;width: 8px;height: 8px;border-radius: 50%;background-color: #FF3300;right: -10px;" v-if="hasNotDealApply"></div> 查看人员
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </template>
        </div>
      </div>
    </el-main>
    <company-person-add :visible.sync="personDialogVisible" :corpId="corpId" @loadPerson="loadCompanyPerson"></company-person-add>
    <opeDialog ref="opeDialog" :opeType="baseInfoOpeType" :corpId="corpId" :userModel="userModel" :dialogVisible.sync="baseInfoDialogVisible" @reload="loadData" @addperson='addperson' />
    <companyDialogCom :dialogVisible.sync="companyDialogVisible" @reload="loadData"></companyDialogCom>
  </el-container>
</template>
<script>
import {
  mapGetters
} from "vuex";
import defaultAvatar from "@/assets/robot.svg";
import postApi from "@/api/document/indexApi.js";
import companyPersonAdd from "@/components/Dialog/companyPersonAdd";
import opeDialog from "@/components/editPersonalInfoCom";
import companyDialogCom from "@/views/superAdmin/dialog/companyDialog";
import local from "@/utils/auth";
import loadPermittedRouterMap from '@/router/permissions'

import {
  encrypt
} from '@/utils'
export default {
  computed: {
    ...mapGetters(["clientHeight", "hasNotDealApply"]),
    showBtn() {
      let flag = false;
      if (this.companyData.length > 0) {
        return false
      } else {
        if (this.companyApplyData.length > 0) {
          flag = !this.hadJoinCompany && this.companyApplyData[0].applyStatus != 3
        } else if (this.companyApplyData.length == 0) {
          flag = true
        }
        return flag
      }
    }
  },
  components: {
    opeDialog,
    companyDialogCom,
    companyPersonAdd
  },
  watch: {
    menuDefaultActive: {
      handler() {
        this.loadData();
      },
      immediate: true,
    },
  },
  data() {
    return {
      pageSize: 1,
      total: 0,
      winHeight: 0,
      defaultAvatar: defaultAvatar,
      sidebarMenuList: [{
        key: "baseInfo",
        value: "基本信息"
      }, {
        key: "safeInfo",
        value: "安全信息"
      }, {
        key: "companyInfo",
        value: "企业信息"
      },],
      menuDefaultActive: "baseInfo",
      menuDefaultActiveText: "基本信息",
      userModel: {
        avator: null,
        phone: null,
        corpName: null,
        userID: null,
        userName: null,
        corpCode: null,
        isAdmin: false,
      },
      baseInfoDialogVisible: false,
      personDialogVisible: false,
      baseInfoOpeType: null,
      userPhoneNumber: "xxxxxxxxxx",
      companyData: [],
      hadJoinCompany: false,
      corpId: null,
      companyDialogVisible: false,
      projectCreatorAvatorUrl: process.env.BASE_API + "/api/home/GetimgFile?fileUrl=",
      companyApplyData: [],
      encrypt
    };
  },
  mounted() {
    this.winHeight = window.innerHeight - 180
    this.signalr.off("rejectApply");
    this.signalr.on("rejectApply", (res) => {
      if (this.menuDefaultActive === "companyInfo") {
        this.loadData();
      }
    });
    this.signalr.off("accessApply");
    this.signalr.on("accessApply", async (res) => {
      if (this.menuDefaultActive === "companyInfo") {
        this.$success(res.msg);
        this.$store.state.user.user.systemIsPersonal = false;
        this.$store.state.user.user.corpIdbit = true;
        await loadPermittedRouterMap()
        local.setUser(this.$store.state.user.user);
        this.menuDefaultActiveText = "基本信息";
        this.menuDefaultActive = "baseInfo";
        this.loadData();
      }
    });
    var actived = local.getUserCenterMenuActived();
    if (actived) {
      this.menuDefaultActive = this.sidebarMenuList[actived].key;
      this.menuDefaultActiveText = this.sidebarMenuList[actived].value;
      local.removeUserCenterMenuActived();
    }
  },
  methods: {
    loadCompanyPerson() {
      this.$refs.opeDialog.loadPerson()
    },
    addperson() {
      this.personDialogVisible = true;
    },
    handleLinkToSpaceDetail() {
      local.setCorpRecordTabActived(0);
      this.$router.push("/corpDetail");
    },
    handleSelect(key, keyPath) {
      this.menuDefaultActive = key;
      this.menuDefaultActiveText = this.sidebarMenuList.filter((item) => {
        return item.key == key;
      })[0].value;
    },
    async loadData() {
      if (this.menuDefaultActive === "baseInfo") {
        var res = await postApi.get("/api/WebAccount/BaseInfo");
        if (res.code == 1) {
          this.userModel = res.data;
          if (this.userModel.corpCode) {
            this.hadJoinCompany = true;
          } else {
            this.hadJoinCompany = false;
          }
        }
      } else if (this.menuDefaultActive === "safeInfo") {
        res = await postApi.get("/api/WebAccount/BaseInfo");
        if (res.code === 1) {
          this.userPhoneNumber = res.data.phone;
        }
      } else {
        var res = await postApi.get("/api/WebAccount/BaseInfo");
        if (res.code == 1) {
          var userModel = res.data;
          if (userModel.corpCode) {
            this.hadJoinCompany = true;
            var companyRes = await postApi.get("/api/WebAccount/CompanyInfo");
            if (companyRes.code === 1) {
              this.companyData = [companyRes.data];
            }
          } else {
            this.hadJoinCompany = false;
            var companyApplyRes = await postApi.get("/api/WebAccount/CompanyApplyInfo");
            if (companyApplyRes.code === 1) {
              this.companyApplyData = companyApplyRes.data;
              console.log(this.companyApplyData);
            }
          }
        }
      }
    },
    editPersonalInfo() {
      this.baseInfoOpeType = "editUserInfo";
      this.baseInfoDialogVisible = true;
    },
    editPhone() {
      this.baseInfoOpeType = "editPhone";
      this.baseInfoDialogVisible = true;
    },
    editPwd() {
      this.baseInfoOpeType = "editPwd";
      this.baseInfoDialogVisible = true;
    },
    handleExitCompany() {
      this.$confirm("确认要退出当前企业吗？").then(async () => {
        var res = await postApi.post("/api/WebAccount/ExitCompany");
        if (res.code === 1) {
          this.$success(res.msg);
          this.loadData();
          this.$store.state.user.user.systemIsPersonal = true;
          this.$store.state.user.user.corpIdbit = false;
          local.setUser(this.$store.state.user.user);
          this.$router.go(0);
        }
      });
    },
    handleCheckCustom(row) {
      this.baseInfoOpeType = "checkCompanyPerson";
      this.corpId = row.corpId;
      this.baseInfoDialogVisible = true;
      // this.addfrom.fromPerAdd[0].enterpriseCode = this.corpId
    },
    handleJoinCompany() {
      this.baseInfoOpeType = "joinCompany";
      this.baseInfoDialogVisible = true;
    },
    handleCreateCompany() {
      this.companyDialogVisible = true;
    },
    backApply(row) {
      this.$confirm("确认要撤回吗？").then(async () => {
        var res = await postApi.post("/api/WebCompanyApply/BackApply", {
          ApplyId: row.iuid,
        });
        if (res.code == 1) {
          this.loadData();
        }
      });
    },
    reSubmit(row) {
      this.$confirm("确认要重新提交吗？").then(async () => {
        var res = await postApi.post("/api/WebCompanyApply/ReSubmit", {
          ApplyId: row.iuid,
        });
        if (res.code == 1) {
          this.loadData();
        }
      });
    },
    checkAdmin(row) {
      this.baseInfoOpeType = "checkCompanyAdmin";
      this.corpId = row.corpId;
      this.baseInfoDialogVisible = true;
    },
    removeApply(row) {
      this.$confirm("确认要删除吗？").then(async () => {
        var res = await postApi.post("/api/WebCompanyApply/RemoveApply", {
          ApplyId: row.iuid,
        });
        if (res.code == 1) {
          this.loadData();
        }
      });
    },
  },
};
</script>
<style>
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

.same .el-dialog__footer {
  text-align: center;
}

/* .el-dropdown {
  margin-right: 10px;
} */
.left .el-form-item__content {
  margin-left: 0 !important;
}
</style>
<style scoped lang="scss">
.contextmenu {
  margin: 0;
  padding: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  /* box-shadow: 1px 2px 3px 1px rgba(0, 0, 0, 0.3); */
  box-shadow: 1px 2px 3px 2px rgba(0, 0, 0, 0.08);
}

.contextmenu li {
  margin: 0;
  cursor: pointer;
  width: 128px;
  height: 32px;
  line-height: 32px;
  padding-left: 20px;
}

.contextmenu li:hover {
  background: #ebeef5;
}

.uploadFile {
  margin-right: 0;

  ::v-deep .el-upload-list {
    display: none;
  }

  ::v-deep button {
    padding: 7px 15px;
  }
}

.el-menu-item {
  padding-left: 29px;
  height: 38px;
  line-height: 38px;
}

.topTitle {
  text-align: center;
  padding-bottom: 30px;
}

.bottomCon {
  background: #f7f7f7;
  color: #424e67;
  // padding: 0 15px 15px 15px;
  margin-bottom: 20px;
}

.existing {
  flex: 1;
  padding-top: 17px;
}

.existingTit {
  justify-content: space-around;
  color: rgba(64, 158, 255, 1);
  padding-bottom: 17px;
}

.fileInfo {
  padding-left: 33px;
  line-height: 33px;
  color: gray;
}

.active {
  background: rgba(228, 233, 240, 1) !important;
}

.user-container {
  padding: 25px;
}

.userCenterBaseContent {
  overflow: hidden;
  text-overflow: ellipsis;
  height: 215px;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 40px;
  border: 1px solid #d8d8d8;
}

.userCenterBaseContentImg {
  position: relative;
  float: left;
}

.userCenterBaseContentImg img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.userCenterAvatarEdit {
  width: 120px;
  height: 120px;
  text-align: center;
  position: absolute;
  bottom: 3px;
  border-radius: 50%;
  color: white;
  overflow: hidden;
}

.userCenterAvatarEditBtn {
  background: rgba(0, 0, 0, 0.3);
  height: 30px;
  width: 100%;
  line-height: 30px;
}

.userCenterAvatarEdit:hover {
  cursor: pointer;
}

.userCenterUserInfo {
  width: calc(100% - 227px);
  max-width: 900px;
  margin-left: 100px;
}

.userCenterUserInfoItem {
  height: 38px;
  line-height: 38px;
  max-width: 330px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.userCenterUserInfoItemTitle {
  color: #979797;
  display: inline-block;
  width: 88px;
  text-align: right;
  height: 15px;
}

.userCenterUserInfoItemEdit {
  color: #006fff;
  font-size: 12px;
  margin-left: 10px;
}

.safetySettingItem {
  height: 150px;
  padding: 43px 0 38px 22px;
}

.safetySettingItemTextContainer {
  float: left;
  margin-left: 25px;
}

.safetySettingItemTextTop {
  margin-top: 10px;
  color: #333333;
  font-size: 16px;
}

.safetySettingItemTextBottom {
  color: #979797;
  margin-top: 16px;
}

.userCenterPageContent {
  height: calc(100vh - 88px)
}
</style>
