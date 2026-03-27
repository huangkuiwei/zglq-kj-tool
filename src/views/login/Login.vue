<template>
  <div class="login-container" :style="containerStyle">
    <div class="login-conter">
      <div class="flex column ai-center"
        :style="{ marginTop: `${14000 / ratio}px`, fontWeight: 'bold', fontSize: '28px' }">
        <div v-if="$deployName == 'luqiao'" style="text-shadow:1px 1px 5px #00000055">
          {{ $t('login.title') }}
        </div>
        <el-form ref="loginForm"
          :style="{ transform: `scale(${100 / ratio} )`, top: `${14000 / ratio + ($deployName == 'luqiao' ? 60 : 0)}px` }"
          :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <!-- <el-form ref="loginForm" :style="{ transform: `scale(${100 / ratio})`, top: `${14000 / ratio + 60}px` }" :model="loginForm" label-suffix=":" size="default" :rules="loginRules" class="login-form" auto-complete="on" label-width="88px"> -->
          <div class="right-box">
            <div class="flex jc-center ai-center" v-if="$loginLogoHeight" style="width: 100%;padding-bottom: 20px;">
              <img v-if="$loginFormHead == 'logo'" :src="$loginFormLogo"
                :style="{ height: $deployName == 'wp' ? '24px' : '52px' }" alt="">
              <div v-else style="font-size: 16px;font-weight: 500;margin: 10px 0 5px;">{{ $webTitle }}</div>
            </div>
            <!-- 手机号 -->
            <el-form-item prop="phone" key="phone" :label="$t('login.account')">
              <el-input v-model="loginForm.phone" type="text" autocomplete="on"
                :placeholder="$t('base.placeholder.account')"
                style="width: 100%;border: none !important; background: none !important" />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password" key="password" :label="verification?$t('login.newPassword'):$t('login.password')">
              <el-input :type="pwdType" ref="loginPwd" :key="verification + '1'" autocomplete="on"
                v-model="loginForm.password" @keyup.enter.native="keyLogin" name="password"
                :placeholder="verification?$t('base.placeholder.newPassword'):$t('base.placeholder.password')"
                style="width: 100%;border: none !important; background: none !important">
                <div slot="suffix" class="flex ai-center"
                  style="height: 40px;margin-right: 5px;line-height: 0;opacity: .5;" @click="showPwd">
                  <img v-if="pwdType == 'password'" class="eye-icon" src="@/assets/login/see.png">
                  <img v-else class="eye-icon" src="@/assets/login/password.png">
                </div>
              </el-input>
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item prop="confirmPassword" key="confirmPassword" :label="$t('login.confirmPassword')"
              v-if="verification">
              <el-input :type="pwdType" ref="loginPwd" :key="verification + '2'" autocomplete="off"
                v-model="loginForm.confirmPassword" name="confirmPassword"
                :placeholder="$t('base.placeholder.password2')"
                style="width: 100%;border: none !important; background: none !important">
                <div slot="suffix" class="flex ai-center"
                  style="height: 40px;margin-right: 5px;line-height: 0;opacity: .5;" @click="showPwd">
                  <img v-if="pwdType == 'password'" class="eye-icon" src="@/assets/login/see.png">
                  <img v-else class="eye-icon" src="@/assets/login/password.png">
                </div>
              </el-input>
            </el-form-item>
            <!-- 获取注册验证码 -->
            <el-form-item prop="Code" key="code" :label="$t('login.code')" v-if="verification && $deployName != 'luqiao'">
              <div class="flex jc-between" style="width:100%">
                <el-input v-model="loginForm.Code" key="loginForm1" autocomplete="on"
                  :placeholder="$t('base.placeholder.code')"
                  style="width: calc(100% - 122px);border: none !important;background: none !important;" />
                <el-button type="primary" key="getcode" :loading="codeLoading" v-if="getCodeVisible" @click="getCode"
                  style="width: 112px;padding: 12px 10px;">{{ $t('login.getCode') }}</el-button>
                <el-button type="primary" key="waitTime" v-else style="width: 92px;padding: 12px 10px;"
                  :disabled="true">{{ waitTime }}</el-button>
              </div>
            </el-form-item>
            <!-- 获取登录验证码 -->
            <el-form-item prop="Code" key="code" :label="$t('login.code')" v-if="$deployName == 'luqiao'">
              <div class="flex jc-between" style="width:100%">
                <el-input v-model="loginForm.Code" key="loginForm1" autocomplete="on"
                  :placeholder="$t('base.placeholder.code')"
                  style="width: calc(100% - 122px);border: none !important;background: none !important;" />
                <el-button type="primary" key="getcode" :loading="codeLoading" v-if="getCodeVisible" @click="getLoginCode"
                  style="width: 112px;padding: 12px 10px;">{{ $t('login.getCode') }}</el-button>
                <el-button type="primary" key="waitTime" v-else style="width: 92px;padding: 12px 10px;"
                  :disabled="true">{{ waitTime }}</el-button>
              </div>
            </el-form-item>
            <div style="display: flex; align-items: center;margin: 20px 0;">
              <!--<el-checkbox v-if="operateState === 'login'" v-model="rememberPwd">{{ $t('login.freeLogin')-->
              <!--  }}</el-checkbox>-->
              <div style="flex-grow: 1"></div>
              <el-button type="text" style="padding: 0;" v-if="!verification" @click="verificationShow">{{
                $t('login.forgetPassword') }}</el-button>
              <el-button type="text" style="padding: 0;" v-else @click="verificationShow">{{ $t('login.backToLogin')
                }}</el-button>
            </div>
            <div style="margin-bottom: 16px">
              <el-button type="primary" style="width: 100%" :loading="loginLoading" v-if="operateState == 'login'"
                @click.native.prevent="handleLogin"> {{ $t('login.loginNow') }} </el-button>
              <el-button type="primary" style="width: 100%" :loading="resetPwdLoading" v-if="operateState == 'resetPwd'"
                @click.native.prevent="handleResetPwd"> {{ $t('login.rePassword') }} </el-button>
            </div>
          </div>
        </el-form>

        <el-dialog title="设置密码" v-dialogDrag :visible.sync="pwdDialogVisible" width="420px"
          :before-close="closePwdDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
          <div class="flex jc-center ai-center" style="margin-bottom: 15px;">
            <i style="color: #E6A23C;" class="el-icon-info"></i>
            <span>首次登录，为保证您的数据安全，请重新设置密码</span>
          </div>
          <el-form ref="passForm" :rules="passsFormRules" :model="passForm" label-width="100px" size="small">
            <el-form-item prop="oldPwd" label="默认密码：" key="passForm1">
              <el-input v-model="passForm.oldPwd" placeholder="请输入原密码"></el-input>
              <!-- <div class="joinTit"> 如忘记密码，请在手机钉钉上使用验证码登入，即可重置密码。 </div> -->
            </el-form-item>
            <el-form-item prop="newPwd" label="新密码：">
              <el-input v-model="passForm.newPwd" autocomplete="off" key="passForm2"
                placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPwd" label="确认密码：">
              <el-input v-model="passForm.confirmPwd" autocomplete="off" key="passForm3"
                placeholder="再次输入密码"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <!--<el-button size="small" @click="closePwdDialog">{{ $t('base.button.cancel') }}</el-button>-->
            <el-button size="small" type="primary" @click="submitNewPwd">{{ $t('base.button.confirm') }}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div style="font-size: 16px;font-weight: 500;margin: 10px 0 5px;position: absolute;right: 30px;top:30px">
      <el-dropdown trigger="click" @command="changeLanguage">
        <el-button style="color: #444;font-size: 16px;" type="text">
          <span>{{ languageName }}</span>
          <i class="el-icon-arrow-down"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zhCn">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import postApi from "@/api/document/indexApi.js";
