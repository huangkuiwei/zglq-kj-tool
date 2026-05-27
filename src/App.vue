<template>
  <div id="app">
    <router-view v-if="isRouterAlive" style="height: 100vh" />
    <chunkUploadTransferProgress v-if="showTransfer" />
    <preViewContainer v-if="preViewContainerVisible" />
    <!-- <registedPersonContainer /> -->
    <shareCountItem />
  </div>
</template>
<script>
import chunkUploadTransferProgress from "@/components/ChunkUploader/transfer"; //分片上传传输过程显示器
import preViewContainer from "@/components/preView/preView.vue";
import shareCountItem from "@/components/Share/shareCountItem";
// import registedPersonContainer from "@/components/Space/RegistedPerson.vue";
import { mapGetters } from "vuex";
import local from "@/utils/auth";
import postApi from "@/api/document/indexApi.js";
import { whiteList } from '@/utils/whiteList'
import projectFileApi from '@/api/document/indexApi'
import { decrypt } from '@/utils'
import { ipcRenderer } from 'electron'
import request from '@/utils/request'

export default {
  name: "App",
  components: {
    chunkUploadTransferProgress,
    // registedPersonContainer,
    preViewContainer,
    shareCountItem,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  computed: {
    ...mapGetters([
      "user",
      "fileDataClone",
      "downLoadFileDataClone",
      "preViewContainerVisible",
      "darkMode",
    ]),
    user() {
      return this.$store.state.user
    },
    in_progress_number() {
      var number =
        this.upload_in_progress_number + this.downLoad_in_progress_number;
      return number;
    },
  },
  // beforeDestroy(){
  //   localStorage.clear()
  // },
  watch: {
    fileDataClone() {
      var _self = this;
      _self.upload_in_progress_number = 0;
      this.fileDataClone.forEach((element) => {
        if (
          element.progress >= 0 &&
          element.progress < 100 &&
          !element.errorMsg
        ) {
          _self.upload_in_progress_number = _self.upload_in_progress_number + 1;
        }
      });
    },
    'user.token'(val) {
      if (val == '') {
        this.signalr.off('AccountExit')
      }
    },
    async $route(val, oldval) {
      whiteList.push('/bimiframe/', '/bimiframe')
      if (whiteList.indexOf(val.path) < 0) {
        this.$store.dispatch("GetMsgData")
        this.showTransfer = true;
      }
      else {
        this.showTransfer = false;
      }

      if (val.path === '/projectFile') {
        var url = "/api/Noticeboard/GetProjectFileTree?type=1";
        let fileTree = await projectFileApi.post(url);
        if (fileTree.code == 1 && fileTree.data.length != 0) {
          fileTree.data.forEach((item) => {
            this.transTreeData(item);
          });
          this.$root.list = fileTree.data;
        }
      }
    },
    downLoadFileDataClone() {
      var _self = this;
      _self.downLoad_in_progress_number = 0;
      this.downLoadFileDataClone.forEach((element) => {
        if (
          element.progress >= 0 &&
          element.progress < 100 &&
          !element.errorMsg
        ) {
          _self.downLoad_in_progress_number =
            _self.downLoad_in_progress_number + 1;
        }
      });
    },
  },
  data() {
    return {
      showTransfer: false,
      isRouterAlive: true,
      upload_in_progress_number: 0,
      downLoad_in_progress_number: 0,
    };
  },
  methods: {
    // 文件名解密
    transTreeData(data) {
      data.filePath = decrypt(data.filePath || "");
      data.turnPath = decrypt(data.turnPath || "");

      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          this.transTreeData(item);
        });
      }
    },

    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    beforeunloadHandler(e) {
      e = e || window.event;
      if (e) {
        e.returnValue = "您是否确认离开此页面-正在进行的任务可能不会被保存";
      }
      return "您是否确认离开此页面-正在进行的任务可能不会被保存";
    },
    refreshData(res) {
      this.$store.dispatch("SETSignalRTableData", res);
    }
  },
  created() {
    if (this.user.iscorpadmin) {
      this.signalr.off("companyApply");
      this.signalr.on("companyApply", async (res) => {
        this.$store.state.user.hasNotDealApply = res.notDealApply;
        this.$store.dispatch("GetMsgData")
      });
    }

    this.signalr.off("examineverify");
    this.signalr.on("examineverify", async (res) => {
      this.$store.dispatch("GetMsgData")
    });

    this.signalr.off("accessApply");
    this.signalr.on("accessApply", async (res) => {
      this.$success(res.msg);
      this.$store.state.user.user.systemIsPersonal = false;
      this.$store.state.user.user.corpIdbit = true;
      local.setUser(this.$store.state.user.user);
      this.$router.go(0);
    });

    // 重复登录
    this.signalr.off("AccountExit");
    this.signalr.on("AccountExit", (res) => {
      this.$store.dispatch("LogOut").catch(() => {});
      this.$alert(
        "账户在其他地点登录，如果不是本人登录，请及时更改密码！！",
        "提示",
        {
          confirmButtonText: "确定",
          showClose: false,
          type: "error",
          callback: (action) => {
            this.$router.push("/login");
          },
        }
      );
    });
    // 支付成功
    this.signalr.off("paySuccess");
    this.signalr.on("paySuccess", (res) => this.$store.dispatch("SETPaySuccessData", res));
    // 消息监听
    this.signalr.off("ExporStatusInfo");
    this.signalr.on("ExporStatusInfo", (res) => this.refreshData(res));  // 消息监听
    // 对比结果
    this.signalr.off("ContrastStatusInfo");
    this.signalr.on("ContrastStatusInfo", (res) => this.refreshData(res));
    // 转码状态
    this.signalr.off("projectFileStatusInfo");
    this.signalr.on("projectFileStatusInfo", (res) => this.refreshData(res));
    // dgn导出
    this.signalr.off("GenerateType");
    this.signalr.on("GenerateType", (res) => this.refreshData(res));
    // 更新列表
    this.signalr.off("DrawingFileStatusInfo");
    this.signalr.on("DrawingFileStatusInfo", (res) => this.refreshData(res));
    // 版本
    this.signalr.off("FileVersionInfo");
    this.signalr.on("FileVersionInfo", (res) => this.refreshData(res));
    // 构件库
    this.signalr.off("publiclibraryStatusInfo");
    this.signalr.on("publiclibraryStatusInfo", (res) => this.refreshData(res));
    this.signalr.off("KnowledgeBaseStatusInfo");
    this.signalr.on("KnowledgeBaseStatusInfo", (res) => this.refreshData(res));
    //
    this.signalr.off("processOutputDataReceived");
    this.signalr.on("processOutputDataReceived", (res) => {
      this.$root.outputDataReceived += res + "\n";
      localStorage.setItem("outputDataReceived", this.$root.outputDataReceived);
    });

    let downloads = localStorage.getItem('downloads')

    if (downloads) {
      downloads = JSON.parse(downloads);
      this.$store.commit("SET_DOWNLOADS", downloads);
      ipcRenderer.invoke('sync-downloads-data', downloads);
    }

    ipcRenderer.on('download-progress', (event, args) => {
      let taskId = args.id;
      let downloads = this.$store.state.downloadData.downloads
      let index = downloads.findIndex(x => x.id === taskId)

      if (index !== -1) {
        this.$set(downloads, index, {
          ...downloads[index],
          ...args,
          progress: args.progress.toFixed(2) + '%',
          speed: args.speed / 1024 + 'm/s',
          totalSizeText: (args.totalSize / (1024 * 1024)).toFixed(2) + 'M',
        })

        if (args.progress === 100) {
          request.get(`api/Home/GetZipdelete?iuid=${downloads[index].zipIUID}`)
        }

        if (args.progress === 100 && args.isshenpi) {
          let formData = new FormData();
          formData.append('workflowIUID', args.shenpiData.workflowIUID)
          formData.append('downloadType', args.shenpiData.downloadType)

          // 完成
          request.post('api/Home/FiledowndownloadState', formData).then(() => {
            this.$root.$emit('queryMyDownloadData')
          })
        }
      }
    })
  },
  async mounted() {
    if (
        !(navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i))
    ) {
      document.documentElement.style.minWidth = '1200px'
    }

    const userToken = local.getToken();

    if (userToken && whiteList.indexOf(this.$route.path) > -1) {
      var companyApplyRes = await postApi.get(
        "/api/WebCompanyApply/QueryCompanyApply"
      );
      if (companyApplyRes.code == 1) {
        this.$store.state.user.hasNotDealApply = companyApplyRes.data;
      }
    }
    window.addEventListener("storage", (event) => {
      var userKey = "58dc37da9e552908e7b0e08f230d3277";
      var tokenKey = "06f0d34cf875a244b9725dbc19c827dd";
      if (
        (event.key == userKey || event.key == tokenKey) &&
        event.oldValue &&
        event.newValue == null
      ) {
        this.$router.go(0);
      } else if (
        (event.key == userKey || event.key == tokenKey) &&
        event.oldValue == null &&
        event.newValue
      ) {
        this.$router.go(0);
      }
    });
    this.signalr.start().then(() => {
      if (userToken) {
        this.signalr.invoke("reloadConnnectAsync", userToken);
      }
    });
    //-----------------------初次渲染执行过程-------------------------
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    await this.$store.dispatch("SETClientHight", h);
    this.$store.state.app.clientWidth = w;
    //---------------------------------------------------------------
    //-----------------------window大小改变时执行---------------------
    window.onresize = () => {
      return (async () => {
        var h =
          document.documentElement.clientHeight || document.body.clientHeight;
        var w =
          document.documentElement.clientWidth || document.body.clientWidth;
        await this.$store.dispatch("SETClientHight", h);
        this.$store.state.app.clientWidth = w;
      })();
    };
    //---------------------------------------------------------------
    // 监听是否存在进行中的任务，给出提示是否要离开本页面。  钉钉webview由于对于监听事件不支持，此功能在钉钉中无效，浏览器中正常。
    let _this = this
    window.onbeforeunload = function (e) {
      if (_this.fileDataClone.length > 0) {
        e = e || window.event
        e.preventDefault();
        var message = '上传中的文件将被中断';
        if (e) {
          e.returnValue = message;
        }
        return message;
      }
    }

    // window.addEventListener("beforeunload", e => {
    //     if(this.in_progress_number > 0){
    //       this.beforeunloadHandler(e);
    //     }
    // });
  },
  destroyed() {
    this.signalr.stop().then(() => {
      console.log("断开连接");
    });
  },
};
</script>
<style lang="scss">
// html {
//   min-width: 1200px;
// }

