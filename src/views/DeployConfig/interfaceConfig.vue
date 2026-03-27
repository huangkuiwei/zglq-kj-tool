<!--  -->
<template>
  <div class="app-container">
    <el-form :model="form" ref="form" :rules="rules" label-width="150px" label-suffix=":" size="small" :inline="false">
      <el-divider direction='horizontal' content-position="left">网站配置</el-divider>
      <el-form-item label="网站favicon图标">
        <div class="upload-img favicon">
          <el-button type="text" size="default" @click="upload('')" icon="el-icon-plus"></el-button>
        </div>
        <span class="tips">提示：图片大小16x16px或2倍图,格式为.ico</span>
      </el-form-item>
      <el-form-item label="网站标题">
        <el-input v-model="form.title" style="width:200px"></el-input>
      </el-form-item>
      <el-divider direction='horizontal' content-position="left">登录界面配置</el-divider>
      <el-form-item label="登录页背景图片">
        <div class="upload-img loginBg">
          <el-button type="text" size="default" @click="upload('')" icon="el-icon-plus"></el-button>
        </div>
        <span class="tips">提示：图片大小1920x1080px或2倍图</span>
      </el-form-item>
      <el-form-item label="登录表单头部logo">
        <div class="upload-img loginFormLogo">
          <el-button type="text" size="default" @click="upload('')" icon="el-icon-plus"></el-button>
        </div>
        <span class="tips">提示：图片高度56px，推荐使用svg</span>
      </el-form-item>
      <el-form-item label="登录页底部图片">
        <div class="upload-img loginLogo">
          <el-button type="text" size="default" @click="upload('')" icon="el-icon-plus"></el-button>
        </div>
        <span class="tips">提示：图片宽度270px，使用png</span>
      </el-form-item>
      <el-divider direction='horizontal' content-position="left">企业logo配置</el-divider>
      <el-form-item label="头部栏logo图片">
        <div class="upload-img headerLogo">
          <el-button type="text" size="default" @click="upload('')" icon="el-icon-plus"></el-button>
        </div>
        <span class="tips">提示：图片高度40px，推荐使用svg</span>
      </el-form-item>
      <el-form-item label="项目页底部图片">
        <div class="upload-img bottomLogo">
          <el-button type="text" size="default" @click="upload('')" icon="el-icon-plus"></el-button>
        </div>
        <span class="tips">提示：图片大小190x26px，推荐使用svg</span>
      </el-form-item>
      <el-button type="primary" style="width: 250px;margin-left: 150px;" @click="">{{ $t('base.button.save') }}</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      form: {},
      rules: {}
    };
  }
}

</script>
<style lang="scss" scoped>
.tips {
  color: #999;
}

.upload-img {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: 1px dashed #409eff;
  border-radius: 4px;
  background-color: #f7f8f9;

  &.favicon {
    width: 32px;
    height: 32px;
  }

  &.loginLogo {
    width: 190px;
    height: 40px;
  }

  &.loginBg {
    width: 196px;
    height: 108px;
  }

  &.loginFormLogo {
    width: 190px;
    height: 40px;
  }

  &.headerLogo {
    width: 190px;
    height: 40px;
  }

  &.bottomLogo {
    width: 190px;
    height: 40px;
  }
}</style>
