<template>
  <el-dialog class="people-info" v-dialogDrag append-to-body :title="dialogTitle" :close-on-click-modal="false" :modal="true" :width="opeType == 'checkCompanyPerson' ? '650px' : '425px'" :visible.sync="dialogVisible" :before-close="handleClose">
    <div v-if="opeType == 'joinCompany'">
      <el-form ref="companyJoinForm" :model="companyJoinForm" :rules="companyJoinFormRules" label-width="120px" size="small">
        <el-form-item label="企业名称：" prop="name">
          <el-select style="width: 244px;" v-model="companyJoinForm.name" value-key="value" remote :remote-method="getCompanyList" filterable placeholder="请输入企业名称" clearable @clear="handleClear" @change="corpChange">
            <el-option v-for="item in companyList" :key="item.corpId" :label="item.corpName" :value="item.corpName" />
          </el-select>
          <!-- <el-input v-model="companyJoinForm.name" placeholder="请输入企业名称"></el-input> -->
        </el-form-item>
        <el-form-item label="组织机构代码：" prop="code">
          <el-input style="width: 244px;" :disabled="codeDisable" v-model="companyJoinForm.code" placeholder="请输入组织机构代码"></el-input>
          <div class="joinTit">如还未开通企业版，请联系跨世纪官方客服</div>
        </el-form-item>
        <el-form-item :label="$t('base.label.name')" prop="userName">
          <el-input style="width:50%" v-model="companyJoinForm.userName"></el-input>
          <el-checkbox style="margin-left:10px" v-model="companyJoinForm.useUserName">同时作为姓名</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="opeType == 'checkCompanyPerson'">
      <div class="flex ai-center">
        <el-radio-group v-model="activeName" size="mini">
          <el-radio-button :label="1">查看人员</el-radio-button>
          <el-radio-button v-if="applyUserTabVisible" :label="2"> 新人员申请 <div style="position: absolute;width: 8px;height: 8px;border-radius: 50%;background-color: #FF3300;right: 6px;top: 3px;" v-if="hasNotDealApply"></div>
          </el-radio-button>
          <el-button size='mini' @click="addPerson" style="vertical-align: middle;margin-left: 10px;">{{$t('base.button.create')}}</el-button>
        </el-radio-group>
        <div style="font-size: 14px;margin-left: auto;display: inline-block;font-weight: 500;color:#777">{{ corpName }}</div>
      </div>

      <div style="margin-top: 10px">
        <table class="companyPersonTable" v-if="activeName == 1">
          <tr>
            <td width="50">序号</td>
            <td>手机号</td>
            <td>姓名</td>
            <td width="210">操作</td>
          </tr>
          <template v-if="companyPersonData && companyPersonData.length > 0">
            <tr v-for="(item, index) in companyPersonData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.userName }}</td>
              <td>
                <template v-if="item.isAdmin && item.power">
                  <el-link type="danger" style="margin-right: 10px" @click="handleDeleteUser(item)">{{ $t('base.button.delete') }}</el-link>
                  <el-link type="primary" style="margin-right: 10px" v-if="!item.isadministrator" @click="handleSetUserAdmin(item)">设为管理员</el-link>
                  <el-link type="primary" style="margin-right: 10px" v-else @click="handleSetUserAdmin(item, true)">取消管理员</el-link>
                  <el-link type="danger" style="margin-right: 10px" v-if="!item.invitebit" @click="copyUser(item)">复制链接</el-link>
                </template>
              </td>
            </tr>
          </template>
          <tr v-else style="text-align: center">
            <td colspan="5">{{ $t('base.button.noData') }}</td>
          </tr>
        </table>
        <table class="companyPersonTable" v-else>
          <tr>
            <td width="50">序号</td>
            <td width="130">手机号</td>
            <td>姓名</td>
            <td>申请时间</td>
            <td>操作</td>
          </tr>
          <template v-if="companyApplyPersonData && companyApplyPersonData.length > 0">
            <tr v-for="(item, index) in companyApplyPersonData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.userName }}</td>
              <td>{{ $dayjs(item.createTime, "YYYY-MM-DD HH:mm:ss") }}</td>
              <td>
                <template v-if="item.operateStatus == 2">
                  <el-link type="danger" style="margin-right: 10px" @click="handleRejectApply(item)">拒绝</el-link>
                  <el-link type="primary" @click="handleApproveApply(item)">通过</el-link>
                </template>
                <el-tag type="success" size="small" v-if="item.operateStatus == 1">已通过</el-tag>
                <el-tag type="danger" size="small" v-if="item.operateStatus == 0">已拒绝</el-tag>
              </td>
            </tr>
          </template>
          <tr v-else style="text-align: center">
            <td colspan="5">{{ $t('base.button.noData') }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="opeType == 'checkCompanyAdmin'">
      <div style="margin-top: 10px">
        <table class="companyPersonTable">
          <tr>
            <td width="50">序号</td>
            <td width="130">手机号</td>
            <td>姓名</td>
            <td>角色</td>
          </tr>
          <template v-if="companyAdminData && companyAdminData.length > 0">
            <tr v-for="(item, index) in companyAdminData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.userName }}</td>
              <td>管理员</td>
            </tr>
          </template>
          <tr v-else style="text-align: center">
            <td colspan="4">{{ $t('base.button.noData') }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="opeType == 'editUserInfo'" class="passDiv">
      <el-form ref="personalForm" :model="personalForm" :rules="personalFormRules" label-width="80px" size="small">
        <el-form-item label="头像：" prop="avator">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-change="fileListChange" :auto-upload="false" accept="image/*">
            <img v-if="userAvator" :src="userAvator" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <div class="joinTit" style="color: #3296fa">修改头像</div> -->
        </el-form-item>
        <el-form-item prop="userName" :label="$t('base.label.name')">
          <el-input v-model="personalForm.userName" placeholder="请输入姓名"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="opeType == 'editPwd'">
      <el-form ref="passForm" :rules="passsFormRules" :model="passForm" label-width="100px" size="small">
        <el-form-item prop="oldPwd" label="原密码：">
          <el-input v-model="passForm.oldPwd" show-password placeholder="请输入原密码"></el-input>
          <!-- <div class="joinTit"> 如忘记密码，请在手机钉钉上使用验证码登入，即可重置密码。 </div> -->
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码：">
          <el-input v-model="passForm.newPwd" show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd" label="确认密码：">
          <el-input v-model="passForm.confirmPwd" show-password placeholder="再次输入密码"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="opeType == 'editPhone'">
      <el-form ref="editPhoneForm" :model="editPhoneForm" label-width="80px" :rules="editPhoneRules" size="small">
        <el-form-item v-if="editPhoneStep == 1" :label="$t('base.label.phone')" class="editPhoneFormItem">
          <div style="display: flex" class="phoneInput PhoneIpt">
            <div class="iconfont icon-shoujihao phone"></div>
            <el-input v-model="editPhoneForm.oldPhone" disabled size="small"></el-input>
          </div>
        </el-form-item>
        <el-form-item v-if="editPhoneStep == 2" label="新手机号" prop="phone" class="editPhoneFormItem">
          <div style="display: flex;" class="phoneInput PhoneIpt">
            <div class="iconfont icon-shoujihao phone"></div>
            <el-input v-model="editPhoneForm.phone" placeholder="请输入新手机号" size="small"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="code" label="验证码" class="editPhoneFormItem">
          <div style="display: flex;" class="phoneInput code">
            <div class="iconfont icon-verify phone"></div>
            <el-input v-model="editPhoneForm.code" placeholder="请输入验证码" size="small"></el-input>
            <el-button type="primary" style="margin-left: 12px" size="small" @click="getSmsCode">获取验证码</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-button @click="handleNextStep" v-if="editPhoneStep == 1" type="primary" style="width: 100%; margin: 28px 0" size="small">下一步</el-button>
      <el-button @click="handleEditPhone" v-else type="primary" style="width: 100%; margin: 28px 0" size="small">确定修改</el-button>
    </div>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button type="primary" @click="sure" v-if="opeType != 'checkCompanyPerson'" size="small">{{ opeType == "joinCompany" ? "申 请" : $t('base.button.confirm') }}</el-button>
      <el-button @click="handleClose" size="small">{{ $t('base.button.cancel') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import postApi from "@/api/document/indexApi.js";
import local from "@/utils/auth";
import {
  mapGetters
} from "vuex";
import {
  encrypt
} from '@/utils'
import i18n from '../../static/locales'
var checkMobile = (rules, value, callback) => {
  const regMobile = /^(0|86|17951)?1[0-9]{10}$/;
  if (regMobile.test(value) == true) {
    return callback();
  } else {
    callback(new Error("请输入合法的手机号"));
  }
};
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    opeType: {
      type: String,
    },
    corpId: {
      type: String,
    },
    corpName: {
      type: String,
    },
    userModel: {
      type: Object | null,
    },
    reload: {
      type: Function
    }
  },
  watch: {
    userModel(val) {
      this.editPhoneForm.oldPhone = val.phone
    },
    activeName() {
      if (this.activeName == 2) {
        this.loadCompanyApplyPerson();
      } else {
        this.loadPerson();
      }
    },
    dialogVisible: {
      handler() {
        this.applyUserTabVisible = this.$route.name != "companyManagement";
        if (this.dialogVisible) {
          if (this.$refs.editPhoneForm) {
            this.editPhoneStep = 1;
            this.$refs.editPhoneForm.resetFields();
          }
          if (this.$refs.passForm) {
            this.$refs.passForm.resetFields();
          }
          if (this.$refs.personalForm) {
            this.$refs.personalForm.resetFields();
            this.userAvator = null;
          }
          if (this.$refs.companyJoinForm) {
            this.$refs.companyJoinForm.resetFields();
          }
          if (this.opeType === "checkCompanyPerson") {
            this.signalr.off("companyApply1");
            this.signalr.on("companyApply1", (res) => {
              if (this.activeName == 2) {
                this.loadCompanyApplyPerson();
              }
            });
            if (this.activeName == 2) {
              this.$store.state.user.hasNotDealApply = false;
              this.loadCompanyApplyPerson();
            } else {
              this.loadPerson();
            }
          }
          if (this.opeType === "checkCompanyAdmin") {
            this.loadCompanyAdmin();
          }
          if (this.opeType == "editUserInfo") {
            if (this.userModel.ddUserAvatar) {
              this.userAvator = process.env.BASE_API + "/api/home/GetimgFile?fileUrl=" + encodeURIComponent(encrypt(this.userModel.ddUserAvatar));
            }
            this.personalForm.userName = this.userModel.userName;
          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["clientHeight", "hasNotDealApply"]),
    dialogTitle() {
      let title = false;
      switch (this.opeType) {
        case "joinCompany":
          title = "加入企业";
          break;
        case "editUserInfo":
          title = "修改个人信息";
          break;
        case "editPwd":
          title = "修改密码";
          break;
        case "editPhone":
          title = "修改手机号";
          break;
        case "checkCompanyPerson":
          title = "人员信息";
          break;
        case "checkCompanyAdmin":
          title = "查看管理员";
          break;
        default:
          title = "标题";
      }
      return title;
    },
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputNewPassword')));
      } else if (value == this.passForm.oldPwd) {
        callback(new Error(i18n.t('base.button.errorPassword')));
      } else if (!/[\s\S]{6,20}/.test(value)) {
        callback(new Error(i18n.t('base.button.inputPasswordOf6-20Digits')));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputPasswordAgain')));
      } else if (value !== this.passForm.newPwd) {
        callback(new Error(i18n.t('base.button.errorPassword2')));
      } else {
        callback();
      }
    };
    return {
      codeDisable: false,
      companyList: [],
      companyAdminData: null,
      activeName: 1,
      applyUserTabVisible: false,
      companyJoinForm: {
        code: null,
        name: null,
        userName: null,
        useUserName: true
      },
      companyJoinFormRules: {
        code: [{
          required: true,
          message: "请输入18位组织机构代码",
          trigger: "blur"
        }],
        name: [{
          required: true,
          message: "请输入企业名称",
          trigger: "blur"
        }],
        userName: [{
          required: true,
          message: "请输入姓名",
          trigger: "blur"
        }]
      },
      passForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: null,
      },
      passsFormRules: {
        oldPwd: [{
          required: true,
          message: "请输入原密码",
          trigger: "blur"
        }],
        newPwd: [{
          validator: validatePass1,
          trigger: "blur"
        }],
        confirmPwd: [{
          validator: validatePass2,
          trigger: "blur"
        }],
      },
      editPhoneForm: {
        oldPhone: null,
        phone: null,
        code: null,
      },
      editPhoneStep: 1,
      personalForm: {
        userName: "",
        avator: null,
      },
      personalFormRules: {
        userName: [{
          required: true,
          message: "请输入姓名",
          trigger: "blur"
        }],
      },
      userAvator: null,
      editPhoneRules: {
        code: [{
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        }],
        phone: [{
          required: true,
          message: i18n.t('base.button.inputPhoneNumber'),
          trigger: "blur"
        }, {
          validator: checkMobile,
          trigger: "blur"
        },],
      },
      companyPersonData: null,
      companyApplyPersonData: null,
    };
  },
  // inject: ["reload"],
  methods: {
    corpChange(e) {
      this.companyJoinForm.code = this.companyList.filter(item => item.corpName == e)[0].corpId;
      this.codeDisable = true
    },
    handleClear() {
      this.codeDisable = false;
      this.companyList = []
    },
    async getCompanyList(e) {
      let form = new FormData();
      form.append('CorpName', e)
      form.append('page', 1)
      form.append('rows', 999)
      let res = await postApi.post('/api/WebCompanyApply/GetCorpId', form)
      if (res.code == 1) {
        this.companyList = res.data;
        this.$forceUpdate()
      }
    },
    copyUser(item) {
      let downloadUrl = location.origin + location.pathname + '#/login?phoneNum=' + item.phone
      let input = document.createElement('input')
      input.value = downloadUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('复制成功')
    },
    handleRejectApply(row) {
      this.$confirm("确认要拒绝此申请吗?").then(async () => {
        var res = await postApi.post("/api/WebCompanyApply/RejectApply", {
          UserApplyHistoryId: row.iuid,
        });
        if (res.code === 1) {
          this.loadCompanyApplyPerson();
        }
      });
    },
    async handleApproveApply(row) {
      this.$confirm("确认要同意此申请吗?").then(async () => {
        var res = await postApi.post("/api/WebCompanyApply/AccessApply", {
          UserApplyHistoryId: row.iuid,
        });
        if (res.code === 1) {
          this.loadCompanyApplyPerson();
        }
      });
    },
    async loadCompanyAdmin() {
      var res = await postApi.get("/api/WebAccount/GetCorpAdmin", {
        corpId: this.corpId,
      });
      if (res.code === 1) {
        this.companyAdminData = res.data;
      }
    },
    async loadCompanyApplyPerson() {
      var res = await postApi.get("/api/WebAccount/CheckCompanyApplyPerson", { corpId: this.corpId });
      if (res.code === 1) {
        this.companyApplyPersonData = res.data;
      }
    },
    async loadPerson() {
      var res = await postApi.get("/api/WebAccount/CheckCompanyPerson", {
        corpId: this.corpId,
      });
      if (res.code === 1) {
        this.companyPersonData = res.data;
      }
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    addPerson() {
      this.$emit("addperson");
    },
    sure() {
      switch (this.opeType) {
        case "joinCompany":
          this.$refs.companyJoinForm.validate((valid) => {
            if (valid) {
              this.$confirm("一个账号只能加入一个企业，新加入或创建企业将自动将原来的申请撤回，请确定是否继续").then(async () => {
                var res = await postApi.post("/api/WebAccount/JoinCompany", this.companyJoinForm);
                var inknowledgeBaseLayout = this.$route.matched.some((item) => {
                  if (item.components && item.components.default && item.components.default.name) {
                    return (item.components.default.name == "knowledgeBaseLayout");
                  } else {
                    return false;
                  }
                });
                if (res.code === 1) {
                  this.$success(res.msg);
                  this.$emit("update:dialogVisible", false);
                  this.$emit("reload", null);
                }
              });
            }
          });
          break;
        case "editUserInfo":
          this.$refs.personalForm.validate(async (valid) => {
            if (valid) {
              var form = this.$objectToFormData(this.personalForm);
              var res = await postApi.post("/api/WebAccount/Save", form);
              if (res.code === 1) {
                this.$success(res.msg);
                var res = await postApi.get("/api/WebAccount/BaseInfo");
                if (res.code === 1) {
                  this.$store.state.user.user.avatar = res.data.ddUserAvatar;
                  this.$store.state.user.user.username = res.data.userName;
                  local.setUser(this.$store.state.user.user);
                }
                this.$emit("reload", null);
              }
              this.$emit("update:dialogVisible", false);
            }
          });
          break;
        case "editPwd":
          this.$refs.passForm.validate((valid) => {
            if (valid) {
              this.$confirm("修改密码后将会退出当前账号，确定要继续吗？").then(async () => {
                var res = await postApi.post("/api/WebAccount/EditPwd", this.passForm);
                if (res.code === 1) {
                  this.$success(res.msg);
                  setTimeout(() => {
                    this.$store.dispatch("LogOut").catch(() => {});
                    this.$router.push("/login");
                  }, 1000);
                }
              });
            }
          });
          break;
        case "editPhone":
          break;
        case "checkCompanyAdmin":
          this.$emit("update:dialogVisible", false);
          break;
        default:
          title = "标题";
      }
    },
    fileListChange(file, fileList) {
      var _self = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (e) {
        _self.userAvator = e.currentTarget.result;
        _self.personalForm.avator = file.raw;
      };
    },
    async getSmsCode() {
      if (!this.editPhoneForm.oldPhone) {
        this.$refs.editPhoneForm.resetFields();
      }
      // var resultList = [];
      // this.$refs.editPhoneForm.validateField(["phone"], (valid) => {
      //   resultList.push(valid);
      // });
      // var result = resultList.every((item) => {
      //   return item === "";
      // });
      // if (result) {
      var res = await postApi.post("/api/WebAccount/SendEditPhoneSms", {
        phone: this.editPhoneStep == 1 ? this.editPhoneForm.oldPhone : this.editPhoneForm.phone,
      });
      if (res.code == 1) {
        this.$success(res.msg);
      }
      // }
    },
    handleNextStep() {
      this.$refs.editPhoneForm.validate(async (valid) => {
        if (valid) {
          let query = {
            phone: this.editPhoneForm.oldPhone,
            code: this.editPhoneForm.code
          }
          var res = await postApi.post("/api/WebAccount/EditPhoneFirstStep", query);
          if (res.code == 1) {
            this.editPhoneStep += 1;
            this.editPhoneForm.code = null
          }
        }
      });
    },
    handleEditPhone() {
      this.$refs.editPhoneForm.validate(async (valid) => {
        if (valid) {
          let query = {
            phone: this.editPhoneForm.phone,
            code: this.editPhoneForm.code
          }
          var res = await postApi.post("/api/WebAccount/EditPhone", query);
          if (res.code == 1) {
            this.$success(res.msg);
            this.$emit("reload", null);
            this.$emit("update:dialogVisible", false);
            this.editPhoneStep = 1;
            this.editPhoneForm.phone = null
            this.editPhoneForm.code = null
          }
        }
      });
    },
    handleDeleteUser(row) {
      this.$confirm("确认要删除此用户吗？").then(async () => {
        var res = await postApi.post("/api/WebAccount/RemoveUser", {
          userId: row.userId,
        });
        if (res.code === 1) {
          this.loadPerson()
          this.$success(res.msg);
        }
      });
    },
    handleSetUserAdmin(row, isCancel) {
      this.$confirm("确认要" + (isCancel ? "取消" : "设置") + "此用户为管理员吗？").then(async () => {
        var res = await postApi.post("/api/WebAccount/SetAdmin", {
          userId: row.userId,
        });
        if (res.code === 1) {
          this.$success(res.msg);
          this.loadPerson();
        }
      });
    },
  },
};
</script>
<style scoped>
.joinTit {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 14px;
  padding: 8px 0;
}

.passDiv::v-deep.avatar-uploader,
.el-upload,
.el-icon-plus,
img {
  width: 188px;
  height: 188px;
  line-height: 180px;
  font-size: 32px;
}

.phone {
  width: 40px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #d8d8d8;
  border-radius: 4px 0px 0px 4px;
  font-size: 19px;
  text-align: center;
  flex-shrink: 0;
  border-right-width: 0px;
}

.phoneInput::v-deep.el-input__inner {
  border-radius: 0 4px 4px 0;
}

.code::v-deep.el-input {
  width: 68%;
}

.PhoneIpt::v-deep.el-input {
  width: 91%;
}


.editPhoneFormItem::v-deep.el-form-item__content {
  margin-left: 0 !important;
}

.companyPersonTable {
  border-collapse: collapse;
  width: 100%;
}

.companyPersonTable td {
  padding-left: 14px;
}

.companyPersonTable tr {
  border: 1px solid #d8dce6;
  height: 40px;
  line-height: 37px;
}
</style>
<style>
.people-info .el-dialog {
  margin-top: 10vh !important
}

.people-info .el-dialog__body {
  max-height: 70vh;
  overflow: auto;
}
</style>
