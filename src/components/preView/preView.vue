<template>
  <!--左侧宽度：60+220+1-->
  <!-- teamworkClientWidth相关代码被注释未生效 ,原代码 =>  (($store.state.app.activeTab == '团队协作') ? $store.state.app.teamworkClientWidth : 'calc(100vw - 61px)')), -->
  <div>
    <div
      v-if="preViewContainerVisible"
      v-show="preViewContainerVisible"
      :style="iframeStyle"
      style="position: fixed; z-index: 1000; background-color: white"
    >
      <div
        v-if="hasTopBar"
        class="iframeheadercopy"
      >
        <div :class="['iframeheader', { updown: isUpdown }]">
          <div style="font-size: 14px;color: #303133;display: flex;align-items: center;">
            <span class="fileName">{{ fileName }}</span>
          </div>
          <div class="flex ai-center">
            <el-button
              v-if="preViewDownloadBtnVisible"
              size="small"
              style="font-size: 12px; margin-right: 5px"
              class="btn-group"
              @click="downLoad"
            >
              <i class="iconfont icon-download" />{{ $t('base.button.download') }}
            </el-button>
            <!-- <el-button size="mini" class="btn-group" @click="copyViewParth" v-if="$modelFileSuffix.indexOf(fileSuffix) > -1"><i class="iconfont icon-share"></i>分享</el-button> -->
            <collectionBtn
              v-if="collectionBtnComVisible"
              class="btn-group"
              style="margin-right: 5px"
              :rows="[preViewContainerData]"
              is-pre-view-mode
            />
            <el-button
              v-if="!isFullScreen"
              size="small"
              type="primary"
              icon="el-icon-full-screen"
              @click="startFullScreen"
            >
              全屏
            </el-button>
            <el-button
              v-else
              size="small"
              type="danger"
              icon="el-icon-full-screen"
              @click="endFullScreen"
            >
              退出全屏
            </el-button>
            <el-link
              style="font-size: 12px; margin-left: 20px"
              @click="hiddenIframe"
            >
              <i class="iconfont icon-shanchu" />
            </el-link>
          </div>
        </div>
      </div>
      <!--div :style="{height: clientHeight - ($modelFileSuffix.concat($ibimFileSuffix).indexOf(fileSuffix) == -1 ? 48 : 0) + 'px', width: '100%' }"-->
      <div :style="{ height: hasTopBar ? 'calc(100% - 48px)' : '100%', width: '100%', }">
        <div
          v-if="modelPreViewContainerVisible || ($modelFileSuffix.concat($ibimFileSuffix).indexOf(fileSuffix) > -1 && !$modelPreViewModeHasVShow)"
          v-show="modelPreViewContainerDisplayVisible || ($modelFileSuffix.concat($ibimFileSuffix).indexOf(fileSuffix) > -1 && !$modelPreViewModeHasVShow)"
          class="iframe"
          style="display: flex;justify-content: center;align-items: center;background-color: #f7f7f7;"
        >
          <iframe
            v-if="$supportWebGL()"
            id="bim-iframe"
            ref="imodelIframe"
            :src="modelPreViewInitUrl"
            class="iframe"
            style="background-color: white"
            @load="sendFileData"
          />
          <div v-else>
            <img :src="notSupportWebGLImg">
          </div>
        </div>
        <div
          v-if="$videoFileSuffix.concat($otherVideoFileSuffix).indexOf(fileSuffix) > -1"
          class="iframe"
        >
          <video
            :src="$videoFileSuffix.indexOf(fileSuffix) > -1 ? videoPath : videoReturnPath"
            controls
            autoplay
            style="width: 100%; height: 100%; background-color: black"
          />
        </div>
        <template
          v-if="$officeFileSuffix.indexOf(fileSuffix) > -1 && (this.$pptFileSuffix.indexOf(fileSuffix) === -1 || (this.$pptFileSuffix.indexOf(fileSuffix) > -1 && !pptFileSizeTooLarge))"
        >
          <div
            v-if="offiecFileSign === 'wps'"
            id="wpsContainer"
            class="iframe"
          >
            <wps :row="preViewContainerData" />
          </div>
          <div
            v-if="offiecFileSign != 'wps'"
            class="iframe"
          >
            <iframe
              :src="officeFilePath"
              class="iframe"
              :class="['xls', 'xlsx'].includes(fileSuffix.toLowerCase()) ? 'officeXlsIframe' : 'officeIframe'"
            />
          </div>
        </template>
        <div
          v-if="fileSuffix === '.pdf' || (this.$pptFileSuffix.indexOf(fileSuffix) > -1 && pptFileSizeTooLarge)"
          class="iframe"
        >
          <!-- <iframe:src="'/static/web/viewer.html?file=' + 'http%3A%2F%2Flocalhost%3A58976%2Fapi%2Fhome%2FGet UploadPictureFileZip%3FfileUrl%3DFiles%255onlineview.pdf'"class="iframe"></iframe> -->
          <iframe
            :src="assetsPath + 'static/web/viewer.html?file=' + encodeURIComponent(fileSuffix === '.pdf' ? filePath : pptTooLargeFilePath)"
            class="iframe"
          />
        </div>
        <div
          v-if="fileSuffix === '.txt'"
          class="iframe"
          style="background-color: white; padding-top: 50px; overflow: auto"
        >
          <div id="txtContainer">
            {{ getTxtText() }}
          </div>
        </div>
        <div
          v-if="$imageFileSuffix.indexOf(fileSuffix) > -1"
          class="iframe"
          style="background-color: white;display: flex;justify-content: center;align-items: center;"
        >
          <img
            :src="filePath"
            style="max-width: 70%; max-height: 70%"
          >
        </div>
      </div>
      <imodelInvokeFunction
        ref="imodelInvokeContainer"
        :row-data="preViewContainerData"
        :is-full-screen.sync="isFullScreen"
        @pageClose="hiddenIframe"
      />
      <linkModel2Dialog
        v-if="linkModel2Dialog"
        :visible.sync="linkModel2Dialog"
        :list="list"
        :link-model-files="linkModelFiles"
        :opened-project="openedProject"
        @linkModelSubmit="linkModelSubmit"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import collectionBtn from "@/components/PreViewAndlistComBtn/collectionButton";
