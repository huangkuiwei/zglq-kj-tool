<template>
  <div class="model-iframe-content">
    <iframe
      @load="sendFileData('imodelIframe1', rowData)"
      ref="imodelIframe1"
      :src="modelLoadUrl"
      frameborder="0"
    ></iframe>
    <div class="menu-btn">
      <el-button v-show="showMenuBtn" type="primary" @click="clearIsolateSelectedElement">取消突显</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "modelFileCheckIframe",

  props: {
    isSmallSize: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      baseUrl: process.env.ViewOrigin,
      showMenuBtn: false,
    };
  },

  created() {
    this.$iframeListener((res) => {
      if (res.data.command === "ImodelClose") {
        this.$emit("update:modelComparisonDialog", false);
      }

      if (res.data.command === "beforeImodelClose") {
        this.$iframePostMes(
          this.$refs.imodelIframe1.contentWindow,
          "ImodelClose",
          null
        );
      }
    });
  },

  computed: {
    isCollapse() {
      let flag = false;
      flag = this.$store.state.app.isCollapse;
      return !flag;
    },
    modelLoadUrl() {
      let path = this.rowData.turnPath?this.rowData.turnPath:this.rowData.filePath;
      return (
        this.baseUrl +
        "/?" + this.$turnEncryptParams(path, 'forViewBim', "1")
      );
    },
  },

  methods: {
    closeModel() {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "ImodelClose",
        null
      );
    },
    getAllStandard() {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "getAllStandard",
        null
      );
    },
    setCheckStandard(stdName) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "setStandard",
        {stdName}
      );
    },
    // 文件检查
    checkModelFile(formSearchData) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "fileModelCheck",
        {
          ...this.rowData,
          ...formSearchData,
        }
      );
    },
    // 获取上次检查数据
    getLastCheckData(formSearchData) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "lastfileModelCheckResult",
        {
          ...this.rowData,
          ...formSearchData,
        }
      );
    },
    // 定位构件
    locateModelByIds(id) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "LocationElementByIds",
        [id]
      );
    },
    // 突显
    isolateSelectedElement(id) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "locationIsolateElementByIds",
        [id]
      );
      this.showMenuBtn = true;
    },
    // 取消突显
    clearIsolateSelectedElement() {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "clearLocationIsolateElementByIds",
        null
      );
      this.showMenuBtn = false;
    },
    sendFileData(imodelIframe, row) {
      this.$iframePostMes(
        this.$refs[imodelIframe].contentWindow,
        "CurrentFile",
        row
      );
      this.$iframePostMes(
        this.$refs[imodelIframe].contentWindow,
        "readonly",
        null
      );
      this.$iframePostMes(
        this.$refs[imodelIframe].contentWindow,
        "hideBackBtn",
        null
      );
      this.$emit('modelLoaded');
    },
  },
};
</script>

<style scoped lang="scss">
.model-iframe-content {
  width: 100%;
  height: 100%;
  position: relative;

  iframe {
    width: 100%;
    height: 100%;
  }

  .menu-btn {
    position: absolute;
    top: 12px;
    left: 60px;
  }
}
</style>
