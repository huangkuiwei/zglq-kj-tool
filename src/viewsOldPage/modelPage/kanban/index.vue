<!-- 现在模型文件都进入了bimiframe 本文件不需修改 -->
<template>
  <div class="kanban">
    <iframe v-if="$supportWebGL() && showIframe" ref="imodelIframe" :src="src" @load="sendtreeData" id="kanbaniframe" class="kanbaniframe"></iframe>

    <div v-if="!$supportWebGL()">
      <img :src="notSupportWebGLImg">
    </div>

    <imodelInvokeFunction :rowData="dataModel" :isFullScreen.sync="isFullScreen" @pageClose="hiddenIframe" ref="imodelInvokeContainer" />

    <div class="wscn-http404-container" v-if="errorPageVisible">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" src="@/assets/errorImg/404.png" alt="404">
          <img class="pic-404__child left" src="@/assets/errorImg/404_cloud.png" alt="404">
          <img class="pic-404__child mid" src="@/assets/errorImg/404_cloud.png" alt="404">
          <img class="pic-404__child right" src="@/assets/errorImg/404_cloud.png" alt="404">
        </div>
        <div class="bullshit">
          <div class="bullshit__headline">当前项目中不包含模型文件。。。</div>
          <div class="bullshit__info">请重新选择项目，并再次进入本界面。</div>
        </div>
      </div>
    </div>

    <versionFilesDialog :dialogVisibleProp.sync="versionFilesDialogVisible" :versionFiles="versionFiles" @versionFilesCallBack="versionFilesCallBack" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import projectFileApi from "@/api/document/indexApi.js";
import projectFileListApi from "@/api/project/file";    // 注意和上一个区别
import imodelInvokeFunction from '@/components/imodelInvokeFunction';
import notSupportWebGLImg from "@/assets/webGL支持.png";
import versionFilesDialog from "@/components/DeleteRemindAndImodelVersions/imodelVersionFiles";
import { decrypt } from '@/utils'



