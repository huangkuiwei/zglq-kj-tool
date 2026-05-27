<template>
  <div style="display:inline-block">
    <transition name="el-zoom-in-top">
      <div v-if="compressTipsVisible" class="packging"> 文件夹打包中... </div>
    </transition>
    <el-button size="small" @click="download"><i class="iconfont icon-download"
        style="font-size: 12px"></i>{{ $t('base.button.download') }}</el-button>
  </div>
</template>
<script>
import commonApi from "@/api/common"
import request from '@/utils/request'

export default {
  props: {
    //列表选择的行
    rows: {
      type: [Array, Object]
    },
    fullPath: {
      type: Function
    },
    clearLoading: {
      type: Function
    },
    clearSelect: {
      type: Function
    }
  },
  data() {
    return {
      compressTipsVisible: false
    }
  },
  methods: {
    async singleFileDownload() {
      const loading = this.$loading({
        text: '正在压缩文件，请稍等...',
        body: true,
        lock: true,
        background: '#00000010',
      })

      let file = this.rows;

      // 文件夹打包下载
      this.compressTipsVisible = true
      const res = await commonApi.compressFileFolder(file.iuid)

      loading.close()

      if (res.code == 1) {
        var compressionFileInfo = {
          path: res.data.zipfileRelativePath,
          compressionFileSize: res.data.fileSize,
          iuid: res.data.newIUID
        }

        this.$downloadFile(file, this, true, compressionFileInfo)
      }
      this.compressTipsVisible = false

      // let file = this.rows;
      // if (file.fileSuffix == "") {
      //   // 文件夹打包下载
      //   this.compressTipsVisible = true
      //   const res = await commonApi.compressFileFolder(file.iuid)
      //   if (res.code == 1) {
      //     var compressionFileInfo = {
      //       path: res.data.zipfileRelativePath,
      //       compressionFileSize: res.data.fileSize,
      //       iuid: res.data.newIUID
      //     }
      //
      //     this.$downloadFile({}, this, true, compressionFileInfo)
      //   }
      //   this.compressTipsVisible = false
      // } else {
      //   // 文件下载
      //   file.fullPath = this.fullPath();
      //   this.$downloadFile(file, this);
      // }
      this.$emit('clearSelect')
    },
    // 下载bim文件
    async downLoadBim() {
      // let file = this.rows;
      // file.fullPath = this.fullPath();
      // this.$downloadFile(file, this, false, null, true, true);

      const loading = this.$loading({
        text: '正在压缩文件，请稍等...',
        body: true,
        lock: true,
        background: '#00000010',
      })

      let file = this.rows;

      // 文件夹打包下载
      this.compressTipsVisible = true
      const res = await request.get(`api/Home/GetFilebimState?iuid=${file.iuid}` + (file.workflowiuid ? `&workflowiuid=${file.workflowiuid}` : ''), {
        timeout: 0
      }).catch(() => {})

      loading.close()

      if (res && res.code == 1) {
        var compressionFileInfo = {
          path: res.data.zipfileRelativePath,
          compressionFileSize: res.data.fileSize,
          iuid: res.data.newIUID
        }

        this.$downloadFile(file, this, true, compressionFileInfo)
      } else {
        this.$message.error("压缩失败，请重试");
      }

      this.$emit('clearSelect')
    },
    async download() {
      if (!this.rows || this.rows.length == 0) {
        this.$error("请选中一行操作");
        return;
      }
      var folders = this.rows.filter(function (item, index, array) {
        return item.fileSuffix == "";
      });
      var files = this.rows.filter(function (item, index, array) {
        return item.fileSuffix != "";
      });
      if (['/blueprintData', '/standardData'].indexOf(this.$route.path) > -1 && (folders.length > 0 || files.length > 1)) {
        this.$warning("抱歉，此模块不支持文件夹或多文件批量下载")
        return
      }
      if (folders.length > 1 || (folders.length > 0 && files.length > 0)) {
        this.$warning("目前只支持单个文件夹的下载操作")
        return
      } else if (folders.length === 1) {
        this.compressTipsVisible = true
        const res = await commonApi.compressFileFolder(folders[0].iuid)
        this.$emit('clearLoading')
        if (res.code == 1) {
          var compressionFileInfo = {
            path: res.data.zipfileRelativePath,
            compressionFileSize: res.data.fileSize,
            iuid: res.data.newIUID
          }
          folders[0].fullPath = this.fullPath()
          this.$downloadFile(folders[0], this, true, compressionFileInfo)
        }
        this.compressTipsVisible = false
      } else if (folders.length == 0) {
        this.rows.forEach((element, idx) => {
          element.fullPath = this.fullPath()
          setTimeout(() => {
            this.$downloadFile(element, this)
          }, idx * 400);
        });
      }
    },
  }
}
</script>
<style type="text/css">
.packging {
  width: 200px;
  height: 30px;
  line-height: 30px;
  position: fixed;
  background-color: #409eff;
  color: white;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  left: 45%;
  top: 50px;
  z-index: 999999
}
</style>