import imodelInvokeFunction from "@/components/imodelInvokeFunction.vue";
import notSupportWebGLImg from "@/assets/webGL支持.png";
import wps from "@/components/wps";
import postGetApi from "@/api/document/indexApi";
import { encrypt } from "@/utils";
import LinkModel2Dialog from "../Dialog/LinkModel2Dialog.vue";
const ddApiRouteNames = ["blueprint", "StandardInfo"];
import projectFileApi from "@/api/document/indexApi.js";
import { decrypt } from "../../utils";
import local from "@/utils/auth";
import request from '@/utils/request'
import store from '@/store'

export default {
  components: {
    LinkModel2Dialog,
    collectionBtn,
    imodelInvokeFunction,
    wps,
  },
  data() {
    return {
      iframeUrl: process.env.VUE_APP_GisIframeOrigin + "/?model=",
      isUpdown: true,
      isFullScreen: false,
      shareDialogVisible: false,
      collectionBtnComVisible: true,
      notSupportWebGLImg: notSupportWebGLImg,
      offiecFileSign: "MicroSoft",
      pptFileSizeTooLarge: false,
      assetsPath: process.env.VUE_APP_ASSET_PATH,
      linkModel2Dialog: false,
      linkModelFiles: [],
      openedProject: "",
      list: [],
    };
  },
  watch: {
    $route() {
      if (this.$route.name == "share") {
        this.collectionBtnComVisible = false;
      }
    },
  },

  async created() {
    if (this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(this.fileSuffix) > -1) {
      if (this.$route.path === '/projectFile') {
        let projectInfo = await store.dispatch('queryRecentlyProject');

        // 模型文件查看日志
        let formData = new FormData();
        formData.append('Filename', this.preViewContainerData.fileName)
        formData.append('projectname', projectInfo.projectName)
        formData.append('logtype', 'ProjectFileviewing')

        request.post('api/Log/AddFileviewing', formData)
      }
    }
  },

  computed: {
    isTeamwork() {
      return this.$route.name == "teamwork";
    },
    ...mapGetters([
      "preViewContainerData",
      "preViewContainerVisible",
      "preViewDownloadBtnVisible",
      "modelPreViewContainerVisible",
      "modelPreViewContainerDisplayVisible",
      "modelPreViewInitUrl",
      "clientHeight",
      "shareMode",
    ]),
    fileName() {
      return this.preViewContainerData
        ? this.preViewContainerData.fileName
        : null;
    },
    hasTopBar() {
      return (
        this.$modelFileSuffix
          .concat(this.$ibimFileSuffix)
          .indexOf(this.fileSuffix) == -1 ||
        (this.$modelFileSuffix
          .concat(this.$ibimFileSuffix)
          .indexOf(this.fileSuffix) > -1 &&
          !this.$supportWebGL())
      );
    },
    iframeStyle() {
      console.log(this.$route.path);
      if (this.$route.path == "/commonBuildLibrary") {
        return {
          top: "calc(10vh + 50px)",
          left: "20vw",
          width: "60vw",
          height: "calc(80vh - 50px)",
          border: "1px solid #ccc;",
        };
      } else if (this.$route.path == "/s") {
        return {
          top: "50px",
          left: "0",
          width: "100vw",
          height: "calc(100vh - 51px)",
          border: "1px solid #ccc;",
        };
      } else if (this.$route.path == "/shareH5") {
        return {
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
        };
      } else {
        return {
          top: "49px",
          left:
            this.$store.state.app.isCollapse && !this.isTeamwork
              ? "281px"
              : "61px",
          width:
            this.$store.state.app.isCollapse && !this.isTeamwork
              ? "calc(100vw - 281px)"
              : "calc(100vw - 61px)",
          height: "calc(100vh - 49px)",
          border: "1px solid #ccc;",
        };
      }
    },
    //video文件转换后路径
    videoReturnPath() {
      return this.preViewContainerData
        ? (ddApiRouteNames.indexOf(this.$route.name) > -1
          ? process.env.VUE_APP_BASE_DDAPI
          : process.env.VUE_APP_BASE_API) +
        "/api/home/GetVideoFile?fileUrl=" +
        encodeURIComponent(encrypt(this.preViewContainerData.turnPath))
        : null;
    },
    videoPath() {
      return this.preViewContainerData
        ? (ddApiRouteNames.indexOf(this.$route.name) > -1
          ? process.env.VUE_APP_BASE_DDAPI
          : process.env.VUE_APP_BASE_API) +
        "/api/home/GetVideoFile?fileUrl=" +
        encodeURIComponent(encrypt(this.preViewContainerData.filePath))
        : null;
    },
    fileSuffix() {
      var fileSuffix = this.preViewContainerData
        ? this.preViewContainerData.fileSuffix.toLowerCase()
        : null;
      return fileSuffix;
    },
    filePath() {
      return this.preViewContainerData
        ? (ddApiRouteNames.indexOf(this.$route.name) > -1
          ? process.env.VUE_APP_BASE_DDAPI
          : process.env.VUE_APP_BASE_API) +
        "/api/home/GetUploadPictureFileZip?IUID=" +
        this.preViewContainerData.iuid +
        "&fileType=" +
        this.preViewContainerData.fileType +
        "&getFileFolderName=" +
        this.preViewContainerData.getFileFolderName
        : null;
    },
    officeFilePath() {
      return (
        "https://view.officeapps.live.com/op/view.aspx?src=" +
        process.env.VUE_APP_BASE_API +
        "/" +
        this.preViewContainerData.filePath
      );
    },
    pptTooLargeFilePath() {
      return this.preViewContainerData
        ? (ddApiRouteNames.indexOf(this.$route.name) > -1
          ? process.env.VUE_APP_BASE_DDAPI
          : process.env.VUE_APP_BASE_API) +
        "/api/home/GetUploadPictureFileZip?IUID=" +
        this.preViewContainerData.iuid +
        "&fileType=" +
        this.preViewContainerData.fileType +
        "&getFileFolderName=" +
        this.preViewContainerData.getFileFolderName
        : null;
    },
  },
  beforeDestroy() {
    document.getElementById("headerPage").style.display = "initial";
  },
  async mounted() {
    if (
      this.$pptFileSuffix.indexOf(this.preViewContainerData.fileSuffix) > -1
    ) {
      this.pptFileSizeTooLarge = this.$pptFileSizeToLarge(
        this.preViewContainerData.fileSize
      );
    }
    this.$iframeListener(this.messageReceived);
  },
  methods: {
    messageReceived(messageRes) {
      if (messageRes.data.command == "showLinkModelDialog") {
        this.linkModel2Dialog = true;
        this.linkModelFiles = messageRes.data.data.fileList;
        this.openedProject = messageRes.data.data.iuid;
      }
    },

    linkModelSubmit(data) {
      this.$iframePostMes(
        this.$refs.imodelIframe.contentWindow,
        "linkModelSubmit",
        data
      );
    },

    async sendFileData() {
      // this.$loading().close()

      this.preViewContainerData.fileOriginalUrl = process.env.VUE_APP_BASE_API;
      if (this.shareMode) {
        this.preViewContainerData.canDownload = this.preViewDownloadBtnVisible;
        this.preViewContainerData.isMobile = true;
      }
      console.log(this.preViewContainerData);
      this.$iframePostMes(
        this.$refs.imodelIframe.contentWindow,
        "CurrentFile",
        this.preViewContainerData
      );

      var projectInfo = {
        iuid: this.$route.query.projectId,
      };

      var obj = {
        treeData: this.$root.list,
        currentProj: projectInfo,
        currentFile: this.preViewContainerData,
        fileOriginalUrl: process.env.VUE_APP_BASE_API,
        token: local.getToken(),
      };
      this.$iframePostMes(
        this.$refs.imodelIframe.contentWindow,
        "bimwindows",
        obj
      );

      let currentProject = this.$root.list.find(item => item.iuid === projectInfo.iuid)
      if (currentProject) {
        let shijingFolder = currentProject.children.find(item => item.fileName === '实景' || item.fileName === 'scene');
        this.$iframePostMes(
          this.$refs.imodelIframe.contentWindow,
          "addProjectReality",
          shijingFolder.iuid
        );
      }
      //   if (shijingFolder) {
      //     let shijingItem = shijingFolder.children.filter(item => ['.3sm', '.3mx', '.3dtiles', '.json'].includes(item.fileSuffix.toLowerCase()));
      //     let shijingLinkList = []
      //     if (shijingItem) {
      //       for (let i = 0; i < shijingItem.length; i++) {
      //         if (['.3sm', '.3mx', '.3dtiles'].includes(shijingItem[i].fileSuffix.toLowerCase())) {
      //           let res = await request.get('/api/ProjectManagement/livesceneaddresscopy', {
      //             params: {
      //               iuid: shijingItem[i].iuid,
      //             },
      //             errorMsgShow: false
      //           }).catch(() => { })
      //           if (res && res.code === 1) {
      //             let pathItem = [];
      //             res.data.split("\\").forEach((item) => {
      //               pathItem.push(encodeURIComponent(item));
      //             });
      //             res.data = pathItem.join("/");
      //             shijingLinkList.push({ url: process.env.VUE_APP_BASE_API + "/" + res.data, name: shijingItem[i].fileName })
      //           }
      //         }else {
      //           shijingLinkList.push({ url: (process.env.VUE_APP_BASE_API + "/" + shijingItem[i].filePath).replace(/\\/g,'/'), name: shijingItem[i].fileName })
      //         }
      //       }
      //       if (shijingLinkList.length) {



      //     }
      //   }
      // }
    },
    getTxtText() {
      var xmlhttp;
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) { }
      }
      if (!xmlhttp) xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          var s = xmlhttp.responseText;
          s = s.replace(/</g, "&lt;");
          s = s.replace(/>/g, "&gt;");
          document.getElementById("txtContainer").innerText = s;
          xmlhttp = null;
        }
      };
      xmlhttp.open("GET", this.filePath, true);
      xmlhttp.send(null);
    },
    downLoad() {
      this.$refs.imodelInvokeContainer.downLoad();
    },
    copyViewParth() {
      this.$refs.imodelInvokeContainer.showShareDialog();
    },
    startFullScreen() {
      this.$refs.imodelInvokeContainer.startFullScreen();
    },
    endFullScreen() {
      this.$refs.imodelInvokeContainer.endFullScreen();
    },
    hiddenIframe() {
      if (document.getElementById("headerPage")) {
        document.getElementById("headerPage").style.display = "initial";
      }
      this.$store.state.app.preViewContainerVisible = false;
      if (this.$store.state.app.modelPreViewContainerDisplayVisible) {
        this.$store.state.app.modelPreViewContainerDisplayVisible = false;
      }
    },
  },
};
</script>
<style scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.officeIframe {
  height: calc(100% + 88px);
  margin-top: -88px;
}