export default {
  components: {
    imodelInvokeFunction,
    versionFilesDialog
  },
  computed: {
    ...mapGetters([
      "clientHeight",
      "currApp"
    ])
  },
  data() {
    return {
      src: '',
      showIframe: false,
      dataModel: null,  //数据模型,各功能数据依赖此对象
      isFullScreen: false,
      list: null,
      listdata: null,
      projectInfo: null,
      notSupportWebGLImg: notSupportWebGLImg,
      errorPageVisible: false,
      versionFilesDialogVisible: false,
      versionFiles: []
    }
  },
  watch: {
    isFullScreen() {
      if (this.isFullScreen) {
        document.getElementById("headerPage").style.display = "none";
      }
      else {
        document.getElementById("headerPage").style.display = "none";
        // document.getElementById("headerPage").style.display = "initial";
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
    window.addEventListener('unload', e => this.unloadHandler(e))

    document.title = this.$route.query.name;
    localStorage.setItem(document.title, JSON.stringify(this.$route.path));

    document.getElementById('headerPage').style.display = "none"
    this.$iframeListener(this.messageReceived);
    //this.queryData()
    //20220916修改：获取列表当前行文件的iuid
    this.queryData(this.$route.query.iuid)
  },

  beforeDestroy() {
    localStorage.setItem(document.title, null);
    document.getElementById('headerPage').style.display = "initial"
    this.$removeIframeListener(this.messageReceived);
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
    window.removeEventListener('unload', e => this.unloadHandler(e));
     alert("destroyed")
    localStorage.setItem(document.title, null);

  },
  methods: {
    beforeunloadHandler(e) {
      console.log('关闭窗口之后')
      localStorage.setItem(document.title, null);

    },
    unloadHandler(e) {
      console.log('关闭窗口之后')
      localStorage.setItem(document.title, null);

    },
    versionFilesCallBack(data) {
      console.log(data)
      this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'versionFiles', data)
    },
    async messageReceived(messageRes) {
      if (messageRes.data.command == "handleChangeTreeInfo") {
        var res = await projectFileApi.post(
          "/api/Noticeboard/GetlazyProjectFileTree?IUID=" + messageRes.data.Data.iuid
        );

        if (res.code == 1) {
          var obj = { iuid: messageRes.data.Data.iuid, positionTree: messageRes.data.Data.positionTree, appendData: res.data }
          this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'handleChangeTreeInfoCallback', obj)
        }
      }
      else if (messageRes.data.command == "modelFileCreated") {
        var data = {
          MainIUID: messageRes.data.data.menuActive,
          IUID: messageRes.data.data.folderIuid ? messageRes.data.data.folderIuid : "",
          FileName: messageRes.data.data.fileName
        }

        var formdata = this.$objectToFormData(data)

        projectFileApi.post("/api/imodel/GetGeneratefilelist", formdata)
      }
      else if (messageRes.data.command == "VersionFiles") {
        var res = await projectFileApi.post(
          "/api/ProjectManagement/ProjectVersionFileData?IUID=" + messageRes.data.data
        );
        if (res.code == 1) {
          this.versionFiles = res.data[0].versionFiles
          this.versionFilesDialogVisible = true
        }
      }
    },
    firstTurnPath() {
      this.showIframe = true
      this.src = this.dataModel && (process.env.GisIframeOrigin + "/?" + encodeURIComponent(this.dataModel.turnPath))
    },
    async sendtreeData() {
      //var obj = {treeData:this.initTreeList,currentProj:this.projectInfo,currentFile:this.dataModel}

      var obj = { treeData: this.list, currentProj: this.projectInfo, currentFile: this.dataModel, fileOriginalUrl: process.env.BASE_API }
      this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'treeData', obj)
    },
    async queryData(iuid) {
      var res = await projectFileApi.post(
        "/api/Noticeboard/GetProject",
        {}
      );
      if (res.code) {
        this.options = res.data
        var projectInfo = JSON.parse(localStorage.getItem('projectInfo'))
        if (projectInfo != null) {
          this.projectInfo = projectInfo
          this.changeValue = projectInfo.iuid
        } else {
          this.projectInfo = this.options[0]
          this.changeValue = this.options[0].iuid
        }

        if (iuid == null || iuid == "" || iuid == "undefined") {
          //项目主文件的iuid
          this.queryTree(this.changeValue, 0)
        } else {
          //20220916修改：获取列表当前行文件的iuid
          this.queryTree(iuid, 1)
        }
      }
    },
    async queryInitTree(projectId) {
      var masterFileRes = await projectFileApi.post(
        "/api/ProjectManagement/GetALLMasterfileData?IUID=" + projectId,
      );

      if (masterFileRes.code == 1) {
        this.dataModel = masterFileRes.data.find(item => item.masterfilebit)
        var projectTree = masterFileRes.data.filter(item => item.parentlevel == 'T0')
        var makeupTree = (project) => {
          var childList = masterFileRes.data.filter(item => item.parentlevel == project.childlevel)
          if (childList && childList.length > 0) {
            project.children = childList
            childList.forEach(item => {
              makeupTree(item)
            })
          }
          else {
            return false
          }
        }

        projectTree.forEach(item => {
          makeupTree(item)
        })

        this.initTreeList = projectTree

        //console.log(JSON.stringify(projectTree))
        //this.firstTurnPath()
      }
    },

    transTreeData(data) {
      data.filePath = decrypt(data.filePath || '')
      data.turnPath = decrypt(data.turnPath || '')

      if (data.children && data.children.length) {
        data.children.forEach(item => {
          this.transTreeData(item)
        })
      }
    },

    async queryTree(iuid, type) {
      var url = "";
      var res;
      var firstNode = null
      if(this.projectInfo.projectName == "文档资料") {  // 文档资料中没有主文件，所以获得所有模型文件后取一个
        var allres = await projectFileListApi.queryFileListByProjectId({
            iuid: this.projectInfo.iuid,
            });
           //iuid:文件夹的id
        var formData = new FormData();
        formData.append("IUID", "");
        formData.append("MainIUID", allres.data[0].iuid);  // 得到"模型"中所有文件
        formData.append("page", 1);     // 后面查询函数好像必须要这个
        formData.append("rows", 20);
        res = await projectFileListApi.queryFileListByFileId(formData);
              //20220916修改：获取列表当前行文件的iuid
        url = "/api/ProjectManagement/GetMasterfileData?IUID=" + this.projectInfo.iuid + '&FileIUID=' + res.data[0].iuid;  // 得到第一个文件的数据
        res = await projectFileApi.post(url);
        firstNode = res.data;
      }
      if (type == 0) {
          url = "/api/Noticeboard/GetProjectFileTree"
      } else {
          //20220916修改：获取列表当前行文件的iuid
          url = "/api/Noticeboard/GetProjectFileTree?IUID=" + iuid
      }
      res = await projectFileApi.post(url);
      if (res.code) {
        res.data.forEach(item => {
          this.transTreeData(item)
        })
        this.list = res.data              // YGP：应该是得到了所有项目（或指定项目）的文件目录
        var _self = this


        if(!firstNode) {
          function getturnPath1(node) {
            for (var i = 0; i < node.length; i++) {
              if (node[i].turnPath && node[i].turnPath == "") {
                getturnPath1(node[i].children)
              }
              else {
                if (_self.$modelFileSuffix.indexOf(node[i].fileSuffix) > -1) {
                  firstNode = node[i]
                  break;
                }
              }
            }
          }
          var firstProjectTree;
          this.list.forEach(item => {
            if (item.iuid == this.projectInfo.iuid) {
              firstProjectTree = item
             }
          });
          if (type == 0) {
            url = "/api/ProjectManagement/GetMasterfileData?IUID=" + this.projectInfo.iuid
          } else {
            //20220916修改：获取列表当前行文件的iuid
            url = "/api/ProjectManagement/GetMasterfileData?IUID=" + this.projectInfo.iuid + '&FileIUID=' + iuid
          }
          var masterFileRes = await projectFileApi.post(url);
          if (masterFileRes.code == 1) {
            firstNode = masterFileRes.data
          }
          else {
            getturnPath1([firstProjectTree])
          }
        }

        if (!firstNode) {
          this.errorPageVisible = true
          document.getElementById('headerPage').style.display = "initial"
          return
        }

        this.dataModel = firstNode
        this.firstTurnPath(firstNode)
      }
    },
    hiddenIframe() {
      window.close();
      /*
      this.$router.replace({
        path: "/projectFile",
        query: {
          projectId: this.projectInfo.iuid,
          projectName: this.projectInfo.projectName,
          projectIsPictureMode: true,
          path: '/all'
        },
      });*/
    }
  }
}
</script>
<style scoped lang='scss'>
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
  border: 1px solid #e6e6e6;
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
</style>

