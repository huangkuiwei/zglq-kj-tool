<template>
  <shareDialog
    :rowData="rowDataState"
    :visible.sync="shareDialogVisible"
    v-if="shareDialogVisible"
  />
</template>

<script>
import shareDialog from "@/components/Share/shareDialog";
import request from "@/utils/request";

export default {
  components: {
    shareDialog,
  },
  props: {
    rowData: {
      type: Object,
      default: null,
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    rowData: {
      handler(newValue, oldValue) {
        var rowDataJsonStr = JSON.stringify(this.rowData);
        this.rowDataState = JSON.parse(rowDataJsonStr);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      shareDialogVisible: false,
      isFullScreenState: false, //组件私有全屏状态属性
      rowDataState: null, //组件私有模型数据属性，所有功能操作依赖此属性
    };
  },
  mounted() {
    this.$iframeListener(this.messageReceived);
  },
  beforeDestroy() {
    this.$removeIframeListener(this.messageReceived);
  },
  methods: {
    async messageReceived(res) {
      if (res.data.command == "ImodelClose") {
        this.$emit("pageClose");
      } else if (res.data.command == "Download") {
        this.downLoad();
      } else if (res.data.command == "Share") {
        this.showShareDialog();
      } else if (res.data.command == "FullScreen") {
        this.isFullScreenState = !this.isFullScreenState;
        if (this.isFullScreenState) {
          this.startFullScreen();
        } else {
          this.endFullScreen();
        }
      } else if (res.data.command == "ModelChange") {
        this.rowDataState = res.data.data;
      } else if (res.data.command == "modelFileCreated2") {
        const params = {
          IUID: res.data.data.iuid,
          FileName: res.data.data.fileName,
        };
        await request.post(
          "/api/imodel/imodelFileobjadd",
          this.$objectToFormData(params)
        );
        // 更新数据
        this.$store.dispatch("SETSignalRTableData", res);
      } else if (res.data.command == "modelFileCreated3") {
        const params = {
          IUID: res.data.data.iuid,
          FileName: res.data.data.fileName,
        };
        await request.post(
          "/api/imodel/imodelfolderadd",
          this.$objectToFormData(params)
        );
        // 更新数据
        this.$store.dispatch("SETSignalRTableData", res);
      }
    },
    downLoad() {
      if (typeof this.rowDataState.fullPath == "undefined") {
        this.rowDataState.fullPath = "";
      }
      this.rowDataState.fullPath =
        this.$route.name == "board" ? "看板" : this.rowDataState.fullPath;
      this.$downloadFile(this.rowDataState, this);
    },
    showShareDialog() {
      this.shareDialogVisible = true;
    },
    startFullScreen() {
      var docElm = document.documentElement;
      //W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }

      this.$emit("update:isFullScreen", true); //解决父页面中获取到全屏属性后的逻辑处理    文件预览容器：更改按钮状态（全屏与取消全屏之间切换）   看板页面： 特殊隐藏显示系统navbar
    },
    endFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      this.$emit("update:isFullScreen", false);
    },
  },
};
</script>