.officeXlsIframe {
  height: calc(100% + 158px);
  margin-top: -158px;
}

.fileName {
  display: inline-block;
  max-width: 700px;
  min-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* font-size: 15px; */
  font-weight: 500;
  color: #888;
  margin-left: 10px;
  /* border: 1px solid rgb(220, 223, 230); */
  padding: 5px;
}

.iframeheader {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  background: #fff;
  overflow: hidden;
  transition: 0.5s ease all;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.04),
    0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  display: flex;
  height: 48px;
}

.iframeheadercopy {
  /* position: absolute; */
  left: 0;
  right: 0;
  height: 48px;
  z-index: 501;
}

/* .iframeheadercopy:hover .iframeheader {
  height: 48px;
} */
.btnContainer {
  width: 238px;
  height: 48px;
  position: fixed;
  bottom: 53px;
  margin: auto auto 0 auto;
  left: 0;
  right: 0;
  top: 0;
}

.squreBtn {
  width: 48px;
  height: 48px;
  border: none;
  background-color: white;
  border-radius: 4px;
  padding: 0;
  margin-right: 5px;
  outline: none;
}

.squreBtnclick {
  color: white;
  background-color: #7c8b9a;
}

.squreBtn:hover {
  font-size: 20.25px;
  color: white;
  background-color: #7c8b9a;
  cursor: pointer;
}

.shareText {
  font-size: 14px;
  color: #3194d0;
  margin-left: 10px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background: transparent;
  width: 100%;
  border: none;
  line-height: 20px;
  height: 109px;
  padding: 0;
  white-space: break-spaces;
  resize: none;
}
</style>
