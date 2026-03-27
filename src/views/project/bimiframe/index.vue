<template>
  <div class="kanban">
    <!-- <iframe v-if="$supportWebGL() && showIframe" ref="imodelIframe" :src="testUrl" @load="sendtreeData" id="kanbaniframe" class="kanbaniframe" allowfullscreen></iframe> -->
    <iframe v-if="$supportWebGL() && showIframe" ref="imodelIframe" :src="src" @load="sendtreeData" id="kanbaniframe" class="kanbaniframe" allowfullscreen></iframe>
    <img v-if="$supportWebGL() && showImg && !errorPageVisible" class="pic-404__parent" :src="$route.query.appImage" :alt="$route.query.name" style="margin: auto;left: 0;right: 0;top: 0;bottom: 0; position:fixed;border-radius: 12px;box-shadow: 2px 2px 6px #44444477;" fit="cover" />
    <!-- <img v-if="$supportWebGL() && !showIframe" class="pic-404__parent" :src="$route.query.appLogo" style="width:48px; height:48px; position: absolute; left: 50px; top: 50px"> -->
    <!-- <span v-if="$supportWebGL() && !showIframe" style="font-size:48px; font-weight: 800; position: absolute; left: 110px; top: 50px">{{$route.query.name}}</span> -->
    <div v-if="!$supportWebGL()">
      <img :src="notSupportWebGLImg" />
    </div>

    <imodelInvokeFunction :rowData="dataModel" :isFullScreen.sync="isFullScreen" @pageClose="hiddenIframe" ref="imodelInvokeContainer" />

    <div class="wscn-http404-container" v-if="errorPageVisible">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" src="@/assets/errorImg/404.png" alt="404" />
          <img class="pic-404__child left" src="@/assets/errorImg/404_cloud.png" alt="404" />
          <img class="pic-404__child mid" src="@/assets/errorImg/404_cloud.png" alt="404" />
          <img class="pic-404__child right" src="@/assets/errorImg/404_cloud.png" alt="404" />
        </div>
        <div class="bullshit">
          <div class="bullshit__headline">当前项目中不包含模型文件。。。</div>
          <div class="bullshit__info">请重新选择项目，并再次进入本界面。</div>
        </div>
      </div>
    </div>

    <versionFilesDialog :dialogVisibleProp.sync="versionFilesDialogVisible" :versionFiles="versionFiles" @versionFilesCallBack="versionFilesCallBack" />

    <linkModel2Dialog :visible.sync="linkModel2Dialog" v-if="linkModel2Dialog" :list="list" :linkModelFiles="linkModelFiles" :openedProject="openedProject" @linkModelSubmit="linkModelSubmit" />

    <div v-if="imodelAuditCountInfoDialog" class="imodel-audit-count-info-dialog">
      <div>
        <span>问题数量：</span>
        <span>{{ imodelAuditCountInfo.total }}</span>
      </div>

      <div>
        <span>已回复：</span>
        <span>{{ imodelAuditCountInfo.replied }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import projectFileApi from "@/api/document/indexApi.js";
// import projectFileListApi from "@/api/project/file"; // 注意和上一个区别
import imodelInvokeFunction from "@/components/imodelInvokeFunction";
import notSupportWebGLImg from "@/assets/webGL支持.png";
import versionFilesDialog from "@/components/DeleteRemindAndImodelVersions/imodelVersionFiles";
import { decrypt, encrypt } from "@/utils";
import local from "@/utils/auth";
// import request from '@utils/request'
import LinkModel2Dialog from '@/components/Dialog/LinkModel2Dialog.vue'
import request from '@/utils/request'

export default {
  components: {
    imodelInvokeFunction,
    versionFilesDialog,
    LinkModel2Dialog
  },
  computed: {
    ...mapGetters(["clientHeight", "currApp", 'user']),
    fileIuid() {
      let iuid = this.$route.query.iuid || undefined;
      return iuid
    },
    projectIuid() {
      let iuid = this.$route.query.projectIuid || undefined;
      return iuid
    },
    isEditable() {
      if (
        this.$route.query.appType == "bimwindows" ||
        this.$route.query.appType == "board" ||
        this.$route.query.appType == "presentation"
      )
        return false;
      else return true;
    },
  },
  data() {
    return {
      testUrl: process.env.KmwOrigin + '?d:/file/ld.bim',
      src: "",
      showIframe: false,
      showImg: true,
      dataModel: null, //数据模型,各功能数据依赖此对象
      isFullScreen: false,
      list: null,
      listdata: null,
      projectInfo: null,
      notSupportWebGLImg: notSupportWebGLImg,
      errorPageVisible: false,
      versionFilesDialogVisible: false,
      versionFiles: [],
      linkModel2Dialog: false,
      linkModelFiles: [],
      openedProject: '',
      imodelAuditCountInfo: {},
      imodelAuditCountInfoDialog: false
    };
  },
  watch: {
    isFullScreen() {
      if (this.isFullScreen) {
        document.getElementById("headerPage").style.display = "none";
      } else {
        document.getElementById("headerPage").style.display = "none";
        // document.getElementById("headerPage").style.display = "initial";
      }
    },
  },
  async mounted() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
    window.addEventListener("unload", (e) => this.unloadHandler(e));

    let arr = [
      {
        type: "bimstation",
        appName: "BIM Station",
      },
      {
        type: "bimwindows",
        appName: "BIM Windows",
      },
      {
        type: "bimfactory",
        appName: "BIM-Factory",
      },
      {
        type: "bimgpt",
        appName: "BIM-GPT",
      },
      {
        type: "cscmodeler",
        appName: "BIM-OneAll",
      }, {
        type: "sitelayout",
        appName: "BIM-SiteAll",
      }, {
        type: "bimchat",
        appName: "BIM-Chat",
      },
      {
        type: "bimrailoneall",
        appName: "Rail-OneAll",
      }
    ];


    document.title = arr.find((item) => item.type == this.$route.query.appType).appName;

    // 记录页面打开
    localStorage.setItem(document.title, JSON.stringify(this.$route.path));
    // 隐藏header
    document.getElementById("headerPage").style.display = "none";

    this.$iframeListener(this.messageReceived);
    this.queryData()
    //20220916修改：获取列表当前行文件的iuid
    // await this.queryData(this.projectIuid);
  },

  beforeDestroy() {
    localStorage.setItem(document.title, null);
    document.getElementById("headerPage").style.display = "initial";
    this.$removeIframeListener(this.messageReceived);
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) =>
      this.beforeunloadHandler(e)
    );
    window.removeEventListener("unload", (e) => this.unloadHandler(e));
    localStorage.setItem(document.title, null);
  },
  methods: {
    linkModelSubmit(data) {
      this.$iframePostMes(
        this.$refs.imodelIframe.contentWindow,
        'linkModelSubmit',
        data
      );
    },

    async queryData(iuid) {
      // 获取项目信息
      let projectInfoStr = localStorage.getItem("projectInfo") || "{}";

      if (projectInfoStr === 'undefined') {
        projectInfoStr = "{}"
      }

      this.projectInfo = JSON.parse(projectInfoStr);
      console.log('this.projectInfo', this.projectInfo)
      await this.queryTree();
    },
    async queryTree() {
      this.list = [];
      // 获取目录树
      // if (this.$route.query.appOrigin == 'GisIframeOrigin') {
      var url = "/api/Noticeboard/GetProjectFileTree?type=1" + (this.$route.query.appType != 'bimWorks' ? "&intall=1" : '') + (this.fileIuid ? "&IUID=" + this.fileIuid : '');
      let fileTree = await projectFileApi.post(url);
      if (fileTree.code == 1 && fileTree.data.length != 0) {
        fileTree.data.forEach((item) => {
          this.transTreeData(item);
        });
        this.list = fileTree.data;
      }
      // }

      if (!!this.fileIuid) {
        // 获取文件数据
        let queryFileUrl = `/api/ProjectManagement/GetMasterfileData?IUID=${this.projectInfo.iuid}&FileIUID=${this.fileIuid}`
        var masterFileRes = await projectFileApi.post(queryFileUrl);
        if (masterFileRes.code == 1) {
          this.dataModel = masterFileRes.data;
        }
        this.firstTurnPath();
      } else if (this.$route.query.mainFile) {
        let queryFileUrl =
          "/api/ProjectManagement/GetMasterfileData?IUID=" +
          this.projectInfo.iuid
        var masterFileRes = await projectFileApi.post(queryFileUrl);
        if (masterFileRes.code == 1) {
          this.dataModel = masterFileRes.data;
        }
        this.firstTurnPath();
      } else {
        this.dataModel = {
          turnPath: ""
        };
        this.firstTurnPath();
      }
    },
    beforeunloadHandler(e) {
      localStorage.setItem(document.title, null);
    },
    unloadHandler(e) {
      localStorage.setItem(document.title, null);
    },

    versionFilesCallBack(data) {
      if (!this.isEditable)
        this.$iframePostMes(
          this.$refs.imodelIframe.contentWindow,
          "versionFiles",
          data
        );
      else
        this.$iframeEditPostMes(
          this.$refs.imodelIframe.contentWindow,
          "versionFiles",
          data
        );
    },
    async messageReceived(messageRes) {
      if (messageRes.data.command == "handleChangeTreeInfo") {
        var res = await projectFileApi.post(
          "/api/Noticeboard/GetlazyProjectFileTree?IUID=" +
          messageRes.data.Data.iuid
        );

        if (res.code == 1) {
          var obj = {
            iuid: messageRes.data.Data.iuid,
            positionTree: messageRes.data.Data.positionTree,
            appendData: res.data,
          };
          if (!this.isEditable)
            this.$iframePostMes(
              this.$refs.imodelIframe.contentWindow,
              "handleChangeTreeInfoCallback",
              obj
            );
          else
            this.$iframeEditPostMes(
              this.$refs.imodelIframe.contentWindow,
              "handleChangeTreeInfoCallback",
              obj
            );
        }
      } else if (messageRes.data.command == "modelFileCreated") {
        var data = {
          MainIUID: messageRes.data.data.menuActive,
          IUID: messageRes.data.data.folderIuid
            ? messageRes.data.data.folderIuid
            : "",
          FileName: messageRes.data.data.fileName,
        };

        var formdata = this.$objectToFormData(data);

        projectFileApi.post("/api/imodel/GetGeneratefilelist", formdata);
      } else if (messageRes.data.command == "VersionFiles") {
        var res = await projectFileApi.post(
          "/api/ProjectManagement/ProjectVersionFileData?IUID=" +
          messageRes.data.data
        );
        if (res.code == 1) {
          this.versionFiles = res.data[0].versionFiles;
          this.versionFilesDialogVisible = true;
        }
      } else if (messageRes.data.cmd == "onloadImodel") {
        this.showImg = false
      } else if (messageRes.data.command === "updateBridge") {
        // let params = new FormData()
        // params.set('Projectiuid', this.projectInfo.iuid)
        //
        // let data = await request.post('/api/Bridgeport/GetSetQueryData', params)
        //
        // obj = {
        //     treeData: this.list,
        //     userId: this.user.userID,
        //     currentProj: this.projectInfo,
        //     currentFile: this.dataModel,
        //     fileOriginalUrl: process.env.BASE_API,
        //     token: this.token,
        //     bridgeList: data.data || []
        // };
        //
        // this.$iframeEditPostMes(
        //     this.$refs.imodelIframe.contentWindow,
        //     this.$route.query.appType,
        //     obj
        // );
      } else if (messageRes.data.command == "showLinkModelDialog") {
        this.linkModel2Dialog = true
        this.linkModelFiles = messageRes.data.data.fileList
        this.openedProject = messageRes.data.data.iuid
      }

      window.opener.postMessage({
        command: messageRes.data.command,
        data: messageRes.data.data
      }, '*');
    },
    // 生成iframe的src,启动imodel
    firstTurnPath() {
      this.showIframe = true;
      let selectFile = this.$route.query.selectFile == 'true' ? '1' : '0'
      console.log(process.env);
      let originUrl = process.env[this.$route.query.appOrigin]
      let query = "path=" + (this.dataModel.turnPath ? this.dataModel.turnPath : 'null') + "&editable=0" + "&selectFile=" + selectFile + (this.$route.query.appOrigin == 'GisIframeOrigin' ? '&type=' : '')
      this.src = this.dataModel && originUrl + '?' + encrypt(encodeURIComponent(query))
    },
    async sendtreeData() {
      let approve = localStorage.getItem('approve')

      if (approve) {
        setTimeout(() => {
          this.imodelAuditCountInfoDialog = true
        }, 1000)

        let CurrentFileStr = localStorage.getItem('CurrentFile')
        let kjApprovalDataStr = localStorage.getItem('kjApprovalData')

        let CurrentFile = JSON.parse(CurrentFileStr)
        let kjApprovalData = JSON.parse(kjApprovalDataStr)

        this.imodelAuditCountInfo = {
          total: kjApprovalData.apprpveInfo.length,
          replied: kjApprovalData.apprpveInfo.filter(item => item.designanswer).length
        }

        this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'CurrentFile', CurrentFile)
        this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'kjApprovalData', kjApprovalData)

        localStorage.removeItem('CurrentFile')
        localStorage.removeItem('kjApprovalData')
        localStorage.removeItem('approve')
      }

      this.dataModel.fileOriginalUrl = process.env.BASE_API
      this.token = local.getToken();
      let obj = {}
      if (this.$route.query.name === 'Bridge Master') {
        let folderiuid
        let currentProject = this.list.find(item => item.fileName === this.projectInfo.projectName)
        if (currentProject && currentProject.children) {
          let curItem = currentProject.children.find(item => item.fileName === '桥梁')
          if (curItem) {
            folderiuid = curItem.iuid
          }
        }
        let params = new FormData()
        params.set('Projectiuid', this.projectInfo.iuid)
        obj = {
          treeData: this.list,
          userId: this.user.userID,
          currentProj: this.projectInfo,
          currentFile: this.dataModel,
          fileOriginalUrl: process.env.BASE_API,
          token: this.token,
          projectIuid: this.projectInfo.iuid,
          folderiuid: folderiuid
        };
      } else {
        obj = {
          treeData: this.list,
          userId: this.user.userID,
          currentProj: this.projectInfo,
          currentFile: this.dataModel,
          fileOriginalUrl: process.env.BASE_API,
          token: this.token
        };
      }
      let _this = this
      this.$iframePostMes(
        _this.$refs.imodelIframe.contentWindow,
        (_this.$route.query.appOrigin == 'GisIframeOrigin' ? 'bimwindows' : 'initData'),
        obj
      );

      let currentProject = this.list.find(item => item.iuid === this.projectInfo.iuid)

      if (currentProject) {
        let shijingFolder = currentProject.children.find(item => item.fileName === '实景' || item.fileName === 'scene');
        this.$iframePostMes(
          this.$refs.imodelIframe.contentWindow,
          "addProjectReality",
          shijingFolder.iuid
        );
        // if (shijingFolder) {
        //   let shijingItem = shijingFolder.children.filter(item => ['.3sm', '.3mx'].includes(item.fileSuffix.toLowerCase()));
        //   let shijingLinkList= []

        //   if (shijingItem) {
        //     for (let i = 0; i < shijingItem.length; i++) {
        //       let res = await request.get('/api/ProjectManagement/livesceneaddresscopy', {
        //         params: {
        //           iuid: shijingItem[i].iuid,
        //         },
        //         errorMsgShow: false
        //       }).catch(() => {})

        //       if (res && res.code ===1) {
        //         let pathItem = [];
        //         res.data.split("\\").forEach((item) => {
        //           pathItem.push(encodeURIComponent(item));
        //         });
        //         res.data = pathItem.join("/");

        //         shijingLinkList.push({ url: process.env.BASE_API + "/" + res.data, name: shijingItem[i].fileName })
        //       }
        //     }

        //     if (shijingLinkList.length) {
        //       this.$iframePostMes(
        //           this.$refs.imodelIframe.contentWindow,
        //           "addProjectReality",
        //           shijingLinkList
        //       );
        //     }
        //   }
        // }
      }
    },


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
    // 关闭
    hiddenIframe() {
      window.close();
    },
  },
};
</script>
<style scoped lang="scss">
.app-main {
  height: 100% !important;
}

.kanban {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;

  position: absolute;
  height: 100%;
  // background: #fff;
  // border: 1px solid #e6e6e6;
  width: 100%;
}

.kanbaniframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}

.wscn-http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;

  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;

    &__parent {
      width: 100%;
    }

    &__child {
      position: absolute;

      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }

      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }

        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }

        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }

        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }

      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }

        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }

        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }

        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }

      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }

        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }

        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }

        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }

  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;

    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }

    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }

      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}

.imodel-audit-count-info-dialog {
  position: fixed;
  z-index: 999;
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: #ffffff;
  width: 220px;
  text-align: center;
  padding: 5px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;

  > div {
    white-space: nowrap;

    &:not(:last-child) {
      margin-right: 15px;
    }
  }
}
</style>
