<!--  -->

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">登录验证</div>
      <el-divider direction="horizontal" content-position="left"></el-divider>
      <el-form class="login-form" :model="loginForm" ref="form" :rules="rules" label-width="64px" label-suffix=":" size="normal">
        <el-form-item label="账号" required>
          <el-input placeholder="请输入系统管理员账号" autocomplete="new-password" v-model="loginForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input placeholder="请输入密码" type="password" autocomplete="new-password" show-password v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-button class="login-btn" type="primary" @click="onSubmit">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import postApi from '@/api/document/indexApi.js'
import { encrypt } from '@/utils'
// ksjP@ssw0rd
export default {
  name: "adminLogin",
  data() {
    return {
      loginForm: {
        phone: 'ksjadmin',
        password: '',
      },
      rules: {},
    };
  },
  methods: {
    async onSubmit() {
      let data = {
        accounts: this.loginForm.phone,
        password: encrypt(this.loginForm.password),
        minutes: '20',
      }
      let res = await postApi.post('/api/Adminsetup/AdminLogin', this.$objectToFormData(data))
      if (res.code == 1) {
        this.$success(res.msg);
        localStorage.setItem('adminToken',res.data)
        this.$router.push('/companyConfig')
      }
    }
  }
}

</script>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #144a74;

  .login-box {
    border-radius: 8px;
    border: 1px solid #fff3;
    background: rgba(0, 0, 0, 0.05);
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.20);
    backdrop-filter: blur(12px);
    position: fixed;
    left: calc(50vw - 200px);
    top: 30vh;
    padding: 50px 30px;
    width: 400px;
    color: #fff;

    .login-title {
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      padding: 10px 0;
    }

    .login-form {
      ::v-deep .el-form-item {
        margin: 40px 10px 35px;
      }

      ::v-deep .el-form-item__label {
        color: #fff;
      }

      ::v-deep .el-input__inner {
        border: 1px solid #C2F0FF20;
        background-color: #fff1;
        color: #fff;

        &:focus {
          border: 1px solid #C2F0FF;
        }
      }
    }

    .login-btn {
      width: 100%;
      display: block;
      margin: 10px auto;

    }
  }
}
</style>