.el-radio__inner {
  border-radius: 0;
}

.hide-scroll {
  /* IE 10+ */
  -ms-overflow-style: none;
  /* Firefox */
  overflow: -moz-scrollbars-none;
}

/* chrome 和 Safari */
.hide-scroll::-webkit-scrollbar {
  width: 0 !important;
}

.el-table .success-row {
  background: oldlace !important;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  width: 188px;
  height: 188px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  .el-upload {
    display: block;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 188px;
    min-height: 188px;
    line-height: 188px;
    text-align: center;
  }

  .avatar {
    width: 188px;
    height: 188px;
    object-fit: cover;
    display: block;
  }

  &.createPoster {
    height: 117px;

    .avatar-uploader-icon {
      min-height: 117px;
      line-height: 117px;
    }

    .avatar {
      height: 117px;
      line-height: 117px;
    }
  }

  &.poster {
    width: 300px;

    .avatar {
      width: 300px;
    }
  }
}

.hideDesktop {
  &.mask {
    top: 0;
    height: 100vh;
    background-color: #fff;
  }
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.el-dialog__footer {
  padding: 5px 24px 15px 20px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.upload-demo {
  display: inline-block;
  margin-right: 10px;
}

.iconFile {
  background: url("./assets/文件.svg") no-repeat;
  height: 18px;
  width: 18px;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
}



.tableOpeColMargin {
  margin-right: 10px;
}

.leftaside {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1001;
}

.fl {
  float: left;
}

.top-leftaside {
  cursor: pointer;
  position: absolute;
  top: 20%;
  right: -232px;
  width: 20px;
  height: 20px;
  z-index: 1001;
  background: #f5f6fa;

  /* 分割线2 */
  border: 1px solid #e5ebf6;
  border-radius: 50%;
  transition: all 0.2s;
}

.top-leftaside.hide {
  display: none;
}

.top-leftaside:hover {
  background-color: #409eff;
  box-shadow: 0 0 5px #aaa;
}

.top-leftaside:hover i {
  color: #fff;
}

.top-leftaside.collapse {
  right: -20px;
  width: 20px;
  border-width: 1px 1px 1px 0;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

#webpack-dev-server-client-overlay {
  display: none;
}
</style>
