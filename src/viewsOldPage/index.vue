<template>
  <div class="login-container" :style="containerStyle">
    <div class="login-con-width login-conter">
      <el-form ref="loginForm" :style="{ transform: `scale(${100 / ratio})`, top: `${14000 / ratio}px` }" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="right-box">
          <div class="flex jc-center ai-center" style="width: 100%;flex-direction: column;" :style="{ marginBottom: operateState != 'login' ? '20px' : 0 }">
            <img v-if="$loginFormHead == 'logo'" :src="$loginFormLogo" :style="{ height: $loginLogoHeight }" alt="">
            <div v-else style="font-size: 16px;font-weight: 500;margin: 10px 0 5px;">{{ $webTitle }}</div>
          </div>
          <!-- 手机号 -->
          <el-form-item prop="phone" :label="operateState === 'login' ? '手机号' : ''">
            <!--<span class="svg-container">-->
            <!--  <img src="../../assets/bimImg/userName.png" style="vertical-align: middle; margin-top: -4px" />-->
            <!--</span>-->
            <el-input v-model="loginForm.phone" type="text" auto-complete="on" :laceholder="$t('base.button.inputPhoneNumber')" style="border: none !important; background: none !important" />
          </el-form-item>
          <!-- 获取验证码 -->
          <el-form-item prop="Code" v-if="verification">
            <!--<span class="svg-container">-->
            <!--  <img src="../../assets/bimImg/yanzheng.png" style="vertical-align: middle; margin-top: -4px" />-->
            <!--</span>-->
            <el-input v-model="loginForm.Code" name="Code" type="text" auto-complete="on" placeholder="请输验证码" style="border: none !important;background: none !important;width: 210px;" />
            <el-button type="primary" @click="getCode" style="float: right;" :disabled="disabled">{{ valiBtn }}
            </el-button>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" :label="operateState === 'login' ? '密码' : ''">
            <!--<span class="svg-container">-->
            <!--  <img src="../../assets/bimImg/passwordImg.png" style="vertical-align: middle; margin-top: -4px" />-->
            <!--</span>-->
            <el-input :type="pwdType" v-model="loginForm.password" @keyup.enter.native="keyLogin" name="password" auto-complete="on" placeholder="请输入密码" style="border: none !important; background: none !important">
              <div slot="suffix" class="flex ai-center" style="height: 40px;margin-right: 5px;line-height: 0;" @click="showPwd">
                <img v-if="pwdType == 'password'" class="eye-icon" src="@/assets/login/see.png">
                <img v-else class="eye-icon" src="@/assets/login/password.png">
              </div>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword" v-if="register">
            <!--<span class="svg-container">-->
            <!--  <img src="../../assets/bimImg/passwordImg.png" style="vertical-align: middle; margin-top: -4px" />-->
            <!--</span>-->
            <el-input :type="pwdType1" v-model="loginForm.confirmPassword" name="password" auto-complete="on" :placeholder="$t('base.button.inputPasswordAgain')" @keyup.enter.native="handleLogin" style="border: none !important; background: none !important">
              <div slot="suffix" class="flex ai-center" style="height: 40px;margin-right: 5px;line-height: 0;" @click="showPwd1">
                <img v-if="pwdType1 == 'password'" class="eye-icon" src="@/assets/login/see.png">
                <img v-else class="eye-icon" src="@/assets/login/password.png">
              </div>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div style="display: flex; align-items: center">
              <el-checkbox v-if="operateState === 'login'" v-model="rememberPwd">一周免登录</el-checkbox>
              <div style="flex-grow: 1"></div>
              <el-button type="text" @click="verificationShow" v-if="verificationhide">{{ verificationText == "忘记密码" ? "忘记密码" : "返回登录" }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item style="margin-bottom: 6px">
            <el-button :loading="registloading" v-if="operateState == 'regist'" type="primary" style="width: 100%" @click.native.prevent="handleRegist"> 注 册 </el-button>
            <el-button :loading="loginLoading" v-if="operateState == 'login'" type="primary" style="width: 100%" @click.native.prevent="handleLogin"> 登 录 </el-button>
            <el-button :loading="resetPwdLoading" v-if="operateState == 'resetPwd'" type="primary" style="width: 100%" @click.native.prevent="handleResetPwd"> 重置密码 </el-button>
          </el-form-item>
          <!-- <div class="tips" v-if="!$isOwner" style="text-align: center">
            <el-button type="text" @click="registerShow">{{ registerText == "立即注册" ? "没有账号？立即注册" : "已有账号？马上登录" }}
            </el-button>
          </div> -->
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import postApi from "@/api/document/indexApi.js";
import local from "@/utils/auth";
import Cookies from 'js-cookie'


import { detectZoom } from "@/utils/get-device-ratio"
import { encrypt, decrypt } from '@/utils'
import i18n from '../../static/locales'
export default {
  data() {
    var checkMobile = async (rules, value, callback) => {
      const regMobile = /^(0|86|17951)?1[0-9]{10}$/;
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputPhoneNumber')));
      } else if (regMobile.test(value) == true) {
        if (this.register) {
          var res = await postApi.post("/api/WebAccount/ValidateRegistPhone", {
            phone: value,
          });
          if (res.data.hasRegisted) {
            callback(new Error("此手机号已注册"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputPasswordAgain')));
      } else if (value !== this.loginForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var codeValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      rememberPwd: true,
      containerStyle: {
        background: `url(${this.$loginBottomLogo}) center 90vh, url(${this.$loginBackgroundImage}) center`,
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '270px, cover'
      },
      register: false, //注册
      verification: false, //验证
      verificationText: "忘记密码", //忘记密码 （忘记密码、登录）
      registerText: "立即注册", //立即注册 （立即注册、已有账号？马上登录）
      operateState: "login", // [login,regist]
      verificationhide: true,
      loginForm: {
        phone: "",
        username: "",
        unitinformation: '',
        password: "",
        EnterpriseCode: "",
        Code: "",
        timer: null,
        showloginCode: true,
        confirmPassword: "",
        count: "",
      },
      formHeight: 432,
      rules: {},
      loginRules: {
        Code: [{
          validator: codeValidate,
          trigger: "blur"
        }],
        phone: [{
          validator: checkMobile,
          trigger: "blur"
        }],
        password: [{
          required: true,
          trigger: "blur",
          pattern: /[\s\S]{6,20}/,
          message: i18n.t('base.button.inputPasswordOf6-20Digits'),
        },],
        confirmPassword: [{
          validator: validatePass2,
          trigger: "blur"
        }],
      },
      valiBtn: "获取验证码",
      disabled: false,
      loginLoading: false,
      registloading: false,
      resetPwdLoading: false,
      pwdType: "password",
      pwdType1: "password",
      ratio: 100,
    };
  },
  async created() {

  },
  mounted() {
    this.ratio = detectZoom()
    window.onresize = () => {
      this.ratio = detectZoom()
    }
    var page = local.getLoginOrRegistPageLink();
    if (page) {
      if (page == "login") {
        this.verificationText = "登录";
        this.verificationShow();
      } else {
        this.registerText = "立即注册";
        this.registerShow();
      }
      local.removeLoginOrRegistPageLink;
    }
    //获取url复制链接过来
    // formHeight = .innerHeight
    var url = location.href
    var index = url.indexOf('phoneNum=')
    if (index > -1) {
      this.loginForm.phone = url.slice(index + 9)
      this.loginForm.password = 'Ksj123456@'
    }
  },
  methods: {
    // 铁科院单点登录
    async tkyLogin() {
      const res = await this.$store.dispatch("TkyLogin");
      const token = local.getToken();
      this.signalr.invoke("loginConnnectAsync", token);
      var companyApplyRes = await postApi.get("/api/WebCompanyApply/QueryCompanyApply");
      if (companyApplyRes.code == 1) {
        this.$store.state.user.hasNotDealApply = companyApplyRes.data
      }
      this.$success(res.msg);
      this.$router.push("/");
    },
    keyLogin(e) {
      if (this.operateState == 'login') {
        this.handleLogin()
      }
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    showPwd1() {
      if (this.pwdType1 === "password") {
        this.pwdType1 = "";
      } else {
        this.pwdType1 = "password";
      }
    },
    async handleRegist() {
      var resultList = [];
      this.$refs.loginForm.validateField(
        ["phone", "password", "Code", "confirmPassword"], async (valid) => {
          resultList.push(valid);
        });
      var result = resultList.every((item) => {
        return item === "";
      });
      if (result) {
        let formData = new FormData();
        formData.append("phone", this.loginForm.phone);
        formData.append("password", encrypt(this.loginForm.password));
        formData.append("Code", this.loginForm.Code);
        formData.append("EnterpriseCode", this.loginForm.EnterpriseCode);
        formData.append("username", this.loginForm.username);
        formData.append("unitinformation", this.loginForm.unitinformation);
        var res = await postApi.post("/api/Home/Register", formData);
        if (res.code === 1) {
          this.$success(res.msg);
          this.operateState = "login";
          this.registerText = "立即注册";
          this.register = false;
          this.verification = false;
          this.verificationhide = true;
        }
      }
    },
    // 开始登录
    async handleLogin() {
      var resultList = [];
      this.$refs.loginForm.validateField(["phone", "password"], (valid) => {
        resultList.push(valid);
      });
      var result = resultList.every((item) => {
        return item === "";
      });
      if (result || this.$route.query.Mode == "Admin") {
        this.loginLoading = true;
        var formData = new FormData();
        formData.append("application", "web");
        formData.append("minutes", this.rememberPwd ? 10080 : 120);
        formData.append("phone", this.loginForm.phone);
        formData.append("password", encrypt(this.loginForm.password));
        const res = await this.$store.dispatch("AdminLogin", formData);
        if (res.code === 1) {
          this.$store.commit('SET_PERSONAL', !res.data.corpIdbit)
          if (res.data.tryOut) {
            const h = this.$createElement;
            this.$msgbox({
              title: "提示",
              message: h("p", null, [h("span", null, "即将开始试用，试用期限为"), h("i", { style: "color: red" }, "1个月"), h("span", null, "，确认要开始试用吗？")]),
              showCancelButton: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              beforeClose: async (action, instance, done) => {
                if (action === "confirm") {
                  instance.confirmButtonLoading = true;
                  instance.confirmButtonText = "执行中...";
                  var res = await postApi.post("/api/WebOrder/TryOut");
                  if (res.code === 1) {
                    done();
                    instance.confirmButtonLoading = false;
                  }
                } else {
                  this.$store.dispatch("LogOut").catch(() => {});
                  done();
                }
              },
            }).then((action) => {
              const token = local.getToken();
              this.signalr.invoke("loginConnnectAsync", token);
              this.$success(res.msg);
              this.$router.push("/");
            });
          } else {
            const token = local.getToken();
            this.signalr.invoke("loginConnnectAsync", token);
            var companyApplyRes = await postApi.get("/api/WebCompanyApply/QueryCompanyApply");
            if (companyApplyRes.code == 1) {
              this.$store.state.user.hasNotDealApply = companyApplyRes.data
            }
            this.$success(res.msg);
            this.$router.push("/");
            // request.post('/api/ProjectFile/GetUserProjectFileInfor').then(res => {
            //   if (res.data && res.data.length) {
            //     const data = res.data[0]
            //
            //     if (data.whetherToEnter === '是' && data.mainIUID && data.projectName) {
            //       console.log(1)
            //       this.$router.push(`/projectFile?projectId=${data.mainIUID}&projectName=${data.projectName}&projectIsPictureMode=true&path=%2Fall`);
            //     } else {
            //       console.log(2)
            //       this.$router.push("/");
            //     }
            //   } else {
            //     this.$router.push("/");
            //   }
            // })
          }
        }
        this.loginLoading = false;
      }
    },
    //获取验证码
    getCode() {
      if (this.loginForm.phone && this.loginForm.phone.length == 0) {
        this.$refs.loginForm.resetFields();
      }
      this.$refs.loginForm.validateField("phone", async (valid) => {
        if (!valid) {
          this.tackBtn(); //验证码倒数60秒
          let fd = new FormData(); //POST 请求需要 转化为Form
          fd.append("phone", this.loginForm.phone);
          var res = await postApi.post(this.operateState == "resetPwd" ? "/api/Home/Modifypassword" : "/api/Home/SendRegisterSms", fd);
          if (res.code === 1) {
            this.$success(res.msg);
          }
        }
      });
    },
    async handleResetPwd() {
      var resultList = [];
      this.$refs.loginForm.validateField(
        ["phone", "password", "Code"], async (valid) => {
          resultList.push(valid);
        });
      var result = resultList.every((item) => {
        return item === "";
      });
      if (result) {
        this.resetPwdLoading = true;
        var formData = new FormData();
        formData.append("phone", this.loginForm.phone);
        formData.append("password", encrypt(this.loginForm.password));
        formData.append("Code", this.loginForm.Code);
        var res = await postApi.post("/api/Home/ModifypasswordUpdate", formData);
        if (res.code === 1) {
          this.$success(res.msg);
          this.operateState = "login";
          this.registerText = "立即注册";
          this.register = false;
          this.verification = false;
          this.verificationhide = true;
        }
        this.resetPwdLoading = false;
      }
    },
    tackBtn() {
      //验证码倒数60秒
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.valiBtn = "获取验证码";
          this.disabled = false;
        } else {
          this.disabled = true;
          this.valiBtn = time + "秒后重试";
          time--;
        }
      }, 1000);
    },
    //注册显示内容
    registerShow() {
      this.$refs.loginForm.resetFields();
      if (this.registerText == "立即注册") {
        this.operateState = "regist";
        this.registerText = "已有账号？马上登录";
        this.verificationText = "忘记密码";
        this.register = true;
        this.verification = true;
        this.verificationhide = false;
      } else if (this.registerText == "已有账号？马上登录") {
        this.operateState = "login";
        this.registerText = "立即注册";
        this.register = false;
        this.verification = false;
        this.verificationhide = true;
      }
    },
    //忘记密码显示内容
    verificationShow() {
      this.$refs.loginForm.resetFields();
      if (this.verificationText == "忘记密码") {
        this.operateState = "resetPwd";
        this.verification = true;
        this.verificationText = "登录";
      } else if (this.verificationText == "登录") {
        this.operateState = "login";
        this.verificationText = "忘记密码";
        this.verification = false;
      }
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #303133;

.login-container {
  // position: fixed;
  width: 100vw;
  height: 100vh;

  .el-input {
    display: inline-block;
    height: 40px;
    width: 100%;
    background: #fff !important;

    &.el-input--suffix {
      overflow: inherit;
    }

    input {
      /* background: transparent; */
      background: #fff !important;
      border: 0px;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 1) inset !important;
        -webkit-text-fill-color: #c0c4cc !important;
        -webkit-background-clip: text;
        padding: 0 15px 0 15px;
      }
    }
  }

  .el-form-item {
    border-radius: 4px;
    color: #454545;
  }

  .login-form {
    transform-origin: top center;
    position: absolute;
    left: calc(50% - 180px);
    width: 360px;
    top: 100px;
    // margin-top: 9%;
    background: rgba(255, 255, 255, 1);
    padding: 15px;
    border-radius: 14px;
    /* margin: 120px auto; */
  }

  .tips {
    font-size: 14px;
    height: 40px;
    /* color: #fff; */
    /* margin-bottom: 10px; */
    // .el-button--text {
    //   color: #999999;
    // }
    // .el-button--text:focus,
    // .el-button--text:hover {
    //   color: #66b1ff;
    //   border-color: transparent;
    //   background-color: transparent;
    // }
  }

  .svg-container {
    padding: 0px 28px 0px 12px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    position: absolute;
    z-index: 1;
    display: inline-block;
    border-right: 1px solid #dcdfe6;
  }

  .title {
    font-size: 18px;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    line-height: 25px;
    color: $light_gray;
    margin: 0px auto 28px auto;
    text-align: center;
  }

  .eye-icon {
    width: 24px;
    height: 24px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.logo_banner {
  height: 72px;
  background-color: #fff;
}

.login-con-width {
  display: flex;
}

.login-conter {
  height: 100%;
  overflow: auto;

  >div {
    flex-shrink: 0;
    flex-grow: 0;

    &:nth-child(1) {
      // color: #ffffff;
      width: 100%;
      // background: #2D41FA url("../../assets/login-bg.png") top left/100% 100% no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;

      // justify-content: space-between;
      // padding: 47% 0 3% 0;
      >.left-title1 {
        font-size: 32px;
        display: flex;
        align-items: center;
        margin-bottom: 50px;
        margin-top: 40px;

        .version {
          color: #4254fe;
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 14px;
          background: #ffffff;
          margin-left: 10px;
        }
      }

      .left-sub-title1 {
        // font-size: 32px;
        font-size: 25px;
        margin-bottom: 100px;
      }

      div {
        text-align: center;
        margin-bottom: 280px;

        .logo1 {
          width: 75%;
        }

        .logo2 {
          width: 80%;
          margin-top: -23%;
        }

        .logo3 {
          width: 80%;
          margin-bottom: 25px;
        }
      }
    }
  }
}

.titlestyle {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #303133;
  line-height: 12px;
  padding: 14px 0;
  display: flex;
}

.svg_input {
  position: relative;
}

.login-conter .el-form-item {
  margin-bottom: 20px;
}

.svg_input {
  position: relative;
}

.copyright {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #fff;
  line-height: 20px;
  text-align: center;
  position: absolute;
  bottom: 33px;
  left: 0;
  right: 0;
}

.a_title {
  font-family: "PingFangSC-Regular";
  font-size: 24px;
  letter-spacing: 0;
  line-height: 42px;
  color: #303133;
  padding: 0px 12px;
  margin: 5px 0;
  /* letter-spacing: 1.43px; */
  border-right: 1px solid #c0c4cc;
}

.b_title {
  font-family: "PingFangSC-Regular";
  font-size: 23px;
  color: #303133;
  padding: 14px 12px;
}

.login-con-width ul li {
  float: left;
}

.left-box {
  width: 718px;
  float: left;
  // background: url("../../assets/bimImg/CSC-360.png") no-repeat;
  height: 533px;
  background-size: 100% 100%;
  position: relative;
}

.right-box {
  >.title {
    font-weight: bold;
  }
}

.bimdiv {
  width: 76px;
  margin: 0 auto;
  position: relative;
  animation: myfirst 5s infinite;
}

@keyframes myfirst {
  0% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(0px, 60px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.cloud {
  width: 64px;
  height: 50px;
  position: relative;
  animation: cloud 160s infinite;
}

@keyframes cloud {
  0% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(650px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

// .login-conter .el-input__inner {
//   padding: 0 15px 0 50px !important;
// }
.left-title {
  font-size: 32px;
  font-family: "PingFangSC-Medium", "PingFang SC";
  font-weight: 500;
  color: #ffffff;
  line-height: 45px;
  letter-spacing: 8px;
  text-align: center;
}
</style>