import local from "@/utils/auth";
import Cookies from 'js-cookie'
import { mapGetters } from "vuex";

import { detectZoom } from "@/utils/get-device-ratio"
import { encrypt, decrypt } from '@/utils'
import i18n from '../../../static/locales'
import { MessageBox } from 'element-ui'
import request from '@/utils/request'

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
            callback(new Error(i18n.t('base.button.phoneNumberHasBeenRegistered')));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback(new Error(i18n.t('base.button.inputCorrectPhoneNumber')));
      }
    };

    var validateNewPass1 = (rule, value, callback) => {
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
    var validateNewPass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputPasswordAgain')));
      } else if (value !== this.passForm.newPwd) {
        callback(new Error(i18n.t('base.button.errorPassword2')));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputPasswordAgain')));
      } else if (value !== this.loginForm.password) {
        callback(new Error(i18n.t('base.button.errorPassword2')));
      } else {
        callback();
      }
    };
    var codeValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputCode')));
      } else {
        callback();
      }
    };
    return {
      languageName: '中文',
      // 重置新密码
      passForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
      },
      passsFormRules: {
        oldPwd: [{
          required: true,
          message: i18n.t('base.button.originalPassword'),
          trigger: "blur"
        }],
        newPwd: [{
          required: true,
          validator: validateNewPass1,
          trigger: "blur"
        }],
        confirmPwd: [{
          required: true,
          validator: validateNewPass2,
          trigger: "blur"
        }],
      },

      rememberPwd: true,
      containerStyle: {
        background: `url(${this.$loginBottomLogo}) center 87vh, url(${this.$loginBackgroundImage}) center`,
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '270px, cover'
      },
      register: false, //注册
      verification: false, //验证
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
      loginRules: {
        Code: [{
          validator: codeValidate,
          required: true,
          trigger: "blur"
        }],
        phone: [{
          required: true,
          validator: checkMobile,
          trigger: "blur"
        }],
        password: [{
          required: true,
          validator: validateNewPass1,
          trigger: "blur"
        }],
        confirmPassword: [{
          required: true,
          validator: validatePass2,
          trigger: "blur"
        }],
      },
      disabled: false,
      loginLoading: false,
      registloading: false,
      resetPwdLoading: false,
      pwdType: "password",
      pwdType1: "password",
      ratio: 100,
      getCodeVisible: true,
      waitTime: '',
      loginRes: {},
      codeLoading: false
    };
  },
  computed: {
    ...mapGetters(['pwdDialogVisible']),
  },
  watch: {
    loginLoading(val) {
      if (val) {
        setTimeout(() => {
          this.loginLoading = false;
        }, 1000);
      }
    },

  },
  async created() {
    localStorage.setItem('language', this.$i18n.locale)
    this.languageName = (this.$i18n.locale == 'en' ? 'English' : '中文')
  },
  mounted() {
    this.ratio = detectZoom()
    window.onresize = () => {
      this.ratio = detectZoom()
    }
    var page = local.getLoginOrRegistPageLink();
    if (page) {
      if (page == "login") {
        this.verificationShow();
      }
      local.removeLoginOrRegistPageLink;
    }
    //获取url复制链接过来
    var url = location.href
    var index = url.indexOf('phoneNum=')
    if (index > -1) {
      this.loginForm.phone = url.slice(index + 9)
      this.loginForm.password = 'Ksj123456@'
    }

  },
  methods: {
    changeLanguage(locale) {
      this.languageName = locale == 'en' ? 'English' : '中文';
      localStorage.setItem('language', locale)
      this.$i18n.locale = locale;
      this.$forceUpdate()

      this.$refs.loginForm.validate(valid => {
      })

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
    // 开始登录
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          if (valid || this.$route.query.Mode == "Admin") {
            this.loginLoading = true;
            var formData = new FormData();
            formData.append("application", "web");
            formData.append("minutes", this.rememberPwd ? 3 * 60 : 120);
            formData.append("phone", this.loginForm.phone);
            formData.append("password", encrypt(this.loginForm.password));
            if (this.$deployName == 'luqiao') {
              formData.append("isMFA", true);
              formData.append("code", this.loginForm.Code);
            }
            const res = await this.$store.dispatch("AdminLogin", formData);

            if (res.code === 1) {
              this.loginRes = res.data

              if (res.data.isfirst) {
                this.passForm.oldPwd = this.loginForm.password
                this.$store.commit('SET_PWD_DIALOG', true)
              } else {
                const token = local.getToken();
                await this.setPermi() //设置系统权限  ·
                this.signalr.invoke("loginConnnectAsync", token);
                var companyApplyRes = await postApi.get("/api/WebCompanyApply/QueryCompanyApply");
                if (companyApplyRes.code == 1) {
                  this.$store.state.user.hasNotDealApply = companyApplyRes.data
                }
                this.$success(res.msg);
                let url = localStorage.getItem('shareUrl');

                if (url && this.$deployName === 'luqiao') {
                  this.$router.push(url);
                  localStorage.removeItem('shareUrl')
                } else {
                  this.$router.push("/");
                  this.$store.commit('SET_ACTIVE_TAB', 'desktop')
                }
              }
            }
          }
        }
      });
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
    getLoginCode() {
      if (this.loginForm.phone && this.loginForm.phone.length == 0) {
        this.$refs.loginForm.resetFields();
      }
      this.$refs.loginForm.validateField("phone", async (valid) => {
        if (!valid) {
          this.tackBtn(); //验证码倒数60秒
          // this.codeLoading = true
          this.codeLoading = false
          let fd = new FormData(); //POST 请求需要 转化为Form
          fd.append("phone", this.loginForm.phone);
          await postApi.post(this.operateState == "resetPwd" ? "/api/Home/Modifypassword" : "/api/Home/LoginCode", fd).then((res) => {
            if (res.code !== 1) {
              this.time = 0
            }
          }).catch(() => {});
        }
      });
    },
    async setPermi() {
      var res = await postApi.post("/api/Users/GetUserMenu");
      if (res.code == 1) {
        let arr = [];
        this.setPermiTree(arr, res.data)
        this.$store.commit('SET_PERMI', arr)
      }
    },
    setPermiTree(arr, data) {
      data.forEach(menu => {
        if (menu.type == 1) {
          arr.push(`${menu.code}:*:*`)
          if (menu.children) {
            menu.children.forEach(nav => {
              arr.push(`${menu.code}:${nav.code}:*`)
              if (nav.children) {
                nav.children.forEach(button => {
                  arr.push(`${menu.code}:${nav.code}:${button.code}`)
                })
              }
            })
          }
        }
      })
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
    submitNewPwd() {
      this.$refs.passForm.validate(async (valid) => {
        if (valid) {
          var res = await request.post("/api/WebAccount/EditPwd", this.passForm, {
            token: this.loginRes.jwt
          });
          if (res.code === 1) {
            this.$success("密码设置成功，请用新密码重新登陆！");
            this.$store.dispatch("LogOut").catch(() => {});
            this.loginForm.password = '';
            this.loginForm.Code = '';
            this.time = 0;
            this.$refs.loginPwd.focus()
            this.closePwdDialog()
          }
        }
      });
    },
    closePwdDialog() {
      this.$store.commit('SET_PWD_DIALOG', false)
    },
    tackBtn() {
      //验证码倒数60秒
      this.time = 60;
      this.getCodeVisible = false;
      this.waitTime = this.time + this.$t('login.waitTime');
      let timer = setInterval(() => {
        if (this.time <= 0) {
          clearInterval(timer);
          this.getCodeVisible = true;
        } else {
          this.time--;
          this.waitTime = this.time + this.$t('login.waitTime');
        }
      }, 1000);
    },
    //忘记密码显示内容
    verificationShow() {
      MessageBox.alert(this.$t('base.button.contactDesignConsultingDepartment'), this.$t('base.button.tips'), {
        type: "warning",
      })

      // let phone = this.loginForm.phone
      // this.$refs.loginForm.resetFields();
      // this.loginForm.phone = phone
      // this.loginForm.password = ''
      // this.loginForm.Code = ''
      // this.loginForm.confirmPassword = ''
      // if (!this.verification) {
      //   this.operateState = "resetPwd";
      //   this.pwdType = 'text'
      //   this.verification = true;
      // } else {
      //   this.operateState = "login";
      //   this.pwdType = 'password'
      //   this.verification = false;
      // }
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
    height: 40px;
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
    }
  }


  .login-form {
    transform-origin: top center;
    position: absolute;
    // left: calc(50% - 180px);
    width: 360px;
    top: 100px;
    background: rgba(255, 255, 255, 1);
    padding: 15px;
    border-radius: 14px;

    .el-form-item {
      border-radius: 4px;
      color: #454545;
    }
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
    width: 20px;
    height: 20px;
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

  ::v-deep() .el-form--label-left {
    .el-form-item__label {
      line-height: 30px;
    }
  }

  >div {

    >div {
      flex-shrink: 0;
      flex-grow: 0;

      &:nth-child(1) {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

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
}


.login-con-width ul li {
  float: left;
}


.right-box {
  >.title {
    font-weight: bold;
  }
}
</style>
