<template>
  <div style="display:inline-block">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal="true" :title="'下载文件'" :visible.sync="downloadDialogVisble" width="480px">
      <el-radio-group v-model="downloadType" size="small">
        <el-radio :label="2">下载bim文件</el-radio>
        <el-radio :label="1">下载源文件</el-radio>
        <el-radio :label="0">两者同时下载</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="primary" @click="download" size="small" style="width: 88px">确认</el-button>
        <el-button @click="$emit('update:downloadDialogVisble', false)" size="small" style="width: 80px; margin-left: 5px">{{ $t('base.button.cancel') }}</el-button>
      </div>
    </el-dialog>
    <transition name="el-zoom-in-top">
      <div v-if="compressTipsVisible" style="width:200px;height:30px;line-height:30px;position:fixed;background-color:#409eff;color:white;border-radius:5px;text-align:center;font-size:14px;left:45%;top:50px;z-index: 999999;"> 文件夹打包中... </div>
    </transition>
    <el-button size="small" @click="downloadDialogOpen"><i class="iconfont icon-download" style="font-size: 12px"></i>{{ $t('base.button.download') }}</el-button>
  </div>
</template>
<script>
import commonApi from "@/api/common"
export default {
  props: {
    //列表选择的行
    rows: {
      type: Array,
      default: []
    },
    fullPath: {
      type: Function
    },
    clearSelect: {
      type: Function
    },
    downloadDialogVisble: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      downloadType: 2,
      compressTipsVisible: false
    }
  },
  methods: {
    downloadDialogOpen() {
      if (!this.rows || this.rows.length == 0) {
        this.$error("请选中一行操作");
        return;
      }
      var folders = this.rows.filter(function (item, index, array) {
        return item.fileSuffix.toLowerCase() == "";
      });
      var files = this.rows.filter(function (item, index, array) {
        return item.fileSuffix.toLowerCase() != "";
      });
      if (folders.length > 1 || (folders.length > 0 && files.length > 0)) {
        this.$warning("目前只支持单个文件夹的下载操作")
        return
      }
      this.$emit('update:downloadDialogVisble', true)
    },
    async download() {
      var iuidList = this.rows.map((item) => {
        return item.iuid
      }).join(',')
      this.compressTipsVisible = true
      const res = await commonApi.compressFileFolderProject(iuidList, this.downloadType)
      if (res.code == 1) {
        var fileName = "";
        var folders = this.rows.filter(function (item, index, array) {
          return item.fileSuffix.toLowerCase() == "";
        });
        if (folders.length > 1) {
          fileName = this.rows[0].fileName;
        } else {
          fileName = res.data.newIUID;
        }
        this.$downloadFileProject(fileName, res.data.newIUID, encodeURIComponent(res.data.getFileFolderName), res.data)
        this.$emit('update:downloadDialogVisble', false)
        this.$emit('clearSelect')
      }
      this.compressTipsVisible = false
    }
  }
}
</script>
