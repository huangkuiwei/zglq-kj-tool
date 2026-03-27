<template>
  <div style="overflow: hidden;">
    <el-form label-width="110px">
      <el-form-item label="链接：">
        <el-input style="width:505px;margin-left:20px" class="shareText" ref="shareFileInput" disabled v-model="shareUrl"></el-input>
      </el-form-item>
      <el-form-item v-if="!isVisible" label="提取码：">
        <label style="margin-left:20px" class="shareText">{{password}}</label>
      </el-form-item>
      <!--<el-form-item label="二维码：">-->
      <!--  <vueQr ref="qrCode" :logoSrc="$deployName === 'luqiao' ? null : QRLogo" :text="shareUrlM" :size="150"></vueQr>-->
      <!--</el-form-item>-->
    </el-form>
    <div style="float: right;margin-bottom: 15px;">
      <!--<el-button size="small" @click="downloadQRcode">下载二维码</el-button>-->
      <el-button size="small" type="primary" @click="copyShareUrl">复制链接</el-button>
      <el-button size="small" @click="closeDialog">{{ $t('base.button.close') }}</el-button>
    </div>
  </div>
</template>
<script>
  import QRLogo from "@/assets/K-J.png";
  import vueQr from "vue-qr";
  export default {
    components: {
      vueQr
    },
    props: {
      shareUrl: {
        type: String,
        default: null
      },
      shareUrlM: {
        type: String,
        default: null
      },
      isVisible: {
        type: Boolean,
        default: false
      },
      password: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        QRLogo: QRLogo
      }
    },
    methods: {
      // 点击下载app二维码
      downloadQRcode() {
        let a = document.createElement('a');
        // 下载图名字
        a.download = "分享二维码";
        //url
        a.href = this.$refs.qrCode.$el.src;
        //合成函数，执行下载
        a.dispatchEvent(new MouseEvent('click'))
      },
      copyShareUrl() {
        var _self = this
        this.$copyText(this.shareUrl).then(function (e) {
          _self.$success('链接复制成功,快去发送给好友吧~')
        }, function (e) {})
      },
      closeDialog() {
        this.$emit("closeDialog")
      }
    }
  }
</script>
<style>
  .t-qrcode img {
    width: 150px;
    height: 150px;
  }
</style>
